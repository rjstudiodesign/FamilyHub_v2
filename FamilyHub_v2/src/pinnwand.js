// pinnwand.js – Modul für die Pinnwand mit Firestore-Integration
// KORRIGIERTE IMPORTE

import { 
    db,
    collection,
    query,
    onSnapshot,
    updateDoc,
    doc,
    orderBy,
    addDoc,
    serverTimestamp 
} from './firebase.js'; // <-- ALLE Firebase-Funktionen kommen jetzt von hier
import { getCurrentUser } from './auth.js';

let columns = [];
let draggedCard = null;
let draggedFromColumn = null;
let unsubscribeTasks = null;

const COLUMN_DEFS = [
  { id: 'todo', title: 'To Do' },
  { id: 'inprogress', title: 'In Arbeit' },
  { id: 'done', title: 'Erledigt' }
];

export function renderPinnwand(listeners) {
  if (listeners.pinnwand) listeners.pinnwand(); // Alten Listener bereinigen
  draggedCard = null;
  draggedFromColumn = null;

  const { currentFamilyId } = getCurrentUser();
  if (!currentFamilyId) {
      showEmptyState(document.getElementById('app-content'), "Keine Familie geladen");
      return;
  }

  const tasksRef = collection(db, 'families', currentFamilyId, 'tasks'); // NEU: Korrekter Pfad
  const q = query(tasksRef, orderBy('createdAt', 'asc'));
  
  unsubscribeTasks = onSnapshot(q, (snapshot) => {
    const allTasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    columns = COLUMN_DEFS.map(col => ({
      ...col,
      cards: allTasks.filter(task => task.status === col.id)
    }));
    renderPinnwandDOM();
  }, (error) => {
      console.error("Pinnwand-Fehler:", error);
      showEmptyState(document.getElementById('app-content'), "Aufgaben konnten nicht geladen werden.");
  });

  if (listeners) listeners.pinnwand = unsubscribeTasks;
}


function renderPinnwandDOM() {
  const appContent = document.getElementById('app-content');
  if (!appContent) return;

  const allEmpty = columns.every(col => !col.cards || col.cards.length === 0);
  if (allEmpty) {
    showEmptyState(appContent, "Noch keine Aufgaben", "Lege die erste Aufgabe an, um die Pinnwand zu nutzen.");
    if (typeof lucide !== 'undefined') lucide.createIcons();
    return;
  }

  appContent.innerHTML = `
    <div class="flex gap-6 overflow-x-auto py-4">
      ${columns.map(col => `
        <div class="pinnwand-column min-w-[300px] flex-1" data-column="${col.id}">
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-bold text-lg text-text-main flex items-center gap-2">
              ${col.title}
              <span class="inline-block bg-background-glass text-xs px-2 py-0.5 rounded-full ml-1 count-${col.id}">${col.cards.length}</span>
            </h2>
            <button class="add-task-btn btn-secondary !p-2 !rounded-full" data-column="${col.id}" title="Neue Aufgabe hinzufügen">
                <i data-lucide="plus" class="w-5 h-5"></i>
            </button>
          </div>
          <div class="pinnwand-cards flex flex-col gap-4 min-h-[80px]" data-column-id="${col.id}">
            ${col.cards.map(card => `
              <div class="pinnwand-card" draggable="true" data-card-id="${card.id}">${card.text || card.title}</div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;
  
  document.querySelectorAll('.pinnwand-card').forEach(cardEl => {
    cardEl.addEventListener('dragstart', onDragStart);
    cardEl.addEventListener('dragend', onDragEnd);
  });
  document.querySelectorAll('.pinnwand-cards').forEach(colEl => { // Ziel sind die Kartenlisten
    colEl.addEventListener('dragover', onDragOver);
    colEl.addEventListener('drop', onDrop);
    colEl.addEventListener('dragleave', onDragLeave);
  });
  document.querySelectorAll('.add-task-btn').forEach(btn => {
    btn.addEventListener('click', onAddTaskClick);
  });
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function showEmptyState(container, title = "Noch keine Aufgaben", message = "Lege die erste Aufgabe an, um die Pinnwand zu nutzen.") {
  container.innerHTML = `
    <div class="flex flex-col items-center justify-center h-[60vh] text-center">
      <div class="glass-premium p-8 max-w-md mx-auto">
        <i data-lucide="inbox" class="w-12 h-12 text-text-secondary mx-auto mb-4"></i>
        <h2 class="text-2xl font-bold mb-2 text-text-main">${title}</h2>
        <p class="text-text-secondary mb-4">${message}</p>
        <button class="add-task-btn btn-premium" data-column="todo">
            <i data-lucide="plus" class="w-5 h-5 mr-2"></i> Aufgabe anlegen
        </button>
      </div>
    </div>
  `;
  const btn = container.querySelector('.add-task-btn');
  if (btn) btn.addEventListener('click', onAddTaskClick);
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

async function onAddTaskClick(e) {
  const colId = e.currentTarget.dataset.column;
  const text = prompt('Neue Aufgabe: Was soll erledigt werden?');
  
  if (text && text.trim()) {
    try {
      const { currentFamilyId } = getCurrentUser();
      await addDoc(collection(db, 'families', currentFamilyId, 'tasks'), { // NEU: Korrekter Pfad
        text: text.trim(),
        status: colId,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      alert('Fehler beim Anlegen der Aufgabe.');
      console.error(err);
    }
  }
}

// --- Drag & Drop Logik ---
function onDragStart(e) {
  draggedCard = e.target;
  draggedFromColumn = e.target.closest('.pinnwand-cards').dataset.columnId;
  e.target.classList.add('dragging');
  setTimeout(() => e.target.classList.add('invisible'), 0);
}

function onDragEnd(e) {
  e.target.classList.remove('dragging', 'invisible');
  draggedCard = null;
  draggedFromColumn = null;
  removeAllDragOver();
}

function onDragOver(e) {
  e.preventDefault();
  const column = e.target.closest('.pinnwand-cards');
  if (column) {
    removeAllDragOver();
    column.classList.add('drag-over');
  }
}

function onDragLeave(e) {
    const column = e.target.closest('.pinnwand-cards');
    if (column) {
        column.classList.remove('drag-over');
    }
}

async function onDrop(e) {
  e.preventDefault();
  const column = e.target.closest('.pinnwand-cards');
  if (!column || !draggedCard) {
    removeAllDragOver();
    return;
  }
  
  const newStatus = column.dataset.columnId;
  const cardId = draggedCard.dataset.cardId;

  if (draggedFromColumn !== newStatus) {
    // Optimistisches UI-Update: Karte sofort verschieben
    column.appendChild(draggedCard);
    
    // Status in Firestore aktualisieren
    try {
        const { currentFamilyId } = getCurrentUser();
        const taskRef = doc(db, 'families', currentFamilyId, 'tasks', cardId); // NEU: Korrekter Pfad
        await updateDoc(taskRef, {
            status: newStatus
        });
    } catch (err) {
        console.error("Fehler beim Aktualisieren des Task-Status:", err);
        // Rollback (oder Neuladen erzwingen)
        renderPinnwand({ pinnwand: unsubscribeTasks }); 
    }
  }
  removeAllDragOver();
}

function removeAllDragOver() {
  document.querySelectorAll('.pinnwand-cards').forEach(c => c.classList.remove('drag-over'));
}
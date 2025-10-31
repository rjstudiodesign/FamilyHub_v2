
// pinnwand.js – Modul für die Pinnwand mit Firestore-Integration
import { db } from './firebase.js';
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  orderBy,
  addDoc,
  serverTimestamp
} from 'https://esm.sh/firebase/firestore';

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
  // Listener aufräumen, falls vorhanden
  if (unsubscribeTasks) unsubscribeTasks();
  draggedCard = null;
  draggedFromColumn = null;

  // Firestore: Tasks in Echtzeit laden
  const tasksRef = collection(db, 'tasks');
  const q = query(tasksRef, orderBy('createdAt', 'asc'));
  unsubscribeTasks = onSnapshot(q, (snapshot) => {
    // Tasks nach Status sortieren
    const allTasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    columns = COLUMN_DEFS.map(col => ({
      ...col,
      cards: allTasks.filter(task => task.status === col.id)
    }));
    renderPinnwandDOM();
  });
  // Listener-Objekt für SPA-Architektur
  if (listeners) listeners.pinnwand = unsubscribeTasks;
}


function renderPinnwandDOM() {
  const appContent = document.getElementById('app-content');
  if (!appContent) return;

  // Prüfe, ob alle Spalten leer sind
  const allEmpty = columns.every(col => !col.cards || col.cards.length === 0);
  if (allEmpty) {
    showEmptyState(appContent);
    return;
  }

  appContent.innerHTML = `
    <div class="flex gap-6 overflow-x-auto py-4">
      ${columns.map(col => `
        <div class="pinnwand-column min-w-[260px] flex-1" data-column="${col.id}">
          <div class="flex items-center justify-between mb-2">
            <h2 class="font-bold text-lg text-zinc-100 flex items-center gap-2">
              ${col.title}
              <span class="inline-block bg-zinc-700/70 text-xs px-2 py-0.5 rounded-full ml-1 count-${col.id}">${col.cards.length}</span>
            </h2>
            <button class="add-task-btn px-2 py-1 rounded-lg bg-fuchsia-700/80 hover:bg-fuchsia-600/90 text-white text-xs font-semibold transition" data-column="${col.id}" title="Neue Aufgabe hinzufügen">+</button>
          </div>
          <div class="pinnwand-cards flex flex-col gap-4 min-h-[80px]">
            ${col.cards.map(card => `
              <div class="pinnwand-card" draggable="true" data-card="${card.id}">${card.text || card.title}</div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;
  // Drag & Drop Events
  document.querySelectorAll('.pinnwand-card').forEach(cardEl => {
    cardEl.addEventListener('dragstart', onDragStart);
    cardEl.addEventListener('dragend', onDragEnd);
  });
  document.querySelectorAll('.pinnwand-column').forEach(colEl => {
    colEl.addEventListener('dragover', onDragOver);
    colEl.addEventListener('drop', onDrop);
    colEl.addEventListener('dragleave', onDragLeave);
  });
  // Neue Aufgabe-Buttons
  document.querySelectorAll('.add-task-btn').forEach(btn => {
    btn.addEventListener('click', onAddTaskClick);
  });
}

function showEmptyState(container) {
  container.innerHTML = `
    <div class="flex flex-col items-center justify-center h-[60vh] text-center">
      <div class="glass-premium p-8 max-w-md mx-auto">
        <i data-lucide="inbox" class="w-12 h-12 text-zinc-400 mb-4"></i>
        <h2 class="text-2xl font-bold mb-2 text-text-main">Noch keine Aufgaben</h2>
        <p class="text-text-secondary mb-4">Lege die erste Aufgabe an, um die Pinnwand zu nutzen.</p>
        <button class="add-task-btn btn-premium" data-column="todo">+ Aufgabe anlegen</button>
      </div>
    </div>
  `;
  // Add-Task-Button auch im Empty State aktivieren
  const btn = container.querySelector('.add-task-btn');
  if (btn) btn.addEventListener('click', onAddTaskClick);
}

// Handler für "Neue Aufgabe"-Button
async function onAddTaskClick(e) {
  const colId = e.currentTarget.dataset.column;
  const text = prompt('Neue Aufgabe: Was soll erledigt werden?');
  if (text && text.trim()) {
    try {
      await addDoc(collection(db, 'tasks'), {
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

function onDragStart(e) {
  const cardId = e.target.dataset.card;
  draggedCard = cardId;
  draggedFromColumn = getColumnIdByCard(cardId);
  e.target.classList.add('dragging');
  setTimeout(() => e.target.classList.add('invisible'), 0);
}

function onDragEnd(e) {
  e.target.classList.remove('dragging', 'invisible');
  draggedCard = null;
  draggedFromColumn = null;
  removeAllDragOver();
}


// pinnwand.js – Modul für die Pinnwand mit Firestore-Integration
// KORRIGIERTE VERSION (Integriert mit ui.js)

import { 
    db, collection, query, onSnapshot, updateDoc, 
    doc, orderBy, addDoc, serverTimestamp 
} from './firebase.js';
import { getCurrentUser } from './auth.js';
import { openModal, closeModal, showNotification, showButtonSpinner, hideButtonSpinner } from './ui.js';
import { Card, EmptyStateCard } from './components/Card.js';
import { render } from './components/index.js';

let columns = [];
let draggedCard = null;
let draggedFromColumn = null;

const COLUMN_DEFS = [
  { id: 'todo', title: 'To Do' },
  { id: 'inprogress', title: 'In Arbeit' },
  { id: 'done', title: 'Erledigt' }
];

export function renderPinnwand(listeners) {
  if (listeners.pinnwand) listeners.pinnwand();
  draggedCard = null;
  draggedFromColumn = null;

  const { currentFamilyId } = getCurrentUser();
  if (!currentFamilyId) {
      render(EmptyStateCard('Fehler', 'Keine Familie geladen.', '!', ''), document.getElementById('app-content'));
      return;
  }

  const tasksRef = collection(db, 'families', currentFamilyId, 'pinnwand'); // Korrekter Pfad
  const q = query(tasksRef, orderBy('createdAt', 'asc'));
  
  listeners.pinnwand = onSnapshot(q, (snapshot) => {
    const allTasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    columns = COLUMN_DEFS.map(col => ({
      ...col,
      cards: allTasks.filter(task => task.status === col.id)
    }));
    renderPinnwandDOM();
  }, (error) => {
      console.error("Pinnwand-Fehler:", error);
      render(EmptyStateCard('Fehler', 'Aufgaben konnten nicht geladen werden.', '!', ''), document.getElementById('app-content'));
  });
}

function renderPinnwandDOM() {
  const appContent = document.getElementById('app-content');
  if (!appContent) return;

  const allEmpty = columns.every(col => !col.cards || col.cards.length === 0);
  if (allEmpty) {
      const emptyBtn = `<button class="cta-primary-glow" onclick="window.openCreateTaskModal('todo')">
                          <i data-lucide="plus" class="w-5 h-5 mr-2"></i> Aufgabe anlegen
                       </button>`;
      render(EmptyStateCard("Noch keine Aufgaben", "Lege die erste Aufgabe an, um die Pinnwand zu nutzen.", 'inbox', emptyBtn), appContent);
      if (typeof lucide !== 'undefined') lucide.createIcons();
      return;
  }

  appContent.innerHTML = `
    <div class="flex gap-4 lg:gap-6 overflow-x-auto py-4">
      ${columns.map(col => `
        <div class="pinnwand-column" data-column="${col.id}">
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-bold text-lg text-white flex items-center gap-2">
              ${col.title}
              <span class="inline-block bg-white/10 text-xs px-2 py-0.5 rounded-full ml-1">${col.cards.length}</span>
            </h2>
            <button class="btn-icon-ghost" onclick="window.openCreateTaskModal('${col.id}')" title="Neue Aufgabe hinzufügen">
                <i data-lucide="plus" class="w-5 h-5"></i>
            </button>
          </div>
          <div class="pinnwand-cards" data-column-id="${col.id}">
            ${col.cards.map(card => `
              <div class="pinnwand-card" draggable="true" data-card-id="${card.id}">${card.text}</div>
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
  document.querySelectorAll('.pinnwand-cards').forEach(colEl => {
    colEl.addEventListener('dragover', onDragOver);
    colEl.addEventListener('drop', onDrop);
    colEl.addEventListener('dragleave', onDragLeave);
  });
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// --- MODAL STATT PROMPT ---
if (!window.openCreateTaskModal) {
    window.openCreateTaskModal = (status) => {
        const modalId = 'modal-create-task';
        const modalContent = `
            <form id="create-task-form" class="space-y-4">
                <h2 class="text-2xl font-bold text-gradient mb-6">Neue Aufgabe</h2>
                <div>
                    <label for="task-text" class="form-label text-sm text-secondary mb-1 block">Was soll erledigt werden?</label>
                    <textarea id="task-text" name="task-text" class="form-input" rows="3" required></textarea>
                </div>
                <div class="flex justify-end gap-3 pt-6 border-t border-border-glass">
                    <button type="button" class="btn-secondary" data-action="close-modal">Abbrechen</button>
                    <button type="submit" id="create-task-submit" class="cta-primary-glow">
                        <span class="btn-text">Aufgabe erstellen</span>
                    </button>
                </div>
            </form>
        `;
        openModal(Card(modalContent, { variant: 'premium', className: 'max-w-md w-full' }), modalId);
        if (typeof lucide !== 'undefined') lucide.createIcons();
        
        document.getElementById('create-task-form').onsubmit = async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('create-task-submit');
            showButtonSpinner(submitBtn);
            const text = document.getElementById('task-text').value;

            if (text && text.trim()) {
                try {
                    const { currentFamilyId } = getCurrentUser();
                    await addDoc(collection(db, 'families', currentFamilyId, 'pinnwand'), {
                        text: text.trim(),
                        status: status,
                        createdAt: serverTimestamp()
                    });
                    closeModal(modalId);
                    showNotification("Aufgabe erstellt!", "success");
                } catch (err) {
                    showNotification('Fehler beim Anlegen der Aufgabe.', 'error');
                    console.error(err);
                } finally {
                    hideButtonSpinner(submitBtn);
                }
            } else {
                  hideButtonSpinner(submitBtn);
            }
        };
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
    e.target.closest('.pinnwand-cards')?.classList.remove('drag-over');
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
    column.appendChild(draggedCard); // Optimistisches Update
    try {
        const { currentFamilyId } = getCurrentUser();
        const taskRef = doc(db, 'families', currentFamilyId, 'pinnwand', cardId);
        await updateDoc(taskRef, { status: newStatus });
    } catch (err) {
        console.error("Fehler beim Aktualisieren:", err);
        renderPinnwand({ pinnwand: listeners.pinnwand }); // Rollback
    }
  }
  removeAllDragOver();
}
function removeAllDragOver() {
  document.querySelectorAll('.pinnwand-cards').forEach(c => c.classList.remove('drag-over'));
}


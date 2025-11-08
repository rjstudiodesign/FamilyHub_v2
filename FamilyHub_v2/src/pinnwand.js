// pinnwand.js – Modul für die Pinnwand mit Firestore-Integration
// KORRIGIERTE VERSION (Integriert mit ui.js)

import { 
    db, collection, query, onSnapshot, updateDoc, 
    doc, orderBy, addDoc, serverTimestamp, 
    increment // NEU: Für die Punktevergabe
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

  // Initiales DOM-Layout rendern, bevor Daten geladen werden
  renderInitialPinnwandDOM();

  const tasksRef = collection(db, 'families', currentFamilyId, 'pinnwand');
  const q = query(tasksRef, orderBy('createdAt', 'asc'));
  
  listeners.pinnwand = onSnapshot(q, (snapshot) => {
    if (snapshot.empty) {
        const appContent = document.getElementById('app-content');
        const emptyBtn = `<button class="cta-primary-glow" onclick="window.openCreateTaskModal('todo')">
                            <i data-lucide="plus" class="w-5 h-5 mr-2"></i> Aufgabe anlegen
                         </button>`;
        render(EmptyStateCard("Noch keine Aufgaben", "Lege die erste Aufgabe an, um die Pinnwand zu nutzen.", 'inbox', emptyBtn), appContent);
        if (typeof lucide !== 'undefined') lucide.createIcons();
        return;
    }

    snapshot.docChanges().forEach(change => {
        const task = { id: change.doc.id, ...change.doc.data() };
        const taskElementId = `task-${task.id}`;
        const existingElement = document.getElementById(taskElementId);

        if (change.type === "added") {
            const targetColumn = document.querySelector(`.pinnwand-cards[data-column-id="${task.status}"]`);
            if (targetColumn) {
                const newTaskElement = createTaskElement(task);
                targetColumn.appendChild(newTaskElement);
            }
        }
        if (change.type === "modified") {
            if (existingElement) {
                // Wenn sich der Status geändert hat, verschiebe das Element
                if (existingElement.parentElement.dataset.columnId !== task.status) {
                    const newColumn = document.querySelector(`.pinnwand-cards[data-column-id="${task.status}"]`);
                    if (newColumn) {
                        newColumn.appendChild(existingElement);
                    }
                }
                // Aktualisiere den Inhalt (Text, etc.), falls nötig. Hier einfach, da nur Text.
                existingElement.querySelector('span').textContent = task.text;
            }
        }
        if (change.type === "removed") {
            if (existingElement) {
                existingElement.remove();
            }
        }
    });

    updateColumnCounts();
    if (typeof lucide !== 'undefined') lucide.createIcons();

  }, (error) => {
      console.error("Pinnwand-Fehler:", error);
      render(EmptyStateCard('Fehler', 'Aufgaben konnten nicht geladen werden.', '!', ''), document.getElementById('app-content'));
  });
}

function renderInitialPinnwandDOM() {
    const appContent = document.getElementById('app-content');
    if (!appContent) return;

    appContent.innerHTML = `
    <div class="flex gap-4 lg:gap-6 overflow-x-auto py-4">
      ${COLUMN_DEFS.map(col => `
        <div class="pinnwand-column" data-column="${col.id}">
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-bold text-lg text-white flex items-center gap-2">
              ${col.title}
              <span class="column-count inline-block bg-white/10 text-xs px-2 py-0.5 rounded-full ml-1">0</span>
            </h2>
            <button class="icon-button-ghost" onclick="window.openCreateTaskModal('${col.id}')" title="Neue Aufgabe hinzufügen">
                <i data-lucide="plus" class="w-5 h-5"></i>
            </button>
          </div>
          <div class="pinnwand-cards" data-column-id="${col.id}">
            
          </div>
        </div>
      `).join('')}
    </div>
  `;

  document.querySelectorAll('.pinnwand-cards').forEach(colEl => {
    colEl.addEventListener('dragover', onDragOver);
    colEl.addEventListener('drop', onDrop);
    colEl.addEventListener('dragleave', onDragLeave);
  });
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function createTaskElement(card) {
    const escapeHTML = (str) => str.replace(/'/g, "&apos;").replace(/"/g, "&quot;");
    const cardEl = document.createElement('div');
    cardEl.className = 'pinnwand-card';
    cardEl.draggable = true;
    cardEl.id = `task-${card.id}`;
    cardEl.dataset.cardId = card.id;
    cardEl.innerHTML = `
        <span class="flex-1">${card.text}</span>
        <button class="icon-button-ghost" 
                title="Termin aus Aufgabe erstellen" 
                onclick="window.openCreateEventModal(undefined, '${escapeHTML(card.text)}')"
        >
          <i data-lucide="calendar-plus" class="w-5 h-5"></i>
        </button>
        <button class="icon-button-ghost" 
                title="Aufgabe diskutieren" 
                onclick="window.startContextChat('pinnwandTask', '${card.id}', '${escapeHTML(card.text)}')"
        >
          <i data-lucide="message-circle" class="w-5 h-5"></i>
        </button>
    `;
    cardEl.addEventListener('dragstart', onDragStart);
    cardEl.addEventListener('dragend', onDragEnd);
    return cardEl;
}

function updateColumnCounts() {
    document.querySelectorAll('.pinnwand-column').forEach(columnEl => {
        const columnId = columnEl.dataset.column;
        const cardCount = columnEl.querySelectorAll('.pinnwand-card').length;
        const countSpan = columnEl.querySelector('.column-count');
        if (countSpan) {
            countSpan.textContent = cardCount;
        }
    });
}

// --- MODAL STATT PROMPT (VEREDELTE VERSION) ---
if (!window.openCreateTaskModal) {
    window.openCreateTaskModal = (status) => {
        const { membersData, currentUser } = getCurrentUser();
        
        // Erstelle <option> Elemente für das Zuweisungs-Dropdown
        const memberOptions = Object.values(membersData).map(member => 
            `<option value="${member.uid}">${member.name}</option>`
        ).join('');
    const modalId = 'modal-create-task';
    const modalContent = `
        <form id="create-task-form" class="space-y-4">
            <h2 class="text-2xl font-bold text-gradient mb-6">Neue Aufgabe</h2>
            
            <div>
                <label for="task-text" class="form-label text-sm text-secondary mb-1 block">Was soll erledigt werden?</label>
                <textarea id="task-text" name="task-text" class="form-input" rows="3" required></textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label for="task-assignedTo" class="form-label text-sm text-secondary mb-1 block">Zuweisen an:</label>
                    <select id="task-assignedTo" class="form-input">
                        <option value="">Niemanden</option>
                        ${memberOptions}
                    </select>
                </div>
                <div>
                    <label for="task-points" class="form-label text-sm text-secondary mb-1 block">Belohnung (Punkte)</label>
                    <input type="number" id="task-points" class="form-input" value="0" min="0" step="10">
                </div>
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
    
    // Zuweisung standardmäßig auf den Ersteller setzen
    document.getElementById('task-assignedTo').value = currentUser.uid;
    document.getElementById('create-task-form').onsubmit = async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('create-task-submit');
        showButtonSpinner(submitBtn);
        
        const text = document.getElementById('task-text').value.trim();
        const assignedTo = document.getElementById('task-assignedTo').value || null;
        const points = parseInt(document.getElementById('task-points').value) || 0;
        if (text) {
            try {
                const { currentFamilyId } = getCurrentUser();
                await addDoc(collection(db, 'families', currentFamilyId, 'pinnwand'), {
                    text: text,
                    status: status,
                    assignedTo: assignedTo, // NEU
                    points: points,         // NEU
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
  
  // Verhindert Klick auf Chat-Button beim Droppen
  if (draggedFromColumn !== newStatus) {
    e.stopPropagation(); 
  }
  
  // 1. UI Optimistisch aktualisieren
  column.appendChild(draggedCard);
  removeAllDragOver();

  if (draggedFromColumn === newStatus) { return; } // Keine Statusänderung, keine DB-Aktion nötig

  try {
    const { currentFamilyId } = getCurrentUser();

    // 2. Task-Status in Firestore aktualisieren
    const taskRef = doc(db, 'families', currentFamilyId, 'pinnwand', cardId);
    await updateDoc(taskRef, { status: newStatus });

    // 3. (NEU) Belohnungs-Logik
    if (newStatus === 'done' && draggedFromColumn !== 'done') {
        
        // Hole die Task-Daten direkt aus Firestore, statt 'columns' zu nutzen
        const taskSnapshot = await getDoc(taskRef); 
        if (taskSnapshot.exists()) {
            const taskData = taskSnapshot.data();

            if (taskData && taskData.assignedTo && taskData.points > 0) {
                // Finde das Zieldokument des Mitglieds
                const memberRef = doc(db, 'families', currentFamilyId, 'membersData', taskData.assignedTo);
                
                // Erhöhe die Punkte atomar
                await updateDoc(memberRef, {
                    points: increment(taskData.points)
                });
                // Visuelles Feedback
                showNotification(`${taskData.points} Punkte! Gut gemacht!`, "success");
            }
        }
    }
  } catch (err) {
    console.error("Fehler beim Aktualisieren der Aufgabe oder Punkte:", err);
    // Bei Fehler: Rollback der UI
    // (Hinweis: Ein onSnapshot-Listener würde dies automatisch tun,
    // aber ein manueller Trigger ist sicherer, falls der Listener 'pinnwand' heißt)
    if (window.listeners && typeof window.listeners.pinnwand === 'function') {
        // renderPinnwand({ pinnwand: window.listeners.pinnwand });
        // TODO: This is not ideal, as it re-renders everything.
        // A better approach would be to move the card back to its original column.
        // For now, we just log the error.
    }
  }
}
function removeAllDragOver() {
  document.querySelectorAll('.pinnwand-cards').forEach(c => c.classList.remove('drag-over'));
}

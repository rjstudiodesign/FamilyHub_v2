// community.js – Modul für die Community-Pinnwand
// Basierend auf pinnwand.js, angepasst für öffentliche Ankündigungen

import { 
    db, storage, collection, query, onSnapshot, updateDoc, 
    doc, orderBy, addDoc, serverTimestamp, getDoc,
    ref, uploadBytesResumable, getDownloadURL, Timestamp
} from './firebase.js';
import { getCurrentUser } from './auth.js';
import { openModal, closeModal, showNotification, showButtonSpinner, hideButtonSpinner } from './ui.js';
import { Card, EmptyStateCard } from './components/Card.js';
import { render } from './components/index.js';

let columns = [];
let draggedCard = null;
let draggedFromColumn = null;

const COLUMN_DEFS = [
  { id: 'todo', title: 'Geplant' },
  { id: 'inprogress', title: 'Aktiv' },
  { id: 'done', title: 'Abgeschlossen' }
];

export function renderCommunity(listeners) {
  if (listeners.community) listeners.community();
  draggedCard = null;
  draggedFromColumn = null;

  const { currentFamilyId } = getCurrentUser();
  if (!currentFamilyId) {
      render(EmptyStateCard('Fehler', 'Keine Familie geladen.', '!', ''), document.getElementById('app-content'));
      return;
  }

  // Initiales DOM-Layout rendern, bevor Daten geladen werden
  renderInitialCommunityDOM();

  const tasksRef = collection(db, 'families', currentFamilyId, 'communityBoard');
  const q = query(tasksRef, orderBy('createdAt', 'asc'));
  
  listeners.community = onSnapshot(q, (snapshot) => {
    if (snapshot.empty) {
        const appContent = document.getElementById('app-content');
        const emptyBtn = `<button class="cta-primary-glow" onclick="window.openCreateCommunityTaskModal('todo')">
                            <i data-lucide="plus" class="w-5 h-5 mr-2"></i> Ankündigung erstellen
                         </button>`;
        render(EmptyStateCard("Noch keine Ankündigungen", "Erstelle die erste Community-Ankündigung (z.B. Straßenfest, Flohmarkt).", 'building-2', emptyBtn), appContent);
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
                // Aktualisiere den Inhalt (Text, etc.), falls nötig
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
      console.error("Community-Board-Fehler:", error);
      render(EmptyStateCard('Fehler', 'Ankündigungen konnten nicht geladen werden.', '!', ''), document.getElementById('app-content'));
  });
}

function renderInitialCommunityDOM() {
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
            <button class="icon-button-ghost" onclick="window.openCreateCommunityTaskModal('${col.id}')" title="Neue Ankündigung">
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
    
    // Attachment/Cover-Bild
    const coverImageHTML = card.attachment ? `
        <img src="${card.attachment}" alt="Cover" class="pinnwand-card-cover">
    ` : '';
    
    // Datum-Badge
    const dueDateBadge = card.dueDate ? (() => {
        const date = card.dueDate.toDate ? card.dueDate.toDate() : new Date(card.dueDate);
        const now = new Date();
        const isPast = date < now;
        const dateStr = date.toLocaleDateString('de-DE', { day: '2-digit', month: 'short' });
        const badgeClass = isPast ? 'badge-danger' : 'badge-info';
        const icon = isPast ? 'alert-circle' : 'calendar';
        return `
            <span class="task-badge ${badgeClass}">
                <i data-lucide="${icon}" class="w-3 h-3"></i>
                ${dateStr}
            </span>
        `;
    })() : '';
    
    // Verfasser-Info
    const authorName = card.authorName || 'Unbekannt';
    const authorBadge = `
        <span class="task-badge badge-secondary">
            <i data-lucide="user" class="w-3 h-3"></i>
            ${authorName}
        </span>
    `;
    
    cardEl.innerHTML = `
        ${coverImageHTML}
        <div class="pinnwand-card-content">
            <div class="flex justify-between items-start gap-2 mb-2">
                <span class="flex-1">${escapeHTML(card.text)}</span>
            </div>
            <div class="flex flex-wrap gap-1">
                ${authorBadge}
                ${dueDateBadge}
            </div>
        </div>
    `;
    
    cardEl.addEventListener('dragstart', onDragStart);
    cardEl.addEventListener('dragend', onDragEnd);
    cardEl.addEventListener('click', () => openTaskDetailsModal(card));
    
    return cardEl;
}

function updateColumnCounts() {
  document.querySelectorAll('.pinnwand-cards').forEach(col => {
      const count = col.querySelectorAll('.pinnwand-card').length;
      const colId = col.dataset.columnId;
      const countEl = col.closest('.pinnwand-column')?.querySelector('.column-count');
      if (countEl) {
          countEl.textContent = count;
      }
  });
}

// --- Details-Modal ---
function openTaskDetailsModal(card) {
    const modalId = `modal-task-details-${card.id}`;
    const dueDateStr = card.dueDate 
        ? (card.dueDate.toDate ? card.dueDate.toDate() : new Date(card.dueDate)).toLocaleDateString('de-DE') 
        : 'Kein Datum';
    
    const coverImageHTML = card.attachment ? `
        <img src="${card.attachment}" alt="Cover" class="w-full h-48 object-cover rounded-lg mb-4">
    ` : '';
    
    const authorName = card.authorName || 'Unbekannt';
    
    const modalContent = `
        <div class="space-y-4">
            <h2 class="text-2xl font-bold text-gradient mb-4">${card.text}</h2>
            ${coverImageHTML}
            
            <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <p class="text-text-secondary">Status</p>
                    <p class="font-semibold text-white">${getStatusLabel(card.status)}</p>
                </div>
                <div>
                    <p class="text-text-secondary">Termin</p>
                    <p class="font-semibold text-white">${dueDateStr}</p>
                </div>
                <div>
                    <p class="text-text-secondary">Erstellt von</p>
                    <p class="font-semibold text-white">${authorName}</p>
                </div>
            </div>
            
            <div class="flex justify-end gap-3 pt-6 border-t border-border-glass">
                <button class="btn-secondary" data-action="close-modal">Schließen</button>
                <button class="btn-danger" onclick="window.deleteCommunityTask('${card.id}')">
                    <i data-lucide="trash-2" class="w-5 h-5 mr-2"></i> Löschen
                </button>
            </div>
        </div>
    `;
    
    openModal(Card(modalContent, { variant: 'premium', className: 'max-w-lg w-full', padding: 'lg' }), modalId);
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function getStatusLabel(status) {
    const labels = {
        'todo': 'Geplant',
        'inprogress': 'Aktiv',
        'done': 'Abgeschlossen'
    };
    return labels[status] || status;
}

// --- Task löschen ---
window.deleteCommunityTask = async function(taskId) {
    if (!confirm('Diese Ankündigung wirklich löschen?')) return;
    
    try {
        const { currentFamilyId } = getCurrentUser();
        const taskRef = doc(db, 'families', currentFamilyId, 'communityBoard', taskId);
        
        // Löschen in Firestore (der Snapshot-Listener aktualisiert dann automatisch die UI)
        await updateDoc(taskRef, { deleted: true });
        
        // Alternativ: Komplett löschen
        // await deleteDoc(taskRef);
        
        showNotification('Ankündigung gelöscht.', 'success');
        closeModal(`modal-task-details-${taskId}`);
        
    } catch (err) {
        console.error('Fehler beim Löschen:', err);
        showNotification('Fehler beim Löschen.', 'error');
    }
};

// --- Neue Aufgabe anlegen (VEREINFACHT) ---
window.openCreateCommunityTaskModal = function(status = 'todo') {
    const modalId = 'modal-create-community-task';
    
    const modalContent = `
        <form id="create-community-task-form">
            <h2 class="text-2xl font-bold text-gradient mb-6">Neue Ankündigung</h2>
            
            <div class="space-y-4">
                <div>
                    <label for="task-text" class="form-label text-sm text-secondary mb-1 block">
                        Titel / Beschreibung
                    </label>
                    <input type="text" id="task-text" class="form-input" required 
                           placeholder="z.B. Straßenfest am 15. Juni">
                </div>
                
                <div>
                    <label for="task-duedate" class="form-label text-sm text-secondary mb-1 block">
                        Termin (optional)
                    </label>
                    <input type="date" id="task-duedate" class="form-input">
                </div>
                
                <div>
                    <label for="task-attachment" class="form-label text-sm text-secondary mb-1 block">
                        Bild hochladen (optional)
                    </label>
                    <input type="file" id="task-attachment" class="form-input" 
                           accept="image/png,image/jpeg,image/gif">
                    <p class="text-xs text-text-secondary mt-1">
                        Empfohlen: Landschaftsformat, max. 2MB
                    </p>
                </div>
                
                <input type="hidden" id="task-status" value="${status}">
            </div>
            
            <div class="flex justify-end gap-3 pt-6 border-t border-border-glass mt-6">
                <button type="button" class="btn-secondary" data-action="close-modal">Abbrechen</button>
                <button type="submit" id="task-submit-btn" class="cta-primary-glow">
                    <span class="btn-text">Erstellen</span>
                </button>
            </div>
        </form>
    `;
    
    openModal(Card(modalContent, { variant: 'premium', className: 'max-w-lg w-full', padding: 'lg' }), modalId);
    
    document.getElementById('create-community-task-form').onsubmit = async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('task-submit-btn');
        showButtonSpinner(submitBtn);
        
        const text = document.getElementById('task-text').value.trim();
        const dueDateStr = document.getElementById('task-duedate').value;
        const status = document.getElementById('task-status').value;
        const attachmentInput = document.getElementById('task-attachment');
        const attachmentFile = attachmentInput.files[0];
        
        if (!text) {
            showNotification('Bitte einen Titel eingeben.', 'error');
            hideButtonSpinner(submitBtn);
            return;
        }
        
        try {
            const { currentFamilyId, currentUser, currentUserData } = getCurrentUser();
            
            let attachment = null;
            
            // Optional: Bild hochladen
            if (attachmentFile) {
                const storageRef = ref(storage, `community/${currentFamilyId}/${Date.now()}_${attachmentFile.name}`);
                const uploadTask = await uploadBytesResumable(storageRef, attachmentFile);
                attachment = await getDownloadURL(uploadTask.ref);
            }
            
            const taskData = {
                text,
                status,
                dueDate: dueDateStr ? Timestamp.fromDate(new Date(dueDateStr)) : null,
                attachment: attachment,
                authorId: currentUser.uid,
                authorName: currentUserData.name || 'Unbekannt',
                createdAt: serverTimestamp()
            };
            
            await addDoc(collection(db, 'families', currentFamilyId, 'communityBoard'), taskData);
            
            showNotification("Ankündigung erstellt!", "success");
            closeModal(modalId);
            
        } catch (err) {
            showNotification('Fehler beim Erstellen der Ankündigung.', 'error');
            console.error(err);
        } finally {
            hideButtonSpinner(submitBtn);
        }
    };
};

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

  if (draggedFromColumn === newStatus) { return; }

  try {
    const { currentFamilyId } = getCurrentUser();
    const taskRef = doc(db, 'families', currentFamilyId, 'communityBoard', cardId);
    await updateDoc(taskRef, { status: newStatus });
    
  } catch (err) {
    console.error("Fehler beim Aktualisieren der Ankündigung:", err);
  }
}

function removeAllDragOver() {
  document.querySelectorAll('.pinnwand-cards').forEach(c => c.classList.remove('drag-over'));
}

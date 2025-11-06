// calendar.js – Premium-Kalendermodul für FamilyHub
// KORRIGIERTE VERSION (Integriert mit ui.js)

import { 
    db, collection, query, onSnapshot, addDoc, doc, 
    deleteDoc, serverTimestamp, orderBy, where 
} from './firebase.js';
import { getCurrentUser } from './auth.js';
import { openModal, closeModal, showNotification, showButtonSpinner, hideButtonSpinner } from './ui.js';
import { Card, EmptyStateCard } from './components/Card.js';
import { render } from './components/index.js';

// --- State ---
let currentDate = new Date();
let currentView = 'month';
let events = []; // Lokaler Cache für Events

/**
 * Initialisierungsfunktion (wird von navigation.js aufgerufen)
 */
export function renderCalendar(listeners) {
    if (listeners.calendar) {
        listeners.calendar(); // Alten Listener bereinigen
    }
    
    // UI-Element-Handler (Buttons)
    setupCalendarUI();

    // Daten laden
    const { currentFamilyId } = getCurrentUser();
    if (!currentFamilyId) {
        console.error("Kalender: Keine FamilyID gefunden.");
        return;
    }

    const eventsQuery = query(
        collection(db, 'families', currentFamilyId, 'calendar'), 
        orderBy('date', 'asc')
    );
    
    listeners.calendar = onSnapshot(eventsQuery, (snapshot) => {
        snapshot.docChanges().forEach(change => {
            const event = { 
                id: change.doc.id, 
                ...change.doc.data(),
                date: change.doc.data().date.toDate()
            };

            if (change.type === "added") {
                events.push(event);
            }
            if (change.type === "modified") {
                const index = events.findIndex(e => e.id === event.id);
                if (index > -1) {
                    events[index] = event;
                }
            }
            if (change.type === "removed") {
                const index = events.findIndex(e => e.id === event.id);
                if (index > -1) {
                    events.splice(index, 1);
                }
            }
        });
        
        // Ansicht basierend auf dem aktuellen State neu rendern
        renderCurrentView();
    }, (error) => {
        console.error("Kalender-Datenfehler:", error);
        showNotification("Fehler beim Laden des Kalenders", "error");
    });
}

function setupCalendarUI() {
    const dayBtn = document.querySelector('[data-view="day"]');
    const weekBtn = document.querySelector('[data-view="week"]');
    const monthBtn = document.querySelector('[data-view="month"]');
    const createBtn = document.getElementById('fab-create-event');

    if (dayBtn) dayBtn.onclick = () => setCalendarView('day');
    if (weekBtn) weekBtn.onclick = () => setCalendarView('week');
    if (monthBtn) monthBtn.onclick = () => setCalendarView('month');
    if (createBtn) createBtn.onclick = () => window.openCreateEventModal();
    
    setCalendarView('month'); // Initialansicht
}

function renderCurrentView() {
    if (currentView === 'month') {
        renderMonthView();
    } else {
        renderAgendaView(currentView);
    }
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function setCalendarView(view) {
    currentView = view;
    document.querySelectorAll('#calendar-view-controls .btn-filter').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`[data-view="${view}"]`);
    if (activeBtn) activeBtn.classList.add('active');

    const monthGrid = document.getElementById('calendar-grid');
    const agendaList = document.getElementById('agenda-list-container');
    
    if (view === 'month') {
        monthGrid.classList.remove('hidden');
        agendaList.classList.add('hidden');
        renderMonthView();
    } else {
        monthGrid.classList.add('hidden');
        agendaList.classList.remove('hidden');
        renderAgendaView(view);
    }
}

// --- Monatsansicht ---
function renderMonthView() {
    const gridBody = document.getElementById('calendar-body');
    if (!gridBody) return;
    gridBody.innerHTML = ''; 

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Montag=0
    const daysInMonth = lastDay.getDate();

    let row = document.createElement('div');
    row.className = 'calendar-row';

    for (let i = 0; i < startDay; i++) {
        row.appendChild(createDayElement(null)); // Leere Zelle
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month, d);
        row.appendChild(createDayElement(date));
        
        if (row.children.length === 7) {
            gridBody.appendChild(row);
            row = document.createElement('div');
            row.className = 'calendar-row';
        }
    }
    
    if (row.children.length > 0) {
        while (row.children.length < 7) {
            row.appendChild(createDayElement(null));
        }
        gridBody.appendChild(row);
    }
}

function createDayElement(date) {
    const el = document.createElement('div');
    if (!date) {
        el.className = 'calendar-cell empty';
        return el;
    }
    el.className = 'calendar-cell';
    
    const today = new Date();
    if (isSameDay(date, today)) {
        el.classList.add('today');
    }

    const number = document.createElement('span');
    number.className = 'calendar-date-label';
    if (isSameDay(date, today)) number.classList.add('today');
    number.textContent = date.getDate();
    el.appendChild(number);

    const eventsContainer = document.createElement('div');
    eventsContainer.className = 'calendar-events';
    
    const dayEvents = events.filter(ev => isSameDay(ev.date, date)).slice(0, 2); // Max 2 Events anzeigen
    
    dayEvents.forEach(ev => {
        const eventBar = document.createElement('div');
        eventBar.className = 'event-bar';
        eventBar.textContent = ev.title;
        eventBar.onclick = (e) => { e.stopPropagation(); window.openEventDetails(ev); };
        eventsContainer.appendChild(eventBar);
    });
    
    el.appendChild(eventsContainer);
    el.onclick = () => window.openCreateEventModal(date.toISOString().split('T')[0]);
    return el;
}

// --- Agenda-Ansicht (Tag/Woche) ---
function renderAgendaView(view) {
    const agenda = document.getElementById('agenda-list-container');
    if (!agenda) return;

    const now = new Date();
    let startDate, endDate;
    
    if (view === 'day') {
        startDate = new Date(now.setHours(0,0,0,0));
        endDate = new Date(now.setHours(23,59,59,999));
    } else { // 'week'
        const dayOfWeek = now.getDay() === 0 ? 6 : now.getDay() - 1;
        startDate = new Date(now.setDate(now.getDate() - dayOfWeek));
        startDate.setHours(0,0,0,0);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23,59,59,999);
    }
    
    const filteredEvents = events.filter(ev => ev.date >= startDate && ev.date <= endDate);
    
    if (filteredEvents.length === 0) {
        render(EmptyStateCard('Keine Termine', `Für diese ${view === 'day' ? 'Tagesansicht' : 'Wochenansicht'} sind keine Termine eingetragen.`, 'calendar-x', ''), agenda);
        if (typeof lucide !== 'undefined') lucide.createIcons();
        return;
    }
    
    agenda.innerHTML = filteredEvents.map(ev => renderAgendaItem(ev)).join('');
}

function renderAgendaItem(event) {
    const date = event.date;
    const month = date.toLocaleString('de-DE', { month: 'short' }).toUpperCase();
    const day = date.getDate();
    const time = event.allDay ? 'Ganztägig' : date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) + ' Uhr';
    
    return `
    <div class="agenda-item" onclick="window.openEventDetails(${JSON.stringify(event).replace(/"/g, "'")})">
        <div class="agenda-date-box">
            <span class="month">${month}</span>
            <span class="day">${day}</span>
        </div>
        <div class="agenda-info">
            <p class="title">${event.title}</p>
            <p class="time">${time}</p>
        </div>
    </div>
    `;
}

function isSameDay(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

// --- Modals (Nutzung von ui.js) ---

if (!window.openCreateEventModal) {
    window.openCreateEventModal = (dateString = new Date().toISOString().split('T')[0], defaultTitle = '') => {
        const modalId = 'modal-create-event';
        const modalContent = `
            <form id="create-event-form" class="space-y-4">
                <h2 class="text-2xl font-bold text-gradient mb-6">Neuer Termin</h2>
                <div>
                    <label for="event-title" class="form-label text-sm text-secondary mb-1 block">Titel</label>
                    <input type="text" id="event-title" name="event-title" class="form-input" required value="${defaultTitle}" />
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label for="event-date" class="form-label text-sm text-secondary mb-1 block">Datum</label>
                        <input type="date" id="event-date" name="event-date" class="form-input" value="${dateString}" required />
                    </div>
                    <div>
                        <label for="event-time" class="form-label text-sm text-secondary mb-1 block">Startzeit (optional)</label>
                        <input type="time" id="event-time" name="event-time" class="form-input" />
                    </div>
                </div>
                <div>
                    <label for="event-description" class="form-label text-sm text-secondary mb-1 block">Beschreibung</label>
                    <textarea id="event-description" name="event-description" class="form-input" rows="3"></textarea>
                </div>
                <div class="flex justify-end gap-3 pt-6 border-t border-border-glass">
                    <button type="button" class="btn-secondary" data-action="close-modal">Abbrechen</button>
                    <button type="submit" id="create-event-submit" class="cta-primary-glow">
                        <span class="btn-text">Termin speichern</span>
                    </button>
                </div>
            </form>
        `;
        
        openModal(Card(modalContent, { variant: 'premium', className: 'max-w-lg w-full' }), modalId);
        if (typeof lucide !== 'undefined') lucide.createIcons();
    document.getElementById('create-event-form').onsubmit = window.handleEventSubmit;
}
}

if (!window.handleEventSubmit) {
    window.handleEventSubmit = async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('create-event-submit');
        showButtonSpinner(submitBtn); // KORREKTUR: Nutzt ui.js

        try {
            const { currentUser, currentFamilyId } = getCurrentUser();
            const title = document.getElementById('event-title').value;
            const date = document.getElementById('event-date').value;
            const time = document.getElementById('event-time').value;
            const description = document.getElementById('event-description').value;

            const startDateTime = new Date(time ? `${date}T${time}` : date);

            await addDoc(collection(db, 'families', currentFamilyId, 'calendar'), {
                title: title,
                description: description,
                date: startDateTime,
                allDay: !time,
                creatorId: currentUser.uid,
                createdAt: serverTimestamp()
            });

            closeModal('modal-create-event');
            showNotification("Termin erstellt!", "success");

        } catch (error) {
            console.error("Fehler beim Erstellen des Termins:", error);
            showNotification("Fehler beim Erstellen.", "error");
        } finally {
            hideButtonSpinner(submitBtn); // KORREKTUR: Nutzt ui.js
        }
    };
}

if (!window.openEventDetails) {
    window.openEventDetails = (event) => {
        const modalId = 'modal-event-detail';
        const date = event.date;
        const time = event.allDay ? 'Ganztägig' : date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) + ' Uhr';

        const modalContent = `
            <h2 class="text-2xl font-bold text-gradient mb-4">${event.title}</h2>
            <div class="space-y-3">
                <div class="flex items-center gap-2 text-secondary">
                    <i data-lucide="calendar"></i>
                    <span>${date.toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div class="flex items-center gap-2 text-secondary">
                    <i data-lucide="clock"></i>
                    <span>${time}</span>
                </div>
                ${event.description ? `<p class="text-white pt-4">${event.description}</p>` : ''}
            </div>
            <div class="flex justify-end gap-3 pt-6 border-t border-border-glass mt-6">
                <button type="button" class="btn-secondary" data-action="close-modal">Schließen</button>
                <button type="button" id="delete-event-btn" class="btn-secondary bg-red-500/20 text-red-400">
                    <i data-lucide="trash-2" class="w-5 h-5 mr-2"></i> Löschen
                </button>
            </div>
        `;
        openModal(Card(modalContent, { variant: 'premium', className: 'max-w-md w-full' }), modalId);
        if (typeof lucide !== 'undefined') lucide.createIcons();
        
        document.getElementById('delete-event-btn').onclick = () => window.deleteEvent(event.id, modalId);
    }
}

if (!window.deleteEvent) {
    window.deleteEvent = async (eventId, modalId) => {
        if (!confirm("Möchtest du diesen Termin wirklich löschen?")) return;
        
        const { currentFamilyId } = getCurrentUser();
        const eventRef = doc(db, 'families', currentFamilyId, 'calendar', eventId);
        
        try {
            await deleteDoc(eventRef);
            showNotification("Termin gelöscht", "success");
            closeModal(modalId);
        } catch (error) {
            console.error("Error deleting event:", error);
            showNotification("Fehler beim Löschen", "error");
        }
    }
}

// calendar.js – Premium-Kalendermodul für FamilyHub

import { openModal, closeModal } from './ui.js';
import { db, collection, query, onSnapshot, addDoc, doc, deleteDoc, serverTimestamp, orderBy, where } from './firebase.js';
import { getCurrentUser } from './auth.js';

// --- State ---
let currentDate = new Date();
let currentView = 'month';
let events = []; // Lokaler Cache für Events
let calendarUnsubscribe = null;

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
        collection(db, 'families', currentFamilyId, 'events'), 
        orderBy('startAt', 'asc')
    );
    
    calendarUnsubscribe = onSnapshot(eventsQuery, (snapshot) => {
        events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Ansicht basierend auf dem aktuellen State neu rendern
        setCalendarView(currentView); 
    });

    listeners.calendar = calendarUnsubscribe;
}

function setupCalendarUI() {
	const dayBtn = document.getElementById('view-day-btn');
	const weekBtn = document.getElementById('view-week-btn');
	const monthBtn = document.getElementById('view-month-btn');

	if (dayBtn) dayBtn.onclick = () => setCalendarView('day');
	if (weekBtn) weekBtn.onclick = () => setCalendarView('week');
	if (monthBtn) monthBtn.onclick = () => setCalendarView('month');
	
    // Stelle sicher, dass die Monatsansicht initial gerendert wird
	setCalendarView('month');
}

export function setCalendarView(view) {
	currentView = view;
    // Update active button state
    document.querySelectorAll('#calendar-grid, #agenda-list').forEach(el => el.innerHTML = '');
    document.querySelectorAll('.btn-filter').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`view-${view}-btn`);
    if (activeBtn) activeBtn.classList.add('active');

	if (view === 'month') {
		renderMonthView();
	} else if (view === 'day' || view === 'week') {
		renderAgendaView(view);
	}
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// --- Monatsansicht ---
export function renderMonthView() {
	const gridBody = document.getElementById('calendar-body');
	if (!gridBody) return;
	gridBody.innerHTML = ''; // Body leeren, Header behalten

	const year = currentDate.getFullYear();
	const month = currentDate.getMonth();
	const firstDay = new Date(year, month, 1);
	const lastDay = new Date(year, month + 1, 0);
	const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Montag=0
	const daysInMonth = lastDay.getDate();

	// Leere Felder vor dem 1. Tag
	for (let i = 0; i < startDay; i++) {
		const empty = document.createElement('div');
        empty.className = 'calendar-day-empty'; //
		gridBody.appendChild(empty);
	}
	
    // Tage
	for (let d = 1; d <= daysInMonth; d++) {
		const date = new Date(year, month, d);
		const dayEl = createDayElement(date);
		gridBody.appendChild(dayEl);
	}
}

function createDayElement(date) {
	const el = document.createElement('div');
	el.className = 'calendar-day'; //
    
    const today = new Date();
    if (isSameDay(date, today)) {
        el.classList.add('today'); //
    }

    const number = document.createElement('span');
    number.className = 'day-number'; //
    number.textContent = date.getDate();
    el.appendChild(number);

	// Events für diesen Tag finden und rendern
	const dayEvents = events.filter(ev => isSameDay(ev.startAt.toDate(), date));
	if (dayEvents.length > 0) {
        const eventBadge = document.createElement('div');
        eventBadge.className = 'calendar-event-badge'; //
        eventBadge.textContent = `${dayEvents.length} Termin(e)`;
        el.appendChild(eventBadge);
	}
    
	el.onclick = () => window.openCreateEventModal(date); // Bindet an globale Funktion
	return el;
}

function isSameDay(a, b) {
	return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

// --- Agenda-Ansicht (Tag/Woche) ---
export function renderAgendaView(view) {
	const agenda = document.getElementById('agenda-list');
	if (!agenda) return;
	agenda.innerHTML = '';
	
    let filtered = [];
    // TODO: Implement Agenda Logic
    
	if (filtered.length === 0) {
		agenda.innerHTML = '<div class="text-text-secondary text-center py-8">Keine Termine für diese Ansicht</div>';
		return;
	}
    // ... Agenda-Rendering-Logik ...
}

// --- Modals (ARCHITEKTUR-KONFORM UMGEBAUT) ---

/**
 * Öffnet das Modal zum Erstellen eines neuen Termins.
 * Nutzt ui.js -> openModal()
 */
window.openCreateEventModal = (date = new Date()) => {
    const modalId = 'modal-create-event';
    const dateString = date.toISOString().split('T')[0]; // Format: YYYY-MM-DD

    const modalContent = `
        <div class="modal-content glass-premium max-w-lg w-full">
            <h2 class="text-xl font-bold text-gradient mb-6">Neuer Termin</h2>
            <form id="create-event-form" class="space-y-4">
                
                <div>
                    <label class="block text-sm font-medium text-secondary mb-1">Titel</label>
                    <input type="text" id="event-title" class="form-input" required />
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class.="block text-sm font-medium text-secondary mb-1">Startdatum</label>
                        <input type="date" id="event-start-date" class="form-input" value="${dateString}" required />
                    </div>
                    <div>
                        <label class.="block text-sm font-medium text-secondary mb-1">Startzeit</label>
                        <input type="time" id="event-start-time" class="form-input" value="12:00" />
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-secondary mb-1">Beschreibung (optional)</label>
                    <textarea id="event-description" class="form-input" rows="3"></textarea>
                </div>
                
                <div class="flex justify-end gap-3 pt-4 border-t border-border-glass">
                    <button type="button" class="btn-secondary" data-action="close-modal">Abbrechen</button>
                    <button type="submit" id="create-event-submit" class="btn-premium">
                        <span class="btn-text">Termin speichern</span>
                    </button>
                </div>
            </form>
        </div>
    `;
    
    openModal(modalContent, modalId); //

    // Formular-Handler
    document.getElementById('create-event-form').onsubmit = async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('create-event-submit');
        showButtonSpinner(submitBtn);

        try {
            const { currentUser, currentFamilyId } = getCurrentUser();
            const title = document.getElementById('event-title').value;
            const date = document.getElementById('event-start-date').value;
            const time = document.getElementById('event-start-time').value || '00:00';
            const description = document.getElementById('event-description').value;

            // Kombiniere Datum und Zeit zu einem ISO-String und dann zu einem Date-Objekt
            const startAt = new Date(`${date}T${time}`);

            await addDoc(collection(db, 'families', currentFamilyId, 'events'), {
                title: title,
                description: description,
                startAt: startAt, // Firestore Timestamp
                createdBy: currentUser.uid,
                createdAt: serverTimestamp()
            });

            closeModal(modalId);
            showNotification("Termin erstellt!", "success");

        } catch (error) {
            console.error("Fehler beim Erstellen des Termins:", error);
            showNotification("Fehler beim Erstellen des Termins.", "error");
        } finally {
            hideButtonSpinner(submitBtn);
        }
    };
}

/**
 * Öffnet das Detail-Modal für ein bestehendes Event.
 * (Noch nicht implementiert, da `openEventDetails` noch fehlt)
 */
export function openEventDetails(event) {
    // TODO: Implementieren mit openModal()
    console.log("Event-Details anzeigen (TODO):", event);
}

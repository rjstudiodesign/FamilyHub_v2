// calendar.js – Premium-Kalendermodul für FamilyHub

// --- State ---
let currentDate = new Date();
let currentView = 'month';
let events = [];

// --- Initialisierung ---
document.addEventListener('DOMContentLoaded', () => {
	setupCalendarUI();
});

function setupCalendarUI() {
	// View-Switcher Buttons
	const dayBtn = document.getElementById('view-day-btn');
	const weekBtn = document.getElementById('view-week-btn');
	const monthBtn = document.getElementById('view-month-btn');
	if (dayBtn) dayBtn.onclick = () => setCalendarView('day');
	if (weekBtn) weekBtn.onclick = () => setCalendarView('week');
	if (monthBtn) monthBtn.onclick = () => setCalendarView('month');
	setCalendarView('month');
}

export function setCalendarView(view) {
	currentView = view;
	if (view === 'month') {
		renderMonthView();
	} else if (view === 'day' || view === 'week') {
		renderAgendaView(view);
	}
}

// --- Monatsansicht ---
export function renderMonthView() {
	const grid = document.getElementById('calendar-grid');
	if (!grid) return;
	grid.innerHTML = '';

	const year = currentDate.getFullYear();
	const month = currentDate.getMonth();
	const firstDay = new Date(year, month, 1);
	const lastDay = new Date(year, month + 1, 0);
	const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Montag=0
	const daysInMonth = lastDay.getDate();

	// Grid-Header
	const headerRow = document.createElement('div');
	headerRow.className = 'grid grid-cols-7 mb-2';
	['Mo','Di','Mi','Do','Fr','Sa','So'].forEach(d => {
		const th = document.createElement('div');
		th.className = 'text-xs text-zinc-400 text-center py-1';
		th.textContent = d;
		headerRow.appendChild(th);
	});
	grid.appendChild(headerRow);

	// Grid-Body
	const body = document.createElement('div');
	body.id = 'calendar-body';
	body.className = 'grid grid-cols-7 gap-1';

	// Leere Felder vor dem 1. Tag
	for (let i = 0; i < startDay; i++) {
		const empty = document.createElement('div');
		body.appendChild(empty);
	}
	// Tage
	for (let d = 1; d <= daysInMonth; d++) {
		const date = new Date(year, month, d);
		const dayEl = createDayElement(date);
		body.appendChild(dayEl);
	}
	grid.appendChild(body);
}

function createDayElement(date) {
	const el = document.createElement('div');
	el.className = 'calendar-day rounded-xl p-2 text-center cursor-pointer hover:bg-fuchsia-700/10 transition relative';
	el.textContent = date.getDate();
	// Beispiel: Events als Badge
	const dayEvents = events.filter(ev => isSameDay(new Date(ev.start), date));
	if (dayEvents.length > 0) {
		const badge = document.createElement('span');
		badge.className = 'absolute top-1 right-2 bg-fuchsia-700 text-white text-xs px-2 py-0.5 rounded-full';
		badge.textContent = dayEvents.length;
		el.appendChild(badge);
	}
	el.onclick = () => openCreateEventModal(date);
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
	// Beispiel: Filtere Events für den aktuellen Tag/Woche
	let filtered = [];
	if (view === 'day') {
		filtered = events.filter(ev => isSameDay(new Date(ev.start), currentDate));
	} else if (view === 'week') {
		const weekStart = new Date(currentDate);
		weekStart.setDate(currentDate.getDate() - currentDate.getDay() + 1);
		const weekEnd = new Date(weekStart);
		weekEnd.setDate(weekStart.getDate() + 6);
		filtered = events.filter(ev => new Date(ev.start) >= weekStart && new Date(ev.start) <= weekEnd);
	}
	if (filtered.length === 0) {
		agenda.innerHTML = '<div class="text-zinc-400 text-center py-8">Keine Termine</div>';
		return;
	}
	filtered.forEach(ev => {
		const item = document.createElement('div');
		item.className = 'agenda-item p-2 rounded-lg mb-2 bg-zinc-800/60 flex flex-col gap-1 cursor-pointer hover:bg-fuchsia-700/10';
		item.innerHTML = `<span class="font-semibold text-zinc-100">${ev.title}</span><span class="text-xs text-zinc-400">${formatTime(ev.start)}</span>`;
		item.onclick = () => openEventDetails(ev);
		agenda.appendChild(item);
	});
}

function formatTime(dateStr) {
	const d = new Date(dateStr);
	return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// --- Modals ---
export function openCreateEventModal(date) {
	// Öffnet das Event-Modal für neuen Termin
	const tpl = document.getElementById('template-event-detail-modal');
	if (!tpl) return;
	const modal = tpl.content.firstElementChild.cloneNode(true);
	modal.querySelector('#calendar-event-detail-title').textContent = 'Neues Ereignis';
	modal.querySelector('#calendar-event-detail-meta').textContent = date.toLocaleDateString();
	modal.querySelector('#calendar-event-detail-description').textContent = '';
	modal.querySelector('#calendar-event-detail-edit').style.display = 'none';
	modal.querySelector('#calendar-event-detail-delete').style.display = 'none';
	modal.querySelector('#calendar-event-detail-close').onclick = () => modal.remove();
	document.body.appendChild(modal);
}

export function openEventDetails(event) {
	// Öffnet das Event-Modal für bestehendes Event
	const tpl = document.getElementById('template-event-detail-modal');
	if (!tpl) return;
	const modal = tpl.content.firstElementChild.cloneNode(true);
	modal.querySelector('#calendar-event-detail-title').textContent = event.title;
	modal.querySelector('#calendar-event-detail-meta').textContent = new Date(event.start).toLocaleString();
	modal.querySelector('#calendar-event-detail-description').textContent = event.description || '';
	modal.querySelector('#calendar-event-detail-close').onclick = () => modal.remove();
	// Edit/Delete-Logik kann hier ergänzt werden
	document.body.appendChild(modal);
}

// --- Today-Button ---
export function goToToday() {
	currentDate = new Date();
	setCalendarView(currentView);
}
// calendar.js – Modul für den Kalender

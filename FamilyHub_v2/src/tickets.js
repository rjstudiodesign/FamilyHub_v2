// tickets.js - Modul für die Ticket-Planung
import { 
    db, 
    collection, query, onSnapshot, addDoc, doc, updateDoc, getDocs,
    serverTimestamp, Timestamp 
} from './firebase.js';
import { getCurrentUser } from './auth.js';
import { openModal, closeModal, showNotification, showButtonSpinner, hideButtonSpinner } from './ui.js';

let membersDataCache = {};

export function renderTickets(listeners) {
    const { currentFamilyId } = getCurrentUser();
    if (!currentFamilyId) {
        console.error("Keine Familien-ID gefunden.");
        return;
    }

    const container = document.getElementById('tickets-list-container');
    if (!container) {
        console.error("Tickets-Container nicht gefunden.");
        return;
    }

    // Button für neues Ticket binden
    const createBtn = document.getElementById('btn-create-ticket');
    if (createBtn) {
        createBtn.onclick = () => openCreateTicketModal(currentFamilyId);
    }

    // Lade Mitglieder-Daten für die Anzeige von Namen
    loadMembersData(currentFamilyId);

    // Echtzeit-Listener für Tickets einrichten
    const ticketsQuery = query(collection(db, 'families', currentFamilyId, 'tickets'));
    
    listeners.tickets = onSnapshot(ticketsQuery, (snapshot) => {
        const tickets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        if (tickets.length === 0) {
            container.innerHTML = `
                <div class="text-center text-secondary p-8 border-2 border-dashed border-border-glass rounded-lg">
                    <i data-lucide="ticket" class="w-12 h-12 mx-auto mb-4"></i>
                    <h3 class="font-bold text-lg">Keine Tickets geplant</h3>
                    <p class="text-sm">Erstelle dein erstes Event-Ticket!</p>
                </div>
            `;
        } else {
            container.innerHTML = tickets.map(ticket => renderTicketCard(ticket)).join('');
        }

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }, (error) => {
        console.error("Fehler beim Laden der Tickets:", error);
        container.innerHTML = `<p class="text-red-500">Tickets konnten nicht geladen werden.</p>`;
    });
}

async function loadMembersData(familyId) {
    try {
        const membersRef = collection(db, 'families', familyId, 'membersData');
        const snapshot = await getDocs(membersRef);
        membersDataCache = {};
        snapshot.docs.forEach(doc => {
            membersDataCache[doc.id] = doc.data();
        });
    } catch (error) {
        console.error("Fehler beim Laden der Mitglieder-Daten:", error);
    }
}

function openCreateTicketModal(familyId) {
    const modalId = 'modal-create-ticket';
    
    const modalContent = `
        <div class="modal-content glass-premium max-w-lg w-full">
            <h2 class="text-xl font-bold text-gradient mb-6">Neues Ticket planen</h2>
            <form id="ticket-form" class="space-y-4">
                <div>
                    <label for="ticket-title" class="form-label">Titel</label>
                    <input type="text" id="ticket-title" class="form-input" required placeholder="z.B. Konzert: Die Toten Hosen">
                </div>
                <div>
                    <label for="ticket-link" class="form-label">Link (URL)</label>
                    <input type="url" id="ticket-link" class="form-input" placeholder="https://...">
                </div>
                <div>
                    <label for="ticket-date" class="form-label">Event-Datum</label>
                    <input type="datetime-local" id="ticket-date" class="form-input" required>
                </div>
                <div>
                    <label for="ticket-description" class="form-label">Beschreibung (optional)</label>
                    <textarea id="ticket-description" class="form-input" rows="3" placeholder="Details zum Event..."></textarea>
                </div>
                <div class="flex justify-end gap-3 pt-6 border-t border-border-glass">
                    <button type="button" class="btn-secondary" data-action="close-modal">Abbrechen</button>
                    <button type="submit" id="ticket-submit-btn" class="cta-primary-glow">
                        <span class="btn-text">Erstellen</span>
                    </button>
                </div>
            </form>
        </div>
    `;
    
    openModal(modalContent, modalId);

    document.getElementById('ticket-form').onsubmit = (e) => {
        e.preventDefault();
        handleSaveTicket(familyId);
    };
}

async function handleSaveTicket(familyId) {
    const submitBtn = document.getElementById('ticket-submit-btn');
    showButtonSpinner(submitBtn);

    const title = document.getElementById('ticket-title').value.trim();
    const link = document.getElementById('ticket-link').value.trim();
    const dateStr = document.getElementById('ticket-date').value;
    const description = document.getElementById('ticket-description').value.trim();

    if (!title || !dateStr) {
        showNotification("Titel und Event-Datum sind erforderlich.", "error");
        hideButtonSpinner(submitBtn);
        return;
    }

    try {
        const eventDate = Timestamp.fromDate(new Date(dateStr));
        
        const ticketData = {
            title: title,
            link: link || '',
            eventDate: eventDate,
            description: description || '',
            rsvps: {}, // Leere Map für die Umfrage
            createdAt: serverTimestamp(),
            createdBy: getCurrentUser().currentUser.uid
        };

        const ticketsRef = collection(db, 'families', familyId, 'tickets');
        await addDoc(ticketsRef, ticketData);

        showNotification("Ticket erstellt!", "success");
        closeModal('modal-create-ticket');

    } catch (error) {
        console.error("Fehler beim Erstellen des Tickets:", error);
        showNotification("Fehler beim Erstellen.", "error");
    } finally {
        hideButtonSpinner(submitBtn);
    }
}

function renderTicketCard(ticket) {
    const eventDate = ticket.eventDate ? ticket.eventDate.toDate() : null;
    const dateStr = eventDate ? eventDate.toLocaleDateString('de-DE', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }) : 'Kein Datum';

    // RSVP-Statistik berechnen
    const rsvps = ticket.rsvps || {};
    const stats = { yes: [], maybe: [], no: [] };
    
    Object.entries(rsvps).forEach(([uid, status]) => {
        if (stats[status]) {
            const memberName = membersDataCache[uid]?.name || 'Unbekannt';
            stats[status].push(memberName);
        }
    });

    const { currentUser } = getCurrentUser();
    const userStatus = rsvps[currentUser?.uid] || null;

    return `
        <div class="glass-list-item p-6 rounded-lg space-y-4">
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <h3 class="font-bold text-xl text-white mb-2">${ticket.title}</h3>
                    <div class="flex items-center gap-2 text-sm text-secondary mb-2">
                        <i data-lucide="calendar" class="w-4 h-4"></i>
                        <span>${dateStr}</span>
                    </div>
                    ${ticket.description ? `<p class="text-sm text-secondary mb-3">${ticket.description}</p>` : ''}
                    ${ticket.link ? `
                        <a href="${ticket.link}" target="_blank" class="text-accent-glow hover:underline text-sm flex items-center gap-1">
                            <i data-lucide="external-link" class="w-4 h-4"></i>
                            Link zum Event
                        </a>
                    ` : ''}
                </div>
            </div>

            <div class="border-t border-border-glass pt-4">
                <p class="text-sm font-semibold text-white mb-3">Wer kommt mit?</p>
                <div class="flex gap-2 mb-4">
                    <button 
                        onclick="window.handleTicketRSVP('${ticket.id}', 'yes')" 
                        class="flex-1 px-4 py-2 rounded-lg border transition-all ${userStatus === 'yes' ? 'bg-green-500/20 border-green-500 text-green-400' : 'border-border-glass text-secondary hover:bg-white/5'}"
                    >
                        <i data-lucide="check" class="w-4 h-4 inline mr-1"></i>
                        Zusagen
                    </button>
                    <button 
                        onclick="window.handleTicketRSVP('${ticket.id}', 'maybe')" 
                        class="flex-1 px-4 py-2 rounded-lg border transition-all ${userStatus === 'maybe' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400' : 'border-border-glass text-secondary hover:bg-white/5'}"
                    >
                        <i data-lucide="help-circle" class="w-4 h-4 inline mr-1"></i>
                        Vielleicht
                    </button>
                    <button 
                        onclick="window.handleTicketRSVP('${ticket.id}', 'no')" 
                        class="flex-1 px-4 py-2 rounded-lg border transition-all ${userStatus === 'no' ? 'bg-red-500/20 border-red-500 text-red-400' : 'border-border-glass text-secondary hover:bg-white/5'}"
                    >
                        <i data-lucide="x" class="w-4 h-4 inline mr-1"></i>
                        Absagen
                    </button>
                </div>

                <div class="space-y-2 text-sm">
                    ${stats.yes.length > 0 ? `
                        <div class="flex items-start gap-2">
                            <i data-lucide="check" class="w-4 h-4 text-green-400 mt-0.5"></i>
                            <span class="text-secondary"><span class="text-green-400 font-semibold">${stats.yes.length}</span> Zusagen: ${stats.yes.join(', ')}</span>
                        </div>
                    ` : ''}
                    ${stats.maybe.length > 0 ? `
                        <div class="flex items-start gap-2">
                            <i data-lucide="help-circle" class="w-4 h-4 text-yellow-400 mt-0.5"></i>
                            <span class="text-secondary"><span class="text-yellow-400 font-semibold">${stats.maybe.length}</span> Vielleicht: ${stats.maybe.join(', ')}</span>
                        </div>
                    ` : ''}
                    ${stats.no.length > 0 ? `
                        <div class="flex items-start gap-2">
                            <i data-lucide="x" class="w-4 h-4 text-red-400 mt-0.5"></i>
                            <span class="text-secondary"><span class="text-red-400 font-semibold">${stats.no.length}</span> Absagen: ${stats.no.join(', ')}</span>
                        </div>
                    ` : ''}
                    ${stats.yes.length === 0 && stats.maybe.length === 0 && stats.no.length === 0 ? `
                        <p class="text-secondary italic">Noch keine Antworten.</p>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

window.handleTicketRSVP = async (ticketId, status) => {
    const { currentUser, currentFamilyId } = getCurrentUser();
    if (!currentUser || !currentFamilyId) {
        showNotification("Nicht angemeldet.", "error");
        return;
    }

    try {
        const ticketRef = doc(db, 'families', currentFamilyId, 'tickets', ticketId);
        await updateDoc(ticketRef, {
            [`rsvps.${currentUser.uid}`]: status
        });

        const statusLabels = {
            yes: 'zugesagt',
            maybe: 'vielleicht gesagt',
            no: 'abgesagt'
        };

        showNotification(`Du hast ${statusLabels[status]}!`, "success");

    } catch (error) {
        console.error("Fehler beim Speichern der RSVP:", error);
        showNotification("Fehler beim Speichern.", "error");
    }
};

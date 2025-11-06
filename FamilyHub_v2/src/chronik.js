// src/chronik.js
// Neues Modul für die Familien-Chronik

import { 
    db, collection, query, where, orderBy, onSnapshot, getDocs
} from './firebase.js';
import { getCurrentUser } from './auth.js';
import { showNotification } from './ui.js';
import { EmptyStateCard } from './components/Card.js';
import { render } from './components/index.js';

/**
 * Gruppiert ein flaches Array von Items (Posts + Events) nach Datum.
 * @returns {Object} Ein Objekt, bei dem Schlüssel Datum-Strings (YYYY-MM-DD) sind.
 */
function groupItemsByDay(items) {
    const grouped = {};
    items.forEach(item => {
        // 'date' für Kalender-Events, 'createdAt' für Posts
        const dateObj = item.date || (item.createdAt ? item.createdAt.toDate() : null);
        if (!dateObj) return;

        const dayKey = dateObj.toISOString().split('T')[0]; // z.B. "2025-11-04"
        
        if (!grouped[dayKey]) {
            grouped[dayKey] = [];
        }
        grouped[dayKey].push(item);
    });
    return grouped;
}

/**
 * Rendert ein einzelnes Item in der Chronik-Liste.
 */
function renderChronikItem(item) {
    const time = (item.date || (item.createdAt ? item.createdAt.toDate() : new Date()))
        .toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    
    let icon = 'message-circle';
    let title = item.text || 'Beitrag';
    let linkAction = `window.openPostMenu('${item.id}')`; // Platzhalter

    if (item.type === 'gallery') {
        icon = 'image';
        title = item.galleryTitle || 'Neue Fotos';
        linkAction = `window.MapsTo('gallery')`;
    } else if (item.date) { // Annahme: Kalender-Event
        icon = 'calendar';
        title = item.title;
        // Event-Details-Modal öffnen, wenn es existiert
        linkAction = `window.openEventDetails ? window.openEventDetails(${JSON.stringify(item).replace(/"/g, "'")}) : console.log('Event-Detail')`;
    }

    return `
    <div class="chronik-item" onclick="${linkAction}">
        <div class="chronik-icon"><i data-lucide="${icon}"></i></div>
        <div class="chronik-info">
            <p class="title">${title}</p>
            <p class="time">${time} Uhr</p>
        </div>
    </div>
    `;
}

/**
 * Rendert einen ganzen Tages-Block.
 */
function renderDayBlock(dayKey, items) {
    const date = new Date(dayKey);
    const title = date.toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return `
    <div class="chronik-day-group">
        <h3 class="chronik-day-title">${title}</h3>
        <div class="space-y-2">
            ${items.map(renderChronikItem).join('')}
        </div>
    </div>
    `;
}

/**
 * Initialisiert die 'Chronik'-Seite.
 */
export async function renderChronik(listeners) {
    // 1. UI-Platzhalter rendern
    const container = document.getElementById('app-content');
    container.innerHTML = `
        <h2 class="text-xl font-bold text-gradient mb-6">Chronik</h2>
        <p class="text-secondary mb-6">Ein durchsuchbares Archiv aller Ereignisse, Termine und Posts.</p>
        <div id="chronik-list-container">
            <div class="spinner mx-auto"></div>
        </div>
    `;

    const listContainer = document.getElementById('chronik-list-container');
    const { currentFamilyId, currentUser } = getCurrentUser();

    try {
        // 2. Daten aus MEHREREN Quellen parallel laden
        const postsQuery = query(
            collection(db, 'families', currentFamilyId, 'posts'),
            orderBy('createdAt', 'desc')
        );
        
        const eventsQuery = query(
            collection(db, 'families', currentFamilyId, 'calendar'),
            orderBy('date', 'desc')
        );

        const [postsSnapshot, eventsSnapshot] = await Promise.all([
            getDocs(postsQuery),
            getDocs(eventsQuery)
        ]);

        const posts = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const events = eventsSnapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data(), 
            date: doc.data().date.toDate() // Wichtig: Datum konvertieren
        }));

        const allItems = [...posts, ...events].sort((a, b) => {
            const dateA = a.date || (a.createdAt ? a.createdAt.toDate() : 0);
            const dateB = b.date || (b.createdAt ? b.createdAt.toDate() : 0);
            return dateB - dateA; // Neueste zuerst
        });

        if (allItems.length === 0) {
            render(EmptyStateCard('Noch keine Einträge', 'Beginnt, den Feed oder Kalender zu nutzen, um die Chronik zu füllen.', 'history', ''), listContainer);
            if (typeof lucide !== 'undefined') lucide.createIcons();
            return;
        }

        // 3. Nach Tag gruppieren
        const groupedItems = groupItemsByDay(allItems);
        
        // 4. Tagesblöcke rendern
        const sortedDays = Object.keys(groupedItems).sort().reverse(); // Neueste Tage zuerst
        listContainer.innerHTML = sortedDays.map(dayKey => 
            renderDayBlock(dayKey, groupedItems[dayKey])
        ).join('');
        
        if (typeof lucide !== 'undefined') lucide.createIcons();

    } catch (error) {
        console.error("Fehler beim Laden der Chronik:", error);
        showNotification("Chronik konnte nicht geladen werden", "error");
        render(EmptyStateCard('Fehler', 'Beim Laden der Chronik ist ein Fehler aufgetreten.', 'alert-triangle', ''), listContainer);
    }
}

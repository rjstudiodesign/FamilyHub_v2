// src/finanzen.js
// Neues Modul für die Finanzübersicht

import { 
    db, collection, query, where, orderBy, onSnapshot 
} from './firebase.js';
import { getCurrentUser } from './auth.js';
import { showNotification } from './ui.js';
import { EmptyStateCard } from './components/Card.js';
import { ExpenseCard } from './components/ExpenseCard.js'; // Wir nutzen die bestehende Komponente
import { render } from './components/index.js';

/**
 * Initialisiert die 'Finanzen'-Seite.
 */
export function renderFinanzen(listeners) {
    // Alten Listener bereinigen
    if (listeners.finanzen) {
        listeners.finanzen();
    }
    
    const { currentFamilyId, currentUser } = getCurrentUser();
    if (!currentFamilyId || !currentUser) return;

    // Wir laden das Template (das in index.html nur ein Platzhalter war)
    // und fügen unsere dynamischen Container hinzu.
    const container = document.getElementById('app-content');
    container.innerHTML = `
        <div class="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
            <h2 class="text-xl font-bold text-gradient">Finanzübersicht</h2>
            
            <button class="cta-primary-glow w-full md:w-auto" onclick="window.openCreatePostModal()">
                <i data-lucide="plus" class="w-5 h-5 mr-2"></i>
                <span>Neue Ausgabe</span>
            </button>
        </div>
        
        <div id="finance-charts-container" class="mb-6">
            </div>

        <h3 class="text-lg font-semibold text-white mb-4">Alle Ausgaben</h3>
        <div id="finance-list-container" class="space-y-4">
            <div class="spinner mx-auto"></div>
        </div>
    `;

    const listContainer = document.getElementById('finance-list-container');

    // Lade alle Posts vom Typ 'expense', an denen ich beteiligt war
    const expensesQuery = query(
        collection(db, 'families', currentFamilyId, 'posts'),
        where('type', '==', 'expense'),
        where('participants', 'array-contains', currentUser.uid),
        orderBy('createdAt', 'desc')
    );

    listeners.finanzen = onSnapshot(expensesQuery, (snapshot) => {
        if (snapshot.empty) {
            const emptyHTML = EmptyStateCard(
                'Keine Ausgaben erfasst',
                'Erfasse deine erste private Ausgabe über den Button "Neue Ausgabe".', // Text angepasst
                'piggy-bank', 
                '' // Kein Button
            );
            render(emptyHTML, listContainer);
            if (typeof lucide !== 'undefined') lucide.createIcons();
            return;
        }
        
        // Nutze die ExpenseCard-Komponente, um die Liste zu rendern
        const expensesHTML = snapshot.docs.map(doc => {
            const post = { id: doc.id, ...doc.data() };
            // ExpenseCard erwartet das 'post'-Objekt
            return ExpenseCard(post); 
        }).join('');
        
        render(expensesHTML, listContainer);
        if (typeof lucide !== 'undefined') lucide.createIcons();

    }, (error) => {
        console.error("Error loading expenses:", error);
        showNotification("Fehler beim Laden der Finanzen", "error");
        render("<p class'text-red-500 p-4'>Fehler beim Laden der Ausgaben.</p>", listContainer);
    });
}

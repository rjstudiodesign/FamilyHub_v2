// navigation.js – Modul für die Navigation

/**
 * navigation.js - Intelligenter, asynchroner Router für FamilyHub
 *
 * Verwaltet das Laden von Seiten-Templates, initiiert die 
 * seiten-spezifische Logik und aktualisiert den globalen 
 * UI-Status (Header, Navigationsleiste).
 */

// --- 1. IMPORTS ALLER SEITEN-MODULE ---
import { renderLogin } from './login.js';
import { renderFeed } from './feed.js';
import { renderPinnwand } from './pinnwand.js';
import { renderCalendar } from './calendar.js';
import { renderGallery } from './gallery.js';
import { renderSettings } from './settings.js';
import { renderWishlist } from './wishlist.js';
import { renderChat } from './chat.js';
import { renderChallenges } from './challenges.js';
import { renderFinanzen } from './finanzen.js';
import { renderChronik } from './chronik.js'; // Importiert die Chronik

// NEU: Platzhalter für das Menü-Dashboard
const renderMenu = () => console.log('renderMenu() aufgerufen (App-Dashboard)');


// --- 2. ZENTRALE ROUTEN-DEFINITION (Single Source of Truth) ---
// Definiert alle Seiten basierend auf index.html
const routes = {
	'login': {
		templateId: 'template-login',
		init: renderLogin,
		title: 'Anmelden',
		icon: 'log-in'
	},
	'feed': {
		templateId: 'template-feed',
		init: renderFeed,
		title: 'Feed',
		icon: 'home'
	},
	'chat': {
		templateId: 'template-chat',
		init: renderChat,
		title: 'Chat',
		icon: 'message-circle'
	},
	'calendar': {
		templateId: 'template-calendar',
		init: renderCalendar,
		title: 'Kalender',
		icon: 'calendar-days'
	},
	'pinnwand': {
		templateId: 'template-pinnwand',
		init: renderPinnwand,
		title: 'Pinnwand',
		icon: 'kanban-square'
	},
	'wishlist': {
        templateId: 'template-wishlist',
        init: renderWishlist,
        title: 'Wunschlisten',
        icon: 'gift'
    },
    // --- NEUE ROUTEN-STRUKTUR ---
	'menu': { // Das neue App-Dashboard
		templateId: 'template-menu',
		init: renderMenu,
		title: 'Mehr',
		icon: 'layout-grid'
	},
	'settings': { // Die Unterseite "Einstellungen"
		templateId: 'template-settings',
		init: renderSettings,
		title: 'Einstellungen',
		icon: 'settings'
	},
	'challenges': { // Die Unterseite "Challenges"
		templateId: 'template-challenges',
		init: renderChallenges,
		title: 'Challenges',
		icon: 'award'
	},
	'finanzen': { // Die neue Unterseite "Finanzen"
		templateId: 'template-finanzen',
		init: renderFinanzen, // Nutzt jetzt die echte Funktion
		title: 'Finanzen',
		icon: 'piggy-bank'
	},
	'chronik': { // Die neue Unterseite "Chronik"
		templateId: 'template-chronik',
		init: renderChronik, // Nutzt jetzt die echte Funktion
		title: 'Chronik',
		icon: 'history'
	}
};

let lastNavigatedPage = null;
const mainContent = document.getElementById('app-content');
// Zentrales Listener-Objekt für Unsubscriber
const pageListeners = {
		posts: null,
		family: null,
		gallery: null,
		chats: null,
		pinnwand: null, 
		calendar: null, 
		wishlist: null, 
		challenges: null, 
		goals: null, 
		settings: null,
		finanzen: null,
		chronik: null // NEU: Listener-Slot für Chronik
};

/**
 * Bereinigt alle aktiven Echtzeit-Listener der vorherigen Seite.
 */
function cleanupListeners() {
		Object.keys(pageListeners).forEach(key => {
				if (typeof pageListeners[key] === 'function') {
						pageListeners[key](); // Ruft die unsubscribe-Funktion auf
						pageListeners[key] = null;
						console.log(`Listener für '${key}' wurde bereinigt.`);
				}
		});
}

/**
 * Navigiert asynchron zu einer neuen Seite.
 */
export async function navigateTo(pageId) {
	// 1. Standardseite definieren, falls keine oder eine ungültige ID übergeben wird
	const pageKey = routes[pageId] ? pageId : 'feed';

	// 2. Doppelte Navigation verhindern (außer für 'settings', da es ein Untermenü hat)
	if (lastNavigatedPage === pageKey && pageKey !== 'settings') {
		console.warn(`MapsTo('${pageKey}') wurde ignoriert (bereits aktuelle Seite).`);
		return;
	}

	// 3. WICHTIG: Alte Listener bereinigen
	// Ausnahme: Wenn wir von 'menu' zu 'settings' navigieren (oder umgekehrt),
	// bereinigen wir nicht, da die Listener (z.B. für Goals) in 'settings' aktiv bleiben sollen.
	if (pageKey !== 'settings' && lastNavigatedPage !== 'settings') {
		cleanupListeners();
	}
	lastNavigatedPage = pageKey;

	// 4. Route-Definition abrufen
	const route = routes[pageKey];
	if (!route) {
		console.error(`Keine Route für '${pageKey}' gefunden.`);
		return navigateTo('feed'); // Fallback zum Feed
	}

	try {
		// 5. UI sofort aktualisieren (Header & Nav-Leiste)
		updateHeader(route.title, route.icon);
		updateNavState(pageId); // HINWEIS: korrigiert zu pageId, nicht pageKey

		// 6. Template laden
		const template = document.getElementById(route.templateId);
		if (!template || template.tagName !== 'TEMPLATE') {
			throw new Error(`Template-Tag #${route.templateId} nicht gefunden.`);
		}

        // --- Dynamischer Seiten-Übergang ---
        // 7. Alten Inhalt ausblenden
        mainContent.classList.add('page-fade-out');

        // 8. Warten, bis die Animation abgeschlossen ist (200ms von input.css)
        setTimeout(() => {
            // 9. Inhalt im DOM rendern
            mainContent.innerHTML = template.innerHTML;

            // 10. Seiten-spezifische Logik (den "Bauleiter") aufrufen
            if (typeof route.init === 'function') {
                route.init(pageListeners);
            }

            // 11. Icons für die neue Seite initialisieren
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            
            // 12. Neuen Inhalt einblenden
            mainContent.classList.remove('page-fade-out');
            mainContent.classList.add('page-fade-in');

            // 13. Animation-Klasse nach Abschluss entfernen
            mainContent.addEventListener('animationend', () => {
                mainContent.classList.remove('page-fade-in');
            }, { once: true });

        }, 200); // Muss zur Dauer von 'fadeOut' in input.css passen

	} catch (error) {
		console.error(`Fehler beim Navigieren zu ${pageKey}:`, error);
		mainContent.innerHTML = `<p>Seite '${pageKey}' konnte nicht geladen werden.</p>`;
        mainContent.classList.remove('page-fade-out', 'page-fade-in');
		lastNavigatedPage = null; // Navigation zurücksetzen
	}
}

/**
 * Aktualisiert den Header-Titel und das Icon.
 */
function updateHeader(title, icon) {
	const headerTitle = document.getElementById('header-title');
	const headerIcon = document.getElementById('header-icon');

	if (headerTitle) headerTitle.textContent = title;
  
	// Ersetzt das Icon dynamisch mit lucide
	if (headerIcon && typeof lucide !== 'undefined') {
		headerIcon.setAttribute('data-lucide', icon);
		lucide.createIcons({
			nodes: [headerIcon]
		});
	}
}

/**
 * Aktualisiert den "active"-Status in der Bottom-Navigationsleiste.
 */
function updateNavState(pageId) {
    // Definiert, welche Haupt-Buttons 'aktiv' sein sollen,
    // auch wenn man sich in einer Unterseite befindet.
    const activeStates = {
        'menu': 'menu',
        'settings': 'menu',
        'challenges': 'menu',
        'finanzen': 'menu',
        'chronik': 'menu', // Chronik dem Menü zuordnen
        'feed': 'feed',
        'chat': 'chat',
        'calendar': 'calendar',
        'pinnwand': 'pinnwand',
        'wishlist': 'wishlist'
    };
    const activePage = activeStates[pageId] || 'feed';

	const navItems = document.querySelectorAll('#bottom-nav .nav-item');
	navItems.forEach(item => {
		if (item.dataset.page === activePage) {
			item.classList.add('active');
		} else {
			item.classList.remove('active');
		}
	});

	const desktopNavItems = document.querySelectorAll('.nav-item-desktop');
	desktopNavItems.forEach(item => {
		if (item.dataset.page === activePage) {
			item.classList.add('active');
		} else {
			item.classList.remove('active');
		}
	});
}
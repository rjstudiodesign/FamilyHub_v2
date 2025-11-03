// navigation.js – Modul für die Navigation

/**
 * navigation.js - Intelligenter, asynchroner Router für FamilyHub
 *
 * Verwaltet das Laden von Seiten-Templates, initiiert die 
 * seiten-spezifische Logik und aktualisiert den globalen 
 * UI-Status (Header, Navigationsleiste).
 */

// --- 1. IMPORTS ALLER SEITEN-MODULE ---
import { renderFeed } from './feed.js';
import { renderPinnwand } from './pinnwand.js';
// NEU: Echte Modul-Imports
import { renderCalendar } from './calendar.js';
import { renderGallery } from './gallery.js';
import { renderSettings } from './settings.js';
import { renderWishlist } from './wishlist.js';
import { renderChat } from './chat.js';

// Platzhalter-Funktionen (nur noch für fehlende Module)
const renderChallenges = () => console.log('renderChallenges() aufgerufen');
const renderChronik = () => console.log('Chronik gerendert'); // NEU: Platzhalter für Chronik

// --- 2. ZENTRALE ROUTEN-DEFINITION (Single Source of Truth) ---
// Definiert alle Seiten basierend auf index.html
const routes = {
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
	'challenges': {
		templateId: 'template-challenges',
		init: renderChallenges,
		title: 'Challenges',
		icon: 'award'
	},
	'settings': { // NEU: Fehlende Route hinzugefügt
		templateId: 'template-settings',
		init: renderSettings, // NEU: Echte Funktion
		title: 'Einstellungen',
		icon: 'settings'
	},
	'chronik': { // NEU: Fehlende Route hinzugefügt
		templateId: 'template-chronik',
		init: renderChronik,
		title: 'Chronik',
		icon: 'history'
	}
};

let lastNavigatedPage = null;
const mainContent = document.getElementById('app-content');
// NEU: Zentrales Listener-Objekt für Unsubscriber
// Dies ist entscheidend, um Memory Leaks beim Seitenwechsel zu verhindern.
const pageListeners = {
		posts: null,
		family: null,
		gallery: null,
		chats: null,
		// Fügen Sie hier weitere Listener-Keys bei Bedarf hinzu
};

/**
 * Bereinigt alle aktiven Echtzeit-Listener der vorherigen Seite.
 * Ein kritischer Schritt für die Stabilität einer SPA (Single Page Application).
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
 * Lädt das Template, rendert es, aktualisiert die UI 
 * und ruft die Initialisierungsfunktion der Seite auf.
 */
export async function navigateTo(pageId) {
	// 1. Standardseite definieren, falls keine oder eine ungültige ID übergeben wird
	const pageKey = routes[pageId] ? pageId : 'feed';

	// 2. Doppelte Navigation verhindern
	if (lastNavigatedPage === pageKey) {
		console.warn(`MapsTo('${pageKey}') wurde ignoriert (bereits aktuelle Seite).`);
		return;
	}

	// 3. WICHTIG: Alte Listener bereinigen, bevor die neue Seite geladen wird
	cleanupListeners();
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
		updateNavState(pageKey);

		// 6. Template laden
		const template = document.getElementById(route.templateId);
		if (!template || template.tagName !== 'TEMPLATE') {
			throw new Error(`Template-Tag #${route.templateId} nicht gefunden.`);
		}

		// 7. Inhalt im DOM rendern
		mainContent.innerHTML = template.innerHTML;

		// 8. Seiten-spezifische Logik (den "Bauleiter") aufrufen
		if (typeof route.init === 'function') {
			// Jede 'render'-Funktion erhält das zentrale Listener-Objekt,
			// um ihre eigenen Unsubscriber zu registrieren.
			route.init(pageListeners);
		}

		// 9. Icons für die neue Seite initialisieren
		if (typeof lucide !== 'undefined') {
			lucide.createIcons();
		}
	} catch (error) {
		console.error(`Fehler beim Navigieren zu ${pageKey}:`, error);
		mainContent.innerHTML = `<p>Seite '${pageKey}' konnte nicht geladen werden.</p>`;
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
	const navItems = document.querySelectorAll('#bottom-nav .nav-item');
  
	navItems.forEach(item => {
		if (item.dataset.page === pageId) {
			item.classList.add('active');
		} else {
			item.classList.remove('active');
		}
	});

	// NEU: Desktop-Navigation ebenfalls aktualisieren (falls vorhanden)
	const desktopNavItems = document.querySelectorAll('.nav-item-desktop');
	desktopNavItems.forEach(item => {
		if (item.dataset.page === pageId) {
			item.classList.add('active');
		} else {
			item.classList.remove('active');
		}
	});
}

// navigation.js – Veredelte Version
// (Kennt das Login-Template und nutzt die echten Module)

// --- 1. IMPORTE ALLER SEITEN-MODULE ---
import { renderFeed } from './feed.js';
import { renderPinnwand } from './pinnwand.js';
import { renderCalendar } from './calendar.js';
import { renderGallery } from './gallery.js';
import { renderSettings } from './settings.js';
import { renderWishlist } from './wishlist.js';
import { renderChat } from './chat.js';
import { renderChallenges } from './challenges.js'; // KORRIGIERT: Echter Import
import { renderFinanzen } from './finanzen.js'; // NEU
import { renderChronik } from './chronik.js'; // NEU
import { renderLogin } from './login.js'; // NEU
import { renderFamilyManagement } from './familyManagement.js'; // NEU: Erweiterte Familienverwaltung

// --- 2. ZENTRALE ROUTEN-DEFINITION (Single Source of Truth) ---
const routes = {
	'login': { 
		templateId: 'template-login',
		init: renderLogin, // KORREKTUR: renderLogin muss hier aufgerufen werden
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
	'challenges': {
		templateId: 'template-challenges',
		init: renderChallenges, // KORRIGIERT
		title: 'Challenges',
		icon: 'award'
	},
	'settings': {
		templateId: 'template-settings',
		init: renderSettings,
		title: 'Einstellungen',
		icon: 'settings'
	},
	'gallery': { // KORRIGIERT: Fehlende Route hinzugefügt
		templateId: 'template-gallery',
		init: renderGallery,
		title: 'Galerie',
		icon: 'image'
	},
	'finanzen': { // NEU
        templateId: 'template-finanzen',
        init: renderFinanzen,
        title: 'Finanzen',
        icon: 'piggy-bank'
    },
    'chronik': { // NEU (und korrigiert)
        templateId: 'template-chronik',
        init: renderChronik,
        title: 'Chronik',
        icon: 'history'
    },
    'family-management': { // NEU: Erweiterte Familienverwaltung
        templateId: 'template-family-management',
        init: renderFamilyManagement,
        title: 'Familienverwaltung',
        icon: 'users-cog'
    },
    'menu': { // NEU: Mehr/Menu page
        templateId: 'template-menu',
        init: null, // No initialization needed, just shows the template
        title: 'Mehr',
        icon: 'layout-grid'
    }
};

let lastNavigatedPage = null;
const mainContent = document.getElementById('app-content');
const authContainer = document.getElementById('auth-container'); // NEU
const pageListeners = {}; // Zentrales Listener-Objekt (unverändert)

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
export async function navigateTo(pageId, params = {}) {
	// 1. Standardseite definieren
	// (Wenn 'login' angefordert wird, aber die Route fehlt, gehe zu 'feed' - 
	// ABER: 'login' ist jetzt definiert!)
	const pageKey = routes[pageId] ? pageId : 'feed';

	// 2. Doppelte Navigation verhindern
	if (lastNavigatedPage === pageKey) {
		return;
	}

	// 3. WICHTIG: Alte Listener bereinigen
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
		// (Login-Seite hat keinen Header/Nav, aber das wird von main.js durch
		// Ausblenden der 'app-shell' gesteuert)
		updateHeader(route.title, route.icon);
		updateNavState(pageKey);

		// 6. Template laden
		const template = document.getElementById(route.templateId);
		if (!template || template.tagName !== 'TEMPLATE') {
			throw new Error(`Template-Tag #${route.templateId} nicht gefunden.`);
		}

		// 7. Inhalt im richtigen Container rendern
        const targetContainer = pageKey === 'login' ? authContainer : mainContent;
        if (targetContainer) {
		    targetContainer.innerHTML = template.innerHTML;
        } else {
            console.error(`Target container for page '${pageKey}' not found.`);
            return;
        }

		// 8. Seiten-spezifische Logik aufrufen
		if (typeof route.init === 'function') {
			// WICHTIG: Den Zielcontainer an die init-Funktion übergeben
			route.init(pageListeners, targetContainer, params); 
		}

		// 9. Icons für die neue Seite initialisieren
		if (typeof lucide !== 'undefined') {
			lucide.createIcons();
		}
	} catch (error) {
		console.error(`Fehler beim Navigieren zu ${pageKey}:`, error);
		if(mainContent) mainContent.innerHTML = `<p>Seite '${pageKey}' konnte nicht geladen werden.</p>`;
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
		item.classList.toggle('active', item.dataset.page === pageId);
	});

	const desktopNavItems = document.querySelectorAll('.nav-item-desktop');
	desktopNavItems.forEach(item => {
		item.classList.toggle('active', item.dataset.page === pageId);
	});
}
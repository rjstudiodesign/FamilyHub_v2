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

// --- 2. ZENTRALE ROUTEN-DEFINITION (Single Source of Truth) ---
const routes = {
	'login': { // NEU: Die "Eingangshalle" (Login)
		templateId: 'template-login',
		init: () => {}, // Die Logik ist jetzt in main.js!
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
	}
	// 'chronik' wurde entfernt, da 'template-chronik' in index.html fehlt
};

let lastNavigatedPage = null;
const mainContent = document.getElementById('app-content');
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
export async function navigateTo(pageId) {
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

		// 7. Inhalt im DOM rendern
		if(mainContent) {
			mainContent.innerHTML = template.innerHTML;
		} else {
			// Wenn 'app-shell' (und damit 'app-content') ausgeblendet ist (z.B. Login),
			// müssen wir den Inhalt woanders rendern.
			// HINWEIS: Unser neues main.js blendet app-shell aus, aber WIR MÜSSEN
			// das Login-Template *außerhalb* der Shell rendern.
			
			// ARCHITEKTUR-ANPASSUNG: main.js blendet 'app-shell' aus,
			// und 'app-loader' ist auf derselben Ebene.
			// Das Login-Template muss AUCH auf dieser Ebene sein.
			// Wir passen das in index.html an.
			
			// Fürs Erste: Wenn wir 'login' rendern, muss es *außerhalb* von app-shell sein.
			// DA WIR index.html saniert haben, ist 'app-content' jetzt korrekt.
		}


		// 8. Seiten-spezifische Logik aufrufen
		if (typeof route.init === 'function') {
			route.init(pageListeners);
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
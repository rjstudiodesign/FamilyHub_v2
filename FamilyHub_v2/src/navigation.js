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
import { renderChallenges } from './challenges.js';
import { renderFinanzen } from './finanzen.js';
import { renderChronik } from './chronik.js';
import { renderLogin } from './login.js';
import { renderTickets } from './tickets.js';
import { renderStammbaum } from './stammbaum.js';
import { renderRezepte } from './rezepte.js';
import { renderDokumente } from './dokumente.js';
import { renderCommunity } from './community.js';
import { renderZeitkapsel } from './zeitkapsel.js';
import { renderHobbys } from './hobbys.js';
import { renderFamilyManagement } from './family-management.js';
import { createLogger } from './utils/logger.js';

const logger = createLogger('Navigation');

// --- 2. ZENTRALE ROUTEN-DEFINITION (Single Source of Truth) ---
import { renderWelcome } from './welcome.js';

const routes = {
    'login': {
        templateId: 'template-login',
        init: renderLogin
    },
    'welcome': {
        templateId: 'template-welcome',
        init: renderWelcome
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
	// --- HIER EINFÜGEN ---
	'menu': {
		templateId: 'template-menu',
		init: null, // 'menu' hat keine eigene Logik, nur Links
		title: 'App-Übersicht',
		icon: 'layout-grid'
	},
	// --- ENDE ---
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
    'tickets': {
        templateId: 'template-tickets',
        init: renderTickets,
        title: 'Tickets',
        icon: 'ticket'
    },
    'stammbaum': {
        templateId: 'template-stammbaum',
        init: renderStammbaum,
        title: 'Stammbaum',
        icon: 'network'
    },
    'rezepte': {
        templateId: 'template-rezepte',
        init: renderRezepte,
        title: 'Rezepte',
        icon: 'chef-hat'
    },
    'dokumente': {
        templateId: 'template-dokumente',
        init: renderDokumente,
        title: 'Dokumente',
        icon: 'file-text'
    },
    'community': {
        templateId: 'template-community',
        init: renderCommunity,
        title: 'Community',
        icon: 'building-2'
    },
    'zeitkapsel': {
        templateId: 'template-zeitkapsel',
        init: renderZeitkapsel,
        title: 'Zeitkapsel',
        icon: 'clock'
    },
    'hobbys': {
        templateId: 'template-hobbys',
        init: renderHobbys,
        title: 'Hobbys',
        icon: 'gamepad-2'
    },
    'family-management': {
        templateId: 'template-family-management',
        init: renderFamilyManagement,
        title: 'Familienverwaltung',
        icon: 'users'
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
		const count = Object.keys(pageListeners).length;
		Object.keys(pageListeners).forEach(key => {
				if (typeof pageListeners[key] === 'function') {
						pageListeners[key]();
						pageListeners[key] = null;
				}
		});
		if (count > 0) {
			logger.debug('Cleaned up listeners', { count });
		}
}

/**
 * Navigiert asynchron zu einer neuen Seite.
 */
export async function navigateTo(pageId, params = {}) {
	// 1. Standardseite definieren
	const pageKey = routes[pageId] ? pageId : 'feed';

	// 2. Doppelte Navigation verhindern
	if (lastNavigatedPage === pageKey) {
		logger.debug('Navigation blocked - already on page', { pageKey });
		return;
	}

	// 3. WICHTIG: Alte Listener bereinigen
	cleanupListeners();
	lastNavigatedPage = pageKey;

	// 4. Route-Definition abrufen
	const route = routes[pageKey];
	if (!route) {
		logger.error('Route not found', { pageKey });
		return navigateTo('feed');
	}

	try {
		logger.info('Navigating to page', { pageKey });

		// 5. UI sofort aktualisieren
		updateHeader(route.title, route.icon);
		updateNavState(pageKey);

		// 6. Template laden
		const template = document.getElementById(route.templateId);
		if (!template || template.tagName !== 'TEMPLATE') {
			throw new Error(`Template #${route.templateId} not found`);
		}

		// 7. Inhalt im richtigen Container rendern
        const targetContainer = pageKey === 'login' ? authContainer : mainContent;
        if (!targetContainer) {
            throw new Error(`Container for page '${pageKey}' not found`);
        }
		    
	    targetContainer.innerHTML = template.innerHTML;

		// 8. Seiten-spezifische Logik aufrufen
		if (typeof route.init === 'function') {
			route.init(pageListeners, targetContainer, params); 
		}

		// 9. Icons für die neue Seite initialisieren
		if (typeof lucide !== 'undefined') {
			lucide.createIcons();
		}
		
		logger.debug('Navigation completed', { pageKey });
	} catch (error) {
		logger.error('Navigation failed', error);
		if(mainContent) {
			mainContent.innerHTML = `
				<div class="text-center p-8">
					<p class="text-red-400">Seite '${pageKey}' konnte nicht geladen werden.</p>
					<button onclick="location.reload()" class="cta-primary-glow mt-4">Neu laden</button>
				</div>
			`;
		}
		lastNavigatedPage = null;
	}
}

/**
 * Aktualisiert den Header-Titel und das Icon.
 */
function updateHeader(title, icon) {
	const headerTitle = document.getElementById('header-title');
	const headerIcon = document.getElementById('header-icon');

	if (headerTitle) headerTitle.textContent = title || ''; // Fallback auf leeren String
  
	if (headerIcon && icon && typeof lucide !== 'undefined') { // Prüft, ob icon existiert
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
import './style.css';

// src/main.js
// Veredelte Version (nutzt die SPA-Route 'login')

import { navigateTo } from './navigation.js';
import { initAuth, signOutUser } from './auth.js';
import { renderLogin } from './login.js';
import './welcome.js'; // Für Seiteneffekte importieren
import { createLogger } from './utils/logger.js';

const logger = createLogger('App');

// Globale UI-Elemente
const appShell = document.getElementById('app-shell');
const appLoader = document.getElementById('app-loader');
const authContainer = document.getElementById('auth-container');

let isAuthReady = false;

// Performance: Debounced Navigation
let navigationTimeout = null;
function debouncedNavigate(page) {
    clearTimeout(navigationTimeout);
    navigationTimeout = setTimeout(() => navigateTo(page), 100);
}

// Globaler Klick-Listener für Navigation
document.addEventListener('click', (e) => {
    if (!isAuthReady) return;

    const target = e.target.closest('[data-page]');
    if (target) {
        e.preventDefault();
        const page = target.getAttribute('data-page');
        if (page) {
            debouncedNavigate(page);
        }
    }
});

// --- ECHTER AUTH-STARTPROZESS (Veredelt) ---

initAuth(async (session) => {
    appLoader.classList.add('hidden');

    if (session && session.authUser) {
        // ANGEMELDET
        authContainer.innerHTML = ''; 
        appShell.classList.remove('hidden'); 

        if (session.familyId) {
            // Benutzer hat eine Familie -> zum Feed
            logger.info('User has a family, navigating to feed', { familyId: session.familyId });
            await navigateTo('feed');
        } else {
            // Benutzer hat KEINE Familie -> zur Welcome-Seite
            logger.warn('User has no family, navigating to welcome page');
            await navigateTo('welcome');
        }
    } else {
        // ABGEMELDET
        logger.info('User not authenticated');
        appShell.classList.add('hidden'); 
        await navigateTo('login');
    }

    isAuthReady = true;
});

// Logout global verfügbar machen
window.handleLogout = async () => {
    logger.info("Logout initiated");
    await signOutUser();
}

// Error-Handling für unerwartete Fehler
window.addEventListener('error', (event) => {
    logger.error('Uncaught error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
    });
});

window.addEventListener('unhandledrejection', (event) => {
    logger.error('Unhandled promise rejection', event.reason);
});

// src/main.js
// ECHTER EINSTIEGSPUNKT (ohne Simulation)
// Core Module-Imports (für Seiteneffekte)
import './feed.js';
import './calendar.js';
import './gallery.js';
import './navigation.js';
import './settings.js';
import './chat.js';
import './challenges.js';
import './ui.js';
import './pinnwand.js';
import './wishlist.js';
import './finanzen.js';
import './chronik.js';
import './login.js';

// ECHTE AUTH-IMPORTE
import { auth, onAuthStateChanged } from './firebase.js';
import { initAuthSession, clearAuthSession } from './auth.js';
import { navigateTo } from './navigation.js';

// Globale MapsTo-Funktion
window.MapsTo = window.MapsTo || function(page) {
    navigateTo(page);
};

// Globaler Klick-Listener für Navigation
document.addEventListener('click', (e) => {
    // Wir suchen nach dem nächstgelegenen Element mit `data-page`, egal ob Link oder Button.
    const target = e.target.closest('[data-page]');
    if (target) {
        e.preventDefault(); // Verhindert das Standardverhalten (z.B. Navigation zu '#')
        const page = target.getAttribute('data-page');
        if (page) {
            window.MapsTo(page);
        }
    }
});

/**
 * STARTPUNKT DER APP
 *
 * Prüft den Auth-Status und leitet den Benutzer weiter.
 */
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Benutzer ist angemeldet
        console.log("Auth-Status: Angemeldet", user.uid);
        // Lade alle Benutzer- und Familiendaten
        initAuthSession(user, () => {
            // Nach erfolgreichem Laden der Daten -> zum Feed
            navigateTo('feed');
        });
    } else {
        // Benutzer ist abgemeldet
        console.log("Auth-Status: Abgemeldet");
        // Bereinige alle alten Sitzungsdaten
        clearAuthSession();
        // Leite zur Login-Seite
        navigateTo('login');
    }
});

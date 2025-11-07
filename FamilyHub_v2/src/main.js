// src/main.js
// Bereinigte Version (setzt voraus, dass Login auf login.html passiert)

import { navigateTo } from './navigation.js';
import { initAuth, signOutUser } from './auth.js';
// Wir brauchen hier keine 'signIn'-Funktion mehr, das macht login.html

// Globale UI-Elemente
const appShell = document.getElementById('app-shell');
const appLoader = document.getElementById('app-loader');

// Globaler Klick-Listener für Navigation
document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-page]');
    if (target) {
        e.preventDefault();
        const page = target.getAttribute('data-page');
        if (page) {
            navigateTo(page);
        }
    }
});

// --- ECHTER AUTH-STARTPROZESS ---

// Starte die Authentifizierung. Die initAuth-Funktion meldet sich
// mit dem Ergebnis (Benutzer-Objekt oder null).
initAuth((user) => {
    if (user) {
        // ANGEMELDET
        appShell.classList.remove('hidden'); // Zeige die Haupt-App
        appLoader.classList.add('hidden');   // Verstecke den Lade-Spinner
        navigateTo('feed'); // Navigiere zum Feed als Startseite
    } else {
        // ABGEMELDET
        // Da wir uns auf index.html befinden und keinen Benutzer haben,
        // leiten wir den Browser sofort zur separaten login.html um.
        
        // Verstecke die App-Teile, um ein "Aufblitzen" zu verhindern
        appShell.classList.add('hidden');
        appLoader.classList.add('hidden');
        
        // Führe die Umleitung zur Login-Seite durch
        // (Wir nehmen an, login.html liegt im selben /src/ Ordner wie index.html)
        window.location.href = 'login.html'; 
    }
});


// (Optional) Logout global verfügbar machen, z.B. für einen Einstellungs-Button
// Diese Funktion ist nützlich für einen "Logout"-Button IN DER APP.
window.handleLogout = async () => {
    console.log("Logout wird ausgeführt...");
    await signOutUser();
    // Der onAuthStateChanged-Listener in initAuth() wird dies automatisch
    // erkennen und zur login.html weiterleiten.
}
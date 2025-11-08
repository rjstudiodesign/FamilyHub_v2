import './style.css'; // Diese Zeile ist neu

// src/main.js
// Veredelte Version (nutzt die SPA-Route 'login')

import { navigateTo } from './navigation.js';
import { initAuth, signOutUser } from './auth.js';
import { renderLogin } from './login.js'; // WICHTIG: Importiert die Login-UI-Logik

// Globale UI-Elemente
const appShell = document.getElementById('app-shell');
const appLoader = document.getElementById('app-loader');
const authContainer = document.getElementById('auth-container');

let isAuthReady = false; // NEU: Sperre für die Navigation

// Globaler Klick-Listener für Navigation
document.addEventListener('click', (e) => {
    if (!isAuthReady) return; // NEU: Navigation blockieren, bis Auth bereit ist

    const target = e.target.closest('[data-page]');
    if (target) {
        e.preventDefault();
        const page = target.getAttribute('data-page');
        if (page) {
            navigateTo(page);
        }
    }
});

// --- ECHTER AUTH-STARTPROZESS (Veredelt) ---

initAuth(async (session) => { // Async, um auf navigateTo warten zu können
    appLoader.classList.add('hidden');

    if (session && session.authUser) {
        // ANGEMELDET
        authContainer.innerHTML = ''; 
        appShell.classList.remove('hidden'); 
        await navigateTo('feed'); // Warten, bis die erste Seite geladen ist
    } else {
        // ABGEMELDET
        appShell.classList.add('hidden'); 
        await navigateTo('login'); // Warten, bis die Login-Seite geladen ist
    }

    isAuthReady = true; // ERST JETZT die Navigation für Klicks freigeben
});

// (Optional) Logout global verfügbar machen
window.handleLogout = async () => {
    console.log("Logout wird ausgeführt...");
    await signOutUser();
    // Der onAuthStateChanged-Listener oben wird dies erkennen
    // und automatisch zu navigateTo('login') wechseln.
}

// --- TEMPORÄRE FUNKTION ZUM ERSTELLEN DER FAMILIE "JÄGER" ---
import { db, doc, setDoc, collection, writeBatch, serverTimestamp } from './firebase.js';
window.createJagerFamily = async () => {
    const userId = "d4VNKIKw0oNjxV6ic4iIv2jWuEb2";
    const familyName = "Jäger";
    const userName = "Benutzer Jäger"; // Annahme, passe dies bei Bedarf an
    const userEmail = "jaeger@example.com"; // Annahme, passe dies bei Bedarf an

    console.log(`Erstelle Familie '${familyName}' für Benutzer ${userId}...`);

    try {
        const batch = writeBatch(db);

        // 1. Neue Familie erstellen
        const familyRef = doc(collection(db, 'families'));
        const familyId = familyRef.id;
        batch.set(familyRef, {
            name: familyName,
            createdAt: serverTimestamp(),
            ownerId: userId
        });
        console.log(`Familien-Dokument wird mit ID ${familyId} erstellt.`);

        // 2. Benutzer zur membersData dieser Familie hinzufügen
        const memberRef = doc(db, 'families', familyId, 'membersData', userId);
        batch.set(memberRef, {
            uid: userId,
            name: userName,
            email: userEmail,
            role: 'Admin',
            joinedAt: serverTimestamp(),
            points: 0,
            photoURL: null 
        });
        console.log(`Mitglieds-Dokument für ${userName} wird in Familie ${familyId} erstellt.`);

        // 3. Das private 'users'-Dokument des Benutzers aktualisieren, um auf die neue Familie zu verweisen
        const userRef = doc(db, 'users', userId);
        batch.update(userRef, {
            familyId: familyId
        });
        console.log(`Benutzer-Dokument ${userId} wird aktualisiert, um auf Familie ${familyId} zu verweisen.`);

        // 4. Batch ausführen
        await batch.commit();
        
        console.log("ERFOLG! Familie Jäger wurde erstellt und dem Benutzer zugewiesen.");
        alert("Familie Jäger wurde erfolgreich erstellt!");

    } catch (error) {
        console.error("FEHLER beim Erstellen der Familie:", error);
        alert("Ein Fehler ist aufgetreten. Siehe Konsole für Details.");
    }
};
// --- ENDE TEMPORÄRE FUNKTION ---
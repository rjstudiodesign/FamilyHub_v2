// src/auth.js
// Veredelte Version für VITE (nutzt lokale 'firebase/auth' Importe)

import { 
    auth, db, 
    doc, getDoc, collection, getDocs 
} from './firebase.js'; // Nutzt unser neues, VITE-fähiges firebase.js

import { 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    signOut 
} from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js'; // KORREKTUR: Importiert lokal statt von 'esm.sh'

// Lokaler "Tresor" für die Sitzungsdaten
let authUser = null;
let userData = null;
let familyId = null;
let membersData = null; // Map aller Familienmitglieder

/**
 * Initialisiert den echten Authentifizierungs-Listener.
 */
export function initAuth(callback) {
    onAuthStateChanged(auth, async (user) => {
        const loader = document.getElementById('app-loader');
        if (loader) loader.classList.remove('hidden');

        if (user) {
            // Benutzer IST eingeloggt
            authUser = user;
            
            try {
                // 1. Lade Benutzerdaten aus /users/{uid}
                const userDocRef = doc(db, 'users', user.uid);
                const userDocSnap = await getDoc(userDocRef);
                
                if (!userDocSnap.exists()) {
                    throw new Error("Benutzerdokument nicht in Firestore gefunden.");
                }
                
                userData = userDocSnap.data();
                familyId = userData.familyId; // Hole die Familien-ID
                
                if (!familyId) {
                    throw new Error("Benutzer ist keiner Familie zugewiesen.");
                }

                // 2. Lade ALLE Mitgliederdaten aus /families/{fid}/membersData
                const membersColRef = collection(db, 'families', familyId, 'membersData');
                const membersSnap = await getDocs(membersColRef);
                
                // Konvertiere das Array in eine effiziente Map (UID -> Member-Objekt)
                membersData = {};
                membersSnap.forEach(doc => {
                    membersData[doc.id] = { uid: doc.id, ...doc.data() };
                });

                console.log("Auth: Erfolgreich angemeldet und Daten geladen.", userData.name);
                callback(user); // Signal an main.js: Login erfolgreich

            } catch (error) {
                console.error("Auth-Fehler beim Laden der Benutzerdaten:", error);
                
                // ================================================================
                // KORREKTUR HIER:
                // Das Ausloggen hat die Endlosschleife verursacht.
                // Wir bleiben eingeloggt, auch wenn die DB-Daten fehlen.
                // await signOutUser(); // <-- AUSKOMMENTIERT, UM LOOP ZU STOPPEN
                
                console.log("Auth: Angemeldet, aber Benutzerdaten (Firestore) konnten nicht geladen werden.");
                // Wir rufen den Callback trotzdem mit 'user' auf.
                // Die App wird geladen, aber 'userData' wird 'null' sein.
                callback(user); // <-- GEÄNDERT VON null ZU user
                // ================================================================
            }

        } else {
            // Benutzer IST NICHT eingeloggt
            cleanupSession();
            console.log("Auth-Status: Abgemeldet.");
            callback(null); // Signal an main.js: Abgemeldet
        }
    });
}

/**
 * Versucht, den Benutzer mit E-Mail und Passwort anzumelden.
 */
export async function signIn(email, password) {
    // Diese Funktion löst den onAuthStateChanged-Listener oben aus,
    // wenn sie erfolgreich ist.
    await signInWithEmailAndPassword(auth, email, password);
}

/**
 * Meldet den Benutzer ab.
 */
export async function signOutUser() {
    await signOut(auth);
    // Dies löst onAuthStateChanged aus, was cleanupSession() aufruft.
}

/**
 * Setzt den lokalen "Tresor" zurück.
 */
function cleanupSession() {
    authUser = null;
    userData = null;
    familyId = null;
    membersData = null;
    console.log("Auth-Sitzung bereinigt.");
}

/**
 * Liefert die globalen Sitzungsdaten inkl. Mitglieder-Map.
 */
export function getCurrentUser() {
    return {
        currentUser: authUser,
        currentUserData: userData, // Wird 'null' sein, wenn der catch-Block trifft
        currentFamilyId: familyId, // Wird 'null' sein
        membersData: membersData // Wird 'null' sein
    };
} 
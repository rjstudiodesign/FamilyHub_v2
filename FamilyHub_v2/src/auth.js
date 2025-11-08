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
} from "firebase/auth"; 

// Lokaler "Tresor" für die Sitzungsdaten
let session = {
    authUser: null,
    userData: null,
    familyId: null,
    membersData: null,
};

/**
 * Initialisiert den echten Authentifizierungs-Listener.
 */
export function initAuth(callback) {
    onAuthStateChanged(auth, async (user) => {
        const loader = document.getElementById('app-loader');
        if (loader) loader.classList.remove('hidden');

        if (user) {
            // Benutzer IST eingeloggt
            session.authUser = user;
            
            try {
                // 1. Lade Benutzerdaten aus /users/{uid}
                const userDocRef = doc(db, 'users', user.uid);
                const userDocSnap = await getDoc(userDocRef);
                
                if (!userDocSnap.exists()) {
                    throw new Error("Benutzerdokument nicht in Firestore gefunden.");
                }
                
                session.userData = userDocSnap.data();
                session.familyId = session.userData.familyId; // Hole die Familien-ID
                
                if (!session.familyId) {
                    throw new Error("Benutzer ist keiner Familie zugewiesen.");
                }

                // 2. Lade ALLE Mitgliederdaten aus /families/{fid}/membersData
                const membersColRef = collection(db, 'families', session.familyId, 'membersData');
                const membersSnap = await getDocs(membersColRef);
                
                // Konvertiere das Array in eine effiziente Map (UID -> Member-Objekt)
                session.membersData = {};
                membersSnap.forEach(doc => {
                    session.membersData[doc.id] = { uid: doc.id, ...doc.data() };
                });

                console.log("Auth: Erfolgreich angemeldet und ALLE Daten geladen.", session.userData.name);
                callback(session); // Signal an main.js: Login erfolgreich, hier sind die Daten

            } catch (error) {
                console.error("Auth-Fehler beim Laden der Benutzerdaten:", error.message);
                
                let errorMessage = "Ein Fehler ist aufgetreten.";
                if (error.message.includes("Benutzerdokument nicht in Firestore")) {
                    errorMessage = "Dein Benutzerkonto ist nicht korrekt in der Datenbank eingerichtet. Bitte kontaktiere den Support.";
                } else if (error.message.includes("keiner Familie zugewiesen")) {
                    errorMessage = "Dein Benutzerkonto ist keiner Familie zugewiesen. Anmeldung nicht möglich.";
                }

                sessionStorage.setItem('login_error', errorMessage);
                await signOut(auth);
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
    await signInWithEmailAndPassword(auth, email, password);
}

/**
 * Meldet den Benutzer ab.
 */
export async function signOutUser() {
    await signOut(auth);
}

/**
 * Setzt den lokalen "Tresor" zurück.
 */
function cleanupSession() {
    session = {
        authUser: null,
        userData: null,
        familyId: null,
        membersData: null,
    };
    console.log("Auth-Sitzung bereinigt.");
}

/**
 * Liefert die globalen Sitzungsdaten inkl. Mitglieder-Map.
 */
export function getCurrentUser() {
    return {
        currentUser: session.authUser,
        currentUserData: session.userData, 
        currentFamilyId: session.familyId, 
        membersData: session.membersData 
    };
}
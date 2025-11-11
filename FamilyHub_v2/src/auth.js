// src/auth.js
// Veredelte Version für VITE (nutzt lokale 'firebase/auth' Importe)

import { 
    auth, db, 
    doc, getDoc, collection, getDocs,
    onAuthStateChanged, signInWithEmailAndPassword, signOut
} from './firebase.js';

import { createLogger } from './utils/logger.js';

const logger = createLogger('Auth'); 

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
                logger.info('Loading user data', { uid: user.uid });
                const userDocRef = doc(db, 'users', user.uid);
                const userDocSnap = await getDoc(userDocRef);
                
                if (!userDocSnap.exists()) {
                    throw new Error("USER_DOC_NOT_FOUND");
                }
                
                session.userData = userDocSnap.data();
                session.familyId = session.userData.familyId || null; // Wichtig: auf null setzen, wenn nicht vorhanden
                
                // Wenn keine familyId da ist, überspringen wir das Laden der Mitglieder
                // und geben die "unvollständige" Session zurück.
                if (!session.familyId) {
                    logger.warn('User has no family assigned', { uid: user.uid });
                    callback(session); // Wichtig: trotzdem callback aufrufen!
                    return; 
                }

                // 2. Lade ALLE Mitgliederdaten aus /families/{fid}/membersData
                logger.debug('Loading family members', { familyId: session.familyId });
                const membersColRef = collection(db, 'families', session.familyId, 'membersData');
                const membersSnap = await getDocs(membersColRef);
                
                // Konvertiere das Array in eine effiziente Map (UID -> Member-Objekt)
                session.membersData = {};
                membersSnap.forEach(doc => {
                    session.membersData[doc.id] = { uid: doc.id, ...doc.data() };
                });

                logger.info('Auth successful', { 
                    user: session.userData ? session.userData.name : 'Unknown',
                    familyMembers: Object.keys(session.membersData).length 
                });
                callback(session);

            } catch (error) {
                logger.error('Auth failed', error);
                
                let errorMessage = "Ein Fehler ist aufgetreten.";
                switch (error.message) {
                    case "USER_DOC_NOT_FOUND":
                        errorMessage = "Dein Benutzerkonto ist nicht korrekt eingerichtet. Kontaktiere den Support.";
                        break;
                    case "NO_FAMILY_ASSIGNED":
                        errorMessage = "Dein Benutzerkonto ist keiner Familie zugewiesen.";
                        break;
                    default:
                        errorMessage = `Authentifizierungsfehler: ${error.message}`;
                }

                sessionStorage.setItem('login_error', errorMessage);
                await signOut(auth);
            }

        } else {
            // Benutzer IST NICHT eingeloggt
            cleanupSession();
            logger.info("User logged out");
            callback(null);
        }
    });
}

/**
 * Versucht, den Benutzer mit E-Mail und Passwort anzumelden.
 */
export async function signIn(email, password) {
    try {
        logger.debug('Attempting sign in', { email });
        await signInWithEmailAndPassword(auth, email, password);
        logger.info('Sign in successful');
    } catch (error) {
        logger.error('Sign in failed', error);
        throw error;
    }
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
    logger.debug("Session cleaned up");
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
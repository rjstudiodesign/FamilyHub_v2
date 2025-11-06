// src/login.js
// Modul für die echte Firebase-Authentifizierung
import { auth, db, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, doc, setDoc, serverTimestamp, writeBatch } from './firebase.js';
import { showNotification, showButtonSpinner, hideButtonSpinner } from './ui.js';

/**
 * Initialisiert die Login-Seite (wird von navigation.js aufgerufen)
 */
export function renderLogin(listeners) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const toggles = document.querySelectorAll('[data-auth-toggle]');

    if (!loginForm || !registerForm) {
        console.error("Login-Template nicht korrekt geladen.");
        return;
    }

    loginForm.onsubmit = handleLogin;
    registerForm.onsubmit = handleRegister;

    toggles.forEach(toggle => {
        toggle.onclick = () => {
            const target = toggle.dataset.authToggle; // 'login' or 'register'
            if (target === 'login') {
                loginForm.classList.remove('hidden');
                registerForm.classList.add('hidden');
            } else {
                loginForm.classList.add('hidden');
                registerForm.classList.remove('hidden');
            }
        };
    });
}

/**
 * Verarbeitet den Login-Versuch
 */
async function handleLogin(e) {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    showButtonSpinner(submitBtn);

    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;

    try {
        await signInWithEmailAndPassword(auth, email, pass);
        // onAuthStateChanged in main.js wird übernehmen
    } catch (error) {
        console.error("Login-Fehler:", error);
        showNotification("Anmeldung fehlgeschlagen. Prüfe E-Mail und Passwort.", "error");
        hideButtonSpinner(submitBtn);
    }
}

/**
 * Verarbeitet die Registrierung
 */
async function handleRegister(e) {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    showButtonSpinner(submitBtn);

    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const pass = document.getElementById('register-pass').value;

    if (name.length < 2) {
        showNotification("Bitte gib einen gültigen Namen ein.", "warning");
        hideButtonSpinner(submitBtn);
        return;
    }

    try {
        // 1. Firebase Auth User erstellen
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        const user = userCredential.user;

        // 2. Firebase Auth Profil aktualisieren (für .displayName)
        await updateProfile(user, { displayName: name });

        // 3. (WICHTIG) Firestore-Datenstruktur für den neuen Nutzer anlegen
        await _createInitialUserData(user.uid, name, email);

        // onAuthStateChanged in main.js wird übernehmen
    } catch (error) {
        console.error("Registrierungs-Fehler:", error);
        if (error.code === 'auth/email-already-in-use') {
            showNotification("Diese E-Mail-Adresse wird bereits verwendet.", "error");
        } else {
            showNotification("Registrierung fehlgeschlagen.", "error");
        }
        hideButtonSpinner(submitBtn);
    }
}

/**
 * (INTERN) Erstellt die notwendigen Firestore-Dokumente für einen neuen Benutzer.
 * Jeder neue Benutzer erstellt seine EIGENE Familie.
 */
async function _createInitialUserData(uid, name, email) {
    const batch = writeBatch(db);

    // 1. Eine neue Familie erstellen
    const familyRef = doc(collection(db, 'families')); // Erzeugt eine neue, leere Doc-Referenz
    const familyId = familyRef.id;
    batch.set(familyRef, {
        name: `${name}s Familie`,
        createdAt: serverTimestamp(),
        ownerId: uid
    });

    // 2. Den Benutzer zur membersData dieser Familie hinzufügen
    const memberRef = doc(db, 'families', familyId, 'membersData', uid);
    batch.set(memberRef, {
        uid: uid,
        name: name,
        email: email,
        role: 'Admin',
        joinedAt: serverTimestamp(),
        points: 0,
        photoURL: null 
    });

    // 3. Das private 'users'-Dokument des Benutzers erstellen
    const userRef = doc(db, 'users', uid);
    batch.set(userRef, {
        uid: uid,
        name: name,
        email: email,
        familyId: familyId // WICHTIG: Verknüpfung zur Familie
    });

    // 4. Batch ausführen
    await batch.commit();
}

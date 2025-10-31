// src/auth.js

// Globale Variablen, um den Zustand der simulierten Sitzung zu speichern.
let authUser = null;
let familyId = null;
let userData = null;
let membersData = null;

/**
 * Simuliert den Anmelde- und Familienlade-Prozess.
 */
export function initAuth(onAuthSuccess) {
  setTimeout(() => {
    // 1. Simulierter Firebase Auth User
    authUser = {
      uid: 'demo-user-uid-123',
      name: 'Rj Studiodesign',
      email: 'rj@familyhub.local',
    };

    // 2. Simulierte Familien-ID
    familyId = 'demo-family-id-456';

    // 3. Simulierte Firestore-Benutzerdaten
    userData = {
      name: 'Rj Studiodesign',
      role: 'Admin',
      photoURL: null // (kann hier für Tests gesetzt werden)
    };

    // 4. Simulierte Mitglieder-Daten (Map: userId → memberObjekt)
    membersData = {
      'demo-user-uid-123': {
        uid: 'demo-user-uid-123',
        name: 'Rj Studiodesign',
        role: 'Admin',
        photoURL: null
      },
      'demo-user-uid-456': {
        uid: 'demo-user-uid-456',
        name: 'Alex Beispiel',
        role: 'Member',
        photoURL: null
      },
      'demo-user-uid-789': {
        uid: 'demo-user-uid-789',
        name: 'Sam Muster',
        role: 'Member',
        photoURL: null
      }
    };

    console.log("Auth-Simulation erfolgreich:", authUser.name, familyId);

    if (typeof onAuthSuccess === 'function') {
      onAuthSuccess(authUser);
    }
  }, 300);
}

/**
 * Liefert die globalen Sitzungsdaten inkl. Mitglieder-Map.
 */
export function getCurrentUser() {
  return {
    currentUser: authUser,
    currentFamilyId: familyId,
    currentUserData: userData,
    membersData: membersData
  };
}
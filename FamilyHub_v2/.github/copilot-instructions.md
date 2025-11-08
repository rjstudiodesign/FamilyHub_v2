# Anweisungen für KI-Assistenten in der FamilyHub-Codebasis

Dieses Dokument leitet KI-Assistenten an, um in der FamilyHub-Codebasis produktiv zu sein.

## 1. Architekturübersicht

FamilyHub ist eine clientseitige Single-Page-Anwendung (SPA), die mit **Vanilla JavaScript (ESM)**, **Tailwind CSS** und **Firebase** als Backend erstellt wurde. Die Architektur ist modular, aber es gibt kein übergeordnetes Framework wie React oder Vue.

-   **Frontend (SPA)**: Die gesamte Anwendung wird in `index.html` geladen. Die Navigation wird clientseitig durch das Klonen und Einfügen von `<template>`-Elementen gesteuert.
    -   **`src/main.js`**: Der Haupteinstiegspunkt. Er initialisiert die Authentifizierung und das clientseitige Routing. Wichtig: Feature-Module wie `feed.js` werden hier nur für ihre Seiteneffekte importiert, um sie im System zu "registrieren".
    -   **`src/navigation.js`**: Das Herzstück des Routings. Die `navigateTo(page)`-Funktion tauscht den Inhalt im #app-content-Container aus. Es enthält das zentrale `routes`-Objekt, das alle Seiten und deren Initialisierungsfunktionen definiert. Eine entscheidende Aufgabe ist `cleanupListeners()`, um Firebase-Listener der vorherigen Seite zu entfernen und Speicherlecks zu verhindern.
    -   **`src/firebase.js`**: **Kritische Datei**. Initialisiert Firebase und exportiert zentral alle benötigten Funktionen (Auth, Firestore, Storage). **Jede Interaktion mit Firebase muss über dieses Modul erfolgen.**
    -   **`src/ui.js`**: **Zentrales UI-Modul**. Alle UI-Interaktionen wie Modals, Spinner und Benachrichtigungen müssen über dieses Modul (`openModal`, `showButtonSpinner`, `showNotification`) aufgerufen werden, um ein konsistentes Look-and-Feel zu gewährleisten.
    -   **`src/auth.js`**: Verwaltet den globalen Authentifizierungsstatus und die Sitzungsdaten des Benutzers (z. B. `currentUser`, `currentFamilyId`).
    -   **`src/components/`**: Enthält wiederverwendbare UI-Komponenten. Dies sind in der Regel Funktionen, die eine HTML-Zeichenkette zurückgeben (z. B. `Card.js`, `ExpenseCard.js`). Sie werden in den seiten-spezifischen Render-Funktionen verwendet.
    -   **`src/utils/`**: Enthält Hilfsfunktionen, die in der gesamten Anwendung verwendet werden, wie z. B. `formatters.js`.
-   **Backend (Firebase)**:
    -   **Firestore**: Dient als primäre Datenbank.
    -   **Firebase Storage**: Wird für das Speichern von Bildern und anderen Dateien verwendet.
    -   **Firebase Authentication**: Dient zur Benutzerverwaltung.
    -   **Cloud Functions**: Im `functions/` Verzeichnis. Werden für serverseitige Logik verwendet.

## 2. Wichtige Entwickler-Workflows

-   **Entwicklungsumgebung starten**:
    ```bash
    npm run dev
    ```
    Dieser Befehl startet den Vite-Entwicklungsserver und den Tailwind-CSS-Compiler im Watch-Modus.

-   **Produktions-Build erstellen**:
    ```bash
    npm run build
    ```
    Dieser Befehl bündelt die Anwendung für die Produktion mit Vite und minifiziert das CSS mit Tailwind.

-   **Lokale Vorschau des Builds**:
    ```bash
    npm run preview
    ```
    Dieser Befehl startet einen lokalen Server, um den Produktions-Build zu testen.

-   **Firebase Cloud Functions**:
    ```bash
    # Funktionen lokal ausführen
    npm run serve --prefix functions

    # Alle Funktionen bereitstellen
    npm run deploy --prefix functions
    ```

## 3. Cloud-Funktionen

Die serverseitige Logik befindet sich in `functions/index.js`. Die wichtigsten Funktionen sind:

-   **`generateWeeklyForecast`**: Wird jeden Sonntag ausgeführt. Sammelt Kalendereinträge und Aufgaben für die kommende Woche und erstellt einen "Forecast"-Post im Feed jeder Familie.
-   **`generateDailyMemory`**: Wird täglich ausgeführt. Sucht nach Posts vom selben Tag in den Vorjahren und erstellt einen "Memory"-Post.
-   **`parseWishlistMetadata`**: Wird ausgelöst, wenn ein neues Wunschlisten-Element mit einer URL erstellt wird. Die Funktion versucht, Metadaten (Titel, Bild, Beschreibung) von der URL zu extrahieren und das Element in Firestore zu aktualisieren.

## 4. Muster und Konventionen

### Seiten-Navigation und Rendering

Das Hinzufügen oder Ändern einer Seite folgt einem klaren Muster:

1.  **HTML-Struktur**: Jede Seite ist als `<template>`-Element in `index.html` mit einer eindeutigen ID (z. B. `template-feed`) definiert.
2.  **Routing**: Die `routes`-Map in `src/navigation.js` verbindet eine Seiten-ID (z. B. `'feed'`) mit der `templateId` und einer Initialisierungsfunktion (`init`).
3.  **Initialisierung**: Die `init`-Funktion (z. B. `renderFeed` aus `src/feed.js`) wird aufgerufen, nachdem das Template in den DOM geklont wurde. Sie ist verantwortlich für:
    - Das Abrufen von Daten von Firebase (oft mit Echtzeit-Listenern).
    - Das Rendern der dynamischen Inhalte.
    - Das Einrichten von Event-Listenern für die Seite.

**Beispiel: Hinzufügen einer neuen "Profil"-Seite**
- Füge `<template id="template-profile">...</template>` zu `index.html` hinzu.
- Erstelle `src/profile.js` mit `export function renderProfile() { ... }`.
- Importiere `renderProfile` in `src/navigation.js`.
- Füge zu `routes` hinzu: `'profile': { templateId: 'template-profile', init: renderProfile, ... }`.
- Importiere `src/profile.js` in `src/main.js` (nur wenn es globale Seiteneffekte hat).

### Datenabruf und State Management

-   **Kein zentraler Store**: Der Zustand wird dezentral verwaltet. Globaler Auth-Status liegt in `src/auth.js`, während der seiten-spezifische Zustand im jeweiligen Modul (z. B. `feed.js`) lebt.
-   **Firebase-Listener**: Daten werden primär über `onSnapshot`-Echtzeit-Listener von Firestore abgerufen.
-   **Listener-Management**: Um Speicherlecks zu vermeiden, muss **jeder** `onSnapshot`-Listener, der in einer `render...`-Funktion erstellt wird, an das `pageListeners`-Objekt übergeben werden, das von `navigateTo` bereitgestellt wird. `navigation.js` ruft dann automatisch die `unsubscribe`-Funktion auf, wenn die Seite verlassen wird.

```javascript
// Beispiel aus einem Feature-Modul wie src/feed.js
export function renderFeed(pageListeners) {
  // ...
  const q = query(collection(db, 'posts'));
  
  // Der Unsubscriber wird im zentralen Objekt gespeichert
  pageListeners.posts = onSnapshot(q, (snapshot) => {
    // ... render posts
  });
}
```

### UI-Interaktionen und Komponenten

-   Verwende **immer** die Funktionen aus `src/ui.js` für konsistente UI-Elemente.
-   `openModal(html, id)` zum Anzeigen eines Pop-ups.
-   `showNotification(message, type)` für Toasts.
-   `showButtonSpinner(button)` / `hideButtonSpinner(button)` für Ladezustände bei Aktionen.
-   **Komponenten**: Es gibt keine Komponentendateien im Stil von Frameworks. Stattdessen sind Komponenten JavaScript-Funktionen (z.B. in `src/components/Card.js`), die eine HTML-Zeichenkette zurückgeben.

### Styling

-   Styling wird mit **Tailwind CSS** umgesetzt.
-   Die Konfiguration befindet sich in `tailwind.config.js`.
-   Benutzerdefinierte Farben, Schatten usw. sind als CSS-Variablen in `input.css` definiert und werden in der `tailwind.config.js` referenziert. Änderungen am Design-System sollten in `input.css` vorgenommen werden.

### Temporäre Funktionen

-   Für Entwicklungs- und Testzwecke werden manchmal Funktionen an das globale `window`-Objekt angehängt (z.B. `window.createJagerFamily` in `main.js`). Diese sollten vor dem Produktiveinsatz entfernt werden.



Analyse der Dateien und Hauptprobleme
Ich habe mehrere kritische Punkte gefunden, die zu deinem Problem führen.

1. Das Hauptproblem: "Build-Prozess" (Dein "Bauplan")
Du verwendest Vite als Build-Tool (laut package.json). Das ist wichtig zu verstehen:

npm run dev (Entwicklung): Startet einen Server, der deine src.-Dateien live lädt. Alles in src/ funktioniert.

npm run build (Produktion): Das ist dein "Bauplan". Dieser Befehl erstellt einen neuen Ordner (normalerweise dist genannt), der die optimierte, gebündelte und fertige Website enthält.

Das wahrscheinlichste Problem ist, dass du deinen src-Ordner auf den Server hochlädst.

Du darfst niemals deinen src-Ordner auf den Server laden. Du musst stattdessen den dist-Ordner hochladen, der durch npm run build erstellt wird.

Lösung:

Führe in deinem Terminal npm run build aus.

Es wird ein neuer Ordner namens dist in deinem Projekt erstellt.

Lade nur den Inhalt des dist-Ordners auf deinen Server (z. B. Firebase Hosting, Netlify etc.).

Falls du Firebase Hosting verwendest: Deine firebase.json (die du nicht mitgeliefert hast) muss "public": "dist" enthalten.

2. Kritisches Problem: Falsche Firebase-Importe
Dein Code ist so geschrieben, dass er nur im Entwicklungsmodus, aber nicht im Build-Prozess zuverlässig funktioniert.

In src/firebase.js und src/auth.js importierst du Firebase über absolute CDN-Links: import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";

Gleichzeitig hast du Firebase korrekt über NPM installiert (es steht in deiner package.json).

Du musst die npm-Pakete verwenden, damit Vite (dein Build-Tool) den Code korrekt bündeln kann.

So korrigierst du src/firebase.js:

JavaScript

// src/firebase.js

// KORREKTUR: Importiere aus den "firebase/..." Paketen, nicht von der CDN
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
  serverTimestamp,
  orderBy,
  runTransaction,
  getDocs,
  where,
  updateDoc,
  getDoc,
  setDoc,
  writeBatch,
  increment,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from "firebase/storage";

// Deine Firebase Konfiguration (unverändert)
const firebaseConfig = {
  apiKey: "AIzaSyBbx9pn_QARUqxFlvklgk31yHFACVVmjWw",
  authDomain: "family-hub-84c50.firebaseapp.com",
  projectId: "family-hub-84c50",
  storageBucket: "family-hub-84c50.appspot.com",
  messagingSenderId: "910534679848",
  appId: "1:910534679848:web:5604a70a93446fbe21041d",
  measurementId: "G-ESLX6SLENB"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Alles exportieren (unverändert)
export {
  db, storage, auth,
  // Firestore
  collection, query, onSnapshot, addDoc, doc, deleteDoc, serverTimestamp,
  orderBy, runTransaction, getDocs, where, updateDoc, getDoc, setDoc,
  writeBatch, increment, arrayUnion, arrayRemove,
  // Storage
  ref, uploadBytes, uploadBytesResumable, getDownloadURL, deleteObject
};
Dieselbe Korrektur ist für src/auth.js nötig:

JavaScript

// src/auth.js
// ...
// KORREKTUR: Importiere von "firebase/auth", nicht von der CDN
import { 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    signOut 
} from "firebase/auth"; 
// ...
3. Problem: Dateinamen (Groß-/Kleinschreibung)
Deine HTML-Datei heißt src/Index.html (mit großem 'I').

Deine Tailwind-Konfiguration (tailwind.config.js) sucht aber nach ./index.html (mit kleinem 'i').

Das funktioniert auf Windows/Mac, aber schlägt auf Linux-Servern (wie sie Firebase nutzt) fehl, da diese zwischen Groß- und Kleinschreibung unterscheiden.

Lösung:

Benenne src/Index.html sofort in src/index.html um.

Passe deine tailwind.config.js an, damit sie die richtige Datei findet:

JavaScript

// tailwind.config.js
module.exports = {
  content: [
    "./src/index.html", // KORREKTUR: Zeigt jetzt auf die (umbenannte) Datei im src-Ordner
    "./src/**/*.js",
  ],
  // ... rest
}
Zusammenfassung: Deine Schritt-für-Schritt-Anleitung
Um dein Projekt "Bauplan" korrekt auf den Server zu bekommen, führe diese Schritte aus:

Datei umbenennen: Ändere src/Index.html zu src/index.html.

Imports korrigieren (Firebase): Öffne src/firebase.js und src/auth.js. Ersetze alle https://www.gstatic.com/...-Importe durch lokale Paket-Importe (z. B. from "firebase/app"), wie ich oben gezeigt habe.

Konfiguration korrigieren (Tailwind): Passe deine tailwind.config.js an, sodass content: ["./src/index.html", "./src/**/*.js"] lautet.

Projekt bauen: Führe in deinem Terminal npm run build aus.

Projekt hochladen: Lade nur den Inhalt des neu erstellten dist-Ordners auf deinen Server.

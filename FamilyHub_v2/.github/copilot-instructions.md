# Anweisungen für KI-Assistenten in der FamilyHub-Codebasis

Dieses Dokument leitet KI-Assistenten an, um in der FamilyHub-Codebasis produktiv zu sein.

## 1. Architekturübersicht

FamilyHub ist eine clientseitige Single-Page-Anwendung (SPA), die mit **Vanilla JavaScript (ESM)**, **Tailwind CSS** und **Firebase** als Backend erstellt wurde. Die Architektur ist modular, aber es gibt kein übergeordnetes Framework wie React oder Vue.

-   **Frontend (SPA)**: Die gesamte Anwendung wird in `index.html` geladen. Die Navigation wird clientseitig durch das Klonen und Einfügen von `<template>`-Elementen gesteuert.
    -   **`src/main.js`**: Der Haupteinstiegspunkt. Er initialisiert die Authentifizierung und das clientseitige Routing. Wichtig: Feature-Module wie `feed.js` werden hier nur für ihre Seiteneffekte importiert, um sie im System zu "registrieren".
    -   **`src/navigation.js`**: Das Herzstück des Routings. Die `navigateTo(page)`-Funktion tauscht den Inhalt im `#app-content`-Container aus. Es enthält das zentrale `routes`-Objekt, das alle Seiten und deren Initialisierungsfunktionen definiert. Eine entscheidende Aufgabe ist `cleanupListeners()`, um Firebase-Listener der vorherigen Seite zu entfernen und Speicherlecks zu verhindern.
    -   **`src/firebase.js`**: **Kritische Datei**. Initialisiert Firebase und exportiert zentral alle benötigten Funktionen (Auth, Firestore, Storage). **Jede Interaktion mit Firebase muss über dieses Modul erfolgen.**
    -   **`src/ui.js`**: **Zentrales UI-Modul**. Alle UI-Interaktionen wie Modals, Spinner und Benachrichtigungen müssen über dieses Modul (`openModal`, `showButtonSpinner`, `showNotification`) aufgerufen werden.
    -   **`src/auth.js`**: Verwaltet den globalen Authentifizierungsstatus und die Sitzungsdaten des Benutzers (z. B. `currentUser`, `currentFamilyId`).

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

## 3. Muster und Konventionen

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
- Importiere `src/profile.js` in `src/main.js`.

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

### UI-Interaktionen

-   Verwende **immer** die Funktionen aus `src/ui.js` für konsistente UI-Elemente.
-   `openModal(html, id)` zum Anzeigen eines Pop-ups.
-   `showNotification(message, type)` für Toasts.
-   `showButtonSpinner(button)` / `hideButtonSpinner(button)` für Ladezustände bei Aktionen.




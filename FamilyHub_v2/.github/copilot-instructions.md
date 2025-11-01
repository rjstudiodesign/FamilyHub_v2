# FamilyHub v2 - Copilot Instructions

This document provides guidance for AI assistants to effectively contribute to the FamilyHub v2 codebase.

## Architecture Overview

FamilyHub is a client-side, single-page application (SPA) built with vanilla JavaScript, HTML, and Tailwind CSS. It uses Firebase for its backend services, including Authentication, Firestore (database), and Storage.

The application is structured in a modular way. Each primary feature (or "page") has its own dedicated JavaScript module in the `src/` directory.

-   **`index.html`**: The single HTML file that serves as the application's shell. It contains `<template>` elements for each page (e.g., `<template id="template-feed">`).
-   **`src/main.js`**: The main entry point. It initializes authentication and the navigation system.
-   **`src/navigation.js`**: Handles the client-side routing. It dynamically loads page content from the `<template>` tags into the `<main id="app-content">` container based on user actions.
-   **`src/firebase.js`**: Centralizes all Firebase configuration and service imports. All modules that need to interact with Firebase should import from this file, not directly from the Firebase SDK.
-   **`src/components/`**: Contains modules for creating reusable UI components.
-   **`src/` (feature modules)**: Files like `feed.js`, `calendar.js`, and `gallery.js` contain the specific logic for that feature.

## Developer Workflow

To run the project for development, you need two separate terminal sessions:

1.  **Start the Tailwind CSS compiler**: This command watches for changes in `input.css` and rebuilds the `output.css` file automatically.
    ```bash
    npm run dev:css
    ```

2.  **Start the local web server**: This serves the `index.html` and other static assets on `http://localhost:8000`.
    ```bash
    npm run dev
    ```

You can then open `http://localhost:8000` in your browser.

## Code Conventions & Patterns

### Navigation

-   Navigation is handled by `data-page` attributes on clickable elements (buttons, links).
-   A global click listener in `main.js` intercepts clicks on these elements and calls the `navigateTo(pageName)` function from `src/navigation.js`.
-   To add a new page:
    1.  Create a new `<template id="template-yourpage">` in `index.html`.
    2.  Create a corresponding `src/yourpage.js` module.
    3.  Add a `data-page="yourpage"` attribute to a navigation element.
    4.  The `navigation.js` module will automatically handle showing the new page.

### Styling with Tailwind CSS

-   The project uses a combination of Tailwind's utility classes and custom CSS variables for theming.
-   Core theme colors, gradients, and shadows are defined as CSS variables in `input.css`.
-   These variables are then mapped to Tailwind's configuration in `tailwind.config.js`. This allows using standard Tailwind classes (e.g., `bg-primary-bg`, `text-text-main`) that are powered by our custom theme.
-   When adding new theme-related colors or styles, first add them as a CSS variable in `input.css`, then expose it in `tailwind.config.js`.

### Firebase Integration

-   All Firebase services (`db`, `auth`, `storage`) and functions (`collection`, `onSnapshot`, etc.) are exported from `src/firebase.js`.
-   Feature modules should **always** import these from `src/firebase.js`. This ensures a single, consistent Firebase configuration.

**Example: Subscribing to Firestore data in a feature module**
```javascript
// In, for example, src/feed.js
import { db, collection, query, onSnapshot, orderBy } from './firebase.js';

const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));

onSnapshot(postsQuery, (snapshot) => {
  // Update the UI with new posts
});
```
. Fundament der Sicherheit: Firestore-Regeln & Datenstruktur
Der wichtigste Aspekt eines digitalen Zuhauses ist der Schutz der Privatsphäre. Die Anleitung muss die Datenarchitektur und ihre Sicherheitsimplikationen hervorheben.

Standard-Verweigerung: Jeglicher Zugriff auf Firestore muss standardmäßig verweigert werden. Die Entwicklung darf niemals mit allow read, write: if true; erfolgen, sondern muss von Anfang an auf authentifizierte Benutzer beschränkt sein.

Daten-Silostruktur: Unsere Architektur (wie in feed.js, gallery.js und pinnwand.js implementiert) isoliert Daten pro Familie. Die kanonische Struktur lautet:

/families/{familyId}/{subcollection}
(z. B. /families/demo-family-id-456/posts). Die Sicherheitsregeln müssen diese Struktur widerspiegeln und sicherstellen, dass ein Benutzer nur auf die familyId zugreifen kann, die in seinem /users/{userId}-Dokument hinterlegt ist.

2. Zentrale Dienstprogramme: Die 'Service-Schicht'
Ein elegantes Haus hat unsichtbare, zentrale Dienstprogramme. In unserer App sind dies die Module auth.js und ui.js.

Keine lokalen UI-Funktionen: Module wie feed.js dürfen niemals ihre eigenen Modals oder Benachrichtigungen implementieren. Sie müssen die zentralen Funktionen (openModal, showNotification, showButtonSpinner) aus src/ui.js importieren.

Zentraler Auth-Status: Der simulierte (oder später echte) Benutzerstatus wird ausschließlich von src/auth.js verwaltet. Jedes Modul, das Benutzerdaten benötigt (currentUser, currentFamilyId, membersData), muss diese über die getCurrentUser()-Funktion beziehen.

3. Stabilität & Langlebigkeit: Das Listener-Management
Ein Premium-SPA darf keine "digitalen Geister" (Memory Leaks) hinterlassen. Die Anleitung muss unseren Mechanismus zur Listener-Bereinigung vorschreiben.

Keine lokalen Listener: Module dürfen ihre Firestore onSnapshot-Listener nicht unkontrolliert starten.

Zentrales Management: Die MapsTo-Funktion in src/navigation.js übergibt ein pageListeners-Objekt an jede render-Funktion (z.B. renderFeed(pageListeners)). Der Unsubscribe-Callback des Listeners muss in diesem Objekt registriert werden (z.B. listeners.posts = onSnapshot(...)).

Bereinigung: navigation.js ruft cleanupListeners() bei jedem Seitenwechsel auf, um die Stabilität der App zu gewährleisten.

4. Ästhetische Kohärenz: Die Komponenten-Philosophie
Unser "Sophisticated Glow" wird durch eine strikte Trennung von Logik und Präsentation erreicht.

Komponenten sind "dumm": Module in src/components/ (wie Card.js) sind reine "Schaufensterpuppen". Sie erhalten Daten (props) und geben einen HTML-String zurück, der unsere Design-System-Klassen (glass-premium, btn-filter) verwendet. Sie enthalten keine eigene Logik oder Datenabrufe.

Module sind "schlau": Die Feature-Module (z.B. feed.js, gallery.js) sind die "Gehirne". Sie rufen Daten ab (onSnapshot), verarbeiten die Logik (z.B. getTimeAgo) und übergeben die Daten dann an die "dummen" Komponenten, um das UI zu erstellen.

5. Robustheit & Eleganz: Fehlerbehandlung
Ein Premium-Erlebnis scheitert nicht lautlos.

Datenbankfehler: Alle asynchronen Firebase-Operationen (addDoc, deleteDoc) oder Listener (onSnapshot) müssen in try...catch-Blöcken oder mit einem .catch()-Handler versehen sein.

Benutzer-Feedback: Im Fehlerfall (z. B. FirebaseError: Missing or insufficient permissions oder 400 Bad Request) darf die App nicht abstürzen. Stattdessen muss die showNotification(message, 'error')-Funktion aufgerufen werden, um dem Benutzer eine klare, elegante Fehlermeldung zu geben.
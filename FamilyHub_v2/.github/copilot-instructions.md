# FamilyHub v2 - Copilot Anweisungen

Dieses Dokument gibt eine Anleitung für KI-Assistenten, um in der FamilyHub-Codebasis produktiv zu sein.

## Architekturübersicht

FamilyHub ist eine clientseitige Single-Page-Anwendung (SPA), die mit Vanilla JavaScript, Tailwind CSS und Firebase erstellt wurde.

- **Frontend (SPA):** Die gesamte Anwendung wird in `index.html` geladen. Die Navigation wird clientseitig durch das Austauschen von `<template>`-Inhalten gesteuert.
  - **`src/main.js`**: Der Haupteinstiegspunkt der Anwendung. Er initialisiert die Authentifizierung und die Navigation.
  - **`src/navigation.js`**: Enthält die `navigateTo(page)`-Funktion, die für das Anzeigen der verschiedenen Seiteninhalte zuständig ist.
  - **`src/firebase.js`**: Eine entscheidende Datei, die Firebase initialisiert und alle notwendigen Firestore-, Auth- und Storage-Funktionen exportiert. Fast die gesamte Backend-Kommunikation läuft über dieses Modul.
  - **Feature-Module (`src/*.js`):** Jede Hauptfunktion (z.B. `feed.js`, `calendar.js`, `chat.js`) hat ihr eigenes Modul. Diese Module sind für die Geschäftslogik, das Abrufen von Daten aus Firebase und das Rendern der Benutzeroberfläche für ihren Bereich verantwortlich.
  - **UI-Komponenten (`src/components/*.js`):** Wiederverwendbare UI-Elemente werden als reine JavaScript-Funktionen implementiert, die DOM-Elemente erstellen und zurückgeben (z.B. `Card.js`).

- **Backend (Firebase):**
  - **Firestore:** Die NoSQL-Datenbank. Die Daten sind pro Familie strukturiert, z.B. `families/{familyId}/posts`.
  - **Authentication:** Verwaltet die Benutzeranmeldung.
  - **Storage:** Wird für das Speichern von Dateien wie Bildern in der Galerie verwendet.
  - **Cloud Functions (`functions/index.js`):** Serverlose Funktionen für Hintergrundprozesse.
    - `generateWeeklyForecast` & `generateDailyMemory`: Geplante Funktionen, die automatisch Posts im Feed erstellen.
    - `parseWishlistMetadata`: Eine durch Firestore ausgelöste Funktion, die Metadaten (Titel, Bild) von URLs abruft, wenn ein neuer Wunsch zur Wunschliste hinzugefügt wird.

- **Styling:**
  - **Tailwind CSS:** Das Styling wird mit Tailwind CSS umgesetzt. Die Konfiguration in `tailwind.config.js` definiert das Designsystem, einschließlich benutzerdefinierter Farben (`primary-bg`, `accent-primary-rose`, etc.).
  - `input.css` -> `output.css`: Der Build-Prozess für das CSS.

## Entwickler-Workflow

Um die Anwendung lokal auszuführen, müssen zwei Befehle parallel ausgeführt werden:

1.  **Starten des Webservers:**
    ```bash
    npm run dev
    ```
    Dieser Befehl startet einen einfachen Python-HTTP-Server auf Port 8000.

2.  **Kompilieren von Tailwind CSS im Watch-Modus:**
    ```bash
    npm run dev:css
    ```
    Dieser Befehl beobachtet `input.css` und `tailwind.config.js` auf Änderungen und kompiliert das CSS in `output.css`.

## Wichtige Muster und Konventionen

- **Datenfluss:**
  1. Ein Feature-Modul (z.B. `feed.js`) ruft Daten über die exportierten Funktionen aus `src/firebase.js` ab.
  2. Die abgerufenen Daten werden verarbeitet und mithilfe von UI-Komponenten aus `src/components/` in HTML-Elemente umgewandelt.
  3. Die resultierenden Elemente werden in den entsprechenden Container im DOM (`#app-content`) eingefügt.

- **Seiten-Templates:** Jede "Seite" ist in `index.html` als `<template>`-Element mit einer ID wie `template-feed` definiert. Die `navigateTo`-Funktion klont den Inhalt dieser Vorlagen, um die Ansicht zu wechseln.

- **Firebase-Nutzung:** Bevorzuge immer die Verwendung der Hilfsfunktionen, die in `src/firebase.js` exportiert werden, anstatt Firebase-SDK-Funktionen direkt zu importieren. Dies stellt eine konsistente Initialisierung sicher.

- **Cloud Functions Deployment:** Die Cloud Functions im `functions`-Verzeichnis werden separat bereitgestellt.
  - Um alle Funktionen bereitzustellen: `firebase deploy --only functions`
  - Um eine einzelne Funktion bereitzustellen: `firebase deploy --only functions:FUNCTION_NAME`

- **Abhängigkeiten:** Die Frontend-Anwendung hat `firebase` als Hauptabhängigkeit. Die Cloud Functions haben ihre eigenen Abhängigkeiten in `functions/package.json`, darunter `firebase-admin`, `axios` und `cheerio` für das Web-Scraping.

Strikte Sequenz: Du wirst drei separate Sanierungs-Befehle erhalten. Führe nur einen Befehl auf einmal aus. Warte nach Abschluss jedes Befehls auf die Bestätigung, bevor du mit dem nächsten beginnst.

Keine "Geister-Architektur": Importiere keine JavaScript-Komponenten, deren Existenz nicht bewiesen ist. Die Module ButtonGroup, LoadingButton, GhostButton und PrimaryButton existieren nicht in Button.js.

CSS statt JS: Wenn ein JavaScript-Button-Wrapper (z.B. PrimaryButton) nicht existiert, ersetze ihn durch rohes HTML (<button class="cta-primary-glow">...) und verwende die CSS-Klassen, die in input.css (z.B. .cta-primary-glow) oder styles.css definiert sind.

Zentrale Service-Module: Alle Modals, Spinner und Benachrichtigungen müssen über das zentrale ui.js-Modul (openModal, showButtonSpinner, showNotification) aufgerufen werden. Module wie calendar.js und pinnwand.js dürfen keine eigenen Implementierungen (wie prompt()) verwenden.

Zentrales Firebase-Modul: Alle Firebase-Funktionen (wie orderBy, query, arrayRemove) müssen aus der zentralen src/firebase.js-Datei importiert werden. Stelle sicher, dass firebase.js diese Funktionen auch exportiert.
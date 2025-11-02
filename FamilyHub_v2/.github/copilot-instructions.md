# Copilot-Anweisungen für FamilyHub v2

Dieses Dokument leitet KI-Assistenten an, um effektiv zur FamilyHub v2-Codebasis beizutragen.

## 1. Architekturübersicht

FamilyHub ist eine clientseitige Single-Page-Anwendung (SPA), die mit Vanilla JavaScript, HTML und Tailwind CSS erstellt wurde. Sie verwendet Firebase für Backend-Dienste (Auth, Firestore, Storage).

-   **`index.html`**: Die einzelne HTML-Datei, die als App-Shell fungiert. Sie enthält `<template>`-Elemente für jede "Seite" (z. B. `<template id="template-feed">`).
-   **`src/main.js`**: Der Einstiegspunkt der App. Er initialisiert die Authentifizierung und das Navigationssystem.
-   **`src/navigation.js`**: Behandelt das clientseitige Routing, indem es den Inhalt von `<template>` in den Container `<main id="app-content">` lädt.
-   **`src/firebase.js`**: Zentralisiert alle Firebase-Konfigurationen und Dienstimporte. **Importieren Sie Firebase-Dienste (`db`, `auth`, `storage`) und -Funktionen (`collection`, `onSnapshot`) immer aus dieser Datei.**
-   **`src/auth.js`**: Simuliert die Benutzerauthentifizierung und stellt Sitzungsdaten (Benutzer, Familien-ID) über `getCurrentUser()` bereit.
-   **`src/ui.js`**: Ein zentrales Dienstmodul für UI-Interaktionen wie Modals (`openModal`) und Benachrichtigungen (`showNotification`). Feature-Module müssen dieses verwenden, anstatt ihre eigenen zu implementieren.
-   **`src/components/`**: Enthält wiederverwendbare "dumme" Komponenten, die Daten empfangen und eine HTML-Zeichenfolge zurückgeben. Sie rufen keine eigenen Daten ab.
-   **Feature-Module (`src/*.js`)**: Jede Datei wie `feed.js` oder `calendar.js` enthält die Logik für ein bestimmtes Feature. Sie rufen Daten ab und verwenden Komponenten, um die Benutzeroberfläche zu rendern.
-   **`functions/index.js`**: Enthält serverseitige Cloud Functions, die automatisch Feed-Einträge generieren (z. B. wöchentliche Vorschau, Erinnerungen).

## 2. Entwickler-Workflow

Um das Projekt auszuführen, benötigen Sie zwei separate Terminalsitzungen:

1.  **Starten Sie den lokalen Webserver**:
    ```bash
    npm run dev
    ```
    Dies stellt das Projekt unter `http://localhost:8000` bereit.

2.  **Starten Sie den Tailwind CSS-Compiler**:
    ```bash
    npm run dev:css
    ```
    Dies überwacht CSS-Änderungen und erstellt `output.css` neu.

## 3. Wichtige Muster & Konventionen

### Daten- & Sicherheitsmodell

-   **Datentrennung**: Firestore-Daten sind streng nach Familie getrennt. Die erforderliche Struktur ist `/families/{familyId}/{subcollection}` (z. B. `/families/demo-family/posts`). Alle Datenabfragen müssen diese Grenze erzwingen.
-   **Zugriff auf Sitzungsdaten**: Um die ID des aktuellen Benutzers oder die Familien-ID zu erhalten, verwenden Sie die Funktion `getCurrentUser()` aus `src/auth.js`.

### Navigation & Zustandsverwaltung

-   **Navigation auslösen**: Die Navigation wird durch `data-page`-Attribute auf klickbaren Elementen ausgelöst. Ein globaler Klick-Listener in `main.js` ruft `navigateTo(pageName)` auf.
-   **Listener-Verwaltung**: Um Speicherlecks zu vermeiden, müssen Firestore `onSnapshot`-Listener verwaltet werden. Die `render<Page>(pageListeners)`-Funktion für jede Seite erhält ein `pageListeners`-Objekt. Die `unsubscribe`-Funktion Ihres Listeners muss diesem Objekt hinzugefügt werden. `navigation.js` kümmert sich um die Bereinigung bei Seitenwechseln.
    ```javascript
    // Beispiel in einem Feature-Modul (z. B. feed.js)
    export function renderFeed(pageListeners) {
      // ...
      const q = query(collection(db, `families/${familyId}/posts`));
      // Registrieren Sie die unsubscribe-Funktion zur Bereinigung
      pageListeners.posts = onSnapshot(q, (snapshot) => {
        // ... UI aktualisieren
      });
    }
    ```

### Styling

-   Das Projekt verwendet ein Theming-System, bei dem CSS-Variablen aus `input.css` (z. B. `--background-main`) auf die Konfiguration von Tailwind in `tailwind.config.js` abgebildet werden (z. B. `primary-bg`). Um eine neue Themenfarbe hinzuzufügen, definieren Sie sie zuerst in `input.css` und machen Sie sie dann in der Konfigurationsdatei verfügbar.

### Fehlerbehandlung

-   Alle asynchronen Firebase-Operationen (`addDoc`, `deleteDoc` usw.) müssen in `try...catch`-Blöcke eingeschlossen werden.
-   Geben Sie bei Fehlern Benutzerfeedback, indem Sie `showNotification(message, 'error')` aus `src/ui.js` aufrufen.

### Feed-Post-Typen

Der Feed ist ein Aggregator für verschiedene Arten von Inhalten, die durch das Feld `type` im Post-Dokument unterschieden werden:
-   `type: 'post'`: Ein Standard-Benutzerbeitrag.
-   `type: 'forecast'`: Eine wöchentliche Vorschau, die von einer Cloud Function in `functions/index.js` generiert wird.
-   `type: 'memory'`: Ein "An diesem Tag"-Beitrag, der von einer Cloud Function generiert wird.
-   `type: 'event'`: (Vorgeschlagen) Ein Proxy-Beitrag, der erstellt wird, wenn ein Kalenderereignis hinzugefügt wird.
-   `type: 'gallery_upload'`: (Vorgeschlagen) Ein Proxy-Beitrag für neue Galerie-Uploads.

Die Komponente `Card.js` sollte Logik enthalten, um diese verschiedenen Typen zu erkennen und sie entsprechend zu rendern.

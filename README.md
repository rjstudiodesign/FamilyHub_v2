# FamilyHub v2.0

[![Netlify Status](https://api.netlify.com/api/v1/badges/3d924148-9f43-4cea-b3ad-9dec49aa4ba0/deploy-status)](https://app.netlify.com/projects/familyhubrjstudio17/deploys)

Eine moderne, private Social-Media-Plattform für Familien. Gebaut mit Vanilla JavaScript, Tailwind CSS und Firebase.

## 🚀 Features

- **Feed**: Zentrale Aktivitäten mit Posts, Umfragen und Dankbarkeitseinträgen
- **Echtzeit-Chat**: Messaging zwischen Familienmitgliedern
- **Kalender**: Familienkalender mit Monats-/Wochen-/Tagesansicht
- **Pinnwand**: Kanban-Board für Aufgaben (Todo/In Progress/Done)
- **Wunschlisten**: Geschenk-Tracker pro Familienmitglied
- **Challenges**: Gamification mit Leaderboard & Punktesystem
- **Galerie**: Foto-/Video-Upload mit Firebase Storage
- **Einstellungen**: Profil-, Familien- und Zielverwaltung
- **🆕 Familienverwaltung**: Spezialisierte Anwendung für die Verwaltung von Großfamilien
  - Multi-Familien-Support mit Wechselfunktion
  - Erweiterte Rollenverwaltung (Admin/Mitglied)
  - Kind-Profile mit Eltern-Zuordnung
  - Umfassende Familieneinstellungen
  - Echtzeit-Synchronisation aller Änderungen

## 📋 Voraussetzungen

- Node.js >= 16.x
- npm >= 8.x
- Firebase CLI (optional für lokale Entwicklung)

## 🛠️ Entwicklung

### 1. Installation

```bash
# Repository klonen
git clone <repository-url>
cd FamilyHub_v2

# Abhängigkeiten installieren
npm install
```

### 2. Umgebungsvariablen einrichten

```bash
# .env-Datei erstellen (basierend auf .env.example)
cp .env.example .env

# Firebase-Konfiguration in .env eintragen
# WICHTIG: .env ist in .gitignore und sollte NIEMALS committed werden
```

### 3. Entwicklungsserver starten

```bash
# Frontend-Server (Vite) + Tailwind Watch
npm run dev
```

Die App ist dann verfügbar unter: `http://localhost:5173`

### 4. Firebase Emulators (Optional)

```bash
# In separatem Terminal
firebase emulators:start
```

## 🏗️ Architektur

### Ordnerstruktur

```
FamilyHub_v2/
├── src/
│   ├── main.js              # App-Einstiegspunkt
│   ├── navigation.js        # SPA-Routing-System
│   ├── firebase.js          # Firebase-Konfiguration
│   ├── auth.js              # Authentifizierung
│   ├── ui.js                # Globale UI-Services
│   ├── family-management.js # NEU: Familienverwaltung
│   ├── components/          # Wiederverwendbare UI-Komponenten
│   ├── utils/               # Helper-Funktionen
│   │   ├── logger.js        # Zentrales Logging
│   │   ├── pagination.js    # Pagination-Helper
│   │   └── imageOptimization.js # Bild-Optimierung
│   └── [feature].js         # Feature-Module (feed, chat, etc.)
├── index.html               # SPA-Shell mit Templates
├── .env                     # Environment-Variablen (NICHT committen!)
├── .env.example             # Beispiel-Konfiguration
├── FAMILY_MANAGEMENT.md     # NEU: Dokumentation Familienverwaltung
└── vite.config.js           # Vite-Build-Konfiguration
```

### Kern-Konzepte

#### 1. **SPA-Routing** (`navigation.js`)
- Template-basiert: Jede Seite ist ein `<template>`-Tag
- Listener-Management: Automatische Bereinigung bei Navigation
- Async-Navigation mit Fehlerbehandlung

#### 2. **State Management** (`auth.js`)
- Dezentraler State: Kein Redux/Vuex
- Echtzeit-Sync: `onSnapshot`-Listener in Feature-Modulen
- Session-Objekt: `{ authUser, userData, familyId, membersData }`

#### 3. **Firebase-Integration** (`firebase.js`)
- Zentrale Export-Stelle für alle Firebase-Funktionen
- Offline-Persistence aktiviert
- Environment-basierte Konfiguration

#### 4. **UI-Service-Layer** (`ui.js`)
- Konsistente Modal-Verwaltung
- Toast-Notifications (3s Auto-Hide)
- Loading-States für Buttons

## 🔐 Security Best Practices

### Environment-Variablen
```bash
# NIEMALS API-Keys direkt im Code!
# Immer .env verwenden und in .gitignore eintragen

VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
# ...
```

### Firebase Security Rules
Stelle sicher, dass Firestore Rules korrekt konfiguriert sind:
```javascript
// Beispiel: Nur Familie kann lesen/schreiben
match /families/{familyId} {
  allow read, write: if request.auth != null && 
    request.auth.uid in get(/databases/$(database)/documents/families/$(familyId)).data.memberIds;
}
```

## 🚀 Deployment

### Production Build

```bash
npm run build
```

Build-Artefakte werden in `dist/` erstellt.

### Netlify Deployment

```bash
# Automatisch bei Git Push auf main-Branch
# Konfiguration in netlify.toml
```

### Firebase Functions Deployment

```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

## 📊 Performance-Optimierungen

### Implementiert:
- ✅ Lazy-Loading von Seiten
- ✅ Listener-Cleanup bei Navigation
- ✅ Firebase Offline-Persistence
- ✅ Debounced Navigation
- ✅ Image Lazy-Loading

### Geplant:
- 🔄 Feed-Pagination (siehe `utils/pagination.js`)
- 🔄 Image-Kompression vor Upload
- 🔄 Service Worker für PWA

## 🧪 Testing

```bash
# Unit-Tests (TODO)
npm run test

# E2E-Tests (TODO)
npm run test:e2e
```

## 📝 Code-Konventionen

### Naming
- **Variablen**: camelCase (`currentUser`, `familyId`)
- **Konstanten**: UPPER_SNAKE_CASE (`LOG_LEVELS`)
- **Komponenten**: PascalCase (`PostCard`, `GalleryPostCard`)
- **Dateien**: kebab-case (`image-optimization.js`)

### Logging
```javascript
import { createLogger } from './utils/logger.js';
const logger = createLogger('ModuleName');

logger.info('Operation successful', { data });
logger.error('Operation failed', error);
```

### Error Handling
```javascript
try {
  await riskyOperation();
} catch (error) {
  logger.error('Operation failed', error);
  showNotification('Fehler aufgetreten', 'error');
  throw error; // Re-throw wenn nötig
}
```

## 🤝 Contributing

1. Feature-Branch erstellen (`git checkout -b feature/AmazingFeature`)
2. Changes committen (`git commit -m 'Add AmazingFeature'`)
3. Branch pushen (`git push origin feature/AmazingFeature`)
4. Pull Request öffnen

### Anwenden von Patches aus Pull Requests

Manchmal ist es nützlich, die Änderungen eines Pull Requests zu testen, bevor er gemerged wird. Dies kann über eine `.patch`-Datei geschehen.

1.  **Pull Request ID finden:** Finde die Nummer des Pull Requests (z.B. `16`).
2.  **Patch herunterladen:**
    ```bash
    # Ersetze <pr-nummer> mit der ID des Pull Requests
    curl -L https://github.com/rjstudiodesign/FamilyHub_v2/pull/<pr-nummer>.patch -o pr<pr-nummer>.patch
    ```
3.  **Patch anwenden:**
    ```bash
    # Stelle sicher, dass dein Arbeitsverzeichnis sauber ist
    git apply pr<pr-nummer>.patch
    ```
**Hinweis:** `git apply` ändert nur die Dateien, erstellt aber keinen Commit. Um die Änderungen rückgängig zu machen, kannst du `git checkout .` verwenden oder die Änderungen mit `git apply -R pr<pr-nummer>.patch` zurücknehmen.

## 📄 Lizenz

Private Projekt - Alle Rechte vorbehalten.

## 🐛 Bekannte Probleme

- [ ] Feed lädt alle Posts auf einmal (Pagination WIP)
- [ ] Keine Bild-Kompression beim Upload
- [ ] Fehlende Unit-Tests

## 📞 Support

Bei Fragen oder Problemen bitte Issue erstellen oder Kontakt aufnehmen.

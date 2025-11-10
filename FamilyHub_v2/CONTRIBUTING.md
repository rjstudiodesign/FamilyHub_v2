# Contributing to FamilyHub

Danke, dass du zum Projekt beitragen möchtest! Diese kurze Anleitung erklärt, wie du Beiträge (Code, Issues, PRs) sauber und effizient einreichst.

Sprache
-------
Bitte Beiträge in deutscher Sprache verfassen, sofern nicht anders vereinbart.

Code of Conduct
---------------
Behandle andere respektvoll. Keine beleidigenden oder diskriminierenden Inhalte.

Branching & Workflows
---------------------
- Haupt-Branch: `main` oder `master` (bitte Repo-Standard prüfen).
- Feature-Branches: `feature/<kurze-beschreibung>`
- Bugfix-Branches: `fix/<kurze-beschreibung>`
- Release/Hotfix: `release/<version>` oder `hotfix/<kurze-beschreibung>`

Commit-Nachrichten
------------------
Verwende klare, prägnante Commit-Messages; bevorzugt das Conventional Commits Format:

- feat: neue Funktion
- fix: Bugfix
- docs: Dokumentation
- style: Formatierung/Whitespaces
- refactor: Code-Änderungen ohne Funktionsänderung
- test: Tests hinzufügen/ändern
- chore: Wartung (Build-Tools, Config)

Beispiel:

```
feat: add wishlist module with basic CRUD
fix: feed rendering issue on android
```

Pull Request (PR)
-----------------
- Öffne ein PR gegen den Haupt-Branch.
- Beschreibe kurz das Ziel des PRs und welche Änderungen vorgenommen wurden.
- Verweise auf relevante Issues (z. B. `Closes #123`).
- Füge Screenshots oder kurze Anweisungen zum Testen hinzu, falls UI-relevant.

Code Style & Linter
-------------------
- Projekt verwendet möglicherweise ESLint/Prettier. Bitte vor dem PR lokal ausführen und Fehler beheben.
- Falls TypeScript genutzt wird, Type-Checks sicherstellen.

Tests
-----
- Schreibe Tests für neue Features oder Bugfixes, wenn möglich.
- Lokale Test-Ausführung (falls vorhanden):

```bash
npm test
# oder
yarn test
```

Lokales Setup (Quickstart)
--------------------------
1. Repository klonen

```bash
git clone <repo-url>
cd FamilyHub_v2
```

2. Abhängigkeiten installieren

```bash
npm install
# oder
yarn install
```

3. Development-Server starten

```bash
npm start
# oder
yarn start
```

4. Branch erstellen und Änderungen vornehmen

```bash
git checkout -b feature/mein-feature
```

Tests und Linter vor dem Pushen laufen lassen

```bash
npm test
npm run lint
# oder entsprechende yarn Befehle
```

Review-Prozess
--------------
- Mindestens ein Review durch ein Teammitglied ist erforderlich.
- Bei größeren Änderungen bitte vorher ein Issue erstellen und das Vorgehen kurz absprechen.

Kontakt
-------
Für Fragen zum Beitrag oder Review-Prozess wende dich an den Repo-Owner oder das Maintainer-Team (im Projekt dokumentieren).

Vielen Dank für deine Hilfe!

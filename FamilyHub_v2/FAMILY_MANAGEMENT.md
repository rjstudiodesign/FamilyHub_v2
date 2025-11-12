# Familienverwaltung (Family Management)

## Übersicht

Die Familienverwaltung ist eine spezialisierte HTML-Anwendung für die Verwaltung von Großfamilien mit Echtzeit-Firebase-Anbindung. Sie ermöglicht die Differenzierung von Familien, die Steuerung erweiterter Einstellungen und die detaillierte Bearbeitung von Mitgliedern.

## Funktionen

### 1. Familiendifferenzierung

Die Anwendung unterstützt Benutzer, die zu mehreren Familien gehören:

- **Familien-Auswahl**: Dropdown-Menü zur schnellen Umschaltung zwischen Familien
- **Multi-Familien-Support**: Benutzer können mehreren Familien gleichzeitig angehören
- **Familie erstellen**: Neue Familien mit Name und Beschreibung erstellen
- **Familie bearbeiten**: Familiendetails jederzeit aktualisieren

### 2. Erweiterte Einstellungen

Umfassende Kontrolle über Familieneinstellungen:

#### Rollenverwaltung
- **Admin-Rollen**: Mitglieder können als Administratoren festgelegt werden
- **Berechtigungen**: Admins haben erweiterte Verwaltungsrechte
- **Flexible Zuweisung**: Mehrere Admins pro Familie möglich

#### Familieneinstellungen
- **Datenschutz**:
  - Öffentliches Familienprofil aktivieren/deaktivieren
  - Einladungsberechtigungen für Mitglieder
- **Benachrichtigungen**:
  - Benachrichtigungen bei neuen Mitgliedern
  - Anpassbare Notification-Einstellungen

#### Gefahrenbereich
- **Familie verlassen**: Sicheres Verlassen mit Bestätigung
- **Familie löschen**: Permanentes Löschen (nur für Admins, erfordert Bestätigung)

### 3. Detaillierte Mitgliederverwaltung

#### Mitglieder-Übersicht
- **Profilanzeige**: Avatar, Name, Geburtstag, E-Mail
- **Statusanzeige**: Admin-Badge für Administratoren
- **Echtzeit-Updates**: Sofortige Aktualisierung bei Änderungen

#### Mitglieder hinzufügen
- **E-Mail-Einladung**: Neue Mitglieder per E-Mail einladen
- **Pending-Status**: Wartende Einladungen werden angezeigt
- **Automatische Integration**: Neue Mitglieder erscheinen sofort nach Annahme

#### Kind-Profile
- **Spezielle Profile**: Separate Profile für Kinder ohne Login
- **Eltern-Zuordnung**: 1-2 Elternteile pro Kind-Profil
- **Altersberechnung**: Automatische Altersanzeige basierend auf Geburtstag
- **Verwaltung**: Erstellen, Bearbeiten und Löschen von Kind-Profilen

### 4. Statistik-Dashboard

Übersicht über wichtige Familienkennzahlen:
- **Mitgliederanzahl**: Gesamtzahl aktiver Familienmitglieder
- **Pending Invites**: Anzahl ausstehender Einladungen
- **Administratoren**: Anzahl der Admins
- **Kind-Profile**: Anzahl der verwalteten Kind-Profile

## Technische Implementation

### Dateien

- **`/src/family-management.js`**: Hauptmodul mit gesamter Logik
- **`/index.html`**: Template `template-family-management`
- **`/src/navigation.js`**: Route-Definition

### Firebase-Struktur

```
families/{familyId}
├── name: string
├── description: string
├── createdAt: timestamp
├── createdBy: userId
├── memberIds: array<userId>
├── adminIds: array<userId>
├── pendingInvites: array<email>
├── settings: object
│   ├── publicProfile: boolean
│   ├── allowInvites: boolean
│   └── notifyNewMembers: boolean
└── membersData (subcollection)
    └── {memberId}
        ├── name: string
        ├── email: string
        ├── photoURL: string
        ├── birthday: timestamp
        ├── isChildProfile: boolean
        ├── parents: array<memberId> (nur für Kind-Profile)
        └── joinedAt: timestamp
```

### Echtzeit-Synchronisation

Das Modul verwendet Firebase `onSnapshot`-Listener für:
- Familien-Liste
- Familiendetails
- Mitglieder-Liste
- Kind-Profile

Alle Listener werden automatisch bei Seitenwechsel bereinigt (via `pageListeners`-Objekt).

### Event-Handling

- **Delegiertes Event-Handling**: Ein zentraler Event-Listener für alle Buttons
- **Modale Dialoge**: Alle Aktionen verwenden das zentrale Modal-System aus `ui.js`
- **Button-Spinner**: Loading-States während asynchroner Operationen

## Nutzung

### Zugriff auf die Seite

Die Familienverwaltung ist über das Menü erreichbar:
1. Navigiere zu "Mehr" (Menu)
2. Klicke auf "Familienverwaltung"

Alternativ über Direct-Link: `#family-management`

### Neue Familie erstellen

1. Klicke auf "+ Neue Familie erstellen"
2. Gib Familienname und optionale Beschreibung ein
3. Klicke auf "Familie erstellen"
4. Du wirst automatisch als Admin hinzugefügt
5. Deine `familyId` wird in deinem User-Dokument gespeichert

### Mitglied hinzufügen

1. Klicke auf "Mitglied hinzufügen"
2. Gib die E-Mail-Adresse ein
3. Die Einladung wird in `pendingInvites` gespeichert
4. Der eingeladene Benutzer muss die Einladung separat annehmen (UI noch zu implementieren)

### Kind-Profil erstellen

1. Klicke auf "Kind hinzufügen" oder "Kind-Profil erstellen"
2. Gib Name und Geburtstag ein
3. Wähle 1-2 Elternteile aus
4. Das Kind-Profil wird erstellt und erscheint sofort

### Rollen verwalten

1. Klicke auf "Rollen verwalten"
2. Toggle Admin-Status für Mitglieder
3. Klicke auf "Speichern"
4. Änderungen werden sofort gespeichert

### Familie wechseln

1. Wähle eine Familie aus dem Dropdown
2. Die Seite lädt automatisch neu
3. Alle Daten werden für die neue Familie geladen

## Sicherheit

### Implementierte Maßnahmen

- **Authentifizierung**: Nur eingeloggte Benutzer haben Zugriff
- **Familien-Zugehörigkeit**: Benutzer sehen nur Familien, in denen sie Mitglied sind
- **Admin-Prüfung**: Kritische Aktionen sollten Admin-Status prüfen (noch zu implementieren in Security Rules)

### Ausstehende Sicherheitsverbesserungen

1. **Firestore Security Rules**:
   ```javascript
   match /families/{familyId} {
     allow read: if request.auth.uid in resource.data.memberIds;
     allow update: if request.auth.uid in resource.data.adminIds;
     allow create: if request.auth != null;
     allow delete: if request.auth.uid in resource.data.adminIds;
   }
   ```

2. **Cloud Functions** für:
   - Automatisches Löschen von Subcollections
   - E-Mail-Versand bei Einladungen
   - Validierung von Daten

3. **Input-Validierung**: Zusätzliche Client-seitige Validierung

## Entwicklung

### Neue Funktionen hinzufügen

1. Füge neue Funktion in `family-management.js` hinzu
2. Erstelle Modal-Dialog mit `openModal()`
3. Implementiere Handler-Funktion
4. Füge Event-Listener in `setupEventHandlers()` hinzu
5. Aktualisiere UI nach Erfolg

### Debugging

Logging ist aktiviert über:
```javascript
const logger = createLogger('FamilyManagement');
logger.info('Nachricht', { data });
logger.error('Fehler', error);
```

### Testing

Empfohlener Test-Flow:
1. Familie erstellen
2. Zweiten Benutzer registrieren
3. Mitglied einladen (manuell zu `pendingInvites` hinzufügen)
4. Kind-Profil erstellen
5. Rollen ändern
6. Einstellungen anpassen
7. Familie wechseln
8. Familie verlassen

## Bekannte Einschränkungen

1. **Einladungssystem**: Backend-Integration für E-Mail-Versand fehlt
2. **Mitglieder-Bearbeitung**: UI für detaillierte Profil-Bearbeitung noch nicht implementiert
3. **Familien-Löschen**: Erfordert Cloud Function für vollständiges Löschen aller Subcollections
4. **Permissions**: Keine Firestore Rules für Rollenverwaltung

## Roadmap

### Phase 1 (Abgeschlossen)
- ✅ Grundlegende UI
- ✅ Familie erstellen/bearbeiten
- ✅ Mitglieder anzeigen
- ✅ Kind-Profile verwalten
- ✅ Rollen-System
- ✅ Einstellungen-Panel
- ✅ Echtzeit-Updates

### Phase 2 (In Arbeit)
- [ ] Einladungssystem mit E-Mail
- [ ] Detaillierte Mitglieder-Bearbeitung
- [ ] Firestore Security Rules
- [ ] Cloud Functions

### Phase 3 (Geplant)
- [ ] Familien-Statistiken erweitern
- [ ] Export-Funktion für Familiendaten
- [ ] Familien-Galerie
- [ ] Stammbaumintegration
- [ ] Notifications für Familien-Events

## Support

Bei Fragen oder Problemen:
1. Prüfe Browser-Konsole auf Fehler
2. Prüfe Firebase-Logs
3. Erstelle GitHub Issue mit Details

---

**Hinweis**: Diese Dokumentation ist Teil der FamilyHub v2.0 Codebasis.

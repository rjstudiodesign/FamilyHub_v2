# Familienverwaltung - Erweiterte Funktionen

## Übersicht

Die **Familienverwaltung** ist eine eigenständige HTML-Anwendung innerhalb von FamilyHub, die erweiterte Einstellungs- und Bearbeitungsoptionen für Familien bereitstellt. Sie ermöglicht eine umfassende Verwaltung von Familien, Mitgliedern und Einstellungen mit direkter Firebase-Integration.

## Zugriff

Die Familienverwaltung ist über das Hauptmenü erreichbar:
1. Navigiere zu **Mehr** (Layout-Grid Icon in der Navigation)
2. Klicke auf **Familienverwaltung**

## Funktionen

### 1. Familienübersicht

Die Familienübersicht zeigt Details zur aktuellen Familie:
- **Familienname**: Der Name der Familie
- **Erstellungsdatum**: Wann die Familie erstellt wurde
- **Familien-ID**: Eindeutige Kennung (kann kopiert werden)
- **Status**: Aktueller Status der Familie

**Aktionen:**
- Familie bearbeiten (Familienname ändern)

### 2. Mitgliederverwaltung

Verwalte alle Familienmitglieder mit erweiterten Funktionen:

**Anzeige:**
- Profilfoto oder generierter Avatar
- Name und E-Mail-Adresse
- Rolle (Admin/Mitglied)
- Beitrittsdatum
- Punkte (sofern aktiviert)

**Aktionen:**
- **Mitglied einladen**: Lade neue Mitglieder per E-Mail ein
- **Mitglied bearbeiten**: Ändere die Rolle eines Mitglieds
- **Mitglied entfernen**: Entferne ein Mitglied aus der Familie

**Rollen:**
- **Admin**: Volle Berechtigungen für Familienverwaltung
- **Mitglied**: Standard-Zugriff auf Familienfeatures

### 3. Erweiterte Einstellungen

Konfiguriere das Verhalten der Familie:

#### Familienkalender freigeben
- **Ein**: Alle Mitglieder können Termine erstellen und bearbeiten
- **Aus**: Nur Admins können Kalender verwalten

#### Chat-Benachrichtigungen
- **Ein**: Push-Benachrichtigungen für neue Nachrichten
- **Aus**: Keine automatischen Benachrichtigungen

#### Finanz-Tracking aktivieren
- **Ein**: Ermöglicht gemeinsame Ausgabenverwaltung
- **Aus**: Finanzfunktionen deaktiviert

#### Datenverwaltung
- **Daten exportieren**: Exportiere alle Familiendaten
- **Familie löschen**: Lösche die Familie permanent (nur für Admins)

### 4. Familienstatistiken

Übersicht über die Familienaktivität:
- **Mitglieder**: Anzahl der Familienmitglieder
- **Beiträge**: Anzahl der erstellten Posts
- **Termine**: Anzahl der Kalendereinträge

### 5. Neue Familie erstellen

Erstelle eine neue Familie und werde automatisch zum Administrator:
1. Klicke auf **Neue Familie erstellen**
2. Gib einen Familiennamen ein
3. Bestätige - Du wirst als Admin hinzugefügt

## Technische Details

### Firebase-Integration

Die Familienverwaltung nutzt direkte Firebase-Verbindungen:

**Firestore Collections:**
- `/families/{familyId}` - Familiendetails
- `/families/{familyId}/membersData/{userId}` - Mitgliederdaten
- `/families/{familyId}/posts` - Familienbeiträge
- `/families/{familyId}/events` - Kalendereinträge
- `/invites` - Einladungen

**Echtzeit-Updates:**
- Alle Daten werden in Echtzeit mit `onSnapshot` synchronisiert
- Änderungen werden sofort für alle Mitglieder sichtbar

**Batch-Operationen:**
- Atomare Transaktionen beim Erstellen neuer Familien
- Konsistente Datenaktualisierungen

### Berechtigungen

Nur Administratoren können:
- Familie bearbeiten
- Mitgliederrollen ändern
- Mitglieder entfernen
- Erweiterte Einstellungen ändern
- Familie löschen

Alle Mitglieder können:
- Familiendaten einsehen
- Statistiken ansehen
- Neue Mitglieder einladen

### Design-Konsistenz

Die Familienverwaltung verwendet:
- **Tailwind CSS** für responsives Design
- **Lucide Icons** für konsistente Symbole
- **Glass-Premium Komponenten** für moderne UI
- **Bestehende Farbschemata** für einheitliches Erscheinungsbild

## Verwendungsbeispiele

### Beispiel 1: Neue Familie erstellen
```
1. Navigiere zu Familienverwaltung
2. Klicke "Neue Familie erstellen"
3. Eingabe: "Familie Müller"
4. Bestätige
→ Familie wird erstellt, du bist Admin
```

### Beispiel 2: Mitglied einladen
```
1. In Familienverwaltung: Klicke "Mitglied einladen"
2. Eingabe: email@beispiel.de
3. Sende Einladung
→ E-Mail mit Beitrittslink wird versendet
```

### Beispiel 3: Rolle ändern
```
1. Klicke auf Menü-Icon bei einem Mitglied
2. Wähle neue Rolle: "Admin"
3. Speichere
→ Mitglied hat jetzt Admin-Rechte
```

## Fehlerbehebung

### Problem: Familiendaten werden nicht angezeigt
**Lösung:** 
- Überprüfe die Internetverbindung
- Stelle sicher, dass du angemeldet bist
- Überprüfe, ob du einer Familie zugeordnet bist

### Problem: Kann keine Mitglieder bearbeiten
**Lösung:**
- Nur Admins können Mitglieder bearbeiten
- Überprüfe deine Rolle in der Mitgliederliste

### Problem: Einstellungen werden nicht gespeichert
**Lösung:**
- Überprüfe die Firebase-Berechtigungen
- Stelle sicher, dass du Admin-Rechte hast

## Sicherheit

### Datenschutz
- Alle Daten werden in Firebase gespeichert
- Zugriff nur für angemeldete Benutzer
- Familiendaten sind nur für Familienmitglieder sichtbar

### Berechtigungen
- Firebase Security Rules kontrollieren Zugriff
- Admins haben erweiterte Berechtigungen
- Sensitive Operationen erfordern Bestätigung

## Zukünftige Erweiterungen

Geplante Features:
- [ ] Vollständiger Datenexport als JSON/CSV
- [ ] Familien-Backup und Restore
- [ ] Erweiterte Rollenverwaltung
- [ ] Aktivitätsprotokolle
- [ ] Familien-Vorlagen

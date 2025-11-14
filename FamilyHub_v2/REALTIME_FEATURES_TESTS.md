# Test-Szenarien für Echtzeit-Features

Dieses Dokument beschreibt Testfälle zur Validierung der neu implementierten Echtzeit-Features.

## Voraussetzungen

- Mindestens 2 Test-Benutzer in derselben Familie
- Browser mit geöffneten Developer Tools (für Netzwerk- und Console-Logs)
- Stabile Internetverbindung

---

## Test 1: "Tippt..."-Indikator im Chat

### Ziel
Sicherstellen, dass der Tipp-Indikator korrekt funktioniert und in Echtzeit angezeigt wird.

### Schritte

1. **Benutzer A**: Öffne einen Chat mit Benutzer B
2. **Benutzer B**: Öffne denselben Chat
3. **Benutzer A**: Beginne eine Nachricht zu tippen
4. **Benutzer B**: Beobachte den Chat

### Erwartetes Verhalten

- ✓ Benutzer B sieht "Benutzer A tippt..." mit animierten Punkten
- ✓ Die Animation zeigt drei bouncing dots
- ✓ Der Indikator verschwindet, wenn Benutzer A aufhört zu tippen (nach 3 Sekunden)
- ✓ Der Indikator verschwindet sofort, wenn Benutzer A die Nachricht sendet

### Fehlerbehandlung

- Wenn Benutzer A offline geht, verschwindet der Indikator nach spätestens 5 Sekunden

---

## Test 2: "Gelesen"-Bestätigungen

### Ziel
Validieren, dass Read Receipts korrekt angezeigt werden.

### Schritte

1. **Benutzer A**: Sende eine Nachricht an Benutzer B
2. **Benutzer A**: Beobachte die gesendete Nachricht
3. **Benutzer B**: Öffne den Chat
4. **Benutzer A**: Beobachte die Statusänderung

### Erwartetes Verhalten

- ✓ Nach dem Senden zeigt die Nachricht ein einfaches Häkchen (✓)
- ✓ Wenn Benutzer B den Chat öffnet, ändert sich das Häkchen zu einem doppelten Häkchen (✓✓)
- ✓ Das doppelte Häkchen ist blau gefärbt (accent-glow)
- ✓ Nur eigene Nachrichten zeigen Häkchen

### Edge Cases

- Alte Nachrichten ohne `read`-Feld zeigen weiterhin einfaches Häkchen
- Gruppenchats: Häkchen erscheint, wenn mindestens ein Empfänger gelesen hat

---

## Test 3: Echtzeit-Reaktionen im Feed

### Ziel
Sicherstellen, dass Reaktionen mit Animationen in Echtzeit aktualisiert werden.

### Schritte

1. **Benutzer A**: Öffne den Feed und scrolle zu einem Post
2. **Benutzer B**: Öffne denselben Feed
3. **Benutzer A**: Klicke auf den Reaktions-Button und wähle ein Emoji
4. **Benutzer B**: Beobachte die Reaktionen

### Erwartetes Verhalten

- ✓ Die Reaktion erscheint sofort bei Benutzer A (optimistic UI)
- ✓ Bei Benutzer B erscheint die Reaktion innerhalb von 1 Sekunde
- ✓ Der Zähler "poppt" kurz auf (scale animation)
- ✓ Neue Emoji-Badges gleiten sanft ein
- ✓ Bei Hover über Reaktions-Badges erscheint ein Glow-Effekt

### Performance

- Mehrere schnelle Reaktionen sollten nicht zu Verzögerungen führen
- Die Animation sollte flüssig sein (60 FPS)

---

## Test 4: Optimistic UI für Chat-Nachrichten

### Ziel
Validieren, dass Nachrichten sofort erscheinen und Fehler korrekt behandelt werden.

### Schritte - Erfolgsfall

1. **Benutzer A**: Sende eine Nachricht
2. **Beobachte** die Nachricht während des Sendens

### Erwartetes Verhalten (Erfolg)

- ✓ Nachricht erscheint sofort (optimistic)
- ✓ Nachricht ist leicht ausgegraut (opacity: 0.6)
- ✓ Nach erfolgreicher Übertragung wird die Nachricht voll sichtbar
- ✓ Temporäre Nachricht wird durch echte Nachricht ersetzt

### Schritte - Fehlerfall

1. **Simulation**: Schalte Netzwerk aus (Dev Tools > Network > Offline)
2. **Benutzer A**: Sende eine Nachricht
3. **Beobachte** die Fehlerbehandlung

### Erwartetes Verhalten (Fehler)

- ✓ Nachricht erscheint sofort mit optimistic UI
- ✓ Nach Timeout wechselt zu Error-Status (rötlicher Hintergrund)
- ✓ Fehlermeldung erscheint: "Senden fehlgeschlagen"
- ✓ Fehlerhafte Nachricht wird nach 3 Sekunden automatisch entfernt
- ✓ Notification zeigt "Senden fehlgeschlagen"

---

## Test 5: Optimistic UI für Feed-Kommentare

### Ziel
Sicherstellen, dass Kommentare sofort erscheinen und Fehler behandelt werden.

### Schritte - Erfolgsfall

1. **Benutzer A**: Öffne einen Post und klicke auf "Kommentare"
2. **Benutzer A**: Schreibe einen Kommentar und sende ihn
3. **Beobachte** den Kommentar

### Erwartetes Verhalten (Erfolg)

- ✓ Kommentar erscheint sofort ausgegraut
- ✓ Zeigt "Wird gesendet..." als Zeitstempel
- ✓ Nach erfolgreicher Übertragung wird voll sichtbar
- ✓ Zeitstempel wird aktualisiert

### Schritte - Fehlerfall

1. **Simulation**: Netzwerk offline
2. **Benutzer A**: Sende einen Kommentar
3. **Beobachte** die Fehlerbehandlung

### Erwartetes Verhalten (Fehler)

- ✓ Kommentar erscheint mit optimistic UI
- ✓ Wechselt zu Error-Status (rötlich)
- ✓ Zeigt "Fehler beim Senden"
- ✓ Wird nach 3 Sekunden entfernt
- ✓ Notification erscheint

---

## Test 6: Animationen für neue Feed-Einträge

### Ziel
Validieren, dass neue Posts sanft eingeblendet werden.

### Schritte

1. **Benutzer A**: Öffne den Feed
2. **Benutzer B**: Erstelle einen neuen Post
3. **Benutzer A**: Beobachte den Feed

### Erwartetes Verhalten

- ✓ Neuer Post erscheint oben im Feed
- ✓ Post gleitet von oben ein (translateY -20px → 0)
- ✓ Gleichzeitiges Fade-in (opacity 0 → 1)
- ✓ Animation dauert 0.4 Sekunden
- ✓ Bewegung ist smooth (ease-out)

### Hinweis

- Beim ersten Laden des Feeds gibt es keine Animation
- Nur neue Posts nach dem initialen Laden werden animiert

---

## Test 7: Performance und Stabilität

### Ziel
Sicherstellen, dass die Features die App-Performance nicht beeinträchtigen.

### Metriken

1. **Netzwerk-Traffic**: 
   - Typing-Status sollte max. alle 3 Sekunden aktualisiert werden
   - Read Receipts nur beim Öffnen des Chats

2. **Memory Leaks**:
   - Listeners werden korrekt bereinigt beim Verlassen der Seite
   - Keine wachsenden Memory-Werte über Zeit

3. **Animation Performance**:
   - Animationen sollten mit 60 FPS laufen
   - Kein Ruckeln beim Scrollen

### Tools

- Chrome DevTools > Performance
- Chrome DevTools > Memory
- Firefox DevTools > Performance

---

## Regression Tests

### Bestehende Features testen

Nach Implementierung der neuen Features, diese bestehenden Funktionen prüfen:

- ✓ Chat-Liste lädt korrekt
- ✓ Nachrichten können gesendet werden (Text, Bild, Audio)
- ✓ Feed lädt und zeigt Posts korrekt
- ✓ Reaktionen funktionieren (altes System)
- ✓ Kommentare können ohne Probleme gelesen werden
- ✓ Navigation zwischen Seiten funktioniert

---

## Browser-Kompatibilität

Features in folgenden Browsern testen:

- [ ] Chrome (Desktop)
- [ ] Firefox (Desktop)
- [ ] Safari (Desktop)
- [ ] Edge (Desktop)
- [ ] Safari iOS
- [ ] Chrome Android

---

## Bekannte Einschränkungen

Die folgenden Verhaltensweisen sind aktuell bekannt und akzeptabel:

1. **Typing Indicator**: Funktioniert nur, wenn beide Benutzer online sind
2. **Read Receipts**: Verzögerung bis zu 1 Sekunde möglich
3. **Optimistic UI**: Bei sehr langsamer Verbindung können doppelte Einträge kurz sichtbar sein
4. **Animationen**: In älteren Browsern eventuell reduziert

---

## Fehlerberichterstattung

Wenn ein Test fehlschlägt:

1. Browser und Version notieren
2. Netzwerkbedingungen dokumentieren
3. Console-Logs speichern
4. Screenshot oder Video aufnehmen
5. Schritte zur Reproduktion aufschreiben

## Automatisierte Tests (Zukünftig)

Für zukünftige Iterationen könnten folgende automatisierte Tests hinzugefügt werden:

- E2E-Tests mit Playwright für Multi-User-Szenarien
- Unit-Tests für `updateTypingStatus()` und `markMessagesAsRead()`
- Performance-Tests für Animation-Frame-Rates

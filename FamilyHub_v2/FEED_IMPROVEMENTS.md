# Feed-Verbesserungen - Implementierungsdokumentation

## Übersicht
Dieses Dokument beschreibt die drei neuen Hauptfunktionen, die in den Feed integriert wurden:

1. **Emoji-Reaktionen** (statt nur "Likes")
2. **Drag-and-Drop-Upload** für Bilder
3. **Beitrag teilen**-Funktion

---

## 1. Emoji-Reaktionen

### Firestore-Datenmodell

**Vorher (altes Modell):**
```javascript
{
  type: 'default',
  text: 'Beispiel-Post',
  authorId: 'uid123',
  likes: ['uid1', 'uid2', 'uid3'], // Array von User-IDs
  // ...
}
```

**Nachher (neues Modell):**
```javascript
{
  type: 'default',
  text: 'Beispiel-Post',
  authorId: 'uid123',
  reactions: {
    '❤️': ['uid1', 'uid2'],   // Herz-Reaktion
    '😂': ['uid3'],            // Lachen-Reaktion
    '👍': ['uid4', 'uid5'],    // Daumen hoch
    '😮': [],                  // Keine Reaktionen
    '😢': ['uid6'],            // Traurig
    '🎉': []                   // Party
  },
  // Altes 'likes' Array kann für Abwärtskompatibilität beibehalten werden
  likes: [], // Optional: Wird nicht mehr aktiv genutzt
  // ...
}
```

### Migration bestehender Posts

Bestehende Posts mit `likes: []` funktionieren weiterhin, da die neue Logik auch mit leeren `reactions: {}` umgehen kann. Um alte Posts zu migrieren, kannst du ein einmaliges Migrations-Skript ausführen:

```javascript
// Migration (einmalig ausführen in der Browser-Konsole)
async function migrateLikesToReactions() {
  const { currentFamilyId } = getCurrentUser();
  const postsRef = collection(db, 'families', currentFamilyId, 'posts');
  const snapshot = await getDocs(postsRef);
  
  for (const docSnap of snapshot.docs) {
    const post = docSnap.data();
    if (post.likes && post.likes.length > 0 && !post.reactions) {
      await updateDoc(docSnap.ref, {
        'reactions.❤️': post.likes
      });
      console.log(`Migriert: ${docSnap.id}`);
    }
  }
  console.log('Migration abgeschlossen!');
}
```

### Verwendung

**Im Code (feed.js):**
- `window.toggleReaction(postId, emoji)` - Reaktion hinzufügen/entfernen
- `window.showReactionPicker(postId, event)` - Emoji-Auswahl-Popup anzeigen

**In Card.js:**
- `renderReactions(reactions)` - Zeigt alle Reaktionen mit Zählern an

### Verfügbare Emojis
- ❤️ Herz
- 👍 Daumen hoch
- 😂 Lachen
- 😮 Überrascht
- 😢 Traurig
- 🎉 Party

Du kannst weitere Emojis in `window.showReactionPicker()` in `feed.js` hinzufügen.

---

## 2. Drag-and-Drop-Upload

### Funktionsweise

1. **Event-Listener**: Die Funktion `renderFeed()` registriert drei Event-Listener am `#app-content`-Container:
   - `dragover`: Verhindert Standard-Verhalten und fügt CSS-Klasse hinzu
   - `dragleave`: Entfernt CSS-Klasse
   - `drop`: Verarbeitet die fallen gelassenen Dateien

2. **Datei-Filter**: Nur Bilddateien (`image/*`) werden akzeptiert

3. **Upload-Modal**: Nach dem Drop öffnet sich ein Modal mit:
   - Vorschau der Bilder (Grid-Layout)
   - Textfeld für optionale Beschreibung
   - Upload-Button

4. **Upload-Logik**: 
   - Verwendet dieselbe Upload-Logik wie `gallery.js`
   - Lädt Bilder zu Firebase Storage hoch
   - Speichert Metadaten in Firestore (`families/{familyId}/media`)

### CSS-Styles

Die CSS-Klasse `.drag-over` zeigt einen visuellen Indikator:
- Gestrichelte Umrandung in Akzentfarbe
- "📸 Bilder hier ablegen" Text
- Pulse-Animation

### Verwendung

Einfach Bilder auf den Feed-Bereich ziehen und fallen lassen. Das System erkennt automatisch, ob es sich um Bilder handelt.

---

## 3. Beitrag teilen

### Funktionsweise

Die Funktion `window.sharePost(postId)` verwendet zwei Ansätze:

#### A. Web Share API (Primär)
Wenn `navigator.share` verfügbar ist (moderne mobile Browser):
```javascript
await navigator.share({
  title: 'FamilyHub Beitrag',
  text: shareText,
  url: shareUrl
});
```

#### B. Clipboard-Fallback (Sekundär)
Wenn Web Share API nicht verfügbar ist:
```javascript
await navigator.clipboard.writeText(shareText);
showNotification('Beitragstext in Zwischenablage kopiert!', 'success');
```

### Integration in Card.js

Der "Teilen"-Button wurde als dritte Aktion zu Standard-Posts hinzugefügt:

```javascript
actions: [
  { icon: 'smile', ... },      // Reaktionen
  { icon: 'message-circle', ... }, // Kommentare
  { icon: 'share-2', onClick: `window.sharePost('${post.id}')` } // NEU
]
```

### Verwendung

Klicke auf den Share-Button (📤) in der Aktionsleiste eines Beitrags:
- **Mobil**: Öffnet das native Share-Sheet des Betriebssystems
- **Desktop**: Kopiert den Beitragstext in die Zwischenablage

---

## Technische Details

### Geänderte Dateien

1. **src/feed.js**
   - Neue Funktion: `window.toggleReaction()`
   - Neue Funktion: `window.showReactionPicker()`
   - Neue Funktion: `window.sharePost()`
   - Neue Funktion: `handleDragAndDropUpload()`
   - Neue Funktion: `window.startDragUpload()`
   - Erweiterte Imports: `storage`, `ref`, `uploadBytesResumable`, `getDownloadURL`, `openModal`, `closeModal`
   - Drag-and-Drop Event-Listener in `renderFeed()`

2. **src/components/Card.js**
   - Neue Funktion: `renderReactions()`
   - Erweiterte `PostCard()` Funktion um `reactions` Parameter
   - Neue Action-Buttons für Reaktionen und Teilen

3. **src/style.css**
   - Neue CSS-Klassen für `.reaction-picker`
   - Neue CSS-Klassen für `.reaction-badge`
   - Neue CSS-Klassen für `.drag-over`
   - Animationen für Fade-in und Pulse

### Browser-Kompatibilität

- **Emoji-Reaktionen**: ✅ Alle modernen Browser
- **Drag-and-Drop**: ✅ Alle modernen Browser
- **Web Share API**: ⚠️ Hauptsächlich mobile Browser (iOS Safari, Chrome Android)
- **Clipboard API**: ✅ Alle modernen Browser (mit HTTPS)

---

## Nächste Schritte

### Optionale Erweiterungen

1. **Reaktions-Animationen**: Füge Lottie-Animationen beim Klicken auf Reaktionen hinzu
2. **Reaktions-Details**: Zeige an, welche Benutzer welche Reaktion gegeben haben (Tooltip)
3. **Drag-and-Drop-Upload-Fortschritt**: Zeige einen Fortschrittsbalken während des Uploads
4. **Share-URL**: Generiere spezifische Post-URLs für besseres Teilen
5. **Mehr Emoji-Reaktionen**: Erweitere die Emoji-Auswahl auf 12+ Emojis

### Performance-Optimierungen

1. **Lazy Loading**: Lade Reaktionen nur bei Bedarf nach
2. **Batching**: Gruppiere mehrere Reaktions-Updates in eine Transaktion
3. **Caching**: Speichere Reaktionszähler lokal, um Firestore-Lesevorgänge zu reduzieren

---

## Troubleshooting

### Reaktionen funktionieren nicht
- Überprüfe, ob das `reactions`-Objekt im Firestore-Dokument existiert
- Stelle sicher, dass Firebase-Sicherheitsregeln Schreibzugriff auf `reactions.*` erlauben

### Drag-and-Drop funktioniert nicht
- Prüfe, ob `#app-content` existiert
- Stelle sicher, dass Event-Listener nicht mehrfach registriert werden (siehe `dataset.dropListenerAttached`)

### Share-Button funktioniert nicht
- HTTPS ist erforderlich für Clipboard API
- Web Share API ist nur auf mobilen Geräten verfügbar
- Prüfe Browser-Konsole auf Fehler

---

## Lizenz & Credits

Implementiert für **FamilyHub v2**  
Datum: 2025-11-09

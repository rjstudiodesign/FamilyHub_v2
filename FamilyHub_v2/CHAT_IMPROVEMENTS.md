# Chat-Erweiterungen - Implementierungsdokumentation

## Übersicht
Dieses Dokument beschreibt die umfassenden Erweiterungen des Chat-Moduls um folgende Funktionen:

1. **Sprachnachrichten** (Voice Messages)
2. **Bilder-Upload** aus der Galerie
3. **Direkter Kamerazugriff** für Fotos
4. **Anhang-Menü** für Media-Upload

---

## 1. UI-Änderungen (index.html)

### Chat-Input-Form

**Neue Elemente:**
- **Anhang-Button** (`#chat-attachment-btn`) mit Paperclip-Icon
- **Attachment-Menü** (`#chat-attachment-menu`) - Pop-up mit Galerie/Kamera-Optionen
- **Versteckter File-Input** (`#chat-file-input`) für Galerie-Upload
- **Mikrofon-Button** (`#chat-mic-btn`) - erscheint, wenn Input leer ist
- **Send-Button** (`#chat-send-btn`) - erscheint nur bei Text-Eingabe
- **Recording-Indikator** (`#chat-recording-indicator`) - zeigt aktive Aufnahme

### Dynamisches Button-Verhalten

```javascript
// Im chat.js implementiert:
chatInput.addEventListener('input', () => {
    if (chatInput.value.trim()) {
        sendBtn.classList.remove('hidden');
        micBtn.classList.add('hidden');
    } else {
        sendBtn.classList.add('hidden');
        micBtn.classList.remove('hidden');
    }
});
```

---

## 2. Firestore-Datenmodell

### Nachrichten-Typen

**Vorher:**
```javascript
{
    text: "Hallo!",
    senderId: "uid123",
    senderName: "Max",
    createdAt: Timestamp
}
```

**Nachher - Drei Typen:**

#### A. Text-Nachricht
```javascript
{
    type: 'text',
    text: "Hallo!",
    senderId: "uid123",
    senderName: "Max",
    createdAt: Timestamp
}
```

#### B. Bild-Nachricht
```javascript
{
    type: 'image',
    imageURL: "https://storage.googleapis.com/...",
    senderId: "uid123",
    senderName: "Max",
    createdAt: Timestamp
}
```

#### C. Sprachnachricht
```javascript
{
    type: 'audio',
    audioURL: "https://storage.googleapis.com/...",
    duration: 15, // Sekunden
    senderId: "uid123",
    senderName: "Max",
    createdAt: Timestamp
}
```

### Chat-Dokument (lastMessage)

Das `lastMessage`-Feld wird entsprechend aktualisiert:
- Text: Der tatsächliche Text (wie bisher)
- Bild: `"📷 Bild"`
- Audio: `"🎤 Sprachnachricht"`

---

## 3. Sprachnachrichten

### MediaRecorder API

Die Implementierung nutzt die native `MediaRecorder API`:

```javascript
const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
mediaRecorder = new MediaRecorder(stream);
```

### Aufnahme-Flow

1. **Start**: Mikrofon-Button gedrückt halten (200ms Verzögerung)
2. **Recording**: Anzeige des Recording-Indikators mit Timer
3. **Stop**: Button loslassen
4. **Upload**: Automatischer Upload zu Firebase Storage
5. **Speichern**: Nachricht in Firestore mit `type: 'audio'`

### Bedienung

- **Desktop**: Maus gedrückt halten
- **Mobile**: Touch gedrückt halten

**Wichtig:** Mindestdauer von 0,5 Sekunden erforderlich.

### Storage-Pfad

```
chats/{familyId}/{chatId}/voice_{timestamp}.webm
```

---

## 4. Galerie-Upload

### Funktionsweise

1. **Trigger**: Klick auf "Galerie" im Attachment-Menü
2. **File-Picker**: Öffnet nativen Datei-Browser (nur Bilder)
3. **Upload**: `uploadImageMessage(file, chatId)`
4. **Storage**: Bild wird zu Firebase Storage hochgeladen
5. **Firestore**: Nachricht mit `type: 'image'` gespeichert

### Upload-Progress

Der Upload-Fortschritt wird in der Konsole geloggt:
```javascript
uploadTask.on('state_changed', (snapshot) => {
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log(`Upload: ${progress}% fertig`);
});
```

### Storage-Pfad

```
chats/{familyId}/{chatId}/{timestamp}_{filename}
```

---

## 5. Kamera-Direktzugriff

### Modal-Aufbau

Das Kamera-Modal (`openCameraModal()`) enthält:
- **Video-Element**: Live-Stream der Kamera
- **Canvas**: Für Snapshot (versteckt)
- **Preview-Bild**: Zeigt aufgenommenes Foto
- **Buttons**: 
  - "Foto aufnehmen" (Capture)
  - "Senden" (Send)
  - "Erneut" (Retake)

### Camera-Stream

```javascript
const stream = await navigator.mediaDevices.getUserMedia({ 
    video: { facingMode: 'user' } // 'environment' für Rückkamera
});
```

### Foto-Aufnahme-Flow

1. **Video-Stream starten**
2. **"Foto aufnehmen" klicken**: Frame auf Canvas zeichnen
3. **Preview anzeigen**: Canvas als Bild darstellen
4. **Optional: "Erneut"**: Zurück zum Video-Stream
5. **"Senden"**: Canvas als Blob konvertieren und hochladen

### Canvas-Snapshot

```javascript
const canvas = document.getElementById('camera-canvas');
canvas.width = video.videoWidth;
canvas.height = video.videoHeight;
const ctx = canvas.getContext('2d');
ctx.drawImage(video, 0, 0);
```

---

## 6. Nachrichten-Anzeige

### `renderMessageBubble()` Funktion

Die Funktion wurde erweitert, um alle drei Typen zu rendern:

#### Text-Nachricht
```html
<div class="chat-bubble-own chat-bubble">
    Hallo!
</div>
```

#### Bild-Nachricht
```html
<div class="chat-bubble-own chat-bubble p-0 overflow-hidden max-w-[300px]">
    <img src="..." onclick="window.openImageModal(...)" loading="lazy">
</div>
```

#### Sprachnachricht
```html
<div class="chat-bubble-own chat-bubble flex items-center gap-3">
    <audio src="..." controls class="flex-1 h-8"></audio>
    <span class="text-xs text-secondary">2:15</span>
</div>
```

### Bild-Vollansicht

Klick auf ein Bild öffnet ein Modal mit der Vollansicht:
```javascript
window.openImageModal(imageUrl)
```

---

## Technische Details

### Geänderte Dateien

1. **index.html**
   - Erweitertes `#chat-input-form`
   - Neuer Anhang-Button und Menü
   - Mikrofon- und Send-Button Toggle
   - Recording-Indikator

2. **src/chat.js**
   - Neue Imports: `storage`, `ref`, `uploadBytesResumable`, `getDownloadURL`
   - Neue Variablen: `mediaRecorder`, `audioChunks`, `recordingStartTime`, `recordingInterval`
   - Event-Listener für Attachment-Menü
   - Event-Listener für File-Input
   - Event-Listener für Kamera-Button
   - Event-Listener für Mikrofon-Button (Hold-to-Record)
   - Funktion: `uploadImageMessage()`
   - Funktion: `uploadAudioMessage()`
   - Funktion: `startVoiceRecording()`
   - Funktion: `stopVoiceRecording()`
   - Funktion: `showRecordingIndicator()`
   - Funktion: `hideRecordingIndicator()`
   - Funktion: `openCameraModal()`
   - Funktion: `startCamera()`
   - Funktion: `capturePhoto()`
   - Funktion: `retakePhoto()`
   - Funktion: `window.openImageModal()`
   - Erweiterte: `renderMessageBubble()` für verschiedene Typen

### Browser-Kompatibilität

| Feature | Desktop | Mobile | Safari | Chrome | Firefox |
|---------|---------|--------|--------|--------|---------|
| Sprachnachrichten | ✅ | ✅ | ✅ | ✅ | ✅ |
| Galerie-Upload | ✅ | ✅ | ✅ | ✅ | ✅ |
| Kamera-Zugriff | ✅ | ✅ | ⚠️ HTTPS | ✅ | ✅ |
| MediaRecorder | ✅ | ✅ | ✅ (iOS 14.3+) | ✅ | ✅ |

**Wichtig:** Kamera- und Mikrofon-Zugriff erfordert HTTPS (außer localhost)!

### Berechtigungen

Die App benötigt folgende Browser-Berechtigungen:
- **Mikrofon**: Für Sprachnachrichten
- **Kamera**: Für Foto-Aufnahme
- **Dateizugriff**: Für Galerie-Upload

Diese Berechtigungen werden beim ersten Zugriff abgefragt.

---

## Verwendung

### Sprachnachricht senden

1. Chat öffnen
2. Textfeld leer lassen (Mikrofon-Button erscheint)
3. Mikrofon-Button **gedrückt halten**
4. Sprechen (Recording-Indikator erscheint)
5. Loslassen zum Beenden
6. Automatischer Upload

### Bild aus Galerie senden

1. Chat öffnen
2. Anhang-Button (📎) klicken
3. "Galerie" wählen
4. Bild auswählen
5. Automatischer Upload

### Foto mit Kamera aufnehmen

1. Chat öffnen
2. Anhang-Button (📎) klicken
3. "Kamera" wählen
4. Browser-Berechtigung erteilen
5. "Foto aufnehmen" klicken
6. Optional: "Erneut" für neues Foto
7. "Senden" klicken

---

## Nächste Schritte

### Optionale Erweiterungen

1. **Video-Nachrichten**: Erweiterung der MediaRecorder für Video
2. **Dokumente**: PDF/Word-Dateien teilen
3. **Audio-Waveform**: Visuelle Darstellung von Sprachnachrichten
4. **Bild-Bearbeitung**: Filter/Crop vor dem Senden
5. **Mehrfach-Upload**: Mehrere Bilder gleichzeitig
6. **Komprimierung**: Automatische Bild-Komprimierung vor Upload
7. **Nachricht-Reaktionen**: Emoji-Reaktionen auf Nachrichten
8. **Antworten**: Quote-Reply-Funktion

### Performance-Optimierungen

1. **Lazy Loading**: Bilder nur bei Sichtbarkeit laden
2. **Thumbnail-Generierung**: Kleinere Vorschaubilder
3. **Progress-Upload**: Visueller Fortschrittsbalken
4. **Batch-Upload**: Mehrere Dateien gleichzeitig
5. **Offline-Support**: Zwischenspeicherung bei fehlender Verbindung

---

## Troubleshooting

### Mikrofon funktioniert nicht
- Überprüfe Browser-Berechtigungen in den Einstellungen
- HTTPS ist erforderlich (außer localhost)
- Prüfe, ob ein anderes Programm das Mikrofon blockiert

### Kamera zeigt schwarzes Bild
- Überprüfe Browser-Berechtigungen
- Prüfe, ob eine andere App die Kamera verwendet
- Versuche Browser-Neustart

### Upload schlägt fehl
- Prüfe Internet-Verbindung
- Überprüfe Firebase Storage-Regeln
- Maximale Dateigröße beachten (standard: 10MB)

### Sprachnachricht zu leise
- Prüfe Mikrofon-Einstellungen des Betriebssystems
- MediaRecorder nimmt mit System-Lautstärke auf
- Eventuell externes Mikrofon verwenden

---

## Lizenz & Credits

Implementiert für **FamilyHub v2**  
Datum: 2025-11-09  
Technologien: MediaRecorder API, getUserMedia API, Firebase Storage

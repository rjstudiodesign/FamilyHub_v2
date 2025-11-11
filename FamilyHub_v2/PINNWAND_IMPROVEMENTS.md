# Pinnwand-Erweiterungen - Implementierungsdokumentation

## Übersicht
Dieses Dokument beschreibt die Erweiterungen des Kanban-Boards in `src/pinnwand.js`, um es wie eine echte "DIY-Kork-Pinnwand" mit visuellen Anhängen und Fälligkeitsdaten zu gestalten.

## Implementierte Features

### 1. Fälligkeitsdaten (Due Dates) ✅

#### Warum?
Die Cloud Function `generateWeeklyForecast` in `functions/index.js` benötigt das `dueDate`-Feld, um bevorstehende Aufgaben zu erkennen.

#### Modal-UI

**Neues Feld im Formular:**
```html
<div>
    <label for="task-due-date" class="form-label text-sm text-secondary mb-1 block">
        <i data-lucide="calendar" class="w-4 h-4 inline mr-1"></i>
        Fälligkeitsdatum (optional)
    </label>
    <input type="date" id="task-due-date" class="form-input">
</div>
```

#### Speichern (onsubmit)

**Datums-Konvertierung:**
```javascript
let dueDate = null;
if (dueDateInput) {
    const dateObj = new Date(dueDateInput);
    dateObj.setHours(23, 59, 59, 999); // Ende des Tages
    dueDate = Timestamp.fromDate(dateObj);
}

// In Task-Daten einfügen (falls vorhanden)
if (dueDate) {
    taskData.dueDate = dueDate;
}
```

**Firestore-Datenmodell:**
```javascript
{
    text: "DIY Kork-Pinnwand bauen",
    status: "todo",
    assignedTo: "uid123",
    points: 50,
    dueDate: Timestamp, // NEU
    createdAt: Timestamp
}
```

#### Karten-UI (createTaskElement)

**Datums-Badge mit Überfälligkeits-Check:**
```javascript
let dueDateBadge = '';
if (card.dueDate) {
    const dueDate = card.dueDate.toDate ? card.dueDate.toDate() : new Date(card.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isOverdue = dueDate < today && card.status !== 'done';
    
    const dateStr = dueDate.toLocaleDateString('de-DE', { day: '2-digit', month: 'short' });
    const dueDateClass = isOverdue 
        ? 'bg-red-500/20 text-red-400 border-red-500/30' 
        : 'bg-white/10 text-secondary';
    
    dueDateBadge = `
        <div class="flex items-center gap-1 text-xs px-2 py-1 rounded border ${dueDateClass} mt-2">
            <i data-lucide="calendar" class="w-3 h-3"></i>
            <span>${dateStr}</span>
        </div>
    `;
}
```

**Visuelle Darstellung:**
- ✅ **Normal**: Weiß/Grauer Hintergrund (`bg-white/10 text-secondary`)
- ⚠️ **Überfällig**: Roter Hintergrund (`bg-red-500/20 text-red-400`)
- ✅ **Erledigt**: Überfälligkeits-Check wird ignoriert

---

### 2. Visuelle Anhänge (Bilder & Dokumente) ✅

#### Warum?
Um Aufgaben wie eine echte Korkwand visuell zu gestalten - mit Fotos, PDFs und Dokumenten.

#### Modal-UI

**Datei-Upload-Feld:**
```html
<div>
    <label for="task-attachment" class="form-label text-sm text-secondary mb-1 block">
        <i data-lucide="paperclip" class="w-4 h-4 inline mr-1"></i>
        Anhang (Bild oder Dokument, optional)
    </label>
    <input type="file" id="task-attachment" class="form-input" 
           accept="image/*,.pdf,.doc,.docx">
    <p class="text-xs text-secondary mt-1">
        Bilder werden als Cover angezeigt, Dokumente als Link.
    </p>
</div>
```

**Akzeptierte Dateitypen:**
- Bilder: `image/*` (jpg, png, gif, webp, etc.)
- Dokumente: `.pdf`, `.doc`, `.docx`

#### Speichern (onsubmit)

**Upload-Logik:**
```javascript
let attachment = null;
if (attachmentFile) {
    showNotification("Anhang wird hochgeladen...", "info");
    
    const storageRef = ref(storage, `tasks/${currentFamilyId}/${Date.now()}_${attachmentFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, attachmentFile);
    
    await new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Upload: ${progress}% fertig`);
            },
            (error) => reject(error),
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                attachment = {
                    url: downloadURL,
                    name: attachmentFile.name,
                    type: attachmentFile.type,
                    size: attachmentFile.size
                };
                resolve();
            }
        );
    });
}

// In Task-Daten einfügen (falls vorhanden)
if (attachment) {
    taskData.attachment = attachment;
}
```

**Firebase Storage-Pfad:**
```
tasks/{familyId}/{timestamp}_{filename}
```

**Firestore-Datenmodell:**
```javascript
{
    text: "DIY Kork-Pinnwand bauen",
    status: "todo",
    attachment: {  // NEU
        url: "https://storage.googleapis.com/...",
        name: "pinnwand-inspiration.jpg",
        type: "image/jpeg",
        size: 245678
    },
    createdAt: Timestamp
}
```

#### Karten-UI (createTaskElement)

**Cover-Bild für Bilder:**
```javascript
if (card.attachment) {
    if (card.attachment.type && card.attachment.type.startsWith('image/')) {
        coverImage = `
            <div class="task-cover-image mb-3 -mx-4 -mt-4 rounded-t-lg overflow-hidden">
                <img src="${card.attachment.url}" 
                     alt="${card.attachment.name || 'Anhang'}" 
                     class="w-full h-32 object-cover cursor-pointer"
                     onclick="window.openImageModal('${card.attachment.url}')"
                     loading="lazy">
            </div>
        `;
    }
}
```

**Dokument-Link für PDFs/Docs:**
```javascript
else {
    attachmentIcon = `
        <a href="${card.attachment.url}" target="_blank" 
           class="inline-flex items-center gap-1 text-xs text-accent-glow hover:underline mt-2"
           title="${card.attachment.name || 'Anhang'}">
            <i data-lucide="paperclip" class="w-4 h-4"></i>
            <span class="truncate max-w-[120px]">${card.attachment.name || 'Dokument'}</span>
        </a>
    `;
}
```

**DIY-Kork-Look:**
- **Bilder**: Als Cover über der Karte (wie ein angeheftetes Foto)
- **Dokumente**: Als klickbarer Link mit Paperclip-Icon

---

### 3. Feed-Integration (Bonus-Feature) ✅

#### Warum?
Um wichtige neue Aufgaben für alle Familienmitglieder sichtbar zu machen.

#### Modal-UI

**Checkbox für Feed-Posting:**
```html
<div class="flex items-center gap-3 p-3 rounded-lg bg-white/5">
    <input type="checkbox" id="task-post-to-feed" class="form-checkbox">
    <label for="task-post-to-feed" class="text-sm text-white cursor-pointer">
        <i data-lucide="megaphone" class="w-4 h-4 inline mr-1 text-accent-glow"></i>
        Diese Aufgabe im Feed posten
    </label>
</div>
```

#### Feed-Post Erstellung

**Logik:**
```javascript
if (postToFeed) {
    const assignedMemberName = assignedTo && membersData[assignedTo] 
        ? membersData[assignedTo].name 
        : 'Niemand';
    
    await addDoc(collection(db, 'families', currentFamilyId, 'posts'), {
        type: 'task_repost',
        taskId: taskRef.id,
        taskText: text,
        taskStatus: status,
        assignedTo: assignedTo,
        assignedToName: assignedMemberName,
        dueDate: dueDate,
        attachment: attachment,
        points: points,
        authorId: currentUser.uid,
        authorName: currentUserData.name,
        authorAvatar: currentUser.photoURL,
        createdAt: serverTimestamp()
    });
    
    showNotification("Aufgabe erstellt und im Feed geteilt!", "success");
}
```

**Feed-Post-Typ:**
```javascript
{
    type: 'task_repost',
    taskId: "task123",
    taskText: "DIY Kork-Pinnwand bauen",
    taskStatus: "todo",
    assignedToName: "Max",
    dueDate: Timestamp,
    attachment: { url: "...", name: "...", type: "..." },
    points: 50,
    authorName: "Papa",
    createdAt: Timestamp
}
```

**Feed-Integration:**
Dieser Post kann in `src/feed.js` mit einem speziellen `TaskRepostCard` gerendert werden.

---

## Technische Details

### Imports in pinnwand.js

**Erweiterte Imports:**
```javascript
import { 
    db, storage, collection, query, onSnapshot, updateDoc, 
    doc, orderBy, addDoc, serverTimestamp, getDoc,
    increment, ref, uploadBytesResumable, getDownloadURL, Timestamp
} from './firebase.js';
```

**Neu hinzugefügt:**
- `storage` - Firebase Storage-Instanz
- `ref` - Storage-Referenz erstellen
- `uploadBytesResumable` - Datei-Upload mit Progress
- `getDownloadURL` - Download-URL nach Upload
- `Timestamp` - Firestore Timestamp-Klasse
- `getDoc` - Einzelnes Dokument abrufen

### Geänderte Funktionen

1. **`window.openCreateTaskModal(status)`**
   - Neues Datums-Input-Feld
   - Neues Datei-Upload-Feld
   - Neue Feed-Checkbox
   - Erweiterte `onsubmit`-Logik mit Upload

2. **`createTaskElement(card)`**
   - Cover-Bild-Rendering für Bilder
   - Dokument-Link-Rendering für PDFs
   - Fälligkeitsdatum-Badge
   - Überfälligkeits-Check

### UI-Verbesserungen

**Karten-Layout:**
```javascript
cardEl.innerHTML = `
    ${coverImage}                    // Cover-Bild oben
    <div class="flex flex-col gap-2">
        <span class="flex-1">${card.text}</span>
        ${attachmentIcon}            // Dokument-Link
        ${dueDateBadge}              // Fälligkeitsdatum
        <div class="flex gap-1 mt-2 pt-2 border-t border-white/10">
            <!-- Action-Buttons -->
        </div>
    </div>
`;
```

---

## Verwendung

### Aufgabe mit Fälligkeitsdatum erstellen

1. Pinnwand öffnen
2. "+" Button in einer Spalte klicken
3. Aufgabentext eingeben
4. Fälligkeitsdatum wählen
5. "Aufgabe erstellen" klicken

### Aufgabe mit Bild-Anhang erstellen

1. Pinnwand öffnen
2. "+" Button klicken
3. Aufgabentext eingeben
4. Datei auswählen (z.B. Inspiration-Foto)
5. "Aufgabe erstellen" klicken
6. **Ergebnis**: Bild wird als Cover angezeigt

### Aufgabe im Feed teilen

1. Beim Erstellen die Checkbox "Im Feed posten" aktivieren
2. Aufgabe wird in der Pinnwand UND im Feed angezeigt
3. Alle Familienmitglieder sehen die neue Aufgabe

---

## Beispiel-Anwendungsfall

**Szenario**: DIY-Projekt "Kork-Pinnwand bauen"

```javascript
// Aufgabe in Firestore:
{
    text: "🛠️ DIY Kork-Pinnwand für's Wohnzimmer bauen",
    status: "inprogress",
    assignedTo: "papa_uid",
    points: 100,
    dueDate: Timestamp("2025-11-15T23:59:59"),
    attachment: {
        url: "https://storage.googleapis.com/.../pinnwand-inspiration.jpg",
        name: "pinnwand-inspiration.jpg",
        type: "image/jpeg",
        size: 245678
    },
    createdAt: Timestamp("2025-11-09T12:00:00")
}
```

**Karte zeigt:**
- ✅ Cover-Bild: Inspiration-Foto
- ✅ Text: "🛠️ DIY Kork-Pinnwand für's Wohnzimmer bauen"
- ✅ Fälligkeitsdatum: "15. Nov" (normal, da nicht überfällig)
- ✅ Action-Buttons: Kalender-Event erstellen, Diskutieren

**Nach Fälligkeit (16. Nov):**
- ⚠️ Fälligkeitsdatum: "15. Nov" (ROT, da überfällig)

---

## Integration mit Cloud Functions

### generateWeeklyForecast

Die Cloud Function kann jetzt das `dueDate`-Feld nutzen:

```javascript
const upcomingTasks = await db
    .collection('pinnwand')
    .where('dueDate', '>=', startOfWeek)
    .where('dueDate', '<=', endOfWeek)
    .where('status', '!=', 'done')
    .get();

upcomingTasks.forEach(task => {
    const data = task.data();
    forecast += `📌 ${data.text} - Fällig: ${data.dueDate.toDate().toLocaleDateString()}\n`;
});
```

---

## Nächste Schritte

### Optionale Erweiterungen

1. **Mehrere Anhänge**: Array von Attachments statt einzelnem Objekt
2. **Datei-Vorschau im Modal**: Vorschau vor Upload anzeigen
3. **Drag-and-Drop Upload**: Dateien direkt auf Karte ziehen
4. **Kommentare**: Anhänge in Kommentaren erlauben
5. **Versionierung**: Anhänge aktualisieren/ersetzen

### Feed-Karten-Rendering

In `src/feed.js` eine neue Funktion erstellen:

```javascript
function TaskRepostCard(post) {
    return `
        <div class="post-card task-repost-card">
            <div class="flex items-center gap-2 mb-3">
                <i data-lucide="clipboard-check" class="w-5 h-5 text-accent-glow"></i>
                <h3 class="font-bold">Neue Aufgabe: ${post.taskText}</h3>
            </div>
            ${post.attachment && post.attachment.type.startsWith('image/') 
                ? `<img src="${post.attachment.url}" class="rounded-lg mb-3">` 
                : ''}
            <div class="flex items-center justify-between text-sm text-secondary">
                <span>👤 ${post.assignedToName}</span>
                ${post.dueDate ? `<span>📅 ${post.dueDate.toDate().toLocaleDateString()}</span>` : ''}
                <span>⭐ ${post.points} Punkte</span>
            </div>
        </div>
    `;
}
```

---

## Troubleshooting

### Upload schlägt fehl
- Prüfe Firebase Storage-Regeln
- Maximale Dateigröße beachten
- Internet-Verbindung prüfen

### Datum wird nicht angezeigt
- Prüfe, ob `dueDate` ein Timestamp ist
- Browser-Konsole auf Fehler prüfen
- Lucide-Icons müssen geladen sein

### Cover-Bild wird nicht angezeigt
- Prüfe `attachment.type` - muss mit `image/` beginnen
- Prüfe `attachment.url` - muss gültige URL sein
- Browser-Konsole auf CORS-Fehler prüfen

---

## Lizenz & Credits

Implementiert für **FamilyHub v2**  
Datum: 2025-11-09  
Features: Due Dates, Visual Attachments, Feed Integration

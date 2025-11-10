# 📋 Quick-Start Guide: Neue Utilities nutzen

## 🚀 Upload-Utility verwenden

### **Standard-Upload (einfach)**
```javascript
import { uploadFile, generateStoragePath } from './utils/uploads.js';

async function handleFileUpload(file, familyId) {
    try {
        const path = generateStoragePath('gallery', familyId, file.name);
        const downloadURL = await uploadFile(file, path, {
            maxSizeMB: 10,
            onProgress: (progress) => {
                console.log(`Upload: ${Math.round(progress)}%`);
            }
        });
        
        return downloadURL;
    } catch (error) {
        console.error('Upload-Fehler:', error.message);
    }
}
```

### **Upload mit Progress-UI (empfohlen)**
```javascript
import { uploadWithProgressUI, generateStoragePath } from './utils/uploads.js';

async function handleFileUpload(file, familyId) {
    const path = generateStoragePath('documents', familyId, file.name);
    
    // Automatisches Progress-Bar-Update
    const url = await uploadWithProgressUI(
        file,
        path,
        'upload-progress-bar',    // ID der Progress-Bar
        'upload-progress-text'    // ID des Text-Elements
    );
    
    return url;
}
```

### **Multi-File-Upload**
```javascript
import { uploadMultipleFiles } from './utils/uploads.js';

const urls = await uploadMultipleFiles(
    files,
    (file, index) => `gallery/${familyId}/${Date.now()}_${index}_${file.name}`
);
```

---

## 🎯 Listener-Manager nutzen

### **Basis-Verwendung**
```javascript
import { ListenerManager } from './utils/listeners.js';

const manager = new ListenerManager();

export function renderMyPage(listeners) {
    // Alten Listener cleanup
    if (listeners.myData) listeners.myData();
    
    // Neuen Listener registrieren
    const unsubscribe = onSnapshot(query, (snapshot) => {
        // ... render logic
    });
    
    listeners.myData = unsubscribe;
    manager.register('myData', unsubscribe);
    
    // Bei Page-Verlassen: Automatisches Cleanup
    // durch navigation.js cleanupListeners()
}
```

### **Batch-Rendering (Performance-Boost)**
```javascript
import { BatchRenderer } from './utils/listeners.js';

const batcher = new BatchRenderer(renderFunction, 50);

onSnapshot(query, (snapshot) => {
    const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
    
    // Wird nur einmal alle 50ms gerendert, nicht bei jeder Änderung
    batcher.scheduleRender(data);
});
```

---

## 🎨 CommonCards Components nutzen

### **ParticipantCard (Avatar-Stack)**
```javascript
import { ParticipantCard } from './components/CommonCards.js';

function renderHobbyCard(hobby, membersData) {
    const avatarsHTML = ParticipantCard({
        participants: hobby.participants,
        membersData: membersData,
        maxAvatars: 5  // Zeigt max 5, dann "+X"
    });
    
    return `<div>${avatarsHTML}</div>`;
}
```

### **ActionButton (Wiederverwendbare Buttons)**
```javascript
import { ActionButton } from './components/CommonCards.js';

const joinButton = ActionButton({
    id: 'btn-join-hobby',
    text: 'Beitreten',
    icon: 'user-plus',
    variant: 'primary',  // 'primary', 'secondary', 'danger'
    fullWidth: true
});

return `<div>${joinButton}</div>`;
```

### **Badge (Status-Anzeigen)**
```javascript
import { Badge } from './components/CommonCards.js';

const statusBadge = Badge('Aktiv', 'success');
const warningBadge = Badge('Läuft bald ab', 'warning');
const errorBadge = Badge('Abgelaufen', 'error');
```

### **Metadata (Icon + Text)**
```javascript
import { Metadata } from './components/CommonCards.js';

const metadata = Metadata([
    { icon: 'calendar', text: '15. Juni 2025' },
    { icon: 'user', text: 'Max Mustermann' },
    { text: '5 Kommentare' }  // Icon optional
]);
```

### **HTML-Escaping (Sicherheit)**
```javascript
import { escapeHTML } from './components/CommonCards.js';

function renderCard(userInput) {
    // ✅ Sicher gegen XSS
    return `<div>${escapeHTML(userInput)}</div>`;
    
    // ❌ Unsicher
    // return `<div>${userInput}</div>`;
}
```

---

## 📦 Komplettes Beispiel

### **Vorher (dokumente.js - 91 Zeilen Upload-Code)**
```javascript
async function handleUpload(e) {
    e.preventDefault();
    // ... 20 Zeilen Validierung
    // ... 30 Zeilen Progress-UI-Setup
    // ... 40 Zeilen Upload-Logik
}
```

### **Nachher (15 Zeilen)**
```javascript
import { uploadWithProgressUI, generateStoragePath } from './utils/uploads.js';

async function handleUpload(e) {
    e.preventDefault();
    const file = fileInput.files[0];
    
    if (!file) {
        showNotification("Keine Datei ausgewählt", "error");
        return;
    }
    
    try {
        const path = generateStoragePath('documents', familyId, file.name);
        const url = await uploadWithProgressUI(file, path, 'bar', 'text');
        
        await saveToFirestore(url);
        showNotification("Upload erfolgreich!", "success");
    } catch (error) {
        showNotification(error.message, "error");
    }
}
```

---

## 🔧 Migration-Checkliste

### **Upload-Code migrieren:**
- [ ] Import `uploadFile` oder `uploadWithProgressUI`
- [ ] Import `generateStoragePath`
- [ ] Ersetze `uploadBytesResumable` Logik
- [ ] Entferne manuelle Progress-Updates
- [ ] Teste Upload mit verschiedenen Dateigrößen

### **Listener-Code migrieren:**
- [ ] Import `ListenerManager`
- [ ] Erstelle Manager-Instanz
- [ ] Ersetze manuelle Cleanup-Logik
- [ ] Teste Memory-Leaks (DevTools → Memory)

### **Card-Rendering migrieren:**
- [ ] Identifiziere duplizierte Card-Logik
- [ ] Import passende Components
- [ ] Ersetze manuelles HTML-Building
- [ ] Teste HTML-Escaping

---

## ⚡ Performance-Tipps

1. **Upload nur in Chunks bei großen Dateien:**
   ```javascript
   // Für Dateien > 5MB
   const url = await uploadFile(file, path, {
       maxSizeMB: 100,  // Erhöht Limit
       onProgress: (p) => updateUI(p)
   });
   ```

2. **Batch-Rendering für Listen:**
   ```javascript
   // Statt bei jeder Änderung zu rendern
   const batcher = new BatchRenderer(renderList, 100);
   onSnapshot(query, (snap) => batcher.scheduleRender(snap.docs));
   ```

3. **Lazy-Load Components:**
   ```javascript
   // Nur laden wenn benötigt
   const { ParticipantCard } = await import('./components/CommonCards.js');
   ```

---

## 🐛 Häufige Fehler

### **Fehler 1: Upload schlägt fehl**
```javascript
// ❌ Falsch: Kein Error-Handling
const url = await uploadFile(file, path);

// ✅ Richtig: Mit try-catch
try {
    const url = await uploadFile(file, path);
} catch (error) {
    console.error('Upload failed:', error.message);
    showNotification(error.message, 'error');
}
```

### **Fehler 2: Listener wird nicht bereinigt**
```javascript
// ❌ Falsch: Kein Cleanup
onSnapshot(query, callback);

// ✅ Richtig: Mit Manager
const manager = new ListenerManager();
manager.register('key', onSnapshot(query, callback));
// Cleanup automatisch bei Navigation
```

### **Fehler 3: XSS-Sicherheitslücke**
```javascript
// ❌ Falsch: User-Input direkt
return `<div>${userInput}</div>`;

// ✅ Richtig: HTML escapen
import { escapeHTML } from './components/CommonCards.js';
return `<div>${escapeHTML(userInput)}</div>`;
```

---

## 📚 Weitere Ressourcen

- **Vollständiger Report:** `REFACTORING_REPORT.md`
- **API-Docs:** Siehe Kommentare in den Utility-Dateien
- **Beispiele:** `dokumente.js` und `hobbys.js` (bereits migriert)

**Fragen?** Überprüfe die Inline-Kommentare in:
- `src/utils/uploads.js`
- `src/utils/listeners.js`
- `src/components/CommonCards.js`

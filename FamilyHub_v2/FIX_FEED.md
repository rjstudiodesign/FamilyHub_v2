# SOFORT-FIX ERFORDERLICH: Feed.js Duplikat

## Problem
Die Datei `src/feed.js` enthält zwei identische `renderFeed`-Funktionen:
- Zeile 96: Korrekte Funktion
- Zeile 439: Duplikat (Legacy-Code)

Dies verhindert den Production-Build.

## Lösung

### Option 1: Manuell im Editor
1. Öffne `src/feed.js`
2. Scrolle zu Zeile 438
3. Lösche **alles ab Zeile 438 bis zum Dateiende** (Zeilen 438-816)
4. Speichern

### Option 2: Terminal (macOS/Linux)
\`\`\`bash
cd FamilyHub_v2
head -437 src/feed.js > src/feed_temp.js
mv src/feed_temp.js src/feed.js
\`\`\`

### Option 3: Terminal (mit sed)
\`\`\`bash
cd FamilyHub_v2
sed -i '' '438,816d' src/feed.js
\`\`\`

## Verifizierung

\`\`\`bash
# 1. Prüfe, dass nur EINE renderFeed-Funktion existiert
grep -n "export function renderFeed" src/feed.js
# Erwartete Ausgabe: "96:export function renderFeed(listeners) {"

# 2. Prüfe Zeilenzahl
wc -l src/feed.js
# Erwartete Ausgabe: "437 src/feed.js"

# 3. Build testen
npm run build
# Sollte erfolgreich sein

# 4. Dev-Server testen
npm run dev
\`\`\`

## Warum ist das passiert?
Die Datei wurde während der Entwicklung dupliziert (vermutlich Merge-Konflikt oder Copy-Paste).  
Das Git-Repo enthält bereits diese Duplikation.

## Nach dem Fix
- Commit die Änderung: `git add src/feed.js && git commit -m "fix: Remove duplicate renderFeed function"`
- Push: `git push`
- Deployment sollte jetzt funktionieren

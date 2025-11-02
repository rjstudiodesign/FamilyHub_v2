/**
 * functions/index.js
 * 
 * Firebase Cloud Function zur Erstellung wöchentlicher "Forecast"-Posts.
 * 
 * Trigger: Läuft jeden Sonntag um 18:00 Uhr.
 * Aktion:
 * 1. Sammelt alle Kalendereinträge und fälligen Aufgaben für die kommende Woche.
 * 2. Generiert einen zusammenfassenden Text.
 * 3. Erstellt einen neuen Post vom Typ 'forecast' im Feed jeder Familie.
 * 
 * --- EINRICHTUNG & DEPLOYMENT ---
 * 1. Firebase CLI installieren: `npm install -g firebase-tools`
 * 2. In Firebase einloggen: `firebase login`
 * 3. Dieses Verzeichnis als Firebase Functions-Projekt initialisieren: `firebase init functions`
 *    - Sprache: JavaScript
 *    - ESLint: Ja (empfohlen)
 *    - Abhängigkeiten installieren: Ja
 * 4. Die `firebase-admin` und `firebase-functions` SDKs müssen in `functions/package.json` deklariert sein.
 * 5. Funktion bereitstellen: `firebase deploy --only functions:generateWeeklyForecast`
 * 
 * --- SICHERHEIT (WICHTIG) ---
 * - Standardmäßig laufen Cloud Functions mit einem hochprivilegierten Service-Account.
 * - Für dieses Szenario wird empfohlen, einen dedizierten Service-Account mit
 *   read-only Berechtigungen für die 'calendar' und 'pinnwand' Collections zu erstellen
 *   und diesen der Funktion zuzuweisen.
 * - Dies geschieht in der Google Cloud Console unter "IAM & Admin" -> "Service Accounts".
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

// Zeitplan: Jede Woche am Sonntag um 18:00 Uhr.
// Timezone ist wichtig, hier 'Europe/Berlin' für Deutschland.
exports.generateWeeklyForecast = functions.pubsub.schedule('every sunday 18:00').timeZone('Europe/Berlin').onRun(async (context) => {
    
    console.log('Starte wöchentliche Forecast-Generierung...');

    const familiesSnapshot = await db.collection('families').get();
    if (familiesSnapshot.empty) {
        console.log('Keine Familien gefunden. Beende Funktion.');
        return null;
    }

    const promises = [];
    familiesSnapshot.forEach(familyDoc => {
        const familyId = familyDoc.id;
        const promise = createForecastForFamily(familyId);
        promises.push(promise);
    });

    await Promise.all(promises);
    console.log('Forecast-Generierung für alle Familien abgeschlossen.');
    return null;
});

async function createForecastForFamily(familyId) {
    console.log(`Erstelle Forecast für Familie: ${familyId}`);

    const now = new Date();
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // 1. Kalendertermine der nächsten 7 Tage abrufen
    const calendarQuery = db.collection(`families/${familyId}/calendar`)
        .where('start', '>=', now)
        .where('start', '<=', oneWeekFromNow)
        .orderBy('start');
    
    // 2. Aufgaben der nächsten 7 Tage abrufen (Annahme: 'dueDate' ist ein Timestamp)
    const tasksQuery = db.collection(`families/${familyId}/pinnwand`)
        .where('dueDate', '>=', now)
        .where('dueDate', '<=', oneWeekFromNow)
        .orderBy('dueDate');

    const [calendarSnapshot, tasksSnapshot] = await Promise.all([
        calendarQuery.get(),
        tasksQuery.get()
    ]);

    const calendarItems = calendarSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            type: 'calendar',
            title: data.title,
            details: data.start.toDate().toLocaleDateString('de-DE', { weekday: 'short', hour: '2-digit', minute: '2-digit' })
        };
    });

    const taskItems = tasksSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            type: 'task',
            title: data.text,
            details: `Fällig bis ${data.dueDate.toDate().toLocaleDateString('de-DE', { weekday: 'short' })}`
        };
    });

    const allItems = [...calendarItems, ...taskItems];

    // Wenn keine Ereignisse anstehen, keinen Post erstellen.
    if (allItems.length === 0) {
        console.log(`Keine anstehenden Ereignisse für Familie ${familyId}. Überspringe.`);
        return;
    }

    // 3. Zusammenfassenden Text generieren
    let summary = `In der kommenden Woche stehen ${calendarItems.length} Termin(e) und ${tasksItems.length} Aufgabe(n) an.`;
    if (calendarItems.length === 0 && tasksItems.length > 0) {
        summary = `Diese Woche gibt es ${tasksItems.length} Aufgabe(n) zu erledigen.`;
    } else if (tasksItems.length === 0 && calendarItems.length > 0) {
        summary = `Es stehen ${calendarItems.length} Termin(e) in der nächsten Woche an.`;
    }

    // 4. Neuen 'forecast'-Post erstellen
    const forecastPost = {
        type: 'forecast',
        summary: summary,
        items: allItems.slice(0, 5), // Auf 5 Elemente begrenzen, um die UI nicht zu überladen
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        // System-generierte Posts haben keinen direkten Autor
        authorName: 'FamilyHub Assistent',
        authorPhotoURL: null, // Optional: Ein Bot-Icon hier hinterlegen
        likes: [],
        comments: []
    };

    await db.collection(`families/${familyId}/posts`).add(forecastPost);
    console.log(`Forecast-Post für Familie ${familyId} erfolgreich erstellt.`);
}

// --- NEUE FUNKTION: Memory Lane Bot ---
// Zeitplan: Jeden Tag um 09:00 Uhr morgens.
exports.generateDailyMemory = functions.pubsub.schedule('every day 09:00').timeZone('Europe/Berlin').onRun(async (context) => {
    console.log('Starte tägliche Memory-Lane-Generierung...');

    const familiesSnapshot = await db.collection('families').get();
    if (familiesSnapshot.empty) {
        console.log('Keine Familien gefunden. Beende Funktion.');
        return null;
    }

    const promises = [];
    familiesSnapshot.forEach(familyDoc => {
        const familyId = familyDoc.id;
        const promise = createMemoryForFamily(familyId);
        promises.push(promise);
    });

    await Promise.all(promises);
    console.log('Memory-Lane-Generierung für alle Familien abgeschlossen.');
    return null;
});

async function createMemoryForFamily(familyId) {
    console.log(`Suche nach Erinnerungen für Familie: ${familyId}`);

    const today = new Date();
    const memories = [];

    // Wir suchen nach Posts aus den letzten 5 Jahren am selben Tag.
    for (let yearsAgo = 1; yearsAgo <= 5; yearsAgo++) {
        const targetDate = new Date(today.getFullYear() - yearsAgo, today.getMonth(), today.getDate());
        
        // Zeitfenster von 24 Stunden für den Zieldatumstag
        const startDate = new Date(targetDate.setHours(0, 0, 0, 0));
        const endDate = new Date(targetDate.setHours(23, 59, 59, 999));

        const postsQuery = db.collection(`families/${familyId}/posts`)
            .where('createdAt', '>=', startDate)
            .where('createdAt', '<=', endDate);
            
        const postsSnapshot = await postsQuery.get();

        postsSnapshot.forEach(doc => {
            const post = { id: doc.id, ...doc.data() };
            // Wir wollen keine alten 'memory' oder 'forecast' Posts wiederverwenden.
            if (post.type === 'post' || post.type === 'event') {
                // Firestore Timestamps müssen für die Einbettung in ein anderes Dokument
                // in ein serialisierbares Format (z.B. ISO-String) umgewandelt werden.
                const serializablePost = {
                    ...post,
                    createdAt: post.createdAt.toDate().toISOString(),
                };
                memories.push({ post: serializablePost, yearsAgo });
            }
        });
    }

    if (memories.length === 0) {
        console.log(`Keine Erinnerungen für Familie ${familyId} gefunden.`);
        return;
    }

    // Personalisierung: Wähle den Post mit den meisten Likes oder Kommentaren.
    memories.sort((a, b) => {
        const scoreA = (a.post.likes?.length || 0) + (a.post.comments?.length || 0);
        const scoreB = (b.post.likes?.length || 0) + (b.post.comments?.length || 0);
        return scoreB - scoreA; // Absteigend sortieren
    });

    const bestMemory = memories[0];
    const { post: originalPost, yearsAgo } = bestMemory;

    // Titel für die MemoryCard erstellen
    const memoryTitle = `An diesem Tag vor ${yearsAgo} ${yearsAgo > 1 ? 'Jahren' : 'Jahr'}...`;

    // Neuen 'memory'-Post erstellen
    const memoryPost = {
        type: 'memory',
        memoryTitle: memoryTitle,
        originalPost: originalPost,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        authorName: 'FamilyHub Zeitkapsel',
        authorPhotoURL: null,
        likes: [],
        comments: []
    };

    await db.collection(`families/${familyId}/posts`).add(memoryPost);
    console.log(`Memory-Post für Familie ${familyId} erfolgreich erstellt.`);
}

const axios = require('axios');
const cheerio = require('cheerio');

exports.parseWishlistMetadata = functions.firestore
    .document('families/{familyId}/wishlistItems/{itemId}')
    .onCreate(async (snap, context) => {
        const item = snap.data();
        if (!item.url) {
            console.log('Keine URL, kein Scraping.');
            return null;
        }

        try {
            console.log(`Scraping URL: ${item.url}`);
            const { data } = await axios.get(item.url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
                }
            });
            const $ = cheerio.load(data);

            const title = $('meta[property="og:title"]').attr('content') || $('title').text() || item.title;
            const imageUrl = $('meta[property="og:image"]').attr('content') || null;
            const description = $('meta[property="og:description"]').attr('content') || null;

            return snap.ref.update({
                title: title.trim(),
                imageUrl: imageUrl,
                description: description ? description.trim() : null,
                scraped: true
            });

        } catch (error) {
            console.error('Error scraping metadata:', error.message);
            return snap.ref.update({ scraped: false, error: error.message });
        }
    });

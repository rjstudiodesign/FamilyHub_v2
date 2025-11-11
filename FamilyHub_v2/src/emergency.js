// emergency.js - Notfallknopf-Funktionalität
import { db, collection, addDoc, serverTimestamp } from './firebase.js';
import { getCurrentUser } from './auth.js';
import { showNotification } from './ui.js';

let pressTimer = null;
let isPressed = false;

export function initEmergencyButton() {
    const button = document.getElementById('emergency-button');
    if (!button) {
        console.error('Notfallknopf nicht gefunden');
        return;
    }

    // Touch- und Maus-Events
    button.addEventListener('mousedown', handlePressStart);
    button.addEventListener('touchstart', handlePressStart, { passive: true });
    
    button.addEventListener('mouseup', handlePressEnd);
    button.addEventListener('touchend', handlePressEnd);
    button.addEventListener('mouseleave', handlePressEnd);
    button.addEventListener('touchcancel', handlePressEnd);

    console.log('Notfallknopf initialisiert');
}

function handlePressStart(e) {
    e.preventDefault();
    
    const { currentUser } = getCurrentUser();
    if (!currentUser) {
        showNotification('Du musst angemeldet sein.', 'error');
        return;
    }

    isPressed = true;
    const button = document.getElementById('emergency-button');
    button.classList.add('pressing');

    // Starte 3-Sekunden-Timer
    pressTimer = setTimeout(() => {
        if (isPressed) {
            triggerEmergency();
        }
    }, 3000);
}

function handlePressEnd(e) {
    if (!isPressed) return;
    
    isPressed = false;
    const button = document.getElementById('emergency-button');
    button.classList.remove('pressing');

    // Timer abbrechen
    if (pressTimer) {
        clearTimeout(pressTimer);
        pressTimer = null;
    }
}

async function triggerEmergency() {
    const button = document.getElementById('emergency-button');
    button.classList.remove('pressing');
    button.classList.add('triggered');
    
    // Vibration (falls unterstützt)
    if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
    }

    try {
        // Versuche Standort abzurufen
        let location = null;
        
        if (navigator.geolocation) {
            try {
                location = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            resolve({
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                                accuracy: position.coords.accuracy
                            });
                        },
                        (error) => {
                            console.warn('Standort konnte nicht abgerufen werden:', error);
                            resolve(null);
                        },
                        {
                            timeout: 5000,
                            enableHighAccuracy: false
                        }
                    );
                });
            } catch (error) {
                console.warn('Fehler beim Abrufen des Standorts:', error);
            }
        }

        // Sende Notfall-Alarm
        await sendEmergencyAlert(location);
        
        showNotification('🚨 Notruf wurde gesendet!', 'success');
        
    } catch (error) {
        console.error('Fehler beim Senden des Notrufs:', error);
        showNotification('Fehler beim Senden des Notrufs.', 'error');
    } finally {
        setTimeout(() => {
            button.classList.remove('triggered');
        }, 500);
    }
}

async function sendEmergencyAlert(location) {
    const { currentUser, currentUserData, currentFamilyId } = getCurrentUser();
    
    if (!currentFamilyId || !currentUser) {
        throw new Error('Keine Familien-ID oder Benutzer gefunden');
    }

    const postsRef = collection(db, 'families', currentFamilyId, 'posts');
    
    const emergencyPost = {
        type: 'emergency_alert',
        authorId: currentUser.uid,
        authorName: currentUserData.name || 'Benutzer',
        authorAvatar: currentUserData.avatarUrl || '',
        text: '🚨 NOTFALL - Hilfe benötigt!',
        location: location,
        createdAt: serverTimestamp(),
        likes: [],
        commentsCount: 0
    };

    await addDoc(postsRef, emergencyPost);
}

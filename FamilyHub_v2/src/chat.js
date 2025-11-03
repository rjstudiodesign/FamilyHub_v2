import { db, collection, query, where, orderBy, onSnapshot, addDoc, doc, updateDoc, serverTimestamp } from './firebase.js';
import { getCurrentUser } from './auth.js';
import { showNotification, openModal, closeModal } from './ui.js';

// Globale Variablen
let currentMessagesUnsubscribe = () => {}; // Initialisiere als leere Funktion
let currentChatId = null;

// Rendert die Haupt-Chat-Liste
export function renderChat(listeners) {
    const { currentUser, currentFamilyId, membersData } = getCurrentUser();
    if (!currentUser) return;

    const listContainer = document.getElementById('chat-list-container');
    
    const chatsQuery = query(
        collection(db, 'families', currentFamilyId, 'chats'),
        where('members', 'array-contains', currentUser.uid),
        orderBy('updatedAt', 'desc')
    );

    listeners.chats = onSnapshot(chatsQuery, (snapshot) => {
        if (snapshot.empty) {
            listContainer.innerHTML = "<p class='text-secondary p-4 text-center text-sm'>Starte deine erste Konversation.</p>";
            return;
        }
        listContainer.innerHTML = snapshot.docs.map(doc => {
            const chat = { id: doc.id, ...doc.data() };
            return renderChatListItem(chat, currentUser, membersData);
        }).join('');
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }, (error) => {
        console.error("Error loading chats:", error);
        listContainer.innerHTML = "<p class='text-red-500 p-4'>Fehler beim Laden der Chats.</p>";
    });

    // Formular-Handler für das Senden von Nachrichten
    const chatForm = document.getElementById('chat-input-form');
    chatForm.onsubmit = async (e) => {
        e.preventDefault();
        const input = document.getElementById('chat-message-input');
        const text = input.value.trim();
        
        if (!text || !currentChatId) return; // Nichts tun, wenn kein Text oder Chat ausgewählt

        const { currentUser, currentUserData, currentFamilyId } = getCurrentUser();
        input.value = ''; // Input sofort leeren

        try {
            // 1. Nachricht zur Subcollection hinzufügen
            const messagesCol = collection(db, 'families', currentFamilyId, 'chats', currentChatId, 'messages');
            await addDoc(messagesCol, {
                text: text,
                senderId: currentUser.uid,
                senderName: currentUserData.name,
                createdAt: serverTimestamp()
            });

            // 2. Parent-Chat-Dokument für die Listenansicht aktualisieren
            const chatRef = doc(db, 'families', currentFamilyId, 'chats', currentChatId);
            await updateDoc(chatRef, {
                lastMessage: text,
                updatedAt: serverTimestamp(),
                unread: true // (Optional: Setze 'ungelesen' Status für andere)
            });
            
            scrollToChatBottom(); // Erneut scrollen
        } catch (error) {
            console.error("Error sending message:", error);
            // showNotification ist nicht definiert, daher auskommentiert
            // showNotification("Senden fehlgeschlagen", "error");
            input.value = text; // Text bei Fehler wiederherstellen
        }
    };

    // Globale Funktionen für die Chat-UI
    window.openChatWindow = (chatId, chatName, chatAvatar) => openChatWindow(chatId, chatName, chatAvatar);
    window.closeChatWindow = () => closeChatWindow();
    // showNotification ist nicht definiert, daher auskommentiert
    // window.openNewChatModal = () => showNotification("Neue Chats bald verfügbar", "info");
    window.openNewChatModal = () => showNotification("Neue Chats bald verfügbar", "info");
}

// Erstellt das HTML für ein einzelnes Chat-Listen-Element
function renderChatListItem(chat, currentUser, membersData) {
    let chatName = chat.name || 'Gruppenchat';
    let chatAvatar = 'https://ui-avatars.com/api/?name=G&background=0A0908&color=F2F4F3';

    // Logik für Direktnachrichten (DM)
    if (chat.type === 'direct') {
        const otherMemberUid = chat.members.find(uid => uid !== currentUser.uid);
        const otherMember = membersData[otherMemberUid];
        if (otherMember) {
            chatName = otherMember.name;
            chatAvatar = otherMember.photoURL || `https://ui-avatars.com/api/?name=${otherMember.name.charAt(0)}&background=0A0908&color=F2F4F3`;
        } else {
            chatName = 'Unbekannt';
        }
    }

    return `
    <div class="chat-list-item" onclick="window.openChatWindow('${chat.id}', '${chatName}', '${chatAvatar}')">
        <img src="${chatAvatar}" alt="${chatName}" class="chat-list-avatar">
        <div class="flex-1 min-w-0">
            <p class="font-semibold text-white truncate">${chatName}</p>
            <p class="text-sm text-secondary truncate">${chat.lastMessage || 'Keine Nachrichten'}</p>
        </div>
        ${chat.unread ? '<div class="chat-list-unread-badge"></div>' : ''}
    </div>
    `;
}

// Erstellt das HTML für eine einzelne Nachrichten-Bubble
function renderMessageBubble(message, currentUserId) {
    const isOwn = message.senderId === currentUserId;
    const bubbleClass = isOwn ? 'chat-bubble-own' : 'chat-bubble-other';
    const senderName = isOwn ? '' : `<p class="chat-message-sender">${message.senderName || 'Unbekannt'}</p>`;
    
    return `
    <div class="chat-message-container">
        ${senderName}
        <div class="${bubbleClass} chat-bubble">
            ${message.text}
        </div>
    </div>
    `;
}

// Scrollt den Chat nach unten
function scrollToChatBottom() {
    const container = document.getElementById('chat-messages-container');
    if (container) {
        container.scrollTop = container.scrollHeight;
    }
}

// --- STEUERUNGSFUNKTIONEN FÜR CHAT-FENSTER ---

// Zeigt das Chat-Fenster an und lädt Nachrichten
function openChatWindow(chatId, chatName, chatAvatar) {
    const { currentUser, currentFamilyId } = getCurrentUser();
    if (!currentUser) return;

    // 1. Alten Listener beenden
    currentMessagesUnsubscribe();
    currentChatId = chatId; // Setze den neuen aktiven Chat

    // 2. UI-Paneele umschalten
    document.getElementById('chat-list-panel').classList.add('hidden', 'lg:flex');
    document.getElementById('chat-window-panel').classList.remove('translate-x-full');
    document.getElementById('chat-empty-state').classList.add('hidden');
    
    const activeWindow = document.getElementById('chat-window-active');
    activeWindow.classList.remove('hidden');
    activeWindow.classList.add('flex');

    // 3. Chat-Header aktualisieren
    document.getElementById('chat-header-avatar').src = chatAvatar;
    document.getElementById('chat-header-name').textContent = chatName;
    document.getElementById('chat-header-status').textContent = "Online"; // (Platzhalter)

    // 4. Nachrichten-Container vorbereiten
    const messagesContainer = document.getElementById('chat-messages-container');
    messagesContainer.innerHTML = '<div class="spinner mx-auto mt-10"></div>'; // Lade-Spinner

    // 5. Neuen Nachrichten-Listener starten
    const messagesQuery = query(
        collection(db, 'families', currentFamilyId, 'chats', chatId, 'messages'),
        orderBy('createdAt', 'asc') // Wichtig: aufsteigend für Chat-Reihenfolge
    );

    currentMessagesUnsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        messagesContainer.innerHTML = ''; // Leeren bei Update
        if (snapshot.empty) {
            messagesContainer.innerHTML = '<p class="text-center text-secondary text-sm">Noch keine Nachrichten.</p>';
            return;
        }
        
        snapshot.docs.forEach(doc => {
            const msg = doc.data();
            messagesContainer.innerHTML += renderMessageBubble(msg, currentUser.uid);
        });

        scrollToChatBottom(); // Automatisch nach unten scrollen
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }, (error) => {
        console.error("Error loading messages:", error);
        messagesContainer.innerHTML = "<p class='text-red-500 p-4'>Fehler beim Laden der Nachrichten.</p>";
    });
}

// Schließt das Chat-Fenster (nur Mobil)
function closeChatWindow() {
    document.getElementById('chat-list-panel').classList.remove('hidden');
    document.getElementById('chat-window-panel').classList.add('translate-x-full');

    // WICHTIG: Listener beenden
    currentMessagesUnsubscribe();
    currentChatId = null; // Aktiven Chat zurücksetzen
}

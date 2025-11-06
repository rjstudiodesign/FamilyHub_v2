import { db, collection, query, where, orderBy, onSnapshot, addDoc, doc, updateDoc, serverTimestamp, getDocs } from './firebase.js';
import { getCurrentUser } from './auth.js';
import { showNotification, openModal, closeModal, showButtonSpinner, hideButtonSpinner } from './ui.js';
import { Card } from './components/Card.js';
import { navigateTo } from './navigation.js'; // NEU: Import für Navigation

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
        const listContainer = document.getElementById('chat-list-container');
        if (!listContainer) return;

        if (snapshot.empty) {
            listContainer.innerHTML = "<p class='text-secondary p-4 text-center text-sm'>Starte deine erste Konversation.</p>";
            return;
        }

        snapshot.docChanges().forEach(change => {
            const chat = { id: change.doc.id, ...change.doc.data() };
            const elementId = `chat-list-item-${chat.id}`;
            let existingElement = document.getElementById(elementId);

            if (change.type === "removed") {
                if (existingElement) {
                    existingElement.remove();
                }
                return;
            }
            
            const newHtml = renderChatListItem(chat, currentUser, membersData);
            
            if (existingElement) {
                // Element aktualisieren
                existingElement.innerHTML = new DOMParser().parseFromString(newHtml, 'text/html').body.firstChild.innerHTML;
            } else {
                // Element hinzufügen
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = newHtml;
                existingElement = tempDiv.firstChild;
                existingElement.id = elementId;
            }

            // An die richtige Position verschieben (oben, da nach `updatedAt` sortiert)
            if (listContainer.firstChild !== existingElement) {
                listContainer.prepend(existingElement);
            }
        });
        
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
            showNotification("Senden fehlgeschlagen", "error");
            input.value = text; // Text bei Fehler wiederherstellen
        }
    };

    // Globale Funktionen für die Chat-UI
    window.openChatWindow = (chatId, chatName, chatAvatar) => openChatWindow(chatId, chatName, chatAvatar);
    window.closeChatWindow = () => closeChatWindow();
    
    // --- Implementierte Chat-Erstellung (1:1) ---
    window.openNewChatModal = () => {
        const { currentUser, membersData } = getCurrentUser();
        const modalId = 'modal-new-chat';
        
        const memberListHTML = Object.values(membersData)
            .filter(member => member.uid !== currentUser.uid)
            .map(member => `
                <button type="button" class="member-select-item" onclick="window.startDirectChat(this, '${member.uid}', '${member.name}')">
                    <img src="${member.photoURL || `https://ui-avatars.com/api/?name=${member.name.charAt(0)}`}" alt="${member.name}" class="member-select-avatar">
                    <span class="font-semibold text-white">${member.name}</span>
                </button>
            `).join('');

        const modalContent = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gradient">Neue Nachricht</h2>
                <button type="button" class="icon-button-ghost p-2 -mr-2 -mt-2" data-action="close-modal">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>
            <p class="text-secondary mb-4">Wähle ein Mitglied aus, um eine private Konversation zu starten.</p>
            <div class="space-y-2 max-h-[60vh] overflow-y-auto">
                ${memberListHTML || '<p class="text-secondary text-sm">Keine anderen Mitglieder gefunden.</p>'}
            </div>
        `;
        
        openModal(Card(modalContent, { variant: 'premium', className: 'animate-slide-in-up max-w-md w-full', padding: 'lg' }), modalId);
        if (typeof lucide !== 'undefined') lucide.createIcons();
    };

    // --- Logik zum Starten eines 1:1-Chats ---
    window.startDirectChat = async (button, otherMemberUid, otherMemberName) => {
        if(button) showButtonSpinner(button);
        const { currentUser, currentFamilyId, membersData } = getCurrentUser();

        // 1. Prüfen, ob ein Chat bereits existiert
        try {
            const chatsRef = collection(db, 'families', currentFamilyId, 'chats');
            const q = query(chatsRef, 
                where('type', '==', 'direct'),
                where('members', 'array-contains', currentUser.uid)
            );
            
            const querySnapshot = await getDocs(q);
            let existingChatId = null;
            
            querySnapshot.forEach(doc => {
                const chat = doc.data();
                if (chat.members.includes(otherMemberUid) && chat.members.length === 2) {
                    existingChatId = doc.id;
                }
            });
            
            const otherMember = membersData[otherMemberUid];
            const chatAvatar = otherMember.photoURL || `https://ui-avatars.com/api/?name=${otherMember.name.charAt(0)}&background=0A0908&color=F2F4F3`;
            let chatIdToOpen = existingChatId;

            if (!existingChatId) {
                // 2b. Chat existiert nicht: Erstellen
                const newChatRef = await addDoc(chatsRef, {
                    type: 'direct',
                    members: [currentUser.uid, otherMemberUid],
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                    lastMessage: 'Chat gestartet'
                });
                chatIdToOpen = newChatRef.id;
            }
            
            closeModal('modal-new-chat');
            openChatWindow(chatIdToOpen, otherMemberName, chatAvatar);

        } catch (error) {
            console.error("Error starting direct chat:", error);
            showNotification("Fehler beim Starten des Chats.", "error");
            if(button) hideButtonSpinner(button);
        }
    };

    // --- NEU: Logik zum Starten eines Kontext-Chats (Gruppe) ---
    window.startContextChat = async (contextType, contextId, contextTitle) => {
        const { currentUser, currentFamilyId, membersData } = getCurrentUser();
        const fullContextId = `${contextType}_${contextId}`; // z.B. 'pinnwandTask_XyZ123'

        showNotification("Suche nach Chat...", "info");

        try {
            const chatsRef = collection(db, 'families', currentFamilyId, 'chats');
            
            // 1. Prüfen, ob ein Chat für diesen Kontext bereits existiert
            const q = query(chatsRef, 
                where('contextId', '==', fullContextId),
                where('members', 'array-contains', currentUser.uid) // Stelle sicher, dass ich Mitglied bin
            );

            const querySnapshot = await getDocs(q);
            let existingChat = null;
            
            if (!querySnapshot.empty) {
                existingChat = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
            }

            let chatIdToOpen = null;
            let chatName = '';
            let chatAvatar = '';

            if (existingChat) {
                // 2a. Chat existiert: Öffnen
                chatIdToOpen = existingChat.id;
                chatName = existingChat.name;
                chatAvatar = existingChat.avatar || 'https://ui-avatars.com/api/?name=G&background=0A0908&color=F2F4F3';
            } else {
                // 2b. Chat existiert nicht: Erstellen
                // Standardmäßig alle Mitglieder zur Diskussion einladen
                const allMemberIds = Object.keys(membersData);
                const newChatName = `Aufgabe: ${contextTitle.substring(0, 20)}...`;
                chatAvatar = 'https://ui-avatars.com/api/?name=T&background=0A0908&color=F2F4F3'; // 'T' für Task
                
                const newChatRef = await addDoc(chatsRef, {
                    type: 'group',
                    name: newChatName,
                    members: allMemberIds,
                    contextId: fullContextId, // Verknüpfung zur Aufgabe
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                    lastMessage: `${currentUser.name} hat eine Diskussion gestartet.`
                });
                
                chatIdToOpen = newChatRef.id;
                chatName = newChatName;
            }

            // 3. Zur Chat-Seite navigieren und den Chat öffnen
            navigateTo('chat');
            
            // Kurze Verzögerung, damit die Chat-Seite rendern kann, bevor das Fenster geöffnet wird
            setTimeout(() => {
                openChatWindow(chatIdToOpen, chatName, chatAvatar);
            }, 100); // 100ms Puffer

        } catch (error) {
            console.error("Error starting context chat:", error);
            showNotification("Fehler beim Starten des Chats.", "error");
        }
    };
}

// Erstellt das HTML für ein einzelnes Chat-Listen-Element
function renderChatListItem(chat, currentUser, membersData) {
    let chatName = chat.name || 'Gruppenchat';
    let chatAvatar = chat.avatar || 'https://ui-avatars.com/api/?name=G&background=0A0908&color=F2F4F3';

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

    // Kontext-Icon für Gruppen-Chats
    if (chat.type === 'group' && chat.contextId) {
        if (chat.contextId.startsWith('pinnwandTask')) {
            // Icon (z.B. Pinnwand-Icon) könnte hier hinzugefügt werden
            chatName = `[Aufgabe] ${chat.name}`;
        }
    }


    return `
    <div class="chat-list-item" onclick="window.openChatWindow('${chat.id}', '${chat.name || chatName}', '${chatAvatar}')">
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
        if (snapshot.empty) {
            messagesContainer.innerHTML = '<p class="text-center text-secondary text-sm">Noch keine Nachrichten.</p>';
            return;
        }

        snapshot.docChanges().forEach(change => {
            if (change.type === "added") {
                const msg = change.doc.data();
                const msgId = `msg-${change.doc.id}`;
                // Verhindern, dass dieselbe Nachricht mehrmals hinzugefügt wird
                if (!document.getElementById(msgId)) {
                    const msgElement = document.createElement('div');
                    msgElement.id = msgId;
                    msgElement.innerHTML = renderMessageBubble(msg, currentUser.uid);
                    messagesContainer.appendChild(msgElement);
                }
            }
            // 'modified' und 'removed' sind für Chats seltener, können aber hier implementiert werden
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

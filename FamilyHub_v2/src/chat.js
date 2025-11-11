import { db, storage, collection, query, where, orderBy, onSnapshot, addDoc, doc, updateDoc, serverTimestamp, getDocs, ref, uploadBytesResumable, getDownloadURL } from './firebase.js';
import { getCurrentUser } from './auth.js';
import { showNotification, openModal, closeModal, showButtonSpinner, hideButtonSpinner } from './ui.js';
import { Card } from './components/Card.js';
import { navigateTo } from './navigation.js'; // NEU: Import für Navigation

// Globale Variablen
let currentMessagesUnsubscribe = () => {}; // Initialisiere als leere Funktion
let currentChatId = null;
let mediaRecorder = null;
let audioChunks = [];
let recordingStartTime = null;
let recordingInterval = null;

// Rendert die Haupt-Chat-Liste
export function renderChat(listeners, params = {}) {
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

    // --- NEU: Event-Listener für UI-Buttons ---
    const createChatBtn = document.getElementById('fab-create-chat');
    if (createChatBtn) {
        createChatBtn.addEventListener('click', () => window.openNewChatModal());
    }

    const backBtn = document.getElementById('chat-back-button');
    if (backBtn) {
        backBtn.addEventListener('click', () => window.closeChatWindow());
    }

    // Formular-Handler für das Senden von Nachrichten
    const chatForm = document.getElementById('chat-input-form');
    const chatInput = document.getElementById('chat-message-input');
    const sendBtn = document.getElementById('chat-send-btn');
    const micBtn = document.getElementById('chat-mic-btn');
    const attachmentBtn = document.getElementById('chat-attachment-btn');
    const attachmentMenu = document.getElementById('chat-attachment-menu');
    const galleryBtn = document.getElementById('chat-gallery-btn');
    const cameraBtn = document.getElementById('chat-camera-btn');
    const fileInput = document.getElementById('chat-file-input');
    
    // --- NEU: Input-Überwachung für Send/Mic-Button Toggle ---
    chatInput.addEventListener('input', () => {
        if (chatInput.value.trim()) {
            sendBtn.classList.remove('hidden');
            micBtn.classList.add('hidden');
        } else {
            sendBtn.classList.add('hidden');
            micBtn.classList.remove('hidden');
        }
    });
    
    // Initiale Anzeige setzen
    if (chatInput.value.trim()) {
        sendBtn.classList.remove('hidden');
        micBtn.classList.add('hidden');
    } else {
        sendBtn.classList.add('hidden');
        micBtn.classList.remove('hidden');
    }
    
    // --- NEU: Attachment-Menu Toggle ---
    attachmentBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        attachmentMenu.classList.toggle('hidden');
    });
    
    // Klick außerhalb schließt das Menu
    document.addEventListener('click', (e) => {
        if (!attachmentBtn.contains(e.target) && !attachmentMenu.contains(e.target)) {
            attachmentMenu.classList.add('hidden');
        }
    });
    
    // --- NEU: Galerie-Button Handler ---
    galleryBtn.addEventListener('click', () => {
        attachmentMenu.classList.add('hidden');
        fileInput.click();
    });
    
    // --- NEU: File-Input Handler ---
    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file && currentChatId) {
            await uploadImageMessage(file, currentChatId);
            fileInput.value = ''; // Reset
        }
    });
    
    // --- NEU: Kamera-Button Handler ---
    cameraBtn.addEventListener('click', () => {
        attachmentMenu.classList.add('hidden');
        openCameraModal();
    });
    
    // --- NEU: Mikrofon-Button Handler (Hold to Record) ---
    let pressTimer = null;
    
    micBtn.addEventListener('mousedown', () => {
        pressTimer = setTimeout(() => {
            startVoiceRecording();
        }, 200); // 200ms verzögert, um versehentliche Klicks zu vermeiden
    });
    
    micBtn.addEventListener('mouseup', () => {
        clearTimeout(pressTimer);
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            stopVoiceRecording();
        }
    });
    
    micBtn.addEventListener('mouseleave', () => {
        clearTimeout(pressTimer);
    });
    
    // Touch-Events für mobile Geräte
    micBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        pressTimer = setTimeout(() => {
            startVoiceRecording();
        }, 200);
    });
    
    micBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        clearTimeout(pressTimer);
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            stopVoiceRecording();
        }
    });
    
    chatForm.onsubmit = async (e) => {
        e.preventDefault();
        const input = document.getElementById('chat-message-input');
        const text = input.value.trim();
        
        if (!text || !currentChatId) return; // Nichts tun, wenn kein Text oder Chat ausgewählt

        const { currentUser, currentUserData, currentFamilyId } = getCurrentUser();
        input.value = ''; // Input sofort leeren
        
        // Button-Toggle zurücksetzen
        sendBtn.classList.add('hidden');
        micBtn.classList.remove('hidden');

        try {
            // 1. Nachricht zur Subcollection hinzufügen
            const messagesCol = collection(db, 'families', currentFamilyId, 'chats', currentChatId, 'messages');
            await addDoc(messagesCol, {
                type: 'text', // NEU: Typ hinzugefügt
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
        
        const memberCheckboxesHTML = Object.values(membersData)
            .filter(member => member.uid !== currentUser.uid)
            .map(member => `
                <label class="member-select-item cursor-pointer hover:bg-white/5 transition-all">
                    <div class="flex items-center gap-3 flex-1">
                        <img src="${member.photoURL || `https://ui-avatars.com/api/?name=${member.name.charAt(0)}`}" 
                             alt="${member.name}" 
                             class="member-select-avatar">
                        <span class="font-semibold text-white">${member.name}</span>
                    </div>
                    <input type="checkbox" 
                           name="group-member" 
                           value="${member.uid}" 
                           data-name="${member.name}"
                           class="form-checkbox w-5 h-5 rounded border-border-glass bg-background-glass text-accent-glow focus:ring-accent-glow">
                </label>
            `).join('');

        const modalContent = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gradient">Neue Gruppe erstellen</h2>
                <button type="button" class="icon-button-ghost p-2 -mr-2 -mt-2" data-action="close-modal">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>
            <form id="create-group-form" class="space-y-4">
                <div>
                    <label for="group-name" class="form-label">Gruppenname</label>
                    <input type="text" 
                           id="group-name" 
                           class="form-input" 
                           placeholder="z.B. Müttertreff, Familienrat..."
                           required>
                </div>
                <div>
                    <label class="form-label mb-3 block">Mitglieder auswählen</label>
                    <div class="space-y-2 max-h-[40vh] overflow-y-auto p-2 -mx-2">
                        ${memberCheckboxesHTML || '<p class="text-secondary text-sm">Keine anderen Mitglieder gefunden.</p>'}
                    </div>
                </div>
                <div class="flex justify-end gap-3 pt-6 border-t border-border-glass">
                    <button type="button" class="btn-secondary" data-action="close-modal">Abbrechen</button>
                    <button type="submit" id="create-group-btn" class="cta-primary-glow">
                        <span class="btn-text">Gruppe erstellen</span>
                    </button>
                </div>
            </form>
        `;
        
        openModal(Card(modalContent, { variant: 'premium', className: 'animate-slide-in-up max-w-md w-full', padding: 'lg' }), modalId);
        if (typeof lucide !== 'undefined') lucide.createIcons();
        
        // Event-Listener für Formular
        document.getElementById('create-group-form').addEventListener('submit', handleCreateGroupChat);
    };

    // --- Logik zum Erstellen eines Gruppen-Chats ---
    async function handleCreateGroupChat(e) {
        e.preventDefault();
        
        const submitBtn = document.getElementById('create-group-btn');
        showButtonSpinner(submitBtn);
        
        const { currentUser, currentFamilyId, membersData } = getCurrentUser();
        const groupName = document.getElementById('group-name').value.trim();
        const checkboxes = document.querySelectorAll('input[name="group-member"]:checked');
        
        // Sammle ausgewählte Mitglieder
        const selectedMembers = Array.from(checkboxes).map(cb => cb.value);
        
        if (!groupName) {
            showNotification("Bitte gib einen Gruppennamen ein.", "error");
            hideButtonSpinner(submitBtn);
            return;
        }
        
        if (selectedMembers.length === 0) {
            showNotification("Bitte wähle mindestens ein Mitglied aus.", "error");
            hideButtonSpinner(submitBtn);
            return;
        }
        
        // Füge den aktuellen Benutzer hinzu
        const allMembers = [currentUser.uid, ...selectedMembers];
        
        try {
            const chatsRef = collection(db, 'families', currentFamilyId, 'chats');
            
            // Erstelle Gruppen-Avatar (erste Buchstaben der ersten 3 Mitglieder)
            const memberNames = allMembers.slice(0, 3).map(uid => {
                if (uid === currentUser.uid) return membersData[currentUser.uid]?.name || 'Du';
                return membersData[uid]?.name || 'Unbekannt';
            });
            const avatarInitials = memberNames.map(n => n.charAt(0)).join('');
            const groupAvatar = `https://ui-avatars.com/api/?name=${avatarInitials}&background=A04668&color=F2F4F3&bold=true`;
            
            const newChatRef = await addDoc(chatsRef, {
                type: 'group',
                name: groupName,
                avatar: groupAvatar,
                members: allMembers,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                lastMessage: `${membersData[currentUser.uid]?.name || 'Jemand'} hat die Gruppe erstellt`,
                createdBy: currentUser.uid
            });
            
            closeModal('modal-new-chat');
            showNotification(`Gruppe "${groupName}" erstellt!`, "success");
            openChatWindow(newChatRef.id, groupName, groupAvatar);
            
        } catch (error) {
            console.error("Error creating group chat:", error);
            showNotification("Fehler beim Erstellen der Gruppe.", "error");
        } finally {
            hideButtonSpinner(submitBtn);
        }
    }

    // --- Logik zum Starten eines 1:1-Chats (bleibt erhalten für Kompatibilität) ---
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

            // 3. Zur Chat-Seite navigieren und den Chat als Parameter übergeben
            navigateTo('chat', { 
                initialChat: {
                    chatId: chatIdToOpen,
                    chatName: chatName,
                    chatAvatar: chatAvatar
                }
            });

        } catch (error) {
            console.error("Error starting context chat:", error);
            showNotification("Fehler beim Starten des Chats.", "error");
        }
    };
}

// Erstellt das HTML für ein einzelnes Chat-Listen-Element
function renderChatListItem(chat, currentUser, membersData) {
    let chatName = chat.name || 'Gruppenchat';
    let chatAvatar = chat.avatar || 'https://ui-avatars.com/api/?name=G&background=A04668&color=F2F4F3';

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
    
    // Logik für Gruppenchats
    if (chat.type === 'group') {
        chatName = chat.name || 'Gruppenchat';
        chatAvatar = chat.avatar || 'https://ui-avatars.com/api/?name=G&background=A04668&color=F2F4F3';
        
        // Kontext-Icon für spezielle Gruppen-Chats (z.B. Pinnwand)
        if (chat.contextId && chat.contextId.startsWith('pinnwandTask')) {
            chatName = `📌 ${chat.name}`;
        }
    }


    return `
    <div class="chat-list-item" onclick="window.openChatWindow('${chat.id}', '${chatName.replace(/'/g, "\\'")}', '${chatAvatar}')">
        <img src="${chatAvatar}" alt="${chatName}" class="chat-list-avatar">
        <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
                <p class="font-semibold text-white truncate">${chatName}</p>
                ${chat.type === 'group' ? '<span class="text-xs text-secondary">👥</span>' : ''}
            </div>
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
    
    let content = '';
    
    // NEU: Verschiedene Nachrichten-Typen
    switch (message.type) {
        case 'text':
            content = `<div class="${bubbleClass} chat-bubble">${message.text}</div>`;
            break;
            
        case 'image':
            content = `
                <div class="${bubbleClass} chat-bubble p-0 overflow-hidden max-w-[300px]">
                    <img src="${message.imageURL}" 
                         alt="Bild" 
                         class="w-full h-auto cursor-pointer rounded-lg"
                         onclick="window.openImageModal('${message.imageURL}')"
                         loading="lazy">
                </div>
            `;
            break;
            
        case 'audio':
            const duration = message.duration ? `${Math.floor(message.duration / 60)}:${String(message.duration % 60).padStart(2, '0')}` : '';
            content = `
                <div class="${bubbleClass} chat-bubble flex items-center gap-3 min-w-[200px]">
                    <audio src="${message.audioURL}" controls class="flex-1 h-8" style="max-width: 250px;"></audio>
                    ${duration ? `<span class="text-xs text-secondary">${duration}</span>` : ''}
                </div>
            `;
            break;
            
        default:
            // Fallback für alte Nachrichten ohne type
            content = `<div class="${bubbleClass} chat-bubble">${message.text || '[Unbekannter Nachrichtentyp]'}</div>`;
    }
    
    return `
    <div class="chat-message-container">
        ${senderName}
        ${content}
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

// === NEU: UPLOAD-FUNKTIONEN ===

// Upload von Bildern aus der Galerie
async function uploadImageMessage(file, chatId) {
    const { currentUser, currentUserData, currentFamilyId } = getCurrentUser();
    if (!file || !chatId) return;
    
    showNotification("Bild wird hochgeladen...", "info");
    
    try {
        // 1. Upload zu Firebase Storage
        const storageRef = ref(storage, `chats/${currentFamilyId}/${chatId}/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Upload: ${progress}% fertig`);
            },
            (error) => {
                console.error("Upload-Fehler:", error);
                showNotification("Bild-Upload fehlgeschlagen", "error");
            },
            async () => {
                // 2. Download-URL erhalten
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                
                // 3. Nachricht in Firestore speichern
                const messagesCol = collection(db, 'families', currentFamilyId, 'chats', chatId, 'messages');
                await addDoc(messagesCol, {
                    type: 'image',
                    imageURL: downloadURL,
                    senderId: currentUser.uid,
                    senderName: currentUserData.name,
                    createdAt: serverTimestamp()
                });
                
                // 4. Chat-Dokument aktualisieren
                const chatRef = doc(db, 'families', currentFamilyId, 'chats', chatId);
                await updateDoc(chatRef, {
                    lastMessage: '📷 Bild',
                    updatedAt: serverTimestamp(),
                    unread: true
                });
                
                showNotification("Bild gesendet!", "success");
                scrollToChatBottom();
            }
        );
    } catch (error) {
        console.error("Fehler beim Hochladen:", error);
        showNotification("Bild-Upload fehlgeschlagen", "error");
    }
}

// Upload von Sprachnachrichten
async function uploadAudioMessage(audioBlob, duration, chatId) {
    const { currentUser, currentUserData, currentFamilyId } = getCurrentUser();
    if (!audioBlob || !chatId) return;
    
    showNotification("Sprachnachricht wird hochgeladen...", "info");
    
    try {
        // 1. Upload zu Firebase Storage
        const fileName = `voice_${Date.now()}.webm`;
        const storageRef = ref(storage, `chats/${currentFamilyId}/${chatId}/${fileName}`);
        const uploadTask = uploadBytesResumable(storageRef, audioBlob);
        
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Upload: ${progress}% fertig`);
            },
            (error) => {
                console.error("Upload-Fehler:", error);
                showNotification("Sprachnachricht-Upload fehlgeschlagen", "error");
            },
            async () => {
                // 2. Download-URL erhalten
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                
                // 3. Nachricht in Firestore speichern
                const messagesCol = collection(db, 'families', currentFamilyId, 'chats', chatId, 'messages');
                await addDoc(messagesCol, {
                    type: 'audio',
                    audioURL: downloadURL,
                    duration: Math.floor(duration),
                    senderId: currentUser.uid,
                    senderName: currentUserData.name,
                    createdAt: serverTimestamp()
                });
                
                // 4. Chat-Dokument aktualisieren
                const chatRef = doc(db, 'families', currentFamilyId, 'chats', chatId);
                await updateDoc(chatRef, {
                    lastMessage: '🎤 Sprachnachricht',
                    updatedAt: serverTimestamp(),
                    unread: true
                });
                
                showNotification("Sprachnachricht gesendet!", "success");
                scrollToChatBottom();
            }
        );
    } catch (error) {
        console.error("Fehler beim Hochladen:", error);
        showNotification("Sprachnachricht-Upload fehlgeschlagen", "error");
    }
}

// === NEU: SPRACHAUFNAHME-FUNKTIONEN ===

async function startVoiceRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];
        
        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };
        
        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            const duration = (Date.now() - recordingStartTime) / 1000; // Sekunden
            
            // Stream beenden
            stream.getTracks().forEach(track => track.stop());
            
            // Upload
            if (currentChatId && duration > 0.5) { // Mindestens 0.5 Sekunden
                await uploadAudioMessage(audioBlob, duration, currentChatId);
            } else {
                showNotification("Aufnahme zu kurz", "info");
            }
            
            // UI zurücksetzen
            hideRecordingIndicator();
        };
        
        mediaRecorder.start();
        recordingStartTime = Date.now();
        showRecordingIndicator();
        
    } catch (error) {
        console.error("Fehler beim Starten der Aufnahme:", error);
        showNotification("Mikrofon-Zugriff verweigert", "error");
    }
}

function stopVoiceRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
    }
}

function showRecordingIndicator() {
    const indicator = document.getElementById('chat-recording-indicator');
    const timeDisplay = document.getElementById('chat-recording-time');
    indicator.classList.remove('hidden');
    
    let seconds = 0;
    recordingInterval = setInterval(() => {
        seconds++;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timeDisplay.textContent = `${mins}:${String(secs).padStart(2, '0')}`;
    }, 1000);
}

function hideRecordingIndicator() {
    const indicator = document.getElementById('chat-recording-indicator');
    indicator.classList.add('hidden');
    if (recordingInterval) {
        clearInterval(recordingInterval);
        recordingInterval = null;
    }
}

// === NEU: KAMERA-FUNKTIONEN ===

function openCameraModal() {
    const modalId = 'camera-modal';
    
    const modalContent = `
        <div class="space-y-4">
            <div class="flex justify-between items-center">
                <h2 class="text-xl font-bold text-gradient">Foto aufnehmen</h2>
                <button type="button" class="icon-button-ghost" data-action="close-modal">
                    <i data-lucide="x" class="w-6 h-6"></i>
                </button>
            </div>
            
            <div class="relative bg-black rounded-lg overflow-hidden">
                <video id="camera-video" autoplay playsinline class="w-full max-h-[50vh] object-cover"></video>
                <canvas id="camera-canvas" class="hidden"></canvas>
                
                <!-- Vorschau nach dem Foto -->
                <img id="camera-preview" class="hidden w-full max-h-[50vh] object-cover">
            </div>
            
            <div class="flex gap-3 justify-center">
                <button type="button" id="camera-capture-btn" class="cta-primary-glow">
                    <i data-lucide="camera" class="w-5 h-5 mr-2"></i>
                    <span class="btn-text">Foto aufnehmen</span>
                </button>
                <button type="button" id="camera-send-btn" class="hidden cta-primary-glow">
                    <i data-lucide="send" class="w-5 h-5 mr-2"></i>
                    <span class="btn-text">Senden</span>
                </button>
                <button type="button" id="camera-retake-btn" class="hidden btn-secondary">
                    <i data-lucide="rotate-ccw" class="w-5 h-5 mr-2"></i>
                    <span>Erneut</span>
                </button>
            </div>
        </div>
    `;
    
    openModal(Card(modalContent, { variant: 'premium', className: 'max-w-2xl w-full' }), modalId);
    
    setTimeout(() => {
        startCamera();
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }, 100);
}

async function startCamera() {
    try {
        const video = document.getElementById('camera-video');
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'user' } // 'environment' für Rückkamera
        });
        
        video.srcObject = stream;
        
        // Capture-Button Handler
        document.getElementById('camera-capture-btn').onclick = () => {
            capturePhoto(stream);
        };
        
        // Retake-Button Handler
        document.getElementById('camera-retake-btn').onclick = () => {
            retakePhoto(stream);
        };
        
        // Send-Button Handler
        document.getElementById('camera-send-btn').onclick = async () => {
            const canvas = document.getElementById('camera-canvas');
            canvas.toBlob(async (blob) => {
                if (blob && currentChatId) {
                    // Stream beenden
                    stream.getTracks().forEach(track => track.stop());
                    
                    // Upload als Datei
                    const file = new File([blob], `camera_${Date.now()}.jpg`, { type: 'image/jpeg' });
                    await uploadImageMessage(file, currentChatId);
                    
                    closeModal('camera-modal');
                }
            }, 'image/jpeg', 0.9);
        };
        
    } catch (error) {
        console.error("Fehler beim Kamera-Zugriff:", error);
        showNotification("Kamera-Zugriff verweigert", "error");
        closeModal('camera-modal');
    }
}

function capturePhoto(stream) {
    const video = document.getElementById('camera-video');
    const canvas = document.getElementById('camera-canvas');
    const preview = document.getElementById('camera-preview');
    const captureBtn = document.getElementById('camera-capture-btn');
    const sendBtn = document.getElementById('camera-send-btn');
    const retakeBtn = document.getElementById('camera-retake-btn');
    
    // Canvas-Größe an Video anpassen
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Frame auf Canvas zeichnen
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    // Preview anzeigen
    preview.src = canvas.toDataURL('image/jpeg');
    preview.classList.remove('hidden');
    video.classList.add('hidden');
    
    // Buttons umschalten
    captureBtn.classList.add('hidden');
    sendBtn.classList.remove('hidden');
    retakeBtn.classList.remove('hidden');
    
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function retakePhoto(stream) {
    const video = document.getElementById('camera-video');
    const preview = document.getElementById('camera-preview');
    const captureBtn = document.getElementById('camera-capture-btn');
    const sendBtn = document.getElementById('camera-send-btn');
    const retakeBtn = document.getElementById('camera-retake-btn');
    
    // UI zurücksetzen
    preview.classList.add('hidden');
    video.classList.remove('hidden');
    
    captureBtn.classList.remove('hidden');
    sendBtn.classList.add('hidden');
    retakeBtn.classList.add('hidden');
    
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// === GLOBALE FUNKTIONEN FÜR MODAL-ZUGRIFF ===
window.openImageModal = (imageUrl) => {
    const modalId = 'image-viewer-modal';
    const modalContent = `
        <div class="relative">
            <button type="button" class="absolute top-2 right-2 icon-button-ghost z-10" data-action="close-modal">
                <i data-lucide="x" class="w-6 h-6"></i>
            </button>
            <img src="${imageUrl}" alt="Bild" class="w-full h-auto max-h-[80vh] object-contain rounded-lg">
        </div>
    `;
    openModal(Card(modalContent, { variant: 'premium', className: 'max-w-4xl w-full p-2' }), modalId);
    if (typeof lucide !== 'undefined') lucide.createIcons();
};

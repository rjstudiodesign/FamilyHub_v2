import { db, collection, query, onSnapshot, where, addDoc, serverTimestamp, doc, updateDoc, deleteDoc, orderBy } from './firebase.js';
import { getCurrentUser } from './auth.js';
import { WishlistCard } from './components/Wishlist.js';
import { EmptyStateCard } from './components/Card.js';
import { showNotification, openModal, closeModal } from './ui.js';

let currentWishlistFilter = 'all'; // Filter-Status
let allWishlistItems = []; // Lokaler Cache

// Filtert die Liste basierend auf dem globalen Filter
function renderFilteredItems() {
    const gridContainer = document.getElementById('wishlist-grid');
    const emptyContainer = document.getElementById('wishlist-empty-state');
    if (!gridContainer || !emptyContainer) return;

    const itemsToRender = currentWishlistFilter === 'all' 
        ? allWishlistItems 
        : allWishlistItems.filter(item => item.uploaderId === currentWishlistFilter);

    if (itemsToRender.length === 0) {
        const emptyMsg = currentWishlistFilter === 'all' ? 'Es gibt noch keine Wünsche.' : 'Dieses Mitglied hat noch keine Wünsche.';
        emptyContainer.innerHTML = EmptyStateCard('Wunschliste leer', emptyMsg, 'gift');
        emptyContainer.classList.remove('hidden');
        gridContainer.innerHTML = '';
    } else {
        gridContainer.innerHTML = itemsToRender.map(WishlistCard).join('');
        emptyContainer.classList.add('hidden');
    }
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

export function renderWishlist(listeners) {
    const { currentFamilyId, membersData, currentUser } = getCurrentUser();
    const tabsContainer = document.getElementById('wishlist-member-tabs');
    
    // 1. Member-Tabs rendern
    let tabsHTML = `<button class="feed-filter-btn active" onclick="window.filterWishlist(this, 'all')">Alle</button>`;
    tabsHTML += Object.values(membersData).map(member => 
        `<button class="feed-filter-btn" data-uid="${member.uid}" onclick="window.filterWishlist(this, '${member.uid}')">
            ${member.name}
        </button>`
    ).join('');
    tabsContainer.innerHTML = tabsHTML;
    currentWishlistFilter = 'all'; // Reset Filter

    // 2. Wünsche laden
    const itemsQuery = query(collection(db, 'families', currentFamilyId, 'wishlistItems'), orderBy('createdAt', 'desc'));
    listeners.wishlist = onSnapshot(itemsQuery, (snapshot) => {
        allWishlistItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderFilteredItems(); // Wende den aktuellen Filter an
    }, (error) => {
        console.error("Error loading wishlist:", error);
        showNotification("Fehler beim Laden der Wunschliste", "error");
    });

    // 3. Globale Fenster-Funktionen für diese Seite
    window.filterWishlist = (btn, uid) => {
        currentWishlistFilter = uid;
        // Aktiven Status umschalten
        document.querySelectorAll('#wishlist-member-tabs .feed-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderFilteredItems();
    };

    window.claimWish = async (itemId) => {
        const itemRef = doc(db, 'families', currentFamilyId, 'wishlistItems', itemId);
        try {
            await updateDoc(itemRef, {
                claimedBy: currentUser.uid
            });
            showNotification("Wunsch reserviert!", "success");
        } catch (error) {
            showNotification("Fehler beim Reservieren", "error");
        }
    };

    window.unclaimWish = async (itemId) => {
        const itemRef = doc(db, 'families', currentFamilyId, 'wishlistItems', itemId);
        try {
            await updateDoc(itemRef, {
                claimedBy: null
            });
            showNotification("Reservierung aufgehoben", "info");
        } catch (error) {
            showNotification("Fehler", "error");
        }
    };

    window.deleteWish = async (itemId) => {
        if (!confirm("Möchtest du diesen Wunsch wirklich löschen?")) return;
        const itemRef = doc(db, 'families', currentFamilyId, 'wishlistItems', itemId);
        try {
            await deleteDoc(itemRef);
            showNotification("Wunsch gelöscht", "success");
        } catch (error) {
            showNotification("Fehler beim Löschen", "error");
        }
    };

    // --- NEU: Vereinfachtes Modal ---
    window.openAddWishModal = () => {
        const modalId = 'modal-add-wish';
        const modalContent = `
          <div class="modal-content glass-premium max-w-lg w-full">
              <h2 class="text-xl font-bold text-gradient mb-6">Neuer Wunsch</h2>
              <form id="create-wish-form" class="space-y-4">
                  <div>
                      <label for="wish-url" class="form-label">Produkt-Link</label>
                      <input type="url" id="wish-url" class="form-input" placeholder="https://beispiel.de/produkt" required>
                      <p class="text-xs text-secondary mt-1">Füge einen Link ein. Details wie Titel, Preis und Bild werden automatisch abgerufen.</p>
                  </div>
                  <div class="flex justify-end gap-3 pt-6 border-t border-border-glass">
                      <button type="button" class="btn-secondary" data-action="close-modal">Abbrechen</button>
                      <button type="submit" id="create-wish-submit" class="cta-primary-glow">
                          <span class="btn-text">Wunsch hinzufügen</span>
                      </button>
                  </div>
              </form>
          </div>
        `;
        openModal(modalContent, modalId);

        const form = document.getElementById('create-wish-form');
        form.onsubmit = window.handleWishSubmit;
    };

    // --- NEU: Vereinfachter Submit ---
    window.handleWishSubmit = async (event) => {
        event.preventDefault();
        const url = document.getElementById('wish-url').value;
        if (!url) {
          showNotification("Ein Link ist erforderlich", "warning");
          return;
        }
        // URL-Validierung (einfach)
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          showNotification("Bitte gib einen gültigen Link ein (mit https://)", "warning");
          return;
        }

        const newWish = {
            url: url,
            status: 'parsing', // NEU: Status für die Cloud Function
            // Titel, Preis etc. werden von der CF hinzugefügt
            uploaderId: currentUser.uid,
            uploaderName: getCurrentUser().currentUserData.name,
            createdAt: serverTimestamp(),
            claimedBy: null
        };

        try {
            await addDoc(collection(db, 'families', currentFamilyId, 'wishlistItems'), newWish);
            showNotification("Wunsch hinzugefügt! Details werden abgerufen...", "success");
            closeModal('modal-add-wish');
        } catch (error) {
            showNotification("Fehler beim Speichern", "error");
        }
    };
}

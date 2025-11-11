// src/finanzen.js
// Shared Budget Tracker für Familien

import { 
    db, collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp,
    doc, getDoc, setDoc, updateDoc, writeBatch, increment, Timestamp
} from './firebase.js';
import { getCurrentUser } from './auth.js';
import { showNotification, openModal, closeModal, showButtonSpinner, hideButtonSpinner } from './ui.js';
import { EmptyStateCard, Card } from './components/Card.js';
import { ExpenseCard } from './components/ExpenseCard.js';
import { FinanceChart } from './components/FinanceChart.js'; 
import { render } from './components/index.js';

/**
 * Initialisiert die 'Finanzen'-Seite mit Shared Budget Tracker.
 */
export function renderFinanzen(listeners) {
    // Alte Listener bereinigen
    if (listeners.sharedBudget) listeners.sharedBudget();
    if (listeners.transactions) listeners.transactions();
    if (listeners.privateExpenses) listeners.privateExpenses();
    
    const { currentFamilyId, currentUser } = getCurrentUser();
    if (!currentFamilyId || !currentUser) return;

    // Event-Listener für Buttons einrichten
    setupEventListeners(currentFamilyId);
    
    // Shared Budget Listener
    const budgetDocRef = doc(db, 'families', currentFamilyId, 'finances', 'sharedBudget');
    listeners.sharedBudget = onSnapshot(budgetDocRef, async (docSnap) => {
        const balanceDisplay = document.getElementById('shared-balance-display');
        if (!balanceDisplay) return;
        
        if (!docSnap.exists()) {
            // Initialisiere Shared Budget, falls noch nicht vorhanden
            await initializeSharedBudget(currentFamilyId);
            balanceDisplay.innerHTML = '0,00 €';
        } else {
            const balance = docSnap.data().currentBalance || 0;
            balanceDisplay.innerHTML = formatCurrency(balance);
        }
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
    });
    
    // Transaktionen Listener
    const transactionsQuery = query(
        collection(db, 'families', currentFamilyId, 'finances', 'sharedBudget', 'transactions'),
        orderBy('createdAt', 'desc')
    );
    
    listeners.transactions = onSnapshot(transactionsQuery, (snapshot) => {
        const container = document.getElementById('transactions-list-container');
        if (!container) return;
        
        if (snapshot.empty) {
            container.innerHTML = EmptyStateCard(
                'Noch keine Transaktionen',
                'Starte mit einer Einzahlung in den gemeinsamen Topf!',
                'arrow-right-left',
                ''
            );
            if (typeof lucide !== 'undefined') lucide.createIcons();
            return;
        }
        
        const { membersData } = getCurrentUser();
        if (!membersData) {
            container.innerHTML = '<div class="spinner mx-auto"></div>';
            return;
        }
        
        const transactionsHTML = snapshot.docs.map(doc => {
            const transaction = { id: doc.id, ...doc.data() };
            return renderTransactionCard(transaction, membersData);
        }).join('');
        
        container.innerHTML = transactionsHTML;
        if (typeof lucide !== 'undefined') lucide.createIcons();
    });
    
    // Private Ausgaben Listener (optional, bestehende Funktionalität)
    const expensesQuery = query(
        collection(db, 'families', currentFamilyId, 'expenses'),
        where('participants', 'array-contains', currentUser.uid),
        orderBy('createdAt', 'desc')
    );
    
    listeners.privateExpenses = onSnapshot(expensesQuery, (snapshot) => {
        const container = document.getElementById('private-expenses-list');
        if (!container) return;
        
        if (snapshot.empty) {
            container.innerHTML = EmptyStateCard(
                'Keine privaten Ausgaben',
                'Private Ausgaben sind separate Kosten, die nicht vom gemeinsamen Topf abgebucht werden.',
                'receipt',
                ''
            );
            if (typeof lucide !== 'undefined') lucide.createIcons();
            return;
        }
        
        const expensesHTML = snapshot.docs.map(doc => {
            const expense = { id: doc.id, ...doc.data() };
            return ExpenseCard(expense);
        }).join('');
        
        container.innerHTML = expensesHTML;
        if (typeof lucide !== 'undefined') lucide.createIcons();
    });
}

/**
 * Initialisiert das Shared Budget Dokument
 */
async function initializeSharedBudget(familyId) {
    const budgetDocRef = doc(db, 'families', familyId, 'finances', 'sharedBudget');
    try {
        await setDoc(budgetDocRef, {
            currentBalance: 0,
            createdAt: serverTimestamp(),
            lastUpdated: serverTimestamp()
        });
    } catch (error) {
        console.error("Fehler beim Initialisieren des Budgets:", error);
    }
}

/**
 * Event-Listener für Buttons einrichten
 */
function setupEventListeners(familyId) {
    setTimeout(() => {
        const btnEinzahlen = document.getElementById('btn-einzahlen');
        const btnAusbuchen = document.getElementById('btn-ausbuchen');
        const btnPrivateExpense = document.getElementById('btn-private-expense');
        
        if (btnEinzahlen) btnEinzahlen.onclick = () => openTransactionModal('deposit', familyId);
        if (btnAusbuchen) btnAusbuchen.onclick = () => openTransactionModal('withdraw', familyId);
        if (btnPrivateExpense) btnPrivateExpense.onclick = openCreateExpenseModal;
    }, 100);
}

/**
 * Rendert eine einzelne Transaktionskarte
 */
function renderTransactionCard(transaction, membersData) {
    const isDeposit = transaction.type === 'deposit';
    const user = membersData[transaction.userId];
    const userName = user?.name || 'Unbekannt';
    const userAvatar = user?.photoURL || 'img/default_avatar.png';
    
    const icon = isDeposit ? 'arrow-down-circle' : 'arrow-up-circle';
    const iconColor = isDeposit ? 'text-green-500' : 'text-red-500';
    const amountColor = isDeposit ? 'text-green-400' : 'text-red-400';
    const sign = isDeposit ? '+' : '-';
    
    const timestamp = transaction.createdAt?.toDate ? 
        transaction.createdAt.toDate().toLocaleString('de-DE', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }) : 'Gerade eben';
    
    return `
        <div class="glass-list-item p-4 rounded-lg flex items-center gap-4">
            <div class="${iconColor}">
                <i data-lucide="${icon}" class="w-6 h-6"></i>
            </div>
            <img src="${userAvatar}" alt="${userName}" class="w-10 h-10 rounded-full object-cover">
            <div class="flex-1">
                <p class="font-semibold text-white">${userName}</p>
                <p class="text-sm text-text-secondary">${transaction.description || (isDeposit ? 'Einzahlung' : 'Ausbuchung')}</p>
                <p class="text-xs text-text-secondary mt-1">${timestamp}</p>
            </div>
            <div class="text-right">
                <p class="text-xl font-bold ${amountColor}">${sign}${formatCurrency(transaction.amount)}</p>
            </div>
        </div>
    `;
}

/**
 * Modal für Einzahlung oder Ausbuchung öffnen
 */
function openTransactionModal(type, familyId) {
    const isDeposit = type === 'deposit';
    const modalId = `modal-${type}`;
    const title = isDeposit ? 'Geld einzahlen' : 'Geld ausbuchen';
    const buttonText = isDeposit ? 'Einzahlen' : 'Ausbuchen';
    const buttonClass = isDeposit ? 'cta-primary-glow' : 'btn-secondary';
    
    const modalContent = `
        <form id="${type}-form">
            <h2 class="text-2xl font-bold text-gradient mb-6">${title}</h2>
            
            <div class="space-y-4">
                <div>
                    <label for="${type}-amount" class="form-label text-sm text-secondary mb-1 block">Betrag (€)</label>
                    <input type="number" id="${type}-amount" class="form-input" required 
                           placeholder="z.B. 50.00" step="0.01" min="0.01">
                </div>
                <div>
                    <label for="${type}-description" class="form-label text-sm text-secondary mb-1 block">
                        Beschreibung (optional)
                    </label>
                    <input type="text" id="${type}-description" class="form-input" 
                           placeholder="z.B. Wocheneinkauf, Tankfüllung...">
                </div>
            </div>
            
            <div class="flex justify-end gap-3 pt-6 border-t border-border-glass mt-6">
                <button type="button" class="btn-secondary" data-action="close-modal">Abbrechen</button>
                <button type="submit" id="${type}-submit-btn" class="${buttonClass}">
                    <span class="btn-text">${buttonText}</span>
                </button>
            </div>
        </form>
    `;
    
    openModal(Card(modalContent, { variant: 'premium', className: 'max-w-lg w-full', padding: 'lg' }), modalId);
    
    document.getElementById(`${type}-form`).onsubmit = (e) => {
        e.preventDefault();
        handleTransactionSubmit(type, familyId);
    };
}

/**
 * Transaktion speichern (Einzahlung oder Ausbuchung)
 */
async function handleTransactionSubmit(type, familyId) {
    const submitBtn = document.getElementById(`${type}-submit-btn`);
    showButtonSpinner(submitBtn);
    
    const amount = parseFloat(document.getElementById(`${type}-amount`).value);
    const description = document.getElementById(`${type}-description`).value.trim();
    
    if (!amount || isNaN(amount) || amount <= 0) {
        showNotification("Bitte gültigen Betrag eingeben.", "error");
        hideButtonSpinner(submitBtn);
        return;
    }
    
    try {
        const { currentUser, currentUserData } = getCurrentUser();
        const batch = writeBatch(db);
        
        // 1. Transaktion in Sub-Collection speichern
        const transactionsRef = collection(db, 'families', familyId, 'finances', 'sharedBudget', 'transactions');
        const newTransactionRef = doc(transactionsRef);
        
        batch.set(newTransactionRef, {
            type: type,
            amount: amount,
            description: description || '',
            userId: currentUser.uid,
            userName: currentUserData.name,
            userAvatar: currentUserData.photoURL || '',
            createdAt: serverTimestamp()
        });
        
        // 2. Balance im sharedBudget Dokument aktualisieren
        const budgetDocRef = doc(db, 'families', familyId, 'finances', 'sharedBudget');
        const incrementValue = type === 'deposit' ? amount : -amount;
        
        batch.update(budgetDocRef, {
            currentBalance: increment(incrementValue),
            lastUpdated: serverTimestamp()
        });
        
        await batch.commit();
        
        const successMsg = type === 'deposit' 
            ? `${formatCurrency(amount)} erfolgreich eingezahlt!`
            : `${formatCurrency(amount)} erfolgreich ausgebucht!`;
        
        showNotification(successMsg, "success");
        closeModal(`modal-${type}`);
        
    } catch (error) {
        console.error("Fehler beim Speichern der Transaktion:", error);
        showNotification("Speichern fehlgeschlagen.", "error");
    } finally {
        hideButtonSpinner(submitBtn);
    }
}

/**
 * Formatiert Betrag als Währung
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount);
}

/**
 * Modal für private Ausgabe öffnen
 */
function openCreateExpenseModal() {
    const { membersData, currentUser } = getCurrentUser();
    const modalId = 'modal-create-expense';

    // Multi-Select-Checkboxen für Teilnehmer erstellen
    const memberCheckboxes = Object.values(membersData).map(member => `
        <label class="member-select-item" for="member-${member.uid}">
            <img src="${member.photoURL || `https://ui-avatars.com/api/?name=${member.name.charAt(0)}`}" alt="${member.name}" class="member-select-avatar">
            <span class="font-semibold text-white">${member.name}</span>
            <input type="checkbox" id="member-${member.uid}" value="${member.uid}" 
                   class="form-checkbox" ${member.uid === currentUser.uid ? 'checked' : ''}>
        </label>
    `).join('');

    const modalContent = `
        <form id="create-expense-form">
            <h2 class="text-2xl font-bold text-gradient mb-6">Neue private Ausgabe</h2>
            
            <div class="space-y-4">
                <div>
                    <label for="expense-text" class="form-label text-sm text-secondary mb-1 block">Beschreibung der Ausgabe</label>
                    <input type="text" id="expense-text" class="form-input" required placeholder="z.B. Familien Urlaub 2026">
                </div>
                <div>
                    <label for="expense-amount" class="form-label text-sm text-secondary mb-1 block">Betrag (€)</label>
                    <input type="number" id="expense-amount" class="form-input" required placeholder="z.B. 1000.00" step="0.01" min="0">
                </div>
                <div>
                    <label class="form-label text-sm text-secondary mb-1 block">Wer ist beteiligt? (Privat)</label>
                    <div class="space-y-2 max-h-48 overflow-y-auto p-1">
                        ${memberCheckboxes}
                    </div>
                </div>
            </div>
            
            <div class="flex justify-end gap-3 pt-6 border-t border-border-glass mt-6">
                <button type="button" class="btn-secondary" data-action="close-modal">Abbrechen</button>
                <button type="submit" id="expense-submit-btn" class="cta-primary-glow">
                    <span class="btn-text">Ausgabe speichern</span>
                </button>
            </div>
        </form>
    `;

    openModal(Card(modalContent, { variant: 'premium', className: 'max-w-lg w-full', padding: 'lg' }), modalId);
    
    // Checkbox-Stil anpassen (Tailwind hat keine Standard-Checkboxes)
    document.querySelectorAll('.form-checkbox').forEach(el => {
        el.className = 'ml-auto w-5 h-5 rounded text-primary-rose focus:ring-primary-rose';
    });
    
    document.getElementById('create-expense-form').onsubmit = handleExpenseSubmit;
}

// Am Ende von src/finanzen.js hinzufügen
window.openCreateExpenseModal = openCreateExpenseModal;

async function handleExpenseSubmit(e) {
    e.preventDefault();
    const submitBtn = document.getElementById('expense-submit-btn');
    showButtonSpinner(submitBtn);

    const text = document.getElementById('expense-text').value;
    const amount = parseFloat(document.getElementById('expense-amount').value);
    
    // Teilnehmer sammeln
    const participants = [];
    document.querySelectorAll('#create-expense-form .form-checkbox:checked').forEach(cb => {
        participants.push(cb.value);
    });

    if (!text || isNaN(amount) || amount <= 0) {
        showNotification("Bitte gültige Daten eingeben.", "error");
        hideButtonSpinner(submitBtn);
        return;
    }

    if (participants.length === 0) {
        showNotification("Es muss mindestens ein Teilnehmer ausgewählt sein.", "error");
        hideButtonSpinner(submitBtn);
        return;
    }

    try {
        const { currentFamilyId, currentUser, currentUserData } = getCurrentUser();
        const expensesCol = collection(db, 'families', currentFamilyId, 'expenses');
        
        await addDoc(expensesCol, {
            text: text,
            amount: amount,
            participants: participants,
            authorId: currentUser.uid,
            authorName: currentUserData.name,
            authorAvatar: currentUserData.avatarUrl || '',
            createdAt: serverTimestamp(),
        });

        showNotification("Ausgabe erfolgreich gespeichert!", "success");
        closeModal('modal-create-expense');

    } catch (error) {
        console.error("Fehler beim Speichern der Ausgabe:", error);
        showNotification("Speichern fehlgeschlagen.", "error");
    } finally {
        hideButtonSpinner(submitBtn);
    }
}

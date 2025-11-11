// src/utils/listeners.js
// Zentrale Listener-Verwaltung für bessere Performance

/**
 * Verwaltet onSnapshot-Listener und verhindert Memory Leaks
 */
export class ListenerManager {
    constructor() {
        this.listeners = {};
    }
    
    /**
     * Registriert einen neuen Listener
     * @param {string} key - Eindeutiger Key für den Listener
     * @param {Function} unsubscribe - Die Unsubscribe-Funktion von onSnapshot
     */
    register(key, unsubscribe) {
        // Cleanup alter Listener mit gleichem Key
        this.cleanup(key);
        this.listeners[key] = unsubscribe;
    }
    
    /**
     * Entfernt einen spezifischen Listener
     * @param {string} key - Key des Listeners
     */
    cleanup(key) {
        if (this.listeners[key]) {
            this.listeners[key]();
            delete this.listeners[key];
        }
    }
    
    /**
     * Entfernt alle Listener
     */
    cleanupAll() {
        Object.values(this.listeners).forEach(unsubscribe => unsubscribe());
        this.listeners = {};
    }
    
    /**
     * Gibt die Anzahl aktiver Listener zurück
     */
    getActiveCount() {
        return Object.keys(this.listeners).length;
    }
}

/**
 * Batch-Update-Optimierung für onSnapshot
 * Sammelt Änderungen und führt UI-Update nur einmal aus
 */
export class BatchRenderer {
    constructor(renderFn, delay = 50) {
        this.renderFn = renderFn;
        this.delay = delay;
        this.timeoutId = null;
        this.pendingData = null;
    }
    
    /**
     * Plant ein Render (debounced)
     * @param {any} data - Daten zum Rendern
     */
    scheduleRender(data) {
        this.pendingData = data;
        
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        
        this.timeoutId = setTimeout(() => {
            this.renderFn(this.pendingData);
            this.pendingData = null;
            this.timeoutId = null;
        }, this.delay);
    }
    
    /**
     * Führt sofortiges Render aus (ohne Delay)
     */
    renderNow(data) {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
        this.renderFn(data);
        this.pendingData = null;
    }
}

/**
 * Hilfsfunktion für optimierte onSnapshot-Listener
 * @param {Query} query - Firestore Query
 * @param {Object} options - Konfiguration
 * @returns {Function} Unsubscribe-Funktion
 */
export function createOptimizedListener(query, options = {}) {
    const {
        onData,
        onError,
        emptyState = null,
        loadingState = null,
        batchDelay = 0
    } = options;
    
    let renderer = onData;
    
    // Batch-Rendering aktivieren wenn gewünscht
    if (batchDelay > 0) {
        const batcher = new BatchRenderer(onData, batchDelay);
        renderer = (data) => batcher.scheduleRender(data);
    }
    
    return onSnapshot(query, 
        (snapshot) => {
            if (snapshot.empty && emptyState) {
                emptyState();
                return;
            }
            
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            renderer(data);
        },
        (error) => {
            console.error('Listener-Fehler:', error);
            if (onError) onError(error);
        }
    );
}

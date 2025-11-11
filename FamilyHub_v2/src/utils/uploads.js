// src/utils/uploads.js
// Zentrale Upload-Utility für Firebase Storage

import { storage } from '../firebase.js';
import { ref, uploadBytesResumable, getDownloadURL } from '../firebase.js';

/**
 * Lädt eine Datei zu Firebase Storage hoch
 * @param {File} file - Die hochzuladende Datei
 * @param {string} storagePath - Pfad in Firebase Storage (z.B. "gallery/familyId/filename.jpg")
 * @param {Object} options - Optionale Konfiguration
 * @param {Function} options.onProgress - Callback für Upload-Fortschritt (progress: 0-100)
 * @param {number} options.maxSizeMB - Maximale Dateigröße in MB (default: 10)
 * @returns {Promise<string>} Download-URL der hochgeladenen Datei
 */
export async function uploadFile(file, storagePath, options = {}) {
    const {
        onProgress = null,
        maxSizeMB = 10
    } = options;
    
    // Validierung: Dateigröße
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
        throw new Error(`Datei ist zu groß. Maximale Größe: ${maxSizeMB}MB`);
    }
    
    // Storage-Referenz erstellen
    const storageRef = ref(storage, storagePath);
    
    // Upload mit Progress-Tracking
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    return new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
            (snapshot) => {
                // Progress-Callback
                if (onProgress) {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    onProgress(progress);
                }
            },
            (error) => {
                // Error-Callback
                console.error('Upload-Fehler:', error);
                reject(error);
            },
            async () => {
                // Success-Callback
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(downloadURL);
                } catch (error) {
                    reject(error);
                }
            }
        );
    });
}

/**
 * Lädt mehrere Dateien parallel hoch
 * @param {File[]} files - Array von Dateien
 * @param {Function} pathGenerator - Funktion die für jede Datei den Storage-Pfad generiert (file, index) => path
 * @param {Object} options - Optionale Konfiguration
 * @returns {Promise<string[]>} Array von Download-URLs
 */
export async function uploadMultipleFiles(files, pathGenerator, options = {}) {
    const uploadPromises = files.map((file, index) => {
        const storagePath = pathGenerator(file, index);
        return uploadFile(file, storagePath, options);
    });
    
    return Promise.all(uploadPromises);
}

/**
 * Generiert einen sicheren Dateinamen
 * @param {string} originalName - Originaler Dateiname
 * @returns {string} Bereinigter Dateiname
 */
export function sanitizeFileName(originalName) {
    return originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
}

/**
 * Generiert einen eindeutigen Storage-Pfad
 * @param {string} folder - Ordner-Name (z.B. "gallery", "documents")
 * @param {string} familyId - Familien-ID
 * @param {string} fileName - Dateiname
 * @returns {string} Kompletter Storage-Pfad
 */
export function generateStoragePath(folder, familyId, fileName) {
    const timestamp = Date.now();
    const sanitized = sanitizeFileName(fileName);
    return `${folder}/${familyId}/${timestamp}_${sanitized}`;
}

/**
 * Upload mit UI-Progress-Bar (für Standard-UI-Elemente)
 * @param {File} file - Die hochzuladende Datei
 * @param {string} storagePath - Storage-Pfad
 * @param {string} progressBarId - ID des Progress-Bar-Elements
 * @param {string} progressTextId - ID des Progress-Text-Elements
 * @returns {Promise<string>} Download-URL
 */
export async function uploadWithProgressUI(file, storagePath, progressBarId, progressTextId) {
    const progressBar = document.getElementById(progressBarId);
    const progressText = document.getElementById(progressTextId);
    
    // Progress-Container anzeigen
    const progressContainer = progressBar?.closest('[id*="progress-container"]');
    if (progressContainer) {
        progressContainer.classList.remove('hidden');
    }
    
    try {
        const downloadURL = await uploadFile(file, storagePath, {
            onProgress: (progress) => {
                if (progressBar) progressBar.style.width = `${progress}%`;
                if (progressText) progressText.textContent = `${Math.round(progress)}%`;
            }
        });
        
        return downloadURL;
        
    } finally {
        // Progress-Container ausblenden
        if (progressContainer) {
            progressContainer.classList.add('hidden');
        }
    }
}

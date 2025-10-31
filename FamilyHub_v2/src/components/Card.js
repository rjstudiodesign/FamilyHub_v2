// src/components/Card.js
// FINALE, KORRIGIERTE VERSION

// Importiert den Auth-Service, um den aktuellen Benutzer zu prüfen
import { getCurrentUser } from '../auth.js';

/**
 * Erstellt die Standard-Post-Karte.
 * Nutzt 'glass-premium' und Utility-Klassen für die 'Sophisticated Glow'-Ästhetik.
 */
export function PostCard(post, timeAgo) {
    const { currentUser } = getCurrentUser();
    
    // Standard-Prüfungen für den Fall, dass Daten fehlen
    const isLiked = post.likes?.includes(currentUser.uid);
    const likeCount = post.likes?.length || 0;
    const commentCount = post.comments?.length || 0;
    const authorName = post.authorName || 'Unbekannt';
    const authorPhotoURL = post.authorPhotoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=222&color=fff&rounded=true`;

    return `
        <div class="glass-premium p-5 rounded-lg mb-6">
            <header class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                    <img src="${authorPhotoURL}" alt="${authorName}" class="w-10 h-10 rounded-full object-cover border-2 border-border-glass">
                    <div>
                        <p class="font-semibold text-text-main">${authorName}</p>
                        <p class="text-xs text-text-secondary">${timeAgo}</p>
                    </div>
                </div>
                
                ${post.authorId === currentUser.uid ? `
                <button class="btn-secondary !p-2 !rounded-full" onclick="window.deletePost('${post.id}')">
                    <i data-lucide="trash-2" class="w-5 h-5"></i>
                </button>
                ` : ''}
            </header>
            
            <p class="text-text-main whitespace-pre-wrap mb-4">${post.text}</p>
            
            <footer class="flex items-center gap-4 pt-4 border-t border-border-glass">
                <button class="btn-secondary !py-1.5 !px-3 !rounded-full ${isLiked ? '!text-accent-glow !border-accent-glow' : ''}" onclick="window.toggleLike('${post.id}')">
                    <i data-lucide="heart" class="w-5 h-5 ${isLiked ? 'fill-accent-glow' : ''}"></i>
                    <span class="text-sm">${likeCount}</span>
                </button>
                <button class="btn-secondary !py-1.5 !px-3 !rounded-full">
                    <i data-lucide="message-circle" class="w-5 h-5"></i>
                    <span class="text-sm">${commentCount}</span>
                </button>
                <button class="btn-secondary !py-1.5 !px-3 !rounded-full ml-auto">
                    <i data-lucide="share-2" class="w-5 h-5"></i>
                </button>
            </footer>
        </div>
    `;
}

/**
 * Erstellt eine Event-Karte (Platzhalter).
 */
export function EventCard(post, timeAgo) {
    const authorName = post.authorName || 'Kalender';
    // Platzhalter-Icon für Events
    const authorPhotoURL = `https://ui-avatars.com/api/?name=E&background=8b5cf6&color=fff&rounded=true`;

    return `
        <div class="glass-premium p-5 rounded-lg mb-6 border-l-4 border-violet-500">
            <header class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                    <img src="${authorPhotoURL}" alt="${authorName}" class="w-10 h-10 rounded-full object-cover border-2 border-border-glass">
                    <div>
                        <p class="font-semibold text-violet-300">Neuer Termin</p>
                        <p class="text-xs text-text-secondary">${timeAgo}</p>
                    </div>
                </div>
            </header>
            
            <p class="text-xl font-bold text-text-main mb-2">${post.title || 'Unbenannter Termin'}</p>
            <p class="text-text-main whitespace-pre-wrap mb-4">${post.text}</p>
        </div>
    `;
}

/**
 * Erstellt die "Nichts gefunden"-Karte im 'Sophisticated Glow'-Stil.
 */
export function EmptyStateCard(title, message, icon = 'inbox') {
    return `
        <div class="glass-premium p-8 rounded-lg text-center border-2 border-dashed border-border-glass">
            <i data-lucide="${icon}" class="w-12 h-12 text-text-secondary mx-auto mb-4 opacity-70"></i>
            <h3 class="text-xl font-semibold text-text-main mb-2">${title}</h3>
            <p class="text-text-secondary">${message}</p>
        </div>
    `;
}

/**
 * Erstellt eine Lade-Skeleton-Karte im 'Sophisticated Glow'-Stil.
 */
export function SkeletonCard() {
    return `
        <div class="glass-premium p-5 rounded-lg animate-pulse mb-6">
            <header class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-full bg-background-glass opacity-50"></div>
                <div class="flex-1 space-y-2">
                    <div class="h-4 bg-background-glass rounded w-1/3 opacity-50"></div>
                    <div class="h-3 bg-background-glass rounded w-1/4 opacity-50"></div>
                </div>
            </header>
            
            <div class="space-y-3">
                <div class="h-4 bg-background-glass rounded w-full opacity-50"></div>
                <div class="h-4 bg-background-glass rounded w-5/6 opacity-50"></div>
            </div>
            
            <footer class="flex items-center gap-4 pt-4 mt-4 border-t border-border-glass">
                <div class="h-6 w-12 bg-background-glass rounded-full opacity-50"></div>
                <div class="h-6 w-12 bg-background-glass rounded-full opacity-50"></div>
            </footer>
        </div>
    `;
}
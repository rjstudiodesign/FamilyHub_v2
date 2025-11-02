/**
 * src/components/Memory.js
 * 
 * Enthält die UI-Komponente für den "Memory Lane"-Bot.
 * - MemoryCard: Eine spezielle Karte, die einen alten Post oder ein altes Bild hervorhebt.
 */

import { PostCard } from './Card.js';
import { getTimeAgo } from '../utils/formatters.js';

/**
 * Erstellt die "Memory Lane"-Karte.
 * Diese Karte umschließt einen regulären Post und fügt einen Header hinzu,
 * der den Kontext "An diesem Tag vor..." liefert.
 *
 * @param {object} memoryPost - Der Post-Datenobjekt vom Typ 'memory'.
 * @param {string} memoryPost.memoryTitle - Der Titel für die Erinnerung (z.B. "An diesem Tag vor 2 Jahren...").
 * @param {object} memoryPost.originalPost - Das ursprüngliche Post-Objekt, das angezeigt werden soll.
 * @returns {string} Das HTML-Markup für die MemoryCard.
 */
export function MemoryCard({ post: memoryPost }) {
    const { memoryTitle, originalPost } = memoryPost;

    if (!originalPost) {
        // Fallback, falls der ursprüngliche Post aus irgendeinem Grund fehlt.
        return '';
    }

    // Wir rendern den originalen Post innerhalb der Memory-Card.
    // getTimeAgo wird auf das ursprüngliche Erstellungsdatum angewendet.
    const originalTimeAgo = originalPost.createdAt 
        ? getTimeAgo(originalPost.createdAt.toDate()) 
        : 'vor langer Zeit';

    return `
        <div class="memory-card">
            <div class="memory-card-header">
                <div class="memory-card-icon">
                    <i data-lucide="sparkles" class="w-6 h-6"></i>
                </div>
                <h3 class="memory-card-title">${memoryTitle}</h3>
            </div>
            <div class="memory-card-content">
                ${PostCard(originalPost, originalTimeAgo, true)}
            </div>
        </div>
    `;
}

// src/components/GalleryPostCard.js

/**
 * Erstellt eine Feed-Karte, die auf neue Uploads in der Galerie hinweist.
 * Diese wird von Card.js aufgerufen, wenn post.type === 'gallery'.
 */
export function GalleryPostCard(post) {
    const { galleryTitle, thumbnailUrls = [] } = post;

    // Nimm maximal 4 Thumbnails für die Vorschau
    const previewThumbnails = thumbnailUrls.slice(0, 4);

    const thumbnailsHTML = previewThumbnails.map(url => `
        <div class="gallery-post-item">
            <img src="${url}" alt="Galerie-Vorschau" loading="lazy" />
        </div>
    `).join('');

    return `
    <div class="gallery-post-card">
        <div class="mb-3">
            <h4 class="text-lg font-semibold text-white">${galleryTitle || 'Neue Fotos'}</h4>
            <p class="text-sm text-secondary">Neue Erinnerungen wurden in der Galerie hinzugefügt.</p>
        </div>
        
        <div class="gallery-post-grid count-${previewThumbnails.length}">
            ${thumbnailsHTML}
        </div>
        
        <button class="btn-secondary w-full mt-4" onclick="window.MapsTo('gallery')">
            <i data-lucide="images" class="w-4 h-4 mr-2"></i>
            Album ansehen
        </button>
    </div>
    `;
}

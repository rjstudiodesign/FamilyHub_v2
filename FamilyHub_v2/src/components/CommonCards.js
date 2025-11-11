// src/components/CommonCards.js
// Wiederverwendbare Card-Komponenten

/**
 * Generische Basis-Card mit Avatar, Titel, Beschreibung
 */
export function BaseCard(config) {
    const {
        id,
        title,
        description = '',
        icon = 'heart',
        iconColor = 'text-primary-rose',
        author = null,
        timestamp = null,
        actions = '',
        metadata = '',
        customContent = '',
        className = ''
    } = config;
    
    const authorHTML = author ? `
        <div class="flex items-center gap-2 mb-2">
            ${author.avatar ? `
                <img src="${author.avatar}" alt="${author.name}" 
                     class="w-8 h-8 rounded-full object-cover">
            ` : ''}
            <span class="text-sm font-semibold text-white">${escapeHTML(author.name)}</span>
        </div>
    ` : '';
    
    const timestampHTML = timestamp ? `
        <p class="text-xs text-text-secondary">${timestamp}</p>
    ` : '';
    
    const descriptionHTML = description ? `
        <p class="text-sm text-text-secondary mb-3">${escapeHTML(description)}</p>
    ` : '';
    
    return `
        <div class="glass-premium p-6 rounded-xl relative group hover:scale-[1.02] transition-transform ${className}" 
             data-card-id="${id}">
            <!-- Icon -->
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-primary-rose/20 to-purple-500/20 
                        flex items-center justify-center mb-4">
                <i data-lucide="${icon}" class="w-6 h-6 ${iconColor}"></i>
            </div>
            
            <!-- Titel -->
            <h3 class="font-bold text-xl text-white mb-2">${escapeHTML(title)}</h3>
            
            ${descriptionHTML}
            ${authorHTML}
            ${timestampHTML}
            ${metadata}
            ${customContent}
            ${actions}
        </div>
    `;
}

/**
 * Card mit Teilnehmer-Avataren (für Hobbys, Challenges, etc.)
 */
export function ParticipantCard(config) {
    const {
        participants = [],
        membersData = {},
        maxAvatars = 5
    } = config;
    
    const participantsHTML = participants.length > 0 ? `
        <div class="flex items-center gap-2 mb-4">
            <div class="flex -space-x-2">
                ${participants.slice(0, maxAvatars).map(uid => {
                    const member = membersData[uid];
                    if (!member) return '';
                    return `
                        <img src="${member.photoURL || 'img/default_avatar.png'}" 
                             alt="${member.name}"
                             title="${member.name}"
                             class="w-8 h-8 rounded-full border-2 border-background-glass object-cover">
                    `;
                }).join('')}
                ${participants.length > maxAvatars ? `
                    <div class="w-8 h-8 rounded-full border-2 border-background-glass bg-white/10 
                                flex items-center justify-center text-xs text-white">
                        +${participants.length - maxAvatars}
                    </div>
                ` : ''}
            </div>
            <span class="text-sm text-text-secondary">
                ${participants.length} ${participants.length === 1 ? 'Teilnehmer' : 'Teilnehmer'}
            </span>
        </div>
    ` : `
        <p class="text-sm text-text-secondary mb-4">
            <i data-lucide="users" class="w-4 h-4 inline mr-1"></i>
            Noch keine Teilnehmer
        </p>
    `;
    
    return participantsHTML;
}

/**
 * Action-Button für Cards (Join/Leave, Delete, etc.)
 */
export function ActionButton(config) {
    const {
        id,
        text,
        icon,
        variant = 'primary', // 'primary', 'secondary', 'danger'
        onClick = null,
        fullWidth = false
    } = config;
    
    const variantClasses = {
        'primary': 'cta-primary-glow',
        'secondary': 'btn-secondary',
        'danger': 'btn-danger'
    };
    
    const widthClass = fullWidth ? 'w-full' : '';
    const buttonClass = `${variantClasses[variant]} ${widthClass}`;
    
    return `
        <button id="${id}" class="${buttonClass}">
            ${icon ? `<i data-lucide="${icon}" class="w-5 h-5 mr-2"></i>` : ''}
            <span class="btn-text">${text}</span>
        </button>
    `;
}

/**
 * Badge-Komponente
 */
export function Badge(text, variant = 'default') {
    const variantClasses = {
        'default': 'bg-white/10 text-white',
        'success': 'bg-green-500/20 text-green-400',
        'warning': 'bg-yellow-500/20 text-yellow-400',
        'error': 'bg-red-500/20 text-red-400',
        'info': 'bg-blue-500/20 text-blue-400'
    };
    
    return `
        <span class="px-2 py-1 ${variantClasses[variant]} text-xs rounded-full inline-flex items-center gap-1">
            ${text}
        </span>
    `;
}

/**
 * Metadata-Zeile (z.B. Datum, Kategorie)
 */
export function Metadata(items) {
    return `
        <div class="flex flex-wrap gap-3 text-xs text-text-secondary mt-3">
            ${items.map(item => `
                <div class="flex items-center gap-1">
                    ${item.icon ? `<i data-lucide="${item.icon}" class="w-3 h-3"></i>` : ''}
                    <span>${escapeHTML(item.text)}</span>
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * Locked-Overlay (für Zeitkapsel)
 */
export function LockedOverlay(config) {
    const {
        message = 'Versiegelt',
        info = ''
    } = config;
    
    return `
        <div class="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-10">
            <div class="text-center">
                <i data-lucide="lock" class="w-16 h-16 text-primary-rose mx-auto mb-4"></i>
                <p class="text-white font-bold text-lg mb-2">${message}</p>
                ${info ? `<p class="text-sm text-text-secondary">${info}</p>` : ''}
            </div>
        </div>
    `;
}

/**
 * HTML escapen (Utility)
 */
function escapeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Export auch escapeHTML für externe Nutzung
export { escapeHTML };

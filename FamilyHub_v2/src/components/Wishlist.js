import { getCurrentUser } from '../auth.js';

      export function WishlistCard(item) {
          const { currentUser } = getCurrentUser();
          const isOwner = item.uploaderId === currentUser.uid;
          
          // Prüfe, ob von *jemand anderem* reserviert
          const isClaimedByOther = item.claimedBy && item.claimedBy !== currentUser.uid;
          // Prüfe, ob von *mir selbst* reserviert
          const isClaimedByMe = item.claimedBy && item.claimedBy === currentUser.uid;

          let buttonHTML = '';
          if (isOwner) {
              // Eigener Wunsch
              buttonHTML = `<button class="btn-secondary w-full text-xs" onclick="window.deleteWish('${item.id}')"><i data-lucide="trash-2" class="w-4 h-4 mr-1"></i>Löschen</button>`;
          } else if (isClaimedByMe) {
              // Von mir reserviert
              buttonHTML = `<button class="btn-secondary w-full text-xs" onclick="window.unclaimWish('${item.id}')"><i data-lucide="x" class="w-4 h-4 mr-1"></i>Reservierung aufheben</button>`;
          } else if (isClaimedByOther) {
              // Von jemand anderem reserviert
              buttonHTML = `<button class="btn-secondary w-full text-xs" disabled>Reserviert</button>`;
          } else {
              // Frei zum Reservieren
              buttonHTML = `<button class="btn-premium w-full text-xs" onclick="window.claimWish('${item.id}')"><i data-lucide="check" class="w-4 h-4 mr-1"></i>Reservieren</button>`;
          }

          // Preis-Anzeige
          const price = item.price ? `<p class="text-sm text-primary-rose font-semibold mb-2">${item.price}</p>` : '';

          return `
          <div class="glass-premium rounded-xl overflow-hidden flex flex-col animate-slide-in-up">
              <a href="${item.url || '#'}" target="_blank" rel="noopener noreferrer" class="block h-48 bg-white/5">
                  <img src="${item.imageUrl || 'https://placehold.co/300x300/0a0a0a/ffffff?text=Wunsch'}" class="w-full h-full object-contain p-2">
              </a>
              <div class="p-4 flex-1 flex flex-col">
                  <h5 class="font-semibold text-white mb-1 truncate" title="${item.title}">${item.title}</h5>
                  ${price}
                  <p class="text-xs text-secondary mb-3 flex-1">${item.description || 'Keine Beschreibung'}</p>
                  ${buttonHTML}
              </div>
          </div>
          `;
      }
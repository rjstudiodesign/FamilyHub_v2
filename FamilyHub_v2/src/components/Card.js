// --- HILFSFUNKTIONEN ---
      function renderActions(actions) {
          if (!actions || actions.length === 0) return '';
          return `
              <div class="flex items-center gap-4 pt-3 mt-4 border-t border-border-glass">
                  ${actions.map(action => `
                      <button 
                          class="action-button ${action.active ? 'active text-primary-rose' : ''} ${action.className || ''}" 
                          onclick="${action.onClick}"
                          aria-label="${action.onClick.split('(')[0]}"
                      >
                          ${action.icon}
                          ${action.count !== null && action.count !== undefined ? `<span>${action.count}</span>` : ''}
                      </button>
                  `).join('')}
              </div>
          `;
      }

      // --- HAUPTKOMPONENTEN (EXPORTS) ---
      export function PostCard(data) {
          const {
              authorName,
              authorAvatar,
              timestamp,
              content,
              imageUrl,
              postId,
              actions,
              post // Bündele alle Daten für PollCard
          } = data;

          const header = `
              <div class="flex items-center gap-3 mb-4">
                  <div class="avatar-ring avatar-ring-clickable" onclick="window.openProfilePopup(event, '${data.authorId || ''}')">
                      <img src="${authorAvatar}" alt="${authorName}" class="post-avatar">
                  </div>
                  <div class="flex-1">
                      <p class="font-semibold text-white">${authorName}</p>
                      <p class="text-xs text-secondary">${timestamp}</p>
                  </div>
                  <div class="post-menu-btn">
                      <button 
                          class="btn-icon-ghost" 
                          onclick="window.openPostMenu('${postId}')"
                          aria-label="Beitragsmenü"
                      >
                          <i data-lucide="more-horizontal" class="w-5 h-5"></i>
                      </button>
                  </div>
              </div>
          `;

          // --- LOGIK-Integration für Poll/Gratitude ---
          let body;
          if (post.type === 'poll') {
              // 'PollCard' wird aus 'feed.js' importiert und hier aufgerufen
              body = window.PollCard(post);
          } else if (post.type === 'gratitude') {
              // 'GratitudeCard' wird aus 'feed.js' importiert und hier aufgerufen
              body = window.GratitudeCard(post);
          } else {
              body = `
              <div class="post-content mb-4">
                  <p class="text-white whitespace-pre-wrap break-words">${content || ''}</p>
              </div>
              `;
          }
          // --- ENDE LOGIK-Integration ---

          const image = imageUrl ? `
              <div class="post-image-container rounded-lg overflow-hidden mb-4 border border-border-glass cursor-pointer" 
                   onclick="window.openImageModal('${imageUrl}')">
                  <img 
                      src="${imageUrl}" 
                      alt="Beitragsbild" 
                      class="w-full h-auto object-cover max-h-[500px]"
                      loading="lazy"
                  >
              </div>
          ` : '';

          const footer = renderActions(actions);

          return `
              <div class="post-card" data-post-id="${postId}">
                  ${header}
                  ${body}
                  ${image}
                  ${footer}
              </div>
          `;
      }

      export function Card(content, { variant = 'premium', padding = 'md', className = '' } = {}) {
          const paddingClass = padding === 'lg' ? 'p-6 sm:p-8' : 'p-4 sm:p-6';
          const variantClass = variant === 'premium' ? 'glass-premium' : 'bg-gray-900 border border-border-glass';
          
          return `
          <div class="${variantClass} ${paddingClass} rounded-xl ${className}">
              ${content}
          </div>
          `;
      }

      export function InfoCard(title, message, icon, { variant = 'premium' } = {}) {
         const content = `...`; // (Implementierung wie zuvor)
         return Card(content, { variant, padding: 'md' });
      }

      export function EmptyStateCard(title, message, icon, ctaButton) {
          const content = `
              <div class="text-center animate-fade-in">
                  <div class="w-16 h-16 bg-primary-rose/10 text-primary-rose rounded-full mx-auto flex items-center justify-center mb-4 text-3xl">
                      ${icon}
                  </div>
                  <h3 class="text-xl font-bold text-white mb-2">${title}</h3>
                  <p class="text-secondary mb-6">${message}</p>
                  ${ctaButton || ''}
              </div>
          `;
          return Card(content, { variant: 'premium', padding: 'lg' });
      }

      export function SkeletonCard({ lines = 3, hasImage = false }) {
          const content = `...`; // (Implementierung wie zuvor)
          return `<div class="post-card">${content}</div>`;
      }

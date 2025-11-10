// --- HILFSFUNKTIONEN ---
      function renderReactions(reactions) {
          if (!reactions || Object.keys(reactions).length === 0) return '';
          
          const reactionsArray = Object.entries(reactions)
              .filter(([emoji, users]) => users && users.length > 0)
              .map(([emoji, users]) => ({ emoji, count: users.length }))
              .sort((a, b) => b.count - a.count);
          
          if (reactionsArray.length === 0) return '';
          
          return `
              <div class="reactions-display flex items-center gap-2 flex-wrap mb-2">
                  ${reactionsArray.map(({ emoji, count }) => `
                      <span class="reaction-badge glass-premium px-2 py-1 rounded-full text-sm flex items-center gap-1">
                          <span>${emoji}</span>
                          <span class="text-text-secondary">${count}</span>
                      </span>
                  `).join('')}
              </div>
          `;
      }

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
              reactions,
              post, // Bündele alle Daten für PollCard etc.
              membersData // NEU: Mitgliederdaten
          } = data;

          // Prüfe, ob dieser Post im Namen eines Kindes erstellt wurde
          const postData = data.post || data;
          const isPostedOnBehalf = postData.realAuthorId && postData.realAuthorId !== postData.authorId;
          
          // Hole den Namen des echten Autors
          let postedByText = '';
          if (isPostedOnBehalf && membersData && membersData[postData.realAuthorId]) {
              const realAuthorName = membersData[postData.realAuthorId].name;
              postedByText = `<p class="text-xs text-secondary italic mt-1">Gepostet von ${realAuthorName}</p>`;
          }

          const header = `
              <div class="flex items-center gap-3 mb-4">
                  <div class="avatar-ring avatar-ring-clickable" onclick="window.openProfilePopup(event, '${data.authorId || ''}')">
                      <img src="${authorAvatar}" alt="${authorName}" class="post-avatar">
                  </div>
                  <div class="flex-1">
                      <p class="font-semibold text-white">${authorName}</p>
                      <p class="text-xs text-secondary">${timestamp}</p>
                      ${postedByText}
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

          // --- NEU: Erweiterte LOGIK-Integration für Gallery ---
          let body;
          // postData wurde bereits oben deklariert

          if (postData.type === 'poll') {
              body = window.PollCard(postData);
          } else if (postData.type === 'gratitude') {
              body = window.GratitudeCard(postData);
          } else if (postData.type === 'forecast') {
              body = window.ForecastCard({ post: postData });
          } else if (postData.type === 'memory') {
              body = window.MemoryCard({ post: postData });
          } else if (postData.type === 'gallery') {
              // 'GalleryPostCard' wird aus 'feed.js' importiert und hier aufgerufen
              body = window.GalleryPostCard(postData);
          } else {
              // Standard-Post
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

          const reactionsHtml = renderReactions(reactions);
          const footer = renderActions(actions);

          // Für spezielle Karten rendern wir keinen Standard-Footer
          const finalFooter = (post.type === 'forecast' || post.type === 'memory' || post.type === 'gallery') ? '' : footer;

          return `
              <div class="post-card" data-post-id="${postId}">
                  ${header}
                  ${body}
                  ${image}
                  ${reactionsHtml}
                  ${finalFooter}
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

      export function SkeletonCard({ lines = 3, hasImage = false } = {}) {
          const textLines = Array(lines).fill(0).map(() => `
              <div class="h-4 bg-gray-700 rounded w-full animate-pulse"></div>
          `).join('');

          const image = hasImage ? `
              <div class="h-48 bg-gray-700 rounded-lg w-full animate-pulse mb-4"></div>
          ` : '';

          const content = `
              <div class="flex items-center gap-3 mb-4">
                  <div class="w-12 h-12 bg-gray-700 rounded-full animate-pulse"></div>
                  <div class="flex-1 space-y-2">
                      <div class="h-4 bg-gray-700 rounded w-3/4 animate-pulse"></div>
                      <div class="h-3 bg-gray-700 rounded w-1/2 animate-pulse"></div>
                  </div>
              </div>
              ${image}
              <div class="space-y-3">
                  ${textLines}
              </div>
          `;
          return `<div class="post-card">${content}</div>`;
      }

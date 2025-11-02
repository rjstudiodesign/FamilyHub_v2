export function GratitudeCard(post) {
          // post.fromAvatar, post.fromName, post.toAvatar, post.toName, post.text
          return `
          <div class="gratitude-card-content">
              <img src="${post.fromAvatar}" alt="${post.fromName}" class="gratitude-avatar">
              <i data-lucide="heart" class="gratitude-arrow"></i>
              <img src="${post.toAvatar}" alt="${post.toName}" class="gratitude-avatar">
              <div class="flex-1">
                  <p class="text-white text-lg">
                      <span class="font-semibold">${post.fromName}</span>
                      ist dankbar für
                      <span class="font-semibold">${post.toName}</span>
                  </p>
                  <p class="text-secondary italic mt-1">"${post.text}"</p>
              </div>
          </div>
          `;
      }

      export function GratitudeTrigger() {
          return `
          <div class="glass-premium rounded-xl p-4 mb-6 flex items-center justify-between gap-4">
              <p class="text-secondary">Für wen bist du heute dankbar?</p>
              <button class="cta-primary-glow" onclick="window.openGratitudeModal()">
                  <i data-lucide="gift" class="w-5 h-5 mr-2"></i>Dank senden
              </button>
          </div>
          `;
      }

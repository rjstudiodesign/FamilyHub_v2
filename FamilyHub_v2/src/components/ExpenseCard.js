import { getCurrentUser } from '../auth.js';

      export function ExpenseCard(post) {
          const { membersData } = getCurrentUser();
          
          // Erstelle Avatar-Stapel der Teilnehmer
          const avatarsHTML = (post.participants || [])
              .map(uid => membersData[uid])
              .filter(Boolean) // Filtere ungültige UIDs
              .map(member => `
                  <img class="expense-avatar" src="${member.photoURL || `https://ui-avatars.com/api/?name=${member.name.charAt(0)}`}" alt="${member.name}" title="${member.name}">
              `)
              .join('');

          return `
          <div class="expense-card mt-4">
              <div class="flex justify-between items-center mb-2">
                  <span class="expense-private-badge">
                      <i data-lucide="lock" class="w-3 h-3"></i>
                      Private Ausgabe
                  </span>
                  <span class="text-xl font-bold text-white">€${post.amount.toFixed(2)}</span>
              </div>
              <p class="text-white mb-3">${post.text}</p>
              <div class="flex items-center gap-2">
                  <div class="expense-avatar-stack">
                      ${avatarsHTML}
                  </div>
                  <span class="text-xs text-secondary">${post.participants.length} Teilnehmer</span>
              </div>
          </div>
          `;
      }
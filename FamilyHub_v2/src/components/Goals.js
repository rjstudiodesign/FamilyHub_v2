function renderGoalItem(goal) {
          const percentage = Math.min(100, (goal.current / goal.target) * 100);
          return `
          <div class="goal-item">
              <div class="flex justify-between items-center mb-1">
                  <span class="text-sm font-semibold text-white">${goal.title}</span>
                  <span class="text-xs text-primary-rose">${percentage.toFixed(0)}%</span>
              </div>
              <div class="goal-progress-bar-bg">
                  <div class="goal-progress-bar-fg" style="width: ${percentage}%;"></div>
              </div>
          </div>
          `;
      }

      export function GoalTrackerWidget(goals) {
          if (!goals || goals.length === 0) {
              return `
              <div class="goal-widget-card text-center">
                  <p class="text-sm text-secondary mb-3">Setzt euch gemeinsame Ziele!</p>
                  <button class="btn-secondary text-xs" onclick="window.navigateTo('settings', 'goals')">
                      Ziele verwalten
                  </button>
              </div>
              `;
          }
          
          return `
          <div class="goal-widget-card">
              <h4 class="text-lg font-semibold text-white mb-3">Unsere Ziele</h4>
              ${goals.map(renderGoalItem).join('')}
              <button class="text-xs text-primary-rose font-semibold mt-2 hover:underline" onclick="window.navigateTo('settings', 'goals')">
                  Alle Ziele verwalten...
              </button>
          </div>
          `;
      }

export function GoalCard(post) {
    // Diese Funktion rendert einen Post vom Typ 'goal_update'
    return `
        <div class="post-card">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-accent-glow/20 rounded-full flex items-center justify-center">
                    <i data-lucide="flag" class="w-6 h-6 text-accent-glow"></i>
                </div>
                <div>
                    <p class="text-white">${post.text}</p>
                    <p class="text-xs text-secondary">${new Date(post.createdAt.seconds * 1000).toLocaleString()}</p>
                </div>
            </div>
        </div>
    `;
}
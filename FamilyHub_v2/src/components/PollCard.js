import { getCurrentUser } from '../auth.js';

      export function PollCard(post) {
          const { currentUser } = getCurrentUser();
          const hasVoted = post.votedBy && post.votedBy.includes(currentUser.uid);
          const totalVotes = post.options.reduce((sum, opt) => sum + (opt.votes || 0), 0);
          
          // Finde den Index der Benutzerstimme
          let userVoteIndex = -1;
          if (hasVoted && post.votesMap) {
             userVoteIndex = post.votesMap[currentUser.uid];
          }

          const optionsHTML = post.options.map((option, index) => {
              const voteCount = option.votes || 0;
              const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
              const isUserVote = hasVoted && (userVoteIndex === index);

              if (hasVoted) {
                  return `
                  <div class="poll-option relative overflow-hidden ${isUserVote ? 'voted-by-user' : ''}">
                      <div class="poll-result-bar" style="width: ${percentage}%;"></div>
                      <div class="relative flex justify-between z-10">
                          <span>${option.text}</span>
                          <span class="font-semibold">${voteCount} (${percentage.toFixed(0)}%)</span>
                      </div>
                  </div>
                  `;
              } else {
                  return `
                  <div class="poll-option" onclick="window.handlePollVote('${post.id}', ${index})">
                      ${option.text}
                  </div>
                  `;
              }
          }).join('');

          return `
          <div class="poll-card-container mt-4">
              ${optionsHTML}
              <p class="text-xs text-secondary mt-2">${totalVotes} Stimme(n) gesamt</p>
          </div>
          `;
      }

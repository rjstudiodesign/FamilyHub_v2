/**
 * src/components/Poll.js
 * 
 * Enthält die UI-Komponenten für das Umfrage-Modul.
 * - PollComposerUI: Die Benutzeroberfläche zum Erstellen einer neuen Umfrage im Modal.
 * - PollCard: Die Komponente zur Anzeige einer Umfrage im Feed.
 */

import { getCurrentUser } from '../auth.js';

/**
 * Erstellt die Benutzeroberfläche zum Hinzufügen von Umfrageoptionen.
 * @returns {string} Das HTML-Markup für den Umfrage-Composer.
 */
export function PollComposerUI() {
    return `
        <div id="poll-composer" class="poll-composer-container hidden">
            <label for="poll-question" class="form-label">Umfragefrage</label>
            <input type="text" id="poll-question" class="form-input" placeholder="Worum geht es bei der Abstimmung?">
            
            <label class="form-label mt-4">Antwortoptionen</label>
            <div id="poll-options-container" class="space-y-2">
                <div class="poll-option-input-group">
                    <input type="text" class="poll-option-input" placeholder="Option 1">
                    <button type="button" class="icon-button-ghost text-tertiary" disabled>
                        <i data-lucide="x-circle" class="w-5 h-5"></i>
                    </button>
                </div>
                <div class="poll-option-input-group">
                    <input type="text" class="poll-option-input" placeholder="Option 2">
                    <button type="button" class="icon-button-ghost text-tertiary" disabled>
                        <i data-lucide="x-circle" class="w-5 h-5"></i>
                    </button>
                </div>
            </div>
            <button type="button" id="add-poll-option-btn" class="btn-secondary text-sm mt-2">
                <i data-lucide="plus" class="w-4 h-4 mr-2"></i>
                Option hinzufügen
            </button>
        </div>
    `;
}

/**
 * Stellt eine einzelne Umfrage-Option dar.
 * @param {object} option - Das Option-Objekt.
 * @param {number} index - Der Index der Option.
 * @param {number} totalVotes - Die Gesamtanzahl der Stimmen.
 * @param {boolean} hasVoted - Hat der aktuelle Benutzer bereits abgestimmt?
 * @param {number|null} userVoteIndex - Der Index der vom Benutzer gewählten Option.
 * @returns {string} Das HTML-Markup für eine Umfrage-Option.
 */
function renderPollOption(option, index, totalVotes, hasVoted, userVoteIndex) {
    const voteCount = option.votes || 0;
    const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
    const isUserVote = hasVoted && userVoteIndex === index;

    return `
        <div 
            class="poll-option ${hasVoted ? 'voted' : ''} ${isUserVote ? 'is-user-vote' : ''}" 
            ${!hasVoted ? `onclick="window.handleVote('${option.postId}', ${index})"` : ''}
        >
            ${hasVoted ? `<div class="poll-option-result-bar" style="width: ${percentage}%;"></div>` : ''}
            <span class="poll-option-text">${option.text}</span>
            ${hasVoted ? `<span class="poll-option-votes">${percentage}%</span>` : ''}
        </div>
    `;
}

/**
 * Erstellt die Karte zur Anzeige einer Umfrage im Feed.
 * @param {object} post - Das Post-Objekt vom Typ 'poll'.
 * @returns {string} Das HTML-Markup für die PollCard.
 */
export function PollCard({ post }) {
    const { currentUser } = getCurrentUser();
    const userVote = post.userVotes ? post.userVotes[currentUser.uid] : undefined;
    const hasVoted = userVote !== undefined;

    const totalVotes = post.options.reduce((sum, option) => sum + (option.votes || 0), 0);

    return `
        <div class="poll-card-container">
            ${post.options.map((option, index) => renderPollOption(
                { ...option, postId: post.id }, 
                index, 
                totalVotes, 
                hasVoted, 
                userVote
            )).join('')}
        </div>
    `;
}

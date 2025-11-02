/**
 * src/components/Forecast.js
 * 
 * Enthält die UI-Komponenten für die Wochenvorschau (Forecast).
 * - ForecastCard: Die Hauptkarte, die eine Zusammenfassung und eine Liste von Ereignissen anzeigt.
 * - ForecastItem: Ein einzelnes Element in der Vorschau-Liste (z.B. ein Kalendertermin oder eine Aufgabe).
 */

/**
 * Erstellt ein Icon für ein Forecast-Element.
 * @param {string} type - Der Typ des Icons ('calendar', 'task', 'weather').
 * @returns {string} - Das HTML-Markup für das Icon.
 */
function createForecastIcon(type) {
    const iconClasses = {
        calendar: 'fa-solid fa-calendar-day',
        task: 'fa-solid fa-check-circle',
        weather: 'fa-solid fa-cloud-sun',
    };
    const iconClass = iconClasses[type] || 'fa-solid fa-info-circle';
    return `<div class="forecast-icon ${type}"><i class="${iconClass}"></i></div>`;
}

/**
 * Erstellt ein einzelnes Vorschau-Element.
 * @param {object} item - Das Datenobjekt für das Element.
 * @param {string} item.type - Der Typ des Elements ('calendar', 'task', 'weather').
 * @param {string} item.title - Der Titel des Elements.
 * @param {string} item.details - Zusätzliche Details (z.B. Datum, Uhrzeit).
 * @returns {string} - Das HTML-Markup für das ForecastItem.
 */
export function ForecastItem({ type, title, details }) {
    return `
        <div class="forecast-item">
            ${createForecastIcon(type)}
            <div class="forecast-item-content">
                <div class="forecast-item-title">${title}</div>
                <div class="forecast-item-details">${details}</div>
            </div>
        </div>
    `;
}

/**
 * Erstellt die vollständige Forecast-Karte.
 * @param {object} post - Der Post-Datenobjekt vom Typ 'forecast'.
 * @param {string} post.summary - Der zusammenfassende Text für die Woche.
 * @param {Array<object>} post.items - Eine Liste von Vorschau-Elementen.
 * @returns {string} - Das HTML-Markup für die ForecastCard.
 */
export function ForecastCard({ post }) {
    const { summary, items = [] } = post;

    return `
        <div class="forecast-card">
            <h3 class="forecast-title">Diese Woche bei euch</h3>
            <p class="forecast-summary">${summary}</p>
            <div class="forecast-list">
                ${items.map(item => ForecastItem(item)).join('')}
            </div>
        </div>
    `;
}

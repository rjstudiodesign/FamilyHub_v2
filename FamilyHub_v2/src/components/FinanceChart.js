// src/components/FinanceChart.js

/**
 * Erstellt ein SVG-Donut-Diagramm für die Finanzübersicht.
 * @param {Array} data - Ein Array von Objekten, z.B. [{ name: 'Ben', amount: 120, color: '#A04668' }, ...]
 */
export function FinanceChart(data) {
    if (!data || data.length === 0) {
        return '<p class="text-secondary text-center text-sm">Keine Ausgaben für ein Diagramm vorhanden.</p>';
    }

    const total = data.reduce((sum, item) => sum + item.amount, 0);
    let cumulativePercent = 0;

    const segments = data.map(item => {
        const percent = (item.amount / total) * 100;
        const strokeDasharray = `${percent} ${100 - percent}`;
        const strokeDashoffset = -cumulativePercent;
        cumulativePercent += percent;

        return `
            <circle class="finance-chart-segment"
                cx="50" cy="50" r="40"
                stroke-dasharray="${strokeDasharray}"
                stroke-dashoffset="${strokeDashoffset}"
                stroke="${item.color}"
            ></circle>
        `;
    }).join('');

    const legend = data.map(item => `
        <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full" style="background-color: ${item.color};"></div>
            <span class="text-sm text-secondary">${item.name} (${((item.amount / total) * 100).toFixed(0)}%)</span>
        </div>
    `).join('');

    return `
        <div class="finance-chart-container">
            <svg viewBox="0 0 100 100" class="finance-chart-svg">
                <circle class="finance-chart-bg" cx="50" cy="50" r="40"></circle>
                ${segments}
                <text x="50" y="50" class="finance-chart-total" dominant-baseline="middle" text-anchor="middle">
                    €${total.toFixed(0)}
                </text>
            </svg>
            <div class="finance-chart-legend">
                ${legend}
            </div>
        </div>
    `;
}

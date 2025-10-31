// Einstiegspunkt für Ihre App

import './feed.js';
import './calendar.js';
import './gallery.js';
import './navigation.js';
import './settings.js';
import { initAuth } from './auth.js';

// Navigationsfunktion aus navigation.js holen
import { navigateTo } from './navigation.js';

// Dummy-MapsTo-Funktion, falls nicht global vorhanden
window.MapsTo = window.MapsTo || function(page) {
	navigateTo(page);
};

// Globaler Klick-Listener für Navigation
document.addEventListener('click', (e) => {
	const target = e.target.closest('[data-page]');
	if (target) {
		e.preventDefault();
		const page = target.getAttribute('data-page');
		if (page) {
			window.MapsTo(page);
		}
	}
});

// Starte Authentifizierung und gehe nach Login zum Feed
initAuth(() => {
	navigateTo('feed');
});

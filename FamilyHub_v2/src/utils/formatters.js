// Gibt einen menschenlesbaren Zeitstempel wie "vor 2 Stunden" zurück
export function getTimeAgo(date) {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now - then) / 1000);
  if (isNaN(seconds) || seconds < 0) return '';
  if (seconds < 60) return 'gerade eben';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `vor ${minutes} Minute${minutes === 1 ? '' : 'n'}`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `vor ${hours} Stunde${hours === 1 ? '' : 'n'}`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `vor ${days} Tag${days === 1 ? '' : 'en'}`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `vor ${weeks} Woche${weeks === 1 ? '' : 'n'}`;
  const months = Math.floor(days / 30);
  if (months < 12) return `vor ${months} Monat${months === 1 ? '' : 'en'}`;
  const years = Math.floor(days / 365);
  return `vor ${years} Jahr${years === 1 ? '' : 'en'}`;
}

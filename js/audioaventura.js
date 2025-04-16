// Lista de insignias posibles
const badges = [
  { id: 'explorer',   label: 'Explorador de AudioAventuras',   icon: 'assets/badge-explorer.png' },
  { id: 'oracle',     label: 'Oráculo en Práctica',            icon: 'assets/badge-oracle.png'   },
  { id: 'songs',      label: 'Melodías Mágicas',               icon: 'assets/badge-songs.png'    },
  { id: 'resources',  label: 'Recurso Master',                 icon: 'assets/badge-resources.png'}
];

// Renderiza todas las insignias y marca las desbloqueadas
function renderBadges() {
  const container = document.getElementById('badges-container');
  if (!container) return;
  container.innerHTML = '';
  badges.forEach(b => {
    const div = document.createElement('div');
    const isUnlocked = localStorage.getItem('badge_' + b.id);
    div.className = 'badge' + (isUnlocked ? ' unlocked' : '');
    div.innerHTML = `<img src="${b.icon}" alt="${b.label}"><p>${b.label}</p>`;
    container.appendChild(div);
  });
}

// Marca una insignia como desbloqueada
function unlockBadge(id) {
  localStorage.setItem('badge_' + id, 'true');
  renderBadges();
}

// Verificamos el pathname para marcar la visita
document.addEventListener('DOMContentLoaded', () => {
  renderBadges();

  const path = window.location.pathname;

  if (path.includes('audioaventura')) unlockBadge('explorer');
  if (path.includes('tarot') || path.includes('portal-magico')) unlockBadge('oracle');
  if (path.includes('canciones')) unlockBadge('songs');
  if (path.includes('recursos')) unlockBadge('resources');
});

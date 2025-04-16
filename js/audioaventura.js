// Insignias posibles
const badges = [
  { id: 'explorer',   label: 'Explorador de AudioAventuras', icon: 'assets/badge-explorer.png' },
  { id: 'oracle',     label: 'Oráculo en Práctica',           icon: 'assets/badge-oracle.png'   },
  { id: 'songs',      label: 'Melodías Mágicas',              icon: 'assets/badge-songs.png'    },
  { id: 'resources',  label: 'Recurso Master',                icon: 'assets/badge-resources.png'}
];

// Render de insignias
function renderBadges() {
  const container = document.getElementById('badges-container');
  container.innerHTML = '';
  badges.forEach(b => {
    const div = document.createElement('div');
    div.className = 'badge' + (localStorage.getItem('badge_' + b.id) ? ' unlocked' : '');
    div.innerHTML = `<img src="${b.icon}" alt="${b.label}"><p>${b.label}</p>`;
    container.appendChild(div);
  });
}

// Desbloqueo
function unlockBadge(id) {
  localStorage.setItem('badge_' + id, 'true');
  renderBadges();
}

// Eventos de navegación
document.addEventListener('DOMContentLoaded', () => {
  renderBadges();
  unlockBadge('explorer');

  // Modal feedback
  const feedbackBtn = document.getElementById('feedback-btn');
  const modal = document.getElementById('feedback-modal');
  const closeBtn = document.getElementById('modal-close');

  feedbackBtn.onclick = () => modal.style.display = 'block';
  closeBtn.onclick = () => modal.style.display = 'none';
  window.onclick = e => { if (e.target == modal) modal.style.display = 'none'; };

  document.getElementById('send-feedback').onclick = () => {
    const feedback = document.getElementById('feedback-text').value;
    if (feedback.trim()) {
      alert("¡Gracias por tu sugerencia! ✨");
      document.getElementById('feedback-text').value = '';
      modal.style.display = 'none';
    } else {
      alert("Por favor, escribe algo primero 🌱");
    }
  };
});

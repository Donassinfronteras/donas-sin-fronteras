// Badges mágicos
const badges = [
  { id: 'explorer',   label: 'Explorador de AudioAventuras', icon: 'assets/badge-explorer.png' },
  { id: 'oracle',     label: 'Oráculo en Práctica',          icon: 'assets/badge-oracle.png'   },
  { id: 'songs',      label: 'Melodías Mágicas',             icon: 'assets/badge-songs.png'    },
  { id: 'resources',  label: 'Recurso Master',               icon: 'assets/badge-resources.png'}
];

function renderBadges() {
  const container = document.getElementById('badges-container');
  container.innerHTML = '';
  badges.forEach(b => {
    const div = document.createElement('div');
    div.className = 'badge' + (localStorage.getItem('badge_'+b.id) ? ' unlocked' : '');
    div.innerHTML = `<img src="${b.icon}" alt="${b.label}"><p>${b.label}</p>`;
    container.appendChild(div);
  });
}

function unlockBadge(id) {
  localStorage.setItem('badge_'+id, 'true');
  renderBadges();
}

// Marcamos insignia por visitar esta sección
document.addEventListener('DOMContentLoaded', () => {
  unlockBadge('explorer');
  renderBadges();

  // Modal sugerencias
  const modal = document.getElementById("feedback-modal");
  const btn = document.getElementById("feedback-btn");
  const span = document.getElementById("modal-close");

  btn.onclick = () => modal.style.display = "block";
  span.onclick = () => modal.style.display = "none";
  window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };

  document.getElementById("send-feedback").onclick = () => {
    const feedback = document.getElementById("feedback-text").value;
    alert("¡Gracias por tu sugerencia! ✨\n\n" + feedback);
    modal.style.display = "none";
    document.getElementById("feedback-text").value = '';
  };
});

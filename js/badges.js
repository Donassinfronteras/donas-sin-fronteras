// js/badges.js

// 1. Definición de los badges y sus títulos por nivel
const BADGES = {
  explorer: [
    "Mapa de Realidades (Iniciado)",
    "Explorador Interdimensional",
    "Viajero entre Portales",
    "Guardiana de las Dimensiones"
  ],
  oracle: [
    "Visión de la Sibila",
    "Intuición Despierta",
    "Sabia del Umbral",
    "Profeta del Prisma"
  ],
  song: [
    "Melodía del Alma",
    "Susurro Sonoro",
    "Eco Celestial",
    "Guardiana de la Canción Eterna"
  ],
  resources: [
    "Archivo Arcano",
    "Recolectora de Conjuros",
    "Maestra de Herramientas",
    "Alquimista del Saber"
  ],
  waves: [
    "Olas del Conocimiento",
    "Aprendiz de las Ondas",
    "Canalizadora Sonora",
    "Guardiana del Eco Sagrado"
  ],
  gloves: [
    "Guantes del Debate Eterno",
    "Peleadora de Ideas",
    "Maestra del Argumento",
    "Campeona del Pensamiento Crítico"
  ]
};

// 2. Umbrales de visitas para cada nivel
const LEVEL_THRESHOLDS = [1, 10, 20, 30];

// 3. Función para mostrar un popup centrado al subir de nivel
function showBadgePopup(badgeKey, newLevel) {
  const titles = BADGES[badgeKey] || [];
  const title = titles[newLevel - 1] || titles[0] || `Nivel ${newLevel}`;
  const pop = document.createElement("div");
  pop.className = "badge-popup";
  pop.innerHTML = `🔓 <strong>${title}</strong><br/>¡Nivel ${newLevel}!`;

  document.body.appendChild(pop);
  requestAnimationFrame(() => pop.classList.add("show"));
  setTimeout(() => {
    pop.classList.remove("show");
    setTimeout(() => pop.remove(), 500);
  }, 3000);
}

// 4. Función que incrementa el contador, calcula nivel y dispara popup si sube
function aumentarVisita(badgeKey) {
  const storageKey = `badge-${badgeKey}-count`;
  const prevCount = parseInt(localStorage.getItem(storageKey), 10) || 0;

  const getLevel = count =>
    count >= LEVEL_THRESHOLDS[3] ? 4 :
    count >= LEVEL_THRESHOLDS[2] ? 3 :
    count >= LEVEL_THRESHOLDS[1] ? 2 :
    count >= LEVEL_THRESHOLDS[0] ? 1 :
    0;

  const prevLevel = getLevel(prevCount);
  const newCount = prevCount + 1;
  localStorage.setItem(storageKey, newCount);

  const newLevel = getLevel(newCount);
  if (newLevel > prevLevel) {
    showBadgePopup(badgeKey, newLevel);
  }
}

// 5. Renderiza la galería de badges en el Portal Mágico
function renderBadges() {
  const badgeGallery = document.getElementById("badgesGallery");
  if (!badgeGallery) return;
  badgeGallery.innerHTML = "";

  Object.keys(BADGES).forEach(badgeKey => {
    const storageKey = `badge-${badgeKey}-count`;
    const visits = parseInt(localStorage.getItem(storageKey), 10) || 0;
    const level =
      visits >= LEVEL_THRESHOLDS[3] ? 4 :
      visits >= LEVEL_THRESHOLDS[2] ? 3 :
      visits >= LEVEL_THRESHOLDS[1] ? 2 :
      visits >= LEVEL_THRESHOLDS[0] ? 1 :
      0;

    // crea la caja del badge
    const badgeDiv = document.createElement("div");
    badgeDiv.className = "badge-item" + (level > 0 ? " unlocked" : "");
    const imgLevel = level > 0 ? level : 1; // muestra nivel 1 si es 0

    // ← Ruta corregida para tu carpeta badges/ en la raíz:
    badgeDiv.style.backgroundImage =
      `url("badges/badge-${badgeKey}-nivel${imgLevel}.png")`;

    // crea la etiqueta
    const label = document.createElement("div");
    label.className = "badge-label";
    label.textContent = level > 0
      ? `${BADGES[badgeKey][level - 1]} (Nivel ${level})`
      : "???";

    // empaqueta ambos
    const wrapper = document.createElement("div");
    wrapper.className = "badge-wrapper";
    wrapper.appendChild(badgeDiv);
    wrapper.appendChild(label);

    badgeGallery.appendChild(wrapper);
  });
}

// 6. Inicialización al cargar la página
document.addEventListener("DOMContentLoaded", renderBadges);

// 7. Exponer la función para que otras páginas puedan invocarla
window.aumentarVisita = aumentarVisita;

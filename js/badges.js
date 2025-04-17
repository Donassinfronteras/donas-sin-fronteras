// badges.js

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

// 2. Función para mostrar un popup centrado al subir de nivel
function showBadgePopup(badgeKey, newLevel) {
  const titles = BADGES[badgeKey] || [];
  const title = titles[newLevel - 1] || titles[0] || `Nivel ${newLevel}`;
  const pop = document.createElement("div");
  pop.className = "badge-popup";
  pop.innerHTML = `🔓 <strong>${title}</strong><br/>¡Nivel ${newLevel}!`;

  document.body.appendChild(pop);
  // espera un frame para disparar la animación CSS
  requestAnimationFrame(() => pop.classList.add("show"));
  // después de 3s, oculta y elimina
  setTimeout(() => {
    pop.classList.remove("show");
    setTimeout(() => pop.remove(), 500);
  }, 3000);
}

// 3. Función que incrementa el contador, calcula nivel y dispara popup si sube
function aumentarVisita(badgeKey) {
  const storageKey = `badge-${badgeKey}-count`;
  const prevCount = parseInt(localStorage.getItem(storageKey), 10) || 0;

  // calcula niveles en base a umbrales [1,10,20,30]
  const getLevel = count =>
    count >= 30 ? 4 :
    count >= 20 ? 3 :
    count >= 10 ? 2 :
    count >= 1  ? 1 :
                  0;

  const prevLevel = getLevel(prevCount);
  const newCount = prevCount + 1;
  localStorage.setItem(storageKey, newCount);

  const newLevel = getLevel(newCount);
  if (newLevel > prevLevel) {
    showBadgePopup(badgeKey, newLevel);
  }
}

// 4. Renderiza la galería de badges en el Portal Mágico
function renderBadges() {
  const badgeGallery = document.getElementById("badgesGallery");
  if (!badgeGallery) return;
  badgeGallery.innerHTML = "";

  Object.keys(BADGES).forEach(badgeKey => {
    const storageKey = `badge-${badgeKey}-count`;
    const visits = parseInt(localStorage.getItem(storageKey), 10) || 0;
    const level = 
      visits >= 30 ? 4 :
      visits >= 20 ? 3 :
      visits >= 10 ? 2 :
      visits >= 1  ? 1 :
                     0;

    // crea la caja del badge
    const badgeDiv = document.createElement("div");
    badgeDiv.className = "badge-item" + (level > 0 ? " unlocked" : "");
    const imgLevel = level > 0 ? level : 1; // muestra nivel 1 si es 0
    badgeDiv.style.backgroundImage = 
      `url("assets/badges/badge-${badgeKey}-nivel${imgLevel}.png")`;

    // crea la etiqueta
    const label = document.createElement("div");
    label.className = "badge-label";
    label.textContent = level > 0
      ? `${BADGES[badgeKey][level - 1]} (Nivel ${level})`
      : "???";

    // empaqueta ambos
    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.alignItems = "center";
    wrapper.appendChild(badgeDiv);
    wrapper.appendChild(label);

    badgeGallery.appendChild(wrapper);
  });
}

// 5. Inicialización al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  renderBadges();
});

// 6. Exponer la función para que otras páginas puedan invocarla
window.aumentarVisita = aumentarVisita;

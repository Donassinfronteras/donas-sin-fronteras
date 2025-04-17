const BADGES = {
  "explorer": ["Mapa de Realidades (Iniciado)", "Explorador Interdimensional", "Viajero entre Portales", "Guardiana de las Dimensiones"],
  "oracle": ["Visión de la Sibila", "Intuición Despierta", "Sabia del Umbral", "Profeta del Prisma"],
  "song": ["Melodía del Alma", "Susurro Sonoro", "Eco Celestial", "Guardiana de la Canción Eterna"],
  "resources": ["Archivo Arcano", "Recolectora de Conjuros", "Maestra de Herramientas", "Alquimista del Saber"],
  "waves": ["Olas del Conocimiento", "Aprendiz de las Ondas", "Canalizadora Sonora", "Guardiana del Eco Sagrado"],
  "gloves": ["Guantes del Debate Eterno", "Peleadora de Ideas", "Maestra del Argumento", "Campeona del Pensamiento Crítico"]
};

const badgeGallery = document.getElementById("badgesGallery");

Object.keys(BADGES).forEach((badgeKey) => {
  let visits = parseInt(localStorage.getItem(`badge-${badgeKey}-count`)) || 0;

  // Define el nivel según visitas
  let nivel = 0;
  if (visits >= 30) nivel = 4;
  else if (visits >= 20) nivel = 3;
  else if (visits >= 10) nivel = 2;
  else if (visits >= 1) nivel = 1;

  const badgeDiv = document.createElement("div");
  badgeDiv.className = "badge-item";
  if (nivel > 0) badgeDiv.classList.add("unlocked");

  const nivelParaImagen = nivel || 1; // Siempre mostrar imagen 1 como base
  badgeDiv.style.backgroundImage = `url('assets/badges/badge-${badgeKey}-nivel${nivelParaImagen}.png')`;

  const label = document.createElement("div");
  label.className = "badge-label";
  label.textContent = nivel > 0 ? `${BADGES[badgeKey][nivel - 1]} (Nivel ${nivel})` : "???";

  const wrapper = document.createElement("div");
  wrapper.style.display = "flex";
  wrapper.style.flexDirection = "column";
  wrapper.style.alignItems = "center";
  wrapper.appendChild(badgeDiv);
  wrapper.appendChild(label);

  badgeGallery.appendChild(wrapper);
});

// portal-magico.js

document.addEventListener("DOMContentLoaded", function() {
  // Intentar reproducir sonido mágico
  const magicSound = document.getElementById("magic-sound");
  if (magicSound) {
    magicSound.play().catch(() => {
      console.log("Audio mágico bloqueará hasta interacción del usuario.");
    });
  }

  // Generar partículas flotantes
  const numParticles = 30;
  const container = document.getElementById("particles");

  for (let i = 0; i < numParticles; i++) {
    const p = document.createElement("div");
    p.classList.add("particle");

    // Posición y tamaño aleatorios
    p.style.left = Math.random() * 100 + "%";
    p.style.top = Math.random() * 100 + "%";
    const size = Math.random() * 12 + 6; // 6px–18px
    p.style.width = size + "px";
    p.style.height = size + "px";

    // Retraso aleatorio para escalonar animaciones
    p.style.animationDelay = Math.random() * 5 + "s";

    container.appendChild(p);
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const welcomeBtn = document.getElementById('welcomeBtn');
  const audioClip = document.getElementById('podcastIntro');
  const podcastBtn = document.getElementById('podcastPageBtn');
  const portalBtn = document.getElementById('portalMagicoBtn');

  if (welcomeBtn && audioClip) {
    welcomeBtn.addEventListener('click', function () {
      audioClip.currentTime = 0;
      audioClip.play().catch(error => {
        console.error('No se pudo reproducir el audio:', error);
      });
    });
  }

  if (podcastBtn) {
    podcastBtn.addEventListener('click', function () {
      window.location.href = "podcast.html";
    });
  }

  if (portalBtn) {
    portalBtn.addEventListener('click', function () {
      window.location.href = "portal-magico.html";
    });
  }
});

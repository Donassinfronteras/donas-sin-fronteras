/* script.js */document.addEventListener('DOMContentLoaded', function () {
  const welcomeBtn = document.getElementById('welcomeBtn');
  const audioClip = document.getElementById('podcastIntro');

  welcomeBtn.addEventListener('click', function () {
    if (audioClip) {
      audioClip.currentTime = 0;
      audioClip.play().catch(error => {
        console.error('No se pudo reproducir el audio:', error);
      });
    } else {
      console.error('No se encontró el audio con ID podcastIntro');
    }
  });
});

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
document.getElementById("welcomeBtn").addEventListener("click", function() {
  const audio = document.getElementById("podcastIntro");
  audio.play();
});

document.getElementById("podcastPageBtn").addEventListener("click", function() {
  window.location.href = "podcast.html";
});

document.getElementById("portalMagicoBtn").addEventListener("click", function() {
  window.location.href = "portal-magico.html";
});
<script type="module">
  // Tu configuración de Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyB56CvZj-t2ReXDdYU3HRjDtRT5cTzcRBM",
    authDomain: "donas-sin-fronteras.firebaseapp.com",
    projectId: "donas-sin-fronteras",
    storageBucket: "donas-sin-fronteras.appspot.com",
    messagingSenderId: "363905129542",
    appId: "1:363905129542:web:47ccf952597f951b827e47",
    measurementId: "G-E1QGHCJ945"
  };

  // Inicializar Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  // Capturar el formulario
  const form = document.getElementById("form-comentarios");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const mensaje = document.getElementById("comentario").value;

    // Guardar en Firestore
    db.collection("comentarios").add({
      nombre: nombre,
      email: email,
      mensaje: mensaje,
      fecha: new Date()
    })
    .then(() => {
      alert("✨ ¡Gracias por tu comentario!");
      form.reset();
    })
    .catch((error) => {
      console.error("Error al guardar el comentario: ", error);
    });
  });
</script>

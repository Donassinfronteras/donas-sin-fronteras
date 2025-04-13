document.addEventListener('DOMContentLoaded', function () {
  const welcomeBtn = document.getElementById('welcomeBtn');
  const audioClip = document.getElementById('podcastIntro');
  const podcastBtn = document.getElementById('podcastPageBtn');
  const portalBtn = document.getElementById('portalMagicoBtn');

  // Reproduce el audio al dar clic en "Bienvenidos"
  if (welcomeBtn && audioClip) {
    welcomeBtn.addEventListener('click', function () {
      audioClip.currentTime = 0;
      audioClip.play().catch(error => {
        console.error('No se pudo reproducir el audio:', error);
      });
    });
  }

  // Ir a la página del podcast
  if (podcastBtn) {
    podcastBtn.addEventListener('click', function () {
      window.location.href = "podcast.html";
    });
  }

  // Ir a la página del portal mágico
  if (portalBtn) {
    portalBtn.addEventListener('click', function () {
      window.location.href = "portal-magico.html";
    });
  }
});

  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
  import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    limit
  } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "AIzaSyB5C6vZj-t2ReXDdYU3HRjDtRT5cTzcRBM",
    authDomain: "donas-sin-fronteras.firebaseapp.com",
    projectId: "donas-sin-fronteras",
    storageBucket: "donas-sin-fronteras.appspot.com",
    messagingSenderId: "363905129542",
    appId: "1:363905129542:web:47ccf952597f951b827e47",
    measurementId: "G-E1QGHCJ945"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // Enviar comentario
  const form = document.getElementById("form-comentarios");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nombre = document.getElementById("nombre").value.trim();
      const email = document.getElementById("email").value.trim();
      const mensaje = document.getElementById("comentario").value.trim();

      try {
        await addDoc(collection(db, "comentarios"), {
          nombre,
          email,
          mensaje,
          fecha: new Date().toISOString()
        });

        alert("✨ ¡Comentario enviado con éxito!");
        form.reset();

        // Reiniciar offset y volver a cargar desde 0
        offset = 0;
        document.getElementById("verMasBtn").style.display = "block";
        mostrarComentarios();
      } catch (error) {
        console.error("❌ Error al guardar el comentario:", error);
        alert("Ocurrió un error. Inténtalo de nuevo.");
      }
    });
  }

  // Mostrar comentarios por partes
  let offset = 0;
  const comentariosPorPagina = 4;

  async function mostrarComentarios(mas = false) {
    const comentariosRef = collection(db, "comentarios");
    const q = query(comentariosRef, orderBy("fecha", "desc"));

    try {
      const querySnapshot = await getDocs(q);
      const contenedor = document.querySelector(".comentarios-recientes");

      if (!mas) {
        contenedor.innerHTML = '<h3>Comentarios recientes</h3>';
      }

      const docs = querySnapshot.docs.slice(offset, offset + comentariosPorPagina);

      docs.forEach((doc) => {
        const data = doc.data();
        const fecha = new Date(data.fecha).toLocaleDateString("es-ES", {
          day: "numeric",
          month: "long",
          year: "numeric"
        });

        const comentarioHTML = `
          <div class="comentario">
            <div class="comentario-header">
              <h4>${data.nombre}</h4>
              <span class="comentario-fecha">${fecha}</span>
            </div>
            <p>${data.mensaje}</p>
          </div>
        `;

        contenedor.insertAdjacentHTML("beforeend", comentarioHTML);
      });

      offset += comentariosPorPagina;

      if (offset >= querySnapshot.size) {
        document.getElementById("verMasBtn").style.display = "none";
      }
    } catch (error) {
      console.error("❌ Error al mostrar comentarios:", error);
    }
  }

  // Evento del botón mágico
  document.getElementById("verMasBtn").addEventListener("click", () => {
    mostrarComentarios(true);
  });

  // Mostrar primeros comentarios al cargar
  mostrarComentarios();
</script>

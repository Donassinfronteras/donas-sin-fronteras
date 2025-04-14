<!-- Cargar librerías Firebase -->
<script src="https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js"></script>

<script>
  // 🔐 1. Inicializar Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyB5C6vZj-t2ReXDdYU3HRjDtRT5cTzcRBM",
    authDomain: "donas-sin-fronteras.firebaseapp.com",
    projectId: "donas-sin-fronteras",
    storageBucket: "donas-sin-fronteras.appspot.com",
    messagingSenderId: "363905129542",
    appId: "1:363905129542:web:47ccf952597f951b827e47",
    measurementId: "G-E1QGHCJ945"
  };

  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  let offset = 0;
  const comentariosPorPagina = 4;

  const form = document.getElementById("form-comentarios");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      console.log("📬 Formulario detectado");
      const nombre = document.getElementById("nombre").value.trim();
      const email = document.getElementById("email").value.trim();
      const mensaje = document.getElementById("comentario").value.trim();

      try {
        await db.collection("comentarios").add({
          nombre,
          email,
          mensaje,
          fecha: new Date().toISOString()
        });

        alert("✨ ¡Comentario enviado con éxito!");
        form.reset();
        offset = 0;
        document.getElementById("verMasBtn").style.display = "block";
        mostrarComentarios();
      } catch (error) {
        console.error("❌ Error al guardar el comentario:", error);
        alert("Ocurrió un error. Inténtalo de nuevo.");
      }
    });
  }

  async function mostrarComentarios(mas = false) {
    const contenedor = document.querySelector(".comentarios-recientes");
    const querySnapshot = await db.collection("comentarios")
      .orderBy("fecha", "desc")
      .get();

    if (!mas) {
      contenedor.innerHTML = '<h3>Comentarios recientes</h3>';
    }

    const docs = querySnapshot.docs.slice(offset, offset + comentariosPorPagina);

    docs.forEach((doc, i) => {
      const data = doc.data();
      const fecha = new Date(data.fecha).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });

      const comentarioHTML = `
        <div class="comentario" style="animation-delay: ${i * 0.1}s">
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
  }

  const boton = document.getElementById("verMasBtn");
  if (boton) {
    boton.addEventListener("click", () => mostrarComentarios(true));
  }

  mostrarComentarios();
</script>

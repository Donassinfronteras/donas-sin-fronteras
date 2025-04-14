// 🔐 1. Importar librerías de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// 🌍 2. Configuración de Firebase
const firebaseConfig = {
  // ... tus claves aquí ...
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 📝 3. Enviar comentario
const form = document.getElementById("form-comentarios");
let offset = 0;
const comentariosPorPagina = 4;

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
      offset = 0;
      document.getElementById("verMasBtn").style.display = "block";
      mostrarComentarios(); // 🔄 Vuelve a mostrar comentarios
    } catch (error) {
      console.error("❌ Error al guardar el comentario:", error);
      alert("Ocurrió un error. Inténtalo de nuevo.");
    }
  });
}

// ✨ 4. Mostrar comentarios con efecto fade
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
  } catch (error) {
    console.error("❌ Error al mostrar comentarios:", error);
  }
}

// 🔘 5. Botón “Ver más comentarios”
const boton = document.getElementById("verMasBtn");
if (boton) {
  boton.addEventListener("click", () => mostrarComentarios(true));
}

// 🚀 6. Cargar primeros comentarios al abrir la página
mostrarComentarios();

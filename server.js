import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

// --- Setup ---
const app = express();
const port = process.env.PORT || 3000;

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Gemini AI Setup ---
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  console.error("CRITICAL: API_KEY environment variable is not defined.");
  process.exit(1);
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

// --- Middleware ---
// The render platform serves static files automatically. If you were running this locally, you'd need this.
// app.use(express.static(path.join(__dirname)));
app.use(express.json()); // To parse JSON bodies

// --- API Endpoint ---
app.post('/api/carta-del-dia', async (req, res) => {
  try {
    const { cardName, meaning, isInverted, deck, topic } = req.body;

    if (!cardName || !meaning || typeof isInverted !== 'boolean' || !deck || !topic) {
      return res.status(400).json({ error: 'Missing required fields for message generation.' });
    }

    const persona = deck === 'tarot'
      ? 'un tarotista sabio, moderno y compasivo'
      : 'un guía espiritual moderno y perspicaz que interpreta el Oráculo Prisma';

    const systemInstruction = `
      Actúa como ${persona}. Tu tarea es interpretar una carta para un usuario y proporcionarle un mensaje y un consejo para su día.

      REGLAS ESTRICTAS A SEGUIR:
      1.  **Formato de Inicio:** Tu respuesta DEBE empezar OBLIGATORIAMENTE con la frase exacta: "Hola mi alma brillante, el mensaje que tus guías tienen para ti el día de hoy es...". No agregues nada antes de esta frase.
      2.  **Estructura del Contenido:** La respuesta debe consistir en exactamente DOS párrafos. Usa un salto de línea para separarlos.
          *   **Primer Párrafo (La Interpretación):** Basado en la carta, su significado y si está invertida o no, describe el mensaje, la energía principal o el obstáculo que la persona enfrenta en relación al tema de su consulta.
          *   **Segundo Párrafo (El Consejo):** Ofrece un consejo práctico y claro. Si la carta estaba invertida, el consejo debe ser sobre cómo superar el obstáculo. Si estaba al derecho, debe ser sobre cómo aprovechar la energía positiva.
      3.  **Estilo y Tono:** Usa el pronombre "tú". El tono debe ser compasivo, sabio, moderno y directo. Utiliza un lenguaje en español claro y accesible.
      4.  **Prohibiciones:** NO menciones el nombre de la carta en tu respuesta. NO repitas las palabras clave o el significado que se te proporcionó. Ofrece una interpretación original y fluida.
    `;

    const topicContext = {
      general: 'una consulta general sobre la energía del día',
      amor: 'una consulta sobre amor y relaciones',
      dinero: 'una consulta sobre finanzas y abundancia',
      trabajo: 'una consulta sobre trabajo y carrera profesional',
    }[topic];

    const orientation = isInverted ? 'Invertida' : 'al Derecho';
    const meaningType = isInverted ? 'significado en sombra (obstáculo)' : 'significado principal (luz)';

    const userPrompt = `
      Tema de la consulta: ${topicContext}.
      Carta: ${cardName} (${orientation}).
      Su ${meaningType} es: "${meaning}".

      Genera la interpretación y el consejo siguiendo tus instrucciones al pie de la letra.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userPrompt,
        config: {
          systemInstruction: systemInstruction,
        }
    });

    const text = response.text;
    res.json({ message: text.trim() });

  } catch (error) {
    console.error("Error in /api/carta-del-dia:", error);
    res.status(500).json({ error: 'Failed to generate message from the spirits.' });
  }
});

// --- Catch-all to serve index.html for any other route (for client-side routing) ---
// On Render, static assets are served automatically from the root.
// This catch-all ensures that client-side routes are handled by React.
app.get('*', (req, res) => {
  // We check if the request is for an API endpoint, if so, we don't serve the index.html
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

// --- Start Server ---
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

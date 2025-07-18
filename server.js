const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.get('/api/carta-del-dia', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'cartas_oraculo_prisma.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al leer las cartas' });
    }
    try {
      const cartas = JSON.parse(data);
      const carta = cartas[Math.floor(Math.random() * cartas.length)];
      res.json(carta);
    } catch (parseErr) {
      console.error(parseErr);
      res.status(500).json({ error: 'Error al procesar las cartas' });
    }
  });
});

app.post('/api/lectura', async (req, res) => {
  const { nombreCarta, significado, categoria, intencion, esReversa } = req.body;
  try {
    const orientation = esReversa ? 'La carta está en posición reversa.' : 'La carta está en posición normal.';
    const prompt = `Actúa como *Bruxa Tarot*, canal espiritual del Oráculo Prisma.

Hoy el alma que consulta ha sacado la carta "${nombreCarta}". ${orientation}

Significado base de la carta: "${significado}"
Categoría: ${categoria}
Intención del alma: "${intencion}"

Crea una lectura personalizada que comience siempre con:

"Hola, Alma Brillante… he canalizado este mensaje especialmente para ti."
${esReversa ? 'Esta carta ha salido como tu obstáculo del día...' : ''}
${esReversa ? 'Luego describe el bloqueo y termina con un consejo:\n"\ud83c\udf3f Consejo canalizado para mitigar o ayudarte en el proceso: [mensaje canalizado]"' : ''}

Haz que cada lectura sea única, compasiva y mágica. Usa lenguaje simbólico y emocional.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    const lectura = completion.choices[0].message.content.trim();
    res.json({ lectura });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al generar la lectura' });
  }
});

const PORT = process.env.PORT || 3000;
console.log("Punto de arranque antes del listen");
app.listen(PORT, () => console.log('Servidor Prisma corriendo en puerto', PORT));

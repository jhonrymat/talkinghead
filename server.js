require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

const port = process.env.PORT || 3000;
const key = process.env.AZURE_TTS_KEY;
const region = process.env.AZURE_REGION;

// Servir archivos estáticos desde "public"
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint para generar el token temporal de Azure
app.get('/api/token', async (req, res) => {
  try {
    const response = await axios.post(
      `https://${region}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
      null,
      {
        headers: {
          'Ocp-Apim-Subscription-Key': key
        }
      }
    );
    res.json({ token: response.data, region });
  } catch (err) {
    console.error('Error al obtener token:', err.message);
    res.status(500).send('Error al obtener token');
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

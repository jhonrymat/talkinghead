require('dotenv').config();
const express = require('express');
process.env.DEBUG = 'http-proxy-middleware:*';
const jwt = require('jsonwebtoken');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;
// const GOOGLE_TTS_KEY = process.env.GOOGLE_TTS_KEY;
const GOOGLE_TTS_KEY = process.env.GOOGLE_TTS_KEY;


const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : [];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS no permitido: ' + origin));
    }
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));



// Endpoint que genera un JWT válido por 10 minutos
app.get('/api/jwt', (req, res) => {
  const token = jwt.sign({ user: 'talkinghead' }, JWT_SECRET, { expiresIn: '10m' });
  res.json({ jwt: token });
});


// Proxy para Google TTS
app.use('/gtts', createProxyMiddleware({
  target: 'https://texttospeech.googleapis.com',
  changeOrigin: true,
  pathRewrite: { '^/gtts': '/v1beta1/text:synthesize' },
  onProxyReq: (proxyReq, req) => {
    const url = proxyReq.path + `?key=${GOOGLE_TTS_KEY}`;
    proxyReq.path = url;
    proxyReq.removeHeader('Authorization');
  }
}));

// Ruta: Obtener agente por ID
app.get('/api/agentes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM agentes WHERE id = ? AND activo = 1', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Agente no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    console.error('[Error DB]', error);
    res.status(500).json({ error: 'Error al obtener el agente' });
  }
});


app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`🟢 Servidor escuchando en http://localhost:${PORT}`);
});


require('dotenv').config();
const express = require('express');
process.env.DEBUG = 'http-proxy-middleware:*';
const jwt = require('jsonwebtoken');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;
const OPENAI_KEY = process.env.OPENAI_KEY;
// const GOOGLE_TTS_KEY = process.env.GOOGLE_TTS_KEY;
const GOOGLE_TTS_KEY = process.env.GOOGLE_TTS_KEY;
const ELEVEN_KEY = process.env.ELEVEN_KEY;
const path = require('path');
const cors = require('cors');



app.use(cors({
  origin: 'http://127.0.0.1:5500', // ✅ ajusta en producción
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// app.use((req, res, next) => {
//   console.log(`Solicitud recibida desde: ${req.headers.origin || 'local'} → ${req.method} ${req.originalUrl}`);
//   next();
// });



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



app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});

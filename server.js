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

// Middleware para verificar JWT
function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send('Token requerido');
  const token = authHeader.split(' ')[1];
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    res.status(403).send('Token inválido o expirado');
  }
}

// Endpoint que genera un JWT válido por 10 minutos
app.get('/api/jwt', (req, res) => {
  const token = jwt.sign({ user: 'talkinghead' }, JWT_SECRET, { expiresIn: '10m' });
  res.json({ jwt: token });
});

// Proxy a OpenAI
app.use('/openai', verifyJWT, createProxyMiddleware({
  target: 'https://api.openai.com',
  changeOrigin: true,
  pathRewrite: { '^/openai': '' },
  onProxyReq: (proxyReq) => {
    proxyReq.setHeader('Authorization', `Bearer ${OPENAI_KEY}`);
  }
}));


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


// Proxy a ElevenLabs WebSocket
app.use('/elevenlabs', verifyJWT, createProxyMiddleware({
  target: 'wss://api.elevenlabs.io',
  changeOrigin: true,
  ws: true,
  pathRewrite: { '^/elevenlabs': '' },
  onProxyReq: (proxyReq) => {
    proxyReq.setHeader('xi-api-key', ELEVEN_KEY);
  }
}));



app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});

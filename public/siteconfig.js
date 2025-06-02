// Site configuration
export const site = {

  // Servidor URL Se debe ajustar en producción
  // En desarrollo, se puede usar localhost
  API_URL: window.location.hostname === "localhost"
        ? "http://localhost:3000"
        : `${window.location.protocol}//${window.location.host}`,
  // websocket URL
  API_WS: "https://ssn8nss.maddigo.com.co/webhook/915d8e4c-1017-4dd1-b19d-a8b5001faaa1",

  // Preset avatars
  avatars: {
    'Profe Antoneta': {
      url: './avatars/brunette.glb',
      body: 'F',
      avatarMood: 'neutral',
      es: 'Profe Antoneta',
    }
  },

  // Google voices
  googleVoices: {
    "fi-F": { id: "fi-FI-Standard-A" },
    "lv-M": { id: "lv-LV-Standard-A" },
    "lt-M": { id: "lt-LT-Standard-A" },
    "en-F": { id: "en-GB-Standard-A" },
    "en-M": { id: "en-GB-Standard-D" },
    "es-M": { id: "es-ES-Standard-A" },
    "es-F": { id: "es-ES-Standard-B" },
    "es-MX": { id: "es-MX-Standard-A" },
  },

  // ElevenLab voices
  elevenVoices: {
    "Bella": { id: "EXAVITQu4vr4xnSDxMaL" },
    "Elli": { id: "MF3mGyEYCl7XYWbV9V6O" },
    "Rachel": { id: "21m00Tcm4TlvDq8ikWAM" },
    "Adam": { id: "pNInz6obpgDQGcFmaJgB" },
    "Antoni": { id: "ErXwobaYiN019PkySvjV" },
    "Arnold": { id: "VR6AewLTigWG4xSOukaG" },
    "Domi": { id: "AZnzlk1XvdvUeBnXmlld" },
    "Josh": { id: "TxGEqnHWrfWFTfGW9XjX" },
    "Sam": { id: "yoZ06aMxZJJ28mfd3POQ" }
  },

  // Microsoft voices
  microsoftVoices: {
    "fi-Selma": { lang: "fi-FI", id: "fi-FI-SelmaNeural" },
    "fi-Noora": { lang: "fi-FI", id: "fi-FI-NooraNeural" },
    "fi-Harri": { lang: "fi-FI", id: "fi-FI-HarriNeural" },
    "en-Jenny": { lang: "en-US", id: "en-US-JennyNeural" },
    "en-Tony": { lang: "en-US", id: "en-US-TonyNeural" },
    "es-Alvaro": { lang: "es-ES", id: "es-ES-AlvaroNeural" },
  },

  // Preset views
  views: {
    'DrStrange': { url: './views/strange.jpg', type: 'image/jpg', fi: 'TohtoriOuto' },
    'Matrix': { url: './views/matrix.mp4', type: 'video/mp4' }
  },

  // Preset poses (includes internal poses)
  poses: {
    'Straight': { url: "straight", es: 'recto' },
    'Side': { url: "side", es: 'lado' },
    'Hip': { url: "hip", es: 'cadera' },
    'Turn': { url: "turn", es: 'giro' },
    'Back': { url: "back", es: 'espalda' },
    'Wide': { url: "wide", es: 'abierto' },
    'OneKnee': { url: "oneknee", es: 'una rodilla' },
    'TwoKnees': { url: "kneel", es: 'dos rodillas' },
    'Bend': { url: "bend", es: 'inclinado' },
    'Sitting': { url: "sitting", es: 'sentado' }
  },

  // Preset gestures
  gestures: {
    'HandUp': { name: "handup", es: 'mano arriba' },
    'OK': { name: "ok", es: 'ok' },
    'Index': { name: "index", es: 'índice' },
    'ThumbUp': { name: "thumbup", es: 'pulgar arriba' },
    'ThumbDown': { name: "thumbdown", es: 'pulgar abajo' },
    'Side': { name: "side", es: 'lado' },
    'Shrug': { name: "shrug", es: 'encogimiento de hombros' },
    'Namaste': { name: "namaste", es: 'namasté' }
  },

  // mood presets
  moods: {
    'Neutral': { url: 'neutral', es: 'neutro' },
    'Happy': { url: 'happy', es: 'feliz' },
    'Angry': { url: 'angry', es: 'enojado' },
    'Sad': { url: 'sad', es: 'triste' },
    'Fear': { url: 'fear', es: 'miedo' },
    'Disgust': { url: 'disgust', es: 'asco' },
    'love': { url: 'love', es: 'amor' },
    'sleep': { url: 'sleep', es: 'dormido' },
  },

  // Preset animations
  animations: {
    'Walking': { url: './animations/walking.fbx', es: 'caminando' }
  },

  // Impulse responses
  impulses: {
    'Room': { url: './audio/ir-room.m4a', fi: 'Huone' },
    'Basement': { url: './audio/ir-basement.m4a', fi: 'Kellari' },
    'Forest': { url: './audio/ir-forest.m4a', fi: 'Metsä' },
    'Church': { url: './audio/ir-church.m4a', fi: 'Kirkko' }
  },

  // Background ambient sounds/music
  music: {
    'Murmur': { url: './audio/murmur.mp3', fi: 'Puheensorina' }
  }

};

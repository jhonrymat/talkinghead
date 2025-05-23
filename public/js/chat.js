// Mostrar mensaje en historial
function addMessageToHistory(text, isUser = true) {
  const history = document.getElementById('chat-history');
  const messageDiv = document.createElement('div');
  messageDiv.textContent = (isUser ? "Tú: " : "Avatar: ") + text;
  messageDiv.style.marginBottom = '10px';
  messageDiv.style.whiteSpace = 'pre-wrap';
  messageDiv.style.color = isUser ? '#a8d0ff' : '#fff';
  history.appendChild(messageDiv);
  history.scrollTop = history.scrollHeight;
}

// Modificar el listener para el botón Speak
const speakButton = document.getElementById('speak');
const inputText = document.getElementById('text');

speakButton.addEventListener('click', () => {
  const text = inputText.value.trim();
  if (!text) return;
  addMessageToHistory(text, true);  // Añade mensaje usuario al historial
  lipsyncType = "visemes";
  const ssml = textToSSML(text);
  azureSpeak(ssml);
  inputText.value = ''; // limpia textarea
});
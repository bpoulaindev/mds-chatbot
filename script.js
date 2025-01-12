const sendButton = document.getElementById('send-message-btn');
const messagesContainer = document.getElementById('messages-container')
const userInput = document.getElementById('user-input');

const displayMessage = (message, isBot = false) => {
const container = document.createElement("div");
  container.className = `message-row ${isBot ? "bot-side" : "user-side"}`;

  const paragraph = document.createElement("p");
  paragraph.className = "message";
  paragraph.innerHTML = message;

  container.appendChild(paragraph);
  messagesContainer.appendChild(container);
}

sendButton.addEventListener('click', () => {
    const messageValue = userInput.value;
    displayMessage(messageValue, false);
    userInput.value = '';
});


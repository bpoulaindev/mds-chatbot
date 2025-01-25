const sendButton = document.getElementById("send-message-btn");
const deleteButton = document.getElementById("deleteBtn");
const messagesContainer = document.getElementById("messages-container");
const messagesSubContainer = document.querySelector(".messages-sub-container");
const userInput = document.getElementById("user-input");
const emptyStateCard = document.querySelector(".empty-state-card");

const { animate, scroll, motion, stagger } = Motion;

const localStorageHandler = (key, value) => {
  return value ? localStorage.setItem(key, value) : localStorage.getItem(key);
};

console.log(localStorage);

const displayMessage = (message, isBot = false) => {
  const container = document.createElement("div");
  container.className = `message-row ${isBot ? "bot-side" : "user-side"}`;
  const paragraph = document.createElement("p");
  paragraph.className = "message";
  paragraph.innerHTML = message;
  container.appendChild(paragraph);
  messagesSubContainer.appendChild(container);
};

// syntax : { role: user | model, parts: [{text: string}] }
const messagesInstance = {
  messages: [],
  updateEmptyState: () => {
    if (messagesInstance.messages.length === 0) {
      emptyStateCard.classList.remove("hiding");
      emptyStateCard.classList.add("visible");
    } else {
      emptyStateCard.classList.add("hiding");
      emptyStateCard.classList.remove("visible");
    }
  },
  // messages: [{ role: "user", parts: [{ text: "Hello, how are you?" }] }],
  initMessages: (messages) => {
    messagesInstance.messages = messages;
    messages.map((message) =>
      displayMessage(message.parts[0].text, message.role === "model"),
    );
    messagesInstance.updateEmptyState();
  },
  addMessage: (message, isBot) => {
    const formattedMessage = {
      role: isBot ? "model" : "user",
      parts: [{ text: message }],
    };
    messagesInstance.messages.push(formattedMessage);
    displayMessage(message, isBot);
    localStorageHandler(
      "savedMessages",
      JSON.stringify(messagesInstance.messages),
    );
    messagesInstance.updateEmptyState();
  },
  getMessages: () => {
    return messagesInstance.messages;
  },
  resetMessages: () => {
    messagesInstance.messages = [];
    localStorageHandler("savedMessages", JSON.stringify([]));
    messagesSubContainer.innerHTML = ""; // Only clear the sub-container
    messagesInstance.updateEmptyState();
  },
};

// initialize data on load
const savedMessages = localStorageHandler("savedMessages");
if (savedMessages) {
  const parsedMessages = JSON.parse(savedMessages);
  messagesInstance.initMessages(parsedMessages);
}

const GEMINI_API_KEY = "AIzaSyA_6kb_udqs0c3ADNbHcVnaQj4y6STy0G8";

function callGeminiAPI() {
  sendButton.classList.add("loading");
  const allMessages = messagesInstance.getMessages();
  if (allMessages.length === 0) {
    return;
  }
  fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: allMessages,
      }),
    },
  )
    .then((res) => res.json())
    .then((result) => {
      const textContent = result.candidates[0]?.content?.parts?.[0]?.text;
      messagesInstance.addMessage(textContent, true);
      sendButton.classList.remove("loading");
    })
    .catch((error) => console.error(error));
}

const sendMessageFromUser = () => {
  const messageValue = userInput.value;
  messagesInstance.addMessage(messageValue, false);
  callGeminiAPI();
  userInput.value = "";
  sendButton.disabled = true;
};

sendButton.addEventListener("click", () => {
  sendMessageFromUser();
});

userInput.addEventListener("keyup", (event) => {
  userInput.value.length > 0
    ? (sendButton.disabled = false)
    : (sendButton.disabled = true);

  if (event.key === "Enter") {
    sendMessageFromUser();
  }
});

deleteButton.addEventListener("click", () => {
  messagesInstance.resetMessages();
});

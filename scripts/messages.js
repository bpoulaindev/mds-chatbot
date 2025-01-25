window.messagesInstance = {
  messages: [],

  initMessages: function (messages) {
    if (!Array.isArray(messages)) {
      console.error('Invalid messages format:', messages);
      return;
    }
    
    this.messages = messages;
    const messagesSubContainer = document.querySelector(".messages-sub-container");
    messagesSubContainer.innerHTML = ""; // Clear existing messages
    
    // Display each message only once
    messages.forEach((message) => {
      if (message && message.parts && message.parts[0]) {
        this.displayMessage(message.parts[0].text, message.role === "model", false);
      }
    });
    
    this.updateEmptyState();
  },

  addMessage: function (message, isBot) {
    if (!window.conversationsInstance.activeConversationId) {
      const newConversationId = window.conversationsInstance.createNewConversation("New Chat");
      window.conversationsInstance.setActiveConversation(newConversationId);
    }

    const formattedMessage = {
      role: isBot ? "model" : "user",
      parts: [{ text: message }],
    };

    // Add message only to conversation storage
    const conversation = window.conversationsInstance.conversations[window.conversationsInstance.activeConversationId];
    if (conversation) {
      conversation.messages.push(formattedMessage);
      window.conversationsInstance.saveConversations();
    }

    // Update local messages array
    this.messages = conversation.messages;
    
    // Display the new message
    this.displayMessage(message, isBot, true);
    this.updateEmptyState();
  },

  displayMessage: function (message, isBot, isNew = false) {
    const container = document.createElement("div");
    container.className = `message-row ${isBot ? "bot-side" : "user-side"}`;
    const paragraph = document.createElement("p");
    paragraph.className = "message";
    paragraph.innerHTML = message;
    container.appendChild(paragraph);
    document.querySelector(".messages-sub-container").appendChild(container);
  },

  resetMessages: function () {
    this.messages = [];
    document.querySelector(".messages-sub-container").innerHTML = "";
    this.updateEmptyState();
  },

  updateEmptyState: function () {
    const emptyStateCard = document.querySelector(".empty-state-card");
    if (this.messages.length === 0) {
      emptyStateCard.classList.remove("hiding");
      emptyStateCard.classList.add("visible");
    } else {
      emptyStateCard.classList.add("hiding");
      emptyStateCard.classList.remove("visible");
    }
  },
};

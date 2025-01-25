window.uiHandler = {
  setupEventListeners: function () {
    const sendButton = document.getElementById("send-message-btn");
    const deleteButton = document.getElementById("deleteBtn");
    const userInput = document.getElementById("user-input");

    sendButton.addEventListener("click", () => {
      window.uiHandler.sendMessageFromUser();
    });

    userInput.addEventListener("keyup", (event) => {
      sendButton.disabled = userInput.value.length === 0;
      if (event.key === "Enter") {
        window.uiHandler.sendMessageFromUser();
      }
    });

    deleteButton.addEventListener("click", () => {
      if (confirm("Are you sure you want to delete all conversations?")) {
        window.conversationsInstance.deleteAllConversations();
      }
    });

    document.querySelector(".burger-button").addEventListener("click", () => {
      document.querySelector(".sidebar").classList.toggle("open");
    });

    document.querySelector(".close-sidebar").addEventListener("click", () => {
      document.querySelector(".sidebar").classList.remove("open");
    });
    
    const newChatBtn = document.getElementById("newConversationBtn");
    newChatBtn.className = "new-chat-button"; // Add class for styling
    newChatBtn.addEventListener("click", () => {
      const newId = window.conversationsInstance.createNewConversation("New Chat");
      window.conversationsInstance.setActiveConversation(newId);
      // Close sidebar on mobile after creating new chat
      document.querySelector(".sidebar").classList.remove("open");
    });

    // Initialize conversation list on page load
    this.updateConversationList();
  },

  sendMessageFromUser: function () {
    const userInput = document.getElementById("user-input");
    const messageValue = userInput.value.trim();
    if (!messageValue) return;

    window.messagesInstance.addMessage(messageValue, false);
    window.uiHandler.callGeminiAPI();
    userInput.value = "";
    document.getElementById("send-message-btn").disabled = true;
  },

  updateConversationList: function () {
    const sidebarContainer = document.querySelector(".conversations-list");
    sidebarContainer.innerHTML = "";

    for (let id in window.conversationsInstance.conversations) {
      const conv = window.conversationsInstance.conversations[id];
      
      if (id === window.conversationsInstance.activeConversationId) {
        const activeDiv = document.createElement("div");
        activeDiv.className = "conversation-item active";
        
        const titleSpan = document.createElement("span");
        titleSpan.innerText = conv.title;
        
        const buttonsContainer = document.createElement("div");
        buttonsContainer.style.display = "flex";
        buttonsContainer.style.gap = "var(--spacing-xs)";
        
        const renameBtn = document.createElement("button");
        renameBtn.innerHTML = `<img src="assets/edit.svg" alt="Edit" width="16" height="16">`;
        renameBtn.title = "Rename conversation";
        renameBtn.classList.add("rename-btn");
        renameBtn.addEventListener("click", () => {
          const newTitle = prompt("Enter new name:", conv.title);
          if (newTitle && newTitle.trim()) {
            window.conversationsInstance.renameConversation(id, newTitle.trim());
          }
        });
        
        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("rename-btn");
        deleteBtn.id = `delete-${id}`;
        deleteBtn.innerHTML = `<img src="assets/trash.svg" alt="Delete" width="16" height="16">`;
        deleteBtn.title = "Delete conversation";
        
        let isConfirming = false;
        deleteBtn.addEventListener("click", function() {
          if (!isConfirming) {
            this.innerHTML = "Are you sure?";
            this.style.color = "var(--color-error)";
            isConfirming = true;
          } else {
            window.conversationsInstance.deleteConversation(id);
          }
        });
        
        // Reset confirmation state when clicking elsewhere
        document.addEventListener("click", function(e) {
          if (e.target !== deleteBtn && isConfirming) {
            deleteBtn.innerHTML = `<img src="assets/trash.svg" alt="Delete" width="16" height="16">`;
            deleteBtn.style.color = "";
            isConfirming = false;
          }
        });
        
        buttonsContainer.appendChild(renameBtn);
        buttonsContainer.appendChild(deleteBtn);
        
        activeDiv.appendChild(titleSpan);
        activeDiv.appendChild(buttonsContainer);
        sidebarContainer.appendChild(activeDiv);
      } else {
        // Create button for inactive conversation
        const convButton = document.createElement("button");
        convButton.className = "conversation-item";
        convButton.innerText = conv.title;
        convButton.addEventListener("click", () => {
          window.conversationsInstance.setActiveConversation(id);
        });
        
        sidebarContainer.appendChild(convButton);
      }
    }
  },
  
  callGeminiAPI: function () {
    const GEMINI_API_KEY = "AIzaSyA_6kb_udqs0c3ADNbHcVnaQj4y6STy0G8";
    const sendButton = document.getElementById("send-message-btn");
    sendButton.classList.add("loading");

    fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: window.messagesInstance.messages }),
      },
    )
      .then((res) => res.json())
      .then((result) => {
        const textContent = result.candidates[0]?.content?.parts?.[0]?.text;
        console.log("answer from gemini:", textContent);
        window.messagesInstance.addMessage(textContent, true);
        sendButton.classList.remove("loading");
      })
      .catch((error) => console.error(error));
  },
};

window.uiHandler.setupEventListeners();

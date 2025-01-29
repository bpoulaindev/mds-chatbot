window.conversationsInstance = {
  conversations: {},
  activeConversationId: null,

  renderConversationList: function () {
    const conversationList = document.querySelector(".conversations-list");
    conversationList.innerHTML = "";
    for (let id in this.conversations) {
      const convo = this.conversations[id];
      const button = document.createElement("button");
      button.textContent = convo.title;
      button.onclick = () => this.setActiveConversation(id);
      conversationList.appendChild(button);
    }
  },

  loadConversations: function () {
    const savedConversations = window.localStorageHandler("conversations") || {};
    this.conversations = savedConversations;
    
    // If there are conversations, set the first one as active
    const conversationIds = Object.keys(this.conversations);
    if (conversationIds.length > 0) {
      this.setActiveConversation(conversationIds[0]);
    }
    
    this.renderConversationList();
  },

  setActiveConversation: function (conversationId) {
    if (this.conversations[conversationId]) {
      this.activeConversationId = conversationId;
      window.localStorageHandler("activeConversationId", conversationId);
      
      // Load messages from the selected conversation
      window.messagesInstance.initMessages(this.conversations[conversationId].messages);
      
      // Use uiHandler's updateConversationList instead
      window.uiHandler.updateConversationList();
    }
  },

  loadConversations: function () {
    this.conversations = window.localStorageHandler("conversations") || {};
    
    // Restore last active conversation
    const lastActiveId = window.localStorageHandler("activeConversationId");
    if (lastActiveId && this.conversations[lastActiveId]) {
      this.setActiveConversation(lastActiveId);
    } else if (Object.keys(this.conversations).length > 0) {
      // If no active conversation saved, set the first one as active
      this.setActiveConversation(Object.keys(this.conversations)[0]);
    }
    
    this.renderConversationList();
  },

  saveConversations: function () {
    window.localStorageHandler("conversations", this.conversations);
  },

  createNewConversation: function (title) {
    const conversationId = Date.now().toString();
    this.conversations[conversationId] = {
      id: conversationId,
      title: title || "New Chat",
      messages: []
    };

    // Save without JSON.stringify (storage handler will do it)
    window.localStorageHandler("conversations", this.conversations);

    return conversationId;
  },

  renameConversation: function (id, newTitle) {
    if (this.conversations[id]) {
      this.conversations[id].title = newTitle;
      this.saveConversations();
      window.uiHandler.updateConversationList();
    }
  },

  deleteConversation: function (id) {
    delete this.conversations[id];
    
    // Find another conversation to switch to
    const remainingConversations = Object.keys(this.conversations);
    if (remainingConversations.length > 0) {
      this.setActiveConversation(remainingConversations[0]);
    } else {
      // If no conversations left, create a new one
      const newId = this.createNewConversation("New Chat");
      this.setActiveConversation(newId);
    }
    
    this.saveConversations();
    window.uiHandler.updateConversationList();
    window.messagesInstance.resetMessages();
  },
  deleteAllConversations: function () {
    this.conversations = {};
    this.activeConversationId = null;
    window.localStorageHandler("conversations", {});
    window.localStorageHandler("activeConversationId", null);
    window.messagesInstance.resetMessages();
    window.uiHandler.updateConversationList();
    
    // Create a new conversation after clearing
    const newId = this.createNewConversation("New Chat");
    this.setActiveConversation(newId);
  }
};

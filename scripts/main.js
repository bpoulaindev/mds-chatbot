

const savedConversations = window.localStorageHandler("conversations");

if (savedConversations) {
  console.log('loading saved conv', savedConversations)
  window.conversationsInstance.conversations = savedConversations;
} else {
  window.conversationsInstance.conversations = {};
}
document.addEventListener("DOMContentLoaded", () => {
  window.conversationsInstance.loadConversations();
  window.uiHandler.updateConversationList();
});
const messagesMessage = document.getElementById("messages-message");
const conversationList = document.getElementById("conversation-list");
if (messagesMessage && conversationList) {
  auth.onAuthStateChanged((user) => {
    if (!user) {
      window.location.href = "{{ '/login.html' | relative_url }}";
      return;
    }

    messagesMessage.textContent = `Signed in as ${user.email || "your account"}.`;
    conversationList.hidden = false;
  });
}

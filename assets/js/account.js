function redirectToLogin() {
  window.location.href = "{{ '/login.html' | relative_url }}";
}

const accountMessage = document.getElementById("account-message");
const accountDetails = document.getElementById("account-details");
if (accountMessage && accountDetails) {
  auth.onAuthStateChanged((user) => {
    if (!user) {
      redirectToLogin();
      return;
    }

    document.getElementById("account-email").textContent = user.email || "Not available";
    accountMessage.textContent = "You are signed in.";
    accountDetails.hidden = false;
  });

  document.getElementById("logout-button").addEventListener("click", () => {
    auth.signOut().then(redirectToLogin).catch((error) => {
      accountMessage.textContent = error.message;
    });
  });
}

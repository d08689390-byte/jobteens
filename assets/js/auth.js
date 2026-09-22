---
---

function showAuthMessage(element, message, isError) {
  element.textContent = message;
  element.classList.toggle("auth-error", isError);
}

const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = document.getElementById("login-message");
    const email = document.getElementById("login-email-input").value.trim();
    const password = document.getElementById("login-password").value;

    showAuthMessage(message, "Signing in...", false);
    loginEmail(email, password)
      .then(() => {
        showAuthMessage(message, "You are now logged in.", false);
        window.location.href = "{{ '/' | relative_url }}";
      })
      .catch((error) => showAuthMessage(message, error.message, true));
  });
}

const signupForm = document.getElementById("signup-form");
if (signupForm) {
  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = document.getElementById("signup-message");
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;

    showAuthMessage(message, "Creating your account...", false);
    registerEmail(email, password)
      .then(() => {
        showAuthMessage(message, "Your account was created.", false);
        window.location.href = "{{ '/' | relative_url }}";
      })
      .catch((error) => showAuthMessage(message, error.message, true));
  });
}

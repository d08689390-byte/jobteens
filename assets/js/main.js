// Startup animation
window.addEventListener("load", function () {
  const screen = document.getElementById("startup-screen");
  const logo = document.getElementById("jobteens-logo");
  const sound = document.getElementById("gba-sound");

  sound.play();

  setTimeout(() => {
    logo.style.opacity = "1";
    logo.style.transform = "translateY(-40px)";
  }, 800);

  setTimeout(() => {
    logo.style.transform = "translateY(120px)";
  }, 1600);

  setTimeout(() => {
    screen.style.display = "none";
  }, 2600);
});

// Filter system placeholder
document.getElementById("apply-filter").addEventListener("click", () => {
  const age = document.getElementById("filter-age").value;
  const location = document.getElementById("filter-location").value;

  console.log("Filter applied:", age, location);
});

// Account system placeholder
document.getElementById("login-btn").addEventListener("click", () => {
  console.log("Login clicked");
});

document.getElementById("register-btn").addEventListener("click", () => {
  console.log("Register clicked");
});

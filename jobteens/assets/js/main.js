---
---

window.addEventListener("load", () => {
  const sound = document.getElementById("gba-sound");
  if (!sound) return;
  const letters = [
    "l-J", "l-O", "l-B", "l-T",
    "l-E1", "l-E2", "l-N", "l-S"
  ];
// WHITE FLASH EFFECT
function whiteFlash() {
  const flash = document.getElementById("white-flash");
  flash.style.opacity = "1";
  setTimeout(() => {
    flash.style.opacity = "0";
  }, 120);
}

  // Play GBA sound
  sound.play().catch(() => {});

  // Animate letters one-by-one from corner
  letters.forEach((id, index) => {
    setTimeout(() => {
      const el = document.getElementById(id);
      el.style.opacity = "1";
      el.style.transform = "scale(1) translate(0, 0)";
    }, 300 * index);
  });

  // SLAM EFFECT + WHITE FLASH
setTimeout(() => {
  letters.forEach(id => {
    const el = document.getElementById(id);
    el.classList.add("slam");
  });

  whiteFlash(); // GBA-style flash
}, 300 * letters.length + 200);

  // RAINBOW PIXEL MORPH
  setTimeout(() => {
    document.getElementById("letters-container").classList.add("rainbow");
  }, 300 * letters.length + 600);

  // TAGLINE FADE-IN
  setTimeout(() => {
    document.getElementById("intro-tagline").style.opacity = "1";
  }, 300 * letters.length + 1200);

  // FADE OUT INTRO
  setTimeout(() => {
    document.getElementById("intro-screen").style.opacity = "0";
    document.getElementById("intro-screen").style.transition = "opacity 1s ease";
  }, 300 * letters.length + 2500);

  // SHOW WEBSITE
  setTimeout(() => {
    document.getElementById("intro-screen").style.display = "none";
    document.getElementById("site-content").style.display = "block";
  }, 300 * letters.length + 3500);
});

// FILTERING ENGINE
async function loadJobs() {
  const res = await fetch("{{ '/jobs.json' | relative_url }}");
  if (!res.ok) {
    throw new Error(`Unable to load jobs: ${res.status}`);
  }
  return res.json();
}

function matchesFilter(job, age, location) {
  if (age && (age < job.min_age || age > job.max_age)) return false;
  if (location && !job.location.toLowerCase().includes(location.toLowerCase())) return false;
  return true;
}

function renderJobs(jobs) {
  const container = document.getElementById("jobs-list");
  container.innerHTML = "";
  jobs.forEach(job => {
    const div = document.createElement("div");
    div.className = "job-card";
    div.innerHTML = `
      <h3>${job.title}</h3>
      <p>${job.company}</p>
      <p>${job.location}</p>
      <p>Age: ${job.min_age}–${job.max_age}</p>
    `;
    container.appendChild(div);
  });
}

const applyFilter = document.getElementById("apply-filter");
if (applyFilter) {
applyFilter.addEventListener("click", async () => {
  const ageVal = document.getElementById("filter-age").value;
  const age = ageVal ? parseInt(ageVal, 10) : null;
  const location = document.getElementById("filter-location").value.trim();

  const jobs = await loadJobs();
  const filtered = jobs.filter(job => matchesFilter(job, age, location));
  renderJobs(filtered);
});
}

// AUTH BUTTON HOOKS (using functions from firebase.js)
const loginEmailButton = document.getElementById("login-email");
if (loginEmailButton) loginEmailButton.addEventListener("click", () => {
  const email = prompt("Email:");
  const password = prompt("Password:");
  loginEmail(email, password).then(() => {
    console.log("Logged in with email");
  }).catch(console.error);
});

const registerEmailButton = document.getElementById("register-email");
if (registerEmailButton) registerEmailButton.addEventListener("click", () => {
  const email = prompt("Email:");
  const password = prompt("Password:");
  registerEmail(email, password).then(() => {
    console.log("Registered with email");
  }).catch(console.error);
});

const loginGoogleButton = document.getElementById("login-google");
if (loginGoogleButton) loginGoogleButton.addEventListener("click", () => {
  setAuthMessage("Opening Google sign-in...", false);
  loginGoogle().then(() => {
    setAuthMessage("You are now logged in.", false);
  }).catch((error) => setAuthMessage(error.message, true));
});

const loginGithubButton = document.getElementById("login-github");
if (loginGithubButton) loginGithubButton.addEventListener("click", () => {
  setAuthMessage("Opening GitHub sign-in...", false);
  loginGitHub().then(() => {
    setAuthMessage("You are now logged in.", false);
  }).catch((error) => setAuthMessage(error.message, true));
});

const loginPhoneButton = document.getElementById("login-phone");
if (loginPhoneButton) loginPhoneButton.addEventListener("click", () => {
  const number = prompt("Enter phone number (+44...)");
  if (!number) return;
  setAuthMessage("Complete the reCAPTCHA to receive your code.", false);
  loginPhone(number)
    .then((confirmationResult) => {
      const code = prompt("Enter the SMS code you received:");
      if (!code) return;
      return confirmationResult.confirm(code);
    })
    .then(() => setAuthMessage("You are now logged in.", false))
    .catch((error) => {
      resetRecaptcha();
      setAuthMessage(error.message, true);
    });
});

function setAuthMessage(message, isError) {
  const element = document.getElementById("auth-message");
  if (!element) return;
  element.textContent = message;
  element.classList.toggle("auth-error", isError);
}

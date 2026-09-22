// STARTUP ANIMATION
window.addEventListener("load", () => {
  const screen = document.getElementById("startup-screen");
  const logo = document.getElementById("jobteens-logo");
  const sound = document.getElementById("gba-sound");

  if (sound) sound.play().catch(() => {});

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

  // reCAPTCHA for phone auth
  if (typeof setupRecaptcha === "function") {
    setupRecaptcha();
  }

  // initial jobs load
  loadJobs().then(renderJobs).catch(console.error);
});

// FILTERING ENGINE
async function loadJobs() {
  const res = await fetch("/jobs.json");
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

document.getElementById("apply-filter").addEventListener("click", async () => {
  const ageVal = document.getElementById("filter-age").value;
  const age = ageVal ? parseInt(ageVal, 10) : null;
  const location = document.getElementById("filter-location").value.trim();

  const jobs = await loadJobs();
  const filtered = jobs.filter(job => matchesFilter(job, age, location));
  renderJobs(filtered);
});

// AUTH BUTTON HOOKS (using functions from firebase.js)
document.getElementById("login-email").addEventListener("click", () => {
  const email = prompt("Email:");
  const password = prompt("Password:");
  loginEmail(email, password).then(() => {
    console.log("Logged in with email");
  }).catch(console.error);
});

document.getElementById("register-email").addEventListener("click", () => {
  const email = prompt("Email:");
  const password = prompt("Password:");
  registerEmail(email, password).then(() => {
    console.log("Registered with email");
  }).catch(console.error);
});

document.getElementById("login-google").addEventListener("click", () => {
  loginGoogle().then(() => {
    console.log("Logged in with Google");
  }).catch(console.error);
});

document.getElementById("login-github").addEventListener("click", () => {
  loginGitHub().then(() => {
    console.log("Logged in with GitHub");
  }).catch(console.error);
});

document.getElementById("login-phone").addEventListener("click", () => {
  const number = prompt("Enter phone number (+44...)");
  loginPhone(number).then(() => {
    console.log("Logged in with phone");
  }).catch(console.error);
});

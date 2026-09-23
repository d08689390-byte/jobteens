// ---------------------------------------------------------
// 1. Firebase config (replace with your real values)
// ---------------------------------------------------------
const firebaseConfig = {
 apiKey: "AIzaSyAvCFQ9_zf7WMR9OTqo0SP8Dc9eey5m3G8",
  authDomain: "jobteens.firebaseapp.com",
  projectId: "jobteens",
  storageBucket: "jobteens.firebasestorage.app",
  messagingSenderId: "205272038289",
  appId: "1:205272038289:web:b92e318944db72f39cb830",
  measurementId: "G-VDP94DYCKG"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase Auth reference
const auth = firebase.auth();


// ---------------------------------------------------------
// 2. Email/Password Authentication
// ---------------------------------------------------------

function registerEmail(email, password) {
  return auth.createUserWithEmailAndPassword(email, password);
}

function loginEmail(email, password) {
  return auth.signInWithEmailAndPassword(email, password);
}


// ---------------------------------------------------------
// 3. Google Authentication
// ---------------------------------------------------------

const googleProvider = new firebase.auth.GoogleAuthProvider();

function loginGoogle() {
  return auth.signInWithPopup(googleProvider);
}


// ---------------------------------------------------------
// 4. GitHub Authentication
// ---------------------------------------------------------

const githubProvider = new firebase.auth.GithubAuthProvider();

function loginGitHub() {
  return auth.signInWithPopup(githubProvider);
}


// ---------------------------------------------------------
// 5. Phone Authentication + reCAPTCHA
// ---------------------------------------------------------

let recaptchaVerifier;

function setupRecaptcha() {
  const container = document.getElementById("recaptcha-container");
  if (!container) {
    return Promise.reject(new Error("Phone login is unavailable on this page."));
  }
  if (recaptchaVerifier) {
    return Promise.resolve(recaptchaVerifier);
  }

  recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
    size: 'normal'
  });
  return recaptchaVerifier.render().then(() => recaptchaVerifier);
}

function resetRecaptcha() {
  if (recaptchaVerifier) {
    recaptchaVerifier.clear();
    recaptchaVerifier = null;
  }
}

function loginPhone(phoneNumber) {
  return setupRecaptcha().then((verifier) =>
    auth.signInWithPhoneNumber(phoneNumber, verifier)
  );
}


// ---------------------------------------------------------
// 6. Logout
// ---------------------------------------------------------

function logout() {
  return auth.signOut();
}

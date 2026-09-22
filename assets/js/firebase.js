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

// Call this BEFORE loginPhone()
function setupRecaptcha() {
  recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
    size: 'normal',
    callback: function(response) {
      console.log("reCAPTCHA solved");
    }
  });
}

function loginPhone(phoneNumber) {
  const phoneProvider = new firebase.auth.PhoneAuthProvider();

  return phoneProvider.verifyPhoneNumber(phoneNumber, recaptchaVerifier)
    .then(verificationId => {
      const code = prompt("Enter the SMS code you received:");
      const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);
      return auth.signInWithCredential(credential);
    });
}


// ---------------------------------------------------------
// 6. Logout
// ---------------------------------------------------------

function logout() {
  return auth.signOut();
}

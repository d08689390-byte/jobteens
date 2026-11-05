import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup 
} from "https://esm.sh/firebase@1.13.6/";

import { 
  getFirestore, 
  doc, 
  setDoc 
} from "https://esm.sh/firebase@4.19.0/firestore";

const auth = getAuth();
const db = getFirestore();

// LOGIN
document.getElementById("login-email")?.addEventListener("click", () => {
  const email = prompt("Email:");
  const pass = prompt("Password:");
  signInWithEmailAndPassword(auth, email, pass);
});

document.getElementById("login-google")?.addEventListener("click", () => {
  signInWithPopup(auth, new GoogleAuthProvider());
});

// REGISTER
document.getElementById("register-btn")?.addEventListener("click", async () => {
  const email = document.getElementById("reg-email").value;
  const pass = document.getElementById("reg-pass").value;
  const age = document.getElementById("reg-age").value;

  const userCred = await createUserWithEmailAndPassword(auth, email, pass);

  await setDoc(doc(db, "users", userCred.user.uid), {
    email,
    age,
    cv: null
  });

  alert("Account created!");
});

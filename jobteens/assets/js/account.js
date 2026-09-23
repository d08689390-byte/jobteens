import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

const auth = getAuth();
const db = getFirestore();

auth.onAuthStateChanged(async (user) => {
  if (!user) return location.href = "/login.html";

  const userDoc = await getDoc(doc(db, "users", user.uid));
  const data = userDoc.data();

  document.getElementById("user-info").innerHTML = `
    <p>Email: ${data.email}</p>
    <p>Age: ${data.age}</p>
  `;

  document.getElementById("cv-link").innerHTML = data.cv 
    ? `<a href="${data.cv}" target="_blank">View CV</a>`
    : `<a href="/upload-cv.html">Upload CV</a>`;

  const apps = await getDocs(query(
    collection(db, "applications"),
    where("user", "==", user.uid)
  ));

  let html = "";
  apps.forEach(app => {
    html += `<p>${app.data().jobTitle}</p>`;
  });

  document.getElementById("applied-jobs").innerHTML = html;
});

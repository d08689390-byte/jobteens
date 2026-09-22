import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

const auth = getAuth();
const db = getFirestore();

auth.onAuthStateChanged(async (user) => {
  if (!user) return location.href = "/login.html";

  const q = query(
    collection(db, "conversations"),
    where("teenId", "==", user.uid)
  );

  const snap = await getDocs(q);
  let html = "";

  snap.forEach(doc => {
    const data = doc.data();
    html += `
      <div>
        <p>Job: ${data.jobTitle}</p>
        <p>Employer: ${data.employerName}</p>
        <a href="/chat.html?id=${doc.id}">Open chat</a>
      </div>
    `;
  });

  document.getElementById("conversation-list").innerHTML = html;
});

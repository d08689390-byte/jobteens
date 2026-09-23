import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const auth = getAuth();
const db = getFirestore();

const params = new URLSearchParams(location.search);
const jobId = params.get("id");

document.getElementById("apply-btn").addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return location.href = "/login.html";

  await setDoc(doc(db, "applications", `${user.uid}_${jobId}`), {
    user: user.uid,
    job: jobId,
    jobTitle: document.getElementById("job-info").innerText
  });

  alert("Applied!");
});

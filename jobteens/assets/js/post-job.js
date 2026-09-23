import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const auth = getAuth();
const db = getFirestore();

document.getElementById("post-job-btn").addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return location.href = "/login.html";

  const title = document.getElementById("job-title").value;
  const location = document.getElementById("job-location").value;
  const pay = document.getElementById("job-pay").value;
  const desc = document.getElementById("job-desc").value;

  await addDoc(collection(db, "jobs"), {
    employerId: user.uid,
    employerEmail: user.email,
    title,
    location,
    pay,
    desc,
    createdAt: new Date()
  });

  alert("Job posted!");
});

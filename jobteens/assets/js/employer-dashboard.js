import { getAuth } from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  setDoc 
} from "firebase/firestore";

const auth = getAuth();
const db = getFirestore();

auth.onAuthStateChanged(async (user) => {
  if (!user) return location.href = "/login.html";

  // jobs posted by this employer
  const jobsQ = query(
    collection(db, "jobs"),
    where("employerId", "==", user.uid)
  );
  const jobsSnap = await getDocs(jobsQ);

  let jobsHtml = "";
  jobsSnap.forEach(job => {
    const data = job.data();
    jobsHtml += `<div>
      <p>${data.title}</p>
      <p>${data.location}</p>
      <p>${data.pay}</p>
    </div>`;
  });
  document.getElementById("employer-jobs").innerHTML = jobsHtml;

  appsHtml += `
  <div>
    <p>Job: ${data.jobTitle}</p>
    <p>Teen: ${data.teenEmail}</p>
    <p>Status: ${data.status}</p>

    <button onclick="updateStatus('${app.id}', 'accepted')">Accept</button>
    <button onclick="updateStatus('${app.id}', 'rejected')">Reject</button>

    <button onclick="openConversation('${app.id}', '${data.teenId}', '${data.jobId}')">
      Message
    </button>
  </div>
`;


  let appsHtml = "";
  appsSnap.forEach(app => {
    const data = app.data();
    appsHtml += `<div>
      <p>Job: ${data.jobTitle}</p>
      <p>Teen: ${data.teenEmail}</p>
      <button onclick="openConversation('${app.id}', '${data.teenId}', '${data.jobId}')">
        Message
      </button>
    </div>`;
  });
  document.getElementById("employer-applications").innerHTML = appsHtml;
});

window.updateStatus = async (appId, newStatus) => {
  await updateDoc(doc(db, "applications", appId), {
    status: newStatus
  });
  location.reload();
};


// create/open conversation
window.openConversation = async (applicationId, teenId, jobId) => {
  const user = auth.currentUser;
  const convId = `${jobId}_${teenId}_${user.uid}`;

  await setDoc(doc(db, "conversations", convId), {
    jobId,
    teenId,
    employerId: user.uid,
    createdAt: new Date()
  }, { merge: true });

  location.href = `/chat.html?id=${convId}`;
};

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, updateDoc } from "firebase/firestore";

const storage = getStorage();
const auth = getAuth();
const db = getFirestore();

document.getElementById("upload-cv-btn").addEventListener("click", async () => {
  const file = document.getElementById("cv-file").files[0];
  if (!file) return alert("Select a file first!");

  const user = auth.currentUser;
  const cvRef = ref(storage, `cv_uploads/${user.uid}.pdf`);

  await uploadBytes(cvRef, file);
  const url = await getDownloadURL(cvRef);

  await updateDoc(doc(db, "users", user.uid), { cv: url });

  document.getElementById("cv-status").innerText = "CV uploaded!";
});

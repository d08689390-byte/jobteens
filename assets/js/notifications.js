import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

const auth = getAuth();
const db = getFirestore();

auth.onAuthStateChanged(async (user) => {
  if (!user) return;

  const convQ = query(
    collection(db, "conversations"),
    where("teenId", "==", user.uid)
  );

  const convSnap = await getDocs(convQ);

  let unread = 0;

  for (const conv of convSnap.docs) {
    const messagesRef = collection(conv.ref, "messages");
    const messagesSnap = await getDocs(messagesRef);

    messagesSnap.forEach(m => {
      if (!m.data().readBy.includes(user.uid)) unread++;
    });
  }

  document.getElementById("badge").innerText = unread > 0 ? unread : "";
});

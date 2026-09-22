import { getAuth } from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  collection, 
  addDoc, 
  onSnapshot, 
  serverTimestamp 
} from "firebase/firestore";

const auth = getAuth();
const db = getFirestore();

const params = new URLSearchParams(location.search);
const conversationId = params.get("id");

const messagesDiv = document.getElementById("messages");
const input = document.getElementById("message-input");
const sendBtn = document.getElementById("send-message");

onSnapshot(messagesRef, (snap) => {
  snap.forEach(async (m) => {
    const data = m.data();
    if (!data.readBy.includes(user.uid)) {
      await updateDoc(doc(messagesRef, m.id), {
        readBy: [...data.readBy, user.uid]
      });
    }
  });
});


sendBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return location.href = "/login.html";

  const text = input.value.trim();
  if (!text) return;

 await addDoc(
  collection(doc(db, "conversations", conversationId), "messages"),
  {
    senderId: user.uid,
    senderName: user.email,
    text,
    timestamp: serverTimestamp(),
    readBy: [user.uid]
  }
);


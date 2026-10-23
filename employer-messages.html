---
layout: default
title: Employer Messages
---

<style>
  .messages-layout { font-family: sans-serif; max-width: 700px; margin: 40px auto; padding: 20px; }
  .messages-layout h1 { font-size: 24px; color: #111827; margin-bottom: 20px; }
  
  /* Conversation Card Component List layout rules */
  .conversation-grid { display: flex; flex-direction: column; gap: 14px; }
  .conversation-card { display: flex; justify-content: space-between; align-items: center; padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.05); transition: box-shadow 0.2s ease; }
  .conversation-card:hover { box-shadow: 0 4px 6px rgba(0,0,0,0.05); border-color: #cbd5e1; }
  
  .candidate-details p { margin: 4px 0; font-size: 14px; }
  .job-tag { font-weight: bold; color: #111827; font-size: 16px; }
  .applicant-tag { color: #4b5563; }
  
  .chat-link-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; background: #0076df; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; transition: background 0.2s; }
  .chat-link-btn:hover { background: #005bb5; }
  
  /* Status indicators layout */
  .loader-status { padding: 30px; text-align: center; color: #6b7280; font-size: 15px; }
</style>

<main class="messages-layout">
  <h1>Messages from Applicants</h1>
  
  <!-- FIXED: Standardised layout structure with a fallback state indicator -->
  <div id="employer-conversation-list" class="conversation-grid" role="region" aria-live="polite">
    <div class="loader-status">✉️ Loading your conversation history threads...</div>
  </div>
</main>

<!-- FIXED: Resolved compilation blocks using proper browser-compatible module assets -->
<script type="module">
  import { initializeApp } from "https://gstatic.com";
  import { getAuth, onAuthStateChanged } from "https://gstatic.com";
  import { getFirestore, collection, query, where, getDocs } from "https://gstatic.com";

  // TODO: Double check that this snippet accurately mirrors your active workspace credentials
  const firebaseConfig = {
    apiKey: "AIzaSyAvCFQ9_zf7WMR9OTqo0SP8Dc9eey5m3G8",
    authDomain: "://firebaseapp.com",
    projectId: "jobteens",
    storageBucket: "jobteens.firebasestorage.app",
    messagingSenderId: "205272038289",
    appId: "1:205272038289:web:b92e318944db72f39cb830",
    measurementId: "G-VDP94DYCKG"
  };

  // Initialize Core Services
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  const listContainer = document.getElementById("employer-conversation-list");

  // Helper utility to safely sanitize data fields against XSS injection strings
  function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  // FIXED: Standardised instance monitoring sequence tracking
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "/login.html";
      return;
    }

    try {
      const q = query(
        collection(db, "conversations"),
        where("employerId", "==", user.uid)
      );

      const snap = await getDocs(q);
      
      // Handle empty layout state explicitly
      if (snap.empty) {
        listContainer.innerHTML = `
          <div class="loader-status" style="border: 1px dashed #d1d5db; border-radius: 8px; padding: 40px;">
            <span style="font-size: 24px;">📥</span>
            <p style="margin-top: 10px; font-weight: 500;">No applications received yet.</p>
            <p style="font-size: 13px; color: #9ca3af; margin: 0;">When applicants message you regarding job listings, they will show up here.</p>
          </div>`;
        return;
      }

      let htmlContent = "";

      snap.forEach(docSnap => {
        const data = docSnap.data();
        
        // FIXED: Sanitized data tracking parameters before pushing to document node tree
        const safeJobTitle = escapeHTML(data.jobTitle || 'Untitled Position');
        const safeTeenName = escapeHTML(data.teenName || 'Applicant');
        const safeDocId = escapeHTML(docSnap.id);

        htmlContent += `
          <div class="conversation-card">
            <div class="candidate-details">
              <p class="job-tag">Job: ${safeJobTitle}</p>
              <p class="applicant-tag">Teen: ${safeTeenName}</p>
            </div>
            <div>
              <a href="/chat.html?id=${safeDocId}" class="chat-link-btn">
                <span>💬</span> Open Chat
              </a>
            </div>
          </div>
        `;
      });

      listContainer.innerHTML = htmlContent;

    } catch (error) {
      console.error("Firestore Query Operational Exception Error:", error);
      listContainer.innerHTML = `
        <div class="loader-status" style="color: #b91c1c;">
          ⚠️ Failed to load message threads: ${escapeHTML(error.message)}
        </div>`;
    }
  });
</script>

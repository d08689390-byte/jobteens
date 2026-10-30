require('dotenv').config(); // 1. Load the .env file at the very top
const express = require('express');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const serviceAccount = require(path.resolve('./firebase-key.json'));

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

app.use(express.json());

// 2. Shared Secret Middleware Function
const requireSecret = (req, res, next) => {
  // Extract token from 'Authorization: Bearer <secret>' header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Unauthorized: Missing or malformed API secret." });
  }

  const token = authHeader.split(' ')[1];

  // Compare the sent token with your securely stored environment variable
  if (token !== process.env.JOBTEENS_API_SECRET) {
    return res.status(403).json({ error: "Forbidden: Invalid API secret." });
  }

  // If the secret matches, move on to the actual API logic
  next();
};

// 3. Apply the middleware to your endpoint
app.get('/api/jobs', requireSecret, async (req, res) => {
  const { type } = req.query;

  if (!type) {
    return res.status(400).json({ error: "Please specify a job type parameter, e.g., ?type=part-time" });
  }

  try {
    const listingsRef = db.collection('listings');
    const snapshot = await listingsRef
      .where('type', '==', type.toLowerCase())
      .where('active', '==', true)
      .limit(10)
      .get();

    if (snapshot.empty) {
      return res.json({ count: 0, jobs: [] });
    }

    const liveJobs = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      liveJobs.push({
        id: doc.id,
        title: data.title,
        company: data.company,
        location: data.location,
        type: data.type,
        salary: data.salary || 'Not specified'
      });
    });

    res.json({ count: liveJobs.length, jobs: liveJobs });

  } catch (error) {
    console.error("Firestore database query error:", error);
    res.status(500).json({ error: "Failed to retrieve documents from internal database" });
  }
});

app.listen(PORT, () => console.log(`JobTeens Secured API running on port ${PORT}`));

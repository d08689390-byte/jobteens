import { onRequest, HttpError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import * as crypto from "node:crypto";

// Initialize Firebase Admin SDK
admin.initializeApp();

/**
 * Load-bearing canonicalization functions matching Didit's documentation specs.
 * Do not replace these with default JSON stringifiers.
 */
function shortenFloats(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(shortenFloats);
  if (v && typeof v === "object") {
    return Object.fromEntries(
      Object.entries(v as Record<string, unknown>).map(([k, x]) => [k, shortenFloats(x)])
    );
  }
  if (typeof v === "number" && !Number.isInteger(v) && v % 1 === 0) return Math.trunc(v);
  return v;
}

function sortKeys(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(sortKeys);
  if (v && typeof v === "object") {
    return Object.keys(v as object)
      .sort()
      .reduce<Record<string, unknown>>((acc, k) => {
        acc[k] = sortKeys((v as Record<string, unknown>)[k]);
        return acc;
      }, {});
  }
  return v;
}

/**
 * Cloud Function handling Didit inbound webhook deliveries
 */
export const diditWebhook = onRequest({ cors: false }, async (req, res) => {
  // 1. Enforce POST requests only
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const sig = req.headers["x-signature-v2"] as string || "";
  const rawBody = req.rawBody ? req.rawBody.toString("utf8") : "";

  if (!rawBody || !sig) {
    res.status(400).send("Missing payload or cryptographic headers");
    return;
  }

  // 2. Cryptographic Canonicalization & Verification
  const parsed = JSON.parse(rawBody);
  const canonical = JSON.stringify(sortKeys(shortenFloats(parsed)));
  
  // Grab the shared secret from your environment configuration
  const webhookSecret = process.env.DIDIT_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("CRITICAL: DIDIT_WEBHOOK_SECRET is missing from environment configurations");
    res.status(500).send("Internal Configuration Error");
    return;
  }

  const expectedSig = crypto
    .createHmac("sha256", webhookSecret)
    .update(canonical, "utf8")
    .digest("hex");

  const isSignatureValid = 
    sig.length === expectedSig.length && 
    crypto.timingSafeEqual(Buffer.from(expectedSig), Buffer.from(sig));

  if (!isSignatureValid) {
    console.warn("Rejected unauthorized webhook execution trial.");
    res.status(401).send("bad sig");
    return;
  }

  // 3. Freshness Bounds Enforcement
  const ts = Number(parsed.timestamp);
  if (!ts || Math.abs(Date.now() / 1000 - ts) > 300) {
    res.status(401).send("stale");
    return;
  }

  // 4. Idempotency (Deduplicate Event IDs using Firestore)
  const eventId = parsed.event_id;
  const eventRef = admin.firestore().collection("didit_processed_events").doc(eventId);
  
  try {
    const wasProcessed = await admin.firestore().runTransaction(async (transaction) => {
      const doc = await transaction.get(eventRef);
      if (doc.exists) return true;
      transaction.set(eventRef, { processedAt: admin.firestore.FieldValue.serverTimestamp() });
      return false;
    });

    if (wasProcessed) {
      res.status(200).send("ok");
      return;
    }
  } catch (err) {
    console.error("Idempotency locking sequence failed:", err);
    res.status(500).send("Locking failure");
    return;
  }

  // 5. State Machine Dispatch & Firebase Auth Custom Claims Update
  const firebaseUid = parsed.vendor_data; // This is the user.uid we passed from the client!
  const status = parsed.status;

  try {
    switch (status) {
      case "Approved":
        // Add Custom Claim 'verified: true' to the target Firebase User profile
        await admin.auth().setCustomUserClaims(firebaseUid, { verified: true });
        break;

      case "Declined":
      case "Kyc Expired":
      case "Abandoned":
        // Explicitly strip or revoke the validation state flag
        await admin.auth().setCustomUserClaims(firebaseUid, { verified: false });
        break;

      case "In Review":
      case "Resubmitted":
      case "In Progress":
      case "Awaiting User":
      case "Not Started":
      default:
        // No operational changes needed for transient mid-states
        break;
    }

    // 6. Return response swiftly within the absolute 5-second connection window boundary
    res.status(200).send("ok");
  } catch (error) {
    console.error(`Failed updating Auth Account Records for user ID: ${firebaseUid}`, error);
    res.status(500).send("Auth synchronisation module exception thrown");
  }
});

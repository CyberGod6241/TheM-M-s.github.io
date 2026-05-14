const admin = require("firebase-admin");
require("dotenv").config();

const useEmulator = Boolean(process.env.FIRESTORE_EMULATOR_HOST);
const projectId = process.env.FIREBASE_PROJECT_ID || "food-restaurant-f298d";

let db;
let auth;

const initializeFirebase = () => {
  try {
    const serviceAccount = require("./serviceAccountKey.json");

    // Check if service account has placeholder values
    if (
      serviceAccount.private_key.includes("PLACEHOLDER") ||
      !serviceAccount.private_key.includes("BEGIN PRIVATE KEY")
    ) {
      throw new Error(
        "serviceAccountKey.json contains placeholder values. Please add your real Firebase service account key.",
      );
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId,
    });

    db = admin.firestore();
    auth = admin.auth();
    return { isMock: false };
  } catch (error) {
    console.error("❌ Firebase initialization error:", error.message);
    console.error(
      "\n📋 To fix this:\n1. Go to Firebase Console → Project Settings → Service Accounts\n2. Download the JSON file\n3. Replace serviceAccountKey.json with your real key\n",
    );
    process.exit(1);
  }
};

/**
 * Create an admin account
 * Usage: node setup-admin.js <uid> <email> <displayName>
 * Example: node setup-admin.js user123 admin@kumchop.com "Admin User"
 */
async function setupAdmin() {
  const args = process.argv.slice(2);

  if (args.length < 3) {
    console.log("Usage: node setup-admin.js <uid> <email> <displayName>");
    console.log(
      "Example: node setup-admin.js user123 admin@kumchop.com 'Admin User'",
    );
    process.exit(1);
  }

  const [uid, email, displayName] = args;
  const { isMock } = initializeFirebase();

  try {
    console.log(`\n📝 Setting up admin for UID: ${uid}\n`);

    // 1. Set custom claims on Firebase Auth
    console.log("1️⃣  Setting custom claims in Firebase Auth...");
    await auth.setCustomUserClaims(uid, { admin: true });
    console.log("   ✅ Custom claims set successfully\n");

    // 2. Create/update user document in Firestore
    console.log("2️⃣  Creating/updating user document in Firestore...");
    await db.collection("users").doc(uid).set(
      {
        email,
        displayName,
        role: "admin",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
    console.log("   ✅ User document created successfully\n");

    console.log("✨ Admin account setup complete!\n");
    console.log(`📌 Steps to access admin panel:\n`);
    console.log(`1. Sign up or login with email: ${email}\n`);
    console.log(`2. Navigate to: http://localhost:5173/admin\n`);
  } catch (error) {
    console.error("❌ Error setting up admin:", error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

setupAdmin();

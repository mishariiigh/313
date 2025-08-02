import dotenv from "dotenv";
dotenv.config();

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseApiKey = process.env.VITE_FIREBASE_API_KEY;
const firebaseProjectId = process.env.VITE_FIREBASE_PROJECT_ID;
const firebaseAppId = process.env.VITE_FIREBASE_APP_ID;

if (!firebaseApiKey || !firebaseProjectId || !firebaseAppId) {
  console.error("❌ Missing Firebase environment variables.");
}

const firebaseConfig = {
  apiKey: firebaseApiKey || "AIzaSyBQwHA7qmGPAuxqxqYFL_v53NwmWKMsBiU",
  authDomain: firebaseProjectId ? `${firebaseProjectId}.firebaseapp.com` : "game-aad88.firebaseapp.com",
  projectId: firebaseProjectId || "game-aad88",
  storageBucket: firebaseProjectId ? `${firebaseProjectId}.firebasestorage.app` : "game-aad88.firebasestorage.app",
  appId: firebaseAppId || "1:376324753966:web:9a79dba8c22d2efb4c6dbf",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app as default, db, auth };

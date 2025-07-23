import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Get Firebase configuration from environment variables
const firebaseApiKey = process.env.VITE_FIREBASE_API_KEY;
const firebaseProjectId = process.env.VITE_FIREBASE_PROJECT_ID;
const firebaseAppId = process.env.VITE_FIREBASE_APP_ID;

// Validate Firebase configuration with more graceful error handling
if (!firebaseApiKey || !firebaseProjectId || !firebaseAppId) {
  console.error("❌ Missing Firebase environment variables. Using fallback configuration for development.");
  console.error("Please set: VITE_FIREBASE_API_KEY, VITE_FIREBASE_PROJECT_ID, VITE_FIREBASE_APP_ID");
}

// Firebase configuration from environment variables with fallback
const firebaseConfig = {
  apiKey: firebaseApiKey || "AIzaSyBQwHA7qmGPAuxqxqYFL_v53NwmWKMsBiU",
  authDomain: firebaseProjectId ? `${firebaseProjectId}.firebaseapp.com` : "game-aad88.firebaseapp.com",
  projectId: firebaseProjectId || "game-aad88",
  storageBucket: firebaseProjectId ? `${firebaseProjectId}.firebasestorage.app` : "game-aad88.firebasestorage.app",
  appId: firebaseAppId || "1:376324753966:web:9a79dba8c22d2efb4c6dbf",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Auth  
const auth = getAuth(app);

export { app as default, db, auth };
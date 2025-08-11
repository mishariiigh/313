import dotenv from "dotenv";
dotenv.config(); // Load env vars from .env file

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Firebase config - use backend env vars without VITE_ prefix
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyBQwHA7qmGPAuxqxqYFL_v53NwmWKMsBiU",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "game-aad88.firebaseapp.com",
  databaseURL: process.env.FIREBASE_DATABASE_URL || "https://game-aad88-default-rtdb.firebaseio.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "game-aad88",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "game-aad88.firebasestorage.app",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "376324753966",
  appId: process.env.FIREBASE_APP_ID || "1:376324753966:web:9a79dba8c22d2efb4c6dbf",
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-XR8D226WZJ",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Export services for use in backend
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Firebase configuration using Vite env vars
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBQwHA7qmGPAuxqxqYFL_v53NwmWKMsBiU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "game-aad88.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://game-aad88-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "game-aad88",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "game-aad88.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "376324753966",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:376324753966:web:9a79dba8c22d2efb4c6dbf",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-XR8D226WZJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;

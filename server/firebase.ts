import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Hardcoded Firebase configuration (temporary fix for API key issue)
const firebaseConfig = {
  apiKey: "AIzaSyBQwHA7qmGPAuxqxqYFL_v53NwmWKMsBiU",
  authDomain: "game-aad88.firebaseapp.com",
  projectId: "game-aad88",
  storageBucket: "game-aad88.firebasestorage.app",
  messagingSenderId: "376324753966",
  appId: "1:376324753966:web:9a79dba8c22d2efb4c6dbf",
  measurementId: "G-XR8D226WZJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

export default app;
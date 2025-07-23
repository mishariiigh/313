import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { clientConfig } from "./config";

// Validate Firebase configuration
if (!clientConfig.firebase.apiKey || !clientConfig.firebase.projectId || !clientConfig.firebase.appId) {
  throw new Error(
    "Missing required Firebase environment variables. Please check your .env file and ensure you have:\n" +
    "- VITE_FIREBASE_API_KEY\n" +
    "- VITE_FIREBASE_PROJECT_ID\n" +
    "- VITE_FIREBASE_APP_ID"
  );
}

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: clientConfig.firebase.apiKey,
  authDomain: clientConfig.firebase.authDomain,
  projectId: clientConfig.firebase.projectId,
  storageBucket: clientConfig.firebase.storageBucket,
  appId: clientConfig.firebase.appId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

// Google Sign In Functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const signInWithGoogleRedirect = () => {
  return signInWithRedirect(auth, googleProvider);
};

export const handleGoogleRedirect = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      return result.user;
    }
    return null;
  } catch (error) {
    console.error('Error handling Google redirect:', error);
    throw error;
  }
};

export default app;
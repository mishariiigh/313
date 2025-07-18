import { initializeApp } from "firebase/app";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Initialize Firebase client SDK for server-side use
const firebaseConfig = {
  apiKey: process.env.GOOGLE_API_KEY,
  authDomain: "game-aad88.firebaseapp.com",
  projectId: "game-aad88",
  storageBucket: "game-aad88.firebasestorage.app",
  messagingSenderId: "376324753966",
  appId: "1:376324753966:web:9a79dba8c22d2efb4c6dbf",
  measurementId: "G-XR8D226WZJ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// For now, we'll use a simplified approach without admin SDK
export const verifyIdToken = async (idToken: string) => {
  try {
    // This is a simplified verification - in production you'd use Firebase Admin SDK
    // For now, we'll decode the token payload (this is NOT secure for production)
    const payload = JSON.parse(atob(idToken.split('.')[1]));
    return payload;
  } catch (error) {
    console.error('Error verifying ID token:', error);
    throw error;
  }
};

// Create or update user in our database using Firebase storage
export const createOrUpdateFirebaseUser = async (firebaseUser: any) => {
  try {
    const { uid, email, name, picture } = firebaseUser;
    
    // Import storage here to avoid circular dependency
    const { storage } = await import('./firebase-storage');
    
    // Check if user exists in our database
    const existingUser = await storage.getUser(uid);
    
    if (!existingUser) {
      // Create new user
      const newUser = await storage.createUser({
        email: email || '',
        name: name || email?.split('@')[0] || 'مستخدم',
        password: '', // No password for Google auth users
        availableGames: 2, // Give new users 2 free games
        isAdmin: false,
      });
      
      return newUser;
    } else {
      // Update existing user
      const updatedUser = await storage.updateUser(uid, {
        email: email || existingUser.email,
        name: name || existingUser.name,
      });
      
      return updatedUser;
    }
  } catch (error) {
    console.error('Error creating/updating Firebase user:', error);
    throw error;
  }
};
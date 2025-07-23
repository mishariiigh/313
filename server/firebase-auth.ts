// Import the shared Firebase instance to avoid duplicate app error
import app, { auth, db } from "./firebase";

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
    const { uid, email, name, picture, phoneNumber } = firebaseUser;
    
    // Import storage here to avoid circular dependency
    const { storage } = await import('./firebase-storage');
    
    // Check if user exists in our database
    const existingUser = await storage.getUser(uid);
    
    if (!existingUser) {
      // Create new user - Google users might not have phone numbers
      const newUser = await storage.createUser({
        email: email || '',
        phoneNumber: phoneNumber || '', // Phone number might be empty for Google auth
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
        phoneNumber: phoneNumber || existingUser.phoneNumber,
      });
      
      return updatedUser;
    }
  } catch (error) {
    console.error('Error creating/updating Firebase user:', error);
    throw error;
  }
};
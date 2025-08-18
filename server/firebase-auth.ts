import { storage } from "./firebase-storage";

// Simplified token verification for development  
export const verifyIdToken = async (idToken: string) => {
  try {
    // In a real production app, you'd use Firebase Admin SDK here
    // For development, we'll decode the JWT payload
    const base64Url = idToken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const payload = JSON.parse(jsonPayload);

    // Basic validation
    if (!payload.email || !payload.sub) {
      throw new Error('Invalid token payload');
    }

    return {
      uid: payload.sub,
      email: payload.email,
      name: payload.name || payload.email.split('@')[0],
      picture: payload.picture,
      email_verified: payload.email_verified || false
    };
  } catch (error) {
    console.error('Error verifying ID token:', error);
    throw new Error('Invalid ID token');
  }
};

export const createOrUpdateFirebaseUser = async (decodedToken: any) => {
  try {
    // Check if user exists
    let user = await storage.getUserByEmail(decodedToken.email);

    if (user) {
      // Update existing user
      return user;
    } else {
      // Create new user
      const newUser = await storage.createUser({
        email: decodedToken.email,
        name: decodedToken.name || decodedToken.email.split('@')[0],
        phoneNumber: '', // Google auth doesn't provide phone number
        password: '', // No password for Google auth users
        availableGames: 2, // Give 2 free games to new users
        isAdmin: false
      });

      return newUser;
    }
  } catch (error) {
    console.error('Error creating/updating Firebase user:', error);
    throw error;
  }
};
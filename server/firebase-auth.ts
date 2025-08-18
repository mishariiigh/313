
import admin from "firebase-admin";

// Initialize Firebase Admin SDK once
if (!admin.apps.length) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY 
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : undefined;

  admin.initializeApp({
    credential: serviceAccount 
      ? admin.credential.cert(serviceAccount)
      : admin.credential.applicationDefault(),
    projectId: process.env.FIREBASE_PROJECT_ID || "game-aad88",
  });
}

export async function verifyFirebaseToken(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "غير مسجل الدخول" });
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Get or create user in your database
    const { storage } = await import("./firebase-storage");
    let user = await storage.getUserByEmail(decodedToken.email!);
    
    if (!user) {
      // Create new user if doesn't exist
      user = await storage.createUser({
        email: decodedToken.email!,
        name: decodedToken.name || decodedToken.email!.split('@')[0],
        phoneNumber: decodedToken.phone_number || '',
        password: '', // No password for Firebase auth users
        availableGames: 2, // Give 2 free games to new users
        isAdmin: false
      });
    }

    req.user = user; // Set the user from your database
    req.firebaseUser = decodedToken; // Also keep Firebase token data if needed
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ message: "رمز دخول غير صالح" });
  }
}

// Admin middleware that uses Firebase token verification
export function requireFirebaseAdmin(req: any, res: any, next: any) {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: "غير مصرح بالوصول - مطلوب صلاحيات إدارية" });
  }
  next();
}

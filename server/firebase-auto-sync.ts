import { storage as firebaseStorage } from "./firebase-storage";
import { dataLoader } from "./services/data-loader";

export class FirebaseAutoSync {
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      console.log("🔄 Checking Firebase collections...");
      
      // Check if Firebase has data, if not, seed it
      const [users, questions, categories, gamePackages, coupons] = await Promise.all([
        firebaseStorage.getAllUsers(),
        firebaseStorage.getAllQuestions(),
        firebaseStorage.getAllCategories(),
        firebaseStorage.getAllGamePackages(),
        firebaseStorage.getAllCoupons(),
      ]);

      // If any collection is empty, seed from configuration files
      if (users.length === 0 || questions.length === 0 || categories.length === 0) {
        console.log("📤 Firebase collections empty, seeding from configuration files...");
        await dataLoader.seedFirebaseData();
      } else {
        console.log("✅ Firebase collections already populated");
      }

      this.initialized = true;
    } catch (error) {
      console.error("❌ Firebase sync initialization failed:", error);
      // Continue with Firebase storage as fallback
    }
  }
}

export const firebaseAutoSync = new FirebaseAutoSync();
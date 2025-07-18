import { storage as firebaseStorage } from "./firebase-storage";
import { storage as tempStorage } from "./temp-storage";

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

      // If any collection is empty, seed from temp storage
      if (users.length === 0 || questions.length === 0 || categories.length === 0) {
        console.log("📤 Firebase collections empty, uploading initial data...");
        await this.seedFromTempStorage();
      } else {
        console.log("✅ Firebase collections already populated");
      }

      this.initialized = true;
    } catch (error) {
      console.error("❌ Firebase sync initialization failed:", error);
      // Continue with temp storage as fallback
    }
  }

  private async seedFromTempStorage(): Promise<void> {
    try {
      // Seed users
      const tempUsers = await tempStorage.getAllUsers();
      for (const user of tempUsers) {
        try {
          await firebaseStorage.createUser({
            email: user.email,
            password: user.password,
            name: user.name,
            availableGames: user.availableGames,
            isAdmin: user.isAdmin,
          });
        } catch (e) {
          console.log(`User ${user.email} might already exist`);
        }
      }

      // Seed categories
      const tempCategories = await tempStorage.getAllCategories();
      for (const category of tempCategories) {
        try {
          await firebaseStorage.createCategory({
            name: category.name,
            displayName: category.displayName,
            isActive: category.isActive,
          });
        } catch (e) {
          console.log(`Category ${category.name} might already exist`);
        }
      }

      // Seed questions
      const tempQuestions = await tempStorage.getAllQuestions();
      for (const question of tempQuestions) {
        try {
          await firebaseStorage.createQuestion({
            question: question.question,
            answer: question.answer,
            options: question.options,
            category: question.category,
            difficulty: question.difficulty,
            hint: question.hint,
            explanation: question.explanation,
            imageUrl: question.imageUrl,
          });
        } catch (e) {
          console.log(`Question might already exist`);
        }
      }

      // Seed game packages
      const tempPackages = await tempStorage.getAllGamePackages();
      for (const pkg of tempPackages) {
        try {
          await firebaseStorage.createGamePackage({
            name: pkg.name,
            description: pkg.description,
            gameCount: pkg.gameCount,
            price: pkg.price,
            isActive: pkg.isActive,
          });
        } catch (e) {
          console.log(`Package ${pkg.name} might already exist`);
        }
      }

      // Seed coupons
      const tempCoupons = await tempStorage.getAllCoupons();
      for (const coupon of tempCoupons) {
        try {
          await firebaseStorage.createCoupon({
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            expirationDate: coupon.expirationDate,
            maxUses: coupon.maxUses,
            isActive: coupon.isActive,
          });
        } catch (e) {
          console.log(`Coupon ${coupon.code} might already exist`);
        }
      }

      console.log("✅ Successfully seeded Firebase from temp storage");
    } catch (error) {
      console.error("❌ Error seeding Firebase:", error);
    }
  }
}

export const firebaseAutoSync = new FirebaseAutoSync();
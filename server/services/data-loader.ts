import { collection, addDoc, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";
import bcrypt from "bcryptjs";
import {
  loadCategories,
  loadQuestions,
  loadGamePackages,
  loadCoupons,
  loadAdminUser
} from "@shared/config";

export class DataLoaderService {
  /**
   * Load all initial data into Firebase from configuration files
   */
  async seedFirebaseData(): Promise<void> {
    try {
      console.log("🔄 Starting Firebase data seeding from configuration files...");

      await this.seedAdminUser();
      await this.seedCategories();
      await this.seedQuestions();
      await this.seedGamePackages();
      await this.seedCoupons();

      console.log("✅ Firebase data seeding completed successfully");
    } catch (error) {
      console.error("❌ Firebase seeding failed:", error);
      throw error;
    }
  }

  private async seedAdminUser(): Promise<void> {
    const adminData = loadAdminUser();
    const hashedPassword = await bcrypt.hash(adminData.password, 10);
    
    const adminUserRef = doc(db, "users", "admin-user-id");
    await setDoc(adminUserRef, {
      email: adminData.email,
      name: adminData.name,
      phoneNumber: adminData.phoneNumber,
      password: hashedPassword,
      availableGames: adminData.availableGames,
      isAdmin: adminData.isAdmin,
      createdAt: serverTimestamp(),
    });
    
    console.log("✓ Admin user created");
  }

  private async seedCategories(): Promise<void> {
    const categories = loadCategories();
    
    for (const category of categories) {
      await addDoc(collection(db, "categories"), {
        ...category,
        createdAt: serverTimestamp(),
      });
    }
    
    console.log(`✓ ${categories.length} categories seeded`);
  }

  private async seedQuestions(): Promise<void> {
    const questions = loadQuestions();
    
    for (const question of questions) {
      await addDoc(collection(db, "questions"), {
        ...question,
        createdAt: serverTimestamp(),
      });
    }
    
    console.log(`✓ ${questions.length} questions seeded`);
  }

  private async seedGamePackages(): Promise<void> {
    const packages = loadGamePackages();
    
    for (const gamePackage of packages) {
      await addDoc(collection(db, "gamePackages"), {
        name: gamePackage.name,
        description: gamePackage.description,
        gameCount: gamePackage.gameCount,
        priceInCents: gamePackage.priceInCents,
        sortOrder: gamePackage.sortOrder,
        isActive: gamePackage.isActive,
        createdAt: serverTimestamp(),
      });
    }
    
    console.log(`✓ ${packages.length} game packages seeded`);
  }

  private async seedCoupons(): Promise<void> {
    const coupons = loadCoupons();
    
    for (const coupon of coupons) {
      const expiresAt = new Date(Date.now() + coupon.daysFromNow * 24 * 60 * 60 * 1000);
      
      await addDoc(collection(db, "coupons"), {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        maxUsage: coupon.maxUsage,
        usageCount: coupon.usageCount,
        expiresAt: expiresAt,
        isActive: coupon.isActive,
        createdAt: serverTimestamp(),
      });
    }
    
    console.log(`✓ ${coupons.length} coupons seeded`);
  }
}

export const dataLoader = new DataLoaderService();
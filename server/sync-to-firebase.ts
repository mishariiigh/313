import { config } from "dotenv";
config();

import { loadQuestions, loadCategories, loadGamePackages, loadCoupons } from "@shared/config";
import { db } from "./firebase";
import { collection, addDoc, getDocs, query, where, writeBatch } from "firebase/firestore";
import bcrypt from "bcryptjs";

async function syncToFirebase() {
  console.log("🔄 Starting Firebase sync...");

  try {
    // 1. Create admin user
    const usersRef = collection(db, "users");
    const adminQuery = query(usersRef, where("email", "==", "mohammed@gmail.com"));
    const adminSnapshot = await getDocs(adminQuery);
    
    if (adminSnapshot.empty) {
      console.log("Creating admin user...");
      const hashedPassword = await bcrypt.hash("123456", 10);
      await addDoc(usersRef, {
        email: "mohammed@gmail.com",
        name: "محمد",
        phoneNumber: "+96512345678",
        password: hashedPassword,
        availableGames: 10,
        isAdmin: true,
        createdAt: new Date(),
      });
      console.log("✓ Admin user created");
    } else {
      console.log("✓ Admin user already exists");
    }

    // 2. Sync categories
    const categoriesRef = collection(db, "categories");
    const categoriesSnapshot = await getDocs(categoriesRef);
    
    if (categoriesSnapshot.empty) {
      console.log("Syncing categories...");
      const categories = loadCategories();
      for (const category of categories) {
        await addDoc(categoriesRef, {
          ...category,
          createdAt: new Date(),
        });
      }
      console.log(`✓ Synced ${categories.length} categories`);
    } else {
      console.log("✓ Categories already exist");
    }

    // 3. Sync questions
    const questionsRef = collection(db, "questions");
    const questionsSnapshot = await getDocs(questionsRef);
    
    if (questionsSnapshot.size < 38) {
      console.log("Syncing questions...");
      const questions = loadQuestions();
      let created = 0;
      
      for (const question of questions) {
        // Check if question already exists
        const existingQuery = query(questionsRef, where("question", "==", question.question));
        const existingSnapshot = await getDocs(existingQuery);
        
        if (existingSnapshot.empty) {
          await addDoc(questionsRef, {
            ...question,
            isPublished: true,
            createdAt: new Date(),
          });
          created++;
        }
      }
      console.log(`✓ Created ${created} new questions`);
    } else {
      console.log("✓ Questions already synced");
    }

    // 4. Sync game packages
    const packagesRef = collection(db, "gamePackages");
    const packagesSnapshot = await getDocs(packagesRef);
    
    if (packagesSnapshot.empty) {
      console.log("Syncing game packages...");
      const packages = loadGamePackages();
      for (const pkg of packages) {
        await addDoc(packagesRef, {
          ...pkg,
          createdAt: new Date(),
        });
      }
      console.log(`✓ Synced ${packages.length} game packages`);
    } else {
      console.log("✓ Game packages already exist");
    }

    // 5. Sync coupons
    const couponsRef = collection(db, "coupons");
    const couponsSnapshot = await getDocs(couponsRef);
    
    if (couponsSnapshot.empty) {
      console.log("Syncing coupons...");
      const coupons = loadCoupons();
      for (const coupon of coupons) {
        await addDoc(couponsRef, {
          ...coupon,
          usageCount: 0,
          expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
          createdAt: new Date(),
        });
      }
      console.log(`✓ Synced ${coupons.length} coupons`);
    } else {
      console.log("✓ Coupons already exist");
    }

    console.log("✅ Firebase sync complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error syncing to Firebase:", error);
    process.exit(1);
  }
}

// Run the sync
syncToFirebase();
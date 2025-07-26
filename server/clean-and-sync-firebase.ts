import { config } from "dotenv";
config();

import { loadQuestions, loadCategories } from "@shared/config";
import { db } from "./firebase";
import { collection, getDocs, deleteDoc, doc, addDoc, writeBatch } from "firebase/firestore";

async function cleanAndSyncFirebase() {
  console.log("🧹 Cleaning and syncing Firebase...");

  try {
    // 1. Delete all existing categories
    console.log("\n1. Deleting existing categories...");
    const categoriesRef = collection(db, "categories");
    const categoriesSnapshot = await getDocs(categoriesRef);
    
    const categoriesBatch = writeBatch(db);
    categoriesSnapshot.docs.forEach((doc) => {
      categoriesBatch.delete(doc.ref);
    });
    await categoriesBatch.commit();
    console.log(`✓ Deleted ${categoriesSnapshot.size} categories`);

    // 2. Delete all existing questions
    console.log("\n2. Deleting existing questions...");
    const questionsRef = collection(db, "questions");
    const questionsSnapshot = await getDocs(questionsRef);
    
    const questionsBatch = writeBatch(db);
    questionsSnapshot.docs.forEach((doc) => {
      questionsBatch.delete(doc.ref);
    });
    await questionsBatch.commit();
    console.log(`✓ Deleted ${questionsSnapshot.size} questions`);

    // 3. Add categories from config
    console.log("\n3. Adding categories from config...");
    const categories = loadCategories();
    for (const category of categories) {
      await addDoc(categoriesRef, {
        ...category,
        createdAt: new Date(),
      });
    }
    console.log(`✓ Added ${categories.length} categories`);

    // 4. Add questions from config
    console.log("\n4. Adding questions from config...");
    const questions = loadQuestions();
    let created = 0;
    
    for (const question of questions) {
      await addDoc(questionsRef, {
        ...question,
        isPublished: true,
        createdAt: new Date(),
      });
      created++;
      if (created % 10 === 0) {
        console.log(`  Added ${created}/${questions.length} questions...`);
      }
    }
    console.log(`✓ Added ${created} questions`);

    // 5. Verify the data
    console.log("\n5. Verifying data...");
    
    const newCategoriesSnapshot = await getDocs(categoriesRef);
    console.log("\nCategories in Firebase:");
    newCategoriesSnapshot.docs.forEach(doc => {
      const data = doc.data();
      console.log(`  - ${data.name} (${data.displayName})`);
    });

    const newQuestionsSnapshot = await getDocs(questionsRef);
    const byCategory = {};
    newQuestionsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      byCategory[data.category] = (byCategory[data.category] || 0) + 1;
    });
    
    console.log("\nQuestions by category:");
    Object.entries(byCategory).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count}`);
    });

    console.log("\n✅ Firebase clean and sync complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error cleaning/syncing Firebase:", error);
    process.exit(1);
  }
}

// Run the clean and sync
cleanAndSyncFirebase();
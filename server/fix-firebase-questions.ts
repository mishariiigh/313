import { config } from "dotenv";
config();

import { loadQuestions } from "@shared/config";
import { db } from "./firebase";
import { collection, getDocs, deleteDoc, doc, addDoc, writeBatch } from "firebase/firestore";

async function fixFirebaseQuestions() {
  console.log("🔧 Fixing Firebase questions...");

  try {
    // 1. Delete all existing questions
    console.log("Deleting old questions...");
    const questionsRef = collection(db, "questions");
    const snapshot = await getDocs(questionsRef);
    
    const batch = writeBatch(db);
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    console.log(`✓ Deleted ${snapshot.size} old questions`);

    // 2. Add questions from config
    console.log("Adding questions from config...");
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
    
    console.log(`✓ Added ${created} questions from config`);

    // 3. Verify the categories
    const newSnapshot = await getDocs(questionsRef);
    const byCategory = {};
    newSnapshot.docs.forEach(doc => {
      const data = doc.data();
      byCategory[data.category] = (byCategory[data.category] || 0) + 1;
    });
    
    console.log("\n✅ Questions by category:");
    Object.entries(byCategory).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error fixing questions:", error);
    process.exit(1);
  }
}

// Run the fix
fixFirebaseQuestions();
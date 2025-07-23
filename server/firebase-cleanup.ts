import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "./config/firebase";
import { storage as firebaseStorage } from "./firebase-storage";

export async function cleanupFirebaseData() {
  console.log("🧹 Starting Firebase cleanup...");
  
  try {
    // Get all categories
    const categoriesSnapshot = await getDocs(collection(db, "categories"));
    const categories = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    console.log(`Found ${categories.length} categories`);
    
    // Group by name to find duplicates
    const categoryGroups: { [key: string]: any[] } = {};
    categories.forEach(cat => {
      if (!categoryGroups[cat.name]) {
        categoryGroups[cat.name] = [];
      }
      categoryGroups[cat.name].push(cat);
    });
    
    // Keep only one of each category (the first one) and delete duplicates
    for (const [name, cats] of Object.entries(categoryGroups)) {
      if (cats.length > 1) {
        console.log(`Found ${cats.length} duplicates for ${name}, keeping first one`);
        // Delete all but the first
        for (let i = 1; i < cats.length; i++) {
          await deleteDoc(doc(db, "categories", cats[i].id));
          console.log(`Deleted duplicate category ${cats[i].id}`);
        }
      }
    }
    
    console.log("✅ Category cleanup complete");
    
    // Now check questions distribution
    const questions = await firebaseStorage.getAllQuestions();
    console.log(`Found ${questions.length} total questions`);
    
    const questionsByCategory: { [key: string]: any[] } = {};
    questions.forEach(q => {
      if (!questionsByCategory[q.category]) {
        questionsByCategory[q.category] = [];
      }
      questionsByCategory[q.category].push(q);
    });
    
    console.log("Questions per category:");
    Object.entries(questionsByCategory).forEach(([cat, qs]) => {
      console.log(`  ${cat}: ${qs.length} questions`);
    });
    
    return {
      totalCategories: Object.keys(categoryGroups).length,
      totalQuestions: questions.length,
      questionsByCategory
    };
    
  } catch (error) {
    console.error("❌ Cleanup error:", error);
    throw error;
  }
}
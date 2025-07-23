import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "./config/firebase";
import { storage as firebaseStorage } from "./firebase-storage";

export async function cleanupFirebaseData() {
  console.log("🧹 Starting thorough Firebase cleanup...");
  
  try {
    // First, clear ALL game sessions to remove cached data
    console.log("Step 1: Clearing all game sessions...");
    const gameSessionsSnapshot = await getDocs(collection(db, "gameSessions"));
    console.log(`Found ${gameSessionsSnapshot.size} game sessions to clear`);
    for (const gameDoc of gameSessionsSnapshot.docs) {
      await deleteDoc(doc(db, "gameSessions", gameDoc.id));
    }
    console.log("✅ All game sessions cleared");
    
    // Get all categories and analyze duplicates
    const categoriesSnapshot = await getDocs(collection(db, "categories"));
    const categories = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    console.log(`Step 2: Found ${categories.length} total categories`);
    
    // List all categories first
    console.log("All categories in database:");
    categories.forEach((cat, index) => {
      console.log(`  ${index + 1}. ID: ${cat.id} | Name: ${cat.name} | Display: ${cat.displayName}`);
    });
    
    // Group by name to find duplicates
    const categoryGroups: { [key: string]: any[] } = {};
    categories.forEach(cat => {
      if (!categoryGroups[cat.name]) {
        categoryGroups[cat.name] = [];
      }
      categoryGroups[cat.name].push(cat);
    });
    
    let duplicatesRemoved = 0;
    
    // Keep only one of each category (the first one) and delete duplicates
    for (const [name, cats] of Object.entries(categoryGroups)) {
      if (cats.length > 1) {
        console.log(`❌ DUPLICATE FOUND: ${name} has ${cats.length} copies`);
        // Delete all but the first
        for (let i = 1; i < cats.length; i++) {
          console.log(`  Deleting duplicate: ${cats[i].id} (${cats[i].displayName})`);
          await deleteDoc(doc(db, "categories", cats[i].id));
          duplicatesRemoved++;
        }
        console.log(`  ✅ Kept: ${cats[0].id} (${cats[0].displayName})`);
      } else {
        console.log(`✅ UNIQUE: ${name} - ${cats[0].displayName}`);
      }
    }
    
    console.log(`Step 3: Removed ${duplicatesRemoved} duplicate categories`);
    console.log(`Step 4: ${Object.keys(categoryGroups).length} unique categories remain`);
    
    // Verify final state
    const finalCategoriesSnapshot = await getDocs(collection(db, "categories"));
    console.log(`✅ Final verification: ${finalCategoriesSnapshot.size} categories in database`);
    
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
      duplicatesRemoved,
      totalQuestions: questions.length,
      questionsByCategory
    };
    
  } catch (error) {
    console.error("❌ Cleanup error:", error);
    throw error;
  }
}
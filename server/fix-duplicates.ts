import { collection, getDocs, deleteDoc, doc, writeBatch } from "firebase/firestore";
import { db } from "./config/firebase";

interface CategoryData {
  id: string;
  name: string;
  displayName: string;
  description: string;
  isActive: boolean;
}

export async function fixCategoryDuplicates(): Promise<void> {
  console.log("🔄 Starting category duplicate cleanup...");
  
  try {
    // Get all categories
    const snapshot = await getDocs(collection(db, "categories"));
    const categories: CategoryData[] = [];
    
    snapshot.docs.forEach((docSnapshot) => {
      categories.push({
        id: docSnapshot.id,
        ...docSnapshot.data()
      } as CategoryData);
    });
    
    console.log(`📊 Found ${categories.length} total categories`);
    
    // Group by name to find duplicates
    const categoryGroups = new Map<string, CategoryData[]>();
    
    categories.forEach((category) => {
      const name = category.name;
      if (!categoryGroups.has(name)) {
        categoryGroups.set(name, []);
      }
      categoryGroups.get(name)!.push(category);
    });
    
    // Identify and remove duplicates
    const batch = writeBatch(db);
    let deletedCount = 0;
    
    categoryGroups.forEach((group, name) => {
      if (group.length > 1) {
        console.log(`🔍 Found ${group.length} duplicates for category: ${name}`);
        
        // Keep the first one, delete the rest
        const toDelete = group.slice(1);
        toDelete.forEach((category) => {
          const docRef = doc(db, "categories", category.id);
          batch.delete(docRef);
          deletedCount++;
          console.log(`🗑️  Marking for deletion: ${category.displayName} (${category.id})`);
        });
      }
    });
    
    // Execute batch delete
    if (deletedCount > 0) {
      await batch.commit();
      console.log(`✅ Successfully deleted ${deletedCount} duplicate categories`);
    } else {
      console.log("✅ No duplicate categories found");
    }
    
    // Verify cleanup
    const verifySnapshot = await getDocs(collection(db, "categories"));
    console.log(`📊 Categories after cleanup: ${verifySnapshot.docs.length}`);
    
  } catch (error) {
    console.error("❌ Error during category cleanup:", error);
    throw error;
  }
}

export async function fixAllDuplicates(): Promise<{ deletedCategories: number; deletedQuestions: number }> {
  console.log("🧹 Starting complete duplicate cleanup...");
  
  let deletedCategories = 0;
  let deletedQuestions = 0;
  
  try {
    // Fix category duplicates
    const categoriesSnapshot = await getDocs(collection(db, "categories"));
    const categories: CategoryData[] = [];
    
    categoriesSnapshot.docs.forEach((docSnapshot) => {
      categories.push({
        id: docSnapshot.id,
        ...docSnapshot.data()
      } as CategoryData);
    });
    
    // Group categories by name
    const categoryGroups = new Map<string, CategoryData[]>();
    categories.forEach((category) => {
      const name = category.name;
      if (!categoryGroups.has(name)) {
        categoryGroups.set(name, []);
      }
      categoryGroups.get(name)!.push(category);
    });
    
    // Delete category duplicates
    const categoryBatch = writeBatch(db);
    categoryGroups.forEach((group, name) => {
      if (group.length > 1) {
        const toDelete = group.slice(1);
        toDelete.forEach((category) => {
          const docRef = doc(db, "categories", category.id);
          categoryBatch.delete(docRef);
          deletedCategories++;
        });
      }
    });
    
    if (deletedCategories > 0) {
      await categoryBatch.commit();
      console.log(`✅ Deleted ${deletedCategories} duplicate categories`);
    }
    
    // Fix question duplicates (by question text + category + difficulty)
    const questionsSnapshot = await getDocs(collection(db, "questions"));
    const questions: any[] = [];
    
    questionsSnapshot.docs.forEach((docSnapshot) => {
      questions.push({
        id: docSnapshot.id,
        ...docSnapshot.data()
      });
    });
    
    // Group questions by unique key
    const questionGroups = new Map<string, any[]>();
    questions.forEach((question) => {
      const key = `${question.question}|${question.category}|${question.difficulty}`;
      if (!questionGroups.has(key)) {
        questionGroups.set(key, []);
      }
      questionGroups.get(key)!.push(question);
    });
    
    // Delete question duplicates
    const questionBatch = writeBatch(db);
    questionGroups.forEach((group, key) => {
      if (group.length > 1) {
        const toDelete = group.slice(1);
        toDelete.forEach((question) => {
          const docRef = doc(db, "questions", question.id);
          questionBatch.delete(docRef);
          deletedQuestions++;
        });
      }
    });
    
    if (deletedQuestions > 0) {
      await questionBatch.commit();
      console.log(`✅ Deleted ${deletedQuestions} duplicate questions`);
    }
    
    return { deletedCategories, deletedQuestions };
    
  } catch (error) {
    console.error("❌ Error during duplicate cleanup:", error);
    throw error;
  }
}
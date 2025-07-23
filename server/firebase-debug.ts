import { storage as firebaseStorage } from "./firebase-storage";
import { storage as tempStorage } from "./temp-storage";

export async function debugFirebaseData() {
  console.log("=== FIREBASE DEBUG ===");
  
  try {
    // Check Firebase questions
    const firebaseQuestions = await firebaseStorage.getAllQuestions();
    console.log(`🔥 Firebase Questions: ${firebaseQuestions.length}`);
    
    // Check questions by category
    const categories = ["التاريخ", "الجغرافيا", "الدين", "الرياضة", "الثقافة العامة", "العلوم"];
    
    for (const category of categories) {
      const categoryQuestions = await firebaseStorage.getQuestionsByCategory(category);
      console.log(`📊 ${category}: ${categoryQuestions.length} questions`);
      
      if (categoryQuestions.length > 0) {
        const difficulties = categoryQuestions.reduce((acc, q) => {
          acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        console.log(`   Difficulties:`, difficulties);
      }
    }
    
    // Check temp storage for comparison
    const tempQuestions = await tempStorage.getAllQuestions();
    console.log(`💾 Temp Storage Questions: ${tempQuestions.length}`);
    
    for (const category of categories) {
      const categoryQuestions = await tempStorage.getQuestionsByCategory(category);
      console.log(`📊 TEMP ${category}: ${categoryQuestions.length} questions`);
    }
    
  } catch (error) {
    console.error("Debug error:", error);
  }
}
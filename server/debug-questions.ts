import { storage } from "./firebase-storage";

async function debugQuestions() {
  try {
    console.log("Checking question counts by category:");
    
    const categories = ['geography', 'history', 'religion', 'science', 'culture', 'me7gan'];
    
    for (const category of categories) {
      const questions = await storage.getQuestionsByCategory(category, 10);
      console.log(`${category}: ${questions.length} questions`);
      
      if (questions.length > 0) {
        console.log(`  Sample question: ${questions[0].question}`);
      }
    }
    
    // Check all questions
    const allQuestions = await storage.getAllQuestions();
    console.log(`\nTotal questions in database: ${allQuestions.length}`);
    
    const questionsByCategory: { [key: string]: number } = {};
    allQuestions.forEach(q => {
      questionsByCategory[q.category] = (questionsByCategory[q.category] || 0) + 1;
    });
    
    console.log("\nActual distribution:");
    Object.entries(questionsByCategory).forEach(([cat, count]) => {
      console.log(`${cat}: ${count}`);
    });
    
  } catch (error) {
    console.error("Error:", error);
  }
}

debugQuestions();
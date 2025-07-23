import { storage } from "./firebase-storage";
import { readFileSync } from "fs";
import { join } from "path";

async function forceReseed() {
  try {
    console.log("🧹 Clearing all questions from database...");
    
    // Clear all questions
    const allQuestions = await storage.getAllQuestions();
    console.log(`Found ${allQuestions.length} questions to delete`);
    
    for (const question of allQuestions) {
      await storage.deleteQuestion(question.id);
    }
    
    console.log("✅ All questions cleared");
    
    // Load fresh questions from JSON
    console.log("📥 Loading questions from JSON...");
    const questionsPath = join(process.cwd(), 'config', 'questions.json');
    const questionsData = readFileSync(questionsPath, 'utf-8');
    const questions = JSON.parse(questionsData);
    console.log(`Loaded ${questions.length} questions from JSON`);
    
    // Count by category
    const categoryCounts: { [key: string]: number } = {};
    questions.forEach(q => {
      categoryCounts[q.category] = (categoryCounts[q.category] || 0) + 1;
    });
    
    console.log("Categories in JSON:");
    Object.entries(categoryCounts).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count} questions`);
    });
    
    // Seed questions one by one
    console.log("\n💾 Adding questions to database...");
    for (const question of questions) {
      await storage.createQuestion(question);
    }
    
    console.log("✅ Questions seeded successfully");
    
    // Verify the result
    console.log("\n🔍 Verifying seeded questions...");
    const verifyQuestions = await storage.getAllQuestions();
    console.log(`Total questions in database: ${verifyQuestions.length}`);
    
    const verifyCategories: { [key: string]: number } = {};
    verifyQuestions.forEach(q => {
      verifyCategories[q.category] = (verifyCategories[q.category] || 0) + 1;
    });
    
    console.log("Final distribution:");
    Object.entries(verifyCategories).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count} questions`);
    });
    
  } catch (error) {
    console.error("❌ Error during force reseed:", error);
  }
}

forceReseed();
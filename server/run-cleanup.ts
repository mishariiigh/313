import { fixAllDuplicates } from "./fix-duplicates";

async function runCleanup() {
  try {
    console.log("🚀 Starting duplicate cleanup process...");
    const result = await fixAllDuplicates();
    console.log("🎉 Cleanup completed successfully:");
    console.log(`  - Deleted ${result.deletedCategories} duplicate categories`);
    console.log(`  - Deleted ${result.deletedQuestions} duplicate questions`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Cleanup failed:", error);
    process.exit(1);
  }
}

runCleanup();
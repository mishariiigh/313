import type { Express } from "express";
import { storage } from "./firebase-storage";

export function registerBulkAdminRoutes(app: Express): void {
  // Bulk create questions endpoint
  app.post("/api/admin/questions/bulk", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "غير مسجل الدخول" });
    }

    const user = req.user as any;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "غير مصرح بالوصول" });
    }

    try {
      const { category, questions } = req.body;

      if (!category || !questions || !Array.isArray(questions)) {
        return res.status(400).json({ message: "بيانات غير صحيحة" });
      }

      // Validate that category exists
      const categories = await storage.getAllCategories();
      const categoryExists = categories.some(cat => cat.name === category);
      
      if (!categoryExists) {
        return res.status(400).json({ message: "الفئة غير موجودة" });
      }

      // Filter out empty questions
      const validQuestions = questions.filter((q: any) => 
        q.question && q.question.trim() && 
        q.answer && q.answer.trim() &&
        q.difficulty && q.hint
      );

      if (validQuestions.length === 0) {
        return res.status(400).json({ message: "لا توجد أسئلة صحيحة للإضافة" });
      }

      // Create all questions
      const createdQuestions = [];
      for (const questionData of validQuestions) {
        try {
          const question = await storage.createQuestion({
            question: questionData.question.trim(),
            answer: questionData.answer.trim(),
            category: category,
            difficulty: questionData.difficulty,
            hint: questionData.hint.trim(),
            explanation: questionData.explanation || "",
            imageUrl: questionData.imageUrl || "",
            isPublished: true
          });
          createdQuestions.push(question);
        } catch (error) {
          console.error(`Failed to create question: ${questionData.question}`, error);
          // Continue with other questions
        }
      }

      console.log(`✅ Created ${createdQuestions.length} questions for category: ${category}`);

      res.json({
        success: true,
        count: createdQuestions.length,
        questions: createdQuestions,
        message: `تم إنشاء ${createdQuestions.length} أسئلة بنجاح`
      });

    } catch (error: any) {
      console.error("Bulk question creation error:", error);
      res.status(500).json({ 
        message: "خطأ في إنشاء الأسئلة", 
        error: error.message 
      });
    }
  });

  // Duplicate check endpoint
  app.post("/api/admin/questions/check-duplicates", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "غير مسجل الدخول" });
    }

    const user = req.user as any;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "غير مصرح بالوصول" });
    }

    try {
      const { category, questions } = req.body;

      // Get existing questions for the category
      const existingQuestions = await storage.getQuestionsByCategory(category);
      const existingTexts = existingQuestions.map(q => q.question.toLowerCase().trim());

      // Check for duplicates
      const duplicates = questions.filter((q: any) => 
        q.question && existingTexts.includes(q.question.toLowerCase().trim())
      );

      res.json({
        hasDuplicates: duplicates.length > 0,
        duplicates: duplicates.map((q: any) => q.question),
        existingCount: existingQuestions.length
      });

    } catch (error: any) {
      console.error("Duplicate check error:", error);
      res.status(500).json({ 
        message: "خطأ في فحص التكرار", 
        error: error.message 
      });
    }
  });
}
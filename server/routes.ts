import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { insertUserSchema, insertQuestionSchema, insertGameSessionSchema, insertCategorySchema, insertCouponSchema, insertGamePackageSchema } from "@shared/schema";
import { z } from "zod";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_...", {
  apiVersion: "2024-06-20" as any,
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint for Replit
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use(session({
    secret: process.env.SESSION_SECRET || "default-secret-key-for-development",
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: false, 
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true,
      sameSite: 'lax'
    },
    name: 'trivia.session'
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  // Passport configuration
  passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const user = await storage.getUserByEmail(email);
        if (!user) {
          return done(null, false, { message: 'البريد الإلكتروني غير صحيح' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return done(null, false, { message: 'كلمة المرور غير صحيحة' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, name } = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "المستخدم موجود بالفعل" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user with 2 free games
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        name,
        availableGames: 2,
        totalGames: 0,
        isAdmin: false,
      });

      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "خطأ في تسجيل الدخول" });
        }
        res.json({ user: { id: user.id, email: user.email, name: user.name, availableGames: user.availableGames, isAdmin: user.isAdmin } });
      });
    } catch (error) {
      res.status(400).json({ message: "خطأ في إنشاء الحساب" });
    }
  });

  app.post("/api/auth/login", passport.authenticate("local"), (req, res) => {
    const user = req.user as any;
    res.json({ user: { id: user.id, email: user.email, name: user.name, availableGames: user.availableGames, isAdmin: user.isAdmin } });
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "خطأ في تسجيل الخروج" });
      }
      res.json({ message: "تم تسجيل الخروج بنجاح" });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (req.isAuthenticated()) {
      const user = req.user as any;
      res.json({ user: { id: user.id, email: user.email, name: user.name, availableGames: user.availableGames, isAdmin: user.isAdmin } });
    } else {
      res.status(401).json({ message: "غير مسجل الدخول" });
    }
  });

  // Game routes
  app.post("/api/games/start", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "غير مسجل الدخول" });
    }

    const user = req.user as any;
    const { gameType = "single", teams = [], categories = [] } = req.body;
    
    if (user.availableGames <= 0) {
      return res.status(400).json({ message: "لا توجد ألعاب متاحة" });
    }

    try {
      // For team games, we need exactly 6 questions per category
      if (gameType === "team") {
        // Get all active categories from database
        const allCategories = await storage.getAllCategories();
        const activeCategories = allCategories.filter(cat => cat.isActive);
        
        // Validate that categories are provided
        if (!categories || categories.length === 0) {
          return res.status(400).json({ message: "يجب اختيار الفئات المطلوبة" });
        }
        
        // Use provided categories or default to all active categories
        const selectedCategories = categories.length > 0 ? categories : activeCategories.map(cat => cat.name);
        const requiredCategoriesCount = Math.min(6, activeCategories.length);
        
        // Validate that the required number of categories are selected
        if (selectedCategories.length !== requiredCategoriesCount) {
          return res.status(400).json({ message: `يجب اختيار ${requiredCategoriesCount} فئات` });
        }
        
        // Validate that provided categories exist in the database
        const validCategoryNames = activeCategories.map(cat => cat.name);
        const invalidCategories = selectedCategories.filter(cat => !validCategoryNames.includes(cat));
        if (invalidCategories.length > 0) {
          return res.status(400).json({ message: `فئات غير صحيحة: ${invalidCategories.join(', ')}` });
        }

        // Validate team names
        if (!teams || teams.length !== 2 || teams.some(team => !team || !team.trim())) {
          return res.status(400).json({ message: "يجب إدخال اسمين صحيحين للفريقين" });
        }

        const questionsByCategory: { [key: string]: any[] } = {};
        
        // Get 6 questions for each selected category
        for (const category of selectedCategories) {
          // Find the category in the database to get its display name
          const dbCategory = activeCategories.find(cat => cat.name === category);
          const categoryDisplayName = dbCategory ? dbCategory.displayName : category;
          
          const categoryQuestions = await storage.getQuestionsByCategory(categoryDisplayName, 6);
          if (categoryQuestions.length < 6) {
            console.log(`Only ${categoryQuestions.length} questions available for ${categoryDisplayName}, need 6`);
            return res.status(400).json({ message: `لا توجد أسئلة كافية في فئة ${categoryDisplayName}` });
          }
          
          // Ensure questions are properly ordered by difficulty for consistent scoring
          const orderedQuestions = categoryQuestions.sort((a, b) => {
            const difficultyOrder = { 'سهل': 1, 'متوسط': 2, 'صعب': 3 };
            return (difficultyOrder[a.difficulty] || 4) - (difficultyOrder[b.difficulty] || 4);
          });
          
          questionsByCategory[category] = orderedQuestions;
        }
        
        // Organize questions in the order they appear on the board
        const organizedQuestions = [];
        for (const category of selectedCategories) {
          organizedQuestions.push(...questionsByCategory[category]);
        }
        
        // Create game session with organized questions
        const gameSession = await storage.createGameSession({
          userId: user.id,
          questionIds: organizedQuestions.map(q => q.id),
          currentQuestionIndex: 0,
          score: 0,
          isCompleted: false,
          gameType,
          teams: gameType === "team" ? teams : [],
          teamScores: gameType === "team" ? teams.map(() => 0) : [],
          teamHintsUsed: gameType === "team" ? teams.map(() => false) : [],
          currentTurn: 0,
          usedQuestions: [],
          selectedCategories: gameType === "team" ? selectedCategories : [],
        });

        // Decrease available games
        await storage.updateUserGames(user.id, user.availableGames - 1);

        res.json({ 
          gameSession: {
            id: gameSession.id,
            currentQuestionIndex: gameSession.currentQuestionIndex,
            score: gameSession.score,
            totalQuestions: organizedQuestions.length,
            gameType: gameSession.gameType,
            teams: gameSession.teams,
            teamScores: gameSession.teamScores,
            currentTurn: gameSession.currentTurn,
          },
          currentQuestion: null
        });
        return;
      }
      
      // For single games, get random questions
      const questions = await storage.getRandomQuestions(36);
      if (questions.length < 36) {
        console.log(`Only ${questions.length} questions available, need 36`);
        return res.status(400).json({ message: "لا توجد أسئلة كافية في قاعدة البيانات" });
      }

      // Create game session
      const gameSession = await storage.createGameSession({
        userId: user.id,
        questionIds: questions.map(q => q.id),
        currentQuestionIndex: 0,
        score: 0,
        isCompleted: false,
        gameType,
        teams: gameType === "team" ? teams : [],
        teamScores: gameType === "team" ? teams.map(() => 0) : [],
        teamHintsUsed: gameType === "team" ? teams.map(() => false) : [],
        currentTurn: 0,
        usedQuestions: [],
      });

      // Decrease available games
      await storage.updateUserGames(user.id, user.availableGames - 1);

      res.json({ 
        gameSession: {
          id: gameSession.id,
          currentQuestionIndex: gameSession.currentQuestionIndex,
          score: gameSession.score,
          totalQuestions: questions.length,
          gameType: gameSession.gameType,
          teams: gameSession.teams,
          teamScores: gameSession.teamScores,
          currentTurn: gameSession.currentTurn,
        },
        currentQuestion: gameType === "single" ? questions[0] : null
      });
    } catch (error: any) {
      console.error("Start game error:", error);
      res.status(500).json({ message: "خطأ في بدء اللعبة: " + error.message });
    }
  });

  app.get("/api/games/history", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "غير مسجل الدخول" });
    }

    try {
      const user = req.user as any;
      const gameSessions = await storage.getUserGameSessions(user.id);
      res.json({ gameSessions: gameSessions.filter(session => session.isCompleted) });
    } catch (error: any) {
      console.error("Games history error:", error);
      res.status(500).json({ message: "خطأ في جلب سجل الألعاب: " + error.message });
    }
  });

  app.get("/api/games/active", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "غير مسجل الدخول" });
    }

    try {
      const user = req.user as any;
      const gameSessions = await storage.getUserGameSessions(user.id);
      const activeSession = gameSessions.find(session => !session.isCompleted);
      res.json({ activeSession: activeSession || null });
    } catch (error: any) {
      console.error("Active games error:", error);
      res.status(500).json({ message: "خطأ في جلب الألعاب النشطة: " + error.message });
    }
  });

  app.get("/api/games/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "غير مسجل الدخول" });
    }

    try {
      const gameSession = await storage.getGameSession(parseInt(req.params.id));
      if (!gameSession) {
        return res.status(404).json({ message: "جلسة اللعبة غير موجودة" });
      }

      const user = req.user as any;
      if (gameSession.userId !== user.id) {
        return res.status(403).json({ message: "غير مصرح بالوصول" });
      }

      // For team games, return all questions
      if (gameSession.gameType === "team") {
        const questions = await Promise.all(
          gameSession.questionIds.map(id => storage.getQuestionById(id))
        );
        return res.json({
          gameSession: {
            id: gameSession.id,
            currentQuestionIndex: gameSession.currentQuestionIndex,
            score: gameSession.score,
            totalQuestions: gameSession.questionIds.length,
            isCompleted: gameSession.isCompleted,
            gameType: gameSession.gameType,
            teams: gameSession.teams,
            teamScores: gameSession.teamScores,
            currentTurn: gameSession.currentTurn,
            usedQuestions: gameSession.usedQuestions,
            usedHints: gameSession.usedHints,
            teamHintsUsed: gameSession.teamHintsUsed,
            selectedCategories: gameSession.selectedCategories,
          },
          questions: questions,
        });
      }

      // For single games, return current question
      const questionId = gameSession.questionIds[gameSession.currentQuestionIndex];
      const question = await storage.getQuestionById(questionId);

      res.json({ 
        gameSession: {
          id: gameSession.id,
          currentQuestionIndex: gameSession.currentQuestionIndex,
          score: gameSession.score,
          totalQuestions: gameSession.questionIds.length,
          isCompleted: gameSession.isCompleted,
          gameType: gameSession.gameType,
        },
        currentQuestion: question 
      });
    } catch (error) {
      res.status(500).json({ message: "خطأ في جلب بيانات اللعبة" });
    }
  });

  // Complete game endpoint
  app.post("/api/games/:id/complete", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "غير مسجل الدخول" });
    }

    try {
      const gameSession = await storage.getGameSession(parseInt(req.params.id));
      if (!gameSession) {
        return res.status(404).json({ message: "جلسة اللعبة غير موجودة" });
      }

      const user = req.user as any;
      if (gameSession.userId !== user.id) {
        return res.status(403).json({ message: "غير مصرح بالوصول" });
      }

      // Mark game as completed
      await storage.updateGameSession(gameSession.id, {
        isCompleted: true,
      });

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "خطأ في إنهاء اللعبة" });
    }
  });

  // Team game endpoints
  app.post("/api/games/:id/team-correct", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "غير مسجل الدخول" });
    }

    try {
      const gameSession = await storage.getGameSession(parseInt(req.params.id));
      if (!gameSession) {
        return res.status(404).json({ message: "جلسة اللعبة غير موجودة" });
      }

      const user = req.user as any;
      if (gameSession.userId !== user.id) {
        return res.status(403).json({ message: "غير مصرح بالوصول" });
      }

      const { teamIndex, questionKey } = req.body;
      
      // Calculate points based on question difficulty
      const [, questionIndex] = questionKey.split('-');
      const index = parseInt(questionIndex);
      const points = index < 2 ? 200 : index < 4 ? 400 : 600;
      
      // Update team score
      const newTeamScores = [...gameSession.teamScores];
      newTeamScores[teamIndex] = (newTeamScores[teamIndex] || 0) + points;
      
      // Mark question as used
      const newUsedQuestions = [...(gameSession.usedQuestions || []), questionKey];
      
      // Move to next team's turn
      const newCurrentTurn = (gameSession.currentTurn + 1) % gameSession.teams.length;
      
      await storage.updateGameSession(gameSession.id, {
        teamScores: newTeamScores,
        usedQuestions: newUsedQuestions,
        currentTurn: newCurrentTurn,
      });

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "خطأ في تسجيل النقطة" });
    }
  });

  app.post("/api/games/:id/skip-question", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "غير مسجل الدخول" });
    }

    try {
      const gameSession = await storage.getGameSession(parseInt(req.params.id));
      if (!gameSession) {
        return res.status(404).json({ message: "جلسة اللعبة غير موجودة" });
      }

      const user = req.user as any;
      if (gameSession.userId !== user.id) {
        return res.status(403).json({ message: "غير مصرح بالوصول" });
      }

      const { questionKey } = req.body;
      
      // Mark question as used (without scoring)
      const newUsedQuestions = [...(gameSession.usedQuestions || []), questionKey];
      
      // Move to next team's turn
      const newCurrentTurn = (gameSession.currentTurn + 1) % gameSession.teams.length;
      
      await storage.updateGameSession(gameSession.id, {
        usedQuestions: newUsedQuestions,
        currentTurn: newCurrentTurn,
      });

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "خطأ في تخطي السؤال" });
    }
  });

  // Use hint for a question
  app.post("/api/games/:id/use-hint", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "غير مسجل الدخول" });
    }

    try {
      const gameSession = await storage.getGameSession(parseInt(req.params.id));
      if (!gameSession) {
        return res.status(404).json({ message: "جلسة اللعبة غير موجودة" });
      }

      const user = req.user as any;
      if (gameSession.userId !== user.id) {
        return res.status(403).json({ message: "غير مصرح بالوصول" });
      }

      const { questionKey, teamIndex } = req.body;
      
      // For team games, check if this team has already used their hint
      if (gameSession.gameType === "team") {
        const teamHintsUsed = gameSession.teamHintsUsed || [];
        if (teamHintsUsed[teamIndex]) {
          return res.status(400).json({ message: "هذا الفريق استخدم التلميح بالفعل" });
        }
        
        // Mark this team as having used their hint
        const newTeamHintsUsed = [...teamHintsUsed];
        newTeamHintsUsed[teamIndex] = true;
        
        // Also track the question for display purposes
        const newUsedHints = [...(gameSession.usedHints || []), questionKey];
        
        await storage.updateGameSession(gameSession.id, {
          usedHints: newUsedHints,
          teamHintsUsed: newTeamHintsUsed,
        });
      } else {
        // For single games, check if hint already used for this question
        if (gameSession.usedHints?.includes(questionKey)) {
          return res.status(400).json({ message: "تم استخدام التلميح لهذا السؤال من قبل" });
        }
        
        // Mark hint as used
        const newUsedHints = [...(gameSession.usedHints || []), questionKey];
        
        await storage.updateGameSession(gameSession.id, {
          usedHints: newUsedHints,
        });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Use hint error:", error);
      res.status(500).json({ message: "خطأ في استخدام التلميح: " + error.message });
    }
  });

  // Switch team turn
  app.post("/api/games/:id/switch-turn", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "غير مسجل الدخول" });
    }

    try {
      const gameSession = await storage.getGameSession(parseInt(req.params.id));
      if (!gameSession) {
        return res.status(404).json({ message: "جلسة اللعبة غير موجودة" });
      }

      const user = req.user as any;
      if (gameSession.userId !== user.id) {
        return res.status(403).json({ message: "غير مصرح بالوصول" });
      }

      // Switch to next team's turn
      const newCurrentTurn = (gameSession.currentTurn + 1) % gameSession.teams.length;
      
      await storage.updateGameSession(gameSession.id, {
        currentTurn: newCurrentTurn,
      });

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "خطأ في تبديل الدور" });
    }
  });

  // Adjust team score
  app.post("/api/games/:id/adjust-score", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "غير مسجل الدخول" });
    }

    try {
      const gameSession = await storage.getGameSession(parseInt(req.params.id));
      if (!gameSession) {
        return res.status(404).json({ message: "جلسة اللعبة غير موجودة" });
      }

      const user = req.user as any;
      if (gameSession.userId !== user.id) {
        return res.status(403).json({ message: "غير مصرح بالوصول" });
      }

      const { teamIndex, scoreChange } = req.body;
      
      // Validate team index
      if (teamIndex < 0 || teamIndex >= gameSession.teams.length) {
        return res.status(400).json({ message: "رقم الفريق غير صحيح" });
      }
      
      // Update team score
      const newTeamScores = [...gameSession.teamScores];
      newTeamScores[teamIndex] = Math.max(0, (newTeamScores[teamIndex] || 0) + scoreChange);
      
      await storage.updateGameSession(gameSession.id, {
        teamScores: newTeamScores,
      });

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "خطأ في تعديل النقاط" });
    }
  });

  app.post("/api/games/:id/next", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "غير مسجل الدخول" });
    }

    try {
      const gameSession = await storage.getGameSession(parseInt(req.params.id));
      if (!gameSession) {
        return res.status(404).json({ message: "جلسة اللعبة غير موجودة" });
      }

      const user = req.user as any;
      if (gameSession.userId !== user.id) {
        return res.status(403).json({ message: "غير مصرح بالوصول" });
      }

      const { answered } = req.body;
      const newScore = answered ? gameSession.score + 1 : gameSession.score;
      const newIndex = gameSession.currentQuestionIndex + 1;
      const isCompleted = newIndex >= gameSession.questionIds.length;

      await storage.updateGameSession(gameSession.id, {
        currentQuestionIndex: newIndex,
        score: newScore,
        isCompleted,
        completedAt: isCompleted ? new Date() : undefined,
      });

      if (isCompleted) {
        return res.json({ 
          gameSession: {
            id: gameSession.id,
            currentQuestionIndex: newIndex,
            score: newScore,
            totalQuestions: gameSession.questionIds.length,
            isCompleted: true,
          },
          completed: true 
        });
      }

      // Get next question
      const questionId = gameSession.questionIds[newIndex];
      const question = await storage.getQuestionById(questionId);

      res.json({ 
        gameSession: {
          id: gameSession.id,
          currentQuestionIndex: newIndex,
          score: newScore,
          totalQuestions: gameSession.questionIds.length,
          isCompleted: false,
        },
        currentQuestion: question 
      });
    } catch (error) {
      res.status(500).json({ message: "خطأ في الانتقال للسؤال التالي" });
    }
  });

  // Simple add games route for testing (bypasses payment)
  app.post("/api/add-games", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "غير مسجل الدخول" });
    }

    try {
      const { gameCount } = req.body;
      const user = req.user as any;
      
      // Add games to user account
      await storage.updateUserGames(user.id, user.availableGames + gameCount);
      
      res.json({ success: true, message: "تم إضافة الألعاب بنجاح" });
    } catch (error: any) {
      console.error("Add games error:", error);
      res.status(500).json({ message: "خطأ في إضافة الألعاب: " + error.message });
    }
  });

  // Payment routes - Mock for testing
  app.post("/api/create-payment-intent", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "غير مسجل الدخول" });
    }

    try {
      const { gameCount } = req.body;
      
      // Create a mock client secret for testing
      const mockClientSecret = `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`;
      
      res.json({ clientSecret: mockClientSecret });
    } catch (error: any) {
      console.error("Payment intent error:", error);
      res.status(500).json({ message: "خطأ في إنشاء الدفعة: " + error.message });
    }
  });

  app.post("/api/confirm-payment", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "غير مسجل الدخول" });
    }

    try {
      const { paymentIntentId } = req.body;
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status === "succeeded") {
        const user = req.user as any;
        const gameCount = parseInt(paymentIntent.metadata.gameCount);
        
        // Create purchase record
        await storage.createPurchase({
          userId: user.id,
          gameCount,
          amount: paymentIntent.amount,
          stripePaymentIntentId: paymentIntentId,
        });

        // Update user's available games
        const updatedUser = await storage.updateUserGames(user.id, user.availableGames + gameCount);
        
        res.json({ 
          success: true, 
          availableGames: updatedUser.availableGames 
        });
      } else {
        res.status(400).json({ message: "فشل في الدفع" });
      }
    } catch (error: any) {
      res.status(500).json({ message: "خطأ في تأكيد الدفع: " + error.message });
    }
  });

  // Admin routes
  app.get("/api/admin/stats", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "غير مسجل الدخول" });
    }

    const user = req.user as any;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "غير مصرح بالوصول" });
    }

    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "خطأ في جلب الإحصائيات" });
    }
  });

  app.get("/api/admin/sales-analytics", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "غير مسجل الدخول" });
    }

    const user = req.user as any;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "غير مصرح بالوصول" });
    }

    try {
      const analytics = await storage.getSalesAnalytics();
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "خطأ في جلب تحليلات المبيعات" });
    }
  });

  app.get("/api/admin/questions", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "غير مسجل الدخول" });
    }

    const user = req.user as any;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "غير مصرح بالوصول" });
    }

    try {
      const { category, difficulty } = req.query;
      const questions = await storage.getQuestions(category as string, difficulty as string);
      res.json({ questions });
    } catch (error) {
      res.status(500).json({ message: "خطأ في جلب الأسئلة" });
    }
  });

  app.post("/api/admin/questions", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "غير مسجل الدخول" });
    }

    const user = req.user as any;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "غير مصرح بالوصول" });
    }

    try {
      const questionData = insertQuestionSchema.parse(req.body);
      
      // Check if category/difficulty combination has reached the limit (2 questions max)
      const existingQuestions = await storage.getQuestions(questionData.category, questionData.difficulty);
      if (existingQuestions.length >= 2) {
        return res.status(400).json({ 
          message: `تم الوصول للحد الأقصى من الأسئلة لهذه الفئة والصعوبة (2/2). لا يمكن إضافة المزيد من الأسئلة.` 
        });
      }
      
      // Validate that hint is provided
      if (!questionData.hint || questionData.hint.trim() === '') {
        return res.status(400).json({ 
          message: "التلميح مطلوب لكل سؤال" 
        });
      }
      
      const question = await storage.createQuestion(questionData);
      res.json({ question });
    } catch (error: any) {
      res.status(400).json({ message: "خطأ في إضافة السؤال: " + error.message });
    }
  });

  app.put("/api/admin/questions/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "غير مسجل الدخول" });
    }

    const user = req.user as any;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "غير مصرح بالوصول" });
    }

    try {
      const questionData = insertQuestionSchema.partial().parse(req.body);
      const question = await storage.updateQuestion(parseInt(req.params.id), questionData);
      res.json({ question });
    } catch (error) {
      res.status(400).json({ message: "خطأ في تحديث السؤال" });
    }
  });

  app.delete("/api/admin/questions/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "غير مسجل الدخول" });
    }

    const user = req.user as any;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "غير مصرح بالوصول" });
    }

    try {
      await storage.deleteQuestion(parseInt(req.params.id));
      res.json({ message: "تم حذف السؤال بنجاح" });
    } catch (error) {
      res.status(500).json({ message: "خطأ في حذف السؤال" });
    }
  });

  // Publish all questions
  app.post("/api/admin/questions/publish", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "غير مسجل الدخول" });
    }

    const user = req.user as any;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "غير مصرح بالوصول" });
    }

    try {
      await storage.publishAllQuestions();
      res.json({ message: "تم نشر جميع الأسئلة بنجاح" });
    } catch (error) {
      res.status(500).json({ message: "خطأ في نشر الأسئلة" });
    }
  });

  // Unpublish all questions
  app.post("/api/admin/questions/unpublish", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "غير مسجل الدخول" });
    }

    const user = req.user as any;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "غير مصرح بالوصول" });
    }

    try {
      await storage.unpublishAllQuestions();
      res.json({ message: "تم إلغاء نشر جميع الأسئلة بنجاح" });
    } catch (error) {
      res.status(500).json({ message: "خطأ في إلغاء نشر الأسئلة" });
    }
  });

  // Categories routes
  app.get("/api/categories", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "غير مسجل الدخول" });
    }

    try {
      const categories = await storage.getAllCategories();
      // Filter only active categories for users
      const activeCategories = categories.filter(category => category.isActive);
      res.json({ categories: activeCategories });
    } catch (error) {
      res.status(500).json({ message: "خطأ في جلب الفئات" });
    }
  });

  app.get("/api/admin/categories", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "غير مسجل الدخول" });
    }

    const user = req.user as any;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "غير مصرح بالوصول" });
    }

    try {
      const categories = await storage.getAllCategories();
      res.json({ categories });
    } catch (error) {
      res.status(500).json({ message: "خطأ في جلب الفئات" });
    }
  });

  app.post("/api/admin/categories", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "غير مسجل الدخول" });
    }

    const user = req.user as any;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "غير مصرح بالوصول" });
    }

    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.json({ category });
    } catch (error) {
      res.status(400).json({ message: "خطأ في إنشاء الفئة" });
    }
  });

  app.put("/api/admin/categories/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "غير مسجل الدخول" });
    }

    const user = req.user as any;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "غير مصرح بالوصول" });
    }

    try {
      const categoryData = insertCategorySchema.partial().parse(req.body);
      const category = await storage.updateCategory(parseInt(req.params.id), categoryData);
      res.json({ category });
    } catch (error) {
      res.status(400).json({ message: "خطأ في تحديث الفئة" });
    }
  });

  app.delete("/api/admin/categories/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "غير مسجل الدخول" });
    }

    const user = req.user as any;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "غير مصرح بالوصول" });
    }

    try {
      await storage.deleteCategory(parseInt(req.params.id));
      res.json({ message: "تم حذف الفئة بنجاح" });
    } catch (error) {
      res.status(500).json({ message: "خطأ في حذف الفئة" });
    }
  });

  // Coupons routes
  app.get("/api/admin/coupons", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "غير مسجل الدخول" });
    }

    const user = req.user as any;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "غير مصرح بالوصول" });
    }

    try {
      const coupons = await storage.getAllCoupons();
      res.json({ coupons });
    } catch (error) {
      res.status(500).json({ message: "خطأ في جلب الكوبونات" });
    }
  });

  app.post("/api/admin/coupons", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "غير مسجل الدخول" });
    }

    const user = req.user as any;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "غير مصرح بالوصول" });
    }

    try {
      const couponData = insertCouponSchema.parse(req.body);
      const coupon = await storage.createCoupon(couponData);
      res.json({ coupon });
    } catch (error) {
      res.status(400).json({ message: "خطأ في إنشاء الكوبون" });
    }
  });

  app.put("/api/admin/coupons/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "غير مسجل الدخول" });
    }

    const user = req.user as any;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "غير مصرح بالوصول" });
    }

    try {
      const couponData = insertCouponSchema.partial().parse(req.body);
      const coupon = await storage.updateCoupon(parseInt(req.params.id), couponData);
      res.json({ coupon });
    } catch (error) {
      res.status(400).json({ message: "خطأ في تحديث الكوبون" });
    }
  });

  // Coupon validation route
  app.post("/api/validate-coupon", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "غير مسجل الدخول" });
    }

    try {
      const { code } = req.body;
      const coupon = await storage.getCouponByCode(code);
      
      if (!coupon) {
        return res.status(404).json({ message: "كوبون غير صحيح" });
      }

      if (!coupon.isActive) {
        return res.status(400).json({ message: "كوبون غير نشط" });
      }

      if (coupon.expiresAt && new Date() > new Date(coupon.expiresAt)) {
        return res.status(400).json({ message: "كوبون منتهي الصلاحية" });
      }

      if (coupon.maxUsage && coupon.usageCount >= coupon.maxUsage) {
        return res.status(400).json({ message: "تم استنفاد استخدامات الكوبون" });
      }

      res.json({ 
        valid: true, 
        coupon: {
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
        }
      });
    } catch (error) {
      res.status(500).json({ message: "خطأ في التحقق من الكوبون" });
    }
  });

  // Game packages routes
  app.get("/api/game-packages", async (req, res) => {
    try {
      const packages = await storage.getActiveGamePackages();
      res.json({ packages });
    } catch (error) {
      res.status(500).json({ message: "خطأ في جلب باقات الألعاب" });
    }
  });

  // Admin Game Packages routes
  app.get("/api/admin/game-packages", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "غير مسجل الدخول" });
    }

    const user = req.user as any;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "غير مصرح بالوصول" });
    }

    try {
      const packages = await storage.getAllGamePackages();
      res.json({ packages });
    } catch (error) {
      res.status(500).json({ message: "خطأ في جلب باقات الألعاب" });
    }
  });

  app.post("/api/admin/game-packages", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "غير مسجل الدخول" });
    }

    const user = req.user as any;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "غير مصرح بالوصول" });
    }

    try {
      const packageData = insertGamePackageSchema.parse(req.body);
      const gamePackage = await storage.createGamePackage(packageData);
      res.json({ package: gamePackage });
    } catch (error) {
      res.status(400).json({ message: "خطأ في إنشاء باقة الألعاب" });
    }
  });

  app.put("/api/admin/game-packages/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "غير مسجل الدخول" });
    }

    const user = req.user as any;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "غير مصرح بالوصول" });
    }

    try {
      const packageData = insertGamePackageSchema.partial().parse(req.body);
      const gamePackage = await storage.updateGamePackage(parseInt(req.params.id), packageData);
      res.json({ package: gamePackage });
    } catch (error) {
      res.status(400).json({ message: "خطأ في تحديث باقة الألعاب" });
    }
  });

  app.delete("/api/admin/game-packages/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "غير مسجل الدخول" });
    }

    const user = req.user as any;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "غير مصرح بالوصول" });
    }

    try {
      await storage.deleteGamePackage(parseInt(req.params.id));
      res.json({ message: "تم حذف باقة الألعاب بنجاح" });
    } catch (error) {
      res.status(500).json({ message: "خطأ في حذف باقة الألعاب" });
    }
  });

  // User management routes
  app.get("/api/admin/users", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "غير مسجل الدخول" });
    }

    const user = req.user as any;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "غير مصرح بالوصول" });
    }

    try {
      const users = await storage.getAllUsers();
      res.json({ users });
    } catch (error) {
      res.status(500).json({ message: "خطأ في جلب المستخدمين" });
    }
  });

  app.post("/api/admin/users", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "غير مسجل الدخول" });
    }

    const user = req.user as any;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "غير مصرح بالوصول" });
    }

    try {
      const { email, name, password, availableGames = 0, isAdmin = false } = req.body;
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "المستخدم موجود بالفعل" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const userData = insertUserSchema.parse({
        email,
        name,
        password: hashedPassword,
        availableGames,
        isAdmin
      });
      
      const newUser = await storage.createUser(userData);
      res.json({ user: newUser });
    } catch (error: any) {
      res.status(400).json({ message: "خطأ في إنشاء المستخدم: " + error.message });
    }
  });

  app.put("/api/admin/users/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "غير مسجل الدخول" });
    }

    const user = req.user as any;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "غير مصرح بالوصول" });
    }

    try {
      const userId = parseInt(req.params.id);
      const { email, name, password, availableGames, isAdmin } = req.body;
      
      // Don't allow admin to modify their own admin status
      if (userId === user.id && isAdmin !== undefined) {
        return res.status(400).json({ message: "لا يمكن تعديل صلاحيات المدير الخاص بك" });
      }

      const updates: Partial<InsertUser> = {};
      
      if (email !== undefined) updates.email = email;
      if (name !== undefined) updates.name = name;
      if (availableGames !== undefined) updates.availableGames = availableGames;
      if (isAdmin !== undefined) updates.isAdmin = isAdmin;
      
      // Hash password if provided
      if (password && password.trim() !== "") {
        updates.password = await bcrypt.hash(password, 10);
      }
      
      const updatedUser = await storage.updateUser(userId, updates);
      res.json({ user: updatedUser });
    } catch (error: any) {
      res.status(400).json({ message: "خطأ في تحديث المستخدم: " + error.message });
    }
  });

  app.delete("/api/admin/users/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "غير مسجل الدخول" });
    }

    const user = req.user as any;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "غير مصرح بالوصول" });
    }

    try {
      const userId = parseInt(req.params.id);
      
      // Don't allow admin to delete themselves
      if (userId === user.id) {
        return res.status(400).json({ message: "لا يمكن حذف حسابك الخاص" });
      }

      await storage.deleteUser(userId);
      res.json({ message: "تم حذف المستخدم بنجاح" });
    } catch (error: any) {
      res.status(500).json({ message: "خطأ في حذف المستخدم: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

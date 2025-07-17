import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { insertUserSchema, insertQuestionSchema, insertGameSessionSchema } from "@shared/schema";
import { z } from "zod";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_...", {
  apiVersion: "2024-06-20" as any,
});

export async function registerRoutes(app: Express): Promise<Server> {
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
    const { gameType = "single", teams = [] } = req.body;
    
    if (user.availableGames <= 0) {
      return res.status(400).json({ message: "لا توجد ألعاب متاحة" });
    }

    try {
      // For team games, we need exactly 6 questions per category (6 categories × 6 questions = 36 total)
      if (gameType === "team") {
        const categories = ["التاريخ", "الجغرافيا", "الثقافة العامة", "الرياضة", "الدين", "العلوم"];
        const questionsByCategory: { [key: string]: any[] } = {};
        
        // Get 6 questions for each category
        for (const category of categories) {
          const categoryQuestions = await storage.getQuestionsByCategory(category, 6);
          if (categoryQuestions.length < 6) {
            console.log(`Only ${categoryQuestions.length} questions available for ${category}, need 6`);
            return res.status(400).json({ message: `لا توجد أسئلة كافية في فئة ${category}` });
          }
          questionsByCategory[category] = categoryQuestions;
        }
        
        // Organize questions in the order they appear on the board
        const organizedQuestions = [];
        for (const category of categories) {
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
      res.status(500).json({ message: "خطأ في استخدام التلميح" });
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
      const question = await storage.createQuestion(questionData);
      res.json({ question });
    } catch (error) {
      res.status(400).json({ message: "خطأ في إضافة السؤال" });
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

  const httpServer = createServer(app);
  return httpServer;
}

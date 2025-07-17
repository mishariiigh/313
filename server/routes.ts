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
    secret: process.env.SESSION_SECRET || "default-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
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
    if (user.availableGames <= 0) {
      return res.status(400).json({ message: "لا توجد ألعاب متاحة" });
    }

    try {
      // Get 36 random questions  
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
      });

      // Decrease available games
      await storage.updateUserGames(user.id, user.availableGames - 1);

      res.json({ 
        gameSession: {
          id: gameSession.id,
          currentQuestionIndex: gameSession.currentQuestionIndex,
          score: gameSession.score,
          totalQuestions: questions.length,
        },
        currentQuestion: questions[0] 
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

      // Get current question
      const questionId = gameSession.questionIds[gameSession.currentQuestionIndex];
      const question = await storage.getQuestionById(questionId);

      res.json({ 
        gameSession: {
          id: gameSession.id,
          currentQuestionIndex: gameSession.currentQuestionIndex,
          score: gameSession.score,
          totalQuestions: gameSession.questionIds.length,
          isCompleted: gameSession.isCompleted,
        },
        currentQuestion: question 
      });
    } catch (error) {
      res.status(500).json({ message: "خطأ في جلب بيانات اللعبة" });
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

  // Payment routes
  app.post("/api/create-payment-intent", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "غير مسجل الدخول" });
    }

    try {
      const { gameCount } = req.body;
      let amount;
      
      if (gameCount === 1) {
        amount = 199; // $1.99 in cents
      } else if (gameCount === 5) {
        amount = 899; // $8.99 in cents
      } else {
        return res.status(400).json({ message: "عدد الألعاب غير صحيح" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
        metadata: {
          userId: (req.user as any).id,
          gameCount,
        },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
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

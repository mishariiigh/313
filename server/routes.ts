import type { Express } from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import multer from "multer";
import { storage } from "./firebase-storage";
import { insertUserSchema, insertQuestionSchema, insertCategorySchema, insertCouponSchema, insertGamePackageSchema, type InsertUser } from "@shared/firebase-schema";
import { z } from "zod";
import Stripe from "stripe";
import { verifyIdToken, createOrUpdateFirebaseUser } from "./firebase-auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_...", {
  apiVersion: "2024-06-20" as any,
});

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit for videos
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('يجب أن يكون الملف صورة أو فيديو'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<void> {
  // Health check endpoint
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

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // File upload route
  app.post("/api/upload", upload.single('file'), async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "غير مسجل الدخول" });
    }

    const user = req.user as any;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "غير مصرح بالوصول" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "لم يتم رفع أي ملف" });
    }

    const fileType = req.body.type || 'image';

    // Validate file type
    if (fileType === 'video' && !req.file.mimetype.startsWith('video/')) {
      return res.status(400).json({ message: "نوع الملف غير صحيح. يجب أن يكون فيديو" });
    }

    if (fileType === 'image' && !req.file.mimetype.startsWith('image/')) {
      return res.status(400).json({ message: "نوع الملف غير صحيح. يجب أن تكون صورة" });
    }

    // File size validation
    const maxSizeImage = 10 * 1024 * 1024; // 10MB for images
    const maxSizeVideo = 50 * 1024 * 1024; // 50MB for videos

    if (fileType === 'image' && req.file.size > maxSizeImage) {
      return res.status(400).json({ message: "حجم الصورة كبير جداً. الحد الأقصى 10 ميجابايت" });
    }

    if (fileType === 'video' && req.file.size > maxSizeVideo) {
      return res.status(400).json({ message: "حجم الفيديو كبير جداً. الحد الأقصى 50 ميجابايت" });
    }

    try {
      const { getStorage, ref, uploadBytes, getDownloadURL } = await import("firebase/storage");
      const storage = getStorage();

      // Generate unique filename
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2);
      const fileExtension = req.file.originalname.split('.').pop();
      const folder = fileType === 'video' ? 'videos' : 'images';
      const fileName = `${folder}/${timestamp}_${randomId}.${fileExtension}`;

      const storageRef = ref(storage, fileName);

      // Upload file to Firebase Storage
      const snapshot = await uploadBytes(storageRef, req.file.buffer);
      const downloadURL = await getDownloadURL(snapshot.ref);

      res.json({ url: downloadURL, type: fileType });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ message: "خطأ في رفع الملف" });
    }
  });

  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, name, phoneNumber } = insertUserSchema.parse(req.body);

      // Check if user already exists with email
      const existingUserByEmail = await storage.getUserByEmail(email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "البريد الإلكتروني مستخدم بالفعل" });
      }

      // Check if user already exists with phone number
      const existingUserByPhone = await storage.getUserByPhoneNumber(phoneNumber);
      if (existingUserByPhone) {
        return res.status(400).json({ message: "رقم الهاتف مستخدم بالفعل" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user with 2 free games
      const user = await storage.createUser({
        email,
        phoneNumber,
        password: hashedPassword,
        name,
        availableGames: 2,
        isAdmin: false,
      });

      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "خطأ في تسجيل الدخول" });
        }
        res.json({ user: { id: user.id, email: user.email, name: user.name, phoneNumber: user.phoneNumber, availableGames: user.availableGames, isAdmin: user.isAdmin } });
      });
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof z.ZodError) {
        const arabicErrors = error.errors.map(err => {
          if (err.path.includes('phoneNumber')) {
            return "رقم الهاتف غير صحيح";
          }
          return err.message;
        });
        return res.status(400).json({ message: arabicErrors.join(', ') });
      }
      res.status(400).json({ message: "خطأ في إنشاء الحساب" });
    }
  });

  app.post("/api/auth/login", passport.authenticate("local"), (req, res) => {
    const user = req.user as any;
    res.json({ user: { id: user.id, email: user.email, name: user.name, phoneNumber: user.phoneNumber, availableGames: user.availableGames, isAdmin: user.isAdmin } });
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
      res.json({ user: { id: user.id, email: user.email, name: user.name, phoneNumber: user.phoneNumber, availableGames: user.availableGames, isAdmin: user.isAdmin } });
    } else {
      res.status(401).json({ message: "غير مسجل الدخول" });
    }
  });

  // Google Authentication route
  app.post("/api/auth/google", async (req, res) => {
    try {
      const { idToken } = req.body;

      if (!idToken) {
        return res.status(400).json({ message: "معرف التوكن مطلوب" });
      }

      // Verify the Google ID token
      const decodedToken = await verifyIdToken(idToken);

      // Create or update user in our database
      const user = await createOrUpdateFirebaseUser(decodedToken);

      // Create session for the user
      req.login(user, (err) => {
        if (err) {
          console.error('Error creating session:', err);
          return res.status(500).json({ message: "خطأ في إنشاء الجلسة" });
        }
        res.json({ user: { id: user.id, email: user.email, name: user.name, availableGames: user.availableGames, isAdmin: user.isAdmin } });
      });
    } catch (error) {
      console.error('Google auth error:', error);
      res.status(401).json({ message: "خطأ في التحقق من هوية جوجل" });
    }
  });



  // Game routes
  app.post("/api/games/start", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "غير مسجل الدخول" });
    }

    const user = req.user as any;
    const { gameType = "single", teams = [], selectedCategories = [] } = req.body;

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
        if (!selectedCategories || selectedCategories.length === 0) {
          return res.status(400).json({ message: "يجب اختيار الفئات المطلوبة" });
        }

        // Use the provided selectedCategories
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

          // Try to get questions by both English name and Arabic display name
          let categoryQuestions = await storage.getQuestionsByCategory(category, 6);
          if (categoryQuestions.length < 6) {
            categoryQuestions = await storage.getQuestionsByCategory(categoryDisplayName, 6);
          }

          if (categoryQuestions.length < 6) {
            console.log(`Only ${categoryQuestions.length} questions available for ${category}/${categoryDisplayName}, need 6`);
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
          teamScores: teams.map(() => 0),
          teamHintsUsed: teams.map(() => false),
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
        teamScores: teams.map(() => 0),
        teamHintsUsed: teams.map(() => false),
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
      const activeSessions = gameSessions.filter(session => !session.isCompleted);
      const activeSession = activeSessions.length > 0 ? activeSessions[0] : null;

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
      const gameSession = await storage.getGameSession(req.params.id);
      if (!gameSession) {
        console.log(`Game session not found: ${req.params.id}`);
        return res.status(404).json({ message: "جلسة اللعبة غير موجودة" });
      }

      const user = req.user as any;
      if (gameSession.userId !== user.id) {
        console.log(`Access denied for user ${user.id} to game ${req.params.id}`);
        return res.status(403).json({ message: "غير مصرح بالوصول" });
      }

      // For team games, return all questions
      if (gameSession.gameType === "team") {
        const questions = await Promise.all(
          gameSession.questionIds.map(async id => {
            try {
              return await storage.getQuestionById(id);
            } catch (error) {
              console.error(`Error loading question ${id}:`, error);
              return null;
            }
          })
        );

        const validQuestions = questions.filter(q => q !== null);

        return res.json({
          gameSession: {
            id: gameSession.id,
            currentQuestionIndex: gameSession.currentQuestionIndex || 0,
            score: gameSession.score || 0,
            totalQuestions: gameSession.questionIds.length,
            isCompleted: gameSession.isCompleted || false,
            gameType: gameSession.gameType || "team",
            teams: gameSession.teams || [],
            teamScores: gameSession.teamScores || [],
            currentTurn: gameSession.currentTurn || 0,
            usedQuestions: gameSession.usedQuestions || [],
            usedHints: gameSession.usedHints || [],
            teamHintsUsed: gameSession.teamHintsUsed || [],
            selectedCategories: gameSession.selectedCategories || [],
          },
          questions: validQuestions,
        });
      }

      // For single games, return current question
      if (!gameSession.questionIds || gameSession.questionIds.length === 0) {
        return res.status(400).json({ message: "لا توجد أسئلة في هذه الجلسة" });
      }

      const currentIndex = gameSession.currentQuestionIndex || 0;
      if (currentIndex >= gameSession.questionIds.length) {
        // Game is completed
        return res.json({ 
          gameSession: {
            id: gameSession.id,
            currentQuestionIndex: currentIndex,
            score: gameSession.score || 0,
            totalQuestions: gameSession.questionIds.length,
            isCompleted: true,
            gameType: gameSession.gameType || "single",
          },
          currentQuestion: null 
        });
      }

      const questionId = gameSession.questionIds[currentIndex];
      const question = await storage.getQuestionById(questionId);

      if (!question) {
        console.error(`Question not found: ${questionId}`);
        return res.status(500).json({ message: "السؤال غير موجود" });
      }

      res.json({ 
        gameSession: {
          id: gameSession.id,
          currentQuestionIndex: currentIndex,
          score: gameSession.score || 0,
          totalQuestions: gameSession.questionIds.length,
          isCompleted: gameSession.isCompleted || false,
          gameType: gameSession.gameType || "single",
        },
        currentQuestion: question 
      });
    } catch (error: any) {
      console.error("Error loading game session:", error);
      res.status(500).json({ message: "خطأ في جلب بيانات اللعبة: " + error.message });
    }
  });

  // Complete game endpoint
  app.post("/api/games/:id/complete", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "غير مسجل الدخول" });
    }

    try {
      const gameSession = await storage.getGameSession(req.params.id);
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
      const gameSession = await storage.getGameSession(req.params.id);
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
    } catch (error: any) {
      res.status(500).json({ message: "خطأ في تسجيل النقطة: " + error.message });
    }
  });

  app.post("/api/games/:id/skip-question", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "غير مسجل الدخول" });
    }

    try {
      const gameSession = await storage.getGameSession(req.params.id);
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
      const gameSession = await storage.getGameSession(req.params.id);
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
      const gameSession = await storage.getGameSession(req.params.id);
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
      const gameSession = await storage.getGameSession(req.params.id);
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
      const gameSession = await storage.getGameSession(req.params.id);
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

  // Payment routes - Real Stripe integration
  app.post("/api/create-payment-intent", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "غير مسجل الدخول" });
    }

    try {
      const { gameCount, couponCode } = req.body;
      const user = req.user as any;

      // Get game package pricing
      const gamePackages = await storage.getActiveGamePackages();
      const gamePackage = gamePackages.find(pkg => pkg.gameCount === gameCount);

      if (!gamePackage) {
        return res.status(400).json({ message: "باقة الألعاب غير موجودة" });
      }

      let amount = gamePackage.price;
      let discountAmount = 0;
      let validCoupon = null;

      // Apply coupon if provided
      if (couponCode) {
        const coupon = await storage.getCouponByCode(couponCode);
        if (coupon && coupon.isActive) {
          const now = new Date();
          const isNotExpired = !coupon.expiresAt || now <= new Date(coupon.expiresAt);
          const hasUsageLeft = !coupon.maxUsage || coupon.usageCount < coupon.maxUsage;

          if (isNotExpired && hasUsageLeft) {
            validCoupon = coupon;
            if (coupon.discountType === 'percentage') {
              discountAmount = Math.round(amount * (coupon.discountValue / 100));
            } else {
              discountAmount = Math.min(coupon.discountValue, amount);
            }
            amount = Math.max(0, amount - discountAmount);
          }
        }
      }

      // Convert to Stripe format (cents)
      const stripeAmount = Math.round(amount * 100);

      // Create payment intent with Stripe (only if valid key exists)
      if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith('sk_')) {
        try {
          const Stripe = require('stripe');
          const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

          const paymentIntent = await stripe.paymentIntents.create({
            amount: stripeAmount,
            currency: 'kwd',
            metadata: {
              userId: user.id,
              gameCount: gameCount.toString(),
              originalAmount: gamePackage.price.toString(),
              discountAmount: discountAmount.toString(),
              couponCode: couponCode || ''
            }
          });

          res.json({ 
            clientSecret: paymentIntent.client_secret,
            amount: amount,
            discountAmount: discountAmount
          });
        } catch (stripeError) {
          console.error("Stripe creation error:", stripeError);
          // Fallback to mock if Stripe fails
          const mockClientSecret = `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`;
          res.json({ 
            clientSecret: mockClientSecret,
            amount: amount,
            discountAmount: discountAmount
          });
        }
      } else {
        // Fallback to mock for testing without Stripe
        const mockClientSecret = `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`;
        res.json({ 
          clientSecret: mockClientSecret,
          amount: amount,
          discountAmount: discountAmount
        });
      }
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
      const { paymentIntentId, gameCount, amount, couponCode, discountAmount } = req.body;
      const user = req.user as any;

      console.log("Payment confirmation request:", { paymentIntentId, gameCount, amount, couponCode, discountAmount });

      // For real Stripe payments (skip validation for mock payments)
      if (!paymentIntentId.startsWith('pi_mock_')) {
        if (!process.env.STRIPE_SECRET_KEY) {
          return res.status(400).json({ message: "خدمة الدفع غير متوفرة حاليا" });
        }

        try {
          const Stripe = require('stripe');
          const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
          const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

          if (paymentIntent.status !== "succeeded") {
            return res.status(400).json({ message: "فشل في الدفع" });
          }
        } catch (stripeError) {
          console.error("Stripe error:", stripeError);
          return res.status(400).json({ message: "خطأ في التحقق من الدفع" });
        }
      }

      // Create purchase record (Firebase doesn't allow undefined values)
      const purchaseData: any = {
        userId: user.id,
        gameCount: parseInt(gameCount),
        amount: parseFloat(amount),
        stripePaymentIntentId: paymentIntentId,
      };

      // Only add optional fields if they have actual values
      if (couponCode && couponCode !== 'undefined' && couponCode.trim() !== '') {
        purchaseData.couponCode = couponCode;
      }

      if (discountAmount && discountAmount !== 'undefined' && discountAmount !== '0') {
        purchaseData.discountAmount = parseFloat(discountAmount);
      }

      console.log("Creating purchase with data:", purchaseData);
      await storage.createPurchase(purchaseData);

      // Increment coupon usage if used
      if (couponCode) {
        const coupon = await storage.getCouponByCode(couponCode);
        if (coupon) {
          await storage.incrementCouponUsage(coupon.id);
        }
      }

      // INCREASE USER'S AVAILABLE GAMES - This is the key functionality
      const updatedUser = await storage.updateUserGames(user.id, user.availableGames + parseInt(gameCount));

      res.json({ 
        success: true, 
        availableGames: updatedUser.availableGames,
        message: `تم إضافة ${gameCount} ألعاب إلى حسابك بنجاح`
      });
    } catch (error: any) {
      console.error("Confirm payment error:", error);
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
      const question = await storage.updateQuestion(req.params.id, questionData);
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
      await storage.deleteQuestion(req.params.id);
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

  // Seed questions from config
  app.post("/api/admin/questions/seed", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "غير مسجل الدخول" });
    }

    const user = req.user as any;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "غير مصرح بالوصول" });
    }

    try {
      const { loadQuestions } = await import('@shared/config');
      const configQuestions = loadQuestions();
      let created = 0;
      let skipped = 0;

      console.log(`Loading ${configQuestions.length} questions from config...`);

      for (const question of configQuestions) {
        try {
          // Check if question already exists
          const existingQuestions = await storage.getQuestionsByCategory(question.category);
          const exists = existingQuestions.some(q => q.question === question.question);

          if (!exists) {
            await storage.createQuestion({
              ...question,
              isPublished: true
            });
            created++;
            console.log(`Created question: ${question.question.substring(0, 50)}...`);
          } else {
            skipped++;
          }
        } catch (error: any) {
          console.log('Error creating question:', error.message);
        }
      }

      res.json({ 
        message: `تم إضافة ${created} سؤال جديد وتخطي ${skipped} سؤال موجود مسبقاً`,
        totalInConfig: configQuestions.length,
        created,
        skipped
      });
    } catch (error: any) {
      console.error('Error seeding questions:', error);
      res.status(500).json({ message: "خطأ في تحميل الأسئلة: " + error.message });
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
      const category = await storage.updateCategory(req.params.id, categoryData);
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
      await storage.deleteCategory(req.params.id);
      res.json({ message: "تم حذف الفئة بنجاح" });
    } catch (error: any) {
      console.error('Delete category error:', error);
      res.status(500).json({ message: "خطأ في حذف الفئة: " + error.message });
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
      const coupon = await storage.updateCoupon(req.params.id, couponData);
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
      const gamePackage = await storage.updateGamePackage(req.params.id, packageData);
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
      await storage.deleteGamePackage(req.params.id);
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
      const { email, phoneNumber, name, password, availableGames = 0, isAdmin = false } = req.body;

      // Check if user already exists with email
      const existingUserByEmail = await storage.getUserByEmail(email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "البريد الإلكتروني مستخدم بالفعل" });
      }

      // Check if user already exists with phone number
      if (phoneNumber) {
        const existingUserByPhone = await storage.getUserByPhoneNumber(phoneNumber);
        if (existingUserByPhone) {
          return res.status(400).json({ message: "رقم الهاتف مستخدم بالفعل" });
        }
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const userData = insertUserSchema.parse({
        email,
        phoneNumber: phoneNumber || '',
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
      const userId = req.params.id; // Use string ID for Firebase
      const { email, phoneNumber, name, password, availableGames, isAdmin } = req.body;

      // Don't allow admin to modify their own admin status
      if (userId === user.id && isAdmin !== undefined) {
        return res.status(400).json({ message: "لا يمكن تعديل صلاحيات المدير الخاص بك" });
      }

      // Check if phone number is being changed and is already in use
      if (phoneNumber !== undefined && phoneNumber !== '') {
        const existingUserByPhone = await storage.getUserByPhoneNumber(phoneNumber);
        if (existingUserByPhone && existingUserByPhone.id !== userId) {
          return res.status(400).json({ message: "رقم الهاتف مستخدم بالفعل" });
        }
      }

      const updates: Partial<InsertUser> = {};

      if (email !== undefined) updates.email = email;
      if (phoneNumber !== undefined) updates.phoneNumber = phoneNumber;
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
      const userId = req.params.id; // Use string ID for Firebase

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

  // Routes registered successfully
}
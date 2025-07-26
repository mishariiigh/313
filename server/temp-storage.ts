import bcrypt from "bcryptjs";
import type {
  User,
  InsertUser,
  Question,
  InsertQuestion,
  GameSession,
  InsertGameSession,
  Purchase,
  InsertPurchase,
  Category,
  InsertCategory,
  Coupon,
  InsertCoupon,
  GamePackage,
  InsertGamePackage,
} from "@shared/firebase-schema";
import { loadQuestions, loadCategories, loadGamePackages, loadCoupons, loadAdminUser } from "@shared/config";

// Temporary in-memory storage until Firebase is properly configured
class TempStorage {
  private users: Map<string, User> = new Map();
  private questions: Map<string, Question> = new Map();
  private categories: Map<string, Category> = new Map();
  private gameSessions: Map<string, GameSession> = new Map();
  private purchases: Map<string, Purchase> = new Map();
  private coupons: Map<string, Coupon> = new Map();
  private gamePackages: Map<string, GamePackage> = new Map();

  constructor() {
    this.initializeDefaultData();
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private async initializeDefaultData() {
    // Load admin user from config
    try {
      const adminData = loadAdminUser();
      const adminId = "admin-user-id";
      const adminPassword = await bcrypt.hash(adminData.password, 10);
      this.users.set(adminId, {
        id: adminId,
        email: adminData.email,
        name: adminData.name,
        phoneNumber: adminData.phoneNumber,
        password: adminPassword,
        availableGames: adminData.availableGames,
        isAdmin: adminData.isAdmin,
        createdAt: new Date(),
      });
    } catch (error) {
      console.log("Using default admin user");
      // Fallback admin user
      const adminId = "admin-user-id";
      const adminPassword = await bcrypt.hash("newpassword", 10);
      this.users.set(adminId, {
        id: adminId,
        email: "mohammedbinsabbar@gmail.com",
        name: "مدير النظام",
        password: adminPassword,
        availableGames: 100,
        isAdmin: true,
        createdAt: new Date(),
      });
    }

    // Add a test user for easy login
    const testUserId = "test-user-id";
    const testPassword = await bcrypt.hash("123456", 10);
    this.users.set(testUserId, {
      id: testUserId,
      email: "mohammed@gmail.com",
      name: "محمد",
      phoneNumber: "+96512345678",
      password: testPassword,
      availableGames: 10,
      isAdmin: true,
      createdAt: new Date(),
    });

    // Load categories from config
    try {
      const categories = loadCategories();
      categories.forEach(category => {
        const id = this.generateId();
        this.categories.set(id, {
          id,
          ...category,
          createdAt: new Date(),
        });
      });
    } catch (error) {
      console.log("Using default categories");
      // Fallback categories
      const categories = [
        { name: "history", displayName: "التاريخ", description: "أسئلة تاريخية متنوعة", isActive: true },
        { name: "geography", displayName: "الجغرافيا", description: "أسئلة جغرافية", isActive: true },
        { name: "religion", displayName: "الدين", description: "أسئلة دينية", isActive: true },
        { name: "sports", displayName: "الرياضة", description: "أسئلة رياضية", isActive: true },
        { name: "me7gan", displayName: "محقان", description: "أسئلة ثقافية محلية", isActive: true },
        { name: "science", displayName: "العلوم", description: "أسئلة علمية", isActive: true },
      ];

      categories.forEach(category => {
        const id = this.generateId();
        this.categories.set(id, {
          id,
          ...category,
          createdAt: new Date(),
        });
      });
    }

    // Load questions from config
    try {
      const questions = loadQuestions();
      questions.forEach(question => {
        const id = this.generateId();
        this.questions.set(id, {
          id,
          ...question,
          isPublished: true,
          createdAt: new Date(),
        });
      });
      console.log(`✓ Loaded ${questions.length} questions from config`);
    } catch (error) {
      console.log("Error loading questions from config:", error);
      // No fallback questions - we need real questions from config
    }

    // Create game packages
    const packages = [
      { name: "باقة المبتدئين", description: "مثالية للمبتدئين", gameCount: 1, priceInCents: 199, sortOrder: 1, isActive: true },
      { name: "باقة المحترفين", description: "للاعبين المتقدمين", gameCount: 5, priceInCents: 899, sortOrder: 2, isActive: true },
      { name: "باقة الخبراء", description: "للخبراء والمحترفين", gameCount: 10, priceInCents: 1499, sortOrder: 3, isActive: true },
      { name: "باقة الأسرة", description: "مثالية للعائلات", gameCount: 20, priceInCents: 2499, sortOrder: 4, isActive: true },
    ];

    packages.forEach(pkg => {
      const id = this.generateId();
      this.gamePackages.set(id, {
        id,
        ...pkg,
        createdAt: new Date(),
      });
    });

    // Create coupons
    const coupons = [
      { code: "WELCOME10", discountType: "percentage", discountValue: 10, maxUsage: 100, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), isActive: true },
      { code: "FAMILY20", discountType: "percentage", discountValue: 20, maxUsage: 50, expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), isActive: true },
    ];

    coupons.forEach(coupon => {
      const id = this.generateId();
      this.coupons.set(id, {
        id,
        ...coupon,
        usageCount: 0,
        createdAt: new Date(),
      });
    });
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.generateId();
    const user: User = {
      id,
      ...insertUser,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserGames(id: string, availableGames: number): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    user.availableGames = availableGames;
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    this.users.delete(id);
  }

  // Question operations
  async getAllQuestions(): Promise<Question[]> {
    return Array.from(this.questions.values());
  }

  async getQuestions(category?: string, difficulty?: string): Promise<Question[]> {
    let questions = Array.from(this.questions.values());
    
    if (category) {
      questions = questions.filter(q => q.category === category);
    }
    
    if (difficulty) {
      questions = questions.filter(q => q.difficulty === difficulty);
    }
    
    return questions;
  }

  async getQuestionsByCategory(category: string, limit?: number): Promise<Question[]> {
    const questions = Array.from(this.questions.values()).filter(q => q.category === category);
    return limit ? questions.slice(0, limit) : questions;
  }

  async getPublishedQuestionsByCategory(category: string): Promise<Question[]> {
    return Array.from(this.questions.values()).filter(q => q.category === category && q.isPublished);
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const id = this.generateId();
    const question: Question = {
      id,
      ...insertQuestion,
      isPublished: false,
      createdAt: new Date(),
    };
    this.questions.set(id, question);
    return question;
  }

  async updateQuestion(id: string, updates: Partial<Question>): Promise<Question> {
    const question = this.questions.get(id);
    if (!question) throw new Error("Question not found");
    const updatedQuestion = { ...question, ...updates };
    this.questions.set(id, updatedQuestion);
    return updatedQuestion;
  }

  async deleteQuestion(id: string): Promise<void> {
    this.questions.delete(id);
  }

  async getQuestionById(id: string): Promise<Question | undefined> {
    return this.questions.get(id);
  }

  async getRandomQuestions(count: number): Promise<Question[]> {
    const questions = Array.from(this.questions.values());
    const shuffled = questions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  async publishAllQuestions(): Promise<void> {
    this.questions.forEach(question => {
      question.isPublished = true;
    });
  }

  async unpublishAllQuestions(): Promise<void> {
    this.questions.forEach(question => {
      question.isPublished = false;
    });
  }

  // Category operations
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.generateId();
    const newCategory: Category = {
      id,
      ...category,
      createdAt: new Date(),
    };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    const category = this.categories.get(id);
    if (!category) throw new Error("Category not found");
    const updatedCategory = { ...category, ...updates };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  // Game session operations
  async createGameSession(insertSession: InsertGameSession): Promise<GameSession> {
    const id = this.generateId();
    const session: GameSession = {
      id,
      ...insertSession,
      createdAt: new Date(),
    };
    this.gameSessions.set(id, session);
    return session;
  }

  async getGameSession(id: string): Promise<GameSession | undefined> {
    return this.gameSessions.get(id);
  }

  async updateGameSession(id: string, session: Partial<InsertGameSession>): Promise<GameSession> {
    const existingSession = this.gameSessions.get(id);
    if (!existingSession) throw new Error("Game session not found");
    const updatedSession = { ...existingSession, ...session };
    this.gameSessions.set(id, updatedSession);
    return updatedSession;
  }

  async getUserGameSessions(userId: string): Promise<GameSession[]> {
    return Array.from(this.gameSessions.values()).filter(session => session.userId === userId);
  }

  // Purchase operations
  async createPurchase(purchase: InsertPurchase): Promise<Purchase> {
    const id = this.generateId();
    const newPurchase: Purchase = {
      id,
      ...purchase,
      createdAt: new Date(),
    };
    this.purchases.set(id, newPurchase);
    return newPurchase;
  }

  async getUserPurchases(userId: string): Promise<Purchase[]> {
    return Array.from(this.purchases.values()).filter(purchase => purchase.userId === userId);
  }

  // Coupon operations
  async getAllCoupons(): Promise<Coupon[]> {
    return Array.from(this.coupons.values());
  }

  async getCouponByCode(code: string): Promise<Coupon | undefined> {
    return Array.from(this.coupons.values()).find(coupon => coupon.code === code);
  }

  async createCoupon(coupon: InsertCoupon): Promise<Coupon> {
    const id = this.generateId();
    const newCoupon: Coupon = {
      id,
      ...coupon,
      usageCount: 0,
      createdAt: new Date(),
    };
    this.coupons.set(id, newCoupon);
    return newCoupon;
  }

  async updateCoupon(id: string, updates: Partial<Coupon>): Promise<Coupon> {
    const coupon = this.coupons.get(id);
    if (!coupon) throw new Error("Coupon not found");
    const updatedCoupon = { ...coupon, ...updates };
    this.coupons.set(id, updatedCoupon);
    return updatedCoupon;
  }

  async incrementCouponUsage(id: string): Promise<void> {
    const coupon = this.coupons.get(id);
    if (coupon) {
      coupon.usageCount++;
      this.coupons.set(id, coupon);
    }
  }

  // Game Package operations
  async getAllGamePackages(): Promise<GamePackage[]> {
    return Array.from(this.gamePackages.values());
  }

  async getActiveGamePackages(): Promise<GamePackage[]> {
    return Array.from(this.gamePackages.values()).filter(pkg => pkg.isActive);
  }

  async createGamePackage(gamePackage: InsertGamePackage): Promise<GamePackage> {
    const id = this.generateId();
    const newPackage: GamePackage = {
      id,
      ...gamePackage,
      createdAt: new Date(),
    };
    this.gamePackages.set(id, newPackage);
    return newPackage;
  }

  async updateGamePackage(id: string, updates: Partial<GamePackage>): Promise<GamePackage> {
    const gamePackage = this.gamePackages.get(id);
    if (!gamePackage) throw new Error("Game package not found");
    const updatedPackage = { ...gamePackage, ...updates };
    this.gamePackages.set(id, updatedPackage);
    return updatedPackage;
  }

  async deleteGamePackage(id: string): Promise<void> {
    this.gamePackages.delete(id);
  }

  // Analytics operations
  async getStats(): Promise<{
    totalUsers: number;
    totalQuestions: number;
    totalGamesPlayed: number;
    monthlyRevenue: number;
  }> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentPurchases = Array.from(this.purchases.values()).filter(purchase => {
      const purchaseDate = new Date(purchase.createdAt);
      return purchaseDate >= thirtyDaysAgo;
    });

    const monthlyRevenue = recentPurchases.reduce((sum, purchase) => sum + purchase.amount, 0);

    return {
      totalUsers: this.users.size,
      totalQuestions: this.questions.size,
      totalGamesPlayed: Array.from(this.gameSessions.values()).filter(session => session.isCompleted).length,
      monthlyRevenue: Math.round(monthlyRevenue / 100),
    };
  }

  async getSalesAnalytics(): Promise<{
    totalRevenue: number;
    totalSales: number;
    averageOrderValue: number;
    monthlyRevenue: Array<{ month: string; revenue: number; sales: number }>;
    topGamePackages: Array<{ name: string; sales: number; revenue: number }>;
    recentSales: Array<{
      id: string;
      userName: string;
      packageName: string;
      amount: number;
      gameCount: number;
      date: string;
      couponCode?: string;
      discountAmount?: number;
    }>;
  }> {
    const purchases = Array.from(this.purchases.values());
    const totalRevenue = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);
    const totalSales = purchases.length;
    const averageOrderValue = totalSales > 0 ? Math.round(totalRevenue / totalSales) : 0;

    return {
      totalRevenue: Math.round(totalRevenue / 100),
      totalSales,
      averageOrderValue: Math.round(averageOrderValue / 100),
      monthlyRevenue: [],
      topGamePackages: [],
      recentSales: [],
    };
  }
}

export const storage = new TempStorage();
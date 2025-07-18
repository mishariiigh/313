import { users, questions, gameSessions, purchases, categories, coupons, gamePackages, type User, type InsertUser, type Question, type InsertQuestion, type GameSession, type InsertGameSession, type Purchase, type InsertPurchase, type Category, type InsertCategory, type Coupon, type InsertCoupon, type GamePackage, type InsertGamePackage } from "@shared/schema";
import { db } from "./db";
import { eq, sql, desc, inArray, and, not } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserGames(userId: number, availableGames: number): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User>;
  deleteUser(id: number): Promise<void>;
  
  // Question operations
  getQuestions(category?: string, difficulty?: string): Promise<Question[]>;
  getPublishedQuestions(category?: string, difficulty?: string): Promise<Question[]>;
  getQuestionById(id: number): Promise<Question | undefined>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  updateQuestion(id: number, question: Partial<InsertQuestion>): Promise<Question>;
  deleteQuestion(id: number): Promise<void>;
  getRandomQuestions(count: number): Promise<Question[]>;
  getQuestionsByCategory(category: string, count: number): Promise<Question[]>;
  publishAllQuestions(): Promise<void>;
  unpublishAllQuestions(): Promise<void>;
  
  // Game session operations
  createGameSession(session: InsertGameSession): Promise<GameSession>;
  getGameSession(id: number): Promise<GameSession | undefined>;
  updateGameSession(id: number, session: Partial<InsertGameSession>): Promise<GameSession>;
  getUserGameSessions(userId: number): Promise<GameSession[]>;
  
  // Purchase operations
  createPurchase(purchase: InsertPurchase): Promise<Purchase>;
  getUserPurchases(userId: number): Promise<Purchase[]>;
  
  // Category operations
  getAllCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, updates: Partial<Category>): Promise<Category>;
  
  // Coupon operations
  getAllCoupons(): Promise<Coupon[]>;
  getCouponByCode(code: string): Promise<Coupon | undefined>;
  createCoupon(coupon: InsertCoupon): Promise<Coupon>;
  updateCoupon(id: number, updates: Partial<Coupon>): Promise<Coupon>;
  incrementCouponUsage(id: number): Promise<void>;

  // Game Package operations
  getAllGamePackages(): Promise<GamePackage[]>;
  getActiveGamePackages(): Promise<GamePackage[]>;
  createGamePackage(gamePackage: InsertGamePackage): Promise<GamePackage>;
  updateGamePackage(id: number, updates: Partial<GamePackage>): Promise<GamePackage>;
  deleteGamePackage(id: number): Promise<void>;

  // Admin operations
  getStats(): Promise<{
    totalUsers: number;
    totalQuestions: number;
    totalGamesPlayed: number;
    monthlyRevenue: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUserGames(userId: number, availableGames: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ availableGames })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .orderBy(desc(users.createdAt));
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async deleteUser(id: number): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  async getQuestions(category?: string, difficulty?: string): Promise<Question[]> {
    let whereCondition;
    
    if (category && difficulty) {
      whereCondition = and(eq(questions.category, category), eq(questions.difficulty, difficulty));
    } else if (category) {
      whereCondition = eq(questions.category, category);
    } else if (difficulty) {
      whereCondition = eq(questions.difficulty, difficulty);
    }
    
    const query = db.select().from(questions);
    
    if (whereCondition) {
      return query.where(whereCondition).orderBy(desc(questions.createdAt));
    }
    
    return query.orderBy(desc(questions.createdAt));
  }

  async getPublishedQuestions(category?: string, difficulty?: string): Promise<Question[]> {
    let whereCondition;
    
    if (category && difficulty) {
      whereCondition = and(eq(questions.category, category), eq(questions.difficulty, difficulty), eq(questions.published, true));
    } else if (category) {
      whereCondition = and(eq(questions.category, category), eq(questions.published, true));
    } else if (difficulty) {
      whereCondition = and(eq(questions.difficulty, difficulty), eq(questions.published, true));
    } else {
      whereCondition = eq(questions.published, true);
    }
    
    return db.select().from(questions).where(whereCondition).orderBy(desc(questions.createdAt));
  }

  async getQuestionById(id: number): Promise<Question | undefined> {
    const [question] = await db.select().from(questions).where(eq(questions.id, id));
    return question || undefined;
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const [question] = await db
      .insert(questions)
      .values(insertQuestion)
      .returning();
    return question;
  }

  async updateQuestion(id: number, updateQuestion: Partial<InsertQuestion>): Promise<Question> {
    const [question] = await db
      .update(questions)
      .set(updateQuestion)
      .where(eq(questions.id, id))
      .returning();
    return question;
  }

  async deleteQuestion(id: number): Promise<void> {
    await db.delete(questions).where(eq(questions.id, id));
  }

  async getRandomQuestions(count: number): Promise<Question[]> {
    // Simple approach: just get random questions from all available
    return await db
      .select()
      .from(questions)
      .orderBy(sql`RANDOM()`)
      .limit(count);
  }

  async getQuestionsByCategory(category: string, count: number): Promise<Question[]> {
    // Get exactly 2 questions per difficulty level to ensure proper point distribution
    // Positions 0-1: سهل (200 pts), Positions 2-3: متوسط (400 pts), Positions 4-5: صعب (600 pts)
    
    const easyQuestions = await db
      .select()
      .from(questions)
      .where(and(eq(questions.category, category), eq(questions.difficulty, 'سهل'), eq(questions.published, true)))
      .orderBy(sql`RANDOM()`)
      .limit(2);
    
    const mediumQuestions = await db
      .select()
      .from(questions)
      .where(and(eq(questions.category, category), eq(questions.difficulty, 'متوسط'), eq(questions.published, true)))
      .orderBy(sql`RANDOM()`)
      .limit(2);
    
    const hardQuestions = await db
      .select()
      .from(questions)
      .where(and(eq(questions.category, category), eq(questions.difficulty, 'صعب'), eq(questions.published, true)))
      .orderBy(sql`RANDOM()`)
      .limit(2);
    
    // Combine in the correct order: easy, medium, hard
    const allQuestions = [...easyQuestions, ...mediumQuestions, ...hardQuestions];
    
    // Ensure we have exactly 6 questions (2 per difficulty)
    if (allQuestions.length < 6) {
      console.log(`Category ${category}: Easy=${easyQuestions.length}, Medium=${mediumQuestions.length}, Hard=${hardQuestions.length}`);
      // If we don't have enough questions in a difficulty, we need to add more questions to the database
      // For now, we'll return what we have and let the game creation fail gracefully
    }
    
    return allQuestions.slice(0, count);
  }

  async publishAllQuestions(): Promise<void> {
    await db.update(questions).set({ published: true });
  }

  async unpublishAllQuestions(): Promise<void> {
    await db.update(questions).set({ published: false });
  }

  async createGameSession(insertSession: InsertGameSession): Promise<GameSession> {
    const [session] = await db
      .insert(gameSessions)
      .values(insertSession)
      .returning();
    return session;
  }

  async getGameSession(id: number): Promise<GameSession | undefined> {
    const [session] = await db.select().from(gameSessions).where(eq(gameSessions.id, id));
    return session || undefined;
  }

  async updateGameSession(id: number, updateSession: Partial<InsertGameSession>): Promise<GameSession> {
    const [session] = await db
      .update(gameSessions)
      .set(updateSession)
      .where(eq(gameSessions.id, id))
      .returning();
    return session;
  }

  async getUserGameSessions(userId: number): Promise<GameSession[]> {
    try {
      return await db.select().from(gameSessions).where(eq(gameSessions.userId, userId)).orderBy(desc(gameSessions.createdAt));
    } catch (error) {
      console.error("getUserGameSessions error:", error);
      throw error;
    }
  }

  async createPurchase(insertPurchase: InsertPurchase): Promise<Purchase> {
    const [purchase] = await db
      .insert(purchases)
      .values(insertPurchase)
      .returning();
    return purchase;
  }

  async getUserPurchases(userId: number): Promise<Purchase[]> {
    return db.select().from(purchases).where(eq(purchases.userId, userId)).orderBy(desc(purchases.createdAt));
  }

  // Category operations
  async getAllCategories(): Promise<Category[]> {
    return db.select().from(categories).orderBy(categories.displayName);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db
      .insert(categories)
      .values(insertCategory)
      .returning();
    return category;
  }

  async updateCategory(id: number, updates: Partial<Category>): Promise<Category> {
    const [category] = await db
      .update(categories)
      .set(updates)
      .where(eq(categories.id, id))
      .returning();
    return category;
  }

  async deleteCategory(id: number): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }

  // Coupon operations
  async getAllCoupons(): Promise<Coupon[]> {
    return db.select().from(coupons).orderBy(desc(coupons.createdAt));
  }

  async getCouponByCode(code: string): Promise<Coupon | undefined> {
    const [coupon] = await db.select().from(coupons).where(eq(coupons.code, code));
    return coupon || undefined;
  }

  async createCoupon(insertCoupon: InsertCoupon): Promise<Coupon> {
    const [coupon] = await db
      .insert(coupons)
      .values(insertCoupon)
      .returning();
    return coupon;
  }

  async updateCoupon(id: number, updates: Partial<Coupon>): Promise<Coupon> {
    const [coupon] = await db
      .update(coupons)
      .set(updates)
      .where(eq(coupons.id, id))
      .returning();
    return coupon;
  }

  async incrementCouponUsage(id: number): Promise<void> {
    await db
      .update(coupons)
      .set({ usageCount: sql`${coupons.usageCount} + 1` })
      .where(eq(coupons.id, id));
  }

  // Game Package operations
  async getAllGamePackages(): Promise<GamePackage[]> {
    return db.select().from(gamePackages).orderBy(gamePackages.sortOrder, gamePackages.createdAt);
  }

  async getActiveGamePackages(): Promise<GamePackage[]> {
    return db.select().from(gamePackages).where(eq(gamePackages.isActive, true)).orderBy(gamePackages.sortOrder, gamePackages.createdAt);
  }

  async createGamePackage(insertGamePackage: InsertGamePackage): Promise<GamePackage> {
    const [gamePackage] = await db
      .insert(gamePackages)
      .values(insertGamePackage)
      .returning();
    return gamePackage;
  }

  async updateGamePackage(id: number, updates: Partial<GamePackage>): Promise<GamePackage> {
    const [gamePackage] = await db
      .update(gamePackages)
      .set(updates)
      .where(eq(gamePackages.id, id))
      .returning();
    return gamePackage;
  }

  async deleteGamePackage(id: number): Promise<void> {
    await db.delete(gamePackages).where(eq(gamePackages.id, id));
  }

  async getStats(): Promise<{
    totalUsers: number;
    totalQuestions: number;
    totalGamesPlayed: number;
    monthlyRevenue: number;
  }> {
    const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
    const [questionCount] = await db.select({ count: sql<number>`count(*)` }).from(questions);
    const [gameCount] = await db.select({ count: sql<number>`count(*)` }).from(gameSessions).where(eq(gameSessions.isCompleted, true));
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const [revenueResult] = await db
      .select({ total: sql<number>`sum(${purchases.amount})` })
      .from(purchases)
      .where(sql`${purchases.createdAt} >= ${thirtyDaysAgo}`);
    
    return {
      totalUsers: userCount.count,
      totalQuestions: questionCount.count,
      totalGamesPlayed: gameCount.count,
      monthlyRevenue: Math.round((revenueResult.total || 0) / 100), // Convert cents to dollars
    };
  }
}

export const storage = new DatabaseStorage();

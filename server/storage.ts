import { users, questions, gameSessions, purchases, type User, type InsertUser, type Question, type InsertQuestion, type GameSession, type InsertGameSession, type Purchase, type InsertPurchase } from "@shared/schema";
import { db } from "./db";
import { eq, sql, desc, inArray, and, not } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserGames(userId: number, availableGames: number): Promise<User>;
  
  // Question operations
  getQuestions(category?: string, difficulty?: string): Promise<Question[]>;
  getQuestionById(id: number): Promise<Question | undefined>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  updateQuestion(id: number, question: Partial<InsertQuestion>): Promise<Question>;
  deleteQuestion(id: number): Promise<void>;
  getRandomQuestions(count: number): Promise<Question[]>;
  
  // Game session operations
  createGameSession(session: InsertGameSession): Promise<GameSession>;
  getGameSession(id: number): Promise<GameSession | undefined>;
  updateGameSession(id: number, session: Partial<InsertGameSession>): Promise<GameSession>;
  getUserGameSessions(userId: number): Promise<GameSession[]>;
  
  // Purchase operations
  createPurchase(purchase: InsertPurchase): Promise<Purchase>;
  getUserPurchases(userId: number): Promise<Purchase[]>;
  
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
    return await db
      .select()
      .from(questions)
      .where(eq(questions.category, category))
      .orderBy(sql`RANDOM()`)
      .limit(count);
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

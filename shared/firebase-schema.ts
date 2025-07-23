import { z } from "zod";

// User schema for Firebase
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  phoneNumber: z.string().min(8, "رقم الهاتف يجب أن يكون 8 أرقام على الأقل"),
  name: z.string(),
  password: z.string(),
  availableGames: z.number().default(0),
  isAdmin: z.boolean().default(false),
  createdAt: z.any(), // Firebase Timestamp
});

export const insertUserSchema = userSchema.omit({ id: true, createdAt: true });

export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;

// Question schema for Firebase
export const questionSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
  category: z.string(),
  difficulty: z.enum(["سهل", "متوسط", "صعب"]),
  hint: z.string(),
  explanation: z.string().optional(),
  imageUrl: z.string().optional(),
  isPublished: z.boolean().default(false),
  createdAt: z.any(), // Firebase Timestamp
});

export const insertQuestionSchema = questionSchema.omit({ id: true, createdAt: true, isPublished: true });

export type Question = z.infer<typeof questionSchema>;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;

// Game Session schema for Firebase
export const gameSessionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  gameType: z.enum(["single", "team"]),
  teams: z.array(z.string()).optional(),
  categories: z.array(z.string()),
  questions: z.array(z.string()), // Array of question IDs
  usedQuestions: z.array(z.string()).default([]),
  currentQuestionIndex: z.number().default(0),
  isCompleted: z.boolean().default(false),
  scores: z.record(z.number()).default({}),
  teamHintsUsed: z.array(z.string()).default([]),
  createdAt: z.any(), // Firebase Timestamp
});

export const insertGameSessionSchema = gameSessionSchema.omit({ id: true, createdAt: true });

export type GameSession = z.infer<typeof gameSessionSchema>;
export type InsertGameSession = z.infer<typeof insertGameSessionSchema>;

// Purchase schema for Firebase
export const purchaseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  amount: z.number(),
  gameCount: z.number(),
  couponCode: z.string().optional(),
  discountAmount: z.number().optional(),
  createdAt: z.any(), // Firebase Timestamp
});

export const insertPurchaseSchema = purchaseSchema.omit({ id: true, createdAt: true });

export type Purchase = z.infer<typeof purchaseSchema>;
export type InsertPurchase = z.infer<typeof insertPurchaseSchema>;

// Category schema for Firebase
export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  displayName: z.string(),
  description: z.string().optional(),
  logoUrl: z.string().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.any(), // Firebase Timestamp
});

export const insertCategorySchema = categorySchema.omit({ id: true, createdAt: true });

export type Category = z.infer<typeof categorySchema>;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

// Coupon schema for Firebase
export const couponSchema = z.object({
  id: z.string(),
  code: z.string(),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.number(),
  maxUsage: z.number(),
  usageCount: z.number().default(0),
  expiresAt: z.any(), // Firebase Timestamp
  isActive: z.boolean().default(true),
  createdAt: z.any(), // Firebase Timestamp
});

export const insertCouponSchema = couponSchema.omit({ id: true, createdAt: true, usageCount: true });

export type Coupon = z.infer<typeof couponSchema>;
export type InsertCoupon = z.infer<typeof insertCouponSchema>;

// Game Package schema for Firebase
export const gamePackageSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  gameCount: z.number(),
  priceInCents: z.number(),
  sortOrder: z.number(),
  isActive: z.boolean().default(true),
  createdAt: z.any(), // Firebase Timestamp
});

export const insertGamePackageSchema = gamePackageSchema.omit({ id: true, createdAt: true });

export type GamePackage = z.infer<typeof gamePackageSchema>;
export type InsertGamePackage = z.infer<typeof insertGamePackageSchema>;

// Export all schemas for convenience
export const schemas = {
  user: userSchema,
  insertUser: insertUserSchema,
  question: questionSchema,
  insertQuestion: insertQuestionSchema,
  gameSession: gameSessionSchema,
  insertGameSession: insertGameSessionSchema,
  purchase: purchaseSchema,
  insertPurchase: insertPurchaseSchema,
  category: categorySchema,
  insertCategory: insertCategorySchema,
  coupon: couponSchema,
  insertCoupon: insertCouponSchema,
  gamePackage: gamePackageSchema,
  insertGamePackage: insertGamePackageSchema,
};
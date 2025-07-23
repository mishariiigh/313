import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phoneNumber: varchar("phone_number", { length: 20 }).notNull().unique(),
  password: text("password").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  availableGames: integer("available_games").default(0).notNull(),
  totalGames: integer("total_games").default(0).notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  difficulty: varchar("difficulty", { length: 50 }).notNull(),
  hint: text("hint"),
  explanation: text("explanation"),
  imageUrl: text("image_url"),
  published: boolean("published").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const gameSessions = pgTable("game_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  questionIds: integer("question_ids").array().notNull(),
  currentQuestionIndex: integer("current_question_index").default(0).notNull(),
  score: integer("score").default(0).notNull(),
  isCompleted: boolean("is_completed").default(false).notNull(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  
  // Team-based game fields
  teams: text("teams").array().notNull().default([]),
  currentTurn: integer("current_turn").default(0).notNull(),
  teamScores: integer("team_scores").array().notNull().default([]),
  usedQuestions: text("used_questions").array().notNull().default([]),
  usedHints: text("used_hints").array().notNull().default([]),
  teamHintsUsed: boolean("team_hints_used").array().notNull().default([]),
  gameType: varchar("game_type", { length: 50 }).default("single").notNull(),
  selectedCategories: text("selected_categories").array().notNull().default([]),
});

export const purchases = pgTable("purchases", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  gameCount: integer("game_count").notNull(),
  amount: integer("amount").notNull(), // in cents
  originalAmount: integer("original_amount"), // in cents, before discount
  discountAmount: integer("discount_amount"), // in cents
  couponCode: varchar("coupon_code", { length: 100 }),
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 100 }).notNull().unique(),
  discountType: varchar("discount_type", { length: 20 }).notNull(), // "percentage" or "fixed"
  discountValue: integer("discount_value").notNull(), // percentage (0-100) or fixed amount in cents
  isActive: boolean("is_active").default(true).notNull(),
  usageCount: integer("usage_count").default(0).notNull(),
  maxUsage: integer("max_usage"), // null for unlimited
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  displayName: varchar("display_name", { length: 100 }).notNull(),
  description: text("description"),
  logoUrl: text("logo_url"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const gamePackages = pgTable("game_packages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description").notNull(),
  gameCount: integer("game_count").notNull(),
  priceInCents: integer("price_in_cents").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  gameSessions: many(gameSessions),
  purchases: many(purchases),
}));

export const gameSessionsRelations = relations(gameSessions, ({ one }) => ({
  user: one(users, {
    fields: [gameSessions.userId],
    references: [users.id],
  }),
}));

export const purchasesRelations = relations(purchases, ({ one }) => ({
  user: one(users, {
    fields: [purchases.userId],
    references: [users.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertQuestionSchema = createInsertSchema(questions).omit({
  id: true,
  createdAt: true,
});

export const insertGameSessionSchema = createInsertSchema(gameSessions).omit({
  id: true,
  createdAt: true,
});

export const insertPurchaseSchema = createInsertSchema(purchases).omit({
  id: true,
  createdAt: true,
});

export const insertCouponSchema = createInsertSchema(coupons).omit({
  id: true,
  createdAt: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
});

export const insertGamePackageSchema = createInsertSchema(gamePackages).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type Question = typeof questions.$inferSelect;

export type InsertGameSession = z.infer<typeof insertGameSessionSchema>;
export type GameSession = typeof gameSessions.$inferSelect;

export type InsertPurchase = z.infer<typeof insertPurchaseSchema>;
export type Purchase = typeof purchases.$inferSelect;

export type InsertCoupon = z.infer<typeof insertCouponSchema>;
export type Coupon = typeof coupons.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertGamePackage = z.infer<typeof insertGamePackageSchema>;
export type GamePackage = typeof gamePackages.$inferSelect;

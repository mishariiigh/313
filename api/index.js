var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// shared/config.ts
var config_exports = {};
__export(config_exports, {
  config: () => config,
  loadAdminUser: () => loadAdminUser,
  loadAppSettings: () => loadAppSettings,
  loadCategories: () => loadCategories,
  loadCoupons: () => loadCoupons,
  loadGamePackages: () => loadGamePackages,
  loadJsonConfig: () => loadJsonConfig,
  loadQuestions: () => loadQuestions
});
import * as fs from "fs";
import * as path from "path";
function loadJsonConfig(fileName) {
  try {
    const configPath = path.join(process.cwd(), "config", fileName);
    const rawData = fs.readFileSync(configPath, "utf8");
    return JSON.parse(rawData);
  } catch (error) {
    console.error(`Failed to load config file: ${fileName}`, error);
    throw new Error(`Configuration file ${fileName} is required but not found or invalid`);
  }
}
var config, loadCategories, loadQuestions, loadGamePackages, loadCoupons, loadAppSettings, loadAdminUser;
var init_config = __esm({
  "shared/config.ts"() {
    "use strict";
    config = {
      // Server configuration
      server: {
        port: parseInt(process.env.PORT || "5000"),
        nodeEnv: process.env.NODE_ENV || "development",
        sessionSecret: process.env.SESSION_SECRET || "fallback-secret-for-development-only"
      },
      // Database configuration
      database: {
        url: process.env.DATABASE_URL
      },
      // Firebase configuration
      firebase: {
        apiKey: process.env.FIREBASE_API_KEY,
        projectId: process.env.FIREBASE_PROJECT_ID,
        appId: process.env.FIREBASE_APP_ID,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET
      },
      // Stripe configuration
      stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY,
        publicKey: process.env.VITE_STRIPE_PUBLIC_KEY,
        priceId: process.env.STRIPE_PRICE_ID
      },
      // Google API configuration
      google: {
        apiKey: process.env.GOOGLE_API_KEY
      },
      // Validate required environment variables
      validate() {
        const missingVars = [];
        if (!this.firebase.apiKey) missingVars.push("FIREBASE_API_KEY");
        if (!this.firebase.projectId) missingVars.push("FIREBASE_PROJECT_ID");
        if (!this.firebase.appId) missingVars.push("FIREBASE_APP_ID");
        if (missingVars.length > 0) {
          console.warn("Missing environment variables:", missingVars.join(", "));
          console.warn("Some features may not work properly. Check your .env file.");
        }
        return missingVars.length === 0;
      }
    };
    loadCategories = () => loadJsonConfig("categories.json");
    loadQuestions = () => loadJsonConfig("questions.json");
    loadGamePackages = () => loadJsonConfig("game-packages.json");
    loadCoupons = () => loadJsonConfig("coupons.json");
    loadAppSettings = () => loadJsonConfig("app-settings.json");
    loadAdminUser = () => loadJsonConfig("admin-user.json");
    try {
      config.validate();
    } catch (error) {
      console.warn("Configuration validation failed:", error);
    }
  }
});

// api/index.ts
import express from "express";

// server/routes.ts
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import multer from "multer";

// server/firebase-storage.ts
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  increment,
  serverTimestamp,
  Timestamp,
  writeBatch
} from "firebase/firestore";

// server/config/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
var firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyBQwHA7qmGPAuxqxqYFL_v53NwmWKMsBiU",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "game-aad88.firebaseapp.com",
  databaseURL: process.env.FIREBASE_DATABASE_URL || "https://game-aad88-default-rtdb.firebaseio.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "game-aad88",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "game-aad88.firebasestorage.app",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "376324753966",
  appId: process.env.FIREBASE_APP_ID || "1:376324753966:web:9a79dba8c22d2efb4c6dbf",
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-XR8D226WZJ"
};
var app = initializeApp(firebaseConfig);
var db = getFirestore(app);
var auth = getAuth(app);
var storage = getStorage(app);

// server/firebase-storage.ts
var FirebaseStorage = class {
  // User operations
  async getUser(id) {
    const userDoc = await getDoc(doc(db, "users", id));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    }
    return void 0;
  }
  async getUserByEmail(email) {
    const q = query(collection(db, "users"), where("email", "==", email));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const userDoc = snapshot.docs[0];
      return { id: userDoc.id, ...userDoc.data() };
    }
    return void 0;
  }
  async getUserByPhoneNumber(phoneNumber) {
    const q = query(collection(db, "users"), where("phoneNumber", "==", phoneNumber));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const userDoc = snapshot.docs[0];
      return { id: userDoc.id, ...userDoc.data() };
    }
    return void 0;
  }
  async createUser(insertUser) {
    const docRef = await addDoc(collection(db, "users"), {
      ...insertUser,
      createdAt: serverTimestamp()
    });
    const userDoc = await getDoc(docRef);
    return { id: userDoc.id, ...userDoc.data() };
  }
  async updateUserGames(id, availableGames) {
    const userRef = doc(db, "users", id);
    await updateDoc(userRef, { availableGames });
    const userDoc = await getDoc(userRef);
    return { id: userDoc.id, ...userDoc.data() };
  }
  async getAllUsers() {
    const snapshot = await getDocs(collection(db, "users"));
    return snapshot.docs.map((doc2) => ({ id: doc2.id, ...doc2.data() }));
  }
  async updateUser(id, updates) {
    const userRef = doc(db, "users", id);
    await updateDoc(userRef, updates);
    const userDoc = await getDoc(userRef);
    return { id: userDoc.id, ...userDoc.data() };
  }
  async deleteUser(id) {
    await deleteDoc(doc(db, "users", id));
  }
  // Question operations
  async getAllQuestions() {
    const snapshot = await getDocs(collection(db, "questions"));
    return snapshot.docs.map((doc2) => ({ id: doc2.id, ...doc2.data() }));
  }
  async getQuestionsByCategory(category, limitCount) {
    const q = query(
      collection(db, "questions"),
      where("category", "==", category)
    );
    const snapshot = await getDocs(q);
    let questions = snapshot.docs.map((doc2) => ({ id: doc2.id, ...doc2.data() }));
    const difficultyOrder = { "\u0633\u0647\u0644": 1, "\u0645\u062A\u0648\u0633\u0637": 2, "\u0635\u0639\u0628": 3 };
    questions = questions.sort((a, b) => {
      return (difficultyOrder[a.difficulty] || 4) - (difficultyOrder[b.difficulty] || 4);
    });
    return limitCount ? questions.slice(0, limitCount) : questions;
  }
  async getQuestions(category, difficulty) {
    let q = query(collection(db, "questions"));
    if (category) {
      q = query(q, where("category", "==", category));
    }
    if (difficulty) {
      q = query(q, where("difficulty", "==", difficulty));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc2) => ({ id: doc2.id, ...doc2.data() }));
  }
  async getQuestionById(id) {
    const questionDoc = await getDoc(doc(db, "questions", id));
    if (questionDoc.exists()) {
      return { id: questionDoc.id, ...questionDoc.data() };
    }
    return void 0;
  }
  async getRandomQuestions(count) {
    const snapshot = await getDocs(collection(db, "questions"));
    const questions = snapshot.docs.map((doc2) => ({ id: doc2.id, ...doc2.data() }));
    const shuffled = questions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
  async getPublishedQuestionsByCategory(category) {
    const q = query(
      collection(db, "questions"),
      where("category", "==", category),
      where("isPublished", "==", true)
    );
    const snapshot = await getDocs(q);
    let questions = snapshot.docs.map((doc2) => ({ id: doc2.id, ...doc2.data() }));
    const difficultyOrder = { "\u0633\u0647\u0644": 1, "\u0645\u062A\u0648\u0633\u0637": 2, "\u0635\u0639\u0628": 3 };
    return questions.sort((a, b) => {
      return (difficultyOrder[a.difficulty] || 4) - (difficultyOrder[b.difficulty] || 4);
    });
  }
  async createQuestion(insertQuestion) {
    const docRef = await addDoc(collection(db, "questions"), {
      ...insertQuestion,
      isPublished: false,
      createdAt: serverTimestamp()
    });
    const questionDoc = await getDoc(docRef);
    return { id: questionDoc.id, ...questionDoc.data() };
  }
  async updateQuestion(id, updates) {
    const questionRef = doc(db, "questions", id);
    await updateDoc(questionRef, updates);
    const questionDoc = await getDoc(questionRef);
    return { id: questionDoc.id, ...questionDoc.data() };
  }
  async deleteQuestion(id) {
    await deleteDoc(doc(db, "questions", id));
  }
  async publishAllQuestions() {
    const q = query(collection(db, "questions"), where("isPublished", "==", false));
    const snapshot = await getDocs(q);
    const batch = writeBatch(db);
    snapshot.docs.forEach((doc2) => {
      batch.update(doc2.ref, { isPublished: true });
    });
    await batch.commit();
  }
  async unpublishAllQuestions() {
    const q = query(collection(db, "questions"), where("isPublished", "==", true));
    const snapshot = await getDocs(q);
    const batch = writeBatch(db);
    snapshot.docs.forEach((doc2) => {
      batch.update(doc2.ref, { isPublished: false });
    });
    await batch.commit();
  }
  // Game session operations
  async createGameSession(insertSession) {
    const docRef = await addDoc(collection(db, "gameSessions"), {
      ...insertSession,
      createdAt: serverTimestamp()
    });
    const sessionDoc = await getDoc(docRef);
    return { id: sessionDoc.id, ...sessionDoc.data() };
  }
  async getGameSession(id) {
    const sessionDoc = await getDoc(doc(db, "gameSessions", id));
    if (sessionDoc.exists()) {
      return { id: sessionDoc.id, ...sessionDoc.data() };
    }
    return void 0;
  }
  async updateGameSession(id, session2) {
    const sessionRef = doc(db, "gameSessions", id);
    await updateDoc(sessionRef, session2);
    const sessionDoc = await getDoc(sessionRef);
    return { id: sessionDoc.id, ...sessionDoc.data() };
  }
  async getUserGameSessions(userId) {
    const q = query(
      collection(db, "gameSessions"),
      where("userId", "==", userId)
    );
    const snapshot = await getDocs(q);
    const sessions = snapshot.docs.map((doc2) => ({ id: doc2.id, ...doc2.data() }));
    return sessions.sort((a, b) => {
      const aDate = a.createdAt instanceof Timestamp ? a.createdAt.toDate() : new Date(a.createdAt);
      const bDate = b.createdAt instanceof Timestamp ? b.createdAt.toDate() : new Date(b.createdAt);
      return bDate.getTime() - aDate.getTime();
    });
  }
  // Purchase operations
  async createPurchase(purchase) {
    const cleanPurchase = Object.keys(purchase).reduce((acc, key) => {
      if (purchase[key] !== void 0) {
        acc[key] = purchase[key];
      }
      return acc;
    }, {});
    const docRef = await addDoc(collection(db, "purchases"), {
      ...cleanPurchase,
      createdAt: serverTimestamp()
    });
    const purchaseDoc = await getDoc(docRef);
    return { id: purchaseDoc.id, ...purchaseDoc.data() };
  }
  async getUserPurchases(userId) {
    const q = query(
      collection(db, "purchases"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc2) => ({ id: doc2.id, ...doc2.data() }));
  }
  // Category operations
  async getAllCategories() {
    const snapshot = await getDocs(collection(db, "categories"));
    return snapshot.docs.map((doc2) => ({ id: doc2.id, ...doc2.data() }));
  }
  async createCategory(category) {
    const docRef = await addDoc(collection(db, "categories"), {
      ...category,
      createdAt: serverTimestamp()
    });
    const categoryDoc = await getDoc(docRef);
    return { id: categoryDoc.id, ...categoryDoc.data() };
  }
  async updateCategory(id, updates) {
    const categoryRef = doc(db, "categories", id);
    await updateDoc(categoryRef, updates);
    const categoryDoc = await getDoc(categoryRef);
    return { id: categoryDoc.id, ...categoryDoc.data() };
  }
  async deleteCategory(id) {
    try {
      const categoryRef = doc(db, "categories", id);
      const categoryDoc = await getDoc(categoryRef);
      if (!categoryDoc.exists()) {
        throw new Error(`\u0627\u0644\u0641\u0626\u0629 \u0628\u0627\u0644\u0645\u0639\u0631\u0641 ${id} \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F\u0629`);
      }
      await deleteDoc(categoryRef);
    } catch (error) {
      console.error("Firebase deleteCategory error:", error);
      throw error;
    }
  }
  // Coupon operations
  async getAllCoupons() {
    const snapshot = await getDocs(collection(db, "coupons"));
    return snapshot.docs.map((doc2) => ({ id: doc2.id, ...doc2.data() }));
  }
  async getCouponByCode(code) {
    const q = query(collection(db, "coupons"), where("code", "==", code));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const couponDoc = snapshot.docs[0];
      return { id: couponDoc.id, ...couponDoc.data() };
    }
    return void 0;
  }
  async createCoupon(coupon) {
    const docRef = await addDoc(collection(db, "coupons"), {
      ...coupon,
      createdAt: serverTimestamp()
    });
    const couponDoc = await getDoc(docRef);
    return { id: couponDoc.id, ...couponDoc.data() };
  }
  async updateCoupon(id, updates) {
    const couponRef = doc(db, "coupons", id);
    await updateDoc(couponRef, updates);
    const couponDoc = await getDoc(couponRef);
    return { id: couponDoc.id, ...couponDoc.data() };
  }
  async incrementCouponUsage(id) {
    const couponRef = doc(db, "coupons", id);
    await updateDoc(couponRef, { usageCount: increment(1) });
  }
  // Game Package operations
  async getAllGamePackages() {
    const snapshot = await getDocs(collection(db, "gamePackages"));
    return snapshot.docs.map((doc2) => ({ id: doc2.id, ...doc2.data() }));
  }
  async getActiveGamePackages() {
    const q = query(collection(db, "gamePackages"), where("isActive", "==", true));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc2) => ({ id: doc2.id, ...doc2.data() }));
  }
  async createGamePackage(gamePackage) {
    const docRef = await addDoc(collection(db, "gamePackages"), {
      ...gamePackage,
      createdAt: serverTimestamp()
    });
    const packageDoc = await getDoc(docRef);
    return { id: packageDoc.id, ...packageDoc.data() };
  }
  async updateGamePackage(id, updates) {
    const packageRef = doc(db, "gamePackages", id);
    await updateDoc(packageRef, updates);
    const packageDoc = await getDoc(packageRef);
    return { id: packageDoc.id, ...packageDoc.data() };
  }
  async deleteGamePackage(id) {
    await deleteDoc(doc(db, "gamePackages", id));
  }
  // Admin operations
  async getStats() {
    const [usersSnapshot, questionsSnapshot, gamesSnapshot, purchasesSnapshot] = await Promise.all([
      getDocs(collection(db, "users")),
      getDocs(collection(db, "questions")),
      getDocs(query(collection(db, "gameSessions"), where("isCompleted", "==", true))),
      getDocs(collection(db, "purchases"))
    ]);
    const thirtyDaysAgo = /* @__PURE__ */ new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    let monthlyRevenue = 0;
    purchasesSnapshot.docs.forEach((doc2) => {
      const purchase = doc2.data();
      const purchaseDate = purchase.createdAt instanceof Timestamp ? purchase.createdAt.toDate() : new Date(purchase.createdAt);
      if (purchaseDate >= thirtyDaysAgo) {
        monthlyRevenue += purchase.amount;
      }
    });
    return {
      totalUsers: usersSnapshot.size,
      totalQuestions: questionsSnapshot.size,
      totalGamesPlayed: gamesSnapshot.size,
      monthlyRevenue: Math.round(monthlyRevenue / 100)
    };
  }
  // Analytics operations
  async getSalesAnalytics() {
    const [purchasesSnapshot, usersSnapshot] = await Promise.all([
      getDocs(collection(db, "purchases")),
      getDocs(collection(db, "users"))
    ]);
    const purchases = purchasesSnapshot.docs.map((doc2) => ({ id: doc2.id, ...doc2.data() }));
    const users = usersSnapshot.docs.map((doc2) => ({ id: doc2.id, ...doc2.data() }));
    const totalRevenue = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);
    const totalSales = purchases.length;
    const averageOrderValue = totalSales > 0 ? Math.round(totalRevenue / totalSales) : 0;
    const monthlyData = {};
    purchases.forEach((purchase) => {
      const purchaseDate = purchase.createdAt instanceof Timestamp ? purchase.createdAt.toDate() : new Date(purchase.createdAt);
      const monthKey = `${purchaseDate.getFullYear()}-${String(purchaseDate.getMonth() + 1).padStart(2, "0")}`;
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { revenue: 0, sales: 0 };
      }
      monthlyData[monthKey].revenue += purchase.amount;
      monthlyData[monthKey].sales += 1;
    });
    const monthlyRevenue = Object.entries(monthlyData).map(([month, data]) => ({
      month,
      revenue: Math.round(data.revenue / 100),
      sales: data.sales
    })).sort((a, b) => a.month.localeCompare(b.month));
    const packageData = {};
    purchases.forEach((purchase) => {
      if (!packageData[purchase.gameCount]) {
        packageData[purchase.gameCount] = { sales: 0, revenue: 0 };
      }
      packageData[purchase.gameCount].sales += 1;
      packageData[purchase.gameCount].revenue += purchase.amount;
    });
    const topGamePackages = Object.entries(packageData).map(([gameCount, data]) => ({
      name: `\u0628\u0627\u0642\u0629 ${gameCount} \u0623\u0644\u0639\u0627\u0628`,
      sales: data.sales,
      revenue: Math.round(data.revenue / 100)
    })).sort((a, b) => b.sales - a.sales).slice(0, 5);
    const recentSales = purchases.sort((a, b) => {
      const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate() : new Date(a.createdAt);
      const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate() : new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    }).slice(0, 10).map((purchase) => {
      const user = users.find((u) => u.id === purchase.userId);
      const purchaseDate = purchase.createdAt instanceof Timestamp ? purchase.createdAt.toDate() : new Date(purchase.createdAt);
      return {
        id: purchase.id,
        userName: user?.name || "Unknown",
        packageName: `\u0628\u0627\u0642\u0629 ${purchase.gameCount} \u0623\u0644\u0639\u0627\u0628`,
        amount: Math.round(purchase.amount / 100),
        gameCount: purchase.gameCount,
        date: purchaseDate.toLocaleString("ar-SA"),
        couponCode: purchase.couponCode,
        discountAmount: purchase.discountAmount ? Math.round(purchase.discountAmount / 100) : void 0
      };
    });
    return {
      totalRevenue: Math.round(totalRevenue / 100),
      totalSales,
      averageOrderValue: Math.round(averageOrderValue / 100),
      monthlyRevenue,
      topGamePackages,
      recentSales
    };
  }
  async getActiveCategories() {
    const q = query(collection(db, "categories"), where("isActive", "==", true));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc2) => ({ id: doc2.id, ...doc2.data() }));
  }
};
var storage2 = new FirebaseStorage();

// shared/firebase-schema.ts
import { z } from "zod";
var userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  phoneNumber: z.string().min(8, "\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062A\u0641 \u064A\u062C\u0628 \u0623\u0646 \u064A\u0643\u0648\u0646 8 \u0623\u0631\u0642\u0627\u0645 \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644"),
  name: z.string(),
  password: z.string(),
  availableGames: z.number().default(0),
  isAdmin: z.boolean().default(false),
  createdAt: z.any()
  // Firebase Timestamp
});
var insertUserSchema = userSchema.omit({ id: true, createdAt: true });
var questionSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
  category: z.string(),
  difficulty: z.enum(["\u0633\u0647\u0644", "\u0645\u062A\u0648\u0633\u0637", "\u0635\u0639\u0628"]),
  hint: z.string(),
  explanation: z.string().optional(),
  imageUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  isPublished: z.boolean().default(false),
  createdAt: z.any()
  // Firebase Timestamp
});
var insertQuestionSchema = questionSchema.omit({ id: true, createdAt: true, isPublished: true });
var gameSessionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  gameType: z.enum(["single", "team"]),
  teams: z.array(z.string()).optional(),
  categories: z.array(z.string()),
  questions: z.array(z.string()),
  // Array of question IDs
  usedQuestions: z.array(z.string()).default([]),
  currentQuestionIndex: z.number().default(0),
  isCompleted: z.boolean().default(false),
  scores: z.record(z.number()).default({}),
  teamHintsUsed: z.array(z.string()).default([]),
  createdAt: z.any()
  // Firebase Timestamp
});
var insertGameSessionSchema = gameSessionSchema.omit({ id: true, createdAt: true });
var purchaseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  amount: z.number(),
  gameCount: z.number(),
  couponCode: z.string().optional(),
  discountAmount: z.number().optional(),
  createdAt: z.any()
  // Firebase Timestamp
});
var insertPurchaseSchema = purchaseSchema.omit({ id: true, createdAt: true });
var categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  displayName: z.string(),
  description: z.string().optional(),
  logoUrl: z.string().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.any()
  // Firebase Timestamp
});
var insertCategorySchema = categorySchema.omit({ id: true, createdAt: true });
var couponSchema = z.object({
  id: z.string(),
  code: z.string(),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.number(),
  maxUsage: z.number(),
  usageCount: z.number().default(0),
  expiresAt: z.any(),
  // Firebase Timestamp
  isActive: z.boolean().default(true),
  createdAt: z.any()
  // Firebase Timestamp
});
var insertCouponSchema = couponSchema.omit({ id: true, createdAt: true, usageCount: true });
var gamePackageSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  gameCount: z.number(),
  priceInCents: z.number(),
  sortOrder: z.number(),
  isActive: z.boolean().default(true),
  createdAt: z.any()
  // Firebase Timestamp
});
var insertGamePackageSchema = gamePackageSchema.omit({ id: true, createdAt: true });

// server/routes.ts
import { z as z2 } from "zod";
import Stripe from "stripe";

// server/firebase-auth.ts
var verifyIdToken = async (idToken) => {
  try {
    const base64Url = idToken.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(atob(base64).split("").map(function(c) {
      return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(""));
    const payload = JSON.parse(jsonPayload);
    if (!payload.email || !payload.sub) {
      throw new Error("Invalid token payload");
    }
    return {
      uid: payload.sub,
      email: payload.email,
      name: payload.name || payload.email.split("@")[0],
      picture: payload.picture,
      email_verified: payload.email_verified || false
    };
  } catch (error) {
    console.error("Error verifying ID token:", error);
    throw new Error("Invalid ID token");
  }
};
var createOrUpdateFirebaseUser = async (decodedToken) => {
  try {
    let user = await storage2.getUserByEmail(decodedToken.email);
    if (user) {
      return user;
    } else {
      const newUser = await storage2.createUser({
        email: decodedToken.email,
        name: decodedToken.name || decodedToken.email.split("@")[0],
        phoneNumber: "",
        // Google auth doesn't provide phone number
        password: "",
        // No password for Google auth users
        availableGames: 2,
        // Give 2 free games to new users
        isAdmin: false
      });
      return newUser;
    }
  } catch (error) {
    console.error("Error creating/updating Firebase user:", error);
    throw error;
  }
};

// server/routes.ts
var stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_...", {
  apiVersion: "2024-06-20"
});
var upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024
    // 50MB limit for videos
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("\u064A\u062C\u0628 \u0623\u0646 \u064A\u0643\u0648\u0646 \u0627\u0644\u0645\u0644\u0641 \u0635\u0648\u0631\u0629 \u0623\u0648 \u0641\u064A\u062F\u064A\u0648"));
    }
  }
});
async function registerRoutes(app3) {
  app3.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app3.use(session({
    secret: process.env.SESSION_SECRET || "default-secret-key-for-development",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 24 * 60 * 60 * 1e3,
      // 24 hours
      httpOnly: true,
      sameSite: "lax"
    },
    name: "trivia.session"
  }));
  app3.use(passport.initialize());
  app3.use(passport.session());
  passport.use(new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await storage2.getUserByEmail(email);
        if (!user) {
          return done(null, false, { message: "\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u063A\u064A\u0631 \u0635\u062D\u064A\u062D" });
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return done(null, false, { message: "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u063A\u064A\u0631 \u0635\u062D\u064A\u062D\u0629" });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage2.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  app3.post("/api/upload", upload.single("file"), async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "\u063A\u064A\u0631 \u0645\u0633\u062C\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" });
    }
    const user = req.user;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "\u063A\u064A\u0631 \u0645\u0635\u0631\u062D \u0628\u0627\u0644\u0648\u0635\u0648\u0644" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "\u0644\u0645 \u064A\u062A\u0645 \u0631\u0641\u0639 \u0623\u064A \u0645\u0644\u0641" });
    }
    const fileType = req.body.type || "image";
    if (fileType === "video" && !req.file.mimetype.startsWith("video/")) {
      return res.status(400).json({ message: "\u0646\u0648\u0639 \u0627\u0644\u0645\u0644\u0641 \u063A\u064A\u0631 \u0635\u062D\u064A\u062D. \u064A\u062C\u0628 \u0623\u0646 \u064A\u0643\u0648\u0646 \u0641\u064A\u062F\u064A\u0648" });
    }
    if (fileType === "image" && !req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({ message: "\u0646\u0648\u0639 \u0627\u0644\u0645\u0644\u0641 \u063A\u064A\u0631 \u0635\u062D\u064A\u062D. \u064A\u062C\u0628 \u0623\u0646 \u062A\u0643\u0648\u0646 \u0635\u0648\u0631\u0629" });
    }
    const maxSizeImage = 10 * 1024 * 1024;
    const maxSizeVideo = 50 * 1024 * 1024;
    if (fileType === "image" && req.file.size > maxSizeImage) {
      return res.status(400).json({ message: "\u062D\u062C\u0645 \u0627\u0644\u0635\u0648\u0631\u0629 \u0643\u0628\u064A\u0631 \u062C\u062F\u0627\u064B. \u0627\u0644\u062D\u062F \u0627\u0644\u0623\u0642\u0635\u0649 10 \u0645\u064A\u062C\u0627\u0628\u0627\u064A\u062A" });
    }
    if (fileType === "video" && req.file.size > maxSizeVideo) {
      return res.status(400).json({ message: "\u062D\u062C\u0645 \u0627\u0644\u0641\u064A\u062F\u064A\u0648 \u0643\u0628\u064A\u0631 \u062C\u062F\u0627\u064B. \u0627\u0644\u062D\u062F \u0627\u0644\u0623\u0642\u0635\u0649 50 \u0645\u064A\u062C\u0627\u0628\u0627\u064A\u062A" });
    }
    try {
      const { getStorage: getStorage2, ref, uploadBytes, getDownloadURL } = await import("firebase/storage");
      const storage3 = getStorage2();
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2);
      const fileExtension = req.file.originalname.split(".").pop();
      const folder = fileType === "video" ? "videos" : "images";
      const fileName = `${folder}/${timestamp}_${randomId}.${fileExtension}`;
      const storageRef = ref(storage3, fileName);
      const snapshot = await uploadBytes(storageRef, req.file.buffer);
      const downloadURL = await getDownloadURL(snapshot.ref);
      res.json({ url: downloadURL, type: fileType });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "\u062E\u0637\u0623 \u0641\u064A \u0631\u0641\u0639 \u0627\u0644\u0645\u0644\u0641" });
    }
  });
  app3.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, name, phoneNumber } = insertUserSchema.parse(req.body);
      const existingUserByEmail = await storage2.getUserByEmail(email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0645\u0633\u062A\u062E\u062F\u0645 \u0628\u0627\u0644\u0641\u0639\u0644" });
      }
      const existingUserByPhone = await storage2.getUserByPhoneNumber(phoneNumber);
      if (existingUserByPhone) {
        return res.status(400).json({ message: "\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062A\u0641 \u0645\u0633\u062A\u062E\u062F\u0645 \u0628\u0627\u0644\u0641\u0639\u0644" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage2.createUser({
        email,
        phoneNumber,
        password: hashedPassword,
        name,
        availableGames: 2,
        isAdmin: false
      });
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "\u062E\u0637\u0623 \u0641\u064A \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" });
        }
        res.json({ user: { id: user.id, email: user.email, name: user.name, phoneNumber: user.phoneNumber, availableGames: user.availableGames, isAdmin: user.isAdmin } });
      });
    } catch (error) {
      console.error("Registration error:", error);
      if (error instanceof z2.ZodError) {
        const arabicErrors = error.errors.map((err) => {
          if (err.path.includes("phoneNumber")) {
            return "\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062A\u0641 \u063A\u064A\u0631 \u0635\u062D\u064A\u062D";
          }
          return err.message;
        });
        return res.status(400).json({ message: arabicErrors.join(", ") });
      }
      res.status(400).json({ message: "\u062E\u0637\u0623 \u0641\u064A \u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u062D\u0633\u0627\u0628" });
    }
  });
  app3.post("/api/auth/login", passport.authenticate("local"), (req, res) => {
    const user = req.user;
    res.json({ user: { id: user.id, email: user.email, name: user.name, phoneNumber: user.phoneNumber, availableGames: user.availableGames, isAdmin: user.isAdmin } });
  });
  app3.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "\u062E\u0637\u0623 \u0641\u064A \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062E\u0631\u0648\u062C" });
      }
      res.json({ message: "\u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062E\u0631\u0648\u062C \u0628\u0646\u062C\u0627\u062D" });
    });
  });
  app3.get("/api/auth/me", (req, res) => {
    if (req.isAuthenticated()) {
      const user = req.user;
      res.json({ user: { id: user.id, email: user.email, name: user.name, phoneNumber: user.phoneNumber, availableGames: user.availableGames, isAdmin: user.isAdmin } });
    } else {
      res.status(401).json({ message: "\u063A\u064A\u0631 \u0645\u0633\u062C\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" });
    }
  });
  app3.post("/api/auth/google", async (req, res) => {
    try {
      const { idToken } = req.body;
      if (!idToken) {
        return res.status(400).json({ message: "\u0645\u0639\u0631\u0641 \u0627\u0644\u062A\u0648\u0643\u0646 \u0645\u0637\u0644\u0648\u0628" });
      }
      const decodedToken = await verifyIdToken(idToken);
      const user = await createOrUpdateFirebaseUser(decodedToken);
      req.login(user, (err) => {
        if (err) {
          console.error("Error creating session:", err);
          return res.status(500).json({ message: "\u062E\u0637\u0623 \u0641\u064A \u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u062C\u0644\u0633\u0629" });
        }
        res.json({ user: { id: user.id, email: user.email, name: user.name, availableGames: user.availableGames, isAdmin: user.isAdmin } });
      });
    } catch (error) {
      console.error("Google auth error:", error);
      res.status(401).json({ message: "\u062E\u0637\u0623 \u0641\u064A \u0627\u0644\u062A\u062D\u0642\u0642 \u0645\u0646 \u0647\u0648\u064A\u0629 \u062C\u0648\u062C\u0644" });
    }
  });
  app3.post("/api/games/start", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "\u063A\u064A\u0631 \u0645\u0633\u062C\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" });
    }
    const user = req.user;
    const { gameType = "single", teams = [], selectedCategories = [] } = req.body;
    if (user.availableGames <= 0) {
      return res.status(400).json({ message: "\u0644\u0627 \u062A\u0648\u062C\u062F \u0623\u0644\u0639\u0627\u0628 \u0645\u062A\u0627\u062D\u0629" });
    }
    try {
      if (gameType === "team") {
        const allCategories = await storage2.getAllCategories();
        const activeCategories = allCategories.filter((cat) => cat.isActive);
        if (!selectedCategories || selectedCategories.length === 0) {
          return res.status(400).json({ message: "\u064A\u062C\u0628 \u0627\u062E\u062A\u064A\u0627\u0631 \u0627\u0644\u0641\u0626\u0627\u062A \u0627\u0644\u0645\u0637\u0644\u0648\u0628\u0629" });
        }
        const requiredCategoriesCount = Math.min(6, activeCategories.length);
        if (selectedCategories.length !== requiredCategoriesCount) {
          return res.status(400).json({ message: `\u064A\u062C\u0628 \u0627\u062E\u062A\u064A\u0627\u0631 ${requiredCategoriesCount} \u0641\u0626\u0627\u062A` });
        }
        const validCategoryNames = activeCategories.map((cat) => cat.name);
        const invalidCategories = selectedCategories.filter((cat) => !validCategoryNames.includes(cat));
        if (invalidCategories.length > 0) {
          return res.status(400).json({ message: `\u0641\u0626\u0627\u062A \u063A\u064A\u0631 \u0635\u062D\u064A\u062D\u0629: ${invalidCategories.join(", ")}` });
        }
        if (!teams || teams.length !== 2 || teams.some((team) => !team || !team.trim())) {
          return res.status(400).json({ message: "\u064A\u062C\u0628 \u0625\u062F\u062E\u0627\u0644 \u0627\u0633\u0645\u064A\u0646 \u0635\u062D\u064A\u062D\u064A\u0646 \u0644\u0644\u0641\u0631\u064A\u0642\u064A\u0646" });
        }
        const questionsByCategory = {};
        for (const category of selectedCategories) {
          const dbCategory = activeCategories.find((cat) => cat.name === category);
          const categoryDisplayName = dbCategory ? dbCategory.displayName : category;
          let categoryQuestions = await storage2.getQuestionsByCategory(category, 6);
          if (categoryQuestions.length < 6) {
            categoryQuestions = await storage2.getQuestionsByCategory(categoryDisplayName, 6);
          }
          if (categoryQuestions.length < 6) {
            console.log(`Only ${categoryQuestions.length} questions available for ${category}/${categoryDisplayName}, need 6`);
            return res.status(400).json({ message: `\u0644\u0627 \u062A\u0648\u062C\u062F \u0623\u0633\u0626\u0644\u0629 \u0643\u0627\u0641\u064A\u0629 \u0641\u064A \u0641\u0626\u0629 ${categoryDisplayName}` });
          }
          const orderedQuestions = categoryQuestions.sort((a, b) => {
            const difficultyOrder = { "\u0633\u0647\u0644": 1, "\u0645\u062A\u0648\u0633\u0637": 2, "\u0635\u0639\u0628": 3 };
            return (difficultyOrder[a.difficulty] || 4) - (difficultyOrder[b.difficulty] || 4);
          });
          questionsByCategory[category] = orderedQuestions;
        }
        const organizedQuestions = [];
        for (const category of selectedCategories) {
          organizedQuestions.push(...questionsByCategory[category]);
        }
        const gameSession2 = await storage2.createGameSession({
          userId: user.id,
          questionIds: organizedQuestions.map((q) => q.id),
          currentQuestionIndex: 0,
          score: 0,
          isCompleted: false,
          gameType,
          teams: gameType === "team" ? teams : [],
          teamScores: teams.map(() => 0),
          teamHintsUsed: teams.map(() => false),
          currentTurn: 0,
          usedQuestions: [],
          selectedCategories: gameType === "team" ? selectedCategories : []
        });
        await storage2.updateUserGames(user.id, user.availableGames - 1);
        res.json({
          gameSession: {
            id: gameSession2.id,
            currentQuestionIndex: gameSession2.currentQuestionIndex,
            score: gameSession2.score,
            totalQuestions: organizedQuestions.length,
            gameType: gameSession2.gameType,
            teams: gameSession2.teams,
            teamScores: gameSession2.teamScores,
            currentTurn: gameSession2.currentTurn
          },
          currentQuestion: null
        });
        return;
      }
      const questions = await storage2.getRandomQuestions(36);
      if (questions.length < 36) {
        console.log(`Only ${questions.length} questions available, need 36`);
        return res.status(400).json({ message: "\u0644\u0627 \u062A\u0648\u062C\u062F \u0623\u0633\u0626\u0644\u0629 \u0643\u0627\u0641\u064A\u0629 \u0641\u064A \u0642\u0627\u0639\u062F\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A" });
      }
      const gameSession = await storage2.createGameSession({
        userId: user.id,
        questionIds: questions.map((q) => q.id),
        currentQuestionIndex: 0,
        score: 0,
        isCompleted: false,
        gameType,
        teams: gameType === "team" ? teams : [],
        teamScores: teams.map(() => 0),
        teamHintsUsed: teams.map(() => false),
        currentTurn: 0,
        usedQuestions: []
      });
      await storage2.updateUserGames(user.id, user.availableGames - 1);
      res.json({
        gameSession: {
          id: gameSession.id,
          currentQuestionIndex: gameSession.currentQuestionIndex,
          score: gameSession.score,
          totalQuestions: questions.length,
          gameType: gameSession.gameType,
          teams: gameSession.teams,
          teamScores: gameSession.teamScores,
          currentTurn: gameSession.currentTurn
        },
        currentQuestion: gameType === "single" ? questions[0] : null
      });
    } catch (error) {
      console.error("Start game error:", error);
      res.status(500).json({ message: "\u062E\u0637\u0623 \u0641\u064A \u0628\u062F\u0621 \u0627\u0644\u0644\u0639\u0628\u0629: " + error.message });
    }
  });
  app3.get("/api/games/history", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "\u063A\u064A\u0631 \u0645\u0633\u062C\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" });
    }
    try {
      const user = req.user;
      const gameSessions = await storage2.getUserGameSessions(user.id);
      res.json({ gameSessions: gameSessions.filter((session2) => session2.isCompleted) });
    } catch (error) {
      console.error("Games history error:", error);
      res.status(500).json({ message: "\u062E\u0637\u0623 \u0641\u064A \u062C\u0644\u0628 \u0633\u062C\u0644 \u0627\u0644\u0623\u0644\u0639\u0627\u0628: " + error.message });
    }
  });
  app3.get("/api/games/active", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "\u063A\u064A\u0631 \u0645\u0633\u062C\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" });
    }
    try {
      const user = req.user;
      const gameSessions = await storage2.getUserGameSessions(user.id);
      const activeSessions = gameSessions.filter((session2) => !session2.isCompleted);
      const activeSession = activeSessions.length > 0 ? activeSessions[0] : null;
      res.json({ activeSession: activeSession || null });
    } catch (error) {
      console.error("Active games error:", error);
      res.status(500).json({ message: "\u062E\u0637\u0623 \u0641\u064A \u062C\u0644\u0628 \u0627\u0644\u0623\u0644\u0639\u0627\u0628 \u0627\u0644\u0646\u0634\u0637\u0629: " + error.message });
    }
  });
  app3.get("/api/games/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "\u063A\u064A\u0631 \u0645\u0633\u062C\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" });
    }
    try {
      const gameSession = await storage2.getGameSession(req.params.id);
      if (!gameSession) {
        console.log(`Game session not found: ${req.params.id}`);
        return res.status(404).json({ message: "\u062C\u0644\u0633\u0629 \u0627\u0644\u0644\u0639\u0628\u0629 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F\u0629" });
      }
      const user = req.user;
      if (gameSession.userId !== user.id) {
        console.log(`Access denied for user ${user.id} to game ${req.params.id}`);
        return res.status(403).json({ message: "\u063A\u064A\u0631 \u0645\u0635\u0631\u062D \u0628\u0627\u0644\u0648\u0635\u0648\u0644" });
      }
      if (gameSession.gameType === "team") {
        const questions = await Promise.all(
          gameSession.questionIds.map(async (id) => {
            try {
              return await storage2.getQuestionById(id);
            } catch (error) {
              console.error(`Error loading question ${id}:`, error);
              return null;
            }
          })
        );
        const validQuestions = questions.filter((q) => q !== null);
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
            selectedCategories: gameSession.selectedCategories || []
          },
          questions: validQuestions
        });
      }
      if (!gameSession.questionIds || gameSession.questionIds.length === 0) {
        return res.status(400).json({ message: "\u0644\u0627 \u062A\u0648\u062C\u062F \u0623\u0633\u0626\u0644\u0629 \u0641\u064A \u0647\u0630\u0647 \u0627\u0644\u062C\u0644\u0633\u0629" });
      }
      const currentIndex = gameSession.currentQuestionIndex || 0;
      if (currentIndex >= gameSession.questionIds.length) {
        return res.json({
          gameSession: {
            id: gameSession.id,
            currentQuestionIndex: currentIndex,
            score: gameSession.score || 0,
            totalQuestions: gameSession.questionIds.length,
            isCompleted: true,
            gameType: gameSession.gameType || "single"
          },
          currentQuestion: null
        });
      }
      const questionId = gameSession.questionIds[currentIndex];
      const question = await storage2.getQuestionById(questionId);
      if (!question) {
        console.error(`Question not found: ${questionId}`);
        return res.status(500).json({ message: "\u0627\u0644\u0633\u0624\u0627\u0644 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F" });
      }
      res.json({
        gameSession: {
          id: gameSession.id,
          currentQuestionIndex: currentIndex,
          score: gameSession.score || 0,
          totalQuestions: gameSession.questionIds.length,
          isCompleted: gameSession.isCompleted || false,
          gameType: gameSession.gameType || "single"
        },
        currentQuestion: question
      });
    } catch (error) {
      console.error("Error loading game session:", error);
      res.status(500).json({ message: "\u062E\u0637\u0623 \u0641\u064A \u062C\u0644\u0628 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0644\u0639\u0628\u0629: " + error.message });
    }
  });
  app3.post("/api/games/:id/complete", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "\u063A\u064A\u0631 \u0645\u0633\u062C\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" });
    }
    try {
      const gameSession = await storage2.getGameSession(req.params.id);
      if (!gameSession) {
        return res.status(404).json({ message: "\u062C\u0644\u0633\u0629 \u0627\u0644\u0644\u0639\u0628\u0629 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F\u0629" });
      }
      const user = req.user;
      if (gameSession.userId !== user.id) {
        return res.status(403).json({ message: "\u063A\u064A\u0631 \u0645\u0635\u0631\u062D \u0628\u0627\u0644\u0648\u0635\u0648\u0644" });
      }
      await storage2.updateGameSession(gameSession.id, {
        isCompleted: true
      });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "\u062E\u0637\u0623 \u0641\u064A \u0625\u0646\u0647\u0627\u0621 \u0627\u0644\u0644\u0639\u0628\u0629" });
    }
  });
  app3.post("/api/games/:id/team-correct", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "\u063A\u064A\u0631 \u0645\u0633\u062C\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" });
    }
    try {
      const gameSession = await storage2.getGameSession(req.params.id);
      if (!gameSession) {
        return res.status(404).json({ message: "\u062C\u0644\u0633\u0629 \u0627\u0644\u0644\u0639\u0628\u0629 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F\u0629" });
      }
      const user = req.user;
      if (gameSession.userId !== user.id) {
        return res.status(403).json({ message: "\u063A\u064A\u0631 \u0645\u0635\u0631\u062D \u0628\u0627\u0644\u0648\u0635\u0648\u0644" });
      }
      const { teamIndex, questionKey } = req.body;
      const [, questionIndex] = questionKey.split("-");
      const index = parseInt(questionIndex);
      const points = index < 2 ? 200 : index < 4 ? 400 : 600;
      const newTeamScores = [...gameSession.teamScores];
      newTeamScores[teamIndex] = (newTeamScores[teamIndex] || 0) + points;
      const newUsedQuestions = [...gameSession.usedQuestions || [], questionKey];
      const newCurrentTurn = (gameSession.currentTurn + 1) % gameSession.teams.length;
      await storage2.updateGameSession(gameSession.id, {
        teamScores: newTeamScores,
        usedQuestions: newUsedQuestions,
        currentTurn: newCurrentTurn
      });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "\u062E\u0637\u0623 \u0641\u064A \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u0646\u0642\u0637\u0629: " + error.message });
    }
  });
  app3.post("/api/games/:id/skip-question", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "\u063A\u064A\u0631 \u0645\u0633\u062C\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" });
    }
    try {
      const gameSession = await storage2.getGameSession(req.params.id);
      if (!gameSession) {
        return res.status(404).json({ message: "\u062C\u0644\u0633\u0629 \u0627\u0644\u0644\u0639\u0628\u0629 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F\u0629" });
      }
      const user = req.user;
      if (gameSession.userId !== user.id) {
        return res.status(403).json({ message: "\u063A\u064A\u0631 \u0645\u0635\u0631\u062D \u0628\u0627\u0644\u0648\u0635\u0648\u0644" });
      }
      const { questionKey } = req.body;
      const newUsedQuestions = [...gameSession.usedQuestions || [], questionKey];
      const newCurrentTurn = (gameSession.currentTurn + 1) % gameSession.teams.length;
      await storage2.updateGameSession(gameSession.id, {
        usedQuestions: newUsedQuestions,
        currentTurn: newCurrentTurn
      });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "\u062E\u0637\u0623 \u0641\u064A \u062A\u062E\u0637\u064A \u0627\u0644\u0633\u0624\u0627\u0644" });
    }
  });
  app3.post("/api/games/:id/use-hint", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "\u063A\u064A\u0631 \u0645\u0633\u062C\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" });
    }
    try {
      const gameSession = await storage2.getGameSession(req.params.id);
      if (!gameSession) {
        return res.status(404).json({ message: "\u062C\u0644\u0633\u0629 \u0627\u0644\u0644\u0639\u0628\u0629 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F\u0629" });
      }
      const user = req.user;
      if (gameSession.userId !== user.id) {
        return res.status(403).json({ message: "\u063A\u064A\u0631 \u0645\u0635\u0631\u062D \u0628\u0627\u0644\u0648\u0635\u0648\u0644" });
      }
      const { questionKey, teamIndex } = req.body;
      if (gameSession.gameType === "team") {
        const teamHintsUsed = gameSession.teamHintsUsed || [];
        if (teamHintsUsed[teamIndex]) {
          return res.status(400).json({ message: "\u0647\u0630\u0627 \u0627\u0644\u0641\u0631\u064A\u0642 \u0627\u0633\u062A\u062E\u062F\u0645 \u0627\u0644\u062A\u0644\u0645\u064A\u062D \u0628\u0627\u0644\u0641\u0639\u0644" });
        }
        const newTeamHintsUsed = [...teamHintsUsed];
        newTeamHintsUsed[teamIndex] = true;
        const newUsedHints = [...gameSession.usedHints || [], questionKey];
        await storage2.updateGameSession(gameSession.id, {
          usedHints: newUsedHints,
          teamHintsUsed: newTeamHintsUsed
        });
      } else {
        if (gameSession.usedHints?.includes(questionKey)) {
          return res.status(400).json({ message: "\u062A\u0645 \u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0627\u0644\u062A\u0644\u0645\u064A\u062D \u0644\u0647\u0630\u0627 \u0627\u0644\u0633\u0624\u0627\u0644 \u0645\u0646 \u0642\u0628\u0644" });
        }
        const newUsedHints = [...gameSession.usedHints || [], questionKey];
        await storage2.updateGameSession(gameSession.id, {
          usedHints: newUsedHints
        });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Use hint error:", error);
      res.status(500).json({ message: "\u062E\u0637\u0623 \u0641\u064A \u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0627\u0644\u062A\u0644\u0645\u064A\u062D: " + error.message });
    }
  });
  app3.post("/api/games/:id/switch-turn", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "\u063A\u064A\u0631 \u0645\u0633\u062C\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" });
    }
    try {
      const gameSession = await storage2.getGameSession(req.params.id);
      if (!gameSession) {
        return res.status(404).json({ message: "\u062C\u0644\u0633\u0629 \u0627\u0644\u0644\u0639\u0628\u0629 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F\u0629" });
      }
      const user = req.user;
      if (gameSession.userId !== user.id) {
        return res.status(403).json({ message: "\u063A\u064A\u0631 \u0645\u0635\u0631\u062D \u0628\u0627\u0644\u0648\u0635\u0648\u0644" });
      }
      const newCurrentTurn = (gameSession.currentTurn + 1) % gameSession.teams.length;
      await storage2.updateGameSession(gameSession.id, {
        currentTurn: newCurrentTurn
      });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "\u062E\u0637\u0623 \u0641\u064A \u062A\u0628\u062F\u064A\u0644 \u0627\u0644\u062F\u0648\u0631" });
    }
  });
  app3.post("/api/games/:id/adjust-score", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "\u063A\u064A\u0631 \u0645\u0633\u062C\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" });
    }
    try {
      const gameSession = await storage2.getGameSession(req.params.id);
      if (!gameSession) {
        return res.status(404).json({ message: "\u062C\u0644\u0633\u0629 \u0627\u0644\u0644\u0639\u0628\u0629 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F\u0629" });
      }
      const user = req.user;
      if (gameSession.userId !== user.id) {
        return res.status(403).json({ message: "\u063A\u064A\u0631 \u0645\u0635\u0631\u062D \u0628\u0627\u0644\u0648\u0635\u0648\u0644" });
      }
      const { teamIndex, scoreChange } = req.body;
      if (teamIndex < 0 || teamIndex >= gameSession.teams.length) {
        return res.status(400).json({ message: "\u0631\u0642\u0645 \u0627\u0644\u0641\u0631\u064A\u0642 \u063A\u064A\u0631 \u0635\u062D\u064A\u062D" });
      }
      const newTeamScores = [...gameSession.teamScores];
      newTeamScores[teamIndex] = Math.max(0, (newTeamScores[teamIndex] || 0) + scoreChange);
      await storage2.updateGameSession(gameSession.id, {
        teamScores: newTeamScores
      });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "\u062E\u0637\u0623 \u0641\u064A \u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0646\u0642\u0627\u0637" });
    }
  });
  app3.post("/api/games/:id/next", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "\u063A\u064A\u0631 \u0645\u0633\u062C\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" });
    }
    try {
      const gameSession = await storage2.getGameSession(req.params.id);
      if (!gameSession) {
        return res.status(404).json({ message: "\u062C\u0644\u0633\u0629 \u0627\u0644\u0644\u0639\u0628\u0629 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F\u0629" });
      }
      const user = req.user;
      if (gameSession.userId !== user.id) {
        return res.status(403).json({ message: "\u063A\u064A\u0631 \u0645\u0635\u0631\u062D \u0628\u0627\u0644\u0648\u0635\u0648\u0644" });
      }
      const { answered } = req.body;
      const newScore = answered ? gameSession.score + 1 : gameSession.score;
      const newIndex = gameSession.currentQuestionIndex + 1;
      const isCompleted = newIndex >= gameSession.questionIds.length;
      await storage2.updateGameSession(gameSession.id, {
        currentQuestionIndex: newIndex,
        score: newScore,
        isCompleted,
        completedAt: isCompleted ? /* @__PURE__ */ new Date() : void 0
      });
      if (isCompleted) {
        return res.json({
          gameSession: {
            id: gameSession.id,
            currentQuestionIndex: newIndex,
            score: newScore,
            totalQuestions: gameSession.questionIds.length,
            isCompleted: true
          },
          completed: true
        });
      }
      const questionId = gameSession.questionIds[newIndex];
      const question = await storage2.getQuestionById(questionId);
      res.json({
        gameSession: {
          id: gameSession.id,
          currentQuestionIndex: newIndex,
          score: newScore,
          totalQuestions: gameSession.questionIds.length,
          isCompleted: false
        },
        currentQuestion: question
      });
    } catch (error) {
      res.status(500).json({ message: "\u062E\u0637\u0623 \u0641\u064A \u0627\u0644\u0627\u0646\u062A\u0642\u0627\u0644 \u0644\u0644\u0633\u0624\u0627\u0644 \u0627\u0644\u062A\u0627\u0644\u064A" });
    }
  });
  app3.post("/api/add-games", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "\u063A\u064A\u0631 \u0645\u0633\u062C\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" });
    }
    try {
      const { gameCount } = req.body;
      const user = req.user;
      await storage2.updateUserGames(user.id, user.availableGames + gameCount);
      res.json({ success: true, message: "\u062A\u0645 \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0623\u0644\u0639\u0627\u0628 \u0628\u0646\u062C\u0627\u062D" });
    } catch (error) {
      console.error("Add games error:", error);
      res.status(500).json({ message: "\u062E\u0637\u0623 \u0641\u064A \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0623\u0644\u0639\u0627\u0628: " + error.message });
    }
  });
  app3.post("/api/create-payment-intent", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "\u063A\u064A\u0631 \u0645\u0633\u062C\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" });
    }
    try {
      const { gameCount, couponCode } = req.body;
      const user = req.user;
      const gamePackages = await storage2.getActiveGamePackages();
      const gamePackage = gamePackages.find((pkg) => pkg.gameCount === gameCount);
      if (!gamePackage) {
        return res.status(400).json({ message: "\u0628\u0627\u0642\u0629 \u0627\u0644\u0623\u0644\u0639\u0627\u0628 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F\u0629" });
      }
      let amount = gamePackage.price;
      let discountAmount = 0;
      let validCoupon = null;
      if (couponCode) {
        const coupon = await storage2.getCouponByCode(couponCode);
        if (coupon && coupon.isActive) {
          const now = /* @__PURE__ */ new Date();
          const isNotExpired = !coupon.expiresAt || now <= new Date(coupon.expiresAt);
          const hasUsageLeft = !coupon.maxUsage || coupon.usageCount < coupon.maxUsage;
          if (isNotExpired && hasUsageLeft) {
            validCoupon = coupon;
            if (coupon.discountType === "percentage") {
              discountAmount = Math.round(amount * (coupon.discountValue / 100));
            } else {
              discountAmount = Math.min(coupon.discountValue, amount);
            }
            amount = Math.max(0, amount - discountAmount);
          }
        }
      }
      const stripeAmount = Math.round(amount * 100);
      if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith("sk_")) {
        try {
          const Stripe2 = __require("stripe");
          const stripe2 = new Stripe2(process.env.STRIPE_SECRET_KEY);
          const paymentIntent = await stripe2.paymentIntents.create({
            amount: stripeAmount,
            currency: "kwd",
            metadata: {
              userId: user.id,
              gameCount: gameCount.toString(),
              originalAmount: gamePackage.price.toString(),
              discountAmount: discountAmount.toString(),
              couponCode: couponCode || ""
            }
          });
          res.json({
            clientSecret: paymentIntent.client_secret,
            amount,
            discountAmount
          });
        } catch (stripeError) {
          console.error("Stripe creation error:", stripeError);
          const mockClientSecret = `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`;
          res.json({
            clientSecret: mockClientSecret,
            amount,
            discountAmount
          });
        }
      } else {
        const mockClientSecret = `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`;
        res.json({
          clientSecret: mockClientSecret,
          amount,
          discountAmount
        });
      }
    } catch (error) {
      console.error("Payment intent error:", error);
      res.status(500).json({ message: "\u062E\u0637\u0623 \u0641\u064A \u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u062F\u0641\u0639\u0629: " + error.message });
    }
  });
  app3.post("/api/confirm-payment", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "\u063A\u064A\u0631 \u0645\u0633\u062C\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" });
    }
    try {
      const { paymentIntentId, gameCount, amount, couponCode, discountAmount } = req.body;
      const user = req.user;
      console.log("Payment confirmation request:", { paymentIntentId, gameCount, amount, couponCode, discountAmount });
      if (!paymentIntentId.startsWith("pi_mock_")) {
        if (!process.env.STRIPE_SECRET_KEY) {
          return res.status(400).json({ message: "\u062E\u062F\u0645\u0629 \u0627\u0644\u062F\u0641\u0639 \u063A\u064A\u0631 \u0645\u062A\u0648\u0641\u0631\u0629 \u062D\u0627\u0644\u064A\u0627" });
        }
        try {
          const Stripe2 = __require("stripe");
          const stripe2 = new Stripe2(process.env.STRIPE_SECRET_KEY);
          const paymentIntent = await stripe2.paymentIntents.retrieve(paymentIntentId);
          if (paymentIntent.status !== "succeeded") {
            return res.status(400).json({ message: "\u0641\u0634\u0644 \u0641\u064A \u0627\u0644\u062F\u0641\u0639" });
          }
        } catch (stripeError) {
          console.error("Stripe error:", stripeError);
          return res.status(400).json({ message: "\u062E\u0637\u0623 \u0641\u064A \u0627\u0644\u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u062F\u0641\u0639" });
        }
      }
      const purchaseData = {
        userId: user.id,
        gameCount: parseInt(gameCount),
        amount: parseFloat(amount),
        stripePaymentIntentId: paymentIntentId
      };
      if (couponCode && couponCode !== "undefined" && couponCode.trim() !== "") {
        purchaseData.couponCode = couponCode;
      }
      if (discountAmount && discountAmount !== "undefined" && discountAmount !== "0") {
        purchaseData.discountAmount = parseFloat(discountAmount);
      }
      console.log("Creating purchase with data:", purchaseData);
      await storage2.createPurchase(purchaseData);
      if (couponCode) {
        const coupon = await storage2.getCouponByCode(couponCode);
        if (coupon) {
          await storage2.incrementCouponUsage(coupon.id);
        }
      }
      const updatedUser = await storage2.updateUserGames(user.id, user.availableGames + parseInt(gameCount));
      res.json({
        success: true,
        availableGames: updatedUser.availableGames,
        message: `\u062A\u0645 \u0625\u0636\u0627\u0641\u0629 ${gameCount} \u0623\u0644\u0639\u0627\u0628 \u0625\u0644\u0649 \u062D\u0633\u0627\u0628\u0643 \u0628\u0646\u062C\u0627\u062D`
      });
    } catch (error) {
      console.error("Confirm payment error:", error);
      res.status(500).json({ message: "\u062E\u0637\u0623 \u0641\u064A \u062A\u0623\u0643\u064A\u062F \u0627\u0644\u062F\u0641\u0639: " + error.message });
    }
  });
  app3.get("/api/admin/stats", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "\u063A\u064A\u0631 \u0645\u0633\u062C\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" });
    }
    const user = req.user;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "\u063A\u064A\u0631 \u0645\u0635\u0631\u062D \u0628\u0627\u0644\u0648\u0635\u0648\u0644" });
    }
    try {
      const stats = await storage2.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "\u062E\u0637\u0623 \u0641\u064A \u062C\u0644\u0628 \u0627\u0644\u0625\u062D\u0635\u0627\u0626\u064A\u0627\u062A" });
    }
  });
  app3.get("/api/admin/sales-analytics", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "\u063A\u064A\u0631 \u0645\u0633\u062C\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" });
    }
    const user = req.user;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "\u063A\u064A\u0631 \u0645\u0635\u0631\u062D \u0628\u0627\u0644\u0648\u0635\u0648\u0644" });
    }
    try {
      const analytics = await storage2.getSalesAnalytics();
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "\u062E\u0637\u0623 \u0641\u064A \u062C\u0644\u0628 \u062A\u062D\u0644\u064A\u0644\u0627\u062A \u0627\u0644\u0645\u0628\u064A\u0639\u0627\u062A" });
    }
  });
  app3.get("/api/admin/questions", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "\u063A\u064A\u0631 \u0645\u0633\u062C\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" });
    }
    const user = req.user;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "\u063A\u064A\u0631 \u0645\u0635\u0631\u062D \u0628\u0627\u0644\u0648\u0635\u0648\u0644" });
    }
    try {
      const { category, difficulty } = req.query;
      const questions = await storage2.getQuestions(category, difficulty);
      res.json({ questions });
    } catch (error) {
      res.status(500).json({ message: "\u062E\u0637\u0623 \u0641\u064A \u062C\u0644\u0628 \u0627\u0644\u0623\u0633\u0626\u0644\u0629" });
    }
  });
  app3.post("/api/admin/questions", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "\u063A\u064A\u0631 \u0645\u0633\u062C\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" });
    }
    const user = req.user;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "\u063A\u064A\u0631 \u0645\u0635\u0631\u062D \u0628\u0627\u0644\u0648\u0635\u0648\u0644" });
    }
    try {
      const questionData = insertQuestionSchema.parse(req.body);
      const existingQuestions = await storage2.getQuestions(questionData.category, questionData.difficulty);
      if (existingQuestions.length >= 2) {
        return res.status(400).json({
          message: `\u062A\u0645 \u0627\u0644\u0648\u0635\u0648\u0644 \u0644\u0644\u062D\u062F \u0627\u0644\u0623\u0642\u0635\u0649 \u0645\u0646 \u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0644\u0647\u0630\u0647 \u0627\u0644\u0641\u0626\u0629 \u0648\u0627\u0644\u0635\u0639\u0648\u0628\u0629 (2/2). \u0644\u0627 \u064A\u0645\u0643\u0646 \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0645\u0632\u064A\u062F \u0645\u0646 \u0627\u0644\u0623\u0633\u0626\u0644\u0629.`
        });
      }
      if (!questionData.hint || questionData.hint.trim() === "") {
        return res.status(400).json({
          message: "\u0627\u0644\u062A\u0644\u0645\u064A\u062D \u0645\u0637\u0644\u0648\u0628 \u0644\u0643\u0644 \u0633\u0624\u0627\u0644"
        });
      }
      const question = await storage2.createQuestion(questionData);
      res.json({ question });
    } catch (error) {
      res.status(400).json({ message: "\u062E\u0637\u0623 \u0641\u064A \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0633\u0624\u0627\u0644: " + error.message });
    }
  });
  app3.put("/api/admin/questions/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "\u063A\u064A\u0631 \u0645\u0633\u062C\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" });
    }
    const user = req.user;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "\u063A\u064A\u0631 \u0645\u0635\u0631\u062D \u0628\u0627\u0644\u0648\u0635\u0648\u0644" });
    }
    try {
      const questionData = insertQuestionSchema.partial().parse(req.body);
      const question = await storage2.updateQuestion(req.params.id, questionData);
      res.json({ question });
    } catch (error) {
      res.status(400).json({ message: "\u062E\u0637\u0623 \u0641\u064A \u062A\u062D\u062F\u064A\u062B \u0627\u0644\u0633\u0624\u0627\u0644" });
    }
  });
  app3.delete("/api/admin/questions/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "\u063A\u064A\u0631 \u0645\u0633\u062C\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" });
    }
    const user = req.user;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "\u063A\u064A\u0631 \u0645\u0635\u0631\u062D \u0628\u0627\u0644\u0648\u0635\u0648\u0644" });
    }
    try {
      await storage2.deleteQuestion(req.params.id);
      res.json({ message: "\u062A\u0645 \u062D\u0630\u0641 \u0627\u0644\u0633\u0624\u0627\u0644 \u0628\u0646\u062C\u0627\u062D" });
    } catch (error) {
      res.status(500).json({ message: "\u062E\u0637\u0623 \u0641\u064A \u062D\u0630\u0641 \u0627\u0644\u0633\u0624\u0627\u0644" });
    }
  });
  app3.post("/api/admin/questions/publish", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "\u063A\u064A\u0631 \u0645\u0633\u062C\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" });
    }
    const user = req.user;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "\u063A\u064A\u0631 \u0645\u0635\u0631\u062D \u0628\u0627\u0644\u0648\u0635\u0648\u0644" });
    }
    try {
      await storage2.publishAllQuestions();
      res.json({ message: "\u062A\u0645 \u0646\u0634\u0631 \u062C\u0645\u064A\u0639 \u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0628\u0646\u062C\u0627\u062D" });
    } catch (error) {
      res.status(500).json({ message: "\u062E\u0637\u0623 \u0641\u064A \u0646\u0634\u0631 \u0627\u0644\u0623\u0633\u0626\u0644\u0629" });
    }
  });
  app3.post("/api/admin/questions/unpublish", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "\u063A\u064A\u0631 \u0645\u0633\u062C\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" });
    }
    const user = req.user;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "\u063A\u064A\u0631 \u0645\u0635\u0631\u062D \u0628\u0627\u0644\u0648\u0635\u0648\u0644" });
    }
    try {
      await storage2.unpublishAllQuestions();
      res.json({ message: "\u062A\u0645 \u0625\u0644\u063A\u0627\u0621 \u0646\u0634\u0631 \u062C\u0645\u064A\u0639 \u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0628\u0646\u062C\u0627\u062D" });
    } catch (error) {
      res.status(500).json({ message: "\u062E\u0637\u0623 \u0641\u064A \u0625\u0644\u063A\u0627\u0621 \u0646\u0634\u0631 \u0627\u0644\u0623\u0633\u0626\u0644\u0629" });
    }
  });
  app3.post("/api/admin/questions/seed", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "\u063A\u064A\u0631 \u0645\u0633\u062C\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" });
    }
    const user = req.user;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "\u063A\u064A\u0631 \u0645\u0635\u0631\u062D \u0628\u0627\u0644\u0648\u0635\u0648\u0644" });
    }
    try {
      const { loadQuestions: loadQuestions2 } = await Promise.resolve().then(() => (init_config(), config_exports));
      const configQuestions = loadQuestions2();
      let created = 0;
      let skipped = 0;
      console.log(`Loading ${configQuestions.length} questions from config...`);
      for (const question of configQuestions) {
        try {
          const existingQuestions = await storage2.getQuestionsByCategory(question.category);
          const exists = existingQuestions.some((q) => q.question === question.question);
          if (!exists) {
            await storage2.createQuestion({
              ...question,
              isPublished: true
            });
            created++;
            console.log(`Created question: ${question.question.substring(0, 50)}...`);
          } else {
            skipped++;
          }
        } catch (error) {
          console.log("Error creating question:", error.message);
        }
      }
      res.json({
        message: `\u062A\u0645 \u0625\u0636\u0627\u0641\u0629 ${created} \u0633\u0624\u0627\u0644 \u062C\u062F\u064A\u062F \u0648\u062A\u062E\u0637\u064A ${skipped} \u0633\u0624\u0627\u0644 \u0645\u0648\u062C\u0648\u062F \u0645\u0633\u0628\u0642\u0627\u064B`,
        totalInConfig: configQuestions.length,
        created,
        skipped
      });
    } catch (error) {
      console.error("Error seeding questions:", error);
      res.status(500).json({ message: "\u062E\u0637\u0623 \u0641\u064A \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0623\u0633\u0626\u0644\u0629: " + error.message });
    }
  });
  app3.get("/api/categories", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "\u063A\u064A\u0631 \u0645\u0633\u062C\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" });
    }
    try {
      const categories = await storage2.getAllCategories();
      const activeCategories = categories.filter((category) => category.isActive);
      res.json({ categories: activeCategories });
    } catch (error) {
      res.status(500).json({ message: "\u062E\u0637\u0623 \u0641\u064A \u062C\u0644\u0628 \u0627\u0644\u0641\u0626\u0627\u062A" });
    }
  });
  app3.get("/api/admin/categories", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "\u063A\u064A\u0631 \u0645\u0633\u062C\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" });
    }
    const user = req.user;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "\u063A\u064A\u0631 \u0645\u0635\u0631\u062D \u0628\u0627\u0644\u0648\u0635\u0648\u0644" });
    }
    try {
      const categories = await storage2.getAllCategories();
      res.json({ categories });
    } catch (error) {
      res.status(500).json({ message: "\u062E\u0637\u0623 \u0641\u064A \u062C\u0644\u0628 \u0627\u0644\u0641\u0626\u0627\u062A" });
    }
  });
  app3.post("/api/admin/categories", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "\u063A\u064A\u0631 \u0645\u0633\u062C\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" });
    }
    const user = req.user;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "\u063A\u064A\u0631 \u0645\u0635\u0631\u062D \u0628\u0627\u0644\u0648\u0635\u0648\u0644" });
    }
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage2.createCategory(categoryData);
      res.json({ category });
    } catch (error) {
      res.status(400).json({ message: "\u062E\u0637\u0623 \u0641\u064A \u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u0641\u0626\u0629" });
    }
  });
  app3.put("/api/admin/categories/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "\u063A\u064A\u0631 \u0645\u0633\u062C\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" });
    }
    const user = req.user;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "\u063A\u064A\u0631 \u0645\u0635\u0631\u062D \u0628\u0627\u0644\u0648\u0635\u0648\u0644" });
    }
    try {
      const categoryData = insertCategorySchema.partial().parse(req.body);
      const category = await storage2.updateCategory(req.params.id, categoryData);
      res.json({ category });
    } catch (error) {
      res.status(400).json({ message: "\u062E\u0637\u0623 \u0641\u064A \u062A\u062D\u062F\u064A\u062B \u0627\u0644\u0641\u0626\u0629" });
    }
  });
  app3.delete("/api/admin/categories/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "\u063A\u064A\u0631 \u0645\u0633\u062C\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" });
    }
    const user = req.user;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "\u063A\u064A\u0631 \u0645\u0635\u0631\u062D \u0628\u0627\u0644\u0648\u0635\u0648\u0644" });
    }
    try {
      await storage2.deleteCategory(req.params.id);
      res.json({ message: "\u062A\u0645 \u062D\u0630\u0641 \u0627\u0644\u0641\u0626\u0629 \u0628\u0646\u062C\u0627\u062D" });
    } catch (error) {
      console.error("Delete category error:", error);
      res.status(500).json({ message: "\u062E\u0637\u0623 \u0641\u064A \u062D\u0630\u0641 \u0627\u0644\u0641\u0626\u0629: " + error.message });
    }
  });
  app3.get("/api/admin/coupons", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "\u063A\u064A\u0631 \u0645\u0633\u062C\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" });
    }
    const user = req.user;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "\u063A\u064A\u0631 \u0645\u0635\u0631\u062D \u0628\u0627\u0644\u0648\u0635\u0648\u0644" });
    }
    try {
      const coupons = await storage2.getAllCoupons();
      res.json({ coupons });
    } catch (error) {
      res.status(500).json({ message: "\u062E\u0637\u0623 \u0641\u064A \u062C\u0644\u0628 \u0627\u0644\u0643\u0648\u0628\u0648\u0646\u0627\u062A" });
    }
  });
  app3.post("/api/admin/coupons", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "\u063A\u064A\u0631 \u0645\u0633\u062C\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" });
    }
    const user = req.user;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "\u063A\u064A\u0631 \u0645\u0635\u0631\u062D \u0628\u0627\u0644\u0648\u0635\u0648\u0644" });
    }
    try {
      const couponData = insertCouponSchema.parse(req.body);
      const coupon = await storage2.createCoupon(couponData);
      res.json({ coupon });
    } catch (error) {
      res.status(400).json({ message: "\u062E\u0637\u0623 \u0641\u064A \u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u0643\u0648\u0628\u0648\u0646" });
    }
  });
  app3.put("/api/admin/coupons/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "\u063A\u064A\u0631 \u0645\u0633\u062C\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" });
    }
    const user = req.user;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "\u063A\u064A\u0631 \u0645\u0635\u0631\u062D \u0628\u0627\u0644\u0648\u0635\u0648\u0644" });
    }
    try {
      const couponData = insertCouponSchema.partial().parse(req.body);
      const coupon = await storage2.updateCoupon(req.params.id, couponData);
      res.json({ coupon });
    } catch (error) {
      res.status(400).json({ message: "\u062E\u0637\u0623 \u0641\u064A \u062A\u062D\u062F\u064A\u062B \u0627\u0644\u0643\u0648\u0628\u0648\u0646" });
    }
  });
  app3.post("/api/validate-coupon", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "\u063A\u064A\u0631 \u0645\u0633\u062C\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" });
    }
    try {
      const { code } = req.body;
      const coupon = await storage2.getCouponByCode(code);
      if (!coupon) {
        return res.status(404).json({ message: "\u0643\u0648\u0628\u0648\u0646 \u063A\u064A\u0631 \u0635\u062D\u064A\u062D" });
      }
      if (!coupon.isActive) {
        return res.status(400).json({ message: "\u0643\u0648\u0628\u0648\u0646 \u063A\u064A\u0631 \u0646\u0634\u0637" });
      }
      if (coupon.expiresAt && /* @__PURE__ */ new Date() > new Date(coupon.expiresAt)) {
        return res.status(400).json({ message: "\u0643\u0648\u0628\u0648\u0646 \u0645\u0646\u062A\u0647\u064A \u0627\u0644\u0635\u0644\u0627\u062D\u064A\u0629" });
      }
      if (coupon.maxUsage && coupon.usageCount >= coupon.maxUsage) {
        return res.status(400).json({ message: "\u062A\u0645 \u0627\u0633\u062A\u0646\u0641\u0627\u062F \u0627\u0633\u062A\u062E\u062F\u0627\u0645\u0627\u062A \u0627\u0644\u0643\u0648\u0628\u0648\u0646" });
      }
      res.json({
        valid: true,
        coupon: {
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue
        }
      });
    } catch (error) {
      res.status(500).json({ message: "\u062E\u0637\u0623 \u0641\u064A \u0627\u0644\u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u0643\u0648\u0628\u0648\u0646" });
    }
  });
  app3.get("/api/game-packages", async (req, res) => {
    try {
      const packages = await storage2.getActiveGamePackages();
      res.json({ packages });
    } catch (error) {
      res.status(500).json({ message: "\u062E\u0637\u0623 \u0641\u064A \u062C\u0644\u0628 \u0628\u0627\u0642\u0627\u062A \u0627\u0644\u0623\u0644\u0639\u0627\u0628" });
    }
  });
  app3.get("/api/admin/game-packages", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "\u063A\u064A\u0631 \u0645\u0633\u062C\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" });
    }
    const user = req.user;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "\u063A\u064A\u0631 \u0645\u0635\u0631\u062D \u0628\u0627\u0644\u0648\u0635\u0648\u0644" });
    }
    try {
      const packages = await storage2.getAllGamePackages();
      res.json({ packages });
    } catch (error) {
      res.status(500).json({ message: "\u062E\u0637\u0623 \u0641\u064A \u062C\u0644\u0628 \u0628\u0627\u0642\u0627\u062A \u0627\u0644\u0623\u0644\u0639\u0627\u0628" });
    }
  });
  app3.post("/api/admin/game-packages", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "\u063A\u064A\u0631 \u0645\u0633\u062C\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" });
    }
    const user = req.user;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "\u063A\u064A\u0631 \u0645\u0635\u0631\u062D \u0628\u0627\u0644\u0648\u0635\u0648\u0644" });
    }
    try {
      const packageData = insertGamePackageSchema.parse(req.body);
      const gamePackage = await storage2.createGamePackage(packageData);
      res.json({ package: gamePackage });
    } catch (error) {
      res.status(400).json({ message: "\u062E\u0637\u0623 \u0641\u064A \u0625\u0646\u0634\u0627\u0621 \u0628\u0627\u0642\u0629 \u0627\u0644\u0623\u0644\u0639\u0627\u0628" });
    }
  });
  app3.put("/api/admin/game-packages/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "\u063A\u064A\u0631 \u0645\u0633\u062C\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" });
    }
    const user = req.user;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "\u063A\u064A\u0631 \u0645\u0635\u0631\u062D \u0628\u0627\u0644\u0648\u0635\u0648\u0644" });
    }
    try {
      const packageData = insertGamePackageSchema.partial().parse(req.body);
      const gamePackage = await storage2.updateGamePackage(req.params.id, packageData);
      res.json({ package: gamePackage });
    } catch (error) {
      res.status(400).json({ message: "\u062E\u0637\u0623 \u0641\u064A \u062A\u062D\u062F\u064A\u062B \u0628\u0627\u0642\u0629 \u0627\u0644\u0623\u0644\u0639\u0627\u0628" });
    }
  });
  app3.delete("/api/admin/game-packages/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "\u063A\u064A\u0631 \u0645\u0633\u062C\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" });
    }
    const user = req.user;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "\u063A\u064A\u0631 \u0645\u0635\u0631\u062D \u0628\u0627\u0644\u0648\u0635\u0648\u0644" });
    }
    try {
      await storage2.deleteGamePackage(req.params.id);
      res.json({ message: "\u062A\u0645 \u062D\u0630\u0641 \u0628\u0627\u0642\u0629 \u0627\u0644\u0623\u0644\u0639\u0627\u0628 \u0628\u0646\u062C\u0627\u062D" });
    } catch (error) {
      res.status(500).json({ message: "\u062E\u0637\u0623 \u0641\u064A \u062D\u0630\u0641 \u0628\u0627\u0642\u0629 \u0627\u0644\u0623\u0644\u0639\u0627\u0628" });
    }
  });
  app3.get("/api/admin/users", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "\u063A\u064A\u0631 \u0645\u0633\u062C\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" });
    }
    const user = req.user;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "\u063A\u064A\u0631 \u0645\u0635\u0631\u062D \u0628\u0627\u0644\u0648\u0635\u0648\u0644" });
    }
    try {
      const users = await storage2.getAllUsers();
      res.json({ users });
    } catch (error) {
      res.status(500).json({ message: "\u062E\u0637\u0623 \u0641\u064A \u062C\u0644\u0628 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646" });
    }
  });
  app3.post("/api/admin/users", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "\u063A\u064A\u0631 \u0645\u0633\u062C\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" });
    }
    const user = req.user;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "\u063A\u064A\u0631 \u0645\u0635\u0631\u062D \u0628\u0627\u0644\u0648\u0635\u0648\u0644" });
    }
    try {
      const { email, phoneNumber, name, password, availableGames = 0, isAdmin = false } = req.body;
      const existingUserByEmail = await storage2.getUserByEmail(email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A \u0645\u0633\u062A\u062E\u062F\u0645 \u0628\u0627\u0644\u0641\u0639\u0644" });
      }
      if (phoneNumber) {
        const existingUserByPhone = await storage2.getUserByPhoneNumber(phoneNumber);
        if (existingUserByPhone) {
          return res.status(400).json({ message: "\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062A\u0641 \u0645\u0633\u062A\u062E\u062F\u0645 \u0628\u0627\u0644\u0641\u0639\u0644" });
        }
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const userData = insertUserSchema.parse({
        email,
        phoneNumber: phoneNumber || "",
        name,
        password: hashedPassword,
        availableGames,
        isAdmin
      });
      const newUser = await storage2.createUser(userData);
      res.json({ user: newUser });
    } catch (error) {
      res.status(400).json({ message: "\u062E\u0637\u0623 \u0641\u064A \u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645: " + error.message });
    }
  });
  app3.put("/api/admin/users/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "\u063A\u064A\u0631 \u0645\u0633\u062C\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" });
    }
    const user = req.user;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "\u063A\u064A\u0631 \u0645\u0635\u0631\u062D \u0628\u0627\u0644\u0648\u0635\u0648\u0644" });
    }
    try {
      const userId = req.params.id;
      const { email, phoneNumber, name, password, availableGames, isAdmin } = req.body;
      if (userId === user.id && isAdmin !== void 0) {
        return res.status(400).json({ message: "\u0644\u0627 \u064A\u0645\u0643\u0646 \u062A\u0639\u062F\u064A\u0644 \u0635\u0644\u0627\u062D\u064A\u0627\u062A \u0627\u0644\u0645\u062F\u064A\u0631 \u0627\u0644\u062E\u0627\u0635 \u0628\u0643" });
      }
      if (phoneNumber !== void 0 && phoneNumber !== "") {
        const existingUserByPhone = await storage2.getUserByPhoneNumber(phoneNumber);
        if (existingUserByPhone && existingUserByPhone.id !== userId) {
          return res.status(400).json({ message: "\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062A\u0641 \u0645\u0633\u062A\u062E\u062F\u0645 \u0628\u0627\u0644\u0641\u0639\u0644" });
        }
      }
      const updates = {};
      if (email !== void 0) updates.email = email;
      if (phoneNumber !== void 0) updates.phoneNumber = phoneNumber;
      if (name !== void 0) updates.name = name;
      if (availableGames !== void 0) updates.availableGames = availableGames;
      if (isAdmin !== void 0) updates.isAdmin = isAdmin;
      if (password && password.trim() !== "") {
        updates.password = await bcrypt.hash(password, 10);
      }
      const updatedUser = await storage2.updateUser(userId, updates);
      res.json({ user: updatedUser });
    } catch (error) {
      res.status(400).json({ message: "\u062E\u0637\u0623 \u0641\u064A \u062A\u062D\u062F\u064A\u062B \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645: " + error.message });
    }
  });
  app3.delete("/api/admin/users/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "\u063A\u064A\u0631 \u0645\u0633\u062C\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" });
    }
    const user = req.user;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "\u063A\u064A\u0631 \u0645\u0635\u0631\u062D \u0628\u0627\u0644\u0648\u0635\u0648\u0644" });
    }
    try {
      const userId = req.params.id;
      if (userId === user.id) {
        return res.status(400).json({ message: "\u0644\u0627 \u064A\u0645\u0643\u0646 \u062D\u0630\u0641 \u062D\u0633\u0627\u0628\u0643 \u0627\u0644\u062E\u0627\u0635" });
      }
      await storage2.deleteUser(userId);
      res.json({ message: "\u062A\u0645 \u062D\u0630\u0641 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645 \u0628\u0646\u062C\u0627\u062D" });
    } catch (error) {
      res.status(500).json({ message: "\u062E\u0637\u0623 \u0641\u064A \u062D\u0630\u0641 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645: " + error.message });
    }
  });
}

// api/index.ts
import { config as config2 } from "dotenv";
config2();
var app2 = express();
app2.use(express.json({ limit: "50mb" }));
app2.use(express.urlencoded({ extended: false, limit: "50mb" }));
app2.use((req, res, next) => {
  const start = Date.now();
  const path2 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path2.startsWith("/api")) {
      let logLine = `${req.method} ${path2} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      console.log(logLine);
    }
  });
  next();
});
var routesInitialized = false;
async function initializeApp2() {
  if (routesInitialized) return;
  try {
    await registerRoutes(app2);
    app2.use((err, _req, res, _next) => {
      const status = err.status || err.statusCode || 500;
      let message = err.message || "Internal Server Error";
      if (err.code === "LIMIT_FILE_SIZE" || err.type === "entity.too.large") {
        message = "\u062D\u062C\u0645 \u0627\u0644\u0645\u0644\u0641 \u0643\u0628\u064A\u0631 \u062C\u062F\u0627\u064B. \u0627\u0644\u062D\u062F \u0627\u0644\u0623\u0642\u0635\u0649 \u0627\u0644\u0645\u0633\u0645\u0648\u062D 50 \u0645\u064A\u062C\u0627\u0628\u0627\u064A\u062A";
      }
      res.status(status).json({ message });
    });
    routesInitialized = true;
  } catch (error) {
    console.error("Failed to initialize routes:", error);
  }
}
async function handler(req, res) {
  await initializeApp2();
  return app2(req, res);
}
export {
  handler as default
};

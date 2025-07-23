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
  limit,
  increment,
  serverTimestamp,
  Timestamp,
  WriteBatch,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";
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

export interface IFirebaseStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByPhoneNumber(phoneNumber: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  updateUserGames(id: string, availableGames: number): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  deleteUser(id: string): Promise<void>;

  // Question operations
  getAllQuestions(): Promise<Question[]>;
  getQuestionsByCategory(category: string): Promise<Question[]>;
  getPublishedQuestionsByCategory(category: string): Promise<Question[]>;
  createQuestion(insertQuestion: InsertQuestion): Promise<Question>;
  updateQuestion(id: string, updates: Partial<Question>): Promise<Question>;
  deleteQuestion(id: string): Promise<void>;
  publishAllQuestions(): Promise<void>;
  unpublishAllQuestions(): Promise<void>;

  // Game session operations
  createGameSession(insertSession: InsertGameSession): Promise<GameSession>;
  getGameSession(id: string): Promise<GameSession | undefined>;
  updateGameSession(id: string, session: Partial<InsertGameSession>): Promise<GameSession>;
  getUserGameSessions(userId: string): Promise<GameSession[]>;

  // Purchase operations
  createPurchase(purchase: InsertPurchase): Promise<Purchase>;
  getUserPurchases(userId: string): Promise<Purchase[]>;

  // Category operations
  getAllCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, updates: Partial<Category>): Promise<Category>;

  // Coupon operations
  getAllCoupons(): Promise<Coupon[]>;
  getCouponByCode(code: string): Promise<Coupon | undefined>;
  createCoupon(coupon: InsertCoupon): Promise<Coupon>;
  updateCoupon(id: string, updates: Partial<Coupon>): Promise<Coupon>;
  incrementCouponUsage(id: string): Promise<void>;

  // Game Package operations
  getAllGamePackages(): Promise<GamePackage[]>;
  getActiveGamePackages(): Promise<GamePackage[]>;
  createGamePackage(gamePackage: InsertGamePackage): Promise<GamePackage>;
  updateGamePackage(id: string, updates: Partial<GamePackage>): Promise<GamePackage>;
  deleteGamePackage(id: string): Promise<void>;

  // Admin operations
  getStats(): Promise<{
    totalUsers: number;
    totalQuestions: number;
    totalGamesPlayed: number;
    monthlyRevenue: number;
  }>;

  // Analytics operations
  getSalesAnalytics(): Promise<{
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
  }>;
}

export class FirebaseStorage implements IFirebaseStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const userDoc = await getDoc(doc(db, "users", id));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() } as User;
    }
    return undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const q = query(collection(db, "users"), where("email", "==", email));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const userDoc = snapshot.docs[0];
      return { id: userDoc.id, ...userDoc.data() } as User;
    }
    return undefined;
  }

  async getUserByPhoneNumber(phoneNumber: string): Promise<User | undefined> {
    const q = query(collection(db, "users"), where("phoneNumber", "==", phoneNumber));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const userDoc = snapshot.docs[0];
      return { id: userDoc.id, ...userDoc.data() } as User;
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const docRef = await addDoc(collection(db, "users"), {
      ...insertUser,
      createdAt: serverTimestamp(),
    });
    const userDoc = await getDoc(docRef);
    return { id: userDoc.id, ...userDoc.data() } as User;
  }

  async updateUserGames(id: string, availableGames: number): Promise<User> {
    const userRef = doc(db, "users", id);
    await updateDoc(userRef, { availableGames });
    const userDoc = await getDoc(userRef);
    return { id: userDoc.id, ...userDoc.data() } as User;
  }

  async getAllUsers(): Promise<User[]> {
    const snapshot = await getDocs(collection(db, "users"));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as User));
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const userRef = doc(db, "users", id);
    await updateDoc(userRef, updates);
    const userDoc = await getDoc(userRef);
    return { id: userDoc.id, ...userDoc.data() } as User;
  }

  async deleteUser(id: string): Promise<void> {
    await deleteDoc(doc(db, "users", id));
  }

  // Question operations
  async getAllQuestions(): Promise<Question[]> {
    const snapshot = await getDocs(collection(db, "questions"));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Question));
  }

  async getQuestionsByCategory(category: string, limitCount?: number): Promise<Question[]> {
    const q = query(
      collection(db, "questions"),
      where("category", "==", category)
    );
    
    const snapshot = await getDocs(q);
    let questions = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Question));
    
    // Sort by difficulty in memory to avoid composite index requirement
    const difficultyOrder = { 'سهل': 1, 'متوسط': 2, 'صعب': 3 };
    questions = questions.sort((a, b) => {
      return (difficultyOrder[a.difficulty] || 4) - (difficultyOrder[b.difficulty] || 4);
    });
    
    return limitCount ? questions.slice(0, limitCount) : questions;
  }

  async getQuestions(category?: string, difficulty?: string): Promise<Question[]> {
    let q = query(collection(db, "questions"));
    
    if (category) {
      q = query(q, where("category", "==", category));
    }
    
    if (difficulty) {
      q = query(q, where("difficulty", "==", difficulty));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Question));
  }

  async getQuestionById(id: string): Promise<Question | undefined> {
    const questionDoc = await getDoc(doc(db, "questions", id));
    if (questionDoc.exists()) {
      return { id: questionDoc.id, ...questionDoc.data() } as Question;
    }
    return undefined;
  }

  async getRandomQuestions(count: number): Promise<Question[]> {
    const snapshot = await getDocs(collection(db, "questions"));
    const questions = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Question));
    
    const shuffled = questions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  async getPublishedQuestionsByCategory(category: string): Promise<Question[]> {
    const q = query(
      collection(db, "questions"),
      where("category", "==", category),
      where("isPublished", "==", true)
    );
    const snapshot = await getDocs(q);
    let questions = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Question));
    
    // Sort by difficulty in memory
    const difficultyOrder = { 'سهل': 1, 'متوسط': 2, 'صعب': 3 };
    return questions.sort((a, b) => {
      return (difficultyOrder[a.difficulty] || 4) - (difficultyOrder[b.difficulty] || 4);
    });
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const docRef = await addDoc(collection(db, "questions"), {
      ...insertQuestion,
      isPublished: false,
      createdAt: serverTimestamp(),
    });
    const questionDoc = await getDoc(docRef);
    return { id: questionDoc.id, ...questionDoc.data() } as Question;
  }

  async updateQuestion(id: string, updates: Partial<Question>): Promise<Question> {
    const questionRef = doc(db, "questions", id);
    await updateDoc(questionRef, updates);
    const questionDoc = await getDoc(questionRef);
    return { id: questionDoc.id, ...questionDoc.data() } as Question;
  }

  async deleteQuestion(id: string): Promise<void> {
    await deleteDoc(doc(db, "questions", id));
  }

  async publishAllQuestions(): Promise<void> {
    const q = query(collection(db, "questions"), where("isPublished", "==", false));
    const snapshot = await getDocs(q);
    const batch = writeBatch(db);
    
    snapshot.docs.forEach((doc) => {
      batch.update(doc.ref, { isPublished: true });
    });
    
    await batch.commit();
  }

  async unpublishAllQuestions(): Promise<void> {
    const q = query(collection(db, "questions"), where("isPublished", "==", true));
    const snapshot = await getDocs(q);
    const batch = writeBatch(db);
    
    snapshot.docs.forEach((doc) => {
      batch.update(doc.ref, { isPublished: false });
    });
    
    await batch.commit();
  }

  // Game session operations
  async createGameSession(insertSession: InsertGameSession): Promise<GameSession> {
    const docRef = await addDoc(collection(db, "gameSessions"), {
      ...insertSession,
      createdAt: serverTimestamp(),
    });
    const sessionDoc = await getDoc(docRef);
    return { id: sessionDoc.id, ...sessionDoc.data() } as GameSession;
  }

  async getGameSession(id: string): Promise<GameSession | undefined> {
    const sessionDoc = await getDoc(doc(db, "gameSessions", id));
    if (sessionDoc.exists()) {
      return { id: sessionDoc.id, ...sessionDoc.data() } as GameSession;
    }
    return undefined;
  }

  async updateGameSession(id: string, session: Partial<InsertGameSession>): Promise<GameSession> {
    const sessionRef = doc(db, "gameSessions", id);
    await updateDoc(sessionRef, session);
    const sessionDoc = await getDoc(sessionRef);
    return { id: sessionDoc.id, ...sessionDoc.data() } as GameSession;
  }

  async getUserGameSessions(userId: string): Promise<GameSession[]> {
    const q = query(
      collection(db, "gameSessions"),
      where("userId", "==", userId)
    );
    const snapshot = await getDocs(q);
    const sessions = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as GameSession));
    
    // Sort in memory to avoid composite index requirement
    return sessions.sort((a, b) => {
      const aDate = a.createdAt instanceof Timestamp ? a.createdAt.toDate() : new Date(a.createdAt);
      const bDate = b.createdAt instanceof Timestamp ? b.createdAt.toDate() : new Date(b.createdAt);
      return bDate.getTime() - aDate.getTime();
    });
  }

  // Purchase operations
  async createPurchase(purchase: any): Promise<Purchase> {
    // Clean the purchase object to remove undefined values for Firebase
    const cleanPurchase = Object.keys(purchase).reduce((acc, key) => {
      if (purchase[key] !== undefined) {
        acc[key] = purchase[key];
      }
      return acc;
    }, {} as any);
    
    const docRef = await addDoc(collection(db, "purchases"), {
      ...cleanPurchase,
      createdAt: serverTimestamp(),
    });
    const purchaseDoc = await getDoc(docRef);
    return { id: purchaseDoc.id, ...purchaseDoc.data() } as Purchase;
  }

  async getUserPurchases(userId: string): Promise<Purchase[]> {
    const q = query(
      collection(db, "purchases"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Purchase));
  }

  // Category operations
  async getAllCategories(): Promise<Category[]> {
    const snapshot = await getDocs(collection(db, "categories"));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Category));
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const docRef = await addDoc(collection(db, "categories"), {
      ...category,
      createdAt: serverTimestamp(),
    });
    const categoryDoc = await getDoc(docRef);
    return { id: categoryDoc.id, ...categoryDoc.data() } as Category;
  }

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    const categoryRef = doc(db, "categories", id);
    await updateDoc(categoryRef, updates);
    const categoryDoc = await getDoc(categoryRef);
    return { id: categoryDoc.id, ...categoryDoc.data() } as Category;
  }

  // Coupon operations
  async getAllCoupons(): Promise<Coupon[]> {
    const snapshot = await getDocs(collection(db, "coupons"));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Coupon));
  }

  async getCouponByCode(code: string): Promise<Coupon | undefined> {
    const q = query(collection(db, "coupons"), where("code", "==", code));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const couponDoc = snapshot.docs[0];
      return { id: couponDoc.id, ...couponDoc.data() } as Coupon;
    }
    return undefined;
  }

  async createCoupon(coupon: InsertCoupon): Promise<Coupon> {
    const docRef = await addDoc(collection(db, "coupons"), {
      ...coupon,
      createdAt: serverTimestamp(),
    });
    const couponDoc = await getDoc(docRef);
    return { id: couponDoc.id, ...couponDoc.data() } as Coupon;
  }

  async updateCoupon(id: string, updates: Partial<Coupon>): Promise<Coupon> {
    const couponRef = doc(db, "coupons", id);
    await updateDoc(couponRef, updates);
    const couponDoc = await getDoc(couponRef);
    return { id: couponDoc.id, ...couponDoc.data() } as Coupon;
  }

  async incrementCouponUsage(id: string): Promise<void> {
    const couponRef = doc(db, "coupons", id);
    await updateDoc(couponRef, { usageCount: increment(1) });
  }

  // Game Package operations
  async getAllGamePackages(): Promise<GamePackage[]> {
    const snapshot = await getDocs(collection(db, "gamePackages"));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as GamePackage));
  }

  async getActiveGamePackages(): Promise<GamePackage[]> {
    const q = query(collection(db, "gamePackages"), where("isActive", "==", true));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as GamePackage));
  }

  async createGamePackage(gamePackage: InsertGamePackage): Promise<GamePackage> {
    const docRef = await addDoc(collection(db, "gamePackages"), {
      ...gamePackage,
      createdAt: serverTimestamp(),
    });
    const packageDoc = await getDoc(docRef);
    return { id: packageDoc.id, ...packageDoc.data() } as GamePackage;
  }

  async updateGamePackage(id: string, updates: Partial<GamePackage>): Promise<GamePackage> {
    const packageRef = doc(db, "gamePackages", id);
    await updateDoc(packageRef, updates);
    const packageDoc = await getDoc(packageRef);
    return { id: packageDoc.id, ...packageDoc.data() } as GamePackage;
  }

  async deleteGamePackage(id: string): Promise<void> {
    await deleteDoc(doc(db, "gamePackages", id));
  }

  // Admin operations
  async getStats(): Promise<{
    totalUsers: number;
    totalQuestions: number;
    totalGamesPlayed: number;
    monthlyRevenue: number;
  }> {
    const [usersSnapshot, questionsSnapshot, gamesSnapshot, purchasesSnapshot] = await Promise.all([
      getDocs(collection(db, "users")),
      getDocs(collection(db, "questions")),
      getDocs(query(collection(db, "gameSessions"), where("isCompleted", "==", true))),
      getDocs(collection(db, "purchases")),
    ]);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    let monthlyRevenue = 0;
    purchasesSnapshot.docs.forEach((doc) => {
      const purchase = doc.data() as Purchase;
      const purchaseDate = purchase.createdAt instanceof Timestamp 
        ? purchase.createdAt.toDate() 
        : new Date(purchase.createdAt);
      
      if (purchaseDate >= thirtyDaysAgo) {
        monthlyRevenue += purchase.amount;
      }
    });

    return {
      totalUsers: usersSnapshot.size,
      totalQuestions: questionsSnapshot.size,
      totalGamesPlayed: gamesSnapshot.size,
      monthlyRevenue: Math.round(monthlyRevenue / 100),
    };
  }

  // Analytics operations
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
    const [purchasesSnapshot, usersSnapshot] = await Promise.all([
      getDocs(collection(db, "purchases")),
      getDocs(collection(db, "users")),
    ]);

    const purchases = purchasesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Purchase));
    const users = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as User));

    const totalRevenue = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);
    const totalSales = purchases.length;
    const averageOrderValue = totalSales > 0 ? Math.round(totalRevenue / totalSales) : 0;

    // Group purchases by month
    const monthlyData: { [key: string]: { revenue: number; sales: number } } = {};
    purchases.forEach((purchase) => {
      const purchaseDate = purchase.createdAt instanceof Timestamp 
        ? purchase.createdAt.toDate() 
        : new Date(purchase.createdAt);
      const monthKey = `${purchaseDate.getFullYear()}-${String(purchaseDate.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { revenue: 0, sales: 0 };
      }
      monthlyData[monthKey].revenue += purchase.amount;
      monthlyData[monthKey].sales += 1;
    });

    const monthlyRevenue = Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        revenue: Math.round(data.revenue / 100),
        sales: data.sales,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // Group by game count for top packages
    const packageData: { [key: number]: { sales: number; revenue: number } } = {};
    purchases.forEach((purchase) => {
      if (!packageData[purchase.gameCount]) {
        packageData[purchase.gameCount] = { sales: 0, revenue: 0 };
      }
      packageData[purchase.gameCount].sales += 1;
      packageData[purchase.gameCount].revenue += purchase.amount;
    });

    const topGamePackages = Object.entries(packageData)
      .map(([gameCount, data]) => ({
        name: `باقة ${gameCount} ألعاب`,
        sales: data.sales,
        revenue: Math.round(data.revenue / 100),
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    // Recent sales with user names
    const recentSales = purchases
      .sort((a, b) => {
        const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate() : new Date(a.createdAt);
        const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate() : new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 10)
      .map((purchase) => {
        const user = users.find((u) => u.id === purchase.userId);
        const purchaseDate = purchase.createdAt instanceof Timestamp 
          ? purchase.createdAt.toDate() 
          : new Date(purchase.createdAt);
        
        return {
          id: purchase.id,
          userName: user?.name || 'Unknown',
          packageName: `باقة ${purchase.gameCount} ألعاب`,
          amount: Math.round(purchase.amount / 100),
          gameCount: purchase.gameCount,
          date: purchaseDate.toLocaleString('ar-SA'),
          couponCode: purchase.couponCode,
          discountAmount: purchase.discountAmount ? Math.round(purchase.discountAmount / 100) : undefined,
        };
      });

    return {
      totalRevenue: Math.round(totalRevenue / 100),
      totalSales,
      averageOrderValue: Math.round(averageOrderValue / 100),
      monthlyRevenue,
      topGamePackages,
      recentSales,
    };
  }

  async getActiveCategories(): Promise<Category[]> {
    const q = query(collection(db, "categories"), where("isActive", "==", true));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Category));
  }
}

export const storage = new FirebaseStorage();
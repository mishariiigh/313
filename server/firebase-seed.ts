import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import bcrypt from "bcryptjs";

// Sample data for the platform
const sampleCategories = [
  { name: "history", displayName: "التاريخ", description: "أسئلة تاريخية متنوعة", isActive: true },
  { name: "geography", displayName: "الجغرافيا", description: "أسئلة جغرافية", isActive: true },
  { name: "religion", displayName: "الدين", description: "أسئلة دينية", isActive: true },
  { name: "sports", displayName: "الرياضة", description: "أسئلة رياضية", isActive: true },
  { name: "culture", displayName: "الثقافة العامة", description: "أسئلة ثقافية عامة", isActive: true },
  { name: "science", displayName: "العلوم", description: "أسئلة علمية", isActive: true },
];

const sampleQuestions = [
  // History questions
  { question: "من هو مؤسس الدولة السعودية الأولى؟", answer: "محمد بن سعود", category: "history", difficulty: "سهل", hint: "أسس الدولة السعودية في القرن الثامن عشر", explanation: "محمد بن سعود هو مؤسس الدولة السعودية الأولى عام 1744", isPublished: true },
  { question: "في أي عام تم توحيد المملكة العربية السعودية؟", answer: "1932", category: "history", difficulty: "متوسط", hint: "في القرن العشرين", explanation: "تم توحيد المملكة العربية السعودية على يد الملك عبد العزيز آل سعود عام 1932", isPublished: true },
  { question: "ما هي عاصمة الدولة الأموية؟", answer: "دمشق", category: "history", difficulty: "سهل", hint: "عاصمة سوريا الحالية", explanation: "دمشق كانت عاصمة الدولة الأموية من 661 إلى 750 ميلادية", isPublished: true },
  { question: "من هو القائد الذي فتح الأندلس؟", answer: "طارق بن زياد", category: "history", difficulty: "متوسط", hint: "اسمه مرتبط بجبل في إسبانيا", explanation: "طارق بن زياد فتح الأندلس عام 711 ميلادية", isPublished: true },
  { question: "في أي معركة انتصر صلاح الدين على الصليبيين؟", answer: "حطين", category: "history", difficulty: "صعب", hint: "معركة شهيرة في فلسطين", explanation: "معركة حطين عام 1187 ميلادية كانت نصراً حاسماً لصلاح الدين", isPublished: true },
  { question: "من هو الخليفة الذي أمر بجمع القرآن؟", answer: "عثمان بن عفان", category: "history", difficulty: "صعب", hint: "ثالث الخلفاء الراشدين", explanation: "عثمان بن عفان أمر بجمع القرآن في مصحف واحد", isPublished: true },

  // Geography questions
  { question: "ما هي أكبر دولة في العالم من حيث المساحة؟", answer: "روسيا", category: "geography", difficulty: "سهل", hint: "تقع في أوروبا وآسيا", explanation: "روسيا هي أكبر دولة في العالم بمساحة 17.1 مليون كيلومتر مربع", isPublished: true },
  { question: "ما هو أطول نهر في العالم؟", answer: "النيل", category: "geography", difficulty: "سهل", hint: "يمر عبر مصر والسودان", explanation: "نهر النيل هو أطول نهر في العالم بطول 6650 كيلومتر", isPublished: true },
  { question: "في أي قارة تقع صحراء كلهاري؟", answer: "أفريقيا", category: "geography", difficulty: "متوسط", hint: "قارة سمراء", explanation: "صحراء كلهاري تقع في جنوب أفريقيا", isPublished: true },
  { question: "ما هي عاصمة أستراليا؟", answer: "كانبيرا", category: "geography", difficulty: "متوسط", hint: "ليست سيدني أو ملبورن", explanation: "كانبيرا هي العاصمة الفيدرالية لأستراليا", isPublished: true },
  { question: "أي دولة تحتوي على أكبر عدد من الجزر؟", answer: "فنلندا", category: "geography", difficulty: "صعب", hint: "دولة إسكندنافية", explanation: "فنلندا تحتوي على أكثر من 267,570 جزيرة", isPublished: true },
  { question: "ما هو أعمق محيط في العالم؟", answer: "المحيط الهادئ", category: "geography", difficulty: "صعب", hint: "أكبر محيط في العالم", explanation: "المحيط الهادئ يحتوي على أعمق نقطة في العالم - خندق ماريانا", isPublished: true },

  // Religion questions
  { question: "كم عدد أركان الإسلام؟", answer: "خمسة", category: "religion", difficulty: "سهل", hint: "عدد أصابع اليد الواحدة", explanation: "أركان الإسلام خمسة: الشهادة، الصلاة، الزكاة، الصيام، الحج", isPublished: true },
  { question: "ما هو أول شهر في السنة الهجرية؟", answer: "محرم", category: "religion", difficulty: "سهل", hint: "شهر حرام", explanation: "محرم هو أول شهر في السنة الهجرية وهو من الأشهر الحرم", isPublished: true },
  { question: "في أي غار نزل الوحي على الرسول محمد؟", answer: "غار حراء", category: "religion", difficulty: "متوسط", hint: "في جبل النور", explanation: "غار حراء في جبل النور بمكة المكرمة حيث نزل الوحي أول مرة", isPublished: true },
  { question: "كم عدد سور القرآن الكريم؟", answer: "114", category: "religion", difficulty: "متوسط", hint: "أكثر من مائة", explanation: "القرآن الكريم يحتوي على 114 سورة", isPublished: true },
  { question: "ما هي أطول سورة في القرآن الكريم؟", answer: "البقرة", category: "religion", difficulty: "صعب", hint: "اسم حيوان", explanation: "سورة البقرة هي أطول سورة في القرآن الكريم", isPublished: true },
  { question: "في أي عام كانت غزوة بدر؟", answer: "2 هجري", category: "religion", difficulty: "صعب", hint: "السنة الثانية من الهجرة", explanation: "غزوة بدر كانت في السنة الثانية من الهجرة", isPublished: true },
];

const sampleGamePackages = [
  { name: "باقة المبتدئين", description: "مثالية للمبتدئين", gameCount: 1, priceInCents: 199, sortOrder: 1, isActive: true },
  { name: "باقة المحترفين", description: "للاعبين المتقدمين", gameCount: 5, priceInCents: 899, sortOrder: 2, isActive: true },
  { name: "باقة الخبراء", description: "للخبراء والمحترفين", gameCount: 10, priceInCents: 1499, sortOrder: 3, isActive: true },
  { name: "باقة الأسرة", description: "مثالية للعائلات", gameCount: 20, priceInCents: 2499, sortOrder: 4, isActive: true },
];

const sampleCoupons = [
  { code: "WELCOME10", discountType: "percentage", discountValue: 10, maxUsage: 100, usageCount: 0, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), isActive: true },
  { code: "FAMILY20", discountType: "percentage", discountValue: 20, maxUsage: 50, usageCount: 0, expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), isActive: true },
];

export async function seedFirebaseData() {
  try {
    console.log("Starting Firebase data seeding...");

    // Create admin user
    const adminPassword = await bcrypt.hash("Seddiq123*", 10);
    const adminUserRef = doc(db, "users", "admin-user-id");
    await setDoc(adminUserRef, {
      email: "mishariiigh@hotmail.com",
      name: "مدير النظام",
      password: adminPassword,
      availableGames: 100,
      isAdmin: true,
      createdAt: new Date(),
    });
    console.log("Admin user created");

    // Seed categories
    for (const category of sampleCategories) {
      await addDoc(collection(db, "categories"), {
        ...category,
        createdAt: new Date(),
      });
    }
    console.log("Categories seeded");

    // Seed questions
    for (const question of sampleQuestions) {
      await addDoc(collection(db, "questions"), {
        ...question,
        createdAt: new Date(),
      });
    }
    console.log("Questions seeded");

    // Seed game packages
    for (const gamePackage of sampleGamePackages) {
      await addDoc(collection(db, "gamePackages"), {
        ...gamePackage,
        createdAt: new Date(),
      });
    }
    console.log("Game packages seeded");

    // Seed coupons
    for (const coupon of sampleCoupons) {
      await addDoc(collection(db, "coupons"), {
        ...coupon,
        createdAt: new Date(),
      });
    }
    console.log("Coupons seeded");

    console.log("Firebase data seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding Firebase data:", error);
    throw error;
  }
}
import { storage } from "./firebase-storage";
import bcrypt from "bcryptjs";

// Simple seeding function using our storage layer
export async function seedBasicData() {
  try {
    console.log("Starting basic data seeding...");

    // Create admin user
    const adminPassword = await bcrypt.hash("Seddiq123*", 10);
    const adminUser = await storage.createUser({
      email: "mishariiigh@hotmail.com",
      name: "مدير النظام",
      password: adminPassword,
      availableGames: 100,
      isAdmin: true,
    });
    console.log("Admin user created:", adminUser.id);

    // Create basic categories
    const categories = [
      { name: "history", displayName: "التاريخ", description: "أسئلة تاريخية متنوعة", isActive: true },
      { name: "geography", displayName: "الجغرافيا", description: "أسئلة جغرافية", isActive: true },
      { name: "religion", displayName: "الدين", description: "أسئلة دينية", isActive: true },
      { name: "sports", displayName: "الرياضة", description: "أسئلة رياضية", isActive: true },
      { name: "culture", displayName: "الثقافة العامة", description: "أسئلة ثقافية عامة", isActive: true },
      { name: "science", displayName: "العلوم", description: "أسئلة علمية", isActive: true },
    ];

    for (const category of categories) {
      await storage.createCategory(category);
    }
    console.log("Categories created");

    // Create basic questions
    const questions = [
      // History questions
      { question: "من هو مؤسس الدولة السعودية الأولى؟", answer: "محمد بن سعود", category: "history", difficulty: "سهل", hint: "أسس الدولة السعودية في القرن الثامن عشر", explanation: "محمد بن سعود هو مؤسس الدولة السعودية الأولى عام 1744" },
      { question: "في أي عام تم توحيد المملكة العربية السعودية؟", answer: "1932", category: "history", difficulty: "متوسط", hint: "في القرن العشرين", explanation: "تم توحيد المملكة العربية السعودية على يد الملك عبد العزيز آل سعود عام 1932" },
      { question: "ما هي عاصمة الدولة الأموية؟", answer: "دمشق", category: "history", difficulty: "سهل", hint: "عاصمة سوريا الحالية", explanation: "دمشق كانت عاصمة الدولة الأموية من 661 إلى 750 ميلادية" },
      { question: "من هو القائد الذي فتح الأندلس؟", answer: "طارق بن زياد", category: "history", difficulty: "متوسط", hint: "اسمه مرتبط بجبل في إسبانيا", explanation: "طارق بن زياد فتح الأندلس عام 711 ميلادية" },
      { question: "في أي معركة انتصر صلاح الدين على الصليبيين؟", answer: "حطين", category: "history", difficulty: "صعب", hint: "معركة شهيرة في فلسطين", explanation: "معركة حطين عام 1187 ميلادية كانت نصراً حاسماً لصلاح الدين" },
      { question: "من هو الخليفة الذي أمر بجمع القرآن؟", answer: "عثمان بن عفان", category: "history", difficulty: "صعب", hint: "ثالث الخلفاء الراشدين", explanation: "عثمان بن عفان أمر بجمع القرآن في مصحف واحد" },

      // Geography questions
      { question: "ما هي أكبر دولة في العالم من حيث المساحة؟", answer: "روسيا", category: "geography", difficulty: "سهل", hint: "تقع في أوروبا وآسيا", explanation: "روسيا هي أكبر دولة في العالم بمساحة 17.1 مليون كيلومتر مربع" },
      { question: "ما هو أطول نهر في العالم؟", answer: "النيل", category: "geography", difficulty: "سهل", hint: "يمر عبر مصر والسودان", explanation: "نهر النيل هو أطول نهر في العالم بطول 6650 كيلومتر" },
      { question: "في أي قارة تقع صحراء كلهاري؟", answer: "أفريقيا", category: "geography", difficulty: "متوسط", hint: "قارة سمراء", explanation: "صحراء كلهاري تقع في جنوب أفريقيا" },
      { question: "ما هي عاصمة أستراليا؟", answer: "كانبيرا", category: "geography", difficulty: "متوسط", hint: "ليست سيدني أو ملبورن", explanation: "كانبيرا هي العاصمة الفيدرالية لأستراليا" },
      { question: "أي دولة تحتوي على أكبر عدد من الجزر؟", answer: "فنلندا", category: "geography", difficulty: "صعب", hint: "دولة إسكندنافية", explanation: "فنلندا تحتوي على أكثر من 267,570 جزيرة" },
      { question: "ما هو أعمق محيط في العالم؟", answer: "المحيط الهادئ", category: "geography", difficulty: "صعب", hint: "أكبر محيط في العالم", explanation: "المحيط الهادئ يحتوي على أعمق نقطة في العالم - خندق ماريانا" },
    ];

    for (const question of questions) {
      await storage.createQuestion(question);
    }
    console.log("Questions created");

    // Create game packages
    const gamePackages = [
      { name: "باقة المبتدئين", description: "مثالية للمبتدئين", gameCount: 1, priceInCents: 199, sortOrder: 1, isActive: true },
      { name: "باقة المحترفين", description: "للاعبين المتقدمين", gameCount: 5, priceInCents: 899, sortOrder: 2, isActive: true },
      { name: "باقة الخبراء", description: "للخبراء والمحترفين", gameCount: 10, priceInCents: 1499, sortOrder: 3, isActive: true },
      { name: "باقة الأسرة", description: "مثالية للعائلات", gameCount: 20, priceInCents: 2499, sortOrder: 4, isActive: true },
    ];

    for (const gamePackage of gamePackages) {
      await storage.createGamePackage(gamePackage);
    }
    console.log("Game packages created");

    // Create coupons
    const coupons = [
      { code: "WELCOME10", discountType: "percentage", discountValue: 10, maxUsage: 100, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), isActive: true },
      { code: "FAMILY20", discountType: "percentage", discountValue: 20, maxUsage: 50, expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), isActive: true },
    ];

    for (const coupon of coupons) {
      await storage.createCoupon(coupon);
    }
    console.log("Coupons created");

    console.log("Basic data seeding completed successfully!");
    return { success: true, adminUserId: adminUser.id };
  } catch (error) {
    console.error("Error seeding basic data:", error);
    throw error;
  }
}

// Run the seeding function
seedBasicData()
  .then((result) => {
    console.log("Seeding completed successfully!", result);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });
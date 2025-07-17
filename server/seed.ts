import { db } from "./db";
import { questions } from "@shared/schema";
import bcrypt from "bcryptjs";
import { users } from "@shared/schema";

const sampleQuestions = [
  // التاريخ - History
  {
    question: "من هو القائد المسلم الذي فتح القسطنطينية؟",
    answer: "السلطان محمد الفاتح",
    category: "التاريخ",
    difficulty: "متوسط",
    hint: "هذا السلطان العثماني الذي حكم في القرن الخامس عشر الميلادي",
    explanation: "السلطان محمد الفاتح (1432-1481) هو السلطان العثماني السابع الذي فتح القسطنطينية عام 1453م، وبذلك أنهى الإمبراطورية البيزنطية وحول المدينة إلى عاصمة للإمبراطورية العثمانية."
  },
  {
    question: "في أي عام تم فتح مكة المكرمة؟",
    answer: "8 هجرية",
    category: "التاريخ",
    difficulty: "سهل",
    hint: "كان هذا الفتح في السنة الثامنة من الهجرة النبوية",
    explanation: "تم فتح مكة المكرمة في السنة الثامنة من الهجرة النبوية، وكان هذا الفتح نقطة تحول مهمة في انتشار الإسلام."
  },
  {
    question: "من هو أول خليفة أموي؟",
    answer: "معاوية بن أبي سفيان",
    category: "التاريخ",
    difficulty: "متوسط",
    hint: "كان والياً على الشام قبل أن يصبح خليفة",
    explanation: "معاوية بن أبي سفيان هو مؤسس الدولة الأموية وأول خلفائها، حكم من 41 إلى 60 هجرية."
  },
  {
    question: "ما اسم المعركة التي انتصر فيها المسلمون على الإمبراطورية البيزنطية عام 636م؟",
    answer: "معركة اليرموك",
    category: "التاريخ",
    difficulty: "صعب",
    hint: "قادها خالد بن الوليد في بلاد الشام",
    explanation: "معركة اليرموك كانت معركة حاسمة بين المسلمين والبيزنطيين، وانتصر فيها المسلمون بقيادة خالد بن الوليد."
  },
  {
    question: "في أي قرن عاش ابن خلدون؟",
    answer: "القرن الرابع عشر الميلادي",
    category: "التاريخ",
    difficulty: "متوسط",
    hint: "عاش في العصر المملوكي",
    explanation: "ابن خلدون (1332-1406) عالم اجتماع وتاريخ عربي، يعتبر مؤسس علم الاجتماع."
  },
  {
    question: "من هو صلاح الدين الأيوبي؟",
    answer: "القائد الذي حرر القدس من الصليبيين",
    category: "التاريخ",
    difficulty: "سهل",
    hint: "قائد مسلم مشهور في فترة الحروب الصليبية",
    explanation: "صلاح الدين الأيوبي قائد عسكري مسلم حرر القدس من الصليبيين عام 1187م."
  },

  // الجغرافيا - Geography
  {
    question: "ما اسم أطول نهر في العالم؟",
    answer: "نهر النيل",
    category: "الجغرافيا",
    difficulty: "سهل",
    hint: "يمر عبر مصر والسودان",
    explanation: "يُعد نهر النيل أطول نهر في العالم بطول يزيد عن 6,650 كم."
  },
  {
    question: "أي دولة عربية تقع في قارتين؟",
    answer: "مصر",
    category: "الجغرافيا",
    difficulty: "متوسط",
    hint: "تقع في إفريقيا وآسيا",
    explanation: "مصر تقع في قارتي إفريقيا وآسيا، حيث تصل بينهما عبر شبه جزيرة سيناء."
  },
  {
    question: "ما هي أكبر صحراء في العالم؟",
    answer: "الصحراء الكبرى",
    category: "الجغرافيا",
    difficulty: "سهل",
    hint: "تقع في شمال أفريقيا",
    explanation: "الصحراء الكبرى هي أكبر صحراء حارة في العالم، تمتد عبر شمال أفريقيا."
  },
  {
    question: "في أي قارة تقع دولة الأرجنتين؟",
    answer: "أمريكا الجنوبية",
    category: "الجغرافيا",
    difficulty: "سهل",
    hint: "القارة الجنوبية من الأمريكتين",
    explanation: "الأرجنتين تقع في قارة أمريكا الجنوبية وهي ثاني أكبر دولة في القارة."
  },
  {
    question: "ما اسم أعلى قمة جبلية في العالم؟",
    answer: "قمة إيفرست",
    category: "الجغرافيا",
    difficulty: "سهل",
    hint: "تقع في جبال الهيمالايا",
    explanation: "قمة إيفرست هي أعلى قمة في العالم بارتفاع 8,848 متر."
  },
  {
    question: "أي دولة تُلقب بـ'أرض الشمس المشرقة'؟",
    answer: "اليابان",
    category: "الجغرافيا",
    difficulty: "متوسط",
    hint: "دولة آسيوية تقع في الشرق الأقصى",
    explanation: "اليابان تُلقب بـ'أرض الشمس المشرقة' بسبب موقعها الجغرافي في الشرق."
  },

  // الدين - Islamic Knowledge
  {
    question: "كم عدد أركان الإسلام؟",
    answer: "خمسة أركان",
    category: "الدين",
    difficulty: "سهل",
    hint: "الشهادتان والصلاة والزكاة والصوم والحج",
    explanation: "أركان الإسلام خمسة: الشهادتان، الصلاة، الزكاة، صوم رمضان، وحج البيت لمن استطاع إليه سبيلاً."
  },
  {
    question: "ما اسم أول سورة نزلت في القرآن الكريم؟",
    answer: "سورة العلق",
    category: "الدين",
    difficulty: "متوسط",
    hint: "تبدأ بـ'اقرأ باسم ربك الذي خلق'",
    explanation: "سورة العلق هي أول سورة نزلت على الرسول محمد صلى الله عليه وسلم."
  },
  {
    question: "في أي شهر هجري يؤدي المسلمون فريضة الحج؟",
    answer: "شهر ذو الحجة",
    category: "الدين",
    difficulty: "سهل",
    hint: "الشهر الثاني عشر في التقويم الهجري",
    explanation: "الحج يؤدى في شهر ذو الحجة، وهو الشهر الثاني عشر من التقويم الهجري."
  },
  {
    question: "من هو خاتم النبيين؟",
    answer: "محمد صلى الله عليه وسلم",
    category: "الدين",
    difficulty: "سهل",
    hint: "الرسول الذي نزل عليه القرآن الكريم",
    explanation: "محمد صلى الله عليه وسلم هو خاتم النبيين والمرسلين."
  },
  {
    question: "كم عدد الصلوات المفروضة في اليوم؟",
    answer: "خمس صلوات",
    category: "الدين",
    difficulty: "سهل",
    hint: "الفجر والظهر والعصر والمغرب والعشاء",
    explanation: "الصلوات المفروضة خمس: الفجر، الظهر، العصر، المغرب، والعشاء."
  },
  {
    question: "ما هو أطول شهر في السنة الهجرية؟",
    answer: "شهر شعبان",
    category: "الدين",
    difficulty: "صعب",
    hint: "الشهر الذي يسبق رمضان",
    explanation: "شهر شعبان هو الشهر الثامن في التقويم الهجري ويسبق شهر رمضان."
  },

  // الرياضة - Sports
  {
    question: "كم عدد اللاعبين في فريق كرة القدم؟",
    answer: "11 لاعباً",
    category: "الرياضة",
    difficulty: "سهل",
    hint: "عدد اللاعبين في الملعب لكل فريق",
    explanation: "في كرة القدم، كل فريق يضم 11 لاعباً في الملعب."
  },
  {
    question: "في أي دولة أقيم كأس العالم لكرة القدم 2022؟",
    answer: "قطر",
    category: "الرياضة",
    difficulty: "سهل",
    hint: "دولة خليجية صغيرة",
    explanation: "كأس العالم لكرة القدم 2022 أقيم في قطر وكان أول كأس عالم يقام في الشرق الأوسط."
  },
  {
    question: "من هو أسرع رجل في العالم؟",
    answer: "يوسين بولت",
    category: "الرياضة",
    difficulty: "متوسط",
    hint: "عداء جامايكي مشهور",
    explanation: "يوسين بولت هو الحائز على الرقم القياسي العالمي في سباق 100 متر."
  },
  {
    question: "كم عدد الحلقات في شعار الألعاب الأولمبية؟",
    answer: "خمس حلقات",
    category: "الرياضة",
    difficulty: "سهل",
    hint: "ترمز للقارات الخمس",
    explanation: "الشعار الأولمبي يتكون من خمس حلقات ترمز للقارات الخمس."
  },
  {
    question: "في أي رياضة يستخدم مصطلح 'الضربة القاضية'؟",
    answer: "الملاكمة",
    category: "الرياضة",
    difficulty: "سهل",
    hint: "رياضة قتالية تستخدم القبضات",
    explanation: "الضربة القاضية مصطلح يستخدم في الملاكمة عندما يسقط المقاتل ولا يستطيع النهوض."
  },
  {
    question: "ما هو الرقم القياسي العالمي لسباق 100 متر للرجال؟",
    answer: "9.58 ثانية",
    category: "الرياضة",
    difficulty: "صعب",
    hint: "سجله يوسين بولت في عام 2009",
    explanation: "الرقم القياسي العالمي لسباق 100 متر للرجال هو 9.58 ثانية سجله يوسين بولت."
  },

  // الثقافة العامة - General Culture
  {
    question: "من هو مؤلف رواية 'مئة عام من العزلة'؟",
    answer: "غابرييل غارسيا ماركيز",
    category: "الثقافة العامة",
    difficulty: "متوسط",
    hint: "كاتب كولومبي حائز على نوبل للآداب",
    explanation: "غابرييل غارسيا ماركيز كاتب كولومبي مشهور وحائز على جائزة نوبل للآداب."
  },
  {
    question: "ما هو اللون الذي ينتج من خلط الأحمر والأزرق؟",
    answer: "البنفسجي",
    category: "الثقافة العامة",
    difficulty: "سهل",
    hint: "لون من الألوان الثانوية",
    explanation: "عند خلط اللون الأحمر مع الأزرق ينتج اللون البنفسجي."
  },
  {
    question: "من هو الرسام الذي رسم لوحة 'الموناليزا'؟",
    answer: "ليوناردو دا فينشي",
    category: "الثقافة العامة",
    difficulty: "متوسط",
    hint: "فنان إيطالي من عصر النهضة",
    explanation: "ليوناردو دا فينشي هو الذي رسم لوحة الموناليزا الشهيرة."
  },
  {
    question: "كم عدد أيام السنة الميلادية؟",
    answer: "365 يوماً",
    category: "الثقافة العامة",
    difficulty: "سهل",
    hint: "في السنة العادية، أما السنة الكبيسة فتحتوي على 366 يوماً",
    explanation: "السنة الميلادية العادية تحتوي على 365 يوماً، والسنة الكبيسة على 366 يوماً."
  },
  {
    question: "ما هو أكبر كوكب في المجموعة الشمسية؟",
    answer: "المشتري",
    category: "الثقافة العامة",
    difficulty: "سهل",
    hint: "كوكب غازي عملاق",
    explanation: "المشتري هو أكبر كوكب في المجموعة الشمسية وهو كوكب غازي عملاق."
  },
  {
    question: "من هو مؤسس شركة مايكروسوفت؟",
    answer: "بيل غيتس",
    category: "الثقافة العامة",
    difficulty: "متوسط",
    hint: "رجل أعمال أمريكي مشهور",
    explanation: "بيل غيتس هو مؤسس شركة مايكروسوفت مع بول ألين عام 1975."
  },

  // العلوم - Science
  {
    question: "ما هو الرمز الكيميائي للذهب؟",
    answer: "Au",
    category: "العلوم",
    difficulty: "متوسط",
    hint: "مشتق من الكلمة اللاتينية aurum",
    explanation: "الرمز الكيميائي للذهب هو Au، مشتق من الكلمة اللاتينية aurum."
  },
  {
    question: "كم عدد الكروموسومات في الخلية البشرية؟",
    answer: "46 كروموسوماً",
    category: "العلوم",
    difficulty: "متوسط",
    hint: "23 زوجاً من الكروموسومات",
    explanation: "الخلية البشرية تحتوي على 46 كروموسوماً، أي 23 زوجاً."
  },
  {
    question: "ما هو أسرع الحيوانات على وجه الأرض؟",
    answer: "الفهد",
    category: "العلوم",
    difficulty: "سهل",
    hint: "حيوان مفترس من فصيلة القطط",
    explanation: "الفهد هو أسرع الحيوانات البرية، يمكنه الجري بسرعة تصل إلى 120 كم/ساعة."
  },
  {
    question: "ما هو الكوكب الأقرب إلى الشمس؟",
    answer: "عطارد",
    category: "العلوم",
    difficulty: "سهل",
    hint: "أصغر كوكب في المجموعة الشمسية",
    explanation: "عطارد هو الكوكب الأقرب إلى الشمس وأصغر كوكب في المجموعة الشمسية."
  },
  {
    question: "ما هو الغاز الذي يشكل أكبر نسبة في الغلاف الجوي؟",
    answer: "النيتروجين",
    category: "العلوم",
    difficulty: "متوسط",
    hint: "يشكل حوالي 78% من الغلاف الجوي",
    explanation: "النيتروجين يشكل حوالي 78% من الغلاف الجوي للأرض."
  },
  {
    question: "من هو مكتشف قانون الجاذبية؟",
    answer: "إسحاق نيوتن",
    category: "العلوم",
    difficulty: "سهل",
    hint: "عالم فيزياء إنجليزي مشهور",
    explanation: "إسحاق نيوتن هو العالم الذي اكتشف قانون الجاذبية العام."
  }
];

async function seedDatabase() {
  try {
    console.log("Starting database seeding...");

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    
    // Check if admin user already exists
    const existingAdmin = await db.select().from(users).where(eq(users.email, "admin@trivia.com"));
    
    if (existingAdmin.length === 0) {
      await db.insert(users).values({
        email: "admin@trivia.com",
        password: hashedPassword,
        name: "مدير النظام",
        availableGames: 10,
        totalGames: 0,
        isAdmin: true,
      });
      console.log("Admin user created successfully");
    } else {
      console.log("Admin user already exists");
    }

    // Check if questions already exist
    const existingQuestions = await db.select().from(questions);
    
    if (existingQuestions.length === 0) {
      await db.insert(questions).values(sampleQuestions);
      console.log(`${sampleQuestions.length} sample questions inserted successfully`);
    } else {
      console.log(`${existingQuestions.length} questions already exist in database`);
    }

    console.log("Database seeding completed successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase };

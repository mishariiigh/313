import { config } from "dotenv";
config();

import { db } from "./firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

// Final 62 authentic Arabic questions to reach exactly 500
const finalQuestions = [
  // History - 10 more
  { category: "history", question: "متى تأسست جامعة الدول العربية؟", answer: "1945", difficulty: "متوسط", hint: "بعد الحرب العالمية الثانية", explanation: "تأسست جامعة الدول العربية في القاهرة عام 1945" },
  { category: "history", question: "من هو أول رئيس لمصر؟", answer: "محمد نجيب", difficulty: "صعب", hint: "قبل عبد الناصر", explanation: "محمد نجيب كان أول رئيس لجمهورية مصر" },
  { category: "history", question: "متى استقلت الكويت؟", answer: "1961", difficulty: "سهل", hint: "في الستينات", explanation: "استقلت الكويت عن بريطانيا عام 1961" },
  { category: "history", question: "من هو مؤسس الدولة السعودية الثانية؟", answer: "تركي بن عبدالله", difficulty: "صعب", hint: "من أجداد آل سعود", explanation: "تركي بن عبدالله أسس الدولة السعودية الثانية" },
  { category: "history", question: "متى فتح عمرو بن العاص مصر؟", answer: "641", difficulty: "صعب", hint: "في القرن السابع", explanation: "فتح عمرو بن العاص مصر عام 641 ميلادية" },
  { category: "history", question: "من هو مؤسس دولة المرابطين؟", answer: "يوسف بن تاشفين", difficulty: "صعب", hint: "في المغرب والأندلس", explanation: "يوسف بن تاشفين أسس دولة المرابطين" },
  { category: "history", question: "متى انتهت الدولة الأموية في الأندلس؟", answer: "1031", difficulty: "صعب", hint: "في القرن الحادي عشر", explanation: "انتهت الدولة الأموية في الأندلس عام 1031" },
  { category: "history", question: "من هو فاتح السند؟", answer: "محمد بن القاسم", difficulty: "صعب", hint: "قائد أموي شاب", explanation: "محمد بن القاسم فتح السند للمسلمين" },
  { category: "history", question: "متى سقطت بغداد على يد المغول؟", answer: "1258", difficulty: "صعب", hint: "في القرن الثالث عشر", explanation: "سقطت بغداد على يد هولاكو عام 1258" },
  { category: "history", question: "من هو مؤسس الدولة الغزنوية؟", answer: "سبكتكين", difficulty: "صعب", hint: "في أفغانستان", explanation: "سبكتكين أسس الدولة الغزنوية" },

  // Geography - 10 more
  { category: "geography", question: "ما هي عاصمة قطر؟", answer: "الدوحة", difficulty: "سهل", hint: "مدينة ساحلية", explanation: "الدوحة عاصمة قطر وأكبر مدنها" },
  { category: "geography", question: "أين يقع جبل طارق؟", answer: "إسبانيا", difficulty: "متوسط", hint: "في أقصى جنوب أوروبا", explanation: "جبل طارق يقع في أقصى جنوب إسبانيا" },
  { category: "geography", question: "ما هي أكبر بحيرة في العالم؟", answer: "بحر قزوين", difficulty: "متوسط", hint: "بين أوروبا وآسيا", explanation: "بحر قزوين أكبر بحيرة في العالم" },
  { category: "geography", question: "في أي دولة تقع صحراء جوبي؟", answer: "الصين", difficulty: "صعب", hint: "في شرق آسيا", explanation: "صحراء جوبي تقع في شمال الصين" },
  { category: "geography", question: "ما هو أطول نهر في أوروبا؟", answer: "الفولغا", difficulty: "صعب", hint: "في روسيا", explanation: "نهر الفولغا أطول أنهار أوروبا" },
  { category: "geography", question: "أين تقع جزر القمر؟", answer: "المحيط الهندي", difficulty: "متوسط", hint: "شرق أفريقيا", explanation: "جزر القمر تقع في المحيط الهندي" },
  { category: "geography", question: "ما هي عاصمة النرويج؟", answer: "أوسلو", difficulty: "متوسط", hint: "دولة اسكندنافية", explanation: "أوسلو عاصمة النرويج" },
  { category: "geography", question: "في أي قارة تقع تشيلي؟", answer: "أمريكا الجنوبية", difficulty: "سهل", hint: "دولة طويلة ونحيفة", explanation: "تشيلي تقع في غرب أمريكا الجنوبية" },
  { category: "geography", question: "ما هي أصغر قارة؟", answer: "أستراليا", difficulty: "سهل", hint: "محاطة بالمحيطات", explanation: "أستراليا أصغر القارات" },
  { category: "geography", question: "أين يقع مثلث برمودا؟", answer: "المحيط الأطلسي", difficulty: "متوسط", hint: "قرب الولايات المتحدة", explanation: "مثلث برمودا يقع في المحيط الأطلسي" },

  // Sports - 11 more
  { category: "sports", question: "في أي عام أقيمت أولمبياد لندن؟", answer: "2012", difficulty: "متوسط", hint: "في العقد الثاني من الألفية", explanation: "أقيمت أولمبياد لندن عام 2012" },
  { category: "sports", question: "كم عدد اللاعبين في فريق الهوكي؟", answer: "6", difficulty: "صعب", hint: "أقل من كرة القدم", explanation: "فريق الهوكي يتكون من 6 لاعبين" },
  { category: "sports", question: "في أي رياضة يشتهر تايغر وودز؟", answer: "الجولف", difficulty: "سهل", hint: "رياضة العصا والكرة", explanation: "تايغر وودز أشهر لاعب جولف" },
  { category: "sports", question: "كم عدد اللاعبين في فريق البيسبول؟", answer: "9", difficulty: "صعب", hint: "رياضة أمريكية", explanation: "فريق البيسبول يتكون من 9 لاعبين" },
  { category: "sports", question: "في أي رياضة تستخدم كلمة 'سترايك'؟", answer: "البولينغ", difficulty: "متوسط", hint: "رياضة الكرات والدبابيس", explanation: "السترايك في البولينغ هو إسقاط جميع الدبابيس" },
  { category: "sports", question: "كم مدة مباراة كرة اليد؟", answer: "60 دقيقة", difficulty: "متوسط", hint: "شوطان كل منهما 30 دقيقة", explanation: "مباراة كرة اليد تدوم 60 دقيقة" },
  { category: "sports", question: "في أي دولة نشأت رياضة التايكوندو؟", answer: "كوريا الجنوبية", difficulty: "صعب", hint: "دولة آسيوية", explanation: "التايكوندو نشأت في كوريا الجنوبية" },
  { category: "sports", question: "كم نقطة للفوز في تنس الطاولة؟", answer: "11", difficulty: "متوسط", hint: "رقم من خانتين متشابهتين", explanation: "للفوز في تنس الطاولة تحتاج 11 نقطة" },
  { category: "sports", question: "في أي رياضة يستخدم مصطلح 'فول'؟", answer: "البيسبول", difficulty: "صعب", hint: "رياضة أمريكية", explanation: "الفول في البيسبول هو الكرة خارج الملعب" },
  { category: "sports", question: "كم عدد حلبات السباق في الفورمولا 1؟", answer: "متغير", difficulty: "صعب", hint: "يختلف كل موسم", explanation: "عدد حلبات الفورمولا 1 يختلف كل موسم" },
  { category: "sports", question: "في أي رياضة يشتهر روجر فيدرر؟", answer: "التنس", difficulty: "سهل", hint: "رياضة المضرب", explanation: "روجر فيدرر أشهر لاعب تنس سويسري" },

  // Science - 10 more
  { category: "science", question: "ما هو الرمز الكيميائي للكالسيوم؟", answer: "Ca", difficulty: "متوسط", hint: "مهم للعظام", explanation: "Ca هو الرمز الكيميائي للكالسيوم" },
  { category: "science", question: "كم عدد أنواع فصائل الدم؟", answer: "4", difficulty: "سهل", hint: "O وA وB وAB", explanation: "يوجد 4 فصائل دم رئيسية" },
  { category: "science", question: "من اكتشف الأشعة السينية؟", answer: "رونتغن", difficulty: "صعب", hint: "عالم ألماني", explanation: "ويلهلم رونتغن اكتشف الأشعة السينية" },
  { category: "science", question: "ما هو أكبر عضو في جسم الإنسان؟", answer: "الجلد", difficulty: "متوسط", hint: "يغطي الجسم", explanation: "الجلد أكبر أعضاء جسم الإنسان" },
  { category: "science", question: "كم عدد أسنان القط؟", answer: "30", difficulty: "صعب", hint: "ثلاثون", explanation: "القط البالغ له 30 سن" },
  { category: "science", question: "من اخترع الديناميت؟", answer: "نوبل", difficulty: "متوسط", hint: "صاحب جائزة نوبل", explanation: "ألفريد نوبل اخترع الديناميت" },
  { category: "science", question: "ما هو أبطأ الحيوانات؟", answer: "الحلزون", difficulty: "سهل", hint: "حيوان صدفي", explanation: "الحلزون من أبطأ الحيوانات" },
  { category: "science", question: "كم عدد أوجه المكعب؟", answer: "6", difficulty: "سهل", hint: "شكل هندسي", explanation: "المكعب له 6 أوجه" },
  { category: "science", question: "من وضع نظرية النسبية؟", answer: "آينشتاين", difficulty: "سهل", hint: "عالم ألماني مشهور", explanation: "ألبرت آينشتاين وضع نظرية النسبية" },
  { category: "science", question: "ما هو أقرب نجم للأرض؟", answer: "الشمس", difficulty: "سهل", hint: "مصدر الضوء والحرارة", explanation: "الشمس أقرب النجوم إلى الأرض" },

  // Religion - 10 more
  { category: "religion", question: "كم عدد السجدات في القرآن؟", answer: "15", difficulty: "صعب", hint: "أكثر من 10", explanation: "يوجد 15 سجدة في القرآن الكريم" },
  { category: "religion", question: "في أي سورة آية الكرسي؟", answer: "البقرة", difficulty: "متوسط", hint: "أطول سور القرآن", explanation: "آية الكرسي في سورة البقرة" },
  { category: "religion", question: "كم عدد أسماء الله الحسنى؟", answer: "99", difficulty: "سهل", hint: "تسعة وتسعون", explanation: "أسماء الله الحسنى 99 اسماً" },
  { category: "religion", question: "من هو النبي الذي ابتلعه الحوت؟", answer: "يونس", difficulty: "سهل", hint: "ذو النون", explanation: "النبي يونس ابتلعه الحوت" },
  { category: "religion", question: "كم مرة ذكرت كلمة الجنة في القرآن؟", answer: "66", difficulty: "صعب", hint: "أكثر من 60", explanation: "ذكرت كلمة الجنة 66 مرة في القرآن" },
  { category: "religion", question: "من هو إمام المسجد الحرام؟", answer: "متعدد", difficulty: "صعب", hint: "أكثر من واحد", explanation: "المسجد الحرام له عدة أئمة" },
  { category: "religion", question: "في أي عام فرضت الزكاة؟", answer: "2 هجرية", difficulty: "صعب", hint: "السنة الثانية للهجرة", explanation: "فرضت الزكاة في السنة الثانية للهجرة" },
  { category: "religion", question: "كم عدد آيات القرآن؟", answer: "6236", difficulty: "صعب", hint: "أكثر من 6000", explanation: "آيات القرآن 6236 آية" },
  { category: "religion", question: "من هو خاتم الأنبياء؟", answer: "محمد", difficulty: "سهل", hint: "الرسول الكريم", explanation: "محمد صلى الله عليه وسلم خاتم الأنبياء" },
  { category: "religion", question: "في أي ليلة أسري بالرسول؟", answer: "ليلة الإسراء والمعراج", difficulty: "متوسط", hint: "رحلة إلى المسجد الأقصى", explanation: "أسري بالرسول في ليلة الإسراء والمعراج" },

  // Me7gan - 11 more
  { category: "me7gan", question: "من هو مؤلف كتاب الأغاني؟", answer: "الأصفهاني", difficulty: "صعب", hint: "أبو الفرج", explanation: "أبو الفرج الأصفهاني ألف كتاب الأغاني" },
  { category: "me7gan", question: "ما هو اللقب الشهير لدمشق؟", answer: "الفيحاء", difficulty: "متوسط", hint: "عاصمة سوريا", explanation: "دمشق تُلقب بالفيحاء" },
  { category: "me7gan", question: "من هو صاحب لقب رهين المحبسين؟", answer: "أبو العلاء المعري", difficulty: "صعب", hint: "شاعر وفيلسوف", explanation: "أبو العلاء المعري لُقب برهين المحبسين" },
  { category: "me7gan", question: "ما هو الطعام الشعبي في المغرب؟", answer: "الكسكس", difficulty: "سهل", hint: "من السميد والخضار", explanation: "الكسكس أشهر الأطباق المغربية" },
  { category: "me7gan", question: "من هو ملحن النشيد الوطني الكويتي؟", answer: "إبراهيم الصولة", difficulty: "صعب", hint: "موسيقار كويتي", explanation: "إبراهيم الصولة لحن النشيد الوطني الكويتي" },
  { category: "me7gan", question: "ما هو اللقب الشهير للقاهرة؟", answer: "أم الدنيا", difficulty: "سهل", hint: "عاصمة مصر", explanation: "القاهرة تُلقب بأم الدنيا" },
  { category: "me7gan", question: "من هو شاعر النيل؟", answer: "حافظ إبراهيم", difficulty: "متوسط", hint: "شاعر مصري", explanation: "حافظ إبراهيم لُقب بشاعر النيل" },
  { category: "me7gan", question: "ما هو المشروب الشعبي في العراق؟", answer: "الشاي", difficulty: "سهل", hint: "يشرب في الاستكان", explanation: "الشاي المشروب الشعبي في العراق" },
  { category: "me7gan", question: "من هو كاتب رواية الأسود يليق بك؟", answer: "أحلام مستغانمي", difficulty: "صعب", hint: "كاتبة جزائرية", explanation: "أحلام مستغانمي كتبت رواية الأسود يليق بك" },
  { category: "me7gan", question: "ما هو الطبق الشعبي في الخليج؟", answer: "المندي", difficulty: "سهل", hint: "أرز ولحم", explanation: "المندي من أشهر الأطباق الخليجية" },
  { category: "me7gan", question: "من هو مؤلف كتاب البخلاء؟", answer: "الجاحظ", difficulty: "صعب", hint: "أديب عباسي", explanation: "الجاحظ ألف كتاب البخلاء" }
];

async function addFinal62() {
  console.log("🎯 Adding final 62 questions to reach exactly 500...");
  
  try {
    const questionsRef = collection(db, "questions");
    const currentSnapshot = await getDocs(questionsRef);
    console.log(`Current questions: ${currentSnapshot.size}`);
    
    let added = 0;
    for (const question of finalQuestions) {
      await addDoc(questionsRef, {
        ...question,
        isPublished: true,
        createdAt: new Date(),
      });
      added++;
      
      if (added % 20 === 0) {
        console.log(`Added ${added}/${finalQuestions.length}...`);
      }
    }
    
    console.log(`✅ Added ${added} questions!`);
    
    // Final count
    const finalSnapshot = await getDocs(questionsRef);
    const byCategory = {};
    finalSnapshot.docs.forEach(doc => {
      const data = doc.data();
      byCategory[data.category] = (byCategory[data.category] || 0) + 1;
    });
    
    console.log("\n🎉 FINAL DISTRIBUTION:");
    let total = 0;
    Object.entries(byCategory).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count} questions`);
      total += count;
    });
    
    console.log(`\n🚀 TOTAL QUESTIONS: ${total}`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

addFinal62();
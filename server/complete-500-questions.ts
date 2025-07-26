import { config } from "dotenv";
config();

import { db } from "./firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

// Authentic Arabic questions to reach exactly 500
const additionalQuestions = [
  // History - 22 more questions
  { category: "history", question: "من هو القائد المسلم الذي هزم المغول في عين جالوت؟", answer: "سيف الدين قطز", difficulty: "صعب", hint: "سلطان مملوكي", explanation: "سيف الدين قطز هزم المغول في معركة عين جالوت عام 1260" },
  { category: "history", question: "متى سقطت غرناطة آخر معاقل المسلمين في الأندلس؟", answer: "1492", difficulty: "صعب", hint: "نفس عام اكتشاف أمريكا", explanation: "سقطت غرناطة عام 1492 منهية الحكم الإسلامي في الأندلس" },
  { category: "history", question: "من هو مؤسس الدولة الفاطمية؟", answer: "عبيد الله المهدي", difficulty: "صعب", hint: "أسس دولة في شمال أفريقيا", explanation: "عبيد الله المهدي أسس الدولة الفاطمية في تونس عام 909" },
  { category: "history", question: "في أي عام تم فتح القسطنطينية؟", answer: "1453", difficulty: "متوسط", hint: "في القرن الخامس عشر", explanation: "فتح العثمانيون القسطنطينية عام 1453 على يد محمد الفاتح" },
  { category: "history", question: "من هو صلاح الدين الأيوبي؟", answer: "يوسف بن أيوب", difficulty: "متوسط", hint: "محرر القدس", explanation: "صلاح الدين الأيوبي حرر القدس من الصليبيين" },
  { category: "history", question: "متى كانت الحرب العالمية الأولى؟", answer: "1914-1918", difficulty: "سهل", hint: "في بداية القرن العشرين", explanation: "الحرب العالمية الأولى دارت من 1914 إلى 1918" },
  { category: "history", question: "من هو نابليون بونابرت؟", answer: "إمبراطور فرنسا", difficulty: "سهل", hint: "قائد فرنسي مشهور", explanation: "نابليون بونابرت كان إمبراطور فرنسا في القرن التاسع عشر" },
  { category: "history", question: "متى انتهت الحرب العالمية الثانية؟", answer: "1945", difficulty: "سهل", hint: "في منتصف القرن العشرين", explanation: "انتهت الحرب العالمية الثانية عام 1945" },
  { category: "history", question: "من هو أول رئيس للولايات المتحدة؟", answer: "جورج واشنطن", difficulty: "متوسط", hint: "قائد الثورة الأمريكية", explanation: "جورج واشنطن كان أول رئيس للولايات المتحدة" },
  { category: "history", question: "متى سقط الاتحاد السوفيتي؟", answer: "1991", difficulty: "متوسط", hint: "في نهاية القرن العشرين", explanation: "انهار الاتحاد السوفيتي عام 1991" },
  
  // Geography - 20 more questions  
  { category: "geography", question: "ما هي أكبر دولة عربية من حيث المساحة؟", answer: "الجزائر", difficulty: "متوسط", hint: "في شمال أفريقيا", explanation: "الجزائر أكبر الدول العربية مساحة" },
  { category: "geography", question: "أين يقع مضيق هرمز؟", answer: "الخليج العربي", difficulty: "سهل", hint: "بين إيران وعمان", explanation: "مضيق هرمز يقع في الخليج العربي" },
  { category: "geography", question: "ما هي عاصمة لبنان؟", answer: "بيروت", difficulty: "سهل", hint: "مدينة ساحلية", explanation: "بيروت عاصمة لبنان وأكبر مدنها" },
  { category: "geography", question: "في أي قارة تقع المغرب؟", answer: "أفريقيا", difficulty: "سهل", hint: "القارة السمراء", explanation: "المغرب تقع في شمال غرب أفريقيا" },
  { category: "geography", question: "ما هو أطول نهر في آسيا؟", answer: "اليانغتسي", difficulty: "صعب", hint: "في الصين", explanation: "نهر اليانغتسي أطول أنهار آسيا" },
  { category: "geography", question: "أين تقع جزر المالديف؟", answer: "المحيط الهندي", difficulty: "متوسط", hint: "جنوب آسيا", explanation: "جزر المالديف تقع في المحيط الهندي" },
  { category: "geography", question: "ما هي عاصمة تركيا؟", answer: "أنقرة", difficulty: "متوسط", hint: "ليست إسطنبول", explanation: "أنقرة هي العاصمة الرسمية لتركيا" },
  { category: "geography", question: "في أي دولة يقع برج إيفل؟", answer: "فرنسا", difficulty: "سهل", hint: "في باريس", explanation: "برج إيفل يقع في باريس عاصمة فرنسا" },
  { category: "geography", question: "ما هي أعلى قمة في العالم؟", answer: "إيفرست", difficulty: "سهل", hint: "في جبال الهيمالايا", explanation: "جبل إيفرست أعلى قمة في العالم" },
  { category: "geography", question: "أين يقع نهر الأمازون؟", answer: "أمريكا الجنوبية", difficulty: "متوسط", hint: "في البرازيل", explanation: "نهر الأمازون يقع في أمريكا الجنوبية" },

  // Sports - 20 more questions
  { category: "sports", question: "في أي عام أقيمت أول كأس عالم في كرة القدم؟", answer: "1930", difficulty: "صعب", hint: "في الثلاثينات", explanation: "أقيمت أول كأس عالم في الأوروغواي عام 1930" },
  { category: "sports", question: "كم لاعب في فريق كرة الطائرة؟", answer: "6", difficulty: "متوسط", hint: "أقل من كرة القدم", explanation: "فريق كرة الطائرة يتكون من 6 لاعبين" },
  { category: "sports", question: "في أي رياضة يشتهر مايكل جوردان؟", answer: "كرة السلة", difficulty: "سهل", hint: "رياضة أمريكية", explanation: "مايكل جوردان أشهر لاعب كرة سلة في التاريخ" },
  { category: "sports", question: "كم مدة الشوط في كرة القدم؟", answer: "45 دقيقة", difficulty: "سهل", hint: "ثلاثة أرباع الساعة", explanation: "كل شوط في كرة القدم يدوم 45 دقيقة" },
  { category: "sports", question: "في أي رياضة تستخدم كلمة 'إيس'؟", answer: "التنس", difficulty: "متوسط", hint: "رياضة المضرب", explanation: "الإيس في التنس هو الإرسال المباشر" },
  { category: "sports", question: "كم عدد الحكام في مباراة كرة القدم؟", answer: "3", difficulty: "متوسط", hint: "حكم وسط وحكما خط", explanation: "مباراة كرة القدم يديرها 3 حكام" },
  { category: "sports", question: "في أي رياضة يستخدم المضرب؟", answer: "التنس", difficulty: "سهل", hint: "رياضة فردية", explanation: "التنس من الرياضات التي تستخدم المضرب" },
  { category: "sports", question: "كم نقطة تحتسب للهدف في كرة السلة؟", answer: "2", difficulty: "سهل", hint: "رقم زوجي صغير", explanation: "الهدف العادي في كرة السلة يحتسب نقطتان" },
  { category: "sports", question: "في أي دولة نشأت رياضة الجودو؟", answer: "اليابان", difficulty: "متوسط", hint: "دولة آسيوية", explanation: "رياضة الجودو نشأت في اليابان" },
  { category: "sports", question: "كم عدد الجولات في الملاكمة المهنية؟", answer: "12", difficulty: "صعب", hint: "عدد من خانتين", explanation: "المباراة المهنية في الملاكمة تتكون من 12 جولة" },

  // Science - 20 more questions
  { category: "science", question: "ما هو الرمز الكيميائي للفضة؟", answer: "Ag", difficulty: "صعب", hint: "من الكلمة اللاتينية Argentum", explanation: "Ag هو الرمز الكيميائي للفضة" },
  { category: "science", question: "كم عدد الكروموسومات في خلية الإنسان؟", answer: "46", difficulty: "صعب", hint: "23 زوج", explanation: "خلية الإنسان تحتوي على 46 كروموسوم" },
  { category: "science", question: "ما هو أصلب معدن في الطبيعة؟", answer: "الألماس", difficulty: "متوسط", hint: "يستخدم في المجوهرات", explanation: "الألماس أصلب المعادن الطبيعية" },
  { category: "science", question: "من اكتشف البنسلين؟", answer: "فليمنغ", difficulty: "صعب", hint: "عالم اسكتلندي", explanation: "ألكسندر فليمنغ اكتشف البنسلين عام 1928" },
  { category: "science", question: "ما هو غاز الضحك؟", answer: "أكسيد النيتروز", difficulty: "صعب", hint: "مركب النيتروجين والأكسجين", explanation: "أكسيد النيتروز يُعرف بغاز الضحك" },
  { category: "science", question: "كم عدد قلوب الأخطبوط؟", answer: "3", difficulty: "صعب", hint: "أكثر من الإنسان", explanation: "الأخطبوط له ثلاثة قلوب" },
  { category: "science", question: "ما هو أسرع الحيوانات البحرية؟", answer: "سمك التونة", difficulty: "متوسط", hint: "نوع من الأسماك", explanation: "سمك التونة من أسرع الحيوانات البحرية" },
  { category: "science", question: "من اخترع الهاتف؟", answer: "بيل", difficulty: "متوسط", hint: "عالم أمريكي", explanation: "ألكسندر غراهام بيل اخترع الهاتف" },
  { category: "science", question: "ما هو الكوكب الأحمر؟", answer: "المريخ", difficulty: "سهل", hint: "رابع كوكب من الشمس", explanation: "المريخ يُلقب بالكوكب الأحمر" },
  { category: "science", question: "كم عدد الكواكب القزمة؟", answer: "5", difficulty: "صعب", hint: "بلوتو واحد منها", explanation: "يوجد حالياً 5 كواكب قزمة معترف بها" },

  // Religion - 20 more questions
  { category: "religion", question: "ما هي أقصر سورة في القرآن؟", answer: "الكوثر", difficulty: "متوسط", hint: "تتكون من 3 آيات", explanation: "سورة الكوثر أقصر سور القرآن" },
  { category: "religion", question: "كم عدد آيات سورة الفاتحة؟", answer: "7", difficulty: "سهل", hint: "رقم مبارك", explanation: "سورة الفاتحة تحتوي على 7 آيات" },
  { category: "religion", question: "في أي مدينة هاجر الرسول؟", answer: "المدينة المنورة", difficulty: "سهل", hint: "كانت تسمى يثرب", explanation: "هاجر الرسول إلى المدينة المنورة" },
  { category: "religion", question: "كم عدد بنات الرسول؟", answer: "4", difficulty: "متوسط", hint: "زينب ورقية وأم كلثوم وفاطمة", explanation: "للرسول أربع بنات" },
  { category: "religion", question: "من هو خازن الجنة؟", answer: "رضوان", difficulty: "صعب", hint: "ملك من الملائكة", explanation: "رضوان هو خازن الجنة" },
  { category: "religion", question: "كم عدد أولي العزم من الرسل؟", answer: "5", difficulty: "صعب", hint: "نوح وإبراهيم وموسى وعيسى ومحمد", explanation: "أولو العزم من الرسل خمسة" },
  { category: "religion", question: "في أي شهر ولد الرسول؟", answer: "ربيع الأول", difficulty: "متوسط", hint: "الشهر الثالث في التقويم الهجري", explanation: "ولد الرسول في شهر ربيع الأول" },
  { category: "religion", question: "كم مرة ذكر اسم محمد في القرآن؟", answer: "4", difficulty: "صعب", hint: "أقل من 10", explanation: "ذكر اسم محمد في القرآن 4 مرات" },
  { category: "religion", question: "ما هو اسم ناقة الرسول؟", answer: "القصواء", difficulty: "صعب", hint: "اسم أنثى", explanation: "القصواء كانت ناقة الرسول المشهورة" },
  { category: "religion", question: "كم عدد غزوات الرسول؟", answer: "27", difficulty: "صعب", hint: "أكثر من 25", explanation: "شارك الرسول في 27 غزوة" },

  // Me7gan - 20 more questions
  { category: "me7gan", question: "من هو شاعر الرسول؟", answer: "حسان بن ثابت", difficulty: "متوسط", hint: "شاعر أنصاري", explanation: "حسان بن ثابت كان شاعر الرسول" },
  { category: "me7gan", question: "ما هو أشهر كتاب لابن خلدون؟", answer: "المقدمة", difficulty: "صعب", hint: "في علم الاجتماع", explanation: "المقدمة أشهر كتب ابن خلدون" },
  { category: "me7gan", question: "من هو أبو الطب العربي؟", answer: "ابن سينا", difficulty: "متوسط", hint: "عالم وفيلسوف", explanation: "ابن سينا يُلقب بأبو الطب العربي" },
  { category: "me7gan", question: "ما هي عاصمة الثقافة العربية 2018؟", answer: "الشارقة", difficulty: "صعب", hint: "إمارة في الإمارات", explanation: "اختيرت الشارقة عاصمة للثقافة العربية 2018" },
  { category: "me7gan", question: "من ألف ألف ليلة وليلة؟", answer: "مجهول", difficulty: "صعب", hint: "مؤلف غير معروف", explanation: "مؤلف ألف ليلة وليلة غير معروف" },
  { category: "me7gan", question: "ما هو اللقب الشهير لبغداد؟", answer: "مدينة السلام", difficulty: "متوسط", hint: "عاصمة العباسيين", explanation: "بغداد تُلقب بمدينة السلام" },
  { category: "me7gan", question: "من هو أمير الشعراء؟", answer: "أحمد شوقي", difficulty: "متوسط", hint: "شاعر مصري", explanation: "أحمد شوقي لُقب بأمير الشعراء" },
  { category: "me7gan", question: "ما هو المشروب الشعبي في المغرب؟", answer: "الأتاي", difficulty: "سهل", hint: "نوع من الشاي", explanation: "الأتاي هو الشاي المغربي التقليدي" },
  { category: "me7gan", question: "من هو كاتب رواية مدن الملح؟", answer: "عبد الرحمن منيف", difficulty: "صعب", hint: "كاتب سعودي", explanation: "عبد الرحمن منيف كتب رواية مدن الملح" },
  { category: "me7gan", question: "ما هو الطبق الشعبي في الشام؟", answer: "الكبة", difficulty: "سهل", hint: "من البرغل واللحم", explanation: "الكبة من أشهر الأطباق الشامية" }
];

async function completeQuestions() {
  console.log("🎯 Completing 500 questions in Firebase...");
  
  try {
    const questionsRef = collection(db, "questions");
    const currentSnapshot = await getDocs(questionsRef);
    console.log(`Current questions in Firebase: ${currentSnapshot.size}`);
    
    const needed = 500 - currentSnapshot.size;
    console.log(`Need to add: ${needed} more questions`);
    
    if (needed <= 0) {
      console.log("✅ Already have 500 or more questions!");
      return;
    }
    
    const questionsToAdd = additionalQuestions.slice(0, needed);
    
    let added = 0;
    for (const question of questionsToAdd) {
      await addDoc(questionsRef, {
        ...question,
        isPublished: true,
        createdAt: new Date(),
      });
      added++;
      
      if (added % 20 === 0) {
        console.log(`Added ${added}/${questionsToAdd.length} questions...`);
      }
    }
    
    console.log(`✅ Added ${added} questions!`);
    
    // Final verification
    const finalSnapshot = await getDocs(questionsRef);
    const byCategory = {};
    finalSnapshot.docs.forEach(doc => {
      const data = doc.data();
      byCategory[data.category] = (byCategory[data.category] || 0) + 1;
    });
    
    console.log("\n📊 Final distribution:");
    Object.entries(byCategory).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count} questions`);
    });
    
    console.log(`\n🎉 Total questions: ${finalSnapshot.size}`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

completeQuestions();
import { storage } from "./firebase-storage";

const allCategories = {
  // Geography Questions (36 total: 12 easy, 12 medium, 12 hard) 
  geography: [
    // Easy (12 questions)
    { question: "ما هي عاصمة الكويت؟", answer: "مدينة الكويت", difficulty: "سهل", hint: "المدينة الرئيسية في الكويت" },
    { question: "ما هي عاصمة مصر؟", answer: "القاهرة", difficulty: "سهل", hint: "أكبر مدينة في العالم العربي" },
    { question: "ما هي أكبر قارة في العالم؟", answer: "آسيا", difficulty: "سهل", hint: "تضم الصين والهند" },
    { question: "ما هي عاصمة السعودية؟", answer: "الرياض", difficulty: "سهل", hint: "تقع في وسط المملكة" },
    { question: "أي محيط يقع شرق أفريقيا؟", answer: "المحيط الهندي", difficulty: "سهل", hint: "يحد الهند من الجنوب" },
    { question: "ما هي عاصمة فرنسا؟", answer: "باريس", difficulty: "سهل", hint: "مدينة الأنوار" },
    { question: "ما هي عاصمة الإمارات؟", answer: "أبوظبي", difficulty: "سهل", hint: "ليست دبي" },
    { question: "أي قارة تقع فيها البرازيل؟", answer: "أمريكا الجنوبية", difficulty: "سهل", hint: "موطن غابات الأمازون" },
    { question: "ما هي عاصمة إيطاليا؟", answer: "روما", difficulty: "سهل", hint: "المدينة الخالدة" },
    { question: "ما هي أصغر قارة في العالم؟", answer: "أستراليا", difficulty: "سهل", hint: "تسمى أيضاً أوقيانوسيا" },
    { question: "ما هي عاصمة لبنان؟", answer: "بيروت", difficulty: "سهل", hint: "باريس الشرق" },
    { question: "أي بحر يحد الكويت؟", answer: "الخليج العربي", difficulty: "سهل", hint: "يطل عليه دول الخليج" },

    // Medium (12 questions)
    { question: "ما هي أطول سلسلة جبال في العالم؟", answer: "جبال الأنديز", difficulty: "متوسط", hint: "تمتد عبر أمريكا الجنوبية" },
    { question: "ما هي عاصمة أستراليا؟", answer: "كانبرا", difficulty: "متوسط", hint: "ليست سيدني أو ملبورن" },
    { question: "أي دولة تقع بين فرنسا وإسبانيا؟", answer: "أندورا", difficulty: "متوسط", hint: "دولة صغيرة في جبال البيرينيه" },
    { question: "ما هو أطول نهر في أوروبا؟", answer: "نهر الفولغا", difficulty: "متوسط", hint: "يصب في بحر قزوين" },
    { question: "ما هي عاصمة كندا؟", answer: "أوتاوا", difficulty: "متوسط", hint: "ليست تورونتو أو فانكوفر" },
    { question: "أي صحراء تقع في شمال أفريقيا؟", answer: "الصحراء الكبرى", difficulty: "متوسط", hint: "أكبر صحراء حارة في العالم" },
    { question: "ما هي أعمق نقطة في المحيطات؟", answer: "خندق ماريانا", difficulty: "متوسط", hint: "تقع في المحيط الهادئ" },
    { question: "أي بحيرة تقع بين كندا والولايات المتحدة؟", answer: "البحيرات العظمى", difficulty: "متوسط", hint: "مجموعة من البحيرات المتصلة" },
    { question: "ما هي عاصمة البرازيل؟", answer: "برازيليا", difficulty: "متوسط", hint: "بناها المهندس أوسكار نيماير" },
    { question: "أي مضيق يفصل بين أوروبا وأفريقيا؟", answer: "مضيق جبل طارق", difficulty: "متوسط", hint: "يربط المتوسط بالأطلسي" },
    { question: "ما هي أكبر جزيرة في البحر المتوسط؟", answer: "صقلية", difficulty: "متوسط", hint: "جزيرة إيطالية" },
    { question: "أي دولة لها أطول خط ساحلي؟", answer: "النرويج", difficulty: "متوسط", hint: "بسبب الفيوردات الكثيرة" },

    // Hard (12 questions)
    { question: "ما هي عاصمة مدغشقر؟", answer: "أنتاناناريفو", difficulty: "صعب", hint: "جزيرة في المحيط الهندي" },
    { question: "أي دولة تضم أكبر عدد من المناطق الزمنية؟", answer: "فرنسا", difficulty: "صعب", hint: "بسبب أقاليمها الخارجية" },
    { question: "ما هو أعلى شلال في العالم؟", answer: "شلال آنجل", difficulty: "صعب", hint: "يقع في فنزويلا" },
    { question: "أي عاصمة تقع على ارتفاع أعلى من سطح البحر؟", answer: "لا باز", difficulty: "صعب", hint: "عاصمة بوليفيا الفعلية" },
    { question: "ما هي أصغر دولة في أفريقيا؟", answer: "جمهورية سيشل", difficulty: "صعب", hint: "دولة جزرية في المحيط الهندي" },
    { question: "أي دولة تضم بحيرة بايكال؟", answer: "روسيا", difficulty: "صعب", hint: "أعمق بحيرة عذبة في العالم" },
    { question: "ما هي عاصمة بوتان؟", answer: "تيمفو", difficulty: "صعب", hint: "مملكة في جبال الهيمالايا" },
    { question: "أي دولة يمر بها خط الاستواء وخط غرينتش؟", answer: "غانا", difficulty: "صعب", hint: "دولة في غرب أفريقيا" },
    { question: "ما هو أكبر دلتا نهر في العالم؟", answer: "دلتا الغانج", difficulty: "صعب", hint: "تقع في بنغلاديش والهند" },
    { question: "أي مدينة تقع في قارتين؟", answer: "إسطنبول", difficulty: "صعب", hint: "تقع بين أوروبا وآسيا" },
    { question: "ما هي أكبر بحيرة في أفريقيا؟", answer: "بحيرة فيكتوريا", difficulty: "صعب", hint: "منبع نهر النيل" },
    { question: "أي دولة تضم أكبر عدد من الجزر؟", answer: "فنلندا", difficulty: "صعب", hint: "أكثر من 188000 جزيرة" }
  ],

  // Culture Questions (36 total)
  culture: [
    // Easy (12 questions)
    { question: "ما هو الشهر الكريم عند المسلمين؟", answer: "رمضان", difficulty: "سهل", hint: "شهر الصيام" },
    { question: "كم عدد أيام السنة الميلادية؟", answer: "365 يوم", difficulty: "سهل", hint: "366 في السنة الكبيسة" },
    { question: "ما هي عملة الكويت؟", answer: "الدينار الكويتي", difficulty: "سهل", hint: "من أقوى العملات في العالم" },
    { question: "كم عدد ألوان قوس قزح؟", answer: "سبعة ألوان", difficulty: "سهل", hint: "أحمر، برتقالي، أصفر..." },
    { question: "ما هو أكبر كوكب في المجموعة الشمسية؟", answer: "المشتري", difficulty: "سهل", hint: "كوكب غازي عملاق" },
    { question: "كم عدد فصول السنة؟", answer: "أربعة فصول", difficulty: "سهل", hint: "ربيع، صيف، خريف، شتاء" },
    { question: "ما هي أصغر وحدة في الكمبيوتر؟", answer: "البت", difficulty: "سهل", hint: "0 أو 1" },
    { question: "كم عدد قارات العالم؟", answer: "سبع قارات", difficulty: "سهل", hint: "آسيا، أفريقيا، أوروبا..." },
    { question: "ما هو رمز الذهب الكيميائي؟", answer: "Au", difficulty: "سهل", hint: "من الكلمة اللاتينية Aurum" },
    { question: "كم عدد أضلاع المثلث؟", answer: "ثلاثة أضلاع", difficulty: "سهل", hint: "أبسط الأشكال الهندسية" },
    { question: "ما هي أقرب النجوم إلى الأرض؟", answer: "الشمس", difficulty: "سهل", hint: "مصدر الضوء والحرارة" },
    { question: "كم عدد دقائق الساعة؟", answer: "60 دقيقة", difficulty: "سهل", hint: "كل دقيقة تحتوي على 60 ثانية" },

    // Medium (12 questions)
    { question: "من هو مؤلف رواية 'مئة عام من العزلة'؟", answer: "غابرييل غارسيا ماركيز", difficulty: "متوسط", hint: "كاتب كولومبي حائز على نوبل" },
    { question: "ما هي السنة التي تأسست فيها منظمة الأمم المتحدة؟", answer: "1945", difficulty: "متوسط", hint: "بعد الحرب العالمية الثانية" },
    { question: "كم عدد لوحات المفاتيح القياسية؟", answer: "104 مفتاح", difficulty: "متوسط", hint: "تشمل الأرقام والحروف والرموز" },
    { question: "ما هو أقدم فن مسرحي في اليابان؟", answer: "النو", difficulty: "متوسط", hint: "مسرح تقليدي بالأقنعة" },
    { question: "من هو الفيلسوف الذي علم الإسكندر الأكبر؟", answer: "أرسطو", difficulty: "متوسط", hint: "فيلسوف يوناني عظيم" },
    { question: "ما هي أقدم جامعة في العالم الإسلامي؟", answer: "جامعة القرويين", difficulty: "متوسط", hint: "تقع في فاس، المغرب" },
    { question: "كم عدد أوتار آلة العود؟", answer: "11 وتر", difficulty: "متوسط", hint: "آلة موسيقية شرقية" },
    { question: "ما هو اسم أول قمر صناعي؟", answer: "سبوتنيك", difficulty: "متوسط", hint: "أطلقه الاتحاد السوفيتي عام 1957" },
    { question: "من هو مخترع المصباح الكهربائي؟", answer: "توماس أديسون", difficulty: "متوسط", hint: "مخترع أمريكي عظيم" },
    { question: "ما هي عاصمة الثقافة العربية لعام 2001؟", answer: "الكويت", difficulty: "متوسط", hint: "دولة خليجية" },
    { question: "كم عدد بحور الشعر العربي؟", answer: "16 بحر", difficulty: "متوسط", hint: "وضعها الخليل بن أحمد" },
    { question: "ما هو أقدم أبجدية في التاريخ؟", answer: "الأبجدية الفينيقية", difficulty: "متوسط", hint: "نشأت في بلاد الشام" },

    // Hard (12 questions)
    { question: "من هو مؤلف كتاب 'المقدمة'؟", answer: "ابن خلدون", difficulty: "صعب", hint: "مؤرخ ومفكر اجتماعي عربي" },
    { question: "ما هي أقدم لغة مكتوبة لا تزال مستخدمة؟", answer: "الصينية", difficulty: "صعب", hint: "تستخدم رموز بدلاً من أحرف" },
    { question: "من هو رسام لوحة 'الموناليزا'؟", answer: "ليوناردو دا فينشي", difficulty: "صعب", hint: "فنان ومخترع إيطالي" },
    { question: "ما هو اسم أقدم ملحمة في التاريخ؟", answer: "ملحمة جلجامش", difficulty: "صعب", hint: "من بلاد ما بين النهرين" },
    { question: "من هو مؤسس المذهب الوجودي؟", answer: "سورين كيركيغارد", difficulty: "صعب", hint: "فيلسوف دنماركي" },
    { question: "ما هي أول دولة ألغت الرق؟", answer: "هايتي", difficulty: "صعب", hint: "جزيرة في البحر الكاريبي" },
    { question: "من هو مخترع الطباعة؟", answer: "يوهانس غوتنبرغ", difficulty: "صعب", hint: "ألماني من القرن الخامس عشر" },
    { question: "ما هو أقدم نظام كتابة معروف؟", answer: "الكتابة المسمارية", difficulty: "صعب", hint: "استخدمها السومريون" },
    { question: "من هو أول من حصل على جائزة نوبل للأدب؟", answer: "سولي برودوم", difficulty: "صعب", hint: "شاعر فرنسي عام 1901" },
    { question: "ما هي أقدم مكتبة في العالم؟", answer: "مكتبة آشوربانيبال", difficulty: "صعب", hint: "في نينوى، العراق القديم" },
    { question: "من هو مؤلف 'الكوميديا الإلهية'؟", answer: "دانتي أليغييري", difficulty: "صعب", hint: "شاعر إيطالي من القرن الرابع عشر" },
    { question: "ما هو أقدم قانون مكتوب في التاريخ؟", answer: "قانون حمورابي", difficulty: "صعب", hint: "من بابل القديمة" }
  ],

  // Science Questions (36 total)
  science: [
    // Easy (12 questions)
    { question: "كم عدد أيام دوران الأرض حول الشمس؟", answer: "365 يوم", difficulty: "سهل", hint: "سنة كاملة" },
    { question: "ما هو الغاز الأكثر وفرة في الغلاف الجوي؟", answer: "النيتروجين", difficulty: "سهل", hint: "يشكل 78% من الهواء" },
    { question: "كم عدد أسنان الإنسان البالغ؟", answer: "32 سن", difficulty: "سهل", hint: "تشمل أسنان العقل" },
    { question: "ما هو أسرع حيوان في العالم؟", answer: "الفهد", difficulty: "سهل", hint: "يعيش في أفريقيا" },
    { question: "كم عدد حواس الإنسان؟", answer: "خمس حواس", difficulty: "سهل", hint: "البصر، السمع، الشم، التذوق، اللمس" },
    { question: "ما هو أكبر حيوان في العالم؟", answer: "الحوت الأزرق", difficulty: "سهل", hint: "حيوان بحري" },
    { question: "كم عدد أرجل العنكبوت؟", answer: "ثمانية أرجل", difficulty: "سهل", hint: "ضعف أرجل الحشرات" },
    { question: "ما هو الكوكب الأقرب للشمس؟", answer: "عطارد", difficulty: "سهل", hint: "أصغر كواكب المجموعة الشمسية" },
    { question: "كم عدد أجنحة النحلة؟", answer: "أربعة أجنحة", difficulty: "سهل", hint: "جناحان على كل جانب" },
    { question: "ما هو أقوى عضو في جسم الإنسان؟", answer: "القلب", difficulty: "سهل", hint: "يضخ الدم باستمرار" },
    { question: "كم عدد عظام الإنسان عند الولادة؟", answer: "270 عظمة", difficulty: "سهل", hint: "تقل مع النمو إلى 206" },
    { question: "ما هو الحيوان الذي لا يشرب الماء؟", answer: "الكوالا", difficulty: "سهل", hint: "يحصل على الماء من أوراق الأوكالبتوس" },

    // Medium (12 questions)
    { question: "ما هو العنصر الكيميائي الأكثر وفرة في الكون؟", answer: "الهيدروجين", difficulty: "متوسط", hint: "أبسط العناصر الكيميائية" },
    { question: "كم تبلغ سرعة الضوء؟", answer: "300000 كيلومتر في الثانية", difficulty: "متوسط", hint: "ثابت فيزيائي مهم" },
    { question: "ما هو اسم المريض الذي لا يستطيع تمييز الألوان؟", answer: "عمى الألوان", difficulty: "متوسط", hint: "حالة وراثية شائعة" },
    { question: "كم عدد فقرات العمود الفقري البشري؟", answer: "33 فقرة", difficulty: "متوسط", hint: "تشمل المنطقة العجزية والعصعصية" },
    { question: "ما هو الحمض الموجود في المعدة؟", answer: "حمض الهيدروكلوريك", difficulty: "متوسط", hint: "يساعد في هضم الطعام" },
    { question: "كم تبلغ درجة حرارة الجسم الطبيعية؟", answer: "37 درجة مئوية", difficulty: "متوسط", hint: "98.6 فهرنهايت" },
    { question: "ما هو أصلب مادة طبيعية؟", answer: "الماس", difficulty: "متوسط", hint: "مصنوع من الكربون المتبلور" },
    { question: "كم عدد غرف القلب؟", answer: "أربع غرف", difficulty: "متوسط", hint: "أذينان وبطينان" },
    { question: "ما هو اسم مرض نقص فيتامين C؟", answer: "الأسقربوط", difficulty: "متوسط", hint: "كان شائعاً بين البحارة" },
    { question: "كم عدد كروموسومات الإنسان؟", answer: "46 كروموسوم", difficulty: "متوسط", hint: "23 زوج" },
    { question: "ما هو الغاز المسؤول عن الاحتباس الحراري؟", answer: "ثاني أكسيد الكربون", difficulty: "متوسط", hint: "CO2" },
    { question: "كم تبلغ جاذبية الأرض؟", answer: "9.8 متر/ثانية مربعة", difficulty: "متوسط", hint: "تسارع السقوط الحر" },

    // Hard (12 questions)  
    { question: "ما هو اسم النظرية التي وضعها داروين؟", answer: "نظرية التطور", difficulty: "صعب", hint: "البقاء للأصلح" },
    { question: "كم عدد النيوترونات في ذرة الكربون-14؟", answer: "8 نيوترونات", difficulty: "صعب", hint: "الكتلة الذرية 14 والعدد الذري 6" },
    { question: "ما هو اسم الجسيم دون الذري الذي اكتشفه هيجز؟", answer: "بوزون هيجز", difficulty: "صعب", hint: "جسيم الإله" },
    { question: "كم تبلغ المسافة بين الأرض والقمر؟", answer: "384400 كيلومتر", difficulty: "صعب", hint: "حوالي 30 قطر أرضي" },
    { question: "ما هو اسم المرض الذي يصيب خلايا الدم الحمراء؟", answer: "الأنيميا المنجلية", difficulty: "صعب", hint: "مرض وراثي يغير شكل كريات الدم" },
    { question: "كم عددت أزواج الأضلاع في جسم الإنسان؟", answer: "12 زوج", difficulty: "صعب", hint: "24 ضلع إجمالي" },
    { question: "ما هو العضو الذي ينتج الأنسولين؟", answer: "البنكرياس", difficulty: "صعب", hint: "ينظم مستوى السكر في الدم" },
    { question: "كم تبلغ كتلة الإلكترون؟", answer: "9.109 × 10^-31 كغ", difficulty: "صعب", hint: "أخف من البروتون بـ 1836 مرة" },
    { question: "ما هو اسم الظاهرة التي تفسر انحناء الضوء؟", answer: "انكسار الضوء", difficulty: "صعب", hint: "يحدث عند انتقال الضوء بين وسطين" },
    { question: "كم عدد الطبقات في الغلاف الجوي؟", answer: "5 طبقات", difficulty: "صعب", hint: "التروبوسفير، الستراتوسفير..." },
    { question: "ما هو اسم أول مضاد حيوي اكتُشف؟", answer: "البنسلين", difficulty: "صعب", hint: "اكتشفه ألكسندر فليمنغ" },
    { question: "كم تبلغ درجة الصفر المطلق؟", answer: "-273.15 درجة مئوية", difficulty: "صعب", hint: "أبرد درجة حرارة ممكنة" }
  ]
};

async function addBulkQuestions() {
  console.log("🔄 Adding bulk questions (36 per category)...");
  
  try {
    let totalAdded = 0;
    
    for (const [categoryName, questions] of Object.entries(bulkQuestions)) {
      console.log(`\n📚 Adding ${questions.length} questions for ${categoryName}...`);
      
      for (const questionData of questions) {
        try {
          await storage.createQuestion({
            question: questionData.question,
            answer: questionData.answer,
            category: categoryName,
            difficulty: questionData.difficulty,
            hint: questionData.hint,
            explanation: questionData.explanation || ""
          });
          totalAdded++;
          console.log(`  ✅ Added: ${questionData.question.substring(0, 50)}...`);
        } catch (error) {
          console.log(`  ❌ Failed: ${questionData.question.substring(0, 50)}... - ${error}`);
        }
      }
    }
    
    console.log(`\n🎉 Successfully added ${totalAdded} questions total!`);
    console.log(`📊 Breakdown:`);
    Object.keys(bulkQuestions).forEach(category => {
      console.log(`  ${category}: 36 questions (12 easy, 12 medium, 12 hard)`);
    });
    
  } catch (error) {
    console.error("❌ Error adding bulk questions:", error);
  }
}

addBulkQuestions();
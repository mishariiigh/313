import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, where, getDocs, updateDoc, serverTimestamp } from "firebase/firestore";
import { loadQuestions } from "../shared/config";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "dummy-api-key",
  authDomain: `${process.env.VITE_FIREBASE_PROJECT_ID || "dummy-project"}.firebaseapp.com`,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "dummy-project",
  storageBucket: `${process.env.VITE_FIREBASE_PROJECT_ID || "dummy-project"}.appspot.com`,
  appId: process.env.VITE_FIREBASE_APP_ID || "dummy-app-id",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedQuestions() {
  try {
    // Load questions from config
    const configQuestions = loadQuestions();
    console.log(`Loading ${configQuestions.length} questions from config...`);
    
    let added = 0;
    let updated = 0;
    
    for (const question of configQuestions) {
      try {
        // Check if question already exists
        const q = query(collection(db, "questions"), where("question", "==", question.question));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          // Update existing question to be published
          const doc = querySnapshot.docs[0];
          await updateDoc(doc.ref, {
            isPublished: true,
            ...question
          });
          updated++;
        } else {
          // Create new question
          await addDoc(collection(db, "questions"), {
            ...question,
            isPublished: true,
            createdAt: serverTimestamp()
          });
          added++;
        }
      } catch (error) {
        console.error(`Error processing question: ${question.question}`, error);
      }
    }
    
    console.log(`✅ Added ${added} new questions`);
    console.log(`✅ Updated ${updated} existing questions`);
    console.log(`✅ Total questions now published and ready`);
    
  } catch (error) {
    console.error("❌ Error seeding questions:", error);
    process.exit(1);
  }
}

// Run the seeding
seedQuestions();
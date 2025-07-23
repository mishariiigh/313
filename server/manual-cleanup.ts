import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "./config/firebase";

async function manualCleanup() {
  console.log("🧹 Manual cleanup - removing ALL duplicate categories...");
  
  try {
    // Get all categories
    const categoriesSnapshot = await getDocs(collection(db, "categories"));
    const allCategories: any[] = [];
    
    categoriesSnapshot.forEach(catDoc => {
      const data = catDoc.data();
      allCategories.push({
        id: catDoc.id,
        name: data.name,
        displayName: data.displayName,
        description: data.description || ""
      });
    });
    
    console.log(`Found ${allCategories.length} total categories`);
    
    // Group by name (the English name which is the unique identifier)
    const categoryGroups: { [key: string]: any[] } = {};
    allCategories.forEach(cat => {
      if (!categoryGroups[cat.name]) {
        categoryGroups[cat.name] = [];
      }
      categoryGroups[cat.name].push(cat);
    });
    
    console.log("\n📋 Category analysis:");
    let totalDuplicates = 0;
    
    for (const [name, cats] of Object.entries(categoryGroups)) {
      if (cats.length > 1) {
        console.log(`❌ DUPLICATE: ${name} - ${cats.length} copies`);
        cats.forEach((cat, i) => {
          console.log(`   ${i + 1}. ID: ${cat.id} - Display: ${cat.displayName}`);
        });
        totalDuplicates += cats.length - 1;
      } else {
        console.log(`✅ UNIQUE: ${name} - ${cats[0].displayName}`);
      }
    }
    
    console.log(`\n🎯 Will delete ${totalDuplicates} duplicates`);
    
    // Delete duplicates - keep the first one, delete the rest
    let deletedCount = 0;
    for (const [name, cats] of Object.entries(categoryGroups)) {
      if (cats.length > 1) {
        console.log(`\n🗑️  Processing duplicates for: ${name}`);
        
        // Sort by ID to ensure consistent behavior
        cats.sort((a, b) => a.id.localeCompare(b.id));
        
        // Keep the first, delete the rest
        for (let i = 1; i < cats.length; i++) {
          const catToDelete = cats[i];
          console.log(`   Deleting: ${catToDelete.id} (${catToDelete.displayName})`);
          
          try {
            await deleteDoc(doc(db, "categories", catToDelete.id));
            deletedCount++;
            console.log(`   ✅ Deleted successfully`);
          } catch (error) {
            console.log(`   ❌ Failed to delete: ${error}`);
          }
        }
        
        console.log(`   ✅ Kept: ${cats[0].id} (${cats[0].displayName})`);
      }
    }
    
    console.log(`\n🎉 Cleanup complete!`);
    console.log(`   - Deleted: ${deletedCount} duplicates`);
    console.log(`   - Remaining: ${Object.keys(categoryGroups).length} unique categories`);
    
    // Final verification
    const finalSnapshot = await getDocs(collection(db, "categories"));
    console.log(`   - Database verification: ${finalSnapshot.size} categories total`);
    
  } catch (error) {
    console.error("❌ Cleanup failed:", error);
  }
}

manualCleanup();
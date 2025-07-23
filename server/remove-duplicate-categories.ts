import { storage } from "./temp-storage";

export async function removeDuplicateCategories() {
  try {
    console.log("🔄 Starting duplicate category removal...");
    
    // Get all categories
    const allCategories = await storage.getAllCategories();
    console.log(`📊 Found ${allCategories.length} total categories`);
    
    // Group categories by name to find duplicates
    const categoryGroups = new Map<string, any[]>();
    allCategories.forEach(category => {
      const existing = categoryGroups.get(category.name) || [];
      existing.push(category);
      categoryGroups.set(category.name, existing);
    });
    
    let duplicatesRemoved = 0;
    
    // Process each category group
    for (const [categoryName, categoryList] of categoryGroups) {
      if (categoryList.length > 1) {
        console.log(`🔍 Found ${categoryList.length} duplicates for category: ${categoryName}`);
        
        // Sort by creation date (keep the oldest one) or by ID if no date
        categoryList.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          }
          return a.id.localeCompare(b.id);
        });
        
        const keepCategory = categoryList[0];
        const duplicatesToRemove = categoryList.slice(1);
        
        console.log(`✅ Keeping category: ${keepCategory.displayName} (${keepCategory.id})`);
        
        // Remove duplicates
        for (const duplicate of duplicatesToRemove) {
          try {
            await storage.deleteCategory(duplicate.id);
            duplicatesRemoved++;
            console.log(`🗑️  Removed duplicate: ${duplicate.displayName} (${duplicate.id})`);
          } catch (error) {
            console.error(`❌ Failed to remove duplicate category ${duplicate.id}:`, error);
          }
        }
      }
    }
    
    console.log(`✅ Duplicate category cleanup completed`);
    console.log(`📊 Removed ${duplicatesRemoved} duplicate categories`);
    
    // Get final count
    const finalCategories = await storage.getAllCategories();
    console.log(`📋 Final category count: ${finalCategories.length}`);
    
    return {
      success: true,
      duplicatesRemoved,
      finalCount: finalCategories.length,
      message: `Successfully removed ${duplicatesRemoved} duplicate categories`
    };
    
  } catch (error: any) {
    console.error("❌ Error during duplicate category removal:", error);
    return {
      success: false,
      error: error.message,
      message: "Failed to remove duplicate categories"
    };
  }
}
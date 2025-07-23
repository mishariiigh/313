import { storage } from "./firebase-storage";

export async function updateGamePackagePricing() {
  try {
    console.log('🔄 Starting game package pricing update to Kuwaiti Dinar...');
    
    // Get all game packages
    const packages = await storage.getAllGamePackages();
    console.log(`📦 Found ${packages.length} game packages`);
    
    // Track packages to keep (one per game count)
    const packagesToKeep: { [gameCount: number]: string } = {};
    const packagesToDelete: string[] = [];
    
    for (const pkg of packages) {
      // Skip inactive packages
      if (!pkg.isActive) {
        continue;
      }
      
      // Update pricing for 1 and 5 game packages
      let newPrice = pkg.priceInCents;
      let newDescription = pkg.description;
      
      if (pkg.gameCount === 1) {
        newPrice = 190; // 1.900 KWD
        newDescription = 'مثالية للمبتدئين - لعبة واحدة';
      } else if (pkg.gameCount === 5) {
        newPrice = 790; // 7.900 KWD  
        newDescription = 'للاعبين المتقدمين - 5 ألعاب';
      } else {
        // Deactivate packages with other game counts
        await storage.updateGamePackage(pkg.id, { ...pkg, isActive: false });
        console.log(`❌ Deactivated package with ${pkg.gameCount} games: ${pkg.id}`);
        continue;
      }
      
      // Check for duplicates
      if (packagesToKeep[pkg.gameCount]) {
        // Mark for deletion
        packagesToDelete.push(pkg.id);
        console.log(`🗑️ Marked duplicate ${pkg.gameCount}-game package for deletion: ${pkg.id}`);
      } else {
        // Keep this one and update its pricing
        packagesToKeep[pkg.gameCount] = pkg.id;
        
        await storage.updateGamePackage(pkg.id, {
          ...pkg,
          priceInCents: newPrice,
          description: newDescription
        });
        
        console.log(`✅ Updated ${pkg.name}: ${pkg.gameCount} games = ${newPrice/100} KWD`);
      }
    }
    
    // Delete duplicate packages
    for (const packageId of packagesToDelete) {
      await storage.deleteGamePackage(packageId);
      console.log(`🗑️ Deleted duplicate package: ${packageId}`);
    }
    
    console.log('✅ Game package pricing update completed!');
    console.log('💰 New pricing: 1 game = 1.900 KWD, 5 games = 7.900 KWD');
    
    return { success: true, message: 'Pricing updated successfully' };
    
  } catch (error) {
    console.error('❌ Error updating game package pricing:', error);
    return { success: false, error: error.message };
  }
}
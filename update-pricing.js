// Update game package pricing to Kuwaiti Dinar
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin
initializeApp();
const db = getFirestore();

async function updateGamePackagePricing() {
  try {
    console.log('🔄 Starting game package pricing update to Kuwaiti Dinar...');
    
    // Get all game packages
    const packagesRef = db.collection('gamePackages');
    const packagesSnapshot = await packagesRef.get();
    
    console.log(`📦 Found ${packagesSnapshot.docs.length} game packages`);
    
    // Update each package
    for (const doc of packagesSnapshot.docs) {
      const packageData = doc.data();
      let newPrice = packageData.priceInCents;
      
      // Update pricing: 1 game = 190 cents (1.900 KWD), 5 games = 790 cents (7.900 KWD)
      if (packageData.gameCount === 1) {
        newPrice = 190; // 1.900 KWD
      } else if (packageData.gameCount === 5) {
        newPrice = 790; // 7.900 KWD
      } else if (packageData.gameCount === 10) {
        // Remove 10-game packages or set to inactive
        await doc.ref.update({ isActive: false });
        console.log(`❌ Deactivated 10-game package: ${doc.id}`);
        continue;
      }
      
      // Update the price
      await doc.ref.update({ 
        priceInCents: newPrice,
        description: packageData.gameCount === 1 ? 'مثالية للمبتدئين - لعبة واحدة' : 'للاعبين المتقدمين - 5 ألعاب'
      });
      
      console.log(`✅ Updated package ${packageData.name}: ${packageData.gameCount} games = ${newPrice/100} KWD`);
    }
    
    // Clean up duplicates - keep only one package per game count
    const packagesByGameCount = {};
    
    for (const doc of packagesSnapshot.docs) {
      const packageData = doc.data();
      if (!packageData.isActive) continue;
      
      const gameCount = packageData.gameCount;
      if (packagesByGameCount[gameCount]) {
        // Delete this duplicate
        await doc.ref.delete();
        console.log(`🗑️ Deleted duplicate package: ${doc.id}`);
      } else {
        packagesByGameCount[gameCount] = doc.id;
      }
    }
    
    console.log('✅ Game package pricing update completed!');
    console.log('💰 New pricing: 1 game = 1.900 KWD, 5 games = 7.900 KWD');
    
  } catch (error) {
    console.error('❌ Error updating game package pricing:', error);
  }
}

updateGamePackagePricing();
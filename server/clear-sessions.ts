import { storage } from "./firebase-storage";

async function clearActiveSessions() {
  try {
    console.log("🧹 Clearing all active game sessions...");
    
    // Clear all game sessions to force fresh starts
    const allSessions = await storage.getAllGameSessions();
    console.log(`Found ${allSessions.length} sessions to clear`);
    
    for (const session of allSessions) {
      await storage.deleteGameSession(session.id);
    }
    
    console.log("✅ All game sessions cleared. Users can now start fresh games with the correct question set.");
    
  } catch (error) {
    console.error("❌ Error clearing sessions:", error);
  }
}

clearActiveSessions();
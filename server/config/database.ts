import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "@shared/schema";
import { config } from "@shared/config";

// Database connection
let db: ReturnType<typeof drizzle> | null = null;
let pool: any = null; // Using HTTP connection instead of pool

export function initializeDatabase() {
  if (!config.database.url) {
    console.warn("DATABASE_URL not provided. Database features will be disabled.");
    return null;
  }

  try {
    // Use HTTP connection instead of WebSocket for better stability
    const sql = neon(config.database.url);
    db = drizzle({ client: sql, schema });
    console.log("✅ Database connection initialized");
    return db;
  } catch (error) {
    console.error("❌ Failed to initialize database:", error);
    return null;
  }
}

export function getDatabase() {
  if (!db) {
    db = initializeDatabase();
  }
  return db;
}

export function getDatabasePool() {
  return pool;
}

// Initialize database on import if URL is available
if (config.database.url) {
  db = initializeDatabase();
}

// Export initialized database
export { db, pool };
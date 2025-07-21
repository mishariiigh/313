/**
 * Database Configuration
 * 
 * Configures PostgreSQL connection using Drizzle ORM.
 * This is optional - Firebase is the primary database.
 */

import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure WebSocket for Neon serverless
neonConfig.webSocketConstructor = ws;

// Database connection with fallback
const databaseUrl = process.env.DATABASE_URL;

let pool: Pool | null = null;
let db: ReturnType<typeof drizzle> | null = null;

if (databaseUrl) {
  try {
    pool = new Pool({ connectionString: databaseUrl });
    db = drizzle({ client: pool, schema });
    console.log("✅ PostgreSQL database connected");
  } catch (error) {
    console.warn("⚠️ PostgreSQL connection failed:", error);
  }
} else {
  console.log("ℹ️ No DATABASE_URL provided. Using Firebase only.");
}

export { db, pool };
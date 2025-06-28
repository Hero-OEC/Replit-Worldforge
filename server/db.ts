
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from "@shared/schema";
import path from 'path';

// Simple database path for development
const dbPath = path.join(process.cwd(), 'worldforge.db');

const sqlite = new Database(dbPath);
sqlite.pragma('journal_mode = WAL');

export const db = drizzle(sqlite, { schema });

// Run migrations on startup
export async function initializeDatabase() {
  try {
    migrate(db, { migrationsFolder: './drizzle' });
    console.log('Database migrations completed');
    
    // Run power systems migration
    const { migratePowerSystems } = await import('./migrate-power-systems');
    await migratePowerSystems();
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
}

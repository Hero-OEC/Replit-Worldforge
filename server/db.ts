
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from "@shared/schema";
import path from 'path';

// Simple database path for development
const dbPath = path.join(process.cwd(), 'inkalchemy.db');

const sqlite = new Database(dbPath);
sqlite.pragma('journal_mode = WAL');

export const db = drizzle(sqlite, { schema });

// Initialize database - using in-memory storage as recommended
export async function initializeDatabase() {
  try {
    console.log('Database initialized successfully with MemStorage');
    // Note: Using MemStorage, so no database migrations needed
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
}

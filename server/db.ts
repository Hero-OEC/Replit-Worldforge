import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from "@shared/schema";
import path from 'path';
import { app } from 'electron';

// Use app.getPath('userData') for Electron or fallback for development
const isElectron = typeof window !== 'undefined' && window.process?.type === 'renderer';
const dbPath = isElectron 
  ? path.join(app.getPath('userData'), 'worldforge.db')
  : path.join(process.cwd(), 'worldforge.db');

const sqlite = new Database(dbPath);
sqlite.pragma('journal_mode = WAL');

export const db = drizzle(sqlite, { schema });

// Run migrations on startup
export function initializeDatabase() {
  try {
    migrate(db, { migrationsFolder: './drizzle' });
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
}
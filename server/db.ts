
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export const db = drizzle(pool, { schema });

export async function initializeDatabase() {
  try {
    // Test the connection with a simple query
    const result = await pool.query('SELECT 1');
    console.log('Database connected successfully to Supabase via PostgreSQL driver');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    console.log('Falling back to memory storage for development');
    return false;
  }
}

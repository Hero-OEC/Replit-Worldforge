
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "@shared/schema";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });

export async function initializeDatabase() {
  try {
    // Test the connection
    await sql`SELECT 1`;
    console.log('Database connected successfully to Supabase');
  } catch (error) {
    console.error('Database connection failed:', error);
    console.log('Falling back to memory storage for development');
    throw error;
  }
}

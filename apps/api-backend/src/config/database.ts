import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Primary Data Access Layer — Native Prisma Client Instance
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

console.log('[Prisma Client]: Initialized Successfully as primary Data Access Layer.');

// PostgreSQL Connection Pool for raw triggers and low-level RLS context
export const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/baher_silver_erp',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

/**
 * Sets PostgreSQL Row Level Security (RLS) tenant session variables
 */
export async function setTenantSessionContext(client: any, companyId: string, userId?: string) {
  await client.query(`SET LOCAL app.current_company_id = '${companyId}';`);
  if (userId) {
    await client.query(`SET LOCAL app.current_user_id = '${userId}';`);
  }
}

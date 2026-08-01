import { seedPhase23A } from './seed_phase23a';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedProduction() {
  console.log('🏭 [SEED PRODUCTION] Seeding Enterprise Production Baseline Security...');
  
  // Seed core permission groups, permissions, roles, and initial Super Admin baher
  await seedPhase23A();

  // Clean up any temporary or test sessions for clean production baseline
  await prisma.userSession.deleteMany({
    where: { isRevoked: true }
  });

  console.log('✅ [SEED PRODUCTION] Enterprise Production Security Baseline Seeded Successfully!');
}

if (require.main === module) {
  seedProduction()
    .catch(e => { console.error('Production Seeding Error:', e); process.exit(1); })
    .finally(() => prisma.$disconnect());
}

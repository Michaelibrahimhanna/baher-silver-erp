import { seedPhase23A } from './seed_phase23a';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function seedDev() {
  console.log('🌱 [SEED DEV] Seeding Development Environment...');
  await seedPhase23A();

  // Create additional dev test accounts
  const devPasswordHash = await bcrypt.hash('DevPass2026!', 12);
  await prisma.user.upsert({
    where: { username: 'cashier_dev' },
    update: { passwordHash: devPasswordHash, status: 'ACTIVE' },
    create: {
      username: 'cashier_dev',
      email: 'cashier@bahersilver.online',
      fullNameAr: 'أمين صندوق المعرض - تنمية',
      passwordHash: devPasswordHash,
      branchId: 'BRANCH-MAIN',
      department: 'المبيعات والمعرض',
      position: 'أمين صندوق'
    }
  });

  console.log('✅ [SEED DEV] Development Seeding Complete!');
}

if (require.main === module) {
  seedDev()
    .catch(e => { console.error('Dev Seeding Error:', e); process.exit(1); })
    .finally(() => prisma.$disconnect());
}

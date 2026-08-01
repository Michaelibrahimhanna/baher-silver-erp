import { seedPhase23A } from './seed_phase23a';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function seedDemo() {
  console.log('🎭 [SEED DEMO] Seeding Demo & Showcase Environment...');
  await seedPhase23A();

  // Create demo showcase accounts for sales & factory manager
  const demoPasswordHash = await bcrypt.hash('DemoPass2026!', 12);
  const managerRole = await prisma.securityRole.findUnique({ where: { roleCode: 'FACTORY_MANAGER' } });

  const managerUser = await prisma.user.upsert({
    where: { username: 'factory_manager_demo' },
    update: { passwordHash: demoPasswordHash, status: 'ACTIVE' },
    create: {
      username: 'factory_manager_demo',
      email: 'manager@bahersilver.online',
      fullNameAr: 'المهندس أحمد — مدير خطوط الإنتاج والتصنيع',
      passwordHash: demoPasswordHash,
      branchId: 'BRANCH-MAIN',
      department: 'إدارة التصنيع',
      position: 'مدير المصنع'
    }
  });

  if (managerRole && managerUser) {
    await prisma.userRoleAssignment.upsert({
      where: { userId_roleId: { userId: managerUser.id, roleId: managerRole.id } },
      update: {},
      create: { userId: managerUser.id, roleId: managerRole.id }
    });
  }

  console.log('✅ [SEED DEMO] Demo Showcase Seeding Complete!');
}

if (require.main === module) {
  seedDemo()
    .catch(e => { console.error('Demo Seeding Error:', e); process.exit(1); })
    .finally(() => prisma.$disconnect());
}

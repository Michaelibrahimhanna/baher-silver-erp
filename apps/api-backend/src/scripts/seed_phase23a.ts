import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const PERMISSION_GROUPS = [
  { groupCode: 'INVENTORY', nameAr: 'إدارة المخزون والأحجار', nameEn: 'Inventory & Gemstones', sortOrder: 1 },
  { groupCode: 'WAREHOUSE', nameAr: 'المخازن والمواقع الهرمية', nameEn: 'Warehouses & Bins', sortOrder: 2 },
  { groupCode: 'MANUFACTURING', nameAr: 'هندسة التصنيع والـ BOM', nameEn: 'Manufacturing & BOM', sortOrder: 3 },
  { groupCode: 'FINANCE', nameAr: 'الحسابات والشجرة والمالية', nameEn: 'Finance & Accounting', sortOrder: 4 },
  { groupCode: 'CRM', nameAr: 'الموردين والعملاء', nameEn: 'CRM & Suppliers', sortOrder: 5 },
  { groupCode: 'REPORTS', nameAr: 'التقارير والتحليلات', nameEn: 'Reports & Analytics', sortOrder: 6 },
  { groupCode: 'HR', nameAr: 'الموارد البشرية والعمالة', nameEn: 'HR & Labor', sortOrder: 7 },
  { groupCode: 'ADMINISTRATION', nameAr: 'إدارة المستخدمين والأدوار', nameEn: 'User & Role Administration', sortOrder: 8 },
  { groupCode: 'SETTINGS', nameAr: 'إعدادات النظام والأمان', nameEn: 'System Settings & Audit', sortOrder: 9 }
];

const PERMISSIONS = [
  // INVENTORY
  { permissionCode: 'inventory.view', groupCode: 'INVENTORY', nameAr: 'عرض رصيد وشاشة المخزون', nameEn: 'View Inventory' },
  { permissionCode: 'inventory.create', groupCode: 'INVENTORY', nameAr: 'إضافة أصناف وأحجار جديدة', nameEn: 'Create Inventory Items' },
  { permissionCode: 'inventory.edit', groupCode: 'INVENTORY', nameAr: 'تعديل بيانات رصيد المخزون', nameEn: 'Edit Inventory Items' },
  { permissionCode: 'inventory.delete', groupCode: 'INVENTORY', nameAr: 'أرشفة أصناف المخزون', nameEn: 'Delete/Archive Inventory' },
  { permissionCode: 'inventory.export', groupCode: 'INVENTORY', nameAr: 'تصدير تقارير وبيانات المخزون', nameEn: 'Export Inventory Data' },
  { permissionCode: 'inventory.print', groupCode: 'INVENTORY', nameAr: 'طباعة البار كود وQR', nameEn: 'Print Labels & Barcodes' },

  // WAREHOUSE
  { permissionCode: 'warehouse.view', groupCode: 'WAREHOUSE', nameAr: 'عرض خريطة ودليل المخازن', nameEn: 'View Warehouses' },
  { permissionCode: 'warehouse.create', groupCode: 'WAREHOUSE', nameAr: 'إضافة مخزن أو رف جديد', nameEn: 'Create Warehouse/Bin' },
  { permissionCode: 'warehouse.transfer', groupCode: 'WAREHOUSE', nameAr: 'إجراء تحويلات بين المخازن', nameEn: 'Transfer Stock' },
  { permissionCode: 'warehouse.audit', groupCode: 'WAREHOUSE', nameAr: 'إجراء وجلسات الجرد', nameEn: 'Perform Inventory Audit' },

  // MANUFACTURING
  { permissionCode: 'manufacturing.view', groupCode: 'MANUFACTURING', nameAr: 'عرض المنتجات والـ BOM', nameEn: 'View Products & BOM' },
  { permissionCode: 'manufacturing.create', groupCode: 'MANUFACTURING', nameAr: 'إضافة منتجات وقوائم BOM', nameEn: 'Create Products & BOM' },
  { permissionCode: 'manufacturing.routing', groupCode: 'MANUFACTURING', nameAr: 'تعديل مسارات التصنيع', nameEn: 'Manage Production Routing' },
  { permissionCode: 'manufacturing.cost', groupCode: 'MANUFACTURING', nameAr: 'احتساب تكلفة وتسمح المنتجات', nameEn: 'Calculate Product Cost' },

  // FINANCE
  { permissionCode: 'finance.view', groupCode: 'FINANCE', nameAr: 'عرض شجرة الحسابات والقيود', nameEn: 'View Finance & Ledgers' },
  { permissionCode: 'finance.journal', groupCode: 'FINANCE', nameAr: 'تسجيل قيود يومية يدوي', nameEn: 'Create Journal Entries' },

  // CRM & SUPPLIERS
  { permissionCode: 'suppliers.view', groupCode: 'CRM', nameAr: 'عرض دليل الموردين', nameEn: 'View Suppliers' },
  { permissionCode: 'suppliers.manage', groupCode: 'CRM', nameAr: 'إضافة وتعديل بيانات الموردين', nameEn: 'Manage Suppliers' },

  // ADMINISTRATION & SETTINGS
  { permissionCode: 'users.view', groupCode: 'ADMINISTRATION', nameAr: 'عرض قائمة المستخدمين', nameEn: 'View Users' },
  { permissionCode: 'users.manage', groupCode: 'ADMINISTRATION', nameAr: 'إدارة المستخدمين والأدوار والصلاحيات', nameEn: 'Manage Users & Roles' },
  { permissionCode: 'settings.view', groupCode: 'SETTINGS', nameAr: 'عرض إعدادات النظام وسجلات الأمان', nameEn: 'View Security & Audit Logs' },
  { permissionCode: 'settings.manage', groupCode: 'SETTINGS', nameAr: 'تعديل إعدادات النظام العامة', nameEn: 'Manage System Settings' }
];

const ROLES = [
  { roleCode: 'SUPER_ADMIN', nameAr: 'مدير النظام الفائق', nameEn: 'Super Administrator', isSystemRole: true, priority: 1 },
  { roleCode: 'FACTORY_MANAGER', nameAr: 'مدير المصنع والإنتاج', nameEn: 'Factory Manager', isSystemRole: true, priority: 2 },
  { roleCode: 'WAREHOUSE_MANAGER', nameAr: 'مدير المخازن الرئيسي', nameEn: 'Warehouse Manager', isSystemRole: true, priority: 3 },
  { roleCode: 'ACCOUNTANT', nameAr: 'محاسب المصنع', nameEn: 'Factory Accountant', isSystemRole: true, priority: 4 },
  { roleCode: 'SALES', nameAr: 'مسؤول المبيعات والمعرض', nameEn: 'Sales Executive', isSystemRole: false, priority: 5 },
  { roleCode: 'CASHIER', nameAr: 'أمين الصندوق والعملاء', nameEn: 'Cashier', isSystemRole: false, priority: 6 },
  { roleCode: 'PRODUCTION_EMPLOYEE', nameAr: 'فني ورشة وإنتاج', nameEn: 'Production Technician', isSystemRole: false, priority: 7 }
];

export async function seedPhase23A() {
  console.log('🌱 Seeding Phase 23A Security Architecture...');

  // 1. Seed Permission Groups
  for (const group of PERMISSION_GROUPS) {
    await prisma.permissionGroup.upsert({
      where: { groupCode: group.groupCode },
      update: { nameAr: group.nameAr, nameEn: group.nameEn, sortOrder: group.sortOrder },
      create: group
    });
  }

  // 2. Seed Permissions
  const groupMap = new Map();
  const groups = await prisma.permissionGroup.findMany();
  groups.forEach(g => groupMap.set(g.groupCode, g.id));

  for (const p of PERMISSIONS) {
    const groupId = groupMap.get(p.groupCode);
    if (groupId) {
      await prisma.securityPermission.upsert({
        where: { permissionCode: p.permissionCode },
        update: { nameAr: p.nameAr, nameEn: p.nameEn, groupId },
        create: {
          permissionCode: p.permissionCode,
          groupId,
          nameAr: p.nameAr,
          nameEn: p.nameEn
        }
      });
    }
  }

  // 3. Seed Default Roles
  for (const r of ROLES) {
    await prisma.securityRole.upsert({
      where: { roleCode: r.roleCode },
      update: { nameAr: r.nameAr, nameEn: r.nameEn, isSystemRole: r.isSystemRole, priority: r.priority },
      create: r
    });
  }

  // Assign All Permissions to SUPER_ADMIN & FACTORY_MANAGER
  const adminRole = await prisma.securityRole.findUnique({ where: { roleCode: 'SUPER_ADMIN' } });
  const allPermissions = await prisma.securityPermission.findMany();

  if (adminRole) {
    for (const perm of allPermissions) {
      await prisma.rolePermissionMapping.upsert({
        where: { roleId_permissionId: { roleId: adminRole.id, permissionId: perm.id } },
        update: {},
        create: { roleId: adminRole.id, permissionId: perm.id }
      });
    }
  }

  // 4. Seed System Automation User
  const systemPasswordHash = await bcrypt.hash('SystemAutomationSecret2026!', 12);
  await prisma.user.upsert({
    where: { username: 'system_automation' },
    update: { isSystemUser: true },
    create: {
      username: 'system_automation',
      email: 'system@bahersilver.online',
      fullNameAr: 'حساب النظام والميكنة الآلية',
      fullNameEn: 'System Automation User',
      passwordHash: systemPasswordHash,
      branchId: 'BRANCH-MAIN',
      department: 'النظام والذكاء الاصطناعي',
      position: 'حساب آلي',
      isSystemUser: true
    }
  });

  // 5. Seed Default Super Admin User
  const adminPasswordHash = await bcrypt.hash('Admin@Baher2026', 12);
  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: { passwordHash: adminPasswordHash, status: 'ACTIVE' },
    create: {
      username: 'admin',
      email: 'admin@bahersilver.online',
      phone: '01000000000',
      fullNameAr: 'مدير النظام الرئيسي',
      fullNameEn: 'Super Admin User',
      passwordHash: adminPasswordHash,
      branchId: 'BRANCH-MAIN',
      department: 'الإدارة العليا',
      position: 'Super Administrator'
    }
  });

  if (adminRole && adminUser) {
    await prisma.userRoleAssignment.upsert({
      where: { userId_roleId: { userId: adminUser.id, roleId: adminRole.id } },
      update: {},
      create: { userId: adminUser.id, roleId: adminRole.id }
    });
  }

  console.log('✅ Phase 23A Seeding Completed Successfully!');
  console.log('🔑 Default Super Admin Login: username="admin", password="Admin@Baher2026"');
}

seedPhase23A()
  .catch(e => { console.error('Seeding error:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());

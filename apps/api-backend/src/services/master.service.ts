import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class MasterService {
  static async listMasterItems(category?: string, search?: string) {
    const where: any = {};
    if (category) where.category = category;

    if (search && search.trim() !== '') {
      const q = search.trim();
      where.OR = [
        { code: { contains: q } },
        { nameAr: { contains: q } },
        { nameEn: { contains: q } }
      ];
    }

    return prisma.masterItem.findMany({
      where,
      include: {
        parent: { select: { id: true, nameAr: true, code: true } },
        children: { select: { id: true, nameAr: true, code: true } }
      },
      orderBy: [{ sortOrder: 'asc' }, { nameAr: 'asc' }]
    });
  }

  static async getSmartSizesByShape(shape?: string) {
    const allSizes = await prisma.masterItem.findMany({
      where: { category: 'SIZE', isActive: true }
    });

    if (!shape || shape.trim() === '') return allSizes;

    const q = shape.trim().toUpperCase();
    return allSizes.filter(s => {
      if (!s.metadata) return true;
      try {
        const meta = JSON.parse(s.metadata);
        return !meta.shapeCode || meta.shapeCode.includes(q) || (meta.shapeAr && meta.shapeAr.includes(shape));
      } catch (e) {
        return true;
      }
    });
  }

  static async getStoneHierarchy() {
    return prisma.masterItem.findMany({
      where: { category: 'STONE_CATEGORY', isActive: true },
      include: {
        children: {
          include: {
            children: true
          }
        }
      }
    });
  }

  static async createMasterItem(data: {
    parentId?: string;
    category: string;
    code: string;
    nameAr: string;
    nameEn: string;
    description?: string;
    metadata?: string;
  }) {
    return prisma.masterItem.create({
      data: {
        parentId: data.parentId || null,
        category: data.category,
        code: data.code.toUpperCase().replace(/\s+/g, '_'),
        nameAr: data.nameAr,
        nameEn: data.nameEn,
        description: data.description || '',
        metadata: data.metadata || null,
        isActive: true
      }
    });
  }

  static async updateMasterItem(id: string, data: {
    parentId?: string;
    nameAr?: string;
    nameEn?: string;
    description?: string;
    metadata?: string;
    isActive?: boolean;
    sortOrder?: number;
  }) {
    return prisma.masterItem.update({
      where: { id },
      data
    });
  }

  static async toggleActive(id: string) {
    const item = await prisma.masterItem.findUnique({ where: { id } });
    if (!item) throw new Error('Master item not found');

    return prisma.masterItem.update({
      where: { id },
      data: { isActive: !item.isActive }
    });
  }

  static async importMasterItems(items: Array<{ category: string; code: string; nameAr: string; nameEn: string }>) {
    const results = [];
    for (const item of items) {
      const code = item.code.toUpperCase().replace(/\s+/g, '_');
      const upserted = await prisma.masterItem.upsert({
        where: { category_code: { category: item.category, code } },
        update: { nameAr: item.nameAr, nameEn: item.nameEn },
        create: {
          category: item.category,
          code,
          nameAr: item.nameAr,
          nameEn: item.nameEn,
          isActive: true
        }
      });
      results.push(upserted);
    }
    return results;
  }
}

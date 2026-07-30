import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ComponentItemService {
  static async listComponentItems(filters: { warehouseId?: string; category?: string }) {
    const where: any = { isActive: true };
    if (filters.warehouseId) where.warehouseId = filters.warehouseId;
    if (filters.category) where.category = filters.category;

    return prisma.itemComponent.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
  }

  static async createComponentItem(data: {
    itemCode: string;
    nameAr: string;
    nameEn?: string;
    category?: string;
    weightGrams?: number;
    compatibleProducts?: string;
    supplierName?: string;
    size?: string;
    material?: string;
    availableStock?: number;
    unitCost?: number;
    warehouseId?: string;
  }) {
    return prisma.itemComponent.create({
      data: {
        itemCode: data.itemCode,
        nameAr: data.nameAr,
        nameEn: data.nameEn || null,
        category: data.category || 'إكسسوارات فضية',
        weightGrams: Number(data.weightGrams || 0),
        compatibleProducts: data.compatibleProducts || 'خواتم وسلاسل فضية',
        supplierName: data.supplierName || null,
        size: data.size || 'قياسي',
        material: data.material || 'فضة 925',
        availableStock: Number(data.availableStock || 0),
        unitCost: Number(data.unitCost || 25),
        warehouseId: data.warehouseId || 'wh-components'
      }
    });
  }
}

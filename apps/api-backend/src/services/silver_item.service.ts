import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SilverItemService {
  static async listSilverItems(filters: { warehouseId?: string; silverCategory?: string }) {
    const where: any = { isActive: true };
    if (filters.warehouseId) where.warehouseId = filters.warehouseId;
    if (filters.silverCategory) where.silverCategory = filters.silverCategory;

    return prisma.itemSilver.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getSilverItemById(id: string) {
    return prisma.itemSilver.findUnique({
      where: { id }
    });
  }

  static async createSilverItem(data: {
    itemCode: string;
    nameAr: string;
    nameEn?: string;
    silverCategory?: string;
    availableStock?: number;
    unitOfMeasure?: string;
    unitCost?: number;
    supplierName?: string;
    warehouseId?: string;
    barcode?: string;
    qrCode?: string;
    notes?: string;
  }) {
    return prisma.itemSilver.create({
      data: {
        itemCode: data.itemCode,
        nameAr: data.nameAr,
        nameEn: data.nameEn || null,
        silverCategory: data.silverCategory || 'فضة خام وسبائك',
        availableStock: Number(data.availableStock || 0),
        unitOfMeasure: data.unitOfMeasure || 'جرام (g)',
        grossWeightGrams: Number(data.availableStock || 0),
        pureSilverGrams: Number(data.availableStock || 0),
        unitCost: Number(data.unitCost || 65),
        costPerGram: Number(data.unitCost || 65),
        supplierName: data.supplierName || null,
        warehouseId: data.warehouseId || 'wh-silver',
        barcode: data.barcode || null,
        qrCode: data.qrCode || null,
        notes: data.notes || null
      }
    });
  }
}

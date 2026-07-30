import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ChemicalItemService {
  static async listChemicalItems(filters: { warehouseId?: string; category?: string }) {
    const where: any = { isActive: true };
    if (filters.warehouseId) where.warehouseId = filters.warehouseId;
    if (filters.category) where.category = filters.category;

    return prisma.itemChemical.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
  }

  static async createChemicalItem(data: {
    itemCode: string;
    nameAr: string;
    nameEn?: string;
    category?: string;
    sdsDocumentUrl?: string;
    hazardClass?: string;
    concentration?: string;
    storageTempMin?: number;
    storageTempMax?: number;
    expiryDate?: string;
    availableStockGrams?: number;
    unitCost?: number;
    supplierName?: string;
    warehouseId?: string;
  }) {
    return prisma.itemChemical.create({
      data: {
        itemCode: data.itemCode,
        nameAr: data.nameAr,
        nameEn: data.nameEn || null,
        category: data.category || 'أحماض وكيماويات',
        sdsDocumentUrl: data.sdsDocumentUrl || null,
        hazardClass: data.hazardClass || 'CORROSIVE_8',
        concentration: data.concentration || '68%',
        storageTempMin: data.storageTempMin ?? 15,
        storageTempMax: data.storageTempMax ?? 25,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        availableStockGrams: Number(data.availableStockGrams || 0),
        unitCost: Number(data.unitCost || 100),
        supplierName: data.supplierName || null,
        warehouseId: data.warehouseId || 'wh-chemicals'
      }
    });
  }
}

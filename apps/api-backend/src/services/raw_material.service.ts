import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class RawMaterialService {
  static async listRawMaterials(category?: string) {
    const where: any = { isActive: true };
    if (category) where.category = category;

    return prisma.itemRawMaterial.findMany({
      where,
      include: {
        warehouse: { select: { code: true, nameAr: true } },
        storageLocation: { select: { binCode: true, locationName: true, fullPathAr: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async createRawMaterial(data: {
    itemCode?: string;
    category: string;
    nameAr: string;
    nameEn: string;
    supplierName?: string;
    batchNumber?: string;
    purchasePrice?: number;
    unitCost?: number;
    availableStock: number;
    unitOfMeasure?: string;
    warehouseId: string;
    storageLocationId?: string;
    notes?: string;
  }) {
    const itemCode = data.itemCode || `RAW-${Date.now().toString().slice(-6)}`;
    const barcode = `62920${Math.floor(10000000 + Math.random() * 90000000)}`;
    const qrCode = `QR-${itemCode}`;
    const batchNumber = data.batchNumber || `BATCH-RAW-${new Date().getFullYear()}-${itemCode}`;

    const rawItem = await prisma.itemRawMaterial.create({
      data: {
        itemCode,
        category: data.category,
        nameAr: data.nameAr,
        nameEn: data.nameEn,
        supplierName: data.supplierName || 'المورد العام',
        batchNumber,
        purchasePrice: Number(data.purchasePrice || 0),
        unitCost: Number(data.unitCost || 0),
        availableStock: Number(data.availableStock || 0),
        unitOfMeasure: data.unitOfMeasure || 'g',
        warehouseId: data.warehouseId,
        storageLocationId: data.storageLocationId || null,
        barcode,
        qrCode,
        notes: data.notes || ''
      }
    });

    // Record Stock Movement Ledger
    await prisma.stockMovement.create({
      data: {
        txType: 'RECEIVE',
        itemType: 'RAW_MATERIAL',
        itemId: rawItem.id,
        itemCode: rawItem.itemCode,
        itemName: rawItem.nameAr,
        batchNumber: rawItem.batchNumber,
        toWarehouse: rawItem.warehouseId,
        toLocation: rawItem.storageLocationId,
        quantity: Math.round(rawItem.availableStock),
        weightGrams: rawItem.availableStock,
        balanceBefore: 0,
        balanceAfter: rawItem.availableStock,
        referenceDoc: `RCV-RAW-${Date.now().toString().slice(-4)}`,
        userName: 'أمين مخزن الخامات',
        notes: `إضافة خام جديد ${rawItem.nameAr} تصنيف ${rawItem.category}`
      }
    });

    return rawItem;
  }
}

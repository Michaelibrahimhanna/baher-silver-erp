import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class StoneService {
  static async listStones(filters: {
    search?: string;
    category?: string;
    warehouseId?: string;
    color?: string;
    shape?: string;
  }) {
    const where: any = { isActive: true };

    if (filters.category) where.category = filters.category;
    if (filters.warehouseId) where.warehouseId = filters.warehouseId;
    if (filters.color) where.color = filters.color;
    if (filters.shape) where.shape = filters.shape;

    if (filters.search) {
      const q = filters.search;
      where.OR = [
        { nameAr: { contains: q } },
        { nameEn: { contains: q } },
        { code: { contains: q } },
        { internalCode: { contains: q } },
        { qrCode: { contains: q } },
        { barcode: { contains: q } },
        { batchNumber: { contains: q } },
        { supplierName: { contains: q } },
        { color: { contains: q } },
        { shape: { contains: q } },
        { size: { contains: q } },
        { origin: { contains: q } }
      ];
    }

    return prisma.itemGemstone.findMany({
      where,
      include: {
        warehouse: { select: { code: true, nameAr: true } },
        storageLocation: { select: { binCode: true, locationName: true, fullPathAr: true } },
        lots: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getStoneById(id: string) {
    return prisma.itemGemstone.findUnique({
      where: { id },
      include: {
        warehouse: true,
        storageLocation: true,
        lots: true
      }
    });
  }

  static async createStone(data: {
    code?: string;
    internalCode?: string;
    category: string;
    stoneType: string;
    nameAr: string;
    nameEn: string;
    color: string;
    shape: string;
    cut?: string;
    size: string;
    quality: string;
    treatment: string;
    origin: string;
    quantity: number;
    weightGrams: number; // PRIMARY WEIGHT IN GRAMS
    weightCarats?: number; // SECONDARY WEIGHT IN CARATS
    supplierName?: string;
    invoiceNumber?: string;
    batchNumber?: string;
    purchasePrice?: number;
    sellingPrice?: number;
    purchaseDate?: string;
    warehouseId: string;
    storageLocationId?: string;
    imageUrl?: string;
    certificateUrl?: string;
    notes?: string;
  }) {
    const code = data.code || `STN-${Date.now().toString().slice(-6)}`;
    const internalCode = data.internalCode || `INT-${Math.floor(1000 + Math.random() * 9000)}`;
    const qrCode = `QR-${code}`;
    const barcode = `62910${Math.floor(10000000 + Math.random() * 90000000)}`;
    const batchNumber = data.batchNumber || `BATCH-${new Date().getFullYear()}-${code}`;

    // Primary Weight: GRAMS. Carats calculation: 1 Gram = 5 Carats (or passed explicitly)
    const weightGrams = Number(data.weightGrams || 0);
    const weightCarats = data.weightCarats !== undefined ? Number(data.weightCarats) : Number((weightGrams * 5.0).toFixed(3));

    const stone = await prisma.itemGemstone.create({
      data: {
        code,
        internalCode,
        qrCode,
        barcode,
        category: data.category,
        stoneType: data.stoneType,
        nameAr: data.nameAr,
        nameEn: data.nameEn,
        color: data.color,
        shape: data.shape,
        cut: data.cut || 'Brilliant',
        size: data.size,
        quality: data.quality,
        treatment: data.treatment,
        origin: data.origin,
        quantity: Number(data.quantity || 0),
        weightGrams,
        weightCarats,
        supplierName: data.supplierName || 'توريد مالي',
        invoiceNumber: data.invoiceNumber || `INV-${Date.now().toString().slice(-5)}`,
        batchNumber,
        purchasePrice: Number(data.purchasePrice || 0),
        sellingPrice: Number(data.sellingPrice || 0),
        purchaseDate: data.purchaseDate || new Date().toISOString().split('T')[0],
        warehouseId: data.warehouseId,
        storageLocationId: data.storageLocationId || null,
        imageUrl: data.imageUrl || null,
        certificateUrl: data.certificateUrl || null,
        notes: data.notes || ''
      }
    });

    // Automatically Create Associated LOT
    await prisma.stoneLot.create({
      data: {
        stoneId: stone.id,
        batchNumber,
        supplierName: stone.supplierName,
        purchaseInvoice: stone.invoiceNumber,
        purchaseDate: stone.purchaseDate,
        purchasePrice: stone.purchasePrice,
        initialQty: stone.quantity,
        availableQty: stone.quantity,
        reservedQty: 0,
        weightGrams: stone.weightGrams,
        weightCarats: stone.weightCarats,
        storageLocationId: stone.storageLocationId
      }
    });

    // Record Immutable Stock Movement (RECEIVE)
    await prisma.stockMovement.create({
      data: {
        txType: 'RECEIVE',
        itemType: 'STONE',
        itemId: stone.id,
        itemCode: stone.code,
        itemName: stone.nameAr,
        batchNumber: stone.batchNumber,
        toWarehouse: stone.warehouseId,
        toLocation: stone.storageLocationId,
        quantity: stone.quantity,
        weightGrams: stone.weightGrams,
        balanceBefore: 0,
        balanceAfter: stone.quantity,
        referenceDoc: stone.invoiceNumber,
        userName: 'أمين مخزن الأحجار',
        notes: `استلام دفعة جديدة من حجر ${stone.nameAr} برقم باتش ${stone.batchNumber}`
      }
    });

    return stone;
  }
}

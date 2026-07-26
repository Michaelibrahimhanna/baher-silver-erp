import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class MovementService {
  static async listMovements(filters: { itemId?: string; itemCode?: string; txType?: string }) {
    const where: any = {};
    if (filters.itemId) where.itemId = filters.itemId;
    if (filters.itemCode) where.itemCode = filters.itemCode;
    if (filters.txType) where.txType = filters.txType;

    return prisma.stockMovement.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
  }

  static async recordMovement(data: {
    txType: string; // 'RECEIVE' | 'TRANSFER' | 'ISSUE' | 'RETURN' | 'ADJUSTMENT' | 'AUDIT' | 'PRODUCTION_CONSUMPTION' | 'PRODUCTION_RETURN'
    itemType: string; // 'STONE' | 'RAW_MATERIAL' | 'SILVER' | 'COMPONENT'
    itemId: string;
    quantity?: number;
    weightGrams?: number;
    fromWarehouse?: string;
    fromLocation?: string;
    toWarehouse?: string;
    toLocation?: string;
    referenceDoc?: string;
    userName?: string;
    notes?: string;
  }) {
    const qty = Number(data.quantity || 0);
    const weightGrams = Number(data.weightGrams || 0);
    let balanceBefore = 0;
    let balanceAfter = 0;
    let itemCode = '';
    let itemName = '';
    let batchNumber = '';

    if (data.itemType === 'STONE') {
      const stone = await prisma.itemGemstone.findUnique({ where: { id: data.itemId } });
      if (!stone) throw new Error('Stone not found');

      balanceBefore = stone.quantity;
      itemCode = stone.code;
      itemName = stone.nameAr;
      batchNumber = stone.batchNumber || '';

      if (['ISSUE', 'PRODUCTION_CONSUMPTION'].includes(data.txType)) {
        if (stone.quantity < qty) throw new Error('Unsufficient quantity in stock');
        balanceAfter = stone.quantity - qty;
      } else if (['RECEIVE', 'RETURN', 'PRODUCTION_RETURN'].includes(data.txType)) {
        balanceAfter = stone.quantity + qty;
      } else if (data.txType === 'ADJUSTMENT' || data.txType === 'AUDIT') {
        balanceAfter = qty;
      } else {
        balanceAfter = stone.quantity;
      }

      // Update Stone stock balance automatically
      await prisma.itemGemstone.update({
        where: { id: stone.id },
        data: {
          quantity: balanceAfter,
          weightGrams: balanceAfter > 0 ? (stone.weightGrams / (stone.quantity || 1)) * balanceAfter : 0,
          weightCarats: balanceAfter > 0 ? (stone.weightCarats / (stone.quantity || 1)) * balanceAfter : 0,
          storageLocationId: data.toLocation || stone.storageLocationId
        }
      });
    } else if (data.itemType === 'RAW_MATERIAL') {
      const raw = await prisma.itemRawMaterial.findUnique({ where: { id: data.itemId } });
      if (!raw) throw new Error('Raw material item not found');

      balanceBefore = raw.availableStock;
      itemCode = raw.itemCode;
      itemName = raw.nameAr;
      batchNumber = raw.batchNumber || '';

      if (['ISSUE', 'PRODUCTION_CONSUMPTION'].includes(data.txType)) {
        balanceAfter = Math.max(0, raw.availableStock - weightGrams);
      } else if (['RECEIVE', 'RETURN', 'PRODUCTION_RETURN'].includes(data.txType)) {
        balanceAfter = raw.availableStock + weightGrams;
      } else if (data.txType === 'ADJUSTMENT' || data.txType === 'AUDIT') {
        balanceAfter = weightGrams;
      } else {
        balanceAfter = raw.availableStock;
      }

      await prisma.itemRawMaterial.update({
        where: { id: raw.id },
        data: { availableStock: balanceAfter }
      });
    }

    // Create Immutable Record
    return prisma.stockMovement.create({
      data: {
        txType: data.txType,
        itemType: data.itemType,
        itemId: data.itemId,
        itemCode,
        itemName,
        batchNumber,
        fromWarehouse: data.fromWarehouse || null,
        fromLocation: data.fromLocation || null,
        toWarehouse: data.toWarehouse || null,
        toLocation: data.toLocation || null,
        quantity: qty,
        weightGrams,
        balanceBefore,
        balanceAfter,
        referenceDoc: data.referenceDoc || `REF-${Date.now().toString().slice(-6)}`,
        userName: data.userName || 'أمين المخزن المختص',
        notes: data.notes || ''
      }
    });
  }
}

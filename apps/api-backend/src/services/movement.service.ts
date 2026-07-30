import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class MovementService {
  static async listMovements(filters: { itemId?: string; itemCode?: string; txType?: string; itemType?: string }) {
    const where: any = {};
    if (filters.itemId) where.itemId = filters.itemId;
    if (filters.itemCode) where.itemCode = filters.itemCode;
    if (filters.txType) where.txType = filters.txType;
    if (filters.itemType) where.itemType = filters.itemType;

    return prisma.stockMovement.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
  }

  static async recordMovement(data: {
    txType: string; // 'RECEIVE' | 'TRANSFER' | 'ISSUE' | 'RETURN' | 'ADJUSTMENT' | 'AUDIT' | 'PRODUCTION_CONSUMPTION' | 'PRODUCTION_RETURN'
    itemType: string; // 'STONE' | 'RAW_MATERIAL' | 'SILVER' | 'CHEMICAL' | 'COMPONENT'
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

    return prisma.$transaction(async (tx) => {
      let balanceBefore = 0;
      let balanceAfter = 0;
      let itemCode = '';
      let itemName = '';
      let batchNumber = '';
      let stoneId: string | null = null;
      let rawMaterialId: string | null = null;
      let silverId: string | null = null;
      let chemicalId: string | null = null;
      let componentId: string | null = null;

      if (data.itemType === 'STONE') {
        const stone = await tx.itemGemstone.findUnique({ where: { id: data.itemId } });
        if (!stone) throw new Error('Stone item not found');

        stoneId = stone.id;
        balanceBefore = stone.quantity;
        itemCode = stone.code;
        itemName = stone.nameAr;
        batchNumber = stone.batchNumber || '';

        if (['ISSUE', 'PRODUCTION_CONSUMPTION'].includes(data.txType)) {
          if (stone.quantity < qty) throw new Error(`Insufficient stone quantity. Current stock: ${stone.quantity}`);
          balanceAfter = stone.quantity - qty;
        } else if (['RECEIVE', 'RETURN', 'PRODUCTION_RETURN'].includes(data.txType)) {
          balanceAfter = stone.quantity + qty;
        } else if (data.txType === 'ADJUSTMENT' || data.txType === 'AUDIT') {
          balanceAfter = qty;
        } else {
          balanceAfter = stone.quantity;
        }

        const newWeight = balanceAfter > 0 ? Number(((stone.weightGrams / (stone.quantity || 1)) * balanceAfter).toFixed(3)) : 0;
        const newCarats = balanceAfter > 0 ? Number(((stone.weightCarats / (stone.quantity || 1)) * balanceAfter).toFixed(3)) : 0;

        await tx.itemGemstone.update({
          where: { id: stone.id },
          data: {
            quantity: balanceAfter,
            weightGrams: newWeight,
            weightCarats: newCarats,
            storageLocationId: data.toLocation || stone.storageLocationId
          }
        });
      } else if (data.itemType === 'RAW_MATERIAL') {
        const raw = await tx.itemRawMaterial.findUnique({ where: { id: data.itemId } });
        if (!raw) throw new Error('Raw material item not found');

        rawMaterialId = raw.id;
        balanceBefore = raw.availableStock;
        itemCode = raw.itemCode;
        itemName = raw.nameAr;
        batchNumber = raw.batchNumber || '';

        const delta = weightGrams || qty;
        if (['ISSUE', 'PRODUCTION_CONSUMPTION'].includes(data.txType)) {
          if (raw.availableStock < delta) throw new Error(`Insufficient raw material stock. Current stock: ${raw.availableStock}`);
          balanceAfter = raw.availableStock - delta;
        } else if (['RECEIVE', 'RETURN', 'PRODUCTION_RETURN'].includes(data.txType)) {
          balanceAfter = raw.availableStock + delta;
        } else if (data.txType === 'ADJUSTMENT' || data.txType === 'AUDIT') {
          balanceAfter = delta;
        } else {
          balanceAfter = raw.availableStock;
        }

        await tx.itemRawMaterial.update({
          where: { id: raw.id },
          data: { availableStock: balanceAfter }
        });
      } else if (data.itemType === 'SILVER') {
        const silver = await tx.itemSilver.findUnique({ where: { id: data.itemId } });
        if (!silver) throw new Error('Silver item not found');

        silverId = silver.id;
        balanceBefore = silver.availableStock;
        itemCode = silver.itemCode;
        itemName = silver.nameAr;
        batchNumber = silver.batchCode || '';

        const delta = weightGrams || qty;
        if (['ISSUE', 'PRODUCTION_CONSUMPTION'].includes(data.txType)) {
          if (silver.availableStock < delta) throw new Error(`Insufficient silver stock. Current stock: ${silver.availableStock}g`);
          balanceAfter = silver.availableStock - delta;
        } else if (['RECEIVE', 'RETURN', 'PRODUCTION_RETURN'].includes(data.txType)) {
          balanceAfter = silver.availableStock + delta;
        } else if (data.txType === 'ADJUSTMENT' || data.txType === 'AUDIT') {
          balanceAfter = delta;
        } else {
          balanceAfter = silver.availableStock;
        }

        await tx.itemSilver.update({
          where: { id: silver.id },
          data: { availableStock: balanceAfter, grossWeightGrams: balanceAfter }
        });
      } else if (data.itemType === 'CHEMICAL') {
        const chem = await tx.itemChemical.findUnique({ where: { id: data.itemId } });
        if (!chem) throw new Error('Chemical item not found');

        chemicalId = chem.id;
        balanceBefore = chem.availableStockGrams;
        itemCode = chem.itemCode;
        itemName = chem.nameAr;

        const delta = weightGrams || qty;
        if (['ISSUE', 'PRODUCTION_CONSUMPTION'].includes(data.txType)) {
          if (chem.availableStockGrams < delta) throw new Error(`Insufficient chemical stock. Current stock: ${chem.availableStockGrams}`);
          balanceAfter = chem.availableStockGrams - delta;
        } else if (['RECEIVE', 'RETURN', 'PRODUCTION_RETURN'].includes(data.txType)) {
          balanceAfter = chem.availableStockGrams + delta;
        } else if (data.txType === 'ADJUSTMENT' || data.txType === 'AUDIT') {
          balanceAfter = delta;
        } else {
          balanceAfter = chem.availableStockGrams;
        }

        await tx.itemChemical.update({
          where: { id: chem.id },
          data: { availableStockGrams: balanceAfter }
        });
      } else if (data.itemType === 'COMPONENT') {
        const comp = await tx.itemComponent.findUnique({ where: { id: data.itemId } });
        if (!comp) throw new Error('Component item not found');

        componentId = comp.id;
        balanceBefore = comp.availableStock;
        itemCode = comp.itemCode;
        itemName = comp.nameAr;

        const delta = qty || weightGrams;
        if (['ISSUE', 'PRODUCTION_CONSUMPTION'].includes(data.txType)) {
          if (comp.availableStock < delta) throw new Error(`Insufficient component stock. Current stock: ${comp.availableStock}`);
          balanceAfter = comp.availableStock - delta;
        } else if (['RECEIVE', 'RETURN', 'PRODUCTION_RETURN'].includes(data.txType)) {
          balanceAfter = comp.availableStock + delta;
        } else if (data.txType === 'ADJUSTMENT' || data.txType === 'AUDIT') {
          balanceAfter = delta;
        } else {
          balanceAfter = comp.availableStock;
        }

        await tx.itemComponent.update({
          where: { id: comp.id },
          data: { availableStock: balanceAfter }
        });
      }

      // Create Immutable Movement Record with Foreign Key Relations
      return tx.stockMovement.create({
        data: {
          txType: data.txType,
          itemType: data.itemType,
          itemId: data.itemId,
          itemCode,
          itemName,
          batchNumber,
          stoneId,
          rawMaterialId,
          silverId,
          chemicalId,
          componentId,
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
    });
  }
}

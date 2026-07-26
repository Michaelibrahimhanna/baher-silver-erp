import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AuditService {
  static async listAudits() {
    return prisma.inventoryAudit.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async performAudit(data: {
    warehouseName: string;
    auditorName: string;
    items: Array<{
      itemCode: string;
      itemName: string;
      systemQty: number;
      actualQty: number;
      systemWeightGrams: number;
      actualWeightGrams: number;
      auditorNotes?: string;
    }>;
  }) {
    const auditCode = `AUD-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;

    const audit = await prisma.inventoryAudit.create({
      data: {
        auditCode,
        warehouseName: data.warehouseName,
        auditorName: data.auditorName,
        status: 'COMPLETED'
      }
    });

    for (const item of data.items) {
      const differenceQty = item.actualQty - item.systemQty;
      const differenceWeightGrams = item.actualWeightGrams - item.systemWeightGrams;

      await prisma.inventoryAuditItem.create({
        data: {
          auditId: audit.id,
          itemCode: item.itemCode,
          itemName: item.itemName,
          systemQty: item.systemQty,
          actualQty: item.actualQty,
          differenceQty,
          systemWeightGrams: item.systemWeightGrams,
          actualWeightGrams: item.actualWeightGrams,
          differenceWeightGrams,
          lastMovementDate: new Date().toISOString(),
          lastAuditDate: new Date().toISOString(),
          auditorNotes: item.auditorNotes || ''
        }
      });

      // If difference exists, record AUDIT stock movement to adjust balance
      if (differenceQty !== 0 || differenceWeightGrams !== 0) {
        const stone = await prisma.itemGemstone.findUnique({ where: { code: item.itemCode } });
        if (stone) {
          await prisma.itemGemstone.update({
            where: { id: stone.id },
            data: {
              quantity: item.actualQty,
              weightGrams: item.actualWeightGrams,
              weightCarats: Number((item.actualWeightGrams * 5.0).toFixed(3))
            }
          });

          await prisma.stockMovement.create({
            data: {
              txType: 'AUDIT',
              itemType: 'STONE',
              itemId: stone.id,
              itemCode: stone.code,
              itemName: stone.nameAr,
              batchNumber: stone.batchNumber,
              toWarehouse: stone.warehouseId,
              toLocation: stone.storageLocationId,
              quantity: item.actualQty,
              weightGrams: item.actualWeightGrams,
              balanceBefore: item.systemQty,
              balanceAfter: item.actualQty,
              referenceDoc: auditCode,
              userName: data.auditorName,
              notes: `تسوية جرد دوري: فرق ${differenceQty} قطعة / ${differenceWeightGrams} جرام`
            }
          });
        }
      }
    }

    return prisma.inventoryAudit.findUnique({
      where: { id: audit.id },
      include: { items: true }
    });
  }
}

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class BOMService {
  static async getBOMForProduct(productId: string) {
    return prisma.productBOM.findUnique({
      where: { productId },
      include: { lines: true }
    });
  }

  static async upsertBOM(productId: string, data: {
    expectedYield?: number;
    expectedLossPercent?: number;
    notes?: string;
    lines?: Array<{
      lineType: string;
      itemId?: string;
      itemCode: string;
      itemName: string;
      quantity: number;
      unitOfMeasure?: string;
      unitCost?: number;
      wasteFactor?: number;
      notes?: string;
    }>;
  }) {
    // Delete existing lines if updating
    const existingBOM = await prisma.productBOM.findUnique({ where: { productId } });

    if (existingBOM) {
      await prisma.bOMLine.deleteMany({ where: { bomId: existingBOM.id } });

      return prisma.productBOM.update({
        where: { productId },
        data: {
          expectedYield: data.expectedYield ?? existingBOM.expectedYield,
          expectedLossPercent: data.expectedLossPercent ?? existingBOM.expectedLossPercent,
          notes: data.notes ?? existingBOM.notes,
          lines: {
            create: (data.lines || []).map(l => ({
              lineType: l.lineType,
              itemId: l.itemId,
              itemCode: l.itemCode,
              itemName: l.itemName,
              quantity: l.quantity,
              unitOfMeasure: l.unitOfMeasure || 'g',
              unitCost: l.unitCost || 0,
              totalCost: (l.quantity * (l.unitCost || 0)) * (1 + ((l.wasteFactor || 0) / 100)),
              wasteFactor: l.wasteFactor || 0,
              notes: l.notes
            }))
          }
        },
        include: { lines: true }
      });
    }

    return prisma.productBOM.create({
      data: {
        productId,
        expectedYield: data.expectedYield ?? 100.0,
        expectedLossPercent: data.expectedLossPercent ?? 2.0,
        notes: data.notes,
        lines: {
          create: (data.lines || []).map(l => ({
            lineType: l.lineType,
            itemId: l.itemId,
            itemCode: l.itemCode,
            itemName: l.itemName,
            quantity: l.quantity,
            unitOfMeasure: l.unitOfMeasure || 'g',
            unitCost: l.unitCost || 0,
            totalCost: (l.quantity * (l.unitCost || 0)) * (1 + ((l.wasteFactor || 0) / 100)),
            wasteFactor: l.wasteFactor || 0,
            notes: l.notes
          }))
        }
      },
      include: { lines: true }
    });
  }

  static async addBOMLine(bomId: string, line: {
    lineType: string;
    itemId?: string;
    itemCode: string;
    itemName: string;
    quantity: number;
    unitOfMeasure?: string;
    unitCost?: number;
    wasteFactor?: number;
    notes?: string;
  }) {
    const totalCost = (line.quantity * (line.unitCost || 0)) * (1 + ((line.wasteFactor || 0) / 100));

    return prisma.bOMLine.create({
      data: {
        bomId,
        lineType: line.lineType,
        itemId: line.itemId,
        itemCode: line.itemCode,
        itemName: line.itemName,
        quantity: line.quantity,
        unitOfMeasure: line.unitOfMeasure || 'g',
        unitCost: line.unitCost || 0,
        totalCost,
        wasteFactor: line.wasteFactor || 0,
        notes: line.notes
      }
    });
  }

  static async removeBOMLine(lineId: string) {
    return prisma.bOMLine.delete({ where: { id: lineId } });
  }
}

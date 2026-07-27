import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CostingService {
  static async calculateCost(productId: string, overrideSellingPrice?: number) {
    const product = await prisma.productMaster.findUnique({
      where: { id: productId },
      include: {
        bom: { include: { lines: true } },
        routing: { include: { steps: true } },
        cost: true
      }
    });

    if (!product) throw new Error('Product not found');

    let materialCost = 0;
    let packagingCost = 0;

    if (product.bom && product.bom.lines) {
      product.bom.lines.forEach(line => {
        const lineTotal = (line.quantity * (line.unitCost || 0)) * (1 + ((line.wasteFactor || 0) / 100));
        if (line.lineType === 'PACKAGING') {
          packagingCost += lineTotal;
        } else {
          materialCost += lineTotal;
        }
      });
    }

    let laborCost = 0;
    let machineCost = 0;

    if (product.routing && product.routing.steps) {
      product.routing.steps.forEach(step => {
        const laborHrs = (step.laborMinutes || 0) / 60;
        const machineHrs = (step.machineMinutes || 0) / 60;
        const rate = step.laborCostRate || 2.5;

        laborCost += laborHrs * rate;
        machineCost += machineHrs * (rate * 0.5);
      });
    }

    const overhead = (materialCost + laborCost) * 0.10; // 10% standard factory overhead
    const actualCost = materialCost + laborCost + machineCost + overhead + packagingCost;

    const sellingPrice = overrideSellingPrice ?? product.cost?.sellingPrice ?? (actualCost * 1.35); // Default 35% markup
    const profitMargin = sellingPrice > 0 ? ((sellingPrice - actualCost) / sellingPrice) * 100 : 0;

    const costRecord = await prisma.productCost.upsert({
      where: { productId },
      update: {
        materialCost,
        laborCost,
        machineCost,
        overhead,
        packagingCost,
        actualCost,
        sellingPrice,
        profitMargin,
        calculatedAt: new Date()
      },
      create: {
        productId,
        materialCost,
        laborCost,
        machineCost,
        overhead,
        packagingCost,
        actualCost,
        sellingPrice,
        profitMargin
      }
    });

    return costRecord;
  }

  static async getCostForProduct(productId: string) {
    let cost = await prisma.productCost.findUnique({ where: { productId } });
    if (!cost) {
      cost = await CostingService.calculateCost(productId);
    }
    return cost;
  }
}

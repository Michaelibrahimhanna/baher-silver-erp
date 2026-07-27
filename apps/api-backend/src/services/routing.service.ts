import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const DEFAULT_STAGES = [
  'WAX',
  'TREE',
  'CASTING',
  'CLEANING',
  'STONE_SETTING',
  'POLISHING',
  'QC',
  'HALLMARK',
  'PACKAGING'
];

export class RoutingService {
  static async getRoutingForProduct(productId: string) {
    return prisma.routingTemplate.findUnique({
      where: { productId },
      include: { steps: { orderBy: { sequenceNo: 'asc' } } }
    });
  }

  static async upsertRouting(productId: string, data: {
    templateName?: string;
    notes?: string;
    steps?: Array<{
      stage: string;
      sequenceNo?: number;
      laborMinutes?: number;
      machineMinutes?: number;
      laborCostRate?: number;
      notes?: string;
    }>;
  }) {
    const existing = await prisma.routingTemplate.findUnique({ where: { productId } });

    const stepsToCreate = (data.steps && data.steps.length)
      ? data.steps.map((s, idx) => ({
          sequenceNo: s.sequenceNo ?? (idx + 1),
          stage: s.stage,
          laborMinutes: s.laborMinutes || 0,
          machineMinutes: s.machineMinutes || 0,
          laborCostRate: s.laborCostRate || 0,
          notes: s.notes
        }))
      : DEFAULT_STAGES.map((stage, idx) => ({
          sequenceNo: idx + 1,
          stage,
          laborMinutes: 15,
          machineMinutes: 10,
          laborCostRate: 2.5,
          notes: `${stage} production step`
        }));

    if (existing) {
      await prisma.routingStep.deleteMany({ where: { routingId: existing.id } });

      return prisma.routingTemplate.update({
        where: { productId },
        data: {
          templateName: data.templateName || existing.templateName,
          notes: data.notes || existing.notes,
          steps: { create: stepsToCreate }
        },
        include: { steps: { orderBy: { sequenceNo: 'asc' } } }
      });
    }

    return prisma.routingTemplate.create({
      data: {
        productId,
        templateName: data.templateName || 'المسار القياسي للتصنيع',
        notes: data.notes,
        steps: { create: stepsToCreate }
      },
      include: { steps: { orderBy: { sequenceNo: 'asc' } } }
    });
  }
}

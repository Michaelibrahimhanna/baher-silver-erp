import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreatePrintPresetDTO {
  presetCode: string;
  name: string;
  branchId?: string;
  stationId?: string;
  printerDeviceId?: string;
  templateId: string;
  commandLanguage?: 'ZPL' | 'EPL' | 'TSPL' | 'EZPL' | 'PDF_VECTOR';
  isDefault?: boolean;
}

export class LabelPresetService {
  static async createPrintPreset(data: CreatePrintPresetDTO) {
    const existing = await prisma.printPreset.findUnique({
      where: { presetCode: data.presetCode }
    });
    if (existing) {
      throw new Error(`Print preset code '${data.presetCode}' already exists.`);
    }

    if (data.isDefault) {
      await prisma.printPreset.updateMany({
        where: {
          ...(data.stationId ? { stationId: data.stationId } : {}),
          ...(data.branchId ? { branchId: data.branchId } : {})
        },
        data: { isDefault: false }
      });
    }

    return await prisma.printPreset.create({
      data: {
        presetCode: data.presetCode,
        name: data.name,
        branchId: data.branchId || null,
        stationId: data.stationId || null,
        printerDeviceId: data.printerDeviceId || null,
        templateId: data.templateId,
        commandLanguage: data.commandLanguage || 'ZPL',
        isDefault: data.isDefault || false
      },
      include: {
        template: true
      }
    });
  }

  static async listPrintPresets(filters?: { branchId?: string; stationId?: string }) {
    const where: any = {};
    if (filters?.branchId) where.branchId = filters.branchId;
    if (filters?.stationId) where.stationId = filters.stationId;

    return await prisma.printPreset.findMany({
      where,
      include: {
        template: true
      },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }]
    });
  }

  static async resolvePresetForStation(branchId?: string, stationId?: string) {
    const preset = await prisma.printPreset.findFirst({
      where: {
        ...(stationId ? { stationId } : {}),
        ...(branchId ? { branchId } : {}),
        isDefault: true
      },
      include: {
        template: true
      }
    });

    if (preset) return preset;

    // Fallback to any preset in system
    return await prisma.printPreset.findFirst({
      include: { template: true }
    });
  }

  static async deletePrintPreset(idOrCode: string) {
    const preset = await prisma.printPreset.findFirst({
      where: {
        OR: [{ id: idOrCode }, { presetCode: idOrCode }]
      }
    });
    if (!preset) throw new Error(`Print preset not found for '${idOrCode}'`);
    return await prisma.printPreset.delete({
      where: { id: preset.id }
    });
  }
}

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface NumberingConfigInput {
  entityKey: string;
  nameAr: string;
  prefix: string;
  scope?: 'GLOBAL' | 'BRANCH' | 'TENANT';
  branchCode?: string;
  paddingLength?: number;
  resetPolicy?: 'NEVER' | 'YEARLY' | 'MONTHLY';
  templateFormat?: string;
}

export class NumberingEngineService {
  static async getOrCreateConfig(entityKey: string, defaultConfig: Partial<NumberingConfigInput>) {
    let config = await prisma.numberingEngineConfig.findUnique({
      where: { entityKey }
    });

    if (!config) {
      config = await prisma.numberingEngineConfig.create({
        data: {
          entityKey,
          nameAr: defaultConfig.nameAr || entityKey,
          scope: defaultConfig.scope || 'GLOBAL',
          prefix: defaultConfig.prefix || entityKey.slice(0, 3).toUpperCase(),
          branchCode: defaultConfig.branchCode || 'HQ',
          currentSeq: 1,
          paddingLength: defaultConfig.paddingLength || 6,
          resetPolicy: defaultConfig.resetPolicy || 'YEARLY',
          lastResetYear: new Date().getFullYear(),
          templateFormat: defaultConfig.templateFormat || '{PREFIX}-{YEAR}-{SEQ}'
        }
      });
    }

    return config;
  }

  static async generateNextNumber(entityKey: string, defaultConfig?: Partial<NumberingConfigInput>): Promise<string> {
    return prisma.$transaction(async (tx) => {
      let config = await tx.numberingEngineConfig.findUnique({
        where: { entityKey }
      });

      if (!config) {
        config = await tx.numberingEngineConfig.create({
          data: {
            entityKey,
            nameAr: defaultConfig?.nameAr || entityKey,
            scope: defaultConfig?.scope || 'GLOBAL',
            prefix: defaultConfig?.prefix || entityKey.slice(0, 3).toUpperCase(),
            branchCode: defaultConfig?.branchCode || 'HQ',
            currentSeq: 1,
            paddingLength: defaultConfig?.paddingLength || 6,
            resetPolicy: defaultConfig?.resetPolicy || 'YEARLY',
            lastResetYear: new Date().getFullYear(),
            templateFormat: defaultConfig?.templateFormat || '{PREFIX}-{YEAR}-{SEQ}'
          }
        });
      }

      const currentYear = new Date().getFullYear();
      let seqToUse = config.currentSeq;

      // Handle Automatic Reset Policy
      if (config.resetPolicy === 'YEARLY' && config.lastResetYear !== currentYear) {
        seqToUse = 1;
        await tx.numberingEngineConfig.update({
          where: { id: config.id },
          data: { currentSeq: 2, lastResetYear: currentYear }
        });
      } else {
        await tx.numberingEngineConfig.update({
          where: { id: config.id },
          data: { currentSeq: config.currentSeq + 1 }
        });
      }

      const paddedSeq = String(seqToUse).padStart(config.paddingLength, '0');
      let result = config.templateFormat;

      result = result.replace('{PREFIX}', config.prefix);
      result = result.replace('{BRANCH}', config.branchCode || 'HQ');
      result = result.replace('{YEAR}', String(currentYear));
      result = result.replace('{SEQ}', paddedSeq);

      return result;
    });
  }
}

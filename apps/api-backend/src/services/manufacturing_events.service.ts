import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export type ManufacturingEventType =
  | 'MO_CREATED'
  | 'MO_CONFIRMED'
  | 'MO_STARTED'
  | 'MO_PAUSED'
  | 'MO_RESUMED'
  | 'MO_COMPLETED'
  | 'QC_FAILED'
  | 'SCRAP_CREATED'
  | 'FINISHED_RECEIVED';

export class ManufacturingEventsService {
  /**
   * Emit and log structured manufacturing events
   */
  static async emitEvent(
    eventType: ManufacturingEventType,
    moId?: string,
    payload: Record<string, any> = {},
    actorId?: string
  ) {
    try {
      const eventLog = await prisma.manufacturingEventLog.create({
        data: {
          eventType,
          moId,
          payload: JSON.stringify(payload),
          actorId: actorId || 'SYSTEM',
          timestamp: new Date()
        }
      });

      console.log(`⚡ [EVENT ENGINE] ${eventType} emitted for MO #${moId || 'N/A'} by ${actorId || 'SYSTEM'}`);
      return eventLog;
    } catch (e: any) {
      console.error(`❌ [EVENT ENGINE ERROR] Failed to emit ${eventType}:`, e.message);
      return null;
    }
  }

  /**
   * Query event logs
   */
  static async getEventsForMO(moId: string) {
    return prisma.manufacturingEventLog.findMany({
      where: { moId },
      orderBy: { timestamp: 'desc' }
    });
  }

  static async getRecentEvents(limit: number = 50) {
    return prisma.manufacturingEventLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: limit
    });
  }
}

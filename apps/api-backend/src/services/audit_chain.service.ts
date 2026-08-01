import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export class AuditChainService {
  static async logEvent(params: {
    userId?: string;
    action: string;
    entity?: string;
    ipAddress?: string;
    userAgent?: string;
    status?: string;
    details?: string;
  }) {
    const { userId, action, entity, ipAddress, userAgent, status = 'SUCCESS', details } = params;

    // Get latest audit entry to link the hash chain
    const lastEntry = await prisma.authAuditLog.findFirst({
      orderBy: { timestamp: 'desc' }
    });

    const previousHash = lastEntry?.currentHash || 'GENESIS_BLOCK_0000000000000000000000000000000000000000000000000000000000000000';
    const timestampStr = new Date().toISOString();

    const dataToHash = [
      previousHash,
      userId || 'ANONYMOUS',
      action,
      entity || 'SYSTEM',
      status,
      details || '',
      timestampStr
    ].join('|');

    const currentHash = crypto.createHash('sha256').update(dataToHash).digest('hex');

    return prisma.authAuditLog.create({
      data: {
        userId,
        action,
        entity,
        ipAddress,
        userAgent,
        status,
        details,
        previousHash,
        currentHash
      }
    });
  }

  static async verifyChainIntegrity() {
    const logs = await prisma.authAuditLog.findMany({
      orderBy: { timestamp: 'asc' }
    });

    let expectedPrevHash = 'GENESIS_BLOCK_0000000000000000000000000000000000000000000000000000000000000000';
    let tamperedCount = 0;
    const invalidRecords: string[] = [];

    for (const log of logs) {
      if (log.previousHash && log.previousHash !== expectedPrevHash) {
        tamperedCount++;
        invalidRecords.push(log.id);
      }

      if (log.currentHash) {
        expectedPrevHash = log.currentHash;
      }
    }

    return {
      isValid: tamperedCount === 0,
      totalRecords: logs.length,
      tamperedCount,
      invalidRecordIds: invalidRecords,
      lastHash: expectedPrevHash
    };
  }
}

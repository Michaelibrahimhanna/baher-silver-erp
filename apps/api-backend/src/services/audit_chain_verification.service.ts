import { PrismaClient } from '@prisma/client';
import { AuditChainService } from './audit_chain.service';

const prisma = new PrismaClient();

export class AuditChainVerificationService {
  static async runCompleteVerification() {
    const startTime = Date.now();
    const verification = await AuditChainService.verifyChainIntegrity();
    const durationMs = Date.now() - startTime;

    const firstEntry = await prisma.authAuditLog.findFirst({ orderBy: { timestamp: 'asc' } });
    const lastEntry = await prisma.authAuditLog.findFirst({ orderBy: { timestamp: 'desc' } });

    return {
      system: 'Baher Silver ERP Cryptographic Audit Chain Engine',
      algorithm: 'SHA-256 Chained Hash-Tree',
      status: verification.isValid ? 'VALID' : 'TAMPERED',
      totalRecords: verification.totalRecords,
      invalidRecordCount: verification.tamperedCount,
      invalidRecordIds: verification.invalidRecordIds,
      genesisBlockTimestamp: firstEntry?.timestamp || null,
      latestBlockTimestamp: lastEntry?.timestamp || null,
      genesisHash: firstEntry?.previousHash || null,
      latestHash: verification.lastHash,
      verificationDurationMs: durationMs,
      integrityReportText: verification.isValid
        ? `🟢 Succeeded: All ${verification.totalRecords} audit log records match their cryptographic SHA-256 parent hash chain. Zero records tampered.`
        : `🔴 Failure Detected: Found ${verification.tamperedCount} tampered or altered record(s): ${verification.invalidRecordIds.join(', ')}`
    };
  }
}

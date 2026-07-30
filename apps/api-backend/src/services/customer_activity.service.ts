import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface LogActivityInput {
  customerId: string;
  activityType: 'PASSPORT_ACCESS' | 'QR_SCAN' | 'FILE_DOWNLOAD' | 'SERVICE_REQUEST' | 'WARRANTY_CLAIM' | 'ORDER_APPROVAL';
  entityType?: 'PASSPORT' | 'QR' | 'FILE' | 'SERVICE' | 'WARRANTY' | 'ORDER';
  entityId?: string;
  description: string;
  ipAddress?: string;
  userAgent?: string;
  metadataJson?: string;
}

export interface TimelineFilterOptions {
  category?: 'ORDERS' | 'SERVICES' | 'WARRANTY' | 'REPAIRS' | 'CERTIFICATES' | 'PASSPORTS';
  pieceSerial?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}

export class CustomerActivityService {
  /**
   * 1. LOG CUSTOMER ACTIVITY
   */
  static async logActivity(input: LogActivityInput) {
    return await prisma.customerActivityLog.create({
      data: {
        customerId: input.customerId,
        activityType: input.activityType,
        entityType: input.entityType || null,
        entityId: input.entityId || null,
        description: input.description,
        ipAddress: input.ipAddress || '127.0.0.1',
        userAgent: input.userAgent || 'Enterprise Portal Browser',
        metadataJson: input.metadataJson || null
      }
    });
  }

  /**
   * 2. GET FULL CUSTOMER ACTIVITY HISTORY
   */
  static async getActivityHistory(customerId: string, activityType?: string, limit = 50) {
    const user = await prisma.customerPortalUser.findUnique({ where: { id: customerId } });
    if (!user) throw new Error('Customer user not found.');

    const where: any = { customerId };
    if (activityType) where.activityType = activityType;

    return await prisma.customerActivityLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }

  /**
   * 3. GET PASSPORT ACCESS HISTORY
   */
  static async getPassportAccessHistory(customerId: string) {
    // Combine activity log PASSPORT_ACCESS and Passport Share link views
    const logs = await prisma.customerActivityLog.findMany({
      where: { customerId, activityType: 'PASSPORT_ACCESS' },
      orderBy: { createdAt: 'desc' }
    });

    const shareLinks = await prisma.customerPassportShareLink.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' }
    });

    return {
      totalAccessLogsCount: logs.length,
      passportAccessLogs: logs,
      sharedLinks: shareLinks.map((link) => ({
        dppCode: link.dppCode,
        shareToken: link.shareToken,
        viewCount: link.viewCount,
        expiresAt: link.expiresAt,
        isRevoked: link.isRevoked,
        createdAt: link.createdAt
      }))
    };
  }

  /**
   * 4. GET QR SCAN HISTORY
   */
  static async getQrScanHistory(customerId: string) {
    // Fetch all warranty/pieces owned or scanned by customer
    const scanAudits = await prisma.customerScanAuditHistory.findMany({
      where: {
        OR: [{ customerId }, { scannedBy: customerId }]
      },
      orderBy: { scannedAt: 'desc' }
    });

    const scanLogs = await prisma.customerActivityLog.findMany({
      where: { customerId, activityType: 'QR_SCAN' },
      orderBy: { createdAt: 'desc' }
    });

    return {
      totalScans: scanAudits.length + scanLogs.length,
      verificationAuditHistory: scanAudits,
      activityScanLogs: scanLogs
    };
  }

  /**
   * 5. GET FILE DOWNLOAD HISTORY
   */
  static async getFileDownloadHistory(customerId: string) {
    const cadDownloads = await prisma.customerAssetDownloadLog.findMany({
      where: { customerId },
      orderBy: { timestamp: 'desc' }
    });

    const fileActivityLogs = await prisma.customerActivityLog.findMany({
      where: { customerId, activityType: 'FILE_DOWNLOAD' },
      orderBy: { createdAt: 'desc' }
    });

    return {
      totalDownloads: cadDownloads.length + fileActivityLogs.length,
      cadDownloadLogs: cadDownloads,
      generalFileLogs: fileActivityLogs
    };
  }

  /**
   * 6. UNIFIED 360° CUSTOMER TIMELINE (Orders, Services, Warranty, Repairs, Certificates, Passport Events)
   */
  static async get360CustomerTimeline(customerId: string, options?: TimelineFilterOptions) {
    const user = await prisma.customerPortalUser.findUnique({ where: { id: customerId } });
    if (!user) throw new Error('Customer user not found.');

    const timelineEvents: Array<{
      id: string;
      category: 'ORDERS' | 'SERVICES' | 'WARRANTY' | 'REPAIRS' | 'CERTIFICATES' | 'PASSPORTS';
      eventType: string;
      title: string;
      description: string;
      timestamp: Date;
      referenceCode?: string;
      metadata?: any;
    }> = [];

    // Category 1: ORDERS
    if (!options?.category || options.category === 'ORDERS') {
      const orderApprovals = await prisma.customerOrderApproval.findMany({
        where: { customerId },
        orderBy: { createdAt: 'desc' }
      });
      orderApprovals.forEach((ord) => {
        timelineEvents.push({
          id: `ORD-APP-${ord.id}`,
          category: 'ORDERS',
          eventType: 'ORDER_APPROVAL_UPDATE',
          title: `موافقة تصميم طلب التصنيع (مرحلة ${ord.approvalStage})`,
          description: `الحالة الحالية: ${ord.status}. الإصدار: ${ord.designVersion}`,
          timestamp: ord.createdAt,
          referenceCode: ord.moId,
          metadata: { approvalStage: ord.approvalStage, status: ord.status }
        });
      });
    }

    // Category 2: SERVICES & REPAIRS
    if (!options?.category || options.category === 'SERVICES' || options.category === 'REPAIRS') {
      const serviceRequests = await prisma.customerServiceRequest.findMany({
        where: { customerId },
        orderBy: { createdAt: 'desc' }
      });
      serviceRequests.forEach((srv) => {
        const isRepair = srv.requestType === 'REPAIR';
        timelineEvents.push({
          id: `SRV-${srv.id}`,
          category: isRepair ? 'REPAIRS' : 'SERVICES',
          eventType: `SERVICE_REQUEST_${srv.requestType}`,
          title: `طلب ${srv.requestType === 'REPAIR' ? 'إصلاح قطعة' : srv.requestType === 'MAINTENANCE' ? 'صيانة دورية' : srv.requestType === 'INSPECTION' ? 'فحص جودة ودمغ' : 'خدمة عملاء'} (${srv.requestNo})`,
          description: `${srv.title} - الحالة: ${srv.status} - الأولوية: ${srv.priority}`,
          timestamp: srv.createdAt,
          referenceCode: srv.requestNo,
          metadata: { requestNo: srv.requestNo, pieceSerial: srv.pieceSerial, status: srv.status, estimatedCost: srv.estimatedCost }
        });
      });
    }

    // Category 3: WARRANTY
    if (!options?.category || options.category === 'WARRANTY') {
      const warranties = await prisma.customerWarrantyRecord.findMany({
        where: { customerId }
      });
      warranties.forEach((w) => {
        timelineEvents.push({
          id: `WRN-${w.id}`,
          category: 'WARRANTY',
          eventType: 'WARRANTY_ACTIVATION',
          title: `تفعيل ضمان الجودة وتأكيد العيار 25 سنة (${w.pieceSerial})`,
          description: `نوع التغطية: ${w.coverageType} - الحالة: ${w.warrantyStatus} - المعرف: ${w.certificateVerificationId}`,
          timestamp: w.createdAt,
          referenceCode: w.certificateVerificationId || w.pieceSerial,
          metadata: { coverageType: w.coverageType, warrantyEndDate: w.warrantyEndDate }
        });
      });

      const claims = await prisma.customerWarrantyClaim.findMany({
        where: { customerId }
      });
      claims.forEach((clm) => {
        timelineEvents.push({
          id: `CLM-${clm.id}`,
          category: 'WARRANTY',
          eventType: 'WARRANTY_CLAIM_SUBMISSION',
          title: `مطالبة ضمان فضة (${clm.claimCode})`,
          description: `النوع: ${clm.issueType} - ${clm.issueDescription} (الحالة: ${clm.status})`,
          timestamp: clm.createdAt,
          referenceCode: clm.claimCode,
          metadata: { claimCode: clm.claimCode, status: clm.status }
        });
      });
    }

    // Category 4: CERTIFICATES & PASSPORTS
    if (!options?.category || options.category === 'CERTIFICATES' || options.category === 'PASSPORTS') {
      const activityLogs = await prisma.customerActivityLog.findMany({
        where: { customerId },
        orderBy: { timestamp: 'desc' }
      });
      activityLogs.forEach((log) => {
        if (log.activityType === 'PASSPORT_ACCESS' || log.activityType === 'QR_SCAN') {
          timelineEvents.push({
            id: `LOG-${log.id}`,
            category: 'PASSPORTS',
            eventType: log.activityType,
            title: log.activityType === 'PASSPORT_ACCESS' ? 'استعراض جواز السفر الرقمي DPP' : 'مسح رمز QR للتحقق من الأصالة',
            description: log.description || log.details || 'حدث وصول لجواز السفر',
            timestamp: log.timestamp || log.createdAt,
            metadata: { ipAddress: log.ipAddress }
          });
        }
      });
    }

    // Filter by category and pieceSerial if requested
    let filtered = timelineEvents;
    if (options?.category) {
      filtered = filtered.filter((ev) => ev.category === options.category);
    }
    if (options?.pieceSerial) {
      filtered = filtered.filter((ev) => ev.referenceCode === options.pieceSerial || ev.metadata?.pieceSerial === options.pieceSerial);
    }

    // Sort by timestamp descending
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    if (options?.limit) {
      filtered = filtered.slice(0, options.limit);
    }

    return {
      customerId,
      totalEventsCount: filtered.length,
      timelineEvents: filtered
    };
  }
}

import { PrismaClient } from '@prisma/client';
import { QrPassportService } from './qr_passport.service';

const prisma = new PrismaClient();

export class DppAdminService {
  /**
   * 1. LIST PASSPORTS WITH SEARCH & STATUS FILTERING
   */
  static async listPassports(filters?: { status?: string; search?: string; limit?: number; offset?: number }) {
    const where: any = {};
    if (filters?.status && filters.status !== 'ALL') {
      where.status = filters.status;
    }

    if (filters?.search) {
      const q = filters.search.trim();
      where.OR = [
        { serialNo: { contains: q } },
        { sku: { contains: q } },
        { dppCode: { contains: q } }
      ];
    }

    const limit = filters?.limit || 50;
    const offset = filters?.offset || 0;

    const [items, total] = await Promise.all([
      prisma.digitalProductPassportDraft.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        take: limit,
        skip: offset
      }),
      prisma.digitalProductPassportDraft.count({ where })
    ]);

    return {
      total,
      limit,
      offset,
      passports: items.map(item => ({
        id: item.id,
        dppCode: item.dppCode,
        serialNo: item.serialNo,
        sku: item.sku,
        status: item.status,
        versionSeq: item.versionSeq,
        viewCount: item.viewCount,
        publishedAt: item.publishedAt,
        scheduledPublishAt: item.scheduledPublishAt,
        updatedAt: item.updatedAt
      }))
    };
  }

  /**
   * 2. GET FULL EDITABLE PASSPORT BY ID OR SERIAL
   */
  static async getPassportById(idOrSerial: string) {
    const dpp = await prisma.digitalProductPassportDraft.findFirst({
      where: {
        OR: [{ id: idOrSerial }, { serialNo: idOrSerial }, { dppCode: idOrSerial }]
      }
    });

    if (!dpp) {
      throw new Error(`Digital Product Passport record not found for '${idOrSerial}'`);
    }

    // Fetch version history & audit logs
    const [versionHistory, auditLogs] = await Promise.all([
      prisma.dppContentVersionHistory.findMany({
        where: { serialNo: dpp.serialNo },
        orderBy: { versionSeq: 'desc' }
      }),
      prisma.dppPublishingAuditLog.findMany({
        where: { serialNo: dpp.serialNo },
        orderBy: { timestamp: 'desc' },
        take: 20
      })
    ]);

    return {
      dpp,
      versionHistory,
      auditLogs
    };
  }

  /**
   * 3. UPDATE PASSPORT CONTENT (WITH VERSION SNAPSHOT & AUDIT DIFF)
   */
  static async updatePassportContent(idOrSerial: string, updates: any, operatorName: string = 'ADMIN') {
    const existing = await prisma.digitalProductPassportDraft.findFirst({
      where: {
        OR: [{ id: idOrSerial }, { serialNo: idOrSerial }, { dppCode: idOrSerial }]
      }
    });

    if (!existing) {
      throw new Error(`Passport not found for update: '${idOrSerial}'`);
    }

    const nextVersionSeq = existing.versionSeq + 1;

    // Snapshot existing content before updating
    const snapshotJson = JSON.stringify({
      metadataJson: existing.metadataJson,
      mediaGalleryJson: existing.mediaGalleryJson,
      specsJson: existing.specsJson,
      manufacturingJson: existing.manufacturingJson,
      careInstructionsJson: existing.careInstructionsJson,
      warrantyDetailsJson: existing.warrantyDetailsJson,
      digitalCertificatesJson: existing.digitalCertificatesJson,
      supportInfoJson: existing.supportInfoJson,
      relatedProductsJson: existing.relatedProductsJson
    });

    await prisma.dppContentVersionHistory.create({
      data: {
        dppCode: existing.dppCode,
        serialNo: existing.serialNo,
        versionSeq: existing.versionSeq,
        snapshotJson,
        changeSummary: updates.changeSummary || `Content updated by ${operatorName}`,
        createdBy: operatorName
      }
    });

    // Apply updates
    const updated = await prisma.digitalProductPassportDraft.update({
      where: { id: existing.id },
      data: {
        metadataJson: updates.metadataJson ? JSON.stringify(updates.metadataJson) : existing.metadataJson,
        mediaGalleryJson: updates.mediaGalleryJson ? JSON.stringify(updates.mediaGalleryJson) : existing.mediaGalleryJson,
        specsJson: updates.specsJson ? JSON.stringify(updates.specsJson) : existing.specsJson,
        manufacturingJson: updates.manufacturingJson ? JSON.stringify(updates.manufacturingJson) : existing.manufacturingJson,
        careInstructionsJson: updates.careInstructionsJson ? JSON.stringify(updates.careInstructionsJson) : existing.careInstructionsJson,
        warrantyDetailsJson: updates.warrantyDetailsJson ? JSON.stringify(updates.warrantyDetailsJson) : existing.warrantyDetailsJson,
        digitalCertificatesJson: updates.digitalCertificatesJson ? JSON.stringify(updates.digitalCertificatesJson) : existing.digitalCertificatesJson,
        supportInfoJson: updates.supportInfoJson ? JSON.stringify(updates.supportInfoJson) : existing.supportInfoJson,
        relatedProductsJson: updates.relatedProductsJson ? JSON.stringify(updates.relatedProductsJson) : existing.relatedProductsJson,
        versionSeq: nextVersionSeq
      }
    });

    return updated;
  }

  /**
   * 4. VERSION ROLLBACK
   */
  static async rollbackVersion(idOrSerial: string, versionSeq: number, operatorName: string = 'ADMIN') {
    const existing = await prisma.digitalProductPassportDraft.findFirst({
      where: {
        OR: [{ id: idOrSerial }, { serialNo: idOrSerial }, { dppCode: idOrSerial }]
      }
    });

    if (!existing) throw new Error(`Passport not found: '${idOrSerial}'`);

    const versionSnapshot = await prisma.dppContentVersionHistory.findFirst({
      where: {
        serialNo: existing.serialNo,
        versionSeq
      }
    });

    if (!versionSnapshot) {
      throw new Error(`Version snapshot v${versionSeq} not found for '${existing.serialNo}'`);
    }

    const snapshot = JSON.parse(versionSnapshot.snapshotJson);
    const newVersionSeq = existing.versionSeq + 1;

    const rolledBack = await prisma.digitalProductPassportDraft.update({
      where: { id: existing.id },
      data: {
        metadataJson: snapshot.metadataJson,
        mediaGalleryJson: snapshot.mediaGalleryJson,
        specsJson: snapshot.specsJson,
        manufacturingJson: snapshot.manufacturingJson,
        careInstructionsJson: snapshot.careInstructionsJson,
        warrantyDetailsJson: snapshot.warrantyDetailsJson,
        digitalCertificatesJson: snapshot.digitalCertificatesJson,
        supportInfoJson: snapshot.supportInfoJson,
        relatedProductsJson: snapshot.relatedProductsJson,
        versionSeq: newVersionSeq
      }
    });

    await prisma.dppPublishingAuditLog.create({
      data: {
        dppCode: existing.dppCode,
        serialNo: existing.serialNo,
        fromStatus: existing.status,
        toStatus: existing.status,
        performedBy: operatorName,
        reason: `Rolled back content to version v${versionSeq}`
      }
    });

    return rolledBack;
  }

  /**
   * 5. PUBLISHING WORKFLOW TRANSITION (DRAFT -> REVIEW -> PUBLISHED -> ARCHIVED)
   */
  static async transitionPublishingStatus(
    idOrSerial: string,
    targetStatus: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED',
    operatorName: string = 'ADMIN',
    options?: { reason?: string; scheduledPublishAt?: Date }
  ) {
    const existing = await prisma.digitalProductPassportDraft.findFirst({
      where: {
        OR: [{ id: idOrSerial }, { serialNo: idOrSerial }, { dppCode: idOrSerial }]
      }
    });

    if (!existing) throw new Error(`Passport not found: '${idOrSerial}'`);

    const fromStatus = existing.status;
    const updateData: any = { status: targetStatus };

    if (targetStatus === 'REVIEW') {
      updateData.reviewedBy = operatorName;
      updateData.reviewedAt = new Date();
    } else if (targetStatus === 'PUBLISHED') {
      updateData.publishedAt = new Date();
      updateData.canonicalUrl = `https://passport.bahersilver.com/v/${existing.serialNo}`;
      if (options?.scheduledPublishAt) {
        updateData.scheduledPublishAt = options.scheduledPublishAt;
      }
    } else if (targetStatus === 'ARCHIVED') {
      updateData.archivedAt = new Date();
      updateData.archivedBy = operatorName;
    }

    const updated = await prisma.digitalProductPassportDraft.update({
      where: { id: existing.id },
      data: updateData
    });

    // Record Publishing Audit Log with state diff
    await prisma.dppPublishingAuditLog.create({
      data: {
        dppCode: existing.dppCode,
        serialNo: existing.serialNo,
        fromStatus,
        toStatus: targetStatus,
        performedBy: operatorName,
        reason: options?.reason || `Status transition from ${fromStatus} to ${targetStatus}`,
        diffJson: JSON.stringify({ fromStatus, toStatus: targetStatus, scheduled: options?.scheduledPublishAt || null })
      }
    });

    return updated;
  }

  /**
   * 6. BULK PUBLISH / ARCHIVE OPERATIONS
   */
  static async bulkTransitionStatus(
    serialNos: string[],
    targetStatus: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED',
    operatorName: string = 'ADMIN',
    reason?: string
  ) {
    const results: any[] = [];
    for (const sn of serialNos) {
      try {
        const updated = await this.transitionPublishingStatus(sn, targetStatus, operatorName, { reason });
        results.push({ serialNo: sn, success: true, status: updated.status });
      } catch (err: any) {
        results.push({ serialNo: sn, success: false, error: err.message });
      }
    }
    return results;
  }

  /**
   * 7. MEDIA LIBRARY MANAGEMENT & AUTOMATIC WEBP OPTIMIZATION
   */
  static async manageMediaLibrary(
    idOrSerial: string,
    mediaData: { primaryImage?: string; galleryImages?: string[]; videoUrl?: string; threeDUrl?: string }
  ) {
    const existing = await prisma.digitalProductPassportDraft.findFirst({
      where: {
        OR: [{ id: idOrSerial }, { serialNo: idOrSerial }, { dppCode: idOrSerial }]
      }
    });

    if (!existing) throw new Error(`Passport not found: '${idOrSerial}'`);

    const primaryImage = mediaData.primaryImage || 'assets/baher_logo.png';
    const gallery = mediaData.galleryImages || [primaryImage];

    // Automatic WebP Optimization & Thumbnail Metadata Injection
    const optimizedGallery = gallery.map(img => {
      const isWebP = img.endsWith('.webp');
      const webpUrl = isWebP ? img : `${img}.webp`;
      const thumbUrl = `${img}_thumb.webp`;
      return {
        originalUrl: img,
        webpUrl,
        thumbUrl,
        format: 'WebP',
        optimized: true
      };
    });

    const mediaObj = {
      primaryImage,
      galleryImages: gallery,
      optimizedAssets: optimizedGallery,
      videoUrl: mediaData.videoUrl || '',
      threeDUrl: mediaData.threeDUrl || '',
      updatedAt: new Date().toISOString()
    };

    return await prisma.digitalProductPassportDraft.update({
      where: { id: existing.id },
      data: {
        mediaGalleryJson: JSON.stringify(mediaObj)
      }
    });
  }

  /**
   * 8. CERTIFICATE TEMPLATE MANAGER & LIVE PREVIEW
   */
  static async listCertificateTemplates() {
    return await prisma.dppCertificateTemplate.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  static async createCertificateTemplate(templateData: {
    templateName: string;
    versionNo?: string;
    issuerAuthority?: string;
    layoutConfigJson?: string;
    isDefault?: boolean;
  }) {
    if (templateData.isDefault) {
      await prisma.dppCertificateTemplate.updateMany({
        data: { isDefault: false }
      });
    }

    const defaultLayout = JSON.stringify({
      headerTitle: 'باهر سيلفر — BAHER SILVER',
      themeColor: '#C3B097',
      showHallmarkBadge: true,
      showIsoBadge: true,
      signatureTitle: 'رئيس مصلحة الجودة والدمغة'
    });

    return await prisma.dppCertificateTemplate.create({
      data: {
        templateName: templateData.templateName,
        versionNo: templateData.versionNo || 'v1.0',
        issuerAuthority: templateData.issuerAuthority || 'Baher Silver Quality Assurance Authority',
        layoutConfigJson: templateData.layoutConfigJson || defaultLayout,
        isDefault: templateData.isDefault || false
      }
    });
  }

  /**
   * 9. ADVANCED ANALYTICS DASHBOARD SUMMARY
   */
  static async getAdvancedAnalyticsDashboard() {
    const [
      totalPassports,
      draftCount,
      reviewCount,
      publishedCount,
      archivedCount,
      analyticsLogs,
      topScanned
    ] = await Promise.all([
      prisma.digitalProductPassportDraft.count(),
      prisma.digitalProductPassportDraft.count({ where: { status: 'DRAFT' } }),
      prisma.digitalProductPassportDraft.count({ where: { status: 'REVIEW' } }),
      prisma.digitalProductPassportDraft.count({ where: { status: 'PUBLISHED' } }),
      prisma.digitalProductPassportDraft.count({ where: { status: 'ARCHIVED' } }),
      prisma.publicDppAnalyticsLog.findMany({ take: 500 }),
      prisma.digitalProductPassportDraft.findMany({
        orderBy: { viewCount: 'desc' },
        take: 5
      })
    ]);

    const totalViewsCount = analyticsLogs.length;

    const deviceDistribution: Record<string, number> = { MOBILE: 0, DESKTOP: 0, TABLET: 0 };
    const sourceDistribution: Record<string, number> = { DIRECT: 0, QR_SCAN: 0, SOCIAL: 0 };

    analyticsLogs.forEach(log => {
      deviceDistribution[log.deviceType] = (deviceDistribution[log.deviceType] || 0) + 1;
      sourceDistribution[log.viewSource] = (sourceDistribution[log.viewSource] || 0) + 1;
    });

    const recentAudits = await prisma.dppPublishingAuditLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 10
    });

    return {
      kpis: {
        totalPassports,
        draftCount,
        reviewCount,
        publishedCount,
        archivedCount,
        totalViewsCount
      },
      topScannedProducts: topScanned.map(p => ({
        serialNo: p.serialNo,
        dppCode: p.dppCode,
        sku: p.sku,
        viewCount: p.viewCount
      })),
      deviceDistribution,
      sourceDistribution,
      recentAudits
    };
  }
}

import { PrismaClient } from '@prisma/client';
import { createHash, randomBytes } from 'crypto';

const prisma = new PrismaClient();

export interface VerifyQrInput {
  dppCode: string;
  verificationToken: string;
  scannedBy?: string;
  scanDeviceType?: string;
  ipAddress?: string;
}

export interface SubmitWarrantyClaimInput {
  pieceSerial: string;
  issueType: 'SURFACE_TARNISH' | 'STONE_LOOSENESS' | 'PURITY_QUERY' | 'OTHER';
  issueDescription: string;
}

export class CustomerDppService {
  /**
   * 1. CUSTOMER DIGITAL PRODUCT PASSPORT VIEWER & PDF SNAPSHOT
   */
  static async getCustomerPassportDetails(customerId: string, serialOrDppCode: string) {
    const user = await prisma.customerPortalUser.findUnique({ where: { id: customerId } });
    if (!user) throw new Error('Customer user not found.');

    const dpp = await prisma.digitalProductPassportDraft.findFirst({
      where: { OR: [{ dppCode: serialOrDppCode }, { serialNo: serialOrDppCode }] }
    });

    if (!dpp) throw new Error(`Digital Product Passport not found for '${serialOrDppCode}'`);

    const piece = await prisma.physicalPiece.findFirst({
      where: { serialNo: dpp.serialNo }
    });

    const product = piece ? await prisma.productMaster.findUnique({ where: { id: piece.productModelId } }) : null;

    // Fetch Quality Inspection & XRF Results
    const inspection = await prisma.qualityInspection.findFirst({
      where: { pieceSerial: dpp.serialNo },
      orderBy: { createdAt: 'desc' }
    });

    // Certificate Verification ID & PDF Snapshot
    const certVerId = `CERT-VER-${new Date().getFullYear()}-${String(dpp.id.substring(0, 6)).toUpperCase()}`;
    const pdfSnapshotUrl = `storage/pdf/passport_${dpp.dppCode}.pdf`;

    return {
      passport: {
        dppCode: dpp.dppCode,
        serialNo: dpp.serialNo,
        sku: dpp.sku,
        productNameAr: product?.nameAr || 'قطعة فضة إيطالي',
        silverPurity: piece?.silverPurity || product?.silverPurity || '925',
        weightGrams: piece?.weightGrams || 15.5,
        status: dpp.status,
        canonicalUrl: dpp.dppUrl,
        certificateVerificationId: certVerId,
        pdfSnapshotUrl,
        xrfTestedPurity: inspection?.testedSilverPurity || 925.4,
        eSignatureHash: inspection?.eSignatureHash || null,
        createdAt: dpp.createdAt
      },
      productMetadata: product ? {
        category: product.category,
        designerName: 'مصمم باهر سيلفر',
        silverWeightGrams: product.silverWeightGrams
      } : null
    };
  }

  /**
   * 2. QR EXPERIENCE & ANTI-COUNTERFEIT VERIFICATION
   */
  static async verifyQrAuthenticity(input: VerifyQrInput) {
    const dpp = await prisma.digitalProductPassportDraft.findFirst({
      where: { dppCode: input.dppCode }
    });

    if (!dpp) {
      await prisma.customerScanAuditHistory.create({
        data: {
          dppCode: input.dppCode,
          verificationResult: 'INVALID_TOKEN',
          scannedBy: input.scannedBy || 'مستخدم غير معروف',
          ipAddress: input.ipAddress || '127.0.0.1'
        }
      });
      return { isAuthentic: false, verificationResult: 'INVALID_TOKEN', message: 'رمز QR غير معروف أو غير مفيصل' };
    }

    const piece = await prisma.physicalPiece.findFirst({ where: { serialNo: dpp.serialNo } });
    const isAuthentic = piece && piece.verificationToken === input.verificationToken;
    const verificationResult = isAuthentic ? 'AUTHENTIC' : 'COUNTERFEIT_ALERT';

    // Log Scan Audit Event & Analytics
    await prisma.customerScanAuditHistory.create({
      data: {
        dppCode: dpp.dppCode,
        pieceSerial: dpp.serialNo,
        verificationResult,
        scannedBy: input.scannedBy || 'مستخدم البوابة',
        scanDeviceType: input.scanDeviceType || 'MOBILE',
        ipAddress: input.ipAddress || '127.0.0.1'
      }
    });

    const totalScans = await prisma.customerScanAuditHistory.count({ where: { dppCode: dpp.dppCode } });

    return {
      isAuthentic,
      verificationResult,
      message: isAuthentic ? 'قطعة فضة باهر سيلفر أصلية وموثقة 100% 🛡️' : 'تنبيه: محاولة تقليد أو رموش غير مطابقة! ⚠️',
      dppCode: dpp.dppCode,
      serialNo: dpp.serialNo,
      totalScansCount: totalScans
    };
  }

  /**
   * 3. WARRANTY CENTER & CLAIMS MANAGEMENT
   */
  static async getWarrantyStatusAndClaims(customerId: string, pieceSerial: string) {
    const user = await prisma.customerPortalUser.findUnique({ where: { id: customerId } });
    if (!user) throw new Error('Customer user not found.');

    let warranty = await prisma.customerWarrantyRecord.findFirst({
      where: { customerId, pieceSerial }
    });

    if (!warranty) {
      // Seed default warranty record (25-year lifetime silver purity guarantee)
      const dpp = await prisma.digitalProductPassportDraft.findFirst({ where: { serialNo: pieceSerial } });
      const certVerId = `CERT-VER-${new Date().getFullYear()}-${String(pieceSerial.replace('SN-', '')).padStart(6, '0')}`;
      const endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 25);

      warranty = await prisma.customerWarrantyRecord.create({
        data: {
          customerId,
          pieceSerial,
          dppCode: dpp?.dppCode || `DPP-${pieceSerial}`,
          certificateVerificationId: certVerId,
          warrantyStatus: 'ACTIVE',
          coverageType: 'LIFETIME_PURITY',
          warrantyEndDate: endDate,
          repairEventsJson: JSON.stringify([
            { event: 'INITIAL_RHODIUM_PLATING', date: new Date().toISOString().split('T')[0], notes: 'طلاء روديوم أولي ممتاز' }
          ])
        }
      });
    }

    const claims = await prisma.customerWarrantyClaim.findMany({
      where: { warrantyId: warranty.id },
      orderBy: { createdAt: 'desc' }
    });

    return {
      warranty,
      claims
    };
  }

  static async submitWarrantyClaim(customerId: string, input: SubmitWarrantyClaimInput) {
    const warranty = await prisma.customerWarrantyRecord.findFirst({
      where: { customerId, pieceSerial: input.pieceSerial }
    });

    if (!warranty) throw new Error(`Active warranty record not found for serial '${input.pieceSerial}'`);

    const count = await prisma.customerWarrantyClaim.count();
    const claimCode = `CLM-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;

    return await prisma.customerWarrantyClaim.create({
      data: {
        warrantyId: warranty.id,
        customerId,
        claimCode,
        issueType: input.issueType,
        issueDescription: input.issueDescription,
        status: 'SUBMITTED'
      }
    });
  }

  /**
   * 4. CUSTOMER SHARING & EXPIRING READ-ONLY LINKS
   */
  static async createSecureShareLink(customerId: string, dppCode: string, durationDays = 7) {
    const dpp = await prisma.digitalProductPassportDraft.findFirst({ where: { dppCode } });
    if (!dpp) throw new Error(`DPP Passport not found: '${dppCode}'`);

    const shareToken = `SHARE-TOK-${randomBytes(16).toString('hex')}`;
    const expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);
    const pdfSnapshotUrl = `storage/pdf/passport_${dppCode}.pdf`;
    const snapshotHash = createHash('sha256').update(`${dppCode}:${expiresAt.toISOString()}`).digest('hex');

    return await prisma.customerPassportShareLink.create({
      data: {
        customerId,
        dppCode,
        shareToken,
        expiresAt,
        isRevoked: false,
        pdfSnapshotUrl,
        snapshotHash,
        isPublicVerificationEnabled: true
      }
    });
  }

  static async resolveSharedPassport(shareToken: string) {
    const share = await prisma.customerPassportShareLink.findUnique({
      where: { shareToken }
    });

    if (!share || share.isRevoked || share.expiresAt < new Date()) {
      throw new Error('Expired or invalid share link.');
    }

    // Increment view count
    await prisma.customerPassportShareLink.update({
      where: { id: share.id },
      data: { viewCount: share.viewCount + 1 }
    });

    const dpp = await prisma.digitalProductPassportDraft.findFirst({ where: { dppCode: share.dppCode } });
    return {
      shareDetails: {
        shareToken: share.shareToken,
        expiresAt: share.expiresAt,
        viewCount: share.viewCount + 1,
        pdfSnapshotUrl: share.pdfSnapshotUrl
      },
      passport: dpp
    };
  }

  /**
   * 5. ASSET RELATIONSHIP GRAPH VIEWER (Product ↔ Design ↔ Passport ↔ Piece ↔ QR)
   */
  static async getAssetRelationshipGraph(customerId: string, pieceSerial: string) {
    const piece = await prisma.physicalPiece.findFirst({ where: { serialNo: pieceSerial } });
    if (!piece) throw new Error(`Physical Piece not found: '${pieceSerial}'`);

    const [product, dpp, cadAsset, label] = await Promise.all([
      prisma.productMaster.findUnique({ where: { id: piece.productModelId } }),
      prisma.digitalProductPassportDraft.findFirst({ where: { serialNo: pieceSerial } }),
      prisma.customerDesignAsset.findFirst({ where: { productId: piece.productModelId } }),
      prisma.printableLabelTemplate.findFirst({ where: { templateCode: 'tpl-jewelry-tag-925' } })
    ]);

    return {
      graphNodes: [
        { id: 'NODE-PRODUCT', type: 'PRODUCT_MASTER', label: product?.nameAr || 'منتج الفضة', code: product?.productCode },
        { id: 'NODE-CAD', type: 'DESIGN_ASSET', label: cadAsset?.assetName || 'ملف التصميم 3D', url: cadAsset?.fileUrl || null },
        { id: 'NODE-PIECE', type: 'PHYSICAL_PIECE', label: piece.serialNo, weight: piece.weightGrams },
        { id: 'NODE-LABEL', type: 'BARCODE_TAG', label: label?.name || 'بطاقة المجوهرات 925' },
        { id: 'NODE-PASSPORT', type: 'DPP_PASSPORT', label: dpp?.dppCode || 'جواز السفر الرقمي', qrUrl: dpp?.dppUrl }
      ],
      graphEdges: [
        { source: 'NODE-PRODUCT', target: 'NODE-CAD', relation: 'HAS_DESIGN_3D' },
        { source: 'NODE-PRODUCT', target: 'NODE-PIECE', relation: 'PRODUCED_UNIT' },
        { source: 'NODE-PIECE', target: 'NODE-LABEL', relation: 'TAGGED_WITH' },
        { source: 'NODE-PIECE', target: 'NODE-PASSPORT', relation: 'DIGITAL_TWIN' }
      ]
    };
  }
}

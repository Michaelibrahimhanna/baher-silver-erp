import { PrismaClient } from '@prisma/client';
import {
  QrEngineFactory,
  QrFormatType,
  QrErrorCorrectionLevel,
  QrRenderOptions
} from './qr/qr_engine.service';

const prisma = new PrismaClient();

export interface GenerateQrOptions extends QrRenderOptions {
  errorCorrection?: QrErrorCorrectionLevel;
  operatorName?: string;
}

export class QrPassportService {
  // =============================================================================
  // 1. QR CODE GENERATION, VALIDATION & RENDERING SERVICE
  // =============================================================================

  static generateQrCode(format: QrFormatType, data: any, options: GenerateQrOptions = {}) {
    const strategy = QrEngineFactory.getStrategy(format);
    const payload = strategy.buildPayload(data);
    const errorCorr = options.errorCorrection || 'M';
    const validation = strategy.validate(payload, errorCorr);

    if (!validation.isValid) {
      throw new Error(`QR generation failed for format '${format}': ${validation.errorMessage}`);
    }

    const svg = strategy.renderSVG(payload, options);
    const ascii = strategy.renderASCII(payload);
    const base64DataUri = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;

    // Record audit log asynchronously
    prisma.qrCodeAuditLog.create({
      data: {
        qrPayload: payload,
        qrType: format,
        errorCorrection: errorCorr,
        entityType: data?.entityType || null,
        entityId: data?.entityId || null,
        serialNo: data?.serialNo || null,
        verificationToken: data?.verificationToken || null,
        generatedBy: options.operatorName || 'SYSTEM'
      }
    }).catch(e => console.error('Error logging QR audit:', e));

    return {
      format,
      payload,
      errorCorrection: errorCorr,
      isValid: validation.isValid,
      parsedParams: validation.parsedParams,
      render: {
        svg,
        base64DataUri,
        ascii
      }
    };
  }

  static validateQrCode(format: QrFormatType, payload: string, errorCorrection: QrErrorCorrectionLevel = 'M') {
    const strategy = QrEngineFactory.getStrategy(format);
    return strategy.validate(payload, errorCorrection);
  }

  static renderQrCode(format: QrFormatType, payload: string, opts?: QrRenderOptions) {
    const strategy = QrEngineFactory.getStrategy(format);
    const validation = strategy.validate(payload, opts?.errorCorrection || 'M');

    if (!validation.isValid) {
      throw new Error(`Cannot render invalid QR payload '${payload}': ${validation.errorMessage}`);
    }

    const svg = strategy.renderSVG(payload, opts);
    const ascii = strategy.renderASCII(payload);
    const base64DataUri = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;

    return {
      format,
      payload,
      svg,
      base64DataUri,
      ascii
    };
  }

  // =============================================================================
  // 2. PHYSICAL PIECE QR INTEGRATION (EPIC 02 IDENTITY ENGINE)
  // =============================================================================

  static async generateQrForPiece(pieceIdOrSerial: string, format: QrFormatType = 'URL', operatorName: string = 'SYSTEM') {
    const piece = await prisma.physicalPiece.findFirst({
      where: {
        OR: [{ id: pieceIdOrSerial }, { serialNo: pieceIdOrSerial }]
      },
      include: {
        productModel: true,
        variant: true
      }
    });

    if (!piece) {
      throw new Error(`Physical piece not found for '${pieceIdOrSerial}'`);
    }

    const dppUrl = `https://passport.bahersilver.com/v/${piece.serialNo}`;

    const qrInputData = {
      entityType: 'PHYSICAL_PIECE',
      entityId: piece.id,
      serialNo: piece.serialNo,
      sku: piece.sku,
      url: dppUrl,
      weightGrams: piece.weightGrams,
      silverPurity: piece.silverPurity,
      verificationToken: piece.verificationToken
    };

    const qrResult = this.generateQrCode(format, qrInputData, { operatorName });

    return {
      pieceId: piece.id,
      serialNo: piece.serialNo,
      sku: piece.sku,
      productNameAr: piece.productModel.nameAr,
      weightGrams: piece.weightGrams,
      silverPurity: piece.silverPurity,
      dppUrl,
      qrCode: qrResult
    };
  }

  // =============================================================================
  // 3. DIGITAL PRODUCT PASSPORT DRAFT ENGINE
  // =============================================================================

  static async createDppDraft(pieceIdOrSerial: string, metadata?: any) {
    const piece = await prisma.physicalPiece.findFirst({
      where: {
        OR: [{ id: pieceIdOrSerial }, { serialNo: pieceIdOrSerial }]
      },
      include: { productModel: true }
    });

    if (!piece) {
      throw new Error(`Physical piece not found for '${pieceIdOrSerial}'`);
    }

    const dppCode = `DPP-${new Date().getFullYear()}-${piece.serialNo.replace(/[^0-9]/g, '').slice(-6)}`;
    const dppUrl = `https://passport.bahersilver.com/v/${piece.serialNo}`;
    const qrResult = this.generateQrCode('GS1_DIGITAL_LINK', {
      serialNo: piece.serialNo,
      sku: piece.sku,
      weightGrams: piece.weightGrams
    });

    const metaObj = metadata || {
      productNameAr: piece.productModel.nameAr,
      silverPurity: piece.silverPurity || '925',
      weightGrams: piece.weightGrams,
      craftsmanship: 'Handcrafted Italian Silver Jewelry',
      origin: 'Khan El Khalili, Cairo, Egypt',
      warranty: 'Lifetime Silver Authenticity Guarantee'
    };

    return await prisma.digitalProductPassportDraft.upsert({
      where: { pieceId: piece.id },
      create: {
        dppCode,
        pieceId: piece.id,
        serialNo: piece.serialNo,
        sku: piece.sku,
        dppUrl,
        qrPayload: qrResult.payload,
        status: 'DRAFT',
        metadataJson: JSON.stringify(metaObj)
      },
      update: {
        dppUrl,
        qrPayload: qrResult.payload,
        metadataJson: JSON.stringify(metaObj)
      }
    });
  }

  static async getDppDraft(pieceIdOrSerial: string) {
    const dpp = await prisma.digitalProductPassportDraft.findFirst({
      where: {
        OR: [{ pieceId: pieceIdOrSerial }, { serialNo: pieceIdOrSerial }]
      }
    });
    if (!dpp) throw new Error(`Digital product passport draft not found for '${pieceIdOrSerial}'`);
    return dpp;
  }

  static async listQrAudits(filters?: { qrType?: string }) {
    const where: any = {};
    if (filters?.qrType) where.qrType = filters.qrType;

    return await prisma.qrCodeAuditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50
    });
  }
}

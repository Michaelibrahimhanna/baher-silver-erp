import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { NumberingEngineService } from './numbering_engine.service';

const prisma = new PrismaClient();

export const ALLOWED_PIECE_STATUSES = [
  'DRAFT',
  'PENDING_WEIGHT',
  'ACTIVE',
  'RESERVED',
  'SOLD',
  'REPAIR',
  'MELTED',
  'VOID'
] as const;

export type PieceStatus = typeof ALLOWED_PIECE_STATUSES[number];

export class IdentityPlatformService {
  /**
   * 1. Product Model Creation
   */
  static async createProductModel(data: {
    productCode?: string;
    nameAr: string;
    nameEn?: string;
    category?: string;
    silverPurity?: string;
    silverWeightGrams?: number;
    stoneCount?: number;
    manufacturingNotes?: string;
  }) {
    const categoryCode = (data.category || 'RNG').toUpperCase().slice(0, 3);
    const skuCode = data.productCode || (await this.generateImmutableSKU(categoryCode));

    return prisma.productMaster.create({
      data: {
        productCode: skuCode,
        nameAr: data.nameAr,
        nameEn: data.nameEn || data.nameAr,
        category: data.category || 'خاتم',
        silverPurity: data.silverPurity || '925',
        silverWeightGrams: Number(data.silverWeightGrams || 0),
        stoneCount: Number(data.stoneCount || 0),
        manufacturingNotes: data.manufacturingNotes || null
      }
    });
  }

  static async listProductModels() {
    return prisma.productMaster.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * 4. Immutable Short SKU Generator
   */
  static async generateImmutableSKU(categoryCode: string = 'RNG'): Promise<string> {
    const prefix = `BS-${categoryCode.toUpperCase()}`;
    return NumberingEngineService.generateNextNumber(`SKU_${prefix}`, {
      prefix,
      nameAr: `رمز SKU - ${categoryCode}`,
      scope: 'GLOBAL',
      paddingLength: 5,
      resetPolicy: 'NEVER',
      templateFormat: '{PREFIX}-{SEQ}'
    });
  }

  /**
   * 5. Piece Serial Generator
   */
  static async generatePieceSerial(): Promise<string> {
    return NumberingEngineService.generateNextNumber('PIECE_SERIAL', {
      prefix: 'SN',
      nameAr: 'الرقم التسلسلي للقطعة الفيزيائية',
      scope: 'GLOBAL',
      paddingLength: 6,
      resetPolicy: 'YEARLY',
      templateFormat: '{PREFIX}-{YEAR}-{SEQ}'
    });
  }

  /**
   * 7. Identity Creation Policy
   */
  static async createPhysicalPiece(data: {
    productModelId: string;
    variantId?: string;
    weightGrams?: number;
    silverPurity?: string;
    initialStatus?: PieceStatus;
    branchId?: string;
    warehouseId?: string;
    notes?: string;
  }) {
    const productModel = await prisma.productMaster.findUnique({
      where: { id: data.productModelId }
    });
    if (!productModel) throw new Error('Product Model not found');

    const serialNo = await this.generatePieceSerial();
    const sku = productModel.productCode; // Short immutable SKU from catalog model
    const pieceUuid = crypto.randomUUID();
    
    // Generate secure HMAC verification token for QR payload
    const tokenPayload = `${pieceUuid}:${serialNo}:${sku}:${Date.now()}`;
    const verificationToken = crypto.createHmac('sha256', 'BAHER_SILVER_SECRET_KEY').update(tokenPayload).digest('hex').slice(0, 32);

    const weightGrams = Number(data.weightGrams || productModel.silverWeightGrams || 0);
    
    // Determine initial status based on Creation Policy
    let status: PieceStatus = data.initialStatus || 'DRAFT';
    if (!data.initialStatus) {
      status = weightGrams > 0 ? 'ACTIVE' : 'PENDING_WEIGHT';
    }

    return prisma.$transaction(async (tx) => {
      const piece = await tx.physicalPiece.create({
        data: {
          id: pieceUuid,
          serialNo,
          sku,
          productModelId: data.productModelId,
          variantId: data.variantId || null,
          weightGrams,
          silverPurity: data.silverPurity || productModel.silverPurity || '925',
          verificationToken,
          status,
          branchId: data.branchId || 'BRANCH-HQ',
          warehouseId: data.warehouseId || 'wh-finished',
          notes: data.notes || null
        }
      });

      // Log Creation Event
      await tx.pieceLifecycleEvent.create({
        data: {
          physicalPieceId: piece.id,
          previousStatus: null,
          newStatus: status,
          actionType: 'IDENTITY_CREATED',
          performedBy: 'نظام تكويد باهر سيلفر',
          notes: `تم إنشاء هوية القطعة (${serialNo}) برمز (${sku})`
        }
      });

      return piece;
    });
  }

  static async getPhysicalPieceById(idOrSerial: string) {
    return prisma.physicalPiece.findFirst({
      where: {
        OR: [{ id: idOrSerial }, { serialNo: idOrSerial }, { verificationToken: idOrSerial }]
      },
      include: {
        productModel: true,
        variant: true,
        reprintLogs: true,
        lifecycleEvents: { orderBy: { createdAt: 'desc' } }
      }
    });
  }

  static async listPhysicalPieces(filters: { status?: string; sku?: string; branchId?: string }) {
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.sku) where.sku = filters.sku;
    if (filters.branchId) where.branchId = filters.branchId;

    return prisma.physicalPiece.findMany({
      where,
      include: { productModel: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * 8. "Identity Never Changes" Policy Enforcement
   */
  static async updatePhysicalPiece(
    id: string,
    updateData: {
      serialNo?: string;
      sku?: string;
      verificationToken?: string;
      id?: string;
      weightGrams?: number;
      trayId?: string;
      notes?: string;
    }
  ) {
    const existing = await prisma.physicalPiece.findUnique({ where: { id } });
    if (!existing) throw new Error('Physical Piece not found');

    // Strict Immutability Guard: Reject modifications to core identity properties
    if (updateData.id && updateData.id !== existing.id) {
      throw new Error('IDENTITY_IMMUTABLE: Primary UUID cannot be modified after creation');
    }
    if (updateData.serialNo && updateData.serialNo !== existing.serialNo) {
      throw new Error('IDENTITY_IMMUTABLE: Serial Number (serialNo) is strictly immutable');
    }
    if (updateData.sku && updateData.sku !== existing.sku) {
      throw new Error('IDENTITY_IMMUTABLE: Stock Keeping Unit (sku) is strictly immutable');
    }
    if (updateData.verificationToken && updateData.verificationToken !== existing.verificationToken) {
      throw new Error('IDENTITY_IMMUTABLE: Verification Token is strictly immutable');
    }

    // Allowed updates for non-identity metadata (weight adjustment, notes, tray assignment)
    return prisma.physicalPiece.update({
      where: { id },
      data: {
        weightGrams: updateData.weightGrams !== undefined ? Number(updateData.weightGrams) : existing.weightGrams,
        trayId: updateData.trayId !== undefined ? updateData.trayId : existing.trayId,
        notes: updateData.notes !== undefined ? updateData.notes : existing.notes
      }
    });
  }

  /**
   * 9. Piece Status Lifecycle Transitions
   */
  static async transitionPieceStatus(
    id: string,
    newStatus: PieceStatus,
    performedBy: string = 'النظام',
    notes?: string
  ) {
    if (!ALLOWED_PIECE_STATUSES.includes(newStatus)) {
      throw new Error(`Invalid piece status: ${newStatus}. Allowed: ${ALLOWED_PIECE_STATUSES.join(', ')}`);
    }

    const existing = await prisma.physicalPiece.findUnique({ where: { id } });
    if (!existing) throw new Error('Physical Piece not found');

    if (existing.status === newStatus) return existing;

    return prisma.$transaction(async (tx) => {
      const updated = await tx.physicalPiece.update({
        where: { id },
        data: { status: newStatus }
      });

      await tx.pieceLifecycleEvent.create({
        data: {
          physicalPieceId: id,
          previousStatus: existing.status,
          newStatus,
          actionType: 'STATUS_CHANGE',
          performedBy,
          notes: notes || `تغيير حالة القطعة من ${existing.status} إلى ${newStatus}`
        }
      });

      return updated;
    });
  }

  /**
   * 10. Reprint Capability Without Creating New Identity
   */
  static async reprintTagIdentity(
    id: string,
    requestedBy: string = 'أمين المخزن',
    reason: string = 'استبدال بطاقة تالفة'
  ) {
    const existing = await prisma.physicalPiece.findUnique({ where: { id } });
    if (!existing) throw new Error('Physical Piece not found');

    return prisma.$transaction(async (tx) => {
      const nextReprintSeq = existing.reprintCount + 1;

      const updated = await tx.physicalPiece.update({
        where: { id },
        data: {
          reprintCount: nextReprintSeq,
          lastReprintAt: new Date()
        }
      });

      await tx.pieceReprintLog.create({
        data: {
          physicalPieceId: id,
          requestedBy,
          reason,
          reprintSeq: nextReprintSeq
        }
      });

      await tx.pieceLifecycleEvent.create({
        data: {
          physicalPieceId: id,
          previousStatus: existing.status,
          newStatus: existing.status,
          actionType: 'REPRINT',
          performedBy: requestedBy,
          notes: `إعادة طباعة بطاقة الهوية (المرة #${nextReprintSeq}) - السبب: ${reason}`
        }
      });

      return updated;
    });
  }
}

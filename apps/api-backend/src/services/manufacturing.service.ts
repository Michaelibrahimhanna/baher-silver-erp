import { PrismaClient } from '@prisma/client';
import { IdentityPlatformService } from './identity_platform.service';
import { LabelPrintingService } from './label_printing.service';
import { QrPassportService } from './qr_passport.service';
import { productionEventEmitter } from './manufacturing_events.service';

const prisma = new PrismaClient();

export interface CreateMoInput {
  productModelId: string;
  variantId?: string;
  plannedQuantity: number;
  priority?: string;
  targetDate?: string | Date;
  supervisorId?: string;
  supervisorName?: string;
  notes?: string;
}

export interface RecordOperationInput {
  workCenterId?: string;
  sequenceNo?: number;
  stage: string;
  quantityPassed: number;
  quantityScrapped?: number;
  scrapReason?: string;
  scrapWeightGrams?: number;
  estimatedMinutes?: number;
  actualMinutes?: number;
  operatorId?: string;
  operatorName?: string;
  notes?: string;
}

export class ManufacturingService {
  /**
   * 1. CREATE MANUFACTURING ORDER (MO)
   */
  static async createManufacturingOrder(data: CreateMoInput) {
    const product = await prisma.productMaster.findUnique({
      where: { id: data.productModelId }
    });

    if (!product) {
      throw new Error(`Product model not found for ID '${data.productModelId}'`);
    }

    const plannedQty = data.plannedQuantity > 0 ? data.plannedQuantity : 1;
    const estSilverWeight = (product.silverWeightGrams || 0.0) * plannedQty;

    // Central Number Generator for MO Code (MO-2026-XXXXXX)
    const year = new Date().getFullYear();
    const count = await prisma.manufacturingOrder.count();
    const seqStr = String(count + 1).padStart(6, '0');
    const moCode = `MO-${year}-${seqStr}`;

    const mo = await prisma.manufacturingOrder.create({
      data: {
        moCode,
        productModelId: product.id,
        variantId: data.variantId || null,
        plannedQuantity: plannedQty,
        completedQuantity: 0,
        scrappedQuantity: 0,
        targetSilverPurity: product.silverPurity || '925',
        estimatedSilverWeightGrams: estSilverWeight,
        actualSilverWeightGrams: 0.0,
        silverLossWeightGrams: 0.0,
        status: 'PLANNED',
        priority: data.priority || 'MEDIUM',
        targetDate: data.targetDate ? new Date(data.targetDate) : null,
        supervisorId: data.supervisorId || null,
        supervisorName: data.supervisorName || 'مشرف الإنتاج',
        notes: data.notes || null
      }
    });

    // Domain Event Emit
    productionEventEmitter.emitEvent({
      eventType: 'MO_CREATED',
      moId: mo.id,
      moCode: mo.moCode,
      payload: mo,
      timestamp: new Date().toISOString()
    });

    return mo;
  }

  /**
   * 2. MATERIAL RESERVATION FROM BOM LINES
   */
  static async reserveMaterialsForMo(moId: string) {
    const mo = await prisma.manufacturingOrder.findUnique({
      where: { id: moId }
    });

    if (!mo) throw new Error(`Manufacturing Order not found for ID '${moId}'`);

    const bom = await prisma.productBOM.findUnique({
      where: { productId: mo.productModelId },
      include: { lines: true }
    });

    const reservations: any[] = [];

    if (bom && bom.lines.length > 0) {
      for (const line of bom.lines) {
        const requiredQty = (line.quantity || 1.0) * mo.plannedQuantity;

        const reservation = await prisma.materialReservation.create({
          data: {
            moId: mo.id,
            lineType: line.lineType,
            itemId: line.itemId,
            itemCode: line.itemCode,
            itemName: line.itemName,
            requiredQuantity: requiredQty,
            reservedQuantity: requiredQty,
            consumedQuantity: 0.0,
            unitOfMeasure: line.unitOfMeasure || 'g',
            status: 'RESERVED'
          }
        });
        reservations.push(reservation);
      }
    } else {
      // Default reservation fallback for 925 Silver bullion
      const defaultQty = mo.estimatedSilverWeightGrams;
      const defaultRes = await prisma.materialReservation.create({
        data: {
          moId: mo.id,
          lineType: 'SILVER_BULLION',
          itemCode: 'SILVER-925-GRANULES',
          itemName: 'حبيبات فضة إيطالي عيار 925',
          requiredQuantity: defaultQty,
          reservedQuantity: defaultQty,
          consumedQuantity: 0.0,
          unitOfMeasure: 'g',
          status: 'RESERVED'
        }
      });
      reservations.push(defaultRes);
    }

    productionEventEmitter.emitEvent({
      eventType: 'MATERIALS_RESERVED',
      moId: mo.id,
      moCode: mo.moCode,
      payload: { count: reservations.length },
      timestamp: new Date().toISOString()
    });

    return reservations;
  }

  /**
   * 3. PRODUCTION WORKFLOW STATE MACHINE
   */
  static async transitionMoStatus(
    moId: string,
    targetStatus: 'PLANNED' | 'CONFIRMED' | 'IN_PROGRESS' | 'QUALITY_CHECK' | 'COMPLETED' | 'CLOSED' | 'CANCELLED',
    operatorName: string = 'SYSTEM'
  ) {
    const mo = await prisma.manufacturingOrder.findFirst({
      where: { OR: [{ id: moId }, { moCode: moId }] }
    });

    if (!mo) throw new Error(`Manufacturing Order not found: '${moId}'`);

    const updateData: any = { status: targetStatus };

    if (targetStatus === 'CONFIRMED') {
      updateData.startDate = new Date();
      // Auto-trigger material reservation
      await this.reserveMaterialsForMo(mo.id);
    } else if (targetStatus === 'IN_PROGRESS') {
      // Initialize Work Center Routing Queue Jobs (Sequence 10, 20, 30, 40...)
      await this.initializeWorkCenterQueue(mo.id, mo.productModelId);
    } else if (targetStatus === 'COMPLETED' || targetStatus === 'CLOSED') {
      updateData.completionDate = new Date();
    }

    const updated = await prisma.manufacturingOrder.update({
      where: { id: mo.id },
      data: updateData
    });

    productionEventEmitter.emitEvent({
      eventType: targetStatus === 'CONFIRMED' ? 'MO_CONFIRMED' : 'MO_CREATED',
      moId: mo.id,
      moCode: mo.moCode,
      payload: { fromStatus: mo.status, toStatus: targetStatus, operatorName },
      timestamp: new Date().toISOString()
    });

    return updated;
  }

  /**
   * 4. WORK CENTER QUEUE INITIALIZATION
   */
  private static async initializeWorkCenterQueue(moId: string, productId: string) {
    const routing = await prisma.routingTemplate.findUnique({
      where: { productId },
      include: { steps: { orderBy: { sequenceNo: 'asc' } } }
    });

    const workCenters = await prisma.workCenter.findMany({});
    const defaultWc = workCenters[0]?.id || 'WC-HQ-CASTING';

    if (routing && routing.steps.length > 0) {
      for (const step of routing.steps) {
        await prisma.workCenterQueueJob.create({
          data: {
            workCenterId: defaultWc,
            moId,
            sequenceNo: step.sequenceNo,
            operationStage: step.stage,
            status: 'QUEUED',
            estimatedMinutes: step.laborMinutes + step.machineMinutes
          }
        });
      }
    } else {
      // Default standard silver routing steps (Sequence 10, 20, 30, 40)
      const defaultSteps = [
        { seq: 10, stage: 'CASTING', mins: 45 },
        { seq: 20, stage: 'FILING_POLISHING', mins: 60 },
        { seq: 30, stage: 'STONE_SETTING', mins: 30 },
        { seq: 40, stage: 'RHODIUM_PLATING', mins: 25 },
        { seq: 50, stage: 'QUALITY_CONTROL', mins: 15 }
      ];

      for (const step of defaultSteps) {
        await prisma.workCenterQueueJob.create({
          data: {
            workCenterId: defaultWc,
            moId,
            sequenceNo: step.seq,
            operationStage: step.stage,
            status: 'QUEUED',
            estimatedMinutes: step.mins
          }
        });
      }
    }
  }

  /**
   * 5. RECORD WORK CENTER OPERATION LOG & SCRAP REASON CLASSIFICATION
   */
  static async recordOperationLog(moId: string, input: RecordOperationInput) {
    const mo = await prisma.manufacturingOrder.findFirst({
      where: { OR: [{ id: moId }, { moCode: moId }] }
    });

    if (!mo) throw new Error(`Manufacturing Order not found: '${moId}'`);

    const seqNo = input.sequenceNo || 10;
    const scrappedQty = input.quantityScrapped || 0;
    const scrapWeight = input.scrapWeightGrams || 0.0;

    const opLog = await prisma.manufacturingOperationLog.create({
      data: {
        moId: mo.id,
        workCenterId: input.workCenterId || null,
        sequenceNo: seqNo,
        stage: input.stage,
        quantityPassed: input.quantityPassed,
        quantityScrapped: scrappedQty,
        scrapReason: input.scrapReason || (scrappedQty > 0 ? 'CASTING_DEFECT' : null),
        scrapWeightGrams: scrapWeight,
        estimatedMinutes: input.estimatedMinutes || 30,
        actualMinutes: input.actualMinutes || 25,
        operatorId: input.operatorId || 'OP-2026-88',
        operatorName: input.operatorName || 'فني الصياغة والصب',
        notes: input.notes || null
      }
    });

    // Update MO scrapped quantity & loss weight
    if (scrappedQty > 0 || scrapWeight > 0) {
      await prisma.manufacturingOrder.update({
        where: { id: mo.id },
        data: {
          scrappedQuantity: mo.scrappedQuantity + scrappedQty,
          silverLossWeightGrams: mo.silverLossWeightGrams + scrapWeight
        }
      });
    }

    // Update Queue Job status if exists
    if (input.workCenterId) {
      prisma.workCenterQueueJob.updateMany({
        where: {
          moId: mo.id,
          sequenceNo: seqNo
        },
        data: {
          status: 'COMPLETED',
          actualMinutes: input.actualMinutes || 25,
          completedAt: new Date()
        }
      }).catch(e => console.error('Failed to update queue job:', e));
    }

    productionEventEmitter.emitEvent({
      eventType: 'OPERATION_LOGGED',
      moId: mo.id,
      moCode: mo.moCode,
      payload: opLog,
      timestamp: new Date().toISOString()
    });

    return opLog;
  }

  /**
   * 6. COMPLETE MO & GENERATE PIECE IDENTITIES (EPIC 02), BARCODES (EPIC 03) & DPP PASSPORTS (EPIC 04)
   */
  static async completeMoAndGenerateIdentities(moId: string, operatorName: string = 'SYSTEM') {
    const mo = await prisma.manufacturingOrder.findFirst({
      where: { OR: [{ id: moId }, { moCode: moId }] }
    });

    if (!mo) throw new Error(`Manufacturing Order not found: '${moId}'`);

    const finalCompletedQty = Math.max(1, mo.plannedQuantity - mo.scrappedQuantity);
    const avgPieceWeight = mo.estimatedSilverWeightGrams > 0 ? mo.estimatedSilverWeightGrams / mo.plannedQuantity : 15.50;

    const producedPieces: any[] = [];
    const createdDpps: any[] = [];
    const printQueueJobs: any[] = [];

    for (let i = 0; i < finalCompletedQty; i++) {
      // 1. INTEGRATION WITH EPIC 02: Physical Piece Identity Platform
      const piece = await IdentityPlatformService.createPhysicalPiece({
        productModelId: mo.productModelId,
        variantId: mo.variantId || undefined,
        weightGrams: avgPieceWeight,
        silverPurity: mo.targetSilverPurity,
        branchId: 'BRANCH-HQ'
      });
      producedPieces.push(piece);

      // 2. INTEGRATION WITH EPIC 04: Digital Product Passport Engine
      const dpp = await QrPassportService.createDppDraft(piece.id, {
        productNameAr: `قطعة مصنعة أمر رقم ${mo.moCode}`,
        silverPurity: mo.targetSilverPurity,
        weightGrams: avgPieceWeight,
        craftsmanship: 'الصياغة والدمغة الرسمية بمسبك باهر سيلفر',
        origin: 'القاهرة، مصر (خان الخليلي)'
      });
      createdDpps.push(dpp);

      // 3. INTEGRATION WITH EPIC 03: Barcode & Label Printing Engine
      try {
        const printJob = await LabelPrintingService.enqueuePrintJob({
          printerDeviceId: 'PRINTER-HQ-LABEL-01',
          templateIdOrCode: 'tpl-jewelry-tag-925',
          pieceIdOrSerial: piece.serialNo,
          requestedBy: operatorName
        });
        printQueueJobs.push(printJob);
      } catch (e) {
        console.warn('Auto print enqueue notice:', e);
      }
    }

    // Update MO status to COMPLETED
    const completedMo = await prisma.manufacturingOrder.update({
      where: { id: mo.id },
      data: {
        status: 'COMPLETED',
        completedQuantity: finalCompletedQty,
        actualSilverWeightGrams: avgPieceWeight * finalCompletedQty,
        completionDate: new Date()
      }
    });

    // Mark reservations as CONSUMED
    await prisma.materialReservation.updateMany({
      where: { moId: mo.id },
      data: { status: 'CONSUMED' }
    });

    // Emit Completion Events
    productionEventEmitter.emitEvent({
      eventType: 'MO_COMPLETED',
      moId: mo.id,
      moCode: mo.moCode,
      payload: { completedQuantity: finalCompletedQty, producedPiecesCount: producedPieces.length },
      timestamp: new Date().toISOString()
    });

    return {
      mo: completedMo,
      producedPiecesCount: producedPieces.length,
      producedPieces: producedPieces.map(p => ({ serialNo: p.serialNo, sku: p.sku, weightGrams: p.weightGrams })),
      digitalProductPassports: createdDpps.map(d => ({ dppCode: d.dppCode, dppUrl: d.dppUrl })),
      labelPrintJobsEnqueued: printQueueJobs.length
    };
  }

  /**
   * 7. WORK CENTER MANAGEMENT
   */
  static async listWorkCenters() {
    let list = await prisma.workCenter.findMany({
      orderBy: { code: 'asc' }
    });

    if (list.length === 0) {
      // Seed default work centers for silver jewelry manufacturing
      const defaults = [
        { code: 'WC-CASTING', nameAr: 'مركز سبك وتصحيح الفضة', nameEn: 'Silver Casting & Refining Center', capacity: 15.0 },
        { code: 'WC-POLISHING', nameAr: 'مركز البرد والتلميع الابتدائي', nameEn: 'Filing & Pre-Polishing Center', capacity: 20.0 },
        { code: 'WC-SETTING', nameAr: 'مركز تركيب وتثبيت الأحجار', nameEn: 'Stone Setting Center', capacity: 12.0 },
        { code: 'WC-RHODIUM', nameAr: 'مركز طلاء الروديوم والفيش', nameEn: 'Rhodium Plating Center', capacity: 25.0 },
        { code: 'WC-QC', nameAr: 'مركز الفحص وفحص الكثافة بالليزر', nameEn: 'Laser QC Inspection Center', capacity: 30.0 }
      ];

      for (const wc of defaults) {
        await prisma.workCenter.create({
          data: {
            code: wc.code,
            nameAr: wc.nameAr,
            nameEn: wc.nameEn,
            capacityHourly: wc.capacity,
            hourlyCostRate: 150.0
          }
        });
      }
      list = await prisma.workCenter.findMany({ orderBy: { code: 'asc' } });
    }

    return list;
  }

  static async createWorkCenter(data: { code: string; nameAr: string; nameEn: string; capacityHourly?: number; hourlyCostRate?: number }) {
    return await prisma.workCenter.create({
      data: {
        code: data.code,
        nameAr: data.nameAr,
        nameEn: data.nameEn,
        capacityHourly: data.capacityHourly || 10.0,
        hourlyCostRate: data.hourlyCostRate || 0.0
      }
    });
  }

  /**
   * 8. GET FULL MO DETAILS
   */
  static async getMoDetails(moIdOrCode: string) {
    const mo = await prisma.manufacturingOrder.findFirst({
      where: { OR: [{ id: moIdOrCode }, { moCode: moIdOrCode }] }
    });

    if (!mo) throw new Error(`Manufacturing Order not found: '${moIdOrCode}'`);

    const product = await prisma.productMaster.findUnique({
      where: { id: mo.productModelId }
    });

    const [materialReservations, operationLogs, queueJobs] = await Promise.all([
      prisma.materialReservation.findMany({ where: { moId: mo.id } }),
      prisma.manufacturingOperationLog.findMany({ where: { moId: mo.id }, orderBy: { sequenceNo: 'asc' } }),
      prisma.workCenterQueueJob.findMany({ where: { moId: mo.id }, orderBy: { sequenceNo: 'asc' } })
    ]);

    return {
      mo,
      productModel: product ? { id: product.id, productCode: product.productCode, nameAr: product.nameAr, nameEn: product.nameEn } : null,
      materialReservations,
      operationLogs,
      queueJobs
    };
  }

  /**
   * 9. LIST MANUFACTURING ORDERS WITH STATUS FILTERING
   */
  static async listManufacturingOrders(filters?: { status?: string }) {
    const where: any = {};
    if (filters?.status && filters.status !== 'ALL') {
      where.status = filters.status;
    }

    return await prisma.manufacturingOrder.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50
    });
  }
}

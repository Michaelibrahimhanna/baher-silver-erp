import { PrismaClient } from '@prisma/client';
import { productionEventEmitter } from './manufacturing_events.service';

const prisma = new PrismaClient();

export interface SubmitApprovalInput {
  moId: string;
  approvalStage?: string;
  designVersion?: string;
  previousVersionId?: string;
  changeSummary?: string;
  status: 'APPROVED' | 'REJECTED' | 'REVISION_REQUESTED';
  feedbackNotes?: string;
  actionBy: string;
}

export interface UploadAttachmentInput {
  moId: string;
  fileName: string;
  fileUrl: string;
  previewUrl?: string;
  thumbnailUrl?: string;
  fileType: 'IMAGE' | 'PDF' | 'CAD_STL' | 'CAD_3DM' | 'CAD_DXF' | 'PRODUCTION_DOC';
  fileSizeBytes?: number;
  uploadedBy: string;
}

export interface AddNoteInput {
  moId: string;
  customerId?: string;
  noteType: 'CUSTOMER_VISIBLE' | 'INTERNAL_FACTORY_ONLY';
  noteText: string;
  authorName: string;
}

export class CustomerCollaborationService {
  /**
   * 1. MANUFACTURING ORDERS TIMELINE, PROGRESS ENGINE & ETA METRICS
   */
  static async getCustomerOrderTimeline(customerId: string, moIdOrCode: string) {
    const user = await prisma.customerPortalUser.findUnique({ where: { id: customerId } });
    if (!user) throw new Error('Customer user not found.');

    const mo = await prisma.manufacturingOrder.findFirst({
      where: { OR: [{ id: moIdOrCode }, { moCode: moIdOrCode }] }
    });

    if (!mo) throw new Error(`Manufacturing Order not found: '${moIdOrCode}'`);

    const product = await prisma.productMaster.findUnique({ where: { id: mo.productModelId } });

    // Fetch manufacturing operations & queue logs
    const [operationLogs, approvals, attachments, notes] = await Promise.all([
      prisma.manufacturingOperationLog.findMany({ where: { moId: mo.id }, orderBy: { sequenceNo: 'asc' } }),
      prisma.customerOrderApproval.findMany({ where: { moId: mo.id }, orderBy: { createdAt: 'desc' } }),
      prisma.customerOrderAttachment.findMany({ where: { moId: mo.id }, orderBy: { createdAt: 'desc' } }),
      prisma.customerOrderNote.findMany({ where: { moId: mo.id, noteType: 'CUSTOMER_VISIBLE' }, orderBy: { createdAt: 'asc' } })
    ]);

    // Progress Percentage Calculation (0% - 100%)
    let progressPercentage = 0;
    if (mo.status === 'COMPLETED' || mo.status === 'CLOSED') progressPercentage = 100;
    else if (mo.status === 'IN_PROGRESS') {
      const completedOps = operationLogs.length;
      progressPercentage = Math.min(90, Math.max(15, completedOps * 20));
    } else if (mo.status === 'CONFIRMED') progressPercentage = 10;

    // Delivery & Delay Indicators
    const now = new Date();
    const plannedDeliveryDate = new Date(mo.createdAt.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days SLA
    const isOverdue = now > plannedDeliveryDate && mo.status !== 'COMPLETED';
    const delayDays = isOverdue ? Math.ceil((now.getTime() - plannedDeliveryDate.getTime()) / (1000 * 3600 * 24)) : 0;
    const updatedEta = new Date(plannedDeliveryDate.getTime() + delayDays * 24 * 60 * 60 * 1000);

    // Timeline Milestones
    const milestones = [
      { stage: 'MO_CREATED', titleAr: 'تم إنشاء أمر التصنيع', timestamp: mo.createdAt, completed: true },
      { stage: 'CONFIRMED', titleAr: 'تأكيد الحجز وتوفر المواد', timestamp: mo.createdAt, completed: mo.status !== 'PLANNED' },
      { stage: 'CASTING', titleAr: 'مرحلة صب وصهر الفضة 925', timestamp: operationLogs[0]?.timestamp || null, completed: operationLogs.length >= 1 },
      { stage: 'POLISHING', titleAr: 'مرحلة البرد والتلميع الابتدائي', timestamp: operationLogs[1]?.timestamp || null, completed: operationLogs.length >= 2 },
      { stage: 'QC_FINAL', titleAr: 'فحص الجودة XRF وتوليد DPP', timestamp: mo.status === 'COMPLETED' ? new Date() : null, completed: mo.status === 'COMPLETED' }
    ];

    return {
      orderSummary: {
        moId: mo.id,
        moCode: mo.moCode,
        productNameAr: product?.nameAr || 'قطعة فضة إيطالي',
        plannedQuantity: mo.plannedQuantity,
        completedQuantity: mo.completedQuantity,
        status: mo.status,
        progressPercentage,
        currentStage: mo.status === 'COMPLETED' ? 'مكتمل ومفحوص' : (operationLogs[operationLogs.length - 1]?.stage || 'قيد الصياغة'),
        plannedDeliveryDate,
        updatedEta,
        isOverdue,
        delayDays
      },
      milestones,
      latestApproval: approvals[0] || null,
      attachments,
      customerNotes: notes
    };
  }

  /**
   * 2. CUSTOMER APPROVAL WORKFLOW & DESIGN VERSION CONTROL (V1, V2, V3...)
   */
  static async submitDesignApprovalAction(customerId: string, input: SubmitApprovalInput) {
    const mo = await prisma.manufacturingOrder.findFirst({
      where: { OR: [{ id: input.moId }, { moCode: input.moId }] }
    });

    if (!mo) throw new Error(`Manufacturing Order not found: '${input.moId}'`);

    const version = input.designVersion || 'V1';
    const deadline = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3-day approval window

    const approval = await prisma.customerOrderApproval.create({
      data: {
        moId: mo.id,
        customerId,
        approvalStage: input.approvalStage || 'CAD_DESIGN',
        designVersion: version,
        previousVersionId: input.previousVersionId || null,
        changeSummary: input.changeSummary || null,
        status: input.status,
        approvalDeadline: deadline,
        feedbackNotes: input.feedbackNotes || null,
        actionBy: input.actionBy,
        actionAt: new Date()
      }
    });

    // Domain Event Integration
    productionEventEmitter.emitEvent({
      eventType: 'CUSTOMER_APPROVAL_UPDATED' as any,
      moId: mo.id,
      moCode: mo.moCode,
      payload: { approvalId: approval.id, status: input.status, version },
      timestamp: new Date().toISOString()
    });

    return approval;
  }

  /**
   * 3. CUSTOMER ATTACHMENTS & PREVIEWS (CAD STL/3DM/DXF, IMAGES, PDF)
   */
  static async uploadOrderAttachment(customerId: string, input: UploadAttachmentInput) {
    const mo = await prisma.manufacturingOrder.findFirst({
      where: { OR: [{ id: input.moId }, { moCode: input.moId }] }
    });

    if (!mo) throw new Error(`Manufacturing Order not found: '${input.moId}'`);

    return await prisma.customerOrderAttachment.create({
      data: {
        moId: mo.id,
        customerId,
        fileName: input.fileName,
        fileUrl: input.fileUrl,
        previewUrl: input.previewUrl || input.fileUrl,
        thumbnailUrl: input.thumbnailUrl || input.fileUrl,
        fileType: input.fileType,
        fileSizeBytes: input.fileSizeBytes || 1024,
        uploadedBy: input.uploadedBy
      }
    });
  }

  /**
   * 4. INTERNAL VS CUSTOMER NOTES & PERMANENT COMMENT HISTORY
   */
  static async addOrderNote(input: AddNoteInput) {
    const mo = await prisma.manufacturingOrder.findFirst({
      where: { OR: [{ id: input.moId }, { moCode: input.moId }] }
    });

    if (!mo) throw new Error(`Manufacturing Order not found: '${input.moId}'`);

    return await prisma.customerOrderNote.create({
      data: {
        moId: mo.id,
        customerId: input.customerId || null,
        noteType: input.noteType,
        noteText: input.noteText,
        authorName: input.authorName,
        isImmutable: true
      }
    });
  }

  static async getOrderNotes(customerId: string, moId: string, isInternalUser = false) {
    const where: any = { moId };
    if (!isInternalUser) {
      where.noteType = 'CUSTOMER_VISIBLE';
    }

    const notes = await prisma.customerOrderNote.findMany({
      where,
      orderBy: { createdAt: 'asc' }
    });

    // Read Receipt Preparation: Update readByCustomerAt
    if (!isInternalUser) {
      await prisma.customerOrderNote.updateMany({
        where: { moId, noteType: 'CUSTOMER_VISIBLE', readByCustomerAt: null },
        data: { readByCustomerAt: new Date() }
      });
    }

    return notes;
  }

  /**
   * 5. ORDER SEARCH & STATUS FILTERS
   */
  static async listCustomerOrders(customerId: string, filters?: { status?: string; search?: string }) {
    const where: any = {};

    if (filters?.status) {
      if (filters.status === 'COMPLETED') where.status = 'COMPLETED';
      else if (filters.status === 'ACTIVE') where.status = { in: ['PLANNED', 'CONFIRMED', 'IN_PROGRESS'] };
      else if (filters.status === 'WAITING_APPROVAL') where.status = 'QUALITY_CHECK';
    }

    if (filters?.search) {
      where.moCode = { contains: filters.search };
    }

    const orders = await prisma.manufacturingOrder.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    return orders.map(mo => ({
      id: mo.id,
      moCode: mo.moCode,
      plannedQuantity: mo.plannedQuantity,
      completedQuantity: mo.completedQuantity,
      status: mo.status,
      createdAt: mo.createdAt
    }));
  }
}

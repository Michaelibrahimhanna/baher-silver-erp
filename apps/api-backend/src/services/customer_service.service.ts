import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateServiceRequestInput {
  customerId: string;
  requestType: 'SERVICE' | 'REPAIR' | 'MAINTENANCE' | 'INSPECTION';
  title: string;
  description: string;
  pieceSerial?: string;
  dppCode?: string;
  moId?: string;
  warrantyId?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  scheduledDate?: string;
}

export interface InternalAssignInput {
  assignedTo: string;
  assignedToName: string;
  internalNote?: string;
}

export interface InternalUpdateStatusInput {
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'FACTORY_RESPONDED' | 'RESOLVED' | 'REJECTED' | 'CLOSED';
  rootCause?: 'MANUFACTURING' | 'CUSTOMER_DAMAGE' | 'STONE' | 'PLATING' | 'WEAR' | 'OTHER';
  estimatedCost?: number;
  warrantyCoveragePct?: number;
  customerApprovalRequired?: boolean;
  resolutionSummary?: string;
  repairDetailsJson?: string;
  inspectionResultsJson?: string;
  technicianChecklistJson?: string;
  noteText?: string;
  visibility?: 'CUSTOMER_VISIBLE' | 'INTERNAL_FACTORY_ONLY';
  authorName?: string;
}

export interface AddAttachmentInput {
  serviceRequestId: string;
  customerId: string;
  fileName: string;
  fileUrl: string;
  fileType: 'IMAGE' | 'VIDEO' | 'PDF' | 'CAD' | 'OTHER';
  fileSizeBytes?: number;
  uploadedBy?: 'CUSTOMER' | 'FACTORY';
  uploadedByName?: string;
  description?: string;
}

export interface SubmitSurveyInput {
  serviceRequestId: string;
  customerId: string;
  satisfactionRating: number; // 1 to 5
  satisfactionFeedback?: string;
  resolutionSatisfied: boolean;
}

export class CustomerServiceService {
  /**
   * 1. CREATE SERVICE REQUEST
   */
  static async createServiceRequest(input: CreateServiceRequestInput) {
    const user = await prisma.customerPortalUser.findUnique({ where: { id: input.customerId } });
    if (!user) throw new Error('Customer user not found.');

    const count = await prisma.customerServiceRequest.count();
    const requestNo = `SRV-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;
    const priority = input.priority || 'MEDIUM';

    // Calculate SLA Deadlines
    const now = new Date();
    const responseDeadline = new Date(now);
    const resolutionDeadline = new Date(now);

    switch (priority) {
      case 'CRITICAL':
        responseDeadline.setHours(now.getHours() + 4);
        resolutionDeadline.setHours(now.getHours() + 24);
        break;
      case 'HIGH':
        responseDeadline.setHours(now.getHours() + 12);
        resolutionDeadline.setDate(now.getDate() + 3);
        break;
      case 'LOW':
        responseDeadline.setHours(now.getHours() + 48);
        resolutionDeadline.setDate(now.getDate() + 7);
        break;
      case 'MEDIUM':
      default:
        responseDeadline.setHours(now.getHours() + 24);
        resolutionDeadline.setDate(now.getDate() + 5);
        break;
    }

    // Determine initial warranty coverage
    let warrantyCoveragePct = 0;
    if (input.warrantyId || input.requestType === 'INSPECTION') {
      warrantyCoveragePct = 100;
    }

    const serviceRequest = await prisma.customerServiceRequest.create({
      data: {
        requestNo,
        customerId: input.customerId,
        requestType: input.requestType,
        pieceSerial: input.pieceSerial || null,
        dppCode: input.dppCode || null,
        moId: input.moId || null,
        warrantyId: input.warrantyId || null,
        title: input.title,
        description: input.description,
        priority,
        status: 'SUBMITTED',
        responseDeadline,
        resolutionDeadline,
        slaStatus: 'ON_TIME',
        warrantyCoveragePct,
        customerApprovalRequired: warrantyCoveragePct < 100,
        scheduledDate: input.scheduledDate ? new Date(input.scheduledDate) : null
      }
    });

    // Create Initial Timeline Note
    await prisma.customerServiceTimelineNote.create({
      data: {
        serviceRequestId: serviceRequest.id,
        authorName: user.customerName,
        visibility: 'CUSTOMER_VISIBLE',
        noteText: `تم تقديم طلب الخدمة (${requestNo}) بنجاح وهو قيد المراجعة الفنية.`,
        newStatus: 'SUBMITTED'
      }
    });

    // Log Activity
    await prisma.customerActivityLog.create({
      data: {
        customerId: input.customerId,
        activityType: 'SERVICE_REQUEST',
        entityType: 'SERVICE',
        entityId: serviceRequest.id,
        description: `تقديم طلب ${input.requestType}: ${input.title} (${requestNo})`,
        details: JSON.stringify({ requestNo, priority, requestType: input.requestType })
      }
    });

    return serviceRequest;
  }

  /**
   * 2. LIST SERVICE REQUESTS FOR CUSTOMER (Multi-Tenant Isolated)
   */
  static async getCustomerServiceRequests(customerId: string, filters?: { requestType?: string; status?: string; priority?: string }) {
    const where: any = { customerId };
    if (filters?.requestType) where.requestType = filters.requestType;
    if (filters?.status) where.status = filters.status;
    if (filters?.priority) where.priority = filters.priority;

    const requests = await prisma.customerServiceRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    const enriched = await Promise.all(
      requests.map(async (req) => {
        const attachmentCount = await prisma.customerServiceAttachment.count({ where: { serviceRequestId: req.id } });
        const latestNote = await prisma.customerServiceTimelineNote.findFirst({
          where: { serviceRequestId: req.id, visibility: 'CUSTOMER_VISIBLE' },
          orderBy: { createdAt: 'desc' }
        });
        return {
          ...req,
          attachmentCount,
          latestStatusNote: latestNote?.noteText || null
        };
      })
    );

    return enriched;
  }

  /**
   * 3. GET SERVICE REQUEST DETAILS
   */
  static async getServiceRequestDetails(serviceRequestId: string, customerId?: string, isInternal = false) {
    const request = await prisma.customerServiceRequest.findUnique({ where: { id: serviceRequestId } });
    if (!request) throw new Error(`Service request '${serviceRequestId}' not found.`);

    if (!isInternal && customerId && request.customerId !== customerId) {
      throw new Error('Unauthorized access to service request.');
    }

    const attachments = await prisma.customerServiceAttachment.findMany({
      where: { serviceRequestId }
    });

    const notesWhere: any = { serviceRequestId };
    if (!isInternal) {
      notesWhere.visibility = 'CUSTOMER_VISIBLE';
    }

    const timelineNotes = await prisma.customerServiceTimelineNote.findMany({
      where: notesWhere,
      orderBy: { createdAt: 'asc' }
    });

    const piece = request.pieceSerial ? await prisma.physicalPiece.findFirst({ where: { serialNo: request.pieceSerial } }) : null;
    const dpp = request.dppCode ? await prisma.digitalProductPassportDraft.findFirst({ where: { dppCode: request.dppCode } }) : null;
    const mo = request.moId ? await prisma.manufacturingOrder.findUnique({ where: { id: request.moId } }) : null;
    const warranty = request.pieceSerial
      ? await prisma.customerWarrantyRecord.findFirst({ where: { pieceSerial: request.pieceSerial } })
      : null;

    return {
      request,
      attachments,
      timelineNotes,
      linkedAssets: {
        piece,
        passport: dpp,
        manufacturingOrder: mo ? { moCode: mo.moCode, status: mo.status, productModelId: mo.productModelId } : null,
        warranty
      }
    };
  }

  /**
   * 4. INTERNAL ASSIGN TECHNICIAN
   */
  static async assignTechnician(serviceRequestId: string, input: InternalAssignInput) {
    const request = await prisma.customerServiceRequest.findUnique({ where: { id: serviceRequestId } });
    if (!request) throw new Error(`Service request '${serviceRequestId}' not found.`);

    const updated = await prisma.customerServiceRequest.update({
      where: { id: serviceRequestId },
      data: {
        assignedTo: input.assignedTo,
        assignedToName: input.assignedToName,
        status: request.status === 'SUBMITTED' ? 'ASSIGNED' : request.status
      }
    });

    await prisma.customerServiceTimelineNote.create({
      data: {
        serviceRequestId,
        authorName: input.assignedToName,
        visibility: 'INTERNAL_FACTORY_ONLY',
        noteText: input.internalNote || `تم إسناد الطلب للفني المختص (${input.assignedToName}).`,
        previousStatus: request.status,
        newStatus: updated.status
      }
    });

    return updated;
  }

  /**
   * 5. INTERNAL UPDATE STATUS & FACTORY RESPONSE
   */
  static async updateServiceStatus(serviceRequestId: string, input: InternalUpdateStatusInput) {
    const request = await prisma.customerServiceRequest.findUnique({ where: { id: serviceRequestId } });
    if (!request) throw new Error(`Service request '${serviceRequestId}' not found.`);

    const data: any = {
      status: input.status,
      updatedAt: new Date()
    };

    if (input.rootCause) data.rootCause = input.rootCause;
    if (input.estimatedCost !== undefined) data.estimatedCost = input.estimatedCost;
    if (input.warrantyCoveragePct !== undefined) data.warrantyCoveragePct = input.warrantyCoveragePct;
    if (input.customerApprovalRequired !== undefined) data.customerApprovalRequired = input.customerApprovalRequired;
    if (input.resolutionSummary) {
      data.resolutionSummary = input.resolutionSummary;
      data.resolutionDate = new Date();
      data.slaStatus = 'MET';
    }
    if (input.repairDetailsJson) data.repairDetailsJson = input.repairDetailsJson;
    if (input.inspectionResultsJson) data.inspectionResultsJson = input.inspectionResultsJson;
    if (input.technicianChecklistJson) data.technicianChecklistJson = input.technicianChecklistJson;

    const updated = await prisma.customerServiceRequest.update({
      where: { id: serviceRequestId },
      data
    });

    const noteText = input.noteText || `تم تحديث حالة الطلب إلى [${input.status}]. ${input.resolutionSummary ? 'الملخص: ' + input.resolutionSummary : ''}`;
    const authorName = input.authorName || request.assignedToName || 'مهندس الجودة بالمصنع';
    const visibility = input.visibility || 'CUSTOMER_VISIBLE';

    await prisma.customerServiceTimelineNote.create({
      data: {
        serviceRequestId,
        authorName,
        visibility,
        noteText,
        previousStatus: request.status,
        newStatus: input.status,
        factoryResponseSummary: input.resolutionSummary || null
      }
    });

    return updated;
  }

  /**
   * 6. CUSTOMER COST APPROVAL
   */
  static async customerApproveCost(serviceRequestId: string, customerId: string) {
    const request = await prisma.customerServiceRequest.findUnique({ where: { id: serviceRequestId } });
    if (!request) throw new Error(`Service request '${serviceRequestId}' not found.`);
    if (request.customerId !== customerId) throw new Error('Unauthorized access.');

    const updated = await prisma.customerServiceRequest.update({
      where: { id: serviceRequestId },
      data: {
        isCustomerApprovedCost: true,
        status: 'IN_PROGRESS'
      }
    });

    await prisma.customerServiceTimelineNote.create({
      data: {
        serviceRequestId,
        authorName: 'العميل',
        visibility: 'CUSTOMER_VISIBLE',
        noteText: `قام العميل بالموافقة على تكلفة الخدمة التقديرية (${request.estimatedCost} ج.م) وبدء التنفيذ.`,
        previousStatus: request.status,
        newStatus: 'IN_PROGRESS'
      }
    });

    return updated;
  }

  /**
   * 7. SUBMIT SATISFACTION SURVEY
   */
  static async submitSatisfactionSurvey(input: SubmitSurveyInput) {
    const request = await prisma.customerServiceRequest.findUnique({ where: { id: input.serviceRequestId } });
    if (!request) throw new Error(`Service request '${input.serviceRequestId}' not found.`);
    if (request.customerId !== input.customerId) throw new Error('Unauthorized access.');

    if (input.satisfactionRating < 1 || input.satisfactionRating > 5) {
      throw new Error('Satisfaction rating must be between 1 and 5.');
    }

    return await prisma.customerServiceRequest.update({
      where: { id: input.serviceRequestId },
      data: {
        satisfactionRating: input.satisfactionRating,
        satisfactionFeedback: input.satisfactionFeedback || null,
        resolutionSatisfied: input.resolutionSatisfied
      }
    });
  }

  /**
   * 8. ADD ATTACHMENT
   */
  static async addAttachment(input: AddAttachmentInput) {
    const request = await prisma.customerServiceRequest.findUnique({ where: { id: input.serviceRequestId } });
    if (!request) throw new Error(`Service request '${input.serviceRequestId}' not found.`);

    const attachment = await prisma.customerServiceAttachment.create({
      data: {
        serviceRequestId: input.serviceRequestId,
        customerId: input.customerId,
        fileName: input.fileName,
        fileUrl: input.fileUrl,
        fileType: input.fileType,
        fileSizeBytes: input.fileSizeBytes || 0,
        uploadedBy: input.uploadedBy || 'CUSTOMER',
        uploadedByName: input.uploadedByName || 'العميل',
        description: input.description || null
      }
    });

    // Log Activity
    await prisma.customerActivityLog.create({
      data: {
        customerId: input.customerId,
        activityType: 'SERVICE_REQUEST',
        entityType: 'FILE',
        entityId: attachment.id,
        description: `إرفاق ملف [${input.fileType}] ${input.fileName} بطلب الخدمة ${request.requestNo}`,
        details: JSON.stringify({ fileName: input.fileName, fileType: input.fileType })
      }
    });

    return attachment;
  }
}

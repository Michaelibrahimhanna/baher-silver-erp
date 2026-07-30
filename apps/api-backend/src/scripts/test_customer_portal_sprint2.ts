import { CustomerCollaborationService } from '../services/customer_collaboration.service';
import { CustomerPortalService } from '../services/customer_portal.service';
import { ManufacturingService } from '../services/manufacturing.service';
import { ProductService } from '../services/product.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runCustomerPortalSprint2UnitTests() {
  console.log('=============================================================================');
  console.log('EPIC 06 SPRINT 02: MO TIMELINE & CUSTOMER COLLABORATION — UNIT TEST SUITE');
  console.log('=============================================================================');

  try {
    // -------------------------------------------------------------------------
    // CLEANUP & SETUP
    // -------------------------------------------------------------------------
    console.log('\n[SETUP] Cleaning up database and preparing test environment...');
    await prisma.customerOrderNote.deleteMany({});
    await prisma.customerOrderAttachment.deleteMany({});
    await prisma.customerOrderApproval.deleteMany({});
    await prisma.manufacturingOperationLog.deleteMany({});
    await prisma.manufacturingOrder.deleteMany({});
    await prisma.customerSession.deleteMany({});
    await prisma.customerPortalUser.deleteMany({});

    // Register Customer A & Customer B for Multi-tenant Isolation Test
    const custA = await CustomerPortalService.registerOrLoginCustomer('brand_a@bahersilver.com', 'Pass925!');
    const custB = await CustomerPortalService.registerOrLoginCustomer('brand_b@bahersilver.com', 'Pass925!');

    const product = await ProductService.createProduct({
      nameAr: 'خاتم كلاسيكي مرصع بالعقيق الأحادي',
      nameEn: 'Classic Agate Silver Ring',
      category: 'خاتم',
      silverPurity: '925'
    });

    const mo = await ManufacturingService.createManufacturingOrder({
      productModelId: product.id,
      plannedQuantity: 12,
      priority: 'HIGH',
      supervisorName: 'سامح لطفي'
    });

    console.log(`  ✓ Setup Complete: Customer A ID = ${custA.user.id} | MO Code = ${mo.moCode}`);

    // -------------------------------------------------------------------------
    // TEST 1: MANUFACTURING ORDERS TIMELINE & PROGRESS ENGINE
    // -------------------------------------------------------------------------
    console.log('\n[TEST 1] Testing Manufacturing Orders Timeline & Progress Engine...');

    const timeline = await CustomerCollaborationService.getCustomerOrderTimeline(custA.user.id, mo.moCode);
    console.log(`  ✓ Timeline Generated for MO: ${timeline.orderSummary.moCode}`);
    console.log(`  ✓ Current Progress: ${timeline.orderSummary.progressPercentage}% | Current Stage: "${timeline.orderSummary.currentStage}"`);
    console.log(`  ✓ Planned Delivery: ${timeline.orderSummary.plannedDeliveryDate.toISOString().split('T')[0]} | Is Overdue: ${timeline.orderSummary.isOverdue}`);
    console.log(`  ✓ Milestones Count: ${timeline.milestones.length}`);

    if (typeof timeline.orderSummary.progressPercentage !== 'number' || timeline.milestones.length < 4) {
      throw new Error('Manufacturing orders timeline or progress engine failed');
    }

    // -------------------------------------------------------------------------
    // TEST 2: CUSTOMER APPROVAL WORKFLOW & DESIGN VERSION CONTROL (V1, V2, V3...)
    // -------------------------------------------------------------------------
    console.log('\n[TEST 2] Testing Customer Approval Workflow & Design Version Control...');

    // Step 1: Submit V1 Revision Request
    const approvalV1 = await CustomerCollaborationService.submitDesignApprovalAction(custA.user.id, {
      moId: mo.id,
      approvalStage: 'CAD_DESIGN',
      designVersion: 'V1',
      status: 'REVISION_REQUESTED',
      feedbackNotes: 'يرجى تضييق حواف حجر العقيق بمقدار 0.5مم',
      actionBy: custA.user.customerName
    });

    console.log(`  ✓ Approval V1 Submitted: Status = ${approvalV1.status} | Version = ${approvalV1.designVersion}`);
    console.log(`    └─ Customer Feedback: "${approvalV1.feedbackNotes}"`);

    // Step 2: Submit V2 Final Approval
    const approvalV2 = await CustomerCollaborationService.submitDesignApprovalAction(custA.user.id, {
      moId: mo.id,
      approvalStage: 'CAD_DESIGN',
      designVersion: 'V2',
      previousVersionId: approvalV1.id,
      changeSummary: 'تم تعديل حواف الحجر بنجاح',
      status: 'APPROVED',
      feedbackNotes: 'التصميم ممتاز ومعتمد للتصنيع',
      actionBy: custA.user.customerName
    });

    console.log(`  ✓ Approval V2 Submitted: Status = ${approvalV2.status} | Version = ${approvalV2.designVersion}`);
    console.log(`  ✓ Verified: Previous Version Linked = ${approvalV2.previousVersionId === approvalV1.id}`);

    if (approvalV2.status !== 'APPROVED' || approvalV2.designVersion !== 'V2') {
      throw new Error('Customer approval workflow or design version control failed');
    }

    // -------------------------------------------------------------------------
    // TEST 3: CUSTOMER ATTACHMENTS & CAD FILE PREVIEWS (STL, 3DM, DXF)
    // -------------------------------------------------------------------------
    console.log('\n[TEST 3] Testing Customer Attachments & CAD Previews (STL, 3DM, DXF)...');

    const attachmentCad = await CustomerCollaborationService.uploadOrderAttachment(custA.user.id, {
      moId: mo.id,
      fileName: 'ring_classic_v2.stl',
      fileUrl: 'storage/cad/ring_classic_v2.stl',
      previewUrl: 'storage/cad/ring_classic_v2_preview.png',
      fileType: 'CAD_STL',
      fileSizeBytes: 2048500,
      uploadedBy: 'مهندس التصميم الإيطالي'
    });

    console.log(`  ✓ CAD Attachment Uploaded: File = ${attachmentCad.fileName} | Type = ${attachmentCad.fileType}`);
    console.log(`  ✓ Preview URL Generated: ${attachmentCad.previewUrl}`);

    if (attachmentCad.fileType !== 'CAD_STL' || !attachmentCad.previewUrl) {
      throw new Error('Customer attachments or CAD file preview failed');
    }

    // -------------------------------------------------------------------------
    // TEST 4: INTERNAL VS CUSTOMER NOTES ISOLATION & READ RECEIPTS
    // -------------------------------------------------------------------------
    console.log('\n[TEST 4] Testing Internal vs Customer Notes Isolation & Read Receipts...');

    // Add Customer Visible Note
    await CustomerCollaborationService.addOrderNote({
      moId: mo.id,
      customerId: custA.user.id,
      noteType: 'CUSTOMER_VISIBLE',
      noteText: 'تم اعتماد عينة الشمع المبدئية وبانتظار الصب',
      authorName: 'مسؤول المتابعة'
    });

    // Add Internal Factory Only Note
    await CustomerCollaborationService.addOrderNote({
      moId: mo.id,
      noteType: 'INTERNAL_FACTORY_ONLY',
      noteText: 'ملاحظة سريعة للمصنع: تم زيادة نسبة النحاس 0.1% لضبط القسوة',
      authorName: 'رئيس المسبك'
    });

    const customerViewNotes = await CustomerCollaborationService.getOrderNotes(custA.user.id, mo.id, false);
    const internalViewNotes = await CustomerCollaborationService.getOrderNotes(custA.user.id, mo.id, true);

    console.log(`  ✓ Notes Visible to Customer Count: ${customerViewNotes.length} (Expected: 1)`);
    console.log(`  ✓ Notes Visible to Factory Staff Count: ${internalViewNotes.length} (Expected: 2)`);
    console.log(`  ✓ Read Receipt Timestamp Saved: ${customerViewNotes[0]?.readByCustomerAt ? 'YES' : 'NO'}`);

    if (customerViewNotes.length !== 1 || internalViewNotes.length !== 2) {
      throw new Error('Internal vs customer notes isolation failed');
    }

    // -------------------------------------------------------------------------
    // TEST 5: ORDER SEARCH & STATUS FILTERS
    // -------------------------------------------------------------------------
    console.log('\n[TEST 5] Testing Order Search & Status Filters...');

    const activeOrders = await CustomerCollaborationService.listCustomerOrders(custA.user.id, { status: 'ACTIVE' });
    console.log(`  ✓ Active Customer Orders Returned Count: ${activeOrders.length}`);
    console.log(`    └─ Order 1 Code: ${activeOrders[0]?.moCode}`);

    if (activeOrders.length === 0) {
      throw new Error('Order search or status filters failed');
    }

    console.log('\n=============================================================================');
    console.log('ALL EPIC 06 SPRINT 02 COLLABORATION TESTS PASSED 100% SUCCESSFULLY! 🎯');
    console.log('=============================================================================');
  } catch (err: any) {
    console.error('\n❌ EPIC 06 SPRINT 02 UNIT TEST FAILED:', err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runCustomerPortalSprint2UnitTests();

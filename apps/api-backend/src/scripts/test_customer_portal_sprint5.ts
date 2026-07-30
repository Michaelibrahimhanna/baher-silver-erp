import { PrismaClient } from '@prisma/client';
import { CustomerServiceService } from '../services/customer_service.service';
import { CustomerActivityService } from '../services/customer_activity.service';

const prisma = new PrismaClient();

async function runSprint5Tests() {
  console.log('=============================================================================');
  console.log('   EPIC 06 SPRINT 05 — CUSTOMER SERVICE CENTER & COMMUNICATION HUB TESTS    ');
  console.log('=============================================================================\n');

  let passedTests = 0;
  let failedTests = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  [PASS] ${testName}`);
      passedTests++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
      failedTests++;
    }
  }

  try {
    // -------------------------------------------------------------------------
    // 1. SETUP TEST CUSTOMER & SEED ASSETS
    // -------------------------------------------------------------------------
    console.log('1. Setting up Test Customer & Seed Assets...');
    
    let customer = await prisma.customerPortalUser.findUnique({
      where: { email: 'sprint5_test@bahersilver.com' }
    });

    if (!customer) {
      customer = await prisma.customerPortalUser.create({
        data: {
          email: 'sprint5_test@bahersilver.com',
          passwordHash: 'hashed_password_sprint5',
          customerName: 'مؤسسة باهر للمجوهرات الراقية',
          companyName: 'شركة الباهر الذهبية والفضية',
          status: 'ACTIVE'
        }
      });
    }

    // Seed Physical Piece & DPP for testing linkages
    const pieceSerial = 'SN-2026-000941';
    const dppCode = 'DPP-2026-000941';

    let piece = await prisma.physicalPiece.findFirst({ where: { serialNo: pieceSerial } });
    if (!piece) {
      let product = await prisma.productMaster.findFirst();
      if (!product) {
        product = await prisma.productMaster.create({
          data: {
            productCode: 'PROD-SP5-001',
            nameAr: 'خاتم فضة 925 مرصع بالزركون',
            nameEn: 'Silver 925 Zircon Ring',
            silverWeightGrams: 14.5
          }
        });
      }
      piece = await prisma.physicalPiece.create({
        data: {
          serialNo: pieceSerial,
          sku: 'BS-RNG-SP5-001',
          productModelId: product.id,
          verificationToken: 'TOKEN-SP5-VERIFICATION-123456',
          weightGrams: 14.5,
          silverPurity: '925',
          status: 'ACTIVE'
        }
      });
    }

    let dpp = await prisma.digitalProductPassportDraft.findFirst({ where: { dppCode } });
    if (!dpp) {
      dpp = await prisma.digitalProductPassportDraft.create({
        data: {
          dppCode,
          pieceId: piece.id,
          serialNo: pieceSerial,
          sku: piece.sku,
          dppUrl: `https://passport.bahersilver.com/v/${pieceSerial}`,
          qrPayload: `https://passport.bahersilver.com/v/${pieceSerial}`,
          metadataJson: JSON.stringify({ purity: '925', weight: 14.5 })
        }
      });
    }

    assert(!!customer && !!piece && !!dpp, 'Customer & Seed Assets setup successfully');

    // -------------------------------------------------------------------------
    // 2. CUSTOMER SERVICE REQUEST CREATION (Service, Repair, Maintenance, Inspection)
    // -------------------------------------------------------------------------
    console.log('\n2. Testing Customer Service Center Request Creation...');

    const req1 = await CustomerServiceService.createServiceRequest({
      customerId: customer.id,
      requestType: 'SERVICE',
      title: 'استفسار عن تلميع الفضة الإيطالي 925',
      description: 'نأمل توضيح أفضل سبل الحفاظ على بريق طلاء الروديوم.',
      priority: 'LOW'
    });
    assert(req1.requestNo.startsWith('SRV-') && req1.priority === 'LOW', 'Create SERVICE request (LOW priority)');

    const req2 = await CustomerServiceService.createServiceRequest({
      customerId: customer.id,
      requestType: 'REPAIR',
      title: 'طلب إعادة طلاء روديوم وإعادة تثبيت حجر زركون',
      description: 'القطعة بحاجة إلى إعادة طلاء وتثبيت الفص الجانبي.',
      pieceSerial,
      dppCode,
      priority: 'HIGH'
    });
    assert(req2.requestType === 'REPAIR' && req2.pieceSerial === pieceSerial && req2.priority === 'HIGH', 'Create REPAIR request with Piece/DPP linkage (HIGH priority)');

    const req3 = await CustomerServiceService.createServiceRequest({
      customerId: customer.id,
      requestType: 'MAINTENANCE',
      title: 'صيانة دورية وتلميع احترافي لمجموعة المعرض',
      description: 'طلب جدولة صيانة دورية 10 قطع فضية.',
      priority: 'MEDIUM'
    });
    assert(req3.requestType === 'MAINTENANCE' && req3.priority === 'MEDIUM', 'Create MAINTENANCE request (MEDIUM priority)');

    const req4 = await CustomerServiceService.createServiceRequest({
      customerId: customer.id,
      requestType: 'INSPECTION',
      title: 'طلب إعادة فحص عيار XRF واختبار الكثافة',
      description: 'فحص توثيق الجودة والدمغ لقطعة فضية صادرة.',
      pieceSerial,
      dppCode,
      priority: 'CRITICAL'
    });
    assert(req4.requestType === 'INSPECTION' && req4.warrantyCoveragePct === 100 && req4.priority === 'CRITICAL', 'Create INSPECTION request (CRITICAL priority, 100% Warranty Coverage)');

    // -------------------------------------------------------------------------
    // 3. INTERNAL SERVICE WORKFLOW & STATE MACHINE
    // -------------------------------------------------------------------------
    console.log('\n3. Testing Internal Service Workflow & Technician Assignment...');

    const assigned = await CustomerServiceService.assignTechnician(req2.id, {
      assignedTo: 'TECH-SILVER-01',
      assignedToName: 'مهندس أحمد الصايغ',
      internalNote: 'تم تحويل قطعة الإصلاح لقسم طلاء الروديوم والتركيبات.'
    });
    assert(assigned.assignedTo === 'TECH-SILVER-01' && assigned.status === 'ASSIGNED', 'Internal Technician Assignment & Status Transition to ASSIGNED');

    const inProgress = await CustomerServiceService.updateServiceStatus(req2.id, {
      status: 'IN_PROGRESS',
      rootCause: 'PLATING',
      estimatedCost: 350,
      warrantyCoveragePct: 100,
      customerApprovalRequired: false,
      technicianChecklistJson: JSON.stringify([
        { item: 'اختبار نقاء عيار XRF 925', checked: true },
        { item: 'إعادة تثبيت الأحجار المفقودة', checked: true },
        { item: 'طلاء روديوم إيطالي حراري', checked: true }
      ]),
      repairDetailsJson: JSON.stringify({
        rhodiumPlatingMicrons: 0.5,
        stoneSetCount: 1,
        polishingStage: 'COMPLETED'
      }),
      noteText: 'بدء العمل الفني في ورشة الفضة. طلاء الروديوم قيد التنفيذ.',
      visibility: 'CUSTOMER_VISIBLE'
    });
    assert(inProgress.status === 'IN_PROGRESS' && inProgress.rootCause === 'PLATING', 'Update Service Status to IN_PROGRESS with Root Cause & Technician Checklist');

    // -------------------------------------------------------------------------
    // 4. SERVICE ATTACHMENTS (Images, Videos, PDFs, CAD documents)
    // -------------------------------------------------------------------------
    console.log('\n4. Testing Service Multi-Format Attachments...');

    const imgAtt = await CustomerServiceService.addAttachment({
      serviceRequestId: req2.id,
      customerId: customer.id,
      fileName: 'damage_inspection.jpg',
      fileUrl: 'storage/service/damage_inspection.jpg',
      fileType: 'IMAGE',
      fileSizeBytes: 1024500,
      uploadedBy: 'CUSTOMER',
      description: 'صورة الفص المفقود قبل الإصلاح'
    });
    assert(imgAtt.fileType === 'IMAGE' && imgAtt.fileName === 'damage_inspection.jpg', 'Upload IMAGE attachment');

    const vidAtt = await CustomerServiceService.addAttachment({
      serviceRequestId: req2.id,
      customerId: customer.id,
      fileName: 'repair_process.mp4',
      fileUrl: 'storage/service/repair_process.mp4',
      fileType: 'VIDEO',
      fileSizeBytes: 15400000,
      uploadedBy: 'FACTORY',
      uploadedByName: 'ورشة الصياغة',
      description: 'فيديو توثيق عملية الطلاء والتركيب'
    });
    assert(vidAtt.fileType === 'VIDEO' && vidAtt.uploadedBy === 'FACTORY', 'Upload VIDEO attachment');

    const pdfAtt = await CustomerServiceService.addAttachment({
      serviceRequestId: req2.id,
      customerId: customer.id,
      fileName: 'quality_certificate.pdf',
      fileUrl: 'storage/service/quality_certificate.pdf',
      fileType: 'PDF',
      fileSizeBytes: 450000,
      uploadedBy: 'FACTORY',
      description: 'تقرير فحص الجودة بعد التلميع والطلاء'
    });
    assert(pdfAtt.fileType === 'PDF', 'Upload PDF attachment');

    const cadAtt = await CustomerServiceService.addAttachment({
      serviceRequestId: req2.id,
      customerId: customer.id,
      fileName: 'ring_reconstruction.stl',
      fileUrl: 'storage/service/ring_reconstruction.stl',
      fileType: 'CAD',
      fileSizeBytes: 3200000,
      uploadedBy: 'CUSTOMER',
      description: 'ملف التصميم 3D للقطعة'
    });
    assert(cadAtt.fileType === 'CAD', 'Upload CAD attachment');

    // -------------------------------------------------------------------------
    // 5. RESOLUTION WORKFLOW & CUSTOMER SATISFACTION SURVEY
    // -------------------------------------------------------------------------
    console.log('\n5. Testing Resolution Workflow & Customer Satisfaction Survey...');

    const resolved = await CustomerServiceService.updateServiceStatus(req2.id, {
      status: 'RESOLVED',
      resolutionSummary: 'تم إعادة تثبيت فص الزركون وطلاء القطعة بالروديوم عيار 925 وعودتها لبريقها الأصلي بنجاح.',
      noteText: 'تم إنهاء كافة الأعمال الفنية واجتياز اختبار الجودة النهائى 100%.',
      visibility: 'CUSTOMER_VISIBLE'
    });
    assert(resolved.status === 'RESOLVED' && resolved.slaStatus === 'MET', 'Service status updated to RESOLVED & SLA Status set to MET');

    const survey = await CustomerServiceService.submitSatisfactionSurvey({
      serviceRequestId: req2.id,
      customerId: customer.id,
      satisfactionRating: 5,
      satisfactionFeedback: 'خدمة ممتازة وسريعة، وعاد الخاتم كأنه جديد تماماً. شكراً لفريق باهر سيلفر! 🌟',
      resolutionSatisfied: true
    });
    assert(survey.satisfactionRating === 5 && survey.resolutionSatisfied === true, 'Submit 5-Star Customer Satisfaction Survey');

    // -------------------------------------------------------------------------
    // 6. CUSTOMER ACTIVITY CENTER (Passport, QR Scan, File Download Histories)
    // -------------------------------------------------------------------------
    console.log('\n6. Testing Customer Activity Center...');

    await CustomerActivityService.logActivity({
      customerId: customer.id,
      activityType: 'PASSPORT_ACCESS',
      entityType: 'PASSPORT',
      entityId: dpp.id,
      description: `استعراض جواز السفر الرقمي DPP للقطعة ${pieceSerial}`
    });

    await CustomerActivityService.logActivity({
      customerId: customer.id,
      activityType: 'QR_SCAN',
      entityType: 'QR',
      entityId: dppCode,
      description: `مسح رمز QR والتحقق من الأصالة للقطعة ${pieceSerial}`
    });

    await CustomerActivityService.logActivity({
      customerId: customer.id,
      activityType: 'FILE_DOWNLOAD',
      entityType: 'FILE',
      entityId: pdfAtt.id,
      description: `تنزيل شهادة الجودة PDF لطلب الخدمة ${req2.requestNo}`
    });

    const activityHistory = await CustomerActivityService.getActivityHistory(customer.id);
    assert(activityHistory.length >= 4, 'Full Customer Activity History retrieved');

    const passportAccess = await CustomerActivityService.getPassportAccessHistory(customer.id);
    assert(passportAccess.totalAccessLogsCount >= 1, 'Passport Access History retrieved');

    const qrScanHistory = await CustomerActivityService.getQrScanHistory(customer.id);
    assert(qrScanHistory.totalScans >= 1, 'QR Scan History retrieved');

    const downloadHistory = await CustomerActivityService.getFileDownloadHistory(customer.id);
    assert(downloadHistory.totalDownloads >= 1, 'File Download History retrieved');

    // -------------------------------------------------------------------------
    // 7. 360° UNIFIED CUSTOMER TIMELINE
    // -------------------------------------------------------------------------
    console.log('\n7. Testing 360° Unified Customer Timeline...');

    const fullTimeline = await CustomerActivityService.get360CustomerTimeline(customer.id);
    assert(fullTimeline.totalEventsCount >= 3, 'Full 360° Customer Timeline retrieved (Orders, Services, Warranty, Repairs, Certificates, Passports)');

    const servicesTimeline = await CustomerActivityService.get360CustomerTimeline(customer.id, { category: 'SERVICES' });
    assert(servicesTimeline.timelineEvents.every((e) => e.category === 'SERVICES'), 'Filter 360° Timeline by SERVICES category');

    // -------------------------------------------------------------------------
    // 8. MULTI-TENANT ISOLATION
    // -------------------------------------------------------------------------
    console.log('\n8. Testing Strict Multi-Tenant Isolation...');

    let otherCustomer = await prisma.customerPortalUser.findUnique({
      where: { email: 'other_tenant@bahersilver.com' }
    });

    if (!otherCustomer) {
      otherCustomer = await prisma.customerPortalUser.create({
        data: {
          email: 'other_tenant@bahersilver.com',
          passwordHash: 'hashed_password_other',
          customerName: 'عميل آمن آخر',
          companyName: 'مؤسسة السلام للفضيات'
        }
      });
    }

    try {
      await CustomerServiceService.getServiceRequestDetails(req2.id, otherCustomer.id, false);
      assert(false, 'Block cross-tenant access to service request details');
    } catch (err: any) {
      assert(err.message.includes('Unauthorized'), 'Blocked cross-tenant access to service request details (Multi-Tenant Isolated)');
    }

    const otherRequests = await CustomerServiceService.getCustomerServiceRequests(otherCustomer.id);
    assert(otherRequests.length === 0, 'Isolated customer service requests list for non-owner tenant');

    // -------------------------------------------------------------------------
    // SUMMARY REPORT
    // -------------------------------------------------------------------------
    console.log('\n=============================================================================');
    console.log(`  TEST RESULTS: ${passedTests} PASSED, ${failedTests} FAILED out of ${passedTests + failedTests} TOTAL TESTS`);
    console.log('=============================================================================\n');

    if (failedTests > 0) {
      process.exit(1);
    }
  } catch (error: any) {
    console.error('❌ FATAL TEST ERROR:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runSprint5Tests();

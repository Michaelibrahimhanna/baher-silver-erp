import { PrismaClient } from '@prisma/client';
import { CustomerAnalyticsService } from '../services/customer_analytics.service';
import { EnterpriseReportsService } from '../services/enterprise_reports.service';
import { ApiIntegrationService } from '../services/api_integration.service';
import { SystemHealthService } from '../services/system_health.service';

const prisma = new PrismaClient();

async function runSprint6Tests() {
  console.log('=============================================================================');
  console.log('   EPIC 06 SPRINT 06 — ANALYTICS, REPORTS & ENTERPRISE INTEGRATION TESTS    ');
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
    // 1. SETUP TEST COMPANY & CUSTOMER
    // -------------------------------------------------------------------------
    console.log('1. Setting up Test Company & Customer...');

    let customer = await prisma.customerPortalUser.findUnique({
      where: { email: 'sprint6_test@bahersilver.com' }
    });

    if (!customer) {
      customer = await prisma.customerPortalUser.create({
        data: {
          email: 'sprint6_test@bahersilver.com',
          passwordHash: 'hashed_password_sprint6',
          customerName: 'شركة الباهر للأعمال الفضية',
          companyName: 'مجموعة الباهر العالمية',
          status: 'ACTIVE'
        }
      });
    }

    assert(!!customer, 'Test Customer setup successfully');

    // -------------------------------------------------------------------------
    // 2. EXECUTIVE DASHBOARDS & KPI TARGETS
    // -------------------------------------------------------------------------
    console.log('\n2. Testing Executive Dashboards & KPI Targets...');

    const execKpis = await CustomerAnalyticsService.getExecutiveKpis('default-company', customer.id);
    assert(execKpis.customerKpis.length >= 3, 'Customer KPIs generated with target & variance indicators');
    assert(execKpis.manufacturingKpis.length >= 3, 'Manufacturing KPIs generated (Yield, Lead Time, MO Completion)');
    assert(execKpis.serviceKpis.length >= 3, 'Service KPIs generated (SLA Compliance, CSAT, Resolution Time)');
    assert(execKpis.warrantyKpis.length >= 3, 'Warranty KPIs generated (Active Warranties, Claim Approval %, Purity Integrity)');

    // -------------------------------------------------------------------------
    // 3. CUSTOMER ANALYTICS & USAGE TRENDS
    // -------------------------------------------------------------------------
    console.log('\n3. Testing Customer Analytics & Usage Trends...');

    const analytics = await CustomerAnalyticsService.getCustomerPortalAnalytics(customer.id);
    assert(analytics.portalUsage.totalQrScans !== undefined, 'Portal usage & QR scan analytics calculated');
    assert(analytics.serviceTrends.requestTypeBreakdown !== undefined, 'Service request type breakdown calculated');
    assert(analytics.satisfactionTrends.csatScore >= 4.0, 'CSAT & NPS satisfaction trends calculated');

    // -------------------------------------------------------------------------
    // 4. ENTERPRISE REPORTS & EXPORT FOUNDATION (PDF, CSV, JSON)
    // -------------------------------------------------------------------------
    console.log('\n4. Testing Enterprise Reports & Export Engine...');

    const mfgReport = await EnterpriseReportsService.getManufacturingReport({ customerId: customer.id });
    assert(mfgReport.reportType === 'MANUFACTURING' && mfgReport.summary.totalOrdersCount !== undefined, 'Manufacturing Report generated');

    const wrnReport = await EnterpriseReportsService.getWarrantyReport({ customerId: customer.id });
    assert(wrnReport.reportType === 'WARRANTY' && wrnReport.summary.totalWarranties !== undefined, 'Warranty Report generated');

    const srvReport = await EnterpriseReportsService.getServiceReport({ customerId: customer.id });
    assert(srvReport.reportType === 'SERVICE' && srvReport.summary.totalRequests !== undefined, 'Service Report generated');

    const actReport = await EnterpriseReportsService.getCustomerActivityReport({ customerId: customer.id });
    assert(actReport.reportType === 'ACTIVITY', 'Customer Activity Report generated');

    // Test Export Engine
    const pdfExport = await EnterpriseReportsService.exportReport({
      reportType: 'SERVICE',
      exportFormat: 'PDF',
      customerId: customer.id
    });
    assert(pdfExport.format === 'PDF' && pdfExport.downloadUrl.endsWith('.pdf'), 'Export Service Report to PDF');

    const csvExport = await EnterpriseReportsService.exportReport({
      reportType: 'MANUFACTURING',
      exportFormat: 'EXCEL_CSV',
      customerId: customer.id
    });
    assert(csvExport.format === 'EXCEL_CSV' && csvExport.downloadUrl.endsWith('.csv'), 'Export Manufacturing Report to EXCEL/CSV');

    const jsonExport = await EnterpriseReportsService.exportReport({
      reportType: 'WARRANTY',
      exportFormat: 'JSON',
      customerId: customer.id
    });
    assert(jsonExport.format === 'JSON' && jsonExport.downloadUrl.endsWith('.json'), 'Export Warranty Report to JSON');

    // Test Scheduled Reports
    const schedule = await EnterpriseReportsService.createScheduledReport({
      reportName: 'تقرير الخدمة الأسبوعي لشركة الباهر',
      reportType: 'SERVICE',
      destinationEmail: 'management@bahersilver.com',
      exportFormat: 'PDF'
    });
    assert(schedule.reportType === 'SERVICE' && schedule.isActive === true, 'Create Scheduled Report Config');

    // -------------------------------------------------------------------------
    // 5. PUBLIC API TOKENS & INTEGRATION LAYER
    // -------------------------------------------------------------------------
    console.log('\n5. Testing Public API Tokens & Integration Layer...');

    const tokenGen = await ApiIntegrationService.generateApiToken({
      name: 'مفتاح ربط تطبيق الموبايل ونظام CRM',
      customerId: customer.id,
      scopes: ['read:dpp', 'read:orders', 'write:service'],
      rateLimitPerMin: 150
    });

    assert(tokenGen.rawTokenSecret.startsWith('bs_live_tok_'), 'Generate Public API Token with SHA-256 Hash');

    const verified = await ApiIntegrationService.verifyApiToken(tokenGen.rawTokenSecret, 'read:dpp');
    assert(verified.tokenId === tokenGen.tokenRecord.id && verified.rateLimitPerMin === 150, 'Verify API Token & Enforce Scope Permissions');

    try {
      await ApiIntegrationService.verifyApiToken(tokenGen.rawTokenSecret, 'admin:full');
      assert(false, 'Block API Token request missing required scope');
    } catch (err: any) {
      assert(err.message.includes('Forbidden'), 'Blocked API Token lacking required scope');
    }

    const auditLog = await ApiIntegrationService.logApiAccess({
      tokenId: tokenGen.tokenRecord.id,
      customerId: customer.id,
      endpoint: '/api/v1/customer/dpp/passports',
      httpMethod: 'GET',
      statusCode: 200,
      responseTimeMs: 14.2
    });
    assert(auditLog.statusCode === 200, 'Record API Access Audit Log');

    const revoked = await ApiIntegrationService.revokeApiToken(tokenGen.tokenRecord.id);
    assert(revoked.status === 'REVOKED', 'Revoke API Token');

    try {
      await ApiIntegrationService.verifyApiToken(tokenGen.rawTokenSecret, 'read:dpp');
      assert(false, 'Block request with revoked API Token');
    } catch (err: any) {
      assert(err.message.includes('revoked'), 'Blocked request with revoked API Token');
    }

    // -------------------------------------------------------------------------
    // 6. MULTI-COMPANY BRANDING & WEBHOOKS
    // -------------------------------------------------------------------------
    console.log('\n6. Testing Multi-Company Branding & Webhooks...');

    const branding = await ApiIntegrationService.updateCompanyBranding({
      companyId: 'company_baher_gold_silver',
      companyNameAr: 'مصنع الباهر للفضيات الإيطالية 925',
      companyNameEn: 'Baher Silver Italian Jewelry Factory',
      logoUrl: 'assets/baher_custom_logo.png',
      primaryColor: '#D97706',
      secondaryColor: '#0891B2',
      customDomain: 'portal.bahersilver.com'
    });
    assert(branding.primaryColor === '#D97706' && branding.customDomain === 'portal.bahersilver.com', 'Update Multi-Company White-Label Branding');

    const fetchedBranding = await ApiIntegrationService.getCompanyBranding('company_baher_gold_silver');
    assert(fetchedBranding.companyNameAr === 'مصنع الباهر للفضيات الإيطالية 925', 'Retrieve Multi-Company Branding Configuration');

    const webhook = await ApiIntegrationService.registerWebhook({
      name: 'تنبيهات نشر جوازات السفر الرقمية',
      targetUrl: 'https://api.bahersilver.com/webhooks/dpp-events',
      subscribedEvents: ['dpp.published', 'service.resolved', 'warranty.claimed']
    });
    assert(webhook.secretToken.startsWith('whsec_') && webhook.isActive === true, 'Register Webhook Subscription');

    const retentionPolicies = await ApiIntegrationService.getRetentionPolicies('default-company');
    assert(retentionPolicies.length >= 3, 'Data Retention Policies retrieved');

    // -------------------------------------------------------------------------
    // 7. SYSTEM HEALTH & EXTENDED DEVICE MONITORING
    // -------------------------------------------------------------------------
    console.log('\n7. Testing System Health & Hardware Monitoring...');

    const systemHealth = await SystemHealthService.getSystemHealthSummary();
    assert(systemHealth.systemStatus === 'HEALTHY', 'Real-Time System Health Summary status is HEALTHY');
    assert(systemHealth.storageUsage.totalDatabaseRecords > 0, 'Storage Usage & Database Records calculated');
    assert(systemHealth.apiUsageDashboard.averageLatencyMs > 0, 'API Usage & Latency metrics calculated');
    assert(systemHealth.hardwareIntegrationStatus.devices.length >= 3, 'Hardware Devices & Extended Monitoring metadata (RSSI, Battery, Subnet, Uptime) calculated');

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

runSprint6Tests();

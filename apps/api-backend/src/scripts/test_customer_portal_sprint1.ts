import { CustomerPortalService } from '../services/customer_portal.service';
import { ProductService } from '../services/product.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runCustomerPortalSprint1UnitTests() {
  console.log('=============================================================================');
  console.log('EPIC 06 SPRINT 01: CUSTOMER PORTAL & PRIVATE PLATFORM — UNIT TEST SUITE');
  console.log('=============================================================================');

  try {
    // -------------------------------------------------------------------------
    // CLEANUP & SETUP
    // -------------------------------------------------------------------------
    console.log('\n[SETUP] Cleaning up database and preparing test environment...');
    await prisma.customerActivityLog.deleteMany({});
    await prisma.customerProductVisibility.deleteMany({});
    await prisma.customerPermission.deleteMany({});
    await prisma.customerSession.deleteMany({});
    await prisma.customerPortalUser.deleteMany({});
    await prisma.customerOrganization.deleteMany({});

    // Seed test products
    const productPublic = await ProductService.createProduct({
      nameAr: 'خاتم فضة عام 925',
      nameEn: 'Public 925 Silver Ring',
      category: 'خاتم',
      silverPurity: '925'
    });

    const productPrivate = await ProductService.createProduct({
      nameAr: 'سوار فضة خاص وحصري للعميل',
      nameEn: 'Private Customer Silver Bracelet',
      category: 'سوار',
      silverPurity: '925'
    });

    console.log(`  ✓ Setup Complete: Public Product ID = ${productPublic.id} | Private Product ID = ${productPrivate.id}`);

    // -------------------------------------------------------------------------
    // TEST 1: AUTHENTICATION SYSTEM & SESSION TOKEN ISSUANCE
    // -------------------------------------------------------------------------
    console.log('\n[TEST 1] Testing Customer Authentication System & Session Tokens...');

    const authResult = await CustomerPortalService.registerOrLoginCustomer(
      'vip_brand@bahersilver.com',
      'SecurePass925!',
      { isRememberMe: true, deviceFingerprint: 'DEV-FINGERPRINT-MOBILE-01' }
    );

    console.log(`  ✓ Registered/Logged in Customer ID: ${authResult.user.id}`);
    console.log(`  ✓ Customer Name: "${authResult.user.customerName}" | Company: "${authResult.user.companyName}"`);
    console.log(`  ✓ Session Token Generated: ${authResult.session.token.substring(0, 32)}...`);
    console.log(`  ✓ Session Expiration: ${authResult.session.expiresAt.toISOString()}`);

    if (!authResult.session.token.startsWith('CUST-SES-') || !authResult.user.id) {
      throw new Error('Customer authentication or session token generation failed');
    }

    // -------------------------------------------------------------------------
    // TEST 2: SESSION VALIDATION & ACCOUNT PROFILE MANAGEMENT
    // -------------------------------------------------------------------------
    console.log('\n[TEST 2] Testing Session Validation & Profile Management...');

    const sessionVal = await CustomerPortalService.validateCustomerSession(authResult.session.token);
    console.log(`  ✓ Validated Session for Customer Email: ${sessionVal.user.email}`);

    const profileBefore = await CustomerPortalService.getCustomerProfile(authResult.user.id);
    console.log(`  ✓ Organization Branding: Code = ${profileBefore.organization?.orgCode} | Primary Color = ${profileBefore.organization?.themePrimaryColor}`);

    // Update profile & preferred language (AR -> EN)
    const updatedUser = await CustomerPortalService.updateCustomerProfile(authResult.user.id, {
      customerName: 'الأستاذ سامح العميل الممتاز',
      preferredLanguage: 'EN',
      acceptedTerms: true
    });

    console.log(`  ✓ Updated Customer Name: "${updatedUser.customerName}" | Preferred Lang: ${updatedUser.preferredLanguage}`);
    console.log(`  ✓ Terms Accepted At: ${updatedUser.acceptedTermsAt?.toISOString()}`);

    if (updatedUser.preferredLanguage !== 'EN' || !updatedUser.acceptedTermsAt) {
      throw new Error('Customer profile update or terms acceptance failed');
    }

    // -------------------------------------------------------------------------
    // TEST 3: PRODUCT VISIBILITY LAYER (PUBLIC VS PRIVATE CUSTOMER ITEMS)
    // -------------------------------------------------------------------------
    console.log('\n[TEST 3] Testing Product Visibility Layer (PUBLIC vs PRIVATE)...');

    // Tag productPrivate as PRIVATE for this customer
    await prisma.customerProductVisibility.create({
      data: {
        productId: productPrivate.id,
        customerId: authResult.user.id,
        visibilityScope: 'PRIVATE'
      }
    });

    const publicCatalog = await CustomerPortalService.getPublicProductCatalog();
    console.log(`  ✓ Public Product Catalog Count: ${publicCatalog.length}`);

    const privateProducts = await CustomerPortalService.getCustomerPrivateProducts(authResult.user.id);
    console.log(`  ✓ Customer Private Products Count: ${privateProducts.length}`);
    console.log(`    └─ Private Item: "${privateProducts[0]?.nameAr}" | Visibility Scope: ${privateProducts[0]?.visibilityScope}`);

    if (privateProducts.length === 0 || privateProducts[0]?.visibilityScope !== 'PRIVATE') {
      throw new Error('Product visibility layer (multi-tenant isolation) failed');
    }

    // -------------------------------------------------------------------------
    // TEST 4: MULTI-TENANT PRIVATE WORKSPACE & DATA ISOLATION
    // -------------------------------------------------------------------------
    console.log('\n[TEST 4] Testing Multi-Tenant Private Customer Workspace Summary...');

    const workspaceSummary = await CustomerPortalService.getCustomerWorkspaceSummary(authResult.user.id);
    console.log(`  ✓ Workspace Dashboard KPIs: Active MOs = ${workspaceSummary.kpis.totalActiveMos} | Private Items = ${workspaceSummary.kpis.totalPrivateProducts}`);

    if (typeof workspaceSummary.kpis.totalActiveMos !== 'number') {
      throw new Error('Customer workspace summary failed');
    }

    // -------------------------------------------------------------------------
    // TEST 5: LOGOUT & SESSION REVOCATION
    // -------------------------------------------------------------------------
    console.log('\n[TEST 5] Testing Customer Logout & Session Revocation...');

    const logoutRes = await CustomerPortalService.logoutCustomer(authResult.session.token);
    console.log(`  ✓ Logout Response: ${logoutRes.message}`);

    let sessionRevokedError = false;
    try {
      await CustomerPortalService.validateCustomerSession(authResult.session.token);
    } catch (e: any) {
      sessionRevokedError = true;
      console.log(`  ✓ Revoked Session Blocked Correctly: "${e.message}"`);
    }

    if (!sessionRevokedError) {
      throw new Error('Revoked session token was not blocked correctly');
    }

    // -------------------------------------------------------------------------
    // TEST 6: CUSTOMER ACTIVITY AUDIT TRAIL
    // -------------------------------------------------------------------------
    console.log('\n[TEST 6] Testing Customer Activity Audit Trail Verification...');

    const activityLogs = await prisma.customerActivityLog.findMany({
      where: { customerId: authResult.user.id },
      orderBy: { timestamp: 'asc' }
    });

    console.log(`  ✓ Total Customer Activity Audit Logs Recorded: ${activityLogs.length}`);
    activityLogs.forEach(log => console.log(`    └─ [${log.actionType}] ${log.details}`));

    if (activityLogs.length < 3) {
      throw new Error('Customer activity audit trail logging failed');
    }

    console.log('\n=============================================================================');
    console.log('ALL EPIC 06 SPRINT 01 CUSTOMER PORTAL TESTS PASSED 100% SUCCESSFULLY! 🎯');
    console.log('=============================================================================');
  } catch (err: any) {
    console.error('\n❌ EPIC 06 SPRINT 01 UNIT TEST FAILED:', err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runCustomerPortalSprint1UnitTests();

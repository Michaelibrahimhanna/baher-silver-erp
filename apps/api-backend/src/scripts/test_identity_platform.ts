import { IdentityPlatformService } from '../services/identity_platform.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runIdentityPlatformTests() {
  console.log('=============================================================================');
  console.log('EPIC 02: PRODUCT IDENTITY PLATFORM — AUTOMATED UNIT & INTEGRATION TEST SUITE');
  console.log('=============================================================================');

  try {
    // Test 1: Product Model Creation & Immutable SKU Generation
    console.log('\n[TEST 1] Creating Product Model & Generating Immutable SKU...');
    const model = await IdentityPlatformService.createProductModel({
      nameAr: 'خاتم ملكي فضة عيار 925 مطعم بياقوت',
      nameEn: 'Sterling Silver Royal Ring with Ruby',
      category: 'RNG',
      silverPurity: '925',
      silverWeightGrams: 5.5
    });
    console.log(`  ✓ Product Model Created! ID: ${model.id} | SKU: ${model.productCode}`);
    if (!model.productCode.startsWith('BS-RNG-')) throw new Error('SKU format invalid');

    // Test 2: Physical Piece Creation & Identity Creation Policy
    console.log('\n[TEST 2] Creating Physical Piece Serial (SN-xxxxxx)...');
    const piece = await IdentityPlatformService.createPhysicalPiece({
      productModelId: model.id,
      weightGrams: 5.5,
      silverPurity: '925',
      notes: 'اختبار وحدة التكويد'
    });
    console.log(`  ✓ Physical Piece Created! UUID: ${piece.id}`);
    console.log(`  ✓ Serial No: ${piece.serialNo} | SKU: ${piece.sku}`);
    console.log(`  ✓ Initial Status: ${piece.status} | Token: ${piece.verificationToken.slice(0, 16)}...`);

    if (!piece.serialNo.startsWith('SN-')) throw new Error('Serial No format invalid');
    if (piece.sku !== model.productCode) throw new Error('Piece SKU does not match Product Model SKU');
    if (piece.status !== 'ACTIVE') throw new Error('Piece initial status should be ACTIVE for weight > 0');

    // Test 3: "Identity Never Changes" Immutability Policy Enforcement
    console.log('\n[TEST 3] Testing "Identity Never Changes" Policy Enforcement...');
    try {
      await IdentityPlatformService.updatePhysicalPiece(piece.id, {
        serialNo: 'SN-ILLEGAL-OVERWRITE-999'
      });
      throw new Error('FAIL: Immutability policy failed to block serialNo alteration!');
    } catch (err: any) {
      if (err.message.startsWith('IDENTITY_IMMUTABLE')) {
        console.log(`  ✓ SUCCESS: Immutability Policy correctly blocked serialNo mutation! (${err.message})`);
      } else {
        throw err;
      }
    }

    try {
      await IdentityPlatformService.updatePhysicalPiece(piece.id, {
        sku: 'BS-MUTATE-SKU-999'
      });
      throw new Error('FAIL: Immutability policy failed to block SKU alteration!');
    } catch (err: any) {
      if (err.message.startsWith('IDENTITY_IMMUTABLE')) {
        console.log(`  ✓ SUCCESS: Immutability Policy correctly blocked SKU mutation! (${err.message})`);
      } else {
        throw err;
      }
    }

    // Test 4: Piece Lifecycle Status Transitions
    console.log('\n[TEST 4] Testing Piece Lifecycle Status Transitions...');
    const statusesToTest = ['RESERVED', 'SOLD', 'REPAIR', 'MELTED'] as const;
    for (const targetStatus of statusesToTest) {
      const transitioned = await IdentityPlatformService.transitionPieceStatus(
        piece.id,
        targetStatus,
        'مدير النظام (اختبار)',
        `الانتقال إلى حالة ${targetStatus}`
      );
      console.log(`  ✓ Transitioned status: ${piece.status} ➔ ${transitioned.status}`);
      if (transitioned.status !== targetStatus) throw new Error(`Transition failed for ${targetStatus}`);
    }

    // Test 5: Reprint Tag Capability Without Altering Identity
    console.log('\n[TEST 5] Testing Tag Reprinting Without Identity Alteration...');
    const reprinted = await IdentityPlatformService.reprintTagIdentity(
      piece.id,
      'أمين المخزن (علي)',
      'استبدال بطاقة تالفة بسبب التلميع'
    );
    console.log(`  ✓ Reprint Executed! Reprint Count: ${reprinted.reprintCount}`);
    console.log(`  ✓ Serial No Remains Unchanged: ${reprinted.serialNo}`);
    console.log(`  ✓ SKU Remains Unchanged: ${reprinted.sku}`);
    console.log(`  ✓ UUID Remains Unchanged: ${reprinted.id}`);

    if (reprinted.reprintCount !== 1) throw new Error('Reprint count should be 1');
    if (reprinted.serialNo !== piece.serialNo || reprinted.sku !== piece.sku) {
      throw new Error('FAIL: Identity was altered during reprint!');
    }

    // Test 6: Fetch Complete Timeline Ledger
    console.log('\n[TEST 6] Fetching Complete Piece Identity Timeline...');
    const fullPiece = await IdentityPlatformService.getPhysicalPieceById(piece.serialNo);
    console.log(`  ✓ Total Lifecycle Events Logged: ${fullPiece?.lifecycleEvents.length}`);
    console.log(`  ✓ Total Reprint Logs: ${fullPiece?.reprintLogs.length}`);

    console.log('\n=============================================================================');
    console.log('ALL 6 AUTOMATED UNIT & INTEGRATION TESTS PASSED 100% SUCCESSFULLY! 🎯');
    console.log('=============================================================================');
  } catch (err: any) {
    console.error('\n❌ UNIT TEST FAILED:', err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runIdentityPlatformTests();

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Baher Silver ERP Warehouse System...');

  // 1. Create Default Company
  const company = await prisma.company.upsert({
    where: { companyCode: 'BAHER-SILVER' },
    update: {},
    create: {
      id: 'default-company',
      companyCode: 'BAHER-SILVER',
      nameAr: 'مصنع باهر سيلفر لصناعة الفضة',
      nameEn: 'Baher Silver Factory',
      taxNumber: '100-294-883',
      currencyCode: 'EGP'
    }
  });

  // 2. Main Warehouse Structure (7 Warehouses - NO GOLD)
  const warehousesData = [
    { code: 'WH-SILVER', nameAr: 'مخزن الفضة (Silver Warehouse)', nameEn: 'Silver Warehouse', type: 'SILVER', securityLevel: 5 },
    { code: 'WH-STONES', nameAr: 'مخزن الأحجار (Stones Warehouse)', nameEn: 'Stones Warehouse', type: 'STONES', securityLevel: 5 },
    { code: 'WH-RAW', nameAr: 'مخزن الخامات (Raw Materials Warehouse)', nameEn: 'Raw Materials Warehouse', type: 'RAW_MATERIALS', securityLevel: 3 },
    { code: 'WH-CHEMICALS', nameAr: 'مخزن الكيماويات (Chemicals Warehouse)', nameEn: 'Chemicals Warehouse', type: 'CHEMICALS', securityLevel: 4 },
    { code: 'WH-COMPONENTS', nameAr: 'مخزن المكونات (Components Warehouse)', nameEn: 'Components Warehouse', type: 'COMPONENTS', securityLevel: 3 },
    { code: 'WH-SEMI', nameAr: 'مخزن نصف المصنع (Semi Finished Warehouse)', nameEn: 'Semi Finished Warehouse', type: 'SEMI_FINISHED', securityLevel: 3 },
    { code: 'WH-FINISHED', nameAr: 'مخزن المنتجات التامة (Finished Products Warehouse)', nameEn: 'Finished Products Warehouse', type: 'FINISHED_PRODUCTS', securityLevel: 4 }
  ];

  const createdWarehouses: Record<string, string> = {};
  for (const w of warehousesData) {
    const wh = await prisma.warehouse.upsert({
      where: { code: w.code },
      update: { nameAr: w.nameAr, nameEn: w.nameEn, type: w.type, securityLevel: w.securityLevel },
      create: {
        companyId: company.id,
        code: w.code,
        nameAr: w.nameAr,
        nameEn: w.nameEn,
        type: w.type,
        securityLevel: w.securityLevel,
        capacityPct: 45.0
      }
    });
    createdWarehouses[w.code] = wh.id;
  }

  // 3. Hierarchical Storage Locations (Cabinet -> Shelf -> Drawer -> Box -> Bag)
  const stonesWhId = createdWarehouses['WH-STONES'];
  const rawWhId = createdWarehouses['WH-RAW'];

  // Cabinet A in Stones Store
  const locCabA = await prisma.storageLocation.upsert({
    where: { binCode: 'BIN-STN-CAB-A' },
    update: {},
    create: {
      companyId: company.id,
      warehouseId: stonesWhId,
      binCode: 'BIN-STN-CAB-A',
      locationName: 'دولاب الأحجار الكريمة A',
      cabinet: 'دولاب A',
      fullPathAr: 'المخزن الرئيسي ➔ مخزن الأحجار ➔ دولاب A',
      barcode: '629104857001',
      qrCode: 'QR-LOC-STN-CAB-A'
    }
  });

  // Shelf 1 under Cabinet A
  const locShelf1 = await prisma.storageLocation.upsert({
    where: { binCode: 'BIN-STN-CAB-A-SH1' },
    update: {},
    create: {
      companyId: company.id,
      warehouseId: stonesWhId,
      parentLocationId: locCabA.id,
      binCode: 'BIN-STN-CAB-A-SH1',
      locationName: 'رف 1 الياقوت والزمرد',
      cabinet: 'دولاب A',
      shelf: 'رف 1',
      fullPathAr: 'المخزن الرئيسي ➔ مخزن الأحجار ➔ دولاب A ➔ رف 1',
      barcode: '629104857002',
      qrCode: 'QR-LOC-STN-CAB-A-SH1'
    }
  });

  // Drawer 3 under Shelf 1
  const locDrawer3 = await prisma.storageLocation.upsert({
    where: { binCode: 'BIN-STN-A-1-DR3' },
    update: {},
    create: {
      companyId: company.id,
      warehouseId: stonesWhId,
      parentLocationId: locShelf1.id,
      binCode: 'BIN-STN-A-1-DR3',
      locationName: 'درج 3 الأحجار الفاخرة',
      cabinet: 'دولاب A',
      shelf: 'رف 1',
      drawer: 'درج 3',
      fullPathAr: 'المخزن الرئيسي ➔ مخزن الأحجار ➔ دولاب A ➔ رف 1 ➔ درج 3',
      barcode: '629104857003',
      qrCode: 'QR-LOC-STN-A-1-DR3'
    }
  });

  // Box 5 under Drawer 3
  const locBox5 = await prisma.storageLocation.upsert({
    where: { binCode: 'BIN-STN-A-1-3-BX5' },
    update: {},
    create: {
      companyId: company.id,
      warehouseId: stonesWhId,
      parentLocationId: locDrawer3.id,
      binCode: 'BIN-STN-A-1-3-BX5',
      locationName: 'علبة 5 الأحجار البيضاوية',
      cabinet: 'دولاب A',
      shelf: 'رف 1',
      drawer: 'درج 3',
      box: 'علبة 5',
      fullPathAr: 'المخزن الرئيسي ➔ مخزن الأحجار ➔ دولاب A ➔ رف 1 ➔ درج 3 ➔ علبة 5',
      barcode: '629104857004',
      qrCode: 'QR-LOC-STN-A-1-3-BX5'
    }
  });

  // Bag 12 under Box 5
  const locBag12 = await prisma.storageLocation.upsert({
    where: { binCode: 'BIN-STN-A-1-3-5-BG12' },
    update: {},
    create: {
      companyId: company.id,
      warehouseId: stonesWhId,
      parentLocationId: locBox5.id,
      binCode: 'BIN-STN-A-1-3-5-BG12',
      locationName: 'كيس 12 ياقوت أحمر بورمي 8x6',
      cabinet: 'دولاب A',
      shelf: 'رف 1',
      drawer: 'درج 3',
      box: 'علبة 5',
      bag: 'كيس 12',
      fullPathAr: 'المخزن الرئيسي ➔ مخزن الأحجار ➔ دولاب A ➔ رف 1 ➔ درج 3 ➔ علبة 5 ➔ كيس 12',
      barcode: '629104857005',
      qrCode: 'QR-LOC-STN-A-1-3-5-BG12'
    }
  });

  // Raw Materials Location
  const locRaw1 = await prisma.storageLocation.upsert({
    where: { binCode: 'BIN-RAW-WAX-01' },
    update: {},
    create: {
      companyId: company.id,
      warehouseId: rawWhId,
      binCode: 'BIN-RAW-WAX-01',
      locationName: 'رف شمع الصب 1',
      cabinet: 'دولاب الخامات C',
      shelf: 'رف 2',
      fullPathAr: 'المخزن الرئيسي ➔ مخزن الخامات ➔ دولاب C ➔ رف 2',
      barcode: '629104857010',
      qrCode: 'QR-LOC-RAW-WAX-01'
    }
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

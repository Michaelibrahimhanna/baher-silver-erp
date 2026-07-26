import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Phase 15 Relational Master Data Enhancements...');

  // 1. Supplier Profiles
  const suppliers = [
    {
      supplierCode: 'SUP-BK-001',
      companyNameAr: 'بورصة بانكوك للأحجار الكريمة',
      companyNameEn: 'Bangkok Gem Exchange Co.',
      contactPerson: 'Somchai Prasert',
      phone: '+66-2-123-4567',
      email: 'sales@bangkokgem.com',
      country: 'تايلاند',
      currency: 'USD',
      defaultStoneCategories: '["PRECIOUS","SEMI_PRECIOUS","SWISS_ZIRCON"]',
      paymentTerms: 'Net 30',
      leadTimeDays: 10,
      rating: 4.9,
      certificates: 'GIA & AIGS Certified Gemological Laboratory'
    },
    {
      supplierCode: 'SUP-LK-002',
      companyNameAr: 'شركة سريلانكا للأحجار الكريمة',
      companyNameEn: 'Ceylon Sapphire Exporters Ltd.',
      contactPerson: 'Kanishka Fernando',
      phone: '+94-11-987-6543',
      email: 'info@ceylonsapphire.lk',
      country: 'سريلانكا',
      currency: 'USD',
      defaultStoneCategories: '["PRECIOUS"]',
      paymentTerms: 'Net 15',
      leadTimeDays: 14,
      rating: 4.8,
      certificates: 'National Gem and Jewellery Authority Certified'
    },
    {
      supplierCode: 'SUP-AMANA-003',
      companyNameAr: 'شركة الأمانة لتصفية وسحب الفضة',
      companyNameEn: 'Al-Amana Silver Refinery',
      contactPerson: 'الحاج أحمد الأمانة',
      phone: '+20-2-2590-1122',
      email: 'supply@al-amana-silver.com',
      country: 'مصر',
      currency: 'EGP',
      defaultRawCategories: '["CASTING_WAX","INVESTMENT_GYPSUM","FLUX"]',
      paymentTerms: 'Cash on Delivery (الدفع عند الاستلام)',
      leadTimeDays: 2,
      rating: 5.0,
      certificates: 'معتمد من مصلحة دمغ المصوغات والموازين المصرية'
    }
  ];

  for (const sup of suppliers) {
    await prisma.supplierProfile.upsert({
      where: { supplierCode: sup.supplierCode },
      update: sup,
      create: sup
    });
  }

  // 2. Smart Size Library (Linked to Shapes via metadata)
  const sizesWithShapeMetadata = [
    { code: 'SZ_R_0_8MM', nameAr: '0.8 mm (دائري)', nameEn: '0.8 mm Round', metadata: JSON.stringify({ shapeCode: 'ROUND', shapeAr: 'دائري' }) },
    { code: 'SZ_R_1MM', nameAr: '1 mm (دائري)', nameEn: '1 mm Round', metadata: JSON.stringify({ shapeCode: 'ROUND', shapeAr: 'دائري' }) },
    { code: 'SZ_R_1_2MM', nameAr: '1.2 mm (دائري)', nameEn: '1.2 mm Round', metadata: JSON.stringify({ shapeCode: 'ROUND', shapeAr: 'دائري' }) },
    { code: 'SZ_R_1_5MM', nameAr: '1.5 mm (دائري)', nameEn: '1.5 mm Round', metadata: JSON.stringify({ shapeCode: 'ROUND', shapeAr: 'دائري' }) },
    { code: 'SZ_R_2MM', nameAr: '2 mm (دائري)', nameEn: '2 mm Round', metadata: JSON.stringify({ shapeCode: 'ROUND', shapeAr: 'دائري' }) },
    { code: 'SZ_R_3MM', nameAr: '3 mm (دائري)', nameEn: '3 mm Round', metadata: JSON.stringify({ shapeCode: 'ROUND', shapeAr: 'دائري' }) },
    { code: 'SZ_O_4X3MM', nameAr: '4x3 mm (بيضاوي)', nameEn: '4x3 mm Oval', metadata: JSON.stringify({ shapeCode: 'OVAL', shapeAr: 'بيضاوي' }) },
    { code: 'SZ_O_5X3MM', nameAr: '5x3 mm (بيضاوي)', nameEn: '5x3 mm Oval', metadata: JSON.stringify({ shapeCode: 'OVAL', shapeAr: 'بيضاوي' }) },
    { code: 'SZ_O_6X4MM', nameAr: '6x4 mm (بيضاوي)', nameEn: '6x4 mm Oval', metadata: JSON.stringify({ shapeCode: 'OVAL', shapeAr: 'بيضاوي' }) },
    { code: 'SZ_O_7X5MM', nameAr: '7x5 mm (بيضاوي)', nameEn: '7x5 mm Oval', metadata: JSON.stringify({ shapeCode: 'OVAL', shapeAr: 'بيضاوي' }) },
    { code: 'SZ_O_8X6MM', nameAr: '8x6 mm (بيضاوي)', nameEn: '8x6 mm Oval', metadata: JSON.stringify({ shapeCode: 'OVAL', shapeAr: 'بيضاوي' }) },
    { code: 'SZ_P_5X3MM', nameAr: '5x3 mm (كمثرى)', nameEn: '5x3 mm Pear', metadata: JSON.stringify({ shapeCode: 'PEAR', shapeAr: 'كمثرى' }) },
    { code: 'SZ_P_6X4MM', nameAr: '6x4 mm (كمثرى)', nameEn: '6x4 mm Pear', metadata: JSON.stringify({ shapeCode: 'PEAR', shapeAr: 'كمثرى' }) },
    { code: 'SZ_P_7X5MM', nameAr: '7x5 mm (كمثرى)', nameEn: '7x5 mm Pear', metadata: JSON.stringify({ shapeCode: 'PEAR', shapeAr: 'كمثرى' }) }
  ];

  for (const s of sizesWithShapeMetadata) {
    await prisma.masterItem.upsert({
      where: { category_code: { category: 'SIZE', code: s.code } },
      update: { nameAr: s.nameAr, nameEn: s.nameEn, metadata: s.metadata },
      create: { category: 'SIZE', code: s.code, nameAr: s.nameAr, nameEn: s.nameEn, metadata: s.metadata }
    });
  }

  // 3. Stone Family Hierarchy (Category -> Type -> Family -> Variant)
  const preciousCategory = await prisma.masterItem.findUnique({ where: { category_code: { category: 'STONE_CATEGORY', code: 'PRECIOUS' } } });
  const rubyType = await prisma.masterItem.findUnique({ where: { category_code: { category: 'STONE_TYPE', code: 'RUBY' } } });

  if (preciousCategory && rubyType) {
    // Update Ruby Parent to Precious Category
    await prisma.masterItem.update({
      where: { id: rubyType.id },
      data: { parentId: preciousCategory.id }
    });

    // Add Families under Ruby Type
    const rubyFamilies = [
      { code: 'RUBY_PIGEON_BLOOD', nameAr: 'ياقوت دم الحمام (Pigeon Blood)', nameEn: 'Pigeon Blood Ruby' },
      { code: 'RUBY_ROYAL_RED', nameAr: 'ياقوت ملكي أحمر (Royal Red)', nameEn: 'Royal Red Ruby' },
      { code: 'RUBY_PINK_RED', nameAr: 'ياقوت وردي (Pink Red Ruby)', nameEn: 'Pink Red Ruby' },
      { code: 'RUBY_DARK_RED', nameAr: 'ياقوت أحمر داكن (Dark Red Ruby)', nameEn: 'Dark Red Ruby' }
    ];

    for (const fam of rubyFamilies) {
      await prisma.masterItem.upsert({
        where: { category_code: { category: 'STONE_FAMILY', code: fam.code } },
        update: { nameAr: fam.nameAr, nameEn: fam.nameEn, parentId: rubyType.id },
        create: { category: 'STONE_FAMILY', code: fam.code, nameAr: fam.nameAr, nameEn: fam.nameEn, parentId: rubyType.id }
      });
    }
  }

  // 4. Quality Standards Metadata
  const aaaGrade = await prisma.masterItem.findUnique({ where: { category_code: { category: 'QUALITY_GRADE', code: 'AAA' } } });
  if (aaaGrade) {
    await prisma.masterItem.update({
      where: { id: aaaGrade.id },
      data: {
        metadata: JSON.stringify({
          allowedColors: ['أحمر', 'أزرق', 'أخضر', 'أبيض'],
          allowedCuts: ['Brilliant', 'Step', 'Mixed'],
          allowedClarity: ['VVS', 'IF'],
          allowedTreatments: ['طبيعي', 'طبيعي غير معالج']
        })
      }
    });
  }

  console.log('Phase 15 Relational Master Data Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('Phase 15 Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

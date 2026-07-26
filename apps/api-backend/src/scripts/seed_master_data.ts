import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const masterDataSeed = [
  // 1. Stone Categories
  { category: 'STONE_CATEGORY', code: 'PRECIOUS', nameAr: 'أحجار كريمة', nameEn: 'Precious Stones' },
  { category: 'STONE_CATEGORY', code: 'SEMI_PRECIOUS', nameAr: 'أحجار شبه كريمة', nameEn: 'Semi Precious Stones' },
  { category: 'STONE_CATEGORY', code: 'SYNTHETIC', nameAr: 'أحجار مصنعة', nameEn: 'Synthetic Stones' },
  { category: 'STONE_CATEGORY', code: 'SWISS_ZIRCON', nameAr: 'زركون سويسري', nameEn: 'Swiss Zircon' },
  { category: 'STONE_CATEGORY', code: 'PEARL', nameAr: 'لؤلؤ', nameEn: 'Pearls' },
  { category: 'STONE_CATEGORY', code: 'CRYSTAL', nameAr: 'كريستال', nameEn: 'Crystal' },
  { category: 'STONE_CATEGORY', code: 'BEADS', nameAr: 'خرز ومخرزات', nameEn: 'Beads' },
  { category: 'STONE_CATEGORY', code: 'OTHERS', nameAr: 'أصناف أخرى', nameEn: 'Others' },

  // 2. Stone Types
  { category: 'STONE_TYPE', code: 'RUBY', nameAr: 'ياقوت أحمر', nameEn: 'Ruby' },
  { category: 'STONE_TYPE', code: 'SAPPHIRE', nameAr: 'زفير أزرق', nameEn: 'Sapphire' },
  { category: 'STONE_TYPE', code: 'EMERALD', nameAr: 'زمرد أخضر', nameEn: 'Emerald' },
  { category: 'STONE_TYPE', code: 'AMETHYST', nameAr: 'جمشت (أميثيست)', nameEn: 'Amethyst' },
  { category: 'STONE_TYPE', code: 'TOPAZ', nameAr: 'توباز', nameEn: 'Topaz' },
  { category: 'STONE_TYPE', code: 'OPAL', nameAr: 'أوبال (عين الشمس)', nameEn: 'Opal' },
  { category: 'STONE_TYPE', code: 'ONYX', nameAr: 'أونيكس (عقيق أسود)', nameEn: 'Onyx' },
  { category: 'STONE_TYPE', code: 'QUARTZ', nameAr: 'كوارتز', nameEn: 'Quartz' },
  { category: 'STONE_TYPE', code: 'CUBIC_ZIRCO', nameAr: 'زركونيا مكعبة', nameEn: 'Cubic Zirconia' },
  { category: 'STONE_TYPE', code: 'PEARL_NAT', nameAr: 'لؤلؤ طبيعي / زراعي', nameEn: 'Pearl' },
  { category: 'STONE_TYPE', code: 'CRYSTAL_PURE', nameAr: 'كريستال نقي', nameEn: 'Crystal' },

  // 3. Colors
  { category: 'COLOR', code: 'WHITE', nameAr: 'أبيض', nameEn: 'White' },
  { category: 'COLOR', code: 'BLACK', nameAr: 'أسود', nameEn: 'Black' },
  { category: 'COLOR', code: 'RED', nameAr: 'أحمر', nameEn: 'Red' },
  { category: 'COLOR', code: 'BLUE', nameAr: 'أزرق', nameEn: 'Blue' },
  { category: 'COLOR', code: 'GREEN', nameAr: 'أخضر', nameEn: 'Green' },
  { category: 'COLOR', code: 'PINK', nameAr: 'وردي', nameEn: 'Pink' },
  { category: 'COLOR', code: 'PURPLE', nameAr: 'بنفسجي', nameEn: 'Purple' },
  { category: 'COLOR', code: 'YELLOW', nameAr: 'أصفر', nameEn: 'Yellow' },
  { category: 'COLOR', code: 'CHAMPAGNE', nameAr: 'شامبانيا', nameEn: 'Champagne' },
  { category: 'COLOR', code: 'MULTI_COLOR', nameAr: 'متعدد الألوان', nameEn: 'Multi Color' },

  // 4. Shapes
  { category: 'SHAPE', code: 'ROUND', nameAr: 'دائري', nameEn: 'Round' },
  { category: 'SHAPE', code: 'OVAL', nameAr: 'بيضاوي', nameEn: 'Oval' },
  { category: 'SHAPE', code: 'PEAR', nameAr: 'كمثرى', nameEn: 'Pear' },
  { category: 'SHAPE', code: 'PRINCESS', nameAr: 'برنسيس (مربع)', nameEn: 'Princess' },
  { category: 'SHAPE', code: 'EMERALD_CUT', nameAr: 'قطع زمردي', nameEn: 'Emerald' },
  { category: 'SHAPE', code: 'HEART', nameAr: 'قلب', nameEn: 'Heart' },
  { category: 'SHAPE', code: 'MARQUISE', nameAr: 'ماركيز', nameEn: 'Marquise' },
  { category: 'SHAPE', code: 'SQUARE', nameAr: 'مربع', nameEn: 'Square' },
  { category: 'SHAPE', code: 'RECTANGLE', nameAr: 'مستطيل', nameEn: 'Rectangle' },
  { category: 'SHAPE', code: 'TRILLION', nameAr: 'تريليون (مثلث)', nameEn: 'Trillion' },

  // 5. Sizes
  { category: 'SIZE', code: 'SZ_1MM', nameAr: '1 mm', nameEn: '1 mm' },
  { category: 'SIZE', code: 'SZ_1_2MM', nameAr: '1.2 mm', nameEn: '1.2 mm' },
  { category: 'SIZE', code: 'SZ_1_5MM', nameAr: '1.5 mm', nameEn: '1.5 mm' },
  { category: 'SIZE', code: 'SZ_2MM', nameAr: '2 mm', nameEn: '2 mm' },
  { category: 'SIZE', code: 'SZ_2_5MM', nameAr: '2.5 mm', nameEn: '2.5 mm' },
  { category: 'SIZE', code: 'SZ_3MM', nameAr: '3 mm', nameEn: '3 mm' },
  { category: 'SIZE', code: 'SZ_4X2MM', nameAr: '4x2 mm', nameEn: '4x2 mm' },
  { category: 'SIZE', code: 'SZ_5X3MM', nameAr: '5x3 mm', nameEn: '5x3 mm' },
  { category: 'SIZE', code: 'SZ_6X4MM', nameAr: '6x4 mm', nameEn: '6x4 mm' },
  { category: 'SIZE', code: 'SZ_8X6MM', nameAr: '8x6 mm', nameEn: '8x6 mm' },
  { category: 'SIZE', code: 'SZ_10X8MM', nameAr: '10x8 mm', nameEn: '10x8 mm' },

  // 6. Origins
  { category: 'ORIGIN', code: 'MYANMAR', nameAr: 'بورما / ميانمار', nameEn: 'Myanmar' },
  { category: 'ORIGIN', code: 'SRI_LANKA', nameAr: 'سريلانكا', nameEn: 'Sri Lanka' },
  { category: 'ORIGIN', code: 'THAILAND', nameAr: 'تايلاند', nameEn: 'Thailand' },
  { category: 'ORIGIN', code: 'INDIA', nameAr: 'الهند', nameEn: 'India' },
  { category: 'ORIGIN', code: 'BRAZIL', nameAr: 'البرازيل', nameEn: 'Brazil' },
  { category: 'ORIGIN', code: 'COLOMBIA', nameAr: 'كولومبيا', nameEn: 'Colombia' },
  { category: 'ORIGIN', code: 'CHINA', nameAr: 'الصين', nameEn: 'China' },
  { category: 'ORIGIN', code: 'SWITZERLAND', nameAr: 'سويسرا', nameEn: 'Switzerland' },
  { category: 'ORIGIN', code: 'CZECH', nameAr: 'التشيك', nameEn: 'Czech Republic' },
  { category: 'ORIGIN', code: 'EGYPT', nameAr: 'مصر', nameEn: 'Egypt' },

  // 7. Quality Grades
  { category: 'QUALITY_GRADE', code: 'AAA', nameAr: 'AAA (ممتاز جداً)', nameEn: 'AAA' },
  { category: 'QUALITY_GRADE', code: 'AA', nameAr: 'AA (ممتاز)', nameEn: 'AA' },
  { category: 'QUALITY_GRADE', code: 'A', nameAr: 'A (جيد)', nameEn: 'A' },
  { category: 'QUALITY_GRADE', code: 'PREMIUM', nameAr: 'Premium (فاخر)', nameEn: 'Premium' },
  { category: 'QUALITY_GRADE', code: 'COMMERCIAL', nameAr: 'Commercial (تجاري)', nameEn: 'Commercial' },
  { category: 'QUALITY_GRADE', code: 'VVS', nameAr: 'VVS (شبه خالي من الشوائب)', nameEn: 'VVS' },
  { category: 'QUALITY_GRADE', code: 'VS', nameAr: 'VS (شوائب بسيطة جداً)', nameEn: 'VS' },
  { category: 'QUALITY_GRADE', code: 'SI', nameAr: 'SI (شوائب بسيطة)', nameEn: 'SI' },

  // 8. Treatments
  { category: 'TREATMENT', code: 'NATURAL', nameAr: 'طبيعي', nameEn: 'Natural' },
  { category: 'TREATMENT', code: 'HEAT_TREATED', nameAr: 'معالج حرارياً', nameEn: 'Heat Treated' },
  { category: 'TREATMENT', code: 'FILLED', nameAr: 'معالج بالملء الزجاجي', nameEn: 'Filled' },
  { category: 'TREATMENT', code: 'DYED', nameAr: 'معالج بالصبغة', nameEn: 'Dyed' },
  { category: 'TREATMENT', code: 'COATED', nameAr: 'معالج بالتغليف السطحي', nameEn: 'Coated' },
  { category: 'TREATMENT', code: 'LAB_CREATED', nameAr: 'مصنع معملياً', nameEn: 'Lab Created' },
  { category: 'TREATMENT', code: 'UNTREATED', nameAr: 'طبيعي غير معالج', nameEn: 'Untreated' },

  // 9. Silver Purity
  { category: 'SILVER_PURITY', code: 'SIL_999', nameAr: '999 (فضة ناعمة سويسرية 99.9%)', nameEn: '999 Fine Silver' },
  { category: 'SILVER_PURITY', code: 'SIL_950', nameAr: '950 (فضة إيطالية 95.0%)', nameEn: '950 Italian Silver' },
  { category: 'SILVER_PURITY', code: 'SIL_925', nameAr: '925 (فضة استرليني 92.5%)', nameEn: '925 Sterling Silver' },
  { category: 'SILVER_PURITY', code: 'SIL_900', nameAr: '900 (فضة عيار 90.0%)', nameEn: '900 Coin Silver' },
  { category: 'SILVER_PURITY', code: 'SIL_800', nameAr: '800 (فضة عيار 80.0%)', nameEn: '800 Commercial Silver' },

  // 10. Raw Material Categories
  { category: 'RAW_CATEGORY', code: 'CASTING_WAX', nameAr: 'شمع الصب', nameEn: 'Casting Wax' },
  { category: 'RAW_CATEGORY', code: 'INVESTMENT_GYPSUM', nameAr: 'جبس الصب / الفلاسك', nameEn: 'Investment Gypsum' },
  { category: 'RAW_CATEGORY', code: 'BORAX', nameAr: 'بوراكس', nameEn: 'Borax' },
  { category: 'RAW_CATEGORY', code: 'FLUX', nameAr: 'مساعدات صهر', nameEn: 'Flux' },
  { category: 'RAW_CATEGORY', code: 'RESIN', nameAr: 'ريزن 3D', nameEn: 'Resin' },
  { category: 'RAW_CATEGORY', code: 'ACIDS', nameAr: 'أحماض تنظيف وطلاء', nameEn: 'Acids' },
  { category: 'RAW_CATEGORY', code: 'PLATING_MATS', nameAr: 'مواد طلاء (روديوم/فضة)', nameEn: 'Plating Materials' },
  { category: 'RAW_CATEGORY', code: 'POLISHING_COMPS', nameAr: 'مواد تلميع وصنفرة', nameEn: 'Polishing Compounds' },
  { category: 'RAW_CATEGORY', code: 'CLEANING_MATS', nameAr: 'مواد تنظيف الكتروسونيك', nameEn: 'Cleaning Materials' },
  { category: 'RAW_CATEGORY', code: 'PACKAGING', nameAr: 'مواد تعبئة وتغليف', nameEn: 'Packaging' },

  // 11. Units
  { category: 'UNIT', code: 'GRAM', nameAr: 'جرام (g)', nameEn: 'Gram' },
  { category: 'UNIT', code: 'KILOGRAM', nameAr: 'كيلوجرام (kg)', nameEn: 'Kilogram' },
  { category: 'UNIT', code: 'PIECE', nameAr: 'قطعة (pcs)', nameEn: 'Piece' },
  { category: 'UNIT', code: 'LITER', nameAr: 'لتر (L)', nameEn: 'Liter' },
  { category: 'UNIT', code: 'MILLILITER', nameAr: 'ملليلتر (mL)', nameEn: 'Milliliter' },
  { category: 'UNIT', code: 'METER', nameAr: 'متر (m)', nameEn: 'Meter' },
  { category: 'UNIT', code: 'ROLL', nameAr: 'رول', nameEn: 'Roll' },
  { category: 'UNIT', code: 'BOX', nameAr: 'صندوق / كرتونة', nameEn: 'Box' },
  { category: 'UNIT', code: 'BAG', nameAr: 'كيس', nameEn: 'Bag' },
  { category: 'UNIT', code: 'BOTTLE', nameAr: 'زجاجة', nameEn: 'Bottle' },

  // 12. Warehouse Types
  { category: 'WAREHOUSE_TYPE', code: 'SILVER_STORE', nameAr: 'مخزن الفضة (Silver Warehouse)', nameEn: 'Silver Warehouse' },
  { category: 'WAREHOUSE_TYPE', code: 'STONE_STORE', nameAr: 'مخزن الأحجار (Stone Warehouse)', nameEn: 'Stone Warehouse' },
  { category: 'WAREHOUSE_TYPE', code: 'RAW_STORE', nameAr: 'مخزن الخامات (Raw Material Warehouse)', nameEn: 'Raw Material Warehouse' },
  { category: 'WAREHOUSE_TYPE', code: 'CHEMICAL_STORE', nameAr: 'مخزن الكيماويات (Chemical Warehouse)', nameEn: 'Chemical Warehouse' },
  { category: 'WAREHOUSE_TYPE', code: 'COMPONENTS_STORE', nameAr: 'مخزن المكونات (Components Warehouse)', nameEn: 'Components Warehouse' },
  { category: 'WAREHOUSE_TYPE', code: 'SEMI_STORE', nameAr: 'مخزن نصف المصنع (Semi Finished Warehouse)', nameEn: 'Semi Finished Warehouse' },
  { category: 'WAREHOUSE_TYPE', code: 'FINISHED_STORE', nameAr: 'مخزن المنتجات التامة (Finished Goods Warehouse)', nameEn: 'Finished Goods Warehouse' }
];

async function seedMasterData() {
  console.log('Seeding Master Data Center reference entries...');

  for (const item of masterDataSeed) {
    await prisma.masterItem.upsert({
      where: {
        category_code: {
          category: item.category,
          code: item.code
        }
      },
      update: {
        nameAr: item.nameAr,
        nameEn: item.nameEn
      },
      create: {
        category: item.category,
        code: item.code,
        nameAr: item.nameAr,
        nameEn: item.nameEn,
        isActive: true
      }
    });
  }

  console.log(`Successfully seeded ${masterDataSeed.length} Master Data items across 12 modules!`);
}

seedMasterData()
  .catch((e) => {
    console.error('Master Data Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

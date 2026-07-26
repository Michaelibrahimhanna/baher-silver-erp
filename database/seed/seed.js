/**
 * Baher Silver ERP - Master Database Seeder Script
 * Seeds standard Chart of Accounts, 7 Enterprise Warehouses, and Initial Silver/Raw Items.
 */

const DEFAULT_CHART_OF_ACCOUNTS = [
  { code: '1101', nameAr: 'مخزون الأحجار الكريمة', nameEn: 'Gemstone Inventory', category: 'ASSET', balanceType: 'DEBIT', balance: 5000 },
  { code: '1102', nameAr: 'مخزون الخامات والمستلزمات', nameEn: 'Raw Material Inventory', category: 'ASSET', balanceType: 'DEBIT', balance: 1500 },
  { code: '1103', nameAr: 'الخزينة والصندوق الرئيسي', nameEn: 'Cash & Main Vault', category: 'ASSET', balanceType: 'DEBIT', balance: 250000 },
  { code: '1105', nameAr: 'مخزون الفضة الخام والسبائك', nameEn: 'Raw Silver & Bullion Inventory', category: 'ASSET', balanceType: 'DEBIT', balance: 325000 },
  { code: '2101', nameAr: 'دائنون - حسابات الموردين', nameEn: 'Accounts Payable', category: 'LIABILITY', balanceType: 'CREDIT', balance: 45000 },
  { code: '3101', nameAr: 'رأس المال المستثمر', nameEn: 'Owner Equity Capital', category: 'EQUITY', balanceType: 'CREDIT', balance: 536500 },
  { code: '4101', nameAr: 'تكلفة المواد والفضة المصروفة للإنتاج', nameEn: 'Cost of Silver & Materials Issued', category: 'EXPENSE', balanceType: 'DEBIT', balance: 0 }
];

const DEFAULT_7_WAREHOUSES = [
  { code: 'WH-STONES', nameAr: 'مخزن الأحجار الكريمة الرئيسي', nameEn: 'Main Gemstones Warehouse', type: 'STONES', securityLevel: 5 },
  { code: 'WH-SILVER', nameAr: 'مخزن الفضة الخام والسبائك', nameEn: 'Raw Silver & Bullion Store', type: 'SILVER', securityLevel: 5 },
  { code: 'WH-RAW', nameAr: 'مخزن الخامات العامة ومستلزمات الشمع', nameEn: 'Raw Materials & Wax Store', type: 'RAW_MATERIALS', securityLevel: 4 },
  { code: 'WH-CHEMICALS', nameAr: 'مخزن الكيماويات وأحماض التنظيف والطلاء', nameEn: 'Chemicals & Acids Store', type: 'CHEMICALS', securityLevel: 4 },
  { code: 'WH-COMPONENTS', nameAr: 'مخزن الإكسسوارات ومكونات الفضة الفرعية', nameEn: 'Silver Components Store', type: 'COMPONENTS', securityLevel: 3 },
  { code: 'WH-SEMI', nameAr: 'مخزن المنتجات نصف المصنعة (تحت التشغيل)', nameEn: 'Semi-Finished Goods Store', type: 'SEMI_FINISHED', securityLevel: 4 },
  { code: 'WH-FINISHED', nameAr: 'مخزن المنتجات النهائية الجاهزة للتسليم', nameEn: 'Finished Goods Store', type: 'FINISHED_GOODS', securityLevel: 5 }
];

console.log('Seeder loaded successfully. Standard Chart of Accounts & 7 Warehouses ready for execution.');

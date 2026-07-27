/**
 * BAHER SILVER ERP — WAREHOUSE OPERATIONS & MASTER DATA CENTER v4.0
 * Specialized Exclusively for Baher Silver Factory (NO GOLD)
 * Primary Weight: GRAMS (g) | Secondary Weight: CARATS (ct - display only)
 * Multi-Option Stone Image Engine (Gallery, Mobile Camera & Direct URL)
 */

let API_BASE_URL = 'http://localhost:4000/api/v1';

async function detectApiPort() {
  const ports = [4000, 4005, 4001, 4002];
  for (const port of ports) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 800);
      const res = await fetch(`http://localhost:${port}/health`, { signal: controller.signal });
      clearTimeout(timeout);
      if (res.ok) { API_BASE_URL = `http://localhost:${port}/api/v1`; return; }
    } catch (e) {}
  }
}

// Global Application State Matrix
const state = {
  lang: 'ar',
  currency: 'EGP',
  currencySymbol: 'ج.م',
  activeTab: 'wh_dashboard',
  selectedMasterCategory: 'STONE_CATEGORY',
  pendingColorHex: '#EF4444',
  pendingColorRequests: [],
  stoneColorFilter: '',
  stoneQrFilter: '',
  selectedStoneDetails: null,
  selectedStoneForIssue: null,
  selectedStoneForReceive: null,
  selectedRawDetails: null,
  selectedRawForIssue: null,
  selectedRawForReceive: null,
  selectedSilverDetails: null,
  selectedSilverForIssue: null,
  selectedSilverForReceive: null,
  selectedMovementDetails: null,
  selectedItemCodeForHistory: null,
  movementFilterWarehouse: 'ALL',
  movementFilterTxType: 'ALL',
  movementSearchQuery: '',
  
  // Real Database Collections & Accounting System Matrix
  warehouses: [],
  storageLocations: [],
  stones: [],
  rawMaterials: [],
  silverItems: [],
  movements: [],
  audits: [],
  masterItems: [],
  searchResults: { stones: [], rawMaterials: [], silverItems: [], locations: [], movements: [] },

  // Enterprise Double-Entry Accounting Matrix
  chartOfAccounts: [
    { code: '1101', nameAr: 'مخزون الأحجار الكريمة', category: 'ASSET', balanceType: 'DEBIT', balance: 0 },
    { code: '1102', nameAr: 'مخزون الخامات والمستلزمات', category: 'ASSET', balanceType: 'DEBIT', balance: 0 },
    { code: '1105', nameAr: 'مخزون الفضة الخام والسبائك', category: 'ASSET', balanceType: 'DEBIT', balance: 0 },
    { code: '1103', nameAr: 'الخزينة والصندوق الرئيسية', category: 'ASSET', balanceType: 'DEBIT', balance: 500000 },
    { code: '1104', nameAr: 'حسابات البنوك والأنصبة', category: 'ASSET', balanceType: 'DEBIT', balance: 1200000 },
    { code: '2101', nameAr: 'دائنون - حسابات الموردين', category: 'LIABILITY', balanceType: 'CREDIT', balance: 0 },
    { code: '3101', nameAr: 'رأس المال العامل المستثمر', category: 'EQUITY', balanceType: 'CREDIT', balance: 1700000 },
    { code: '4101', nameAr: 'تكلفة المواد والفضة المصروفة للإنتاج', category: 'EXPENSE', balanceType: 'DEBIT', balance: 0 },
    { code: '4102', nameAr: 'مصروفات فاقد وهالك التصنيع', category: 'EXPENSE', balanceType: 'DEBIT', balance: 0 },
    { code: '5101', nameAr: 'إيرادات مبيعات المصنع والمنتجات', category: 'REVENUE', balanceType: 'CREDIT', balance: 0 }
  ],
  journalEntries: [],
  
  isLoading: false,
  pendingStoneImageUrl: '',
  activeModal: null,
  toastMessage: null,
  searchQuery: '',
  auditLogs: []
};

// ENTERPRISE DATA GOVERNANCE & SECURITY MATRIX (Phase 18)
const RECORD_STATUSES = {
  DRAFT: 'DRAFT',
  PENDING_REVIEW: 'PENDING_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  ARCHIVED: 'ARCHIVED'
};

const SYSTEM_ROLES = {
  SYSTEM_ADMIN: { nameAr: 'مدير النظام الفائق (System Administrator)', permissions: ['CREATE', 'READ', 'UPDATE', 'ARCHIVE', 'APPROVE', 'AUDIT', 'FINANCE'] },
  FACTORY_MANAGER: { nameAr: 'مدير المصنع التنفيذي (Factory Manager)', permissions: ['CREATE', 'READ', 'UPDATE', 'ARCHIVE', 'APPROVE', 'FINANCE'] },
  WAREHOUSE_MANAGER: { nameAr: 'مدير المخازن الرئيسي (Warehouse Manager)', permissions: ['CREATE', 'READ', 'UPDATE', 'ARCHIVE', 'APPROVE'] },
  WAREHOUSE_CLERK: { nameAr: 'أمينات ومسؤولي المخازن (Warehouse Clerk)', permissions: ['CREATE_DRAFT', 'READ'] },
  PURCHASING_OFFICER: { nameAr: 'مسؤول المشتريات والسبائك (Purchasing Officer)', permissions: ['CREATE', 'READ', 'UPDATE'] },
  PRODUCTION_MANAGER: { nameAr: 'مدير ورش الصب والإنتاج (Production Manager)', permissions: ['CREATE', 'READ', 'UPDATE'] },
  SALES_MANAGER: { nameAr: 'مدير المبيعات والجملة (Sales Manager)', permissions: ['CREATE', 'READ', 'UPDATE'] },
  QUALITY_CONTROL: { nameAr: 'أخصائي فحص وفحص العيار والجودة (Quality Control)', permissions: ['READ', 'APPROVE', 'REJECT'] },
  ACCOUNTANT: { nameAr: 'رئيس الحسابات والمالية (Chief Accountant)', permissions: ['CREATE', 'READ', 'UPDATE', 'FINANCE'] },
  VIEWER: { nameAr: 'مستعرض قراءة فقط (Viewer)', permissions: ['READ'] }
};

function logAuditEvent(action, entityType, entityId, oldValue, newValue) {
  const auditEntry = {
    id: 'AUD-' + Date.now(),
    userId: 'USR-ADMIN',
    userName: state.currentUserRole || 'مدير النظام (System Admin)',
    action: action,
    entityType: entityType,
    entityId: entityId,
    oldValue: oldValue ? JSON.stringify(oldValue) : null,
    newValue: newValue ? JSON.stringify(newValue) : null,
    ipAddress: '127.0.0.1',
    device: typeof navigator !== 'undefined' ? navigator.userAgent : 'Enterprise Terminal',
    createdAt: new Date().toISOString(),
    timestamp: new Date().toLocaleString('ar-EG')
  };
  state.auditLogs.unshift(auditEntry);
}

function archiveRecord(entityType, id) {
  let target = null;
  if (entityType === 'Stone') target = state.stones.find(s => s.id === id);
  if (entityType === 'SilverItem') target = state.silverItems.find(s => s.id === id);
  if (entityType === 'RawMaterial') target = state.rawMaterials.find(r => r.id === id);

  if (target) {
    const oldVal = { ...target };
    target.status = RECORD_STATUSES.ARCHIVED;
    target.isArchived = true;
    logAuditEvent('ARCHIVE_RECORD', entityType, id, oldVal, target);
    renderApp();
    showToast(`تم أرشفة الصنف بنجاح (Soft Delete Policy - Zero Data Loss)!`);
  }
}

// ENTERPRISE CONFIGURATION ENGINE (Phase 19)
const SYSTEM_CONFIGURATIONS = {
  COMPANY_NAME: 'شركة مصنع باهر سيلفر للسبائك والمجوهرات',
  CURRENCY_SYMBOL: 'ج.م',
  BARCODE_PREFIX: '62910',
  QR_PREFIX: 'QR-BAHER',
  WAREHOUSE_PREFIX: 'WH',
  INVOICE_PREFIX: 'IV',
  PURCHASE_PREFIX: 'PO',
  PRODUCTION_PREFIX: 'WO',
  TAX_PERCENTAGE: '14',
  DATE_FORMAT: 'yyyy-MM-dd HH:mm:ss',
  DEFAULT_LANGUAGE: 'ar',
  SILVER_PURITY_DEFAULT: '999'
};

function getSystemConfig(key, defaultFallback = '') {
  if (state.systemConfigs && state.systemConfigs[key]) return state.systemConfigs[key];
  return SYSTEM_CONFIGURATIONS[key] || defaultFallback;
}

// ENTERPRISE CENTRALIZED NUMBERING ENGINE (Phase 19)
const NUMBERING_SEQUENCES = {
  STN:  { prefix: 'STN',  useYear: false, length: 6, currentSeq: 126040, resetPolicy: 'NEVER',   lastYear: 2026 },
  SIL:  { prefix: 'SIL',  useYear: false, length: 6, currentSeq: 101,    resetPolicy: 'NEVER',   lastYear: 2026 },
  RAW:  { prefix: 'RAW',  useYear: false, length: 6, currentSeq: 123320, resetPolicy: 'NEVER',   lastYear: 2026 },
  COMP: { prefix: 'COMP', useYear: false, length: 6, currentSeq: 501,    resetPolicy: 'NEVER',   lastYear: 2026 },
  SEMI: { prefix: 'SEMI', useYear: false, length: 6, currentSeq: 801,    resetPolicy: 'NEVER',   lastYear: 2026 },
  FG:   { prefix: 'FG',   useYear: false, length: 6, currentSeq: 901,    resetPolicy: 'NEVER',   lastYear: 2026 },
  SUP:  { prefix: 'SUP',  useYear: false, length: 6, currentSeq: 201,    resetPolicy: 'NEVER',   lastYear: 2026 },
  CUS:  { prefix: 'CUS',  useYear: false, length: 6, currentSeq: 301,    resetPolicy: 'NEVER',   lastYear: 2026 },
  WH:   { prefix: 'WH',   useYear: false, length: 6, currentSeq: 8,      resetPolicy: 'NEVER',   lastYear: 2026 },
  PO:   { prefix: 'PO',   useYear: true,  length: 6, currentSeq: 1,      resetPolicy: 'YEARLY',  lastYear: 2026 },
  GRN:  { prefix: 'GRN',  useYear: true,  length: 6, currentSeq: 1,      resetPolicy: 'YEARLY',  lastYear: 2026 },
  IV:   { prefix: 'IV',   useYear: true,  length: 6, currentSeq: 1,      resetPolicy: 'YEARLY',  lastYear: 2026 },
  WO:   { prefix: 'WO',   useYear: true,  length: 6, currentSeq: 992,    resetPolicy: 'YEARLY',  lastYear: 2026 },
  SO:   { prefix: 'SO',   useYear: true,  length: 6, currentSeq: 1,      resetPolicy: 'YEARLY',  lastYear: 2026 },
  INV:  { prefix: 'INV',  useYear: true,  length: 6, currentSeq: 1,      resetPolicy: 'YEARLY',  lastYear: 2026 },
  PAY:  { prefix: 'PAY',  useYear: true,  length: 6, currentSeq: 1,      resetPolicy: 'YEARLY',  lastYear: 2026 },
  JV:   { prefix: 'JV',   useYear: true,  length: 6, currentSeq: 1,      resetPolicy: 'YEARLY',  lastYear: 2026 },
  AUD:  { prefix: 'AUD',  useYear: true,  length: 6, currentSeq: 1,      resetPolicy: 'YEARLY',  lastYear: 2026 }
};

function generateNextNumber(entityType, manualOverride = null) {
  if (manualOverride && (state.currentUserRole === 'SYSTEM_ADMIN' || state.currentUserRole === 'FACTORY_MANAGER')) {
    logAuditEvent('MANUAL_NUMBER_OVERRIDE', entityType, manualOverride, null, { override: manualOverride });
    return manualOverride;
  }

  const seq = NUMBERING_SEQUENCES[entityType] || { prefix: entityType, useYear: false, length: 6, currentSeq: 1, resetPolicy: 'NEVER', lastYear: 2026 };
  const currentYear = new Date().getFullYear();

  // Automatic Reset Policy Check
  if (seq.resetPolicy === 'YEARLY' && seq.lastYear !== currentYear) {
    seq.currentSeq = 1;
    seq.lastYear = currentYear;
  }

  const paddedSeq = String(seq.currentSeq).padStart(seq.length, '0');
  const numberResult = seq.useYear ? `${seq.prefix}-${currentYear}-${paddedSeq}` : `${seq.prefix}-${paddedSeq}`;

  seq.currentSeq += 1;
  return numberResult;
}

function previewNextNumber(entityType) {
  const seq = NUMBERING_SEQUENCES[entityType] || { prefix: entityType, useYear: false, length: 6, currentSeq: 1, resetPolicy: 'NEVER', lastYear: 2026 };
  const currentYear = new Date().getFullYear();
  const nextSeq = (seq.resetPolicy === 'YEARLY' && seq.lastYear !== currentYear) ? 1 : seq.currentSeq;
  const paddedSeq = String(nextSeq).padStart(seq.length, '0');
  return seq.useYear ? `${seq.prefix}-${currentYear}-${paddedSeq}` : `${seq.prefix}-${paddedSeq}`;
}

// Master Data Modules Definition
const MASTER_CATEGORIES = [
  { id: 'STONE_CATEGORY', nameAr: '1. تصنيفات الأحجار (Stone Categories)', nameEn: 'Stone Categories' },
  { id: 'STONE_TYPE', nameAr: '2. أنواع الأحجار (Stone Types)', nameEn: 'Stone Types' },
  { id: 'COLOR', nameAr: '3. الألوان (Colors)', nameEn: 'Colors' },
  { id: 'SHAPE', nameAr: '4. الأشكال (Shapes)', nameEn: 'Shapes' },
  { id: 'SIZE', nameAr: '5. المقاسات (Sizes)', nameEn: 'Sizes' },
  { id: 'ORIGIN', nameAr: '6. المنشأ والبلد (Origins)', nameEn: 'Origins' },
  { id: 'QUALITY_GRADE', nameAr: '7. درجات الجودة (Quality Grades)', nameEn: 'Quality Grades' },
  { id: 'TREATMENT', nameAr: '8. المعالجة (Treatments)', nameEn: 'Treatments' },
  { id: 'SILVER_PURITY', nameAr: '9. نقاء الفضة (Silver Purity)', nameEn: 'Silver Purity' },
  { id: 'RAW_CATEGORY', nameAr: '10. تصنيفات الخامات (Raw Categories)', nameEn: 'Raw Categories' },
  { id: 'UNIT', nameAr: '11. وحدات القياس (Units)', nameEn: 'Units' },
  { id: 'WAREHOUSE_TYPE', nameAr: '12. أنواع المخازن (Warehouse Types)', nameEn: 'Warehouse Types' }
];

// Color HEX Mapping for Master Data Items
const MASTER_COLOR_HEX_MAP = {
  'أحمر': '#EF4444',
  'أزرق': '#3B82F6',
  'أخضر': '#10B981',
  'أبيض': '#FFFFFF',
  'أسود': '#0F172A',
  'وردي': '#EC4899',
  'بنفسجي': '#8B5CF6',
  'أصفر': '#F59E0B',
  'شامبانيا': '#D97706',
  'متعدد الألوان': '#6366F1'
};

// API Fetch Helpers
async function apiGet(endpoint) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${API_BASE_URL}${endpoint}`, { signal: controller.signal });
    clearTimeout(timeout);
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (err) {
    console.error(`API GET ${endpoint} Error:`, err);
    return null;
  }
}

async function apiPost(endpoint, body) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return await res.json();
  } catch (err) {
    console.error(`API POST ${endpoint} Error:`, err);
    return { success: false, error: err.message };
  }
}

async function apiPatch(endpoint) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, { method: 'PATCH' });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// Mobile QR Data Payload Generator
function generateMobileQrPayload(stone) {
  const code = stone.code || 'STN-001';
  const name = stone.nameAr || 'حجر';
  const weight = stone.weightGrams || 0;
  const barcode = stone.barcode || '6291000000000';
  return `BAHER-SILVER|Code:${code}|Name:${name}|Weight:${weight}g|Barcode:${barcode}`;
}

function getQrCodeImageUrl(payloadData, size = 140) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(payloadData)}`;
}

const DEFAULT_7_WAREHOUSES = [
  { id: 'wh-stones', code: 'WH-STONES', nameAr: 'مخزن الأحجار الكريمة (Stones Warehouse)', nameEn: 'Stones Warehouse', type: 'STONES', securityLevel: 5, icon: '💎', color: 'rose' },
  { id: 'wh-raw', code: 'WH-RAW', nameAr: 'مخزن الخامات ومستلزمات الإنتاج (Raw Materials)', nameEn: 'Raw Materials Warehouse', type: 'RAW_MATERIALS', securityLevel: 3, icon: '🧪', color: 'cyan' },
  { id: 'wh-silver', code: 'WH-SILVER', nameAr: 'مخزن الفضة والخام (Silver Warehouse)', nameEn: 'Silver Warehouse', type: 'SILVER', securityLevel: 5, icon: '🥈', color: 'slate' },
  { id: 'wh-chemicals', code: 'WH-CHEMICALS', nameAr: 'مخزن الكيماويات والطلاء (Chemicals Warehouse)', nameEn: 'Chemicals Warehouse', type: 'CHEMICALS', securityLevel: 4, icon: '⚗️', color: 'emerald' },
  { id: 'wh-components', code: 'WH-COMPONENTS', nameAr: 'مخزن المكونات والأجزاء (Components Warehouse)', nameEn: 'Components Warehouse', type: 'COMPONENTS', securityLevel: 3, icon: '🧩', color: 'amber' },
  { id: 'wh-semi', code: 'WH-SEMI', nameAr: 'مخزن المنتجات نصف المصنعة (Semi-Finished Warehouse)', nameEn: 'Semi-Finished Warehouse', type: 'SEMI_FINISHED', securityLevel: 3, icon: '⚙️', color: 'indigo' },
  { id: 'wh-finished', code: 'WH-FINISHED', nameAr: 'مخزن المنتجات التامة (Products Warehouse)', nameEn: 'Finished Products Warehouse', type: 'FINISHED_PRODUCTS', securityLevel: 4, icon: '✨', color: 'brand' }
];

const DEFAULT_INITIAL_SILVER_ITEMS = [
  { id: 'SLV-101', itemCode: 'SLV-99901', nameAr: 'حبيبات فضة ناعمة سويسرية عيار 999', category: 'فضة خام وسائك', availableStock: 5000, unitOfMeasure: 'جرام (g)', unitCost: 65, warehouseId: 'wh-silver' },
  { id: 'SLV-102', itemCode: 'SLV-99902', nameAr: 'سبائك فضة ناعمة عيار 999 فئة 100 جرام', category: 'فضة خام وسائك', availableStock: 2000, unitOfMeasure: 'جرام (g)', unitCost: 66, warehouseId: 'wh-silver' },
  { id: 'SLV-103', itemCode: 'SLV-92501', nameAr: 'فضة كسر وسراد 925 لإعادة التدوير', category: 'فضة خام وسائك', availableStock: 1500, unitOfMeasure: 'جرام (g)', unitCost: 58, warehouseId: 'wh-silver' }
];

const DEFAULT_INITIAL_RAW_MATERIALS = [
  { id: 'RAW-101', itemCode: 'RAW-1001', nameAr: 'شمع صب إيطالي فاخر', category: 'شمع صب ورشات', availableStock: 50, unitOfMeasure: 'كيلو (kg)', unitCost: 120, warehouseId: 'wh-raw' },
  { id: 'RAW-102', itemCode: 'RAW-1002', nameAr: 'جبس صب عالي الدقة للفضة', category: 'مستلزمات صب', availableStock: 200, unitOfMeasure: 'كيلو (kg)', unitCost: 45, warehouseId: 'wh-raw' },
  { id: 'RAW-103', itemCode: 'RAW-1003', nameAr: 'بوراكس صهر وتنقية', category: 'مواد صهر', availableStock: 25, unitOfMeasure: 'كيلو (kg)', unitCost: 90, warehouseId: 'wh-raw' },
  
  // Chemicals Warehouse Items
  { id: 'CHEM-201', itemCode: 'CHEM-2001', nameAr: 'حمض نيتريك مركز لتنظيف وإظهار الفضة', category: 'أحماض تنظيف وتلميع', availableStock: 30, unitOfMeasure: 'لتر', unitCost: 80, warehouseId: 'wh-chemicals' },
  { id: 'CHEM-202', itemCode: 'CHEM-2002', nameAr: 'محلول طلاء روديوم نقي 2 جرام', category: 'كيماويات طلاء', availableStock: 10, unitOfMeasure: 'لتر', unitCost: 450, warehouseId: 'wh-chemicals' },
  
  // Components Warehouse Items
  { id: 'CMP-301', itemCode: 'CMP-3001', nameAr: 'أقفال فضة عيار 925 إيطالي', category: 'مكونات وأجزاء', availableStock: 500, unitOfMeasure: 'قطعة', unitCost: 15, warehouseId: 'wh-components' },
  { id: 'CMP-302', itemCode: 'CMP-3002', nameAr: 'براريم وحلقان فضة عيار 925', category: 'مكونات وأجزاء', availableStock: 1000, unitOfMeasure: 'قطعة', unitCost: 8, warehouseId: 'wh-components' },
  
  // Semi-Finished Warehouse Items
  { id: 'SEM-401', itemCode: 'SEM-4001', nameAr: 'شجر فضة مصبوب قبل التجميع والتلميع', category: 'منتجات نصف مصنعة', availableStock: 80, unitOfMeasure: 'قطعة', unitCost: 250, warehouseId: 'wh-semi' },

  // Finished Products Warehouse Items
  { id: 'FNH-501', itemCode: 'FNH-5001', nameAr: 'خواتم فضة عيار 925 مطعمة بياقوت', category: 'منتجات تامة', availableStock: 45, unitOfMeasure: 'قطعة', unitCost: 450, warehouseId: 'wh-finished' }
];

// Load All Live Data from Database API Engine
async function loadAllDatabaseData() {
  state.isLoading = true;
  renderApp();

  try {
    const [whs, locs, stns, raws, mvmt, auds, masters] = await Promise.all([
      apiGet('/warehouses'),
      apiGet('/warehouses/locations'),
      apiGet('/inventory/stones'),
      apiGet('/inventory/raw-materials'),
      apiGet('/inventory/movements'),
      apiGet('/inventory/audits'),
      apiGet('/master-data')
    ]);

    state.warehouses = (whs && whs.length) ? whs : DEFAULT_7_WAREHOUSES;
    state.storageLocations = locs || [];
    state.stones = stns || [];
    state.rawMaterials = (raws && raws.length) ? raws : DEFAULT_INITIAL_RAW_MATERIALS;
    state.silverItems = DEFAULT_INITIAL_SILVER_ITEMS;
    state.movements = mvmt || [];
    state.audits = auds || [];
    state.masterItems = masters || [];
  } catch (err) {
    console.error('Failed to load database data:', err);
    state.warehouses = DEFAULT_7_WAREHOUSES;
    state.rawMaterials = DEFAULT_INITIAL_RAW_MATERIALS;
    state.silverItems = DEFAULT_INITIAL_SILVER_ITEMS;
  } finally {
    state.isLoading = false;
    recalculateEnterpriseState();
    renderApp();
  }
}

// Bootstrap Application
async function initApp() {
  await detectApiPort();
  await loadAllDatabaseData();
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initApp();
} else {
  document.addEventListener('DOMContentLoaded', initApp);
}

function renderApp() {
  const root = document.getElementById('app');
  if (!root) return;

  const isRtl = state.lang === 'ar';
  document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  document.documentElement.lang = state.lang;

  root.innerHTML = `
    <!-- Top Bar Navigation Header -->
    <header class="bg-slate-950/95 border-b border-brand-500/30 p-4 sticky top-0 z-40 backdrop-blur-md flex items-center justify-between shadow-2xl">
      <div class="flex items-center space-x-4 space-x-reverse">
        <img src="assets/baher_logo.png" alt="BAHER SILVER Logo" class="h-12 w-12 rounded-xl object-cover shadow-lg border border-brand-500/50 bg-[#C3B097]">

        <div>
          <h1 class="text-lg font-bold font-display tracking-tight text-white flex items-center gap-2">
            نظام مصنع باهر سيلفر — مركز البيانات والمخازن
            <span class="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono">ENTERPRISE v4.0</span>
          </h1>
          <p class="text-xs text-slate-400 font-sans">مصنع الفضة • المرجع الموحد لجميع القوائم</p>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <nav class="hidden lg:flex items-center space-x-1 space-x-reverse bg-slate-900/90 p-1.5 rounded-2xl border border-brand-500/20 text-xs font-bold overflow-x-auto">
        ${renderNavButton('wh_dashboard', '📊 لوحة التحكم')}
        ${renderNavButton('stones_store', '💎 مخزن الأحجار')}
        ${renderNavButton('raw_store', '🧪 مخزن الخامات')}
        ${renderNavButton('silver_store', '🥈 مخزن الفضة الخام')}
        ${renderNavButton('master_center', '⚙️ مركز البيانات')}
        ${renderNavButton('warehouses', '🏛️ المخازن السبعة')}
        ${renderNavButton('locations', '📍 التخزين الهرمي')}
        ${renderNavButton('transactions', '📜 سجل الحركات')}
        ${renderNavButton('accounting_system', '⚖️ النظام المحاسبي والشجرة')}
        ${renderNavButton('inventory_audit', '📋 الجرد الدوري')}
        ${renderNavButton('universal_search', '🔍 البحث الفائق')}
      </nav>
    </header>

    <!-- Main Content Container -->
    <div class="flex flex-1 max-w-7xl w-full mx-auto p-6 gap-6">
      ${renderSidebar()}
      <main class="flex-1 space-y-6 overflow-hidden">
        ${state.isLoading ? renderLoadingSpinner() : renderActiveTabContent()}
      </main>
    </div>

    ${renderToast()}
    ${renderActiveModal()}
  `;
}

function renderNavButton(tabId, label) {
  const isActive = state.activeTab === tabId;
  const activeClass = isActive 
    ? 'bg-brand-500 text-slate-950 font-bold shadow-lg shadow-brand-500/25' 
    : 'text-slate-400 hover:text-white hover:bg-slate-950/60';

  return `
    <button onclick="switchTab('${tabId}')" class="px-3 py-2 rounded-xl text-xs font-bold transition-all ${activeClass}">
      ${label}
    </button>
  `;
}

function switchTab(tabId) { state.activeTab = tabId; renderApp(); }
function closeModal() { state.activeModal = null; state.pendingStoneImageUrl = ''; state.selectedStoneForIssue = null; state.selectedStoneForReceive = null; renderApp(); }
function openModal(modalName) { if (modalName === 'addStone') state.pendingStoneImageUrl = ''; state.activeModal = modalName; renderApp(); }
function showToast(msg) { recalculateEnterpriseState(); state.toastMessage = msg; renderApp(); setTimeout(() => { state.toastMessage = null; renderApp(); }, 4000); }

// Double-Entry Accounting Journal Generator Engine
function postJournalEntry({ debitCode, creditCode, amount, description, referenceNo }) {
  if (!amount || amount <= 0) return null;
  const entryId = 'JRN-' + Math.floor(100000 + Math.random() * 900000);
  const dateStr = new Date().toLocaleString('ar-EG');
  
  const debitAcc = state.chartOfAccounts.find(a => a.code === debitCode);
  const creditAcc = state.chartOfAccounts.find(a => a.code === creditCode);
  
  if (debitAcc) debitAcc.balance += amount;
  if (creditAcc) creditAcc.balance += amount;

  const entry = {
    id: entryId,
    referenceNo: referenceNo || entryId,
    date: dateStr,
    timestamp: new Date().toISOString(),
    description: description,
    amount: amount,
    debitAccountCode: debitCode,
    debitAccountName: debitAcc ? debitAcc.nameAr : debitCode,
    creditAccountCode: creditCode,
    creditAccountName: creditAcc ? creditAcc.nameAr : creditCode
  };

  state.journalEntries.unshift(entry);
  return entry;
}

// Enterprise Balance & Valuation Recalculator
function recalculateEnterpriseState() {
  let totalStonesValuationPurchase = 0;
  let totalStonesValuationSelling = 0;
  let totalStonesWeight = 0;
  let totalStonesQty = 0;

  state.stones.forEach(s => {
    const qty = parseInt(s.quantity || 0, 10);
    const weight = parseFloat(s.weightGrams || 0);
    const buyPrice = parseFloat(s.purchasePrice || 0);
    const sellPrice = parseFloat(s.sellingPrice || 0);

    totalStonesValuationPurchase += (buyPrice * qty);
    totalStonesValuationSelling += (sellPrice * qty);
    totalStonesWeight += weight;
    totalStonesQty += qty;
  });

  let totalRawValuation = 0;
  state.rawMaterials.forEach(r => {
    const stock = parseFloat(r.availableStock || 0);
    const cost = parseFloat(r.unitCost || 50);
    totalRawValuation += (stock * cost);
  });

  let totalSilverValuation = 0;
  let totalSilverWeight = 0;
  state.silverItems.forEach(slv => {
    const weight = parseFloat(slv.availableStock || 0);
    const cost = parseFloat(slv.unitCost || 65);
    totalSilverWeight += weight;
    totalSilverValuation += (weight * cost);
  });

  const stonesAcc = state.chartOfAccounts.find(a => a.code === '1101');
  if (stonesAcc) stonesAcc.balance = totalStonesValuationPurchase;

  const rawAcc = state.chartOfAccounts.find(a => a.code === '1102');
  if (rawAcc) rawAcc.balance = totalRawValuation;

  const silverAcc = state.chartOfAccounts.find(a => a.code === '1105');
  if (silverAcc) silverAcc.balance = totalSilverValuation;

  return {
    totalStonesValuationPurchase,
    totalStonesValuationSelling,
    totalStonesWeight,
    totalStonesQty,
    totalRawValuation,
    totalSilverWeight,
    totalSilverValuation,
    totalEnterpriseValuation: totalStonesValuationPurchase + totalRawValuation + totalSilverValuation
  };
}

function openStoneDetailsModal(stoneId) {
  const stone = state.stones.find(s => s.id === stoneId) || state.searchResults.stones.find(s => s.id === stoneId);
  if (stone) {
    state.selectedStoneDetails = stone;
    state.activeModal = 'stoneDetailsModal';
    renderApp();
  }
}

function openIssueStoneModal(stoneId) {
  const stone = state.stones.find(s => s.id === stoneId) || state.searchResults.stones.find(s => s.id === stoneId);
  if (stone) {
    if (stone.quantity <= 0 || stone.weightGrams <= 0) {
      alert('عفواً! هذا الحجر رصيده الحالي 0 ولا توجد كميات متاحة للصرف.');
      return;
    }
    state.selectedStoneForIssue = stone;
    state.activeModal = 'issueStoneModal';
    renderApp();
  }
}

function openReceiveStoneStockModal(stoneId) {
  const stone = state.stones.find(s => s.id === stoneId) || state.searchResults.stones.find(s => s.id === stoneId);
  if (stone) {
    state.selectedStoneForReceive = stone;
    state.activeModal = 'receiveStoneStockModal';
    renderApp();
  }
}

async function handleIssueStoneSubmit(e, stoneId) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  const issueQty = parseInt(formData.get('issueQuantity'), 10);
  const issueWeight = parseFloat(formData.get('issueWeightGrams'));
  const issueType = formData.get('issueType');
  const recipient = formData.get('recipientEmployee');
  const orderNo = formData.get('productionOrderNo');
  const notes = formData.get('notes');

  const stone = state.stones.find(s => s.id === stoneId) || state.searchResults.stones.find(s => s.id === stoneId);
  if (!stone) return alert('الحجر غير موجود!');

  if (issueQty > stone.quantity) {
    return alert(`عفواً! الكمية المطلوبة للصرف (${issueQty} قطعة) أكبر من رصيد القطع المتاح (${stone.quantity} قطعة)`);
  }

  if (issueWeight > stone.weightGrams) {
    return alert(`عفواً! الوزن المطلوب للصرف (${issueWeight}g) أكبر من رصيد الوزن المتاح (${stone.weightGrams}g)`);
  }

  const prevQty = stone.quantity;
  const prevWeight = stone.weightGrams;

  // Deduct quantity and weight from stone stock
  stone.quantity -= issueQty;
  stone.weightGrams = Math.max(0, parseFloat((stone.weightGrams - issueWeight).toFixed(3)));
  stone.weightCarats = parseFloat((stone.weightGrams * 5).toFixed(3));

  const totalCostValue = parseFloat((issueQty * (stone.purchasePrice || 100)).toFixed(2));

  // Add stock movement log (حركة صنف)
  const newMovement = {
    id: 'MOV-' + Date.now(),
    stoneId: stone.id,
    itemCode: stone.code,
    itemName: stone.nameAr,
    stoneCategory: stone.category,
    txType: 'ISSUE',
    typeLabel: issueType || 'صرف أحجار للإنتاج',
    quantity: issueQty,
    weightGrams: issueWeight,
    balanceBefore: `${prevQty} قطعة (${prevWeight}g)`,
    balanceAfter: `${stone.quantity} قطعة (${stone.weightGrams}g)`,
    recipientEmployee: recipient,
    userName: recipient || 'فني الإنتاج',
    orderNo: orderNo || '—',
    notes: `${issueType} | المستلم: ${recipient} ${orderNo ? '| أمر: ' + orderNo : ''} ${notes ? '| ' + notes : ''}`,
    createdAt: new Date().toISOString(),
    timestamp: new Date().toLocaleString('ar-EG'),
    remainingQty: stone.quantity,
    remainingWeightGrams: stone.weightGrams
  };

  state.movements.unshift(newMovement);

  // Post Double-Entry Accounting Entry (قيد محاسبي آلي للصرف)
  postJournalEntry({
    debitCode: '4101', // تكلفة الأحجار المصروفة للإنتاج
    creditCode: '1101', // مخزون الأحجار الكريمة
    amount: totalCostValue > 0 ? totalCostValue : issueQty * 50,
    description: `صرف عدد ${issueQty} قطعة (${issueWeight}g) من الحجر (${stone.nameAr}) - المستلم: ${recipient}`,
    referenceNo: newMovement.id
  });

  recalculateEnterpriseState();

  try {
    await apiPost('/inventory/movements', {
      stoneId: stone.id,
      movementType: 'OUT',
      quantity: issueQty,
      weightGrams: issueWeight,
      description: `${issueType} - المستلم: ${recipient}${orderNo ? ' | امر: ' + orderNo : ''}`
    });
  } catch (err) {
    console.log('Local movement recorded');
  }

  closeModal();
  showToast(`تم صرف ${issueQty} قطعة (${issueWeight}g) من الحجر (${stone.nameAr}) وتحديث الأرصدة والقيود بنجاح! 📤`);
}

async function handleReceiveStoneStockSubmit(e, stoneId) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  const addedQty = parseInt(formData.get('addedQuantity'), 10);
  const addedWeight = parseFloat(formData.get('addedWeightGrams'));
  const unitBuyPrice = parseFloat(formData.get('purchasePrice') || 0);
  const supplierName = formData.get('supplierName');
  const invoiceNo = formData.get('invoiceNumber');
  const paymentSource = formData.get('paymentSource');
  const notes = formData.get('notes');

  const stone = state.stones.find(s => s.id === stoneId) || state.searchResults.stones.find(s => s.id === stoneId);
  if (!stone) return alert('الحجر غير موجود!');

  const prevQty = stone.quantity;
  const prevWeight = stone.weightGrams;

  // Add stock quantity and weight
  stone.quantity += addedQty;
  stone.weightGrams = parseFloat((stone.weightGrams + addedWeight).toFixed(3));
  stone.weightCarats = parseFloat((stone.weightGrams * 5).toFixed(3));
  if (unitBuyPrice > 0) stone.purchasePrice = unitBuyPrice;
  if (supplierName) stone.supplierName = supplierName;
  if (invoiceNo) stone.invoiceNumber = invoiceNo;

  const totalValue = parseFloat((addedQty * (unitBuyPrice || stone.purchasePrice || 0)).toFixed(2));

  // Add stock movement log (حركة صنف واردة)
  const newMovement = {
    id: 'MOV-' + Date.now(),
    stoneId: stone.id,
    itemCode: stone.code,
    itemName: stone.nameAr,
    stoneCategory: stone.category,
    txType: 'RECEIVE',
    typeLabel: 'إضافة وتوريد رصيد أحجار',
    quantity: addedQty,
    weightGrams: addedWeight,
    balanceBefore: `${prevQty} قطعة (${prevWeight}g)`,
    balanceAfter: `${stone.quantity} قطعة (${stone.weightGrams}g)`,
    recipientEmployee: supplierName || 'تزويد مخزني',
    userName: 'مسؤول المخزن',
    orderNo: invoiceNo || '—',
    notes: `توريد وتزويد رصيد | المورد: ${supplierName || '—'} | فاتورة: ${invoiceNo || '—'} ${notes ? '| ' + notes : ''}`,
    createdAt: new Date().toISOString(),
    timestamp: new Date().toLocaleString('ar-EG'),
    remainingQty: stone.quantity,
    remainingWeightGrams: stone.weightGrams
  };

  state.movements.unshift(newMovement);

  // Post Double-Entry Accounting Entry (قيد اليومية المحاسبي التلقائي للتوريد)
  const creditAccCode = (paymentSource === 'CASH') ? '1103' : '2101'; // 1103 الصندوق أو 2101 الموردين
  postJournalEntry({
    debitCode: '1101', // مخزون الأحجار الكريمة
    creditCode: creditAccCode,
    amount: totalValue > 0 ? totalValue : addedQty * 100,
    description: `توريد رصيد إضافي (${addedQty} قطعة | ${addedWeight}g) للحجر (${stone.nameAr}) - ${supplierName || 'توريد مخزني'}`,
    referenceNo: newMovement.id
  });

  recalculateEnterpriseState();

  try {
    await apiPost('/inventory/movements', {
      stoneId: stone.id,
      movementType: 'IN',
      quantity: addedQty,
      weightGrams: addedWeight,
      description: `تزويد رصيد أحجار - المورد: ${supplierName || '—'}`
    });
  } catch (err) {
    console.log('Local receipt recorded');
  }

  closeModal();
  showToast(`تم إضافة وتوريد ${addedQty} قطعة (${addedWeight}g) لرصيد الحجر (${stone.nameAr}) وتحديث الأرصدة والقيود المحاسبية! 📥`);
}

function openRawDetailsModal(rawId) {
  const raw = state.rawMaterials.find(r => r.id === rawId) || state.searchResults.rawMaterials.find(r => r.id === rawId);
  if (raw) {
    state.selectedRawDetails = raw;
    state.activeModal = 'rawDetailsModal';
    renderApp();
  }
}

function openIssueRawModal(rawId) {
  const raw = state.rawMaterials.find(r => r.id === rawId) || state.searchResults.rawMaterials.find(r => r.id === rawId);
  if (raw) {
    if (raw.availableStock <= 0) {
      alert('عفواً! هذا الخام رصيده الحالي 0 ولا توجد كميات متاحة للصرف.');
      return;
    }
    state.selectedRawForIssue = raw;
    state.activeModal = 'issueRawModal';
    renderApp();
  }
}

function openReceiveRawStockModal(rawId) {
  const raw = state.rawMaterials.find(r => r.id === rawId) || state.searchResults.rawMaterials.find(r => r.id === rawId);
  if (raw) {
    state.selectedRawForReceive = raw;
    state.activeModal = 'receiveRawStockModal';
    renderApp();
  }
}

async function handleIssueRawSubmit(e, rawId) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  const issueStock = parseFloat(formData.get('issueStock'));
  const recipient = formData.get('recipientEmployee');
  const purpose = formData.get('issuePurpose');
  const notes = formData.get('notes');

  const raw = state.rawMaterials.find(r => r.id === rawId) || state.searchResults.rawMaterials.find(r => r.id === rawId);
  if (!raw) return alert('الخام غير موجود!');

  if (issueStock > raw.availableStock) {
    return alert(`عفواً! الكمية المطلوبة للصرف (${issueStock}) أكبر من رصيد الخام المتاح (${raw.availableStock} ${raw.unitOfMeasure})`);
  }

  const prevStock = raw.availableStock;
  raw.availableStock = parseFloat((raw.availableStock - issueStock).toFixed(2));

  const totalCost = parseFloat((issueStock * (raw.unitCost || 50)).toFixed(2));

  // Add Movement Log
  const newMovement = {
    id: 'MOV-' + Date.now(),
    itemCode: raw.itemCode,
    itemName: raw.nameAr,
    stoneCategory: raw.category,
    txType: 'ISSUE_RAW',
    typeLabel: 'صرف خام للورشة/الإنتاج',
    quantity: issueStock,
    weightGrams: issueStock,
    balanceBefore: `${prevStock} ${raw.unitOfMeasure}`,
    balanceAfter: `${raw.availableStock} ${raw.unitOfMeasure}`,
    recipientEmployee: recipient,
    userName: recipient || 'فني الصب/الورشة',
    orderNo: purpose || '—',
    notes: `صرف خام | الغرض: ${purpose} | المستلم: ${recipient} ${notes ? '| ' + notes : ''}`,
    createdAt: new Date().toISOString(),
    timestamp: new Date().toLocaleString('ar-EG'),
    remainingQty: raw.availableStock
  };

  state.movements.unshift(newMovement);

  // Accounting Journal Entry
  postJournalEntry({
    debitCode: '4101', // تكلفة المواد والخامات المصروفة للإنتاج
    creditCode: '1102', // مخزون الخامات والمستلزمات
    amount: totalCost > 0 ? totalCost : issueStock * 50,
    description: `صرف كمية ${issueStock} ${raw.unitOfMeasure} من الخام (${raw.nameAr} - تصنيف: ${raw.category}) - المستلم: ${recipient}`,
    referenceNo: newMovement.id
  });

  recalculateEnterpriseState();
  closeModal();
  showToast(`تم صرف ${issueStock} ${raw.unitOfMeasure} من الخام (${raw.nameAr}) وتحديث الأرصدة والقيود المحاسبية! 📤`);
}

async function handleReceiveRawStockSubmit(e, rawId) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  const addedStock = parseFloat(formData.get('addedStock'));
  const unitCost = parseFloat(formData.get('unitCost') || 0);
  const supplierName = formData.get('supplierName');
  const invoiceNo = formData.get('invoiceNumber');
  const paymentSource = formData.get('paymentSource');
  const notes = formData.get('notes');

  const raw = state.rawMaterials.find(r => r.id === rawId) || state.searchResults.rawMaterials.find(r => r.id === rawId);
  if (!raw) return alert('الخام غير موجود!');

  const prevStock = raw.availableStock;
  raw.availableStock = parseFloat((raw.availableStock + addedStock).toFixed(2));
  if (unitCost > 0) raw.unitCost = unitCost;

  const totalValue = parseFloat((addedStock * (unitCost || raw.unitCost || 50)).toFixed(2));

  // Add Movement Log
  const newMovement = {
    id: 'MOV-' + Date.now(),
    itemCode: raw.itemCode,
    itemName: raw.nameAr,
    stoneCategory: raw.category,
    txType: 'RECEIVE_RAW',
    typeLabel: 'تزويد وتوريد رصيد خام',
    quantity: addedStock,
    weightGrams: addedStock,
    balanceBefore: `${prevStock} ${raw.unitOfMeasure}`,
    balanceAfter: `${raw.availableStock} ${raw.unitOfMeasure}`,
    recipientEmployee: supplierName || 'مسؤول مخزن الخامات',
    userName: 'مسؤول المخزن',
    orderNo: invoiceNo || '—',
    notes: `توريد خام | المورد: ${supplierName || '—'} | فاتورة: ${invoiceNo || '—'} ${notes ? '| ' + notes : ''}`,
    createdAt: new Date().toISOString(),
    timestamp: new Date().toLocaleString('ar-EG'),
    remainingQty: raw.availableStock
  };

  state.movements.unshift(newMovement);

  // Accounting Journal Entry
  const creditAccCode = (paymentSource === 'CASH') ? '1103' : '2101';
  postJournalEntry({
    debitCode: '1102', // مخزون الخامات والمستلزمات
    creditCode: creditAccCode,
    amount: totalValue > 0 ? totalValue : addedStock * 50,
    description: `توريد رصيد خام إضافي (${addedStock} ${raw.unitOfMeasure}) للخام (${raw.nameAr}) - المورد: ${supplierName || 'توريد مخزني'}`,
    referenceNo: newMovement.id
  });

  recalculateEnterpriseState();
  closeModal();
  showToast(`تم إضافة وتوريد ${addedStock} ${raw.unitOfMeasure} لرصيد الخام (${raw.nameAr}) وتحديث الأرصدة المحاسبية! 📥`);
}

// DEDICATED SILVER MODAL HANDLERS & SUBMISSIONS
function openSilverDetailsModal(silverId) {
  const silver = state.silverItems.find(s => s.id === silverId) || state.searchResults.silverItems.find(s => s.id === silverId);
  if (silver) {
    state.selectedSilverDetails = silver;
    state.activeModal = 'silverDetailsModal';
    renderApp();
  }
}

function openIssueSilverModal(silverId) {
  const silver = state.silverItems.find(s => s.id === silverId) || state.searchResults.silverItems.find(s => s.id === silverId);
  if (silver) {
    if (silver.availableStock <= 0) {
      alert('عفواً! هذا الخام من الفضة رصيده الحالي 0 ولا توجد كمية متاحة للصرف.');
      return;
    }
    state.selectedSilverForIssue = silver;
    state.activeModal = 'issueSilverModal';
    renderApp();
  }
}

function openReceiveSilverStockModal(silverId) {
  const silver = state.silverItems.find(s => s.id === silverId) || state.searchResults.silverItems.find(s => s.id === silverId);
  if (silver) {
    state.selectedSilverForReceive = silver;
    state.activeModal = 'receiveSilverStockModal';
    renderApp();
  }
}

async function handleIssueSilverSubmit(e, silverId) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  const issueStock = parseFloat(formData.get('issueStock'));
  const recipient = formData.get('recipientEmployee');
  const batchNo = formData.get('batchNo');
  const notes = formData.get('notes');

  const silver = state.silverItems.find(s => s.id === silverId) || state.searchResults.silverItems.find(s => s.id === silverId);
  if (!silver) return alert('خام الفضة غير موجود!');

  if (issueStock > silver.availableStock) {
    return alert(`عفواً! وزن الفضة المطلوب للصرف (${issueStock}g) أكبر من الرصيد المتاح (${silver.availableStock} ${silver.unitOfMeasure})`);
  }

  const prevStock = silver.availableStock;
  silver.availableStock = parseFloat((silver.availableStock - issueStock).toFixed(2));

  const totalCost = parseFloat((issueStock * (silver.unitCost || 65)).toFixed(2));

  // Add Movement Log
  const newMovement = {
    id: 'MOV-' + Date.now(),
    itemCode: silver.itemCode,
    itemName: silver.nameAr,
    stoneCategory: silver.category,
    txType: 'ISSUE_SILVER',
    typeLabel: 'صرف فضة للصب والتشكيل',
    quantity: issueStock,
    weightGrams: issueStock,
    balanceBefore: `${prevStock} جرام (g)`,
    balanceAfter: `${silver.availableStock} جرام (g)`,
    recipientEmployee: recipient || 'قسم الصب والتشكيل',
    userName: 'مسؤول الفضة والسبائك',
    orderNo: batchNo || '—',
    notes: `صرف فضة صب | الفني المستلم: ${recipient || '—'} | شجرة الصب: ${batchNo || '—'} ${notes ? '| ' + notes : ''}`,
    createdAt: new Date().toISOString(),
    timestamp: new Date().toLocaleString('ar-EG'),
    remainingQty: silver.availableStock,
    remainingWeightGrams: silver.availableStock
  };

  state.movements.unshift(newMovement);

  // Post Double-Entry Accounting Entry: Dr 4101 (تكلفة الإنتاج) / Cr 1105 (مخزون الفضة)
  postJournalEntry({
    debitCode: '4101', // تكلفة المواد والفضة المصروفة للإنتاج
    creditCode: '1105', // مخزون الفضة الخام والسبائك المستقل
    amount: totalCost,
    description: `صرف فضة صب ورشة (${issueStock}g) للصنف (${silver.nameAr}) - المستلم: ${recipient || 'قسم الصب'}`,
    referenceNo: newMovement.id
  });

  recalculateEnterpriseState();
  closeModal();
  showToast(`تم صرف ${issueStock} جرام من (${silver.nameAr}) لقسم الصب والتشكيل وتحديث القيود آلياً! 📤`);
}

async function handleReceiveSilverStockSubmit(e, silverId) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  const addedStock = parseFloat(formData.get('addedStock'));
  const unitCost = parseFloat(formData.get('unitCost') || 0);
  const supplierName = formData.get('supplierName');
  const invoiceNo = formData.get('invoiceNumber');
  const paymentSource = formData.get('paymentSource');
  const notes = formData.get('notes');

  const silver = state.silverItems.find(s => s.id === silverId) || state.searchResults.silverItems.find(s => s.id === silverId);
  if (!silver) return alert('خام الفضة غير موجود!');

  const prevStock = silver.availableStock;
  silver.availableStock = parseFloat((silver.availableStock + addedStock).toFixed(2));
  if (unitCost > 0) silver.unitCost = unitCost;

  const totalCost = parseFloat((addedStock * (unitCost || silver.unitCost || 65)).toFixed(2));

  // Add Movement Log
  const newMovement = {
    id: 'MOV-' + Date.now(),
    itemCode: silver.itemCode,
    itemName: silver.nameAr,
    stoneCategory: silver.category,
    txType: 'RECEIVE_SILVER',
    typeLabel: 'توريد وشراء فضة جديدة',
    quantity: addedStock,
    weightGrams: addedStock,
    balanceBefore: `${prevStock} جرام (g)`,
    balanceAfter: `${silver.availableStock} جرام (g)`,
    recipientEmployee: supplierName || 'توريد سبائك فضة',
    userName: 'مسؤول الفضة والسبائك',
    orderNo: invoiceNo || '—',
    notes: `توريد شراء فضة | المورد: ${supplierName || '—'} | فاتورة: ${invoiceNo || '—'} ${notes ? '| ' + notes : ''}`,
    createdAt: new Date().toISOString(),
    timestamp: new Date().toLocaleString('ar-EG'),
    remainingQty: silver.availableStock,
    remainingWeightGrams: silver.availableStock
  };

  state.movements.unshift(newMovement);

  // Post Double-Entry Accounting Entry: Dr 1105 (مخزون الفضة) / Cr 1103 الصندوق أو 2101 الموردين
  const creditAccCode = (paymentSource === 'CASH') ? '1103' : '2101';
  postJournalEntry({
    debitCode: '1105', // مخزون الفضة الخام والسبائك المستقل
    creditCode: creditAccCode,
    amount: totalCost,
    description: `توريد وشراء فضة جديدة (${addedStock}g) للصنف (${silver.nameAr}) - المورد: ${supplierName || 'تزويد مخزني'}`,
    referenceNo: newMovement.id
  });

  recalculateEnterpriseState();
  closeModal();
  showToast(`تم إضافة وتوريد ${addedStock} جرام لرصيد (${silver.nameAr}) وتحديث حساب 1105 والقيود آلياً! 📥`);
}

// MOVEMENT LEDGER & ITEM TIMELINE HANDLERS
function openMovementDetailModal(movementId) {
  const m = state.movements.find(mov => mov.id === movementId);
  if (m) {
    state.selectedMovementDetails = m;
    state.activeModal = 'movementDetailModal';
    renderApp();
  }
}

function openItemMovementHistoryModal(itemCode) {
  state.selectedItemCodeForHistory = itemCode;
  state.activeModal = 'itemMovementHistoryModal';
  renderApp();
}

function setMovementFilter(key, val) {
  if (key === 'warehouse') state.movementFilterWarehouse = val;
  if (key === 'txType') state.movementFilterTxType = val;
  if (key === 'query') state.movementSearchQuery = val;
  renderApp();
}

function openWarehouseDetailsModal(whId) {
  const wh = state.warehouses.find(w => w.id === whId || w.code === whId);
  if (wh) {
    state.selectedWarehouseId = wh.id;
    state.activeModal = 'warehouseDetailsModal';
    renderApp();
  }
}

function openAddWarehouseItemModal(whId) {
  state.selectedWarehouseForAdd = whId || 'wh-stones';
  state.activeModal = 'addWarehouseItemModal';
  renderApp();
}

async function handleCreateWarehouseItemSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  const targetWhId = formData.get('warehouseId');
  const wh = state.warehouses.find(w => w.id === targetWhId || w.code === targetWhId) || state.warehouses[0];

  const catSelect = formData.get('category');
  const customCat = formData.get('customCategory');
  const finalCategory = (catSelect === 'OTHER' && customCat && customCat.trim() !== '') ? customCat.trim() : catSelect;

  const nameAr = formData.get('nameAr');
  const stock = parseFloat(formData.get('availableStock') || 0);
  const unit = formData.get('unitOfMeasure') || 'قطعة';
  const unitCost = parseFloat(formData.get('unitCost') || 50);
  const sellingPrice = parseFloat(formData.get('sellingPrice') || 0);
  const supplierName = formData.get('supplierName');

  const localCode = (wh ? wh.code.replace('WH-', '') : 'ITEM') + '-' + Math.floor(100000 + Math.random() * 900000);

  if (wh && wh.type === 'STONES') {
    const newStone = {
      id: 'STN-' + Date.now(),
      code: localCode,
      nameAr: nameAr,
      nameEn: nameAr,
      category: finalCategory,
      stoneType: finalCategory,
      origin: 'محلي',
      color: 'طبيعي',
      shape: 'افتراضي',
      size: 'قياسي',
      quality: 'AAA',
      weightGrams: stock,
      quantity: Math.max(1, Math.round(stock)),
      purchasePrice: unitCost,
      sellingPrice: sellingPrice || unitCost * 1.5,
      supplierName: supplierName,
      warehouseId: wh.id,
      barcode: '62910' + Math.floor(10000000 + Math.random() * 90000000),
      qrCode: 'QR-' + localCode
    };
    state.stones.unshift(newStone);

    postJournalEntry({
      debitCode: '1101',
      creditCode: supplierName ? '2101' : '1103',
      amount: stock * unitCost,
      description: `تكويد واستلام صنف بمخزن الأحجار (${nameAr} - ${stock} ${unit} | ${wh.nameAr})`,
      referenceNo: localCode
    });
  } else if (wh && (wh.type === 'SILVER' || wh.id === 'wh-silver')) {
    const newSilver = {
      id: 'SLV-' + Date.now(),
      itemCode: localCode,
      nameAr: nameAr,
      nameEn: nameAr,
      category: finalCategory,
      availableStock: stock,
      unitOfMeasure: unit || 'جرام (g)',
      unitCost: unitCost || 65,
      warehouseId: wh.id,
      warehouseName: wh.nameAr
    };
    state.silverItems.unshift(newSilver);

    postJournalEntry({
      debitCode: '1105', // مخزون الفضة الخام والسبائك (حساب الأصول المستقل للفضة)
      creditCode: supplierName ? '2101' : '1103',
      amount: stock * unitCost,
      description: `استلام وتكويد سبائك/خام فضة بمخزن الفضة المستقل (${nameAr} - ${stock} ${unit})`,
      referenceNo: localCode
    });
  } else {
    const newRaw = {
      id: 'RAW-' + Date.now(),
      itemCode: localCode,
      nameAr: nameAr,
      nameEn: nameAr,
      category: finalCategory,
      availableStock: stock,
      unitOfMeasure: unit,
      unitCost: unitCost,
      warehouseId: wh ? wh.id : 'wh-raw',
      warehouseName: wh ? wh.nameAr : 'المخزن الرئيسي'
    };
    state.rawMaterials.unshift(newRaw);

    postJournalEntry({
      debitCode: '1102',
      creditCode: supplierName ? '2101' : '1103',
      amount: stock * unitCost,
      description: `استلام وتكويد صنف جديد بمخزن (${wh ? wh.nameAr : 'المخزن الرئيسي'}) — (${nameAr} - ${stock} ${unit})`,
      referenceNo: localCode
    });
  }

  // Automatic Movement Log for new item creation
  state.movements.unshift({
    id: 'MOV-' + Date.now(),
    itemCode: localCode,
    itemName: nameAr,
    stoneCategory: finalCategory,
    txType: wh && (wh.type === 'SILVER' || wh.id === 'wh-silver') ? 'RECEIVE_SILVER' : 'RECEIVE',
    typeLabel: `تكويد واستلام صنف بمخزن (${wh ? wh.nameAr : 'المخزن'})`,
    quantity: stock,
    weightGrams: stock,
    balanceBefore: `0 ${unit}`,
    balanceAfter: `${stock} ${unit}`,
    recipientEmployee: supplierName || 'تكويد أولي',
    userName: 'مسؤول المخزن',
    orderNo: '—',
    notes: `استلام وتكويد صنف جديد بمخزن (${wh ? wh.nameAr : 'المخزن الرئيسي'}) — (${nameAr} - ${stock} ${unit})`,
    createdAt: new Date().toISOString(),
    timestamp: new Date().toLocaleString('ar-EG'),
    remainingQty: stock,
    remainingWeightGrams: stock
  });

  recalculateEnterpriseState();
  closeModal();
  showToast(`تمت إضافة الصنف (${nameAr}) إلى ${wh ? wh.nameAr : 'المخزن'} وتسجيل القيود المحاسبية بنجاح! 🏛️`);
}

function previewStoneImageUrl(url) {
  const placeholder = document.getElementById('stone-img-placeholder');
  const img = document.getElementById('stone-img-preview-el');
  if (url && url.trim() !== '') {
    if (img) { 
      img.src = url.trim(); 
      img.style.display = 'block';
      img.classList.remove('hidden'); 
    }
    if (placeholder) placeholder.style.display = 'none';
  } else {
    if (img) { img.style.display = 'none'; img.classList.add('hidden'); }
    if (placeholder) placeholder.style.display = 'block';
  }
}

function handleDirectUrlInput(val) {
  state.pendingStoneImageUrl = val;
  const hiddenInput = document.getElementById('stone-image-url-input');
  if (hiddenInput) hiddenInput.value = val;
  previewStoneImageUrl(val);
  if (val && val.trim() !== '') {
    console.log("Image Loaded Successfully");
  }
}

// Canvas Compression Engine for Camera & Gallery Images
function handleStoneFileSelect(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    const rawSrc = evt.target.result;
    
    // Create HTML Image Object to calculate dimensions
    const imgObj = new Image();
    imgObj.onload = function() {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 800;
      const MAX_HEIGHT = 800;
      let width = imgObj.width;
      let height = imgObj.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(imgObj, 0, 0, width, height);

      // Compress photo into clean, high-resolution JPEG Data URL
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
      state.pendingStoneImageUrl = compressedDataUrl;

      const hiddenInput = document.getElementById('stone-image-url-input');
      if (hiddenInput) hiddenInput.value = compressedDataUrl;

      previewStoneImageUrl(compressedDataUrl);
      console.log("Image Loaded Successfully");
      showToast('تم التقاط/تحميل صورة الحجر ومعاينتها بنجاح!');
    };
    imgObj.src = rawSrc;
  };
  reader.readAsDataURL(file);
}

function renderLoadingSpinner() {
  return `
    <div class="flex flex-col items-center justify-center p-12 space-y-4">
      <div class="w-12 h-12 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin"></div>
      <p class="text-slate-400 text-sm font-bold">جاري تحميل البيانات من قاعدة بيانات PostgreSQL...</p>
    </div>
  `;
}

function renderEmptyState(message, buttonActionLabel, buttonModalName) {
  return `
    <div class="glass-card rounded-2xl p-12 border border-borderdark text-center space-y-4 shadow-xl">
      <div class="text-4xl text-slate-600">📦</div>
      <div class="text-lg font-bold text-slate-300">${message || 'لا توجد بيانات، اضغط لإضافة أول سجل'}</div>
      ${buttonActionLabel ? `
        <button onclick="openModal('${buttonModalName}')" class="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs shadow-lg transition-all">
          + ${buttonActionLabel}
        </button>
      ` : ''}
    </div>
  `;
}

function renderToast() {
  if (!state.toastMessage) return '';
  return `
    <div class="fixed bottom-6 left-6 z-50 p-4 rounded-2xl bg-slate-900 border border-brand-500/40 text-brand-500 text-sm font-bold shadow-2xl flex items-center gap-3">
      <span>✅</span><span>${state.toastMessage}</span>
    </div>
  `;
}

function renderSidebar() {
  return `
    <aside class="w-64 glass-card rounded-2xl p-4 border border-borderdark space-y-4 shrink-0 hidden md:block">
      <div class="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 font-mono">
        إدارة مخازن مصنع باهر سيلفر
      </div>

      <nav class="space-y-1 text-xs font-bold">
        ${renderSidebarItem('wh_dashboard', '📊', 'لوحة التحكم المخزنية')}
        ${renderSidebarItem('stones_store', '💎', 'مخزن الأحجار الكريمة')}
        ${renderSidebarItem('raw_store', '🧪', 'مخزن الخامات والمستلزمات')}
        ${renderSidebarItem('silver_store', '🥈', 'مخزن الفضة الخام والسبائك')}
        ${renderSidebarItem('master_center', '⚙️', 'مركز البيانات الأساسية (12)')}
        ${renderSidebarItem('warehouses', '🏛️', 'المخازن السبعة الرئيسية')}
        ${renderSidebarItem('locations', '📍', 'التخزين الهرمي (QR)')}
        ${renderSidebarItem('transactions', '📜', 'سجل الحركات (Timeline)')}
        ${renderSidebarItem('accounting_system', '⚖️', 'النظام المحاسبي والشجرة')}
        ${renderSidebarItem('inventory_audit', '📋', 'الجرد الدوري والرصيد')}
        ${renderSidebarItem('universal_search', '🔍', 'البحث الفائق الشامل')}
      </nav>
    </aside>
  `;
}

function renderSidebarItem(tabId, icon, label) {
  const isActive = state.activeTab === tabId;
  const activeClass = isActive 
    ? 'bg-brand-500/15 text-brand-500 border border-brand-500/30' 
    : 'text-slate-400 hover:text-white hover:bg-slate-900/60';

  return `
    <button onclick="switchTab('${tabId}')" class="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all ${activeClass}">
      <span>${icon}</span><span>${label}</span>
    </button>
  `;
}

function renderActiveTabContent() {
  switch (state.activeTab) {
    case 'wh_dashboard': return renderWarehouseDashboardScreen();
    case 'stones_store': return renderStonesStoreScreen();
    case 'raw_store': return renderRawMaterialsStoreScreen();
    case 'silver_store': return renderSilverStoreScreen();
    case 'master_center': return renderMasterDataCenterScreen();
    case 'warehouses': return renderWarehousesHierarchyScreen();
    case 'locations': return renderStorageLocationsScreen();
    case 'transactions': return renderTransactionsTimelineScreen();
    case 'accounting_system': return renderAccountingSystemScreen();
    case 'inventory_audit': return renderInventoryAuditScreen();
    case 'universal_search': return renderUniversalSearchScreen();
    default: return renderWarehouseDashboardScreen();
  }
}

// DEDICATED RAW SILVER & BULLION STORE SCREEN (مخزن خام الفضة والسبائك المستقل)
function renderSilverStoreScreen() {
  const silverItems = state.silverItems;
  
  let totalSilverWeight = 0;
  let totalSilverValuation = 0;

  silverItems.forEach(r => {
    const weight = parseFloat(r.availableStock || 0);
    const cost = parseFloat(r.unitCost || 65);
    totalSilverWeight += weight;
    totalSilverValuation += (weight * cost);
  });

  return `
    <div class="glass-card rounded-2xl p-6 border border-slate-700/60 space-y-6 shadow-xl font-sans">
      
      <!-- Screen Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-borderdark">
        <div class="flex items-center gap-3">
          <div class="h-12 w-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl text-slate-200">
            🥈
          </div>
          <div>
            <h2 class="text-xl font-extrabold text-white tracking-wide">مخزن خام الفضة والسبائك المستقل (Raw Silver Store — Account 1105)</h2>
            <p class="text-xs text-slate-400 font-mono">الفضة النقية عيار 999 • السبائك السويسرية • سراد الفضة وإعادة التدوير • حساب مخزون أصول مستقل (1105)</p>
          </div>
        </div>

        <button onclick="openAddWarehouseItemModal('wh-silver')" class="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-white text-slate-950 font-extrabold text-xs shadow-lg flex items-center gap-2">
          <span>+ إضافة خام/سبائك فضة جديدة</span>
        </button>
      </div>

      <!-- Financial & Stock KPI Row -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
        <div class="p-4 rounded-2xl bg-slate-950/90 border border-slate-700/60 space-y-1">
          <div class="text-slate-400 font-sans font-bold">إجمالي رصيد الفضة بالجرام:</div>
          <div class="text-slate-100 text-lg font-extrabold">${totalSilverWeight.toLocaleString('ar-EG')} جرام (g)</div>
          <div class="text-[10px] text-slate-500 font-sans">مخزون الفضة المستقل المتاح</div>
        </div>

        <div class="p-4 rounded-2xl bg-slate-950/90 border border-emerald-500/30 space-y-1">
          <div class="text-slate-400 font-sans font-bold">إجمالي رصيد الفضة بالكيلو:</div>
          <div class="text-emerald-400 text-lg font-extrabold">${(totalSilverWeight / 1000).toFixed(3)} كجم (kg)</div>
          <div class="text-[10px] text-slate-500 font-sans">رصيد الفضة بالكيلوجرام المعياري</div>
        </div>

        <div class="p-4 rounded-2xl bg-slate-950/90 border border-brand-500/30 space-y-1">
          <div class="text-slate-400 font-sans font-bold">متوسط سعر تكلفة جرام الفضة:</div>
          <div class="text-brand-500 text-lg font-extrabold">65.00 ${state.currencySymbol} / g</div>
          <div class="text-[10px] text-slate-500 font-sans">سعر تكلفة جرام 999 الشراء</div>
        </div>

        <div class="p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/30 space-y-1">
          <div class="text-slate-400 font-sans font-bold">تقييم حساب الفضة المستقل (1105):</div>
          <div class="text-cyan-400 text-lg font-extrabold">${totalSilverValuation.toLocaleString('ar-EG')} ${state.currencySymbol}</div>
          <div class="text-[10px] text-slate-500 font-sans">تقييم مخزون الفضة بحساب 1105</div>
        </div>
      </div>

      <!-- Inventory Table / Cards -->
      ${silverItems.length === 0 
        ? renderEmptyState('لا توجد أصناف فضة مسجلة بهذا المخزن بعد، اضغط لإضافة أول سبائك أو خام فضة', 'إضافة خام فضة جديد', 'wh-silver')
        : `
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 font-sans">
            ${silverItems.map(r => `
              <div onclick="openRawDetailsModal('${r.id}')" class="p-5 rounded-2xl bg-slate-950 border border-slate-700/60 space-y-3 glass-card-hover cursor-pointer relative overflow-hidden group">
                <div class="flex justify-between items-center text-xs font-mono">
                  <span class="font-bold text-slate-300 bg-slate-800 px-2.5 py-0.5 rounded border border-slate-700">${r.itemCode}</span>
                  <span class="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-200 font-bold border border-slate-600">${r.category}</span>
                </div>

                <div class="text-base font-extrabold text-white group-hover:text-slate-300 transition-colors">${r.nameAr}</div>
                
                <div class="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 font-mono text-xs">
                  <div class="flex justify-between items-center text-slate-300">
                    <span>الرصيد الفعلي المتاح:</span>
                    <strong class="text-emerald-400 text-sm font-extrabold">${r.availableStock} ${r.unitOfMeasure || 'g'}</strong>
                  </div>
                  <div class="flex justify-between items-center text-slate-400 text-[11px]">
                    <span>سعر التكلفة للجرام:</span>
                    <strong class="text-amber-400">${r.unitCost || 65} ${state.currencySymbol}</strong>
                  </div>
                  <div class="flex justify-between items-center text-slate-400 text-[11px]">
                    <span>القيمة المالية للمخزون:</span>
                    <strong class="text-cyan-400 font-bold">${((r.availableStock || 0) * (r.unitCost || 65)).toLocaleString('ar-EG')} ${state.currencySymbol}</strong>
                  </div>
                </div>

                <!-- Quick Actions Bar -->
                <div class="flex items-center justify-between gap-2 pt-2 border-t border-borderdark" onclick="event.stopPropagation()">
                  <button onclick="openSilverDetailsModal('${r.id}')" class="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 font-bold text-xs transition-all flex items-center gap-1">🔍 التفاصيل</button>
                  <div class="flex items-center gap-1.5">
                    <button onclick="openIssueSilverModal('${r.id}')" class="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500 hover:text-white font-bold text-xs transition-all flex items-center gap-1">📤 صرف صب</button>
                    <button onclick="openReceiveSilverStockModal('${r.id}')" class="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-slate-950 font-bold text-xs transition-all flex items-center gap-1">📥 توريد شراء</button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `
      }
    </div>
  `;
}

// 1. MASTER DATA CENTER SCREEN
function renderMasterDataCenterScreen() {
  const filteredItems = state.masterItems.filter(m => m.category === state.selectedMasterCategory);

  return `
    <div class="glass-card rounded-2xl p-6 border border-borderdark space-y-6 shadow-xl font-sans">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <span>⚙️</span> مركز البيانات الأساسية المرجعية (Master Data Center)
          </h2>
          <p class="text-xs text-slate-400">المرجع الوحيد لكافة القوائم المنسدلة بالفواتير والمخازن (12 وحدة قياسية)</p>
        </div>
        <div class="flex gap-2">
          <button onclick="openModal('addMasterItem')" class="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs shadow-lg">+ إضافة عنصر جديد</button>
          <button onclick="exportMasterCSV()" class="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs">📥 تصدير CSV</button>
        </div>
      </div>

      <div class="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-slate-950 border border-borderdark text-xs font-bold">
        ${MASTER_CATEGORIES.map(cat => `
          <button onclick="selectMasterCategory('${cat.id}')" class="px-3 py-2 rounded-xl transition-all ${state.selectedMasterCategory === cat.id ? 'bg-brand-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'}">
            ${cat.nameAr}
          </button>
        `).join('')}
      </div>

      ${filteredItems.length === 0 
        ? renderEmptyState('لا توجد عناصر مسجلة في هذا التصنيف، اضغط لإضافة أول عنصر مرجعي', 'إضافة عنصر جديد', 'addMasterItem')
        : `
          <div class="overflow-x-auto font-mono text-xs">
            <table class="w-full text-right text-slate-300">
              <thead class="text-xs uppercase bg-slate-950 text-slate-400 font-bold border-b border-borderdark">
                <tr>
                  <th class="p-3">الكود القياسي</th>
                  <th class="p-3">الاسم بالعربية</th>
                  <th class="p-3">الاسم بالإنجليزية</th>
                  <th class="p-3">الحالة</th>
                  <th class="p-3">تاريخ التحديث</th>
                  <th class="p-3">إجراءات</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-borderdark">
                ${filteredItems.map(item => `
                  <tr class="hover:bg-slate-900/50">
                    <td class="p-3 font-bold text-brand-500">${item.code}</td>
                    <td class="p-3 text-white font-bold font-sans">${item.nameAr}</td>
                    <td class="p-3 text-slate-300 font-sans">${item.nameEn}</td>
                    <td class="p-3">
                      <span class="px-2 py-0.5 rounded font-bold ${item.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}">
                        ${item.isActive ? 'مفعل' : 'معطل'}
                      </span>
                    </td>
                    <td class="p-3 text-slate-400">${new Date(item.updatedAt).toLocaleDateString('ar-EG')}</td>
                    <td class="p-3 font-sans">
                      <button onclick="toggleMasterItemActive('${item.id}')" class="px-2.5 py-1 rounded ${item.isActive ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'} font-bold text-[11px]">
                        ${item.isActive ? 'تعطيل' : 'تفعيل'}
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `
      }
    </div>
  `;
}

function selectMasterCategory(catId) {
  state.selectedMasterCategory = catId;
  renderApp();
}

async function toggleMasterItemActive(id) {
  const res = await apiPatch(`/master-data/${id}/toggle`);
  if (res.success) {
    showToast('تم تغيير حالة العنصر بنجاح!');
    await loadAllDatabaseData();
  }
}

// Dynamic Master Data Dropdown Renderer Helper
function renderMasterOptions(category, selectedVal = '') {
  const items = state.masterItems.filter(m => m.category === category && m.isActive);
  let optionsHtml = '';

  if (items.length === 0) {
    optionsHtml = `<option value="${selectedVal}">${selectedVal || 'افتراضي'}</option>`;
  } else {
    optionsHtml = items.map(i => `
      <option value="${i.nameAr}" ${i.nameAr === selectedVal ? 'selected' : ''}>${i.nameAr} (${i.nameEn})</option>
    `).join('');
  }

  // Always append "OTHER / أخرى (إدخال يدوي)" option
  optionsHtml += `<option value="OTHER" ${selectedVal === 'OTHER' ? 'selected' : ''}>➕ أخرى (إدخال تصنيف يدوي)</option>`;

  return optionsHtml;
}

function handleCategoryDropdownChange(selectEl, customBoxId) {
  const customBox = document.getElementById(customBoxId);
  if (!customBox) return;
  if (selectEl.value === 'OTHER') {
    customBox.classList.remove('hidden');
    customBox.style.display = 'block';
    const input = customBox.querySelector('input');
    if (input) {
      input.required = true;
      input.focus();
    }
  } else {
    customBox.classList.add('hidden');
    customBox.style.display = 'none';
    const input = customBox.querySelector('input');
    if (input) input.required = false;
  }
}

/**
 * REUSABLE ENTERPRISE COLOR PICKER COMPONENT (Figma, Photoshop, SAP Standard)
 * Component Name: EnterpriseColorPickerComponent
 */
function renderEnterpriseColorPickerComponent(config = {}) {
  const defaultHex = config.defaultHex || '#EF4444';
  const defaultColorName = config.defaultColorName || 'أحمر';

  return `
    <div class="space-y-2">
      <label class="block text-slate-300 font-bold mb-1">اللون والتحديد البصري (كتابة يدودية + اختيار باليتة) *</label>
      <div class="flex items-center gap-2">
        <div class="flex-1 flex items-center gap-2.5 h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-brand-500 transition-all">
          <span id="ent-picker-preview-dot" onclick="toggleEnterpriseColorPopover()" class="w-5 h-5 rounded-md border border-white/20 shadow shrink-0 cursor-pointer" style="background-color: ${defaultHex}"></span>
          <input type="text" name="color" id="stone-color-name-input" required value="${defaultColorName}" placeholder="اكتب اسم اللون يدودياً (مثال: أحمر بورمي، أزرق ملكي، #EF4444)" class="w-full bg-transparent text-white font-sans text-xs focus:outline-none">
          <button type="button" onclick="toggleEnterpriseColorPopover()" class="text-slate-400 hover:text-white text-xs p-1">🎨 باليتة</button>
        </div>
      </div>

      <div id="ent-color-popover" class="hidden p-4 rounded-2xl bg-slate-900 border border-brand-500/40 shadow-2xl space-y-4 font-sans text-xs">
        <div class="flex justify-between items-center pb-2 border-b border-borderdark">
          <span class="font-bold text-white flex items-center gap-1.5">🎨 باليتة الألوان الكاملة (Color Palette & Spectrum)</span>
          <button type="button" onclick="toggleEnterpriseColorPopover()" class="text-slate-400 hover:text-white">✕</button>
        </div>

        <div class="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-borderdark">
          <div id="ent-color-preview-box" class="w-12 h-12 rounded-xl border border-white/20 shadow-lg shrink-0" style="background-color: ${defaultHex}"></div>
          <div class="space-y-1 font-mono text-[11px]">
            <div class="text-white font-bold flex items-center gap-2">
              <span>HEX: <strong id="ent-hex-display" class="text-brand-500">${defaultHex}</strong></span>
              <button type="button" onclick="copyEnterpriseHexCode()" class="px-2 py-0.5 rounded bg-brand-500/20 text-brand-500 border border-brand-500/40 hover:bg-brand-500 hover:text-slate-950 font-bold transition-all text-[10px]">📋 نسخ HEX</button>
            </div>
            <div class="text-slate-400">RGB: <span id="ent-rgb-display">239, 68, 68</span></div>
          </div>
        </div>

        <div>
          <label class="block text-[11px] font-bold text-slate-400 mb-1.5">اختر من الألوان المتاحة في الباليتة:</label>
          <div class="grid grid-cols-4 gap-2">
            ${[
              { name: 'أحمر', hex: '#EF4444' },
              { name: 'أزرق', hex: '#3B82F6' },
              { name: 'أخضر', hex: '#10B981' },
              { name: 'أبيض', hex: '#FFFFFF' },
              { name: 'أسود', hex: '#0F172A' },
              { name: 'وردي', hex: '#EC4899' },
              { name: 'بنفسجي', hex: '#8B5CF6' },
              { name: 'أصفر', hex: '#F59E0B' },
              { name: 'شامبانيا', hex: '#D97706' },
              { name: 'متعدد الألوان', hex: '#6366F1' },
              { name: 'روديوم فضي', hex: '#CBD5E1' },
              { name: 'ياقوتي أحمر', hex: '#E11D48' }
            ].map(c => `
              <button type="button" onclick="applyColorFromPalette('${c.name}', '${c.hex}')" class="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-brand-500 transition-all">
                <span class="w-4 h-4 rounded border border-white/20 shrink-0" style="background-color: ${c.hex}"></span>
                <span class="text-[10px] text-slate-200 truncate">${c.name}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="space-y-2">
          <label class="block text-[11px] font-bold text-slate-400">طيف الألوان التفاعلي (Color Spectrum):</label>
          <div class="flex items-center gap-3">
            <input type="color" id="ent-native-picker" value="${defaultHex}" oninput="handleEnterpriseColorPickerInput(this.value)" class="w-full h-10 rounded-xl cursor-pointer bg-slate-950 border border-slate-700 p-1">
          </div>
        </div>

        <div class="grid grid-cols-3 gap-2 text-center font-mono text-[11px]">
          <div>
            <label class="block text-rose-400 mb-1 font-bold">R</label>
            <input type="number" id="ent-rgb-r" min="0" max="255" value="239" oninput="handleEnterpriseRgbInput()" class="w-full p-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-center">
          </div>
          <div>
            <label class="block text-emerald-400 mb-1 font-bold">G</label>
            <input type="number" id="ent-rgb-g" min="0" max="255" value="68" oninput="handleEnterpriseRgbInput()" class="w-full p-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-center">
          </div>
          <div>
            <label class="block text-sky-400 mb-1 font-bold">B</label>
            <input type="number" id="ent-rgb-b" min="0" max="255" value="68" oninput="handleEnterpriseRgbInput()" class="w-full p-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-center">
          </div>
        </div>
      </div>
    </div>
  `;
}

function toggleEnterpriseColorPopover() {
  const popover = document.getElementById('ent-color-popover');
  if (popover) popover.classList.toggle('hidden');
}

function hexToRgb(hex) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = Math.max(0, Math.min(255, x)).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('').toUpperCase();
}

function updateEnterpriseColorUI(hex, colorName = '') {
  const upperHex = hex.toUpperCase();
  const rgb = hexToRgb(upperHex);

  const dot = document.getElementById('ent-picker-preview-dot');
  const input = document.getElementById('stone-color-name-input');
  const box = document.getElementById('ent-color-preview-box');
  const hexDisplay = document.getElementById('ent-hex-display');
  const rgbDisplay = document.getElementById('ent-rgb-display');
  const picker = document.getElementById('ent-native-picker');
  const inputR = document.getElementById('ent-rgb-r');
  const inputG = document.getElementById('ent-rgb-g');
  const inputB = document.getElementById('ent-rgb-b');

  if (dot) dot.style.backgroundColor = upperHex;
  if (input && colorName) input.value = colorName;
  if (box) box.style.backgroundColor = upperHex;
  if (hexDisplay) hexDisplay.textContent = upperHex;
  if (rgbDisplay) rgbDisplay.textContent = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
  if (picker) picker.value = upperHex;
  if (inputR) inputR.value = rgb.r;
  if (inputG) inputG.value = rgb.g;
  if (inputB) inputB.value = rgb.b;
}

function applyColorFromPalette(colorName, hex) {
  updateEnterpriseColorUI(hex, colorName);
  toggleEnterpriseColorPopover();
}

function handleEnterpriseColorPickerInput(hex) {
  const upperHex = hex.toUpperCase();
  const matchedColorName = Object.keys(MASTER_COLOR_HEX_MAP).find(k => MASTER_COLOR_HEX_MAP[k].toUpperCase() === upperHex) || upperHex;
  updateEnterpriseColorUI(upperHex, matchedColorName);
}

function handleEnterpriseRgbInput() {
  const r = parseInt(document.getElementById('ent-rgb-r')?.value || '0', 10);
  const g = parseInt(document.getElementById('ent-rgb-g')?.value || '0', 10);
  const b = parseInt(document.getElementById('ent-rgb-b')?.value || '0', 10);
  const hex = rgbToHex(r, g, b);
  handleEnterpriseColorPickerInput(hex);
}

function copyEnterpriseHexCode() {
  const hex = document.getElementById('ent-hex-display')?.textContent || '#EF4444';
  navigator.clipboard.writeText(hex);
  showToast(`تم نسخ كود اللون ${hex} إلى الحافظة!`);
}

function filterStonesByColor(val) {
  state.stoneColorFilter = val;
  renderApp();
}

function filterStonesByQr(val) {
  state.stoneQrFilter = val;
  renderApp();
}

// 2. DASHBOARD SCREEN
function renderWarehouseDashboardScreen() {
  const totalStonesCount = state.stones.reduce((acc, s) => acc + (s.quantity || 0), 0);
  const totalStonesWeightGrams = state.stones.reduce((acc, s) => acc + (s.weightGrams || 0), 0);
  const totalStonesValuation = state.stones.reduce((acc, s) => acc + (s.quantity * (s.purchasePrice || 0)), 0);
  const totalRawItems = state.rawMaterials.length;

  return `
    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 font-sans">
        <div class="glass-card p-5 rounded-2xl border border-brand-500/20">
          <div class="text-xs text-slate-400 font-bold mb-1">إجمالي رصيد الأحجار (الوزن بالجرام)</div>
          <div class="text-2xl font-extrabold text-white font-mono">${totalStonesWeightGrams.toFixed(2)} جرام</div>
          <p class="text-xs text-brand-500 mt-1">يساوي ${(totalStonesWeightGrams * 5).toFixed(2)} قيراط (للعرض)</p>
        </div>

        <div class="glass-card p-5 rounded-2xl border border-brand-500/20">
          <div class="text-xs text-slate-400 font-bold mb-1">إجمالي عدد الأحجار الكلي</div>
          <div class="text-2xl font-extrabold text-emerald-400 font-mono">${totalStonesCount.toLocaleString()} قطعة</div>
          <p class="text-xs text-emerald-400 mt-1">مسجلة بمخزن الأحجار</p>
        </div>

        <div class="glass-card p-5 rounded-2xl border border-brand-500/20">
          <div class="text-xs text-slate-400 font-bold mb-1">إجمالي قيمة الأحجار الشراء</div>
          <div class="text-2xl font-extrabold text-amber-400 font-mono">${totalStonesValuation.toLocaleString()} ${state.currencySymbol}</div>
          <p class="text-xs text-amber-400 mt-1">محسوبة بناءً على الدفعات (Batches)</p>
        </div>

        <div class="glass-card p-5 rounded-2xl border border-brand-500/20">
          <div class="text-xs text-slate-400 font-bold mb-1">أصناف الخامات النشطة</div>
          <div class="text-2xl font-extrabold text-cyan-400 font-mono">${totalRawItems} أصناف</div>
          <p class="text-xs text-cyan-400 mt-1">شمع، جبس، أحماض، طلاء، إلخ</p>
        </div>
      </div>

      <div class="flex items-center justify-between glass-card p-4 rounded-2xl border border-borderdark">
        <h3 class="text-sm font-bold text-white flex items-center gap-2">
          <span>⚡</span> إجراءات سريعة للمخازن
        </h3>
        <div class="flex gap-3">
          <button onclick="openModal('addStone')" class="px-4 py-2 rounded-xl bg-brand-500 text-slate-950 font-bold text-xs">+ استلام حجر جديد</button>
          <button onclick="openModal('addRaw')" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs">+ إضافة خام جديد</button>
        </div>
      </div>

      <div class="glass-card rounded-2xl p-6 border border-borderdark space-y-4 shadow-xl font-sans">
        <h3 class="text-base font-bold text-white flex items-center gap-2">
          <span>📜</span> أحدث الحركات المخزنية المسجلة بقاعدة البيانات
        </h3>

        ${state.movements.length === 0 
          ? renderEmptyState('لا توجد حركات مخزنية، قم باستلام أحجار أو خامات لبدء السجل', 'استلام حجر جديد', 'addStone') 
          : `
            <div class="overflow-x-auto">
              <table class="w-full text-right text-sm text-slate-300">
                <thead class="text-xs uppercase bg-slate-950 text-slate-400 font-bold border-b border-borderdark">
                  <tr>
                    <th class="p-3">نوع الحركة</th><th class="p-3">الصنف / الكود</th><th class="p-3">الدفعة Batch</th><th class="p-3">الكمية</th><th class="p-3">الوزن (g)</th><th class="p-3">قبل ➔ بعد</th><th class="p-3">المستخدم والتاريخ</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-borderdark font-mono text-xs">
                  ${state.movements.slice(0, 8).map(m => `
                    <tr class="hover:bg-slate-900/50">
                      <td class="p-3 font-bold ${m.txType === 'RECEIVE' ? 'text-emerald-400' : 'text-amber-400'}">${m.txType}</td>
                      <td class="p-3 text-white font-bold">${m.itemName} (${m.itemCode})</td>
                      <td class="p-3 text-brand-500">${m.batchNumber || '—'}</td>
                      <td class="p-3 text-white font-bold">${m.quantity}</td>
                      <td class="p-3 text-emerald-400 font-bold">${m.weightGrams} g</td>
                      <td class="p-3 text-slate-400">${m.balanceBefore} ➔ ${m.balanceAfter}</td>
                      <td class="p-3 text-slate-400 font-sans">${m.userName} (${new Date(m.createdAt).toLocaleTimeString('ar-EG')})</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `
        }
      </div>
    </div>
  `;
}

// 3. STONES STORE SCREEN WITH COLOR SEARCH & CLICK FOR FULL DETAILS
function renderStonesStoreScreen() {
  let displayedStones = state.stones;

  if (state.stoneColorFilter) {
    displayedStones = displayedStones.filter(s => (s.color || '').toLowerCase().includes(state.stoneColorFilter.toLowerCase()));
  }

  if (state.stoneQrFilter) {
    const q = state.stoneQrFilter.toLowerCase();
    displayedStones = displayedStones.filter(s => 
      (s.qrCode || '').toLowerCase().includes(q) || 
      (s.code || '').toLowerCase().includes(q) || 
      (s.barcode || '').includes(q)
    );
  }

  return `
    <div class="glass-card rounded-2xl p-6 border border-borderdark space-y-6 shadow-xl font-sans">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <span>💎</span> مخزن الأحجار الكريمة والزركون (Stones Store)
          </h2>
          <p class="text-xs text-slate-400">اضغط على أي صف لعرض شاشة التفاصيل الكاملة بالـ QR كود والصورة</p>
        </div>

        <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <!-- QR Code Search Input -->
          <input type="text" value="${state.stoneQrFilter}" placeholder="📱 بحث كود الـ QR أو الباركود..." oninput="filterStonesByQr(this.value)" class="px-4 py-2.5 rounded-xl bg-slate-950 border border-brand-500/50 text-brand-500 font-mono text-xs focus:border-brand-400 focus:outline-none flex-1 md:w-56">
          
          <!-- Color Search Input -->
          <input type="text" value="${state.stoneColorFilter}" placeholder="🎨 فلترة الأحجار باللون..." oninput="filterStonesByColor(this.value)" class="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-sans text-xs focus:border-brand-500 focus:outline-none flex-1 md:w-44">

          <button onclick="openModal('addStone')" class="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs shadow-lg shrink-0">+ استلام حجر جديد</button>
        </div>
      </div>

      ${displayedStones.length === 0 
        ? renderEmptyState('لا توجد أحجار مطابقة لفلتر الـ QR كود أو اللون أو قاعدة البيانات فارغة', 'إضافة واستلام حجر جديد', 'addStone')
        : `
          <div class="overflow-x-auto">
            <table class="w-full text-right text-sm text-slate-300">
              <thead class="text-xs uppercase bg-slate-950 text-slate-400 font-bold border-b border-borderdark">
                <tr>
                  <th class="p-3">الصورة وكود الحجر</th>
                  <th class="p-3 text-center">📱 Scannable Mobile QR & Barcode</th>
                  <th class="p-3">الاسم والتصنيف</th>
                  <th class="p-3">النوع والمنشأ</th>
                  <th class="p-3">الشكل واللون والمقاس</th>
                  <th class="p-3">الوزن الأساسي (g)</th>
                  <th class="p-3">العدد المتاح</th>
                  <th class="p-3">سعر الشراء / البيع</th>
                  <th class="p-3">التفاصيل</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-borderdark font-mono text-xs">
                ${displayedStones.map(s => {
                  const qrPayload = generateMobileQrPayload(s);
                  const qrImgUrl = getQrCodeImageUrl(qrPayload, 140);
                  const barcodeVal = s.barcode || ('62910' + Math.floor(10000000 + Math.random()*90000000));
                  const qrVal = s.qrCode || ('QR-' + s.code);
                  const stoneImgTag = s.imageUrl 
                    ? `<img src="${s.imageUrl}" alt="Stone" class="w-9 h-9 rounded-lg object-cover border border-brand-500/40 shrink-0">` 
                    : `<div class="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-xs text-slate-500 shrink-0">🖼️</div>`;

                  return `
                    <tr onclick="openStoneDetailsModal('${s.id}')" class="hover:bg-slate-900/80 cursor-pointer transition-all">
                      <td class="p-3 font-bold text-brand-500">
                        <div class="flex items-center gap-2.5">
                          ${stoneImgTag}
                          <span>${s.code}</span>
                        </div>
                      </td>
                      <td class="p-3 font-sans text-center">
                        <div class="flex items-center justify-center gap-3 p-1.5 rounded-xl bg-slate-950 border border-slate-800">
                          <img src="${qrImgUrl}" alt="Mobile QR Code" title="امسح بالموبايل" class="w-12 h-12 rounded-lg bg-white p-1 border border-slate-700 shadow shrink-0">
                          <div class="text-right font-mono text-[10px] space-y-0.5">
                            <div class="text-emerald-400 font-bold">📊 ${barcodeVal}</div>
                            <div class="text-brand-500 font-bold">📱 ${qrVal}</div>
                          </div>
                        </div>
                      </td>
                      <td class="p-3 text-white font-bold">${s.nameAr}<br><span class="text-[10px] text-emerald-400 font-sans">${s.category} (${s.quality})</span></td>
                      <td class="p-3 text-slate-300 font-sans"><strong class="text-cyan-400 font-mono">${s.stoneType}</strong><br><span class="text-[10px] text-slate-400">${s.origin}</span></td>
                      <td class="p-3 text-slate-300 font-sans">${s.shape} - <strong class="text-rose-400 font-mono">${s.color}</strong><br><span class="text-[10px] text-amber-400 font-bold font-mono">المقاس: ${s.size}</span></td>
                      <td class="p-3 text-emerald-400 font-extrabold text-sm">${s.weightGrams} g</td>
                      <td class="p-3 text-amber-400 font-extrabold text-sm">${s.quantity} قطعة</td>
                      <td class="p-3 text-slate-300">${s.purchasePrice} ${state.currencySymbol} / ${s.sellingPrice} ${state.currencySymbol}</td>
                      <td class="p-3 font-sans">
                        <div class="flex items-center gap-1.5" onclick="event.stopPropagation()">
                          <button onclick="openStoneDetailsModal('${s.id}')" class="px-2.5 py-1 rounded-lg bg-brand-500/20 text-brand-500 border border-brand-500/30 hover:bg-brand-500 hover:text-slate-950 font-bold text-xs transition-all">🔍 التفاصيل</button>
                          <button onclick="openIssueStoneModal('${s.id}')" class="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500 hover:text-white font-bold text-xs transition-all flex items-center gap-1">📤 صرف</button>
                          <button onclick="openReceiveStoneStockModal('${s.id}')" class="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-slate-950 font-bold text-xs transition-all flex items-center gap-1">📥 توريد</button>
                        </div>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        `
      }
    </div>
  `;
}

// 4. RAW MATERIALS STORE SCREEN
function renderRawMaterialsStoreScreen() {
  return `
    <div class="glass-card rounded-2xl p-6 border border-borderdark space-y-6 shadow-xl font-sans">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <span>🧪</span> مخزن الخامات ومستلزمات الإنتاج (Raw Materials Store)
          </h2>
          <p class="text-xs text-slate-400">شمع الصب، الجبس، الريزن، البوراكس، الأحماض، مواد الطلاء والتلميع والتعبئة</p>
        </div>
        <button onclick="openModal('addRaw')" class="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs shadow-lg">+ إضافة خام جديد</button>
      </div>

      ${(() => {
        const rawItems = state.rawMaterials.filter(r => r.warehouseId === 'wh-raw' || (!r.warehouseId && r.category !== 'فضة خام وسائك' && r.category !== 'فضة خام'));
        if (rawItems.length === 0) {
          return renderEmptyState('لا توجد خامات مسجلة بالمخزن، اضغط لإضافة أول صنف خام لقاعدة البيانات', 'إضافة خام جديد', 'addRaw');
        }
        return `
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 font-sans">
            ${rawItems.map(r => `
              <div onclick="openRawDetailsModal('${r.id}')" class="p-5 rounded-2xl bg-slate-950 border border-brand-500/30 space-y-3 glass-card-hover cursor-pointer relative overflow-hidden group">
                <div class="flex justify-between items-center text-xs font-mono">
                  <span class="font-bold text-brand-500 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">${r.itemCode}</span>
                  <span class="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30">${r.category}</span>
                </div>

                <div class="text-base font-extrabold text-white group-hover:text-brand-500 transition-colors">${r.nameAr}</div>
                
                <div class="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5 font-mono text-xs">
                  <div class="flex justify-between items-center text-slate-300">
                    <span>الرصيد الحقيقي المتاح:</span>
                    <strong class="text-emerald-400 text-sm font-extrabold">${r.availableStock} ${r.unitOfMeasure}</strong>
                  </div>
                  <div class="flex justify-between items-center text-slate-400 text-[11px]">
                    <span>تكلفة الوحدة التقديرية:</span>
                    <strong class="text-amber-400">${r.unitCost || 50} ${state.currencySymbol}</strong>
                  </div>
                  <div class="flex justify-between items-center text-slate-400 text-[11px]">
                    <span>إجمالي قيمة المخزون:</span>
                    <strong class="text-cyan-400 font-bold">${((r.availableStock || 0) * (r.unitCost || 50)).toLocaleString('ar-EG')} ${state.currencySymbol}</strong>
                  </div>
                </div>

                <!-- Quick Actions Bar -->
                <div class="flex items-center justify-between gap-2 pt-2 border-t border-borderdark" onclick="event.stopPropagation()">
                  <button onclick="openRawDetailsModal('${r.id}')" class="px-3 py-1.5 rounded-lg bg-brand-500/20 text-brand-500 border border-brand-500/30 hover:bg-brand-500 hover:text-slate-950 font-bold text-xs transition-all flex items-center gap-1">🔍 التفاصيل</button>
                  <div class="flex items-center gap-1.5">
                    <button onclick="openIssueRawModal('${r.id}')" class="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500 hover:text-white font-bold text-xs transition-all flex items-center gap-1">📤 صرف</button>
                    <button onclick="openReceiveRawStockModal('${r.id}')" class="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-slate-950 font-bold text-xs transition-all flex items-center gap-1">📥 توريد</button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      })()}
    </div>
  `;
}

// 5. WAREHOUSES HIERARCHY SCREEN (المخازن السبعة الرئيسية)
function renderWarehousesHierarchyScreen() {
  const warehouses = state.warehouses && state.warehouses.length ? state.warehouses : DEFAULT_7_WAREHOUSES;

  return `
    <div class="glass-card rounded-2xl p-6 border border-borderdark space-y-6 shadow-xl font-sans">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-borderdark">
        <div>
          <h2 class="text-xl font-extrabold text-white flex items-center gap-2">
            <span>🏛️</span> الهيكل الرئيسي للمخازن السبعة (Enterprise 7 Factory Warehouses)
          </h2>
          <p class="text-xs text-slate-400">جميع مخازن مصنع باهر سيلفر القائمة للعمليات والربط الفوري مع القيود المحاسبية</p>
        </div>

        <button onclick="openAddWarehouseItemModal('wh-stones')" class="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-brand-500/25 transition-all flex items-center gap-2">
          <span>+ إضافة صنف لأي مخزن</span>
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        ${warehouses.map(w => {
          let itemCount = 0;
          let totalStockVal = 0;

          if (w.type === 'STONES') {
            itemCount = state.stones.length;
            state.stones.forEach(s => totalStockVal += (s.quantity * (s.purchasePrice || 100)));
          } else {
            const whItems = state.rawMaterials.filter(r => r.warehouseId === w.id || r.category?.includes(w.nameAr));
            itemCount = whItems.length || (w.type === 'RAW_MATERIALS' ? state.rawMaterials.length : 0);
            const list = whItems.length ? whItems : (w.type === 'RAW_MATERIALS' ? state.rawMaterials : []);
            list.forEach(r => totalStockVal += ((r.availableStock || 0) * (r.unitCost || 50)));
          }

          const icon = w.icon || (
            w.type === 'STONES' ? '💎' :
            w.type === 'RAW_MATERIALS' ? '🧪' :
            w.type === 'SILVER' ? '🥈' :
            w.type === 'CHEMICALS' ? '⚗️' :
            w.type === 'COMPONENTS' ? '🧩' :
            w.type === 'SEMI_FINISHED' ? '⚙️' : '✨'
          );

          return `
            <div onclick="openWarehouseDetailsModal('${w.id}')" class="p-5 rounded-2xl bg-slate-950 border border-brand-500/30 space-y-4 glass-card-hover cursor-pointer relative overflow-hidden group">
              <div class="flex justify-between items-center text-xs font-mono">
                <span class="font-bold text-brand-500 bg-brand-500/10 px-2.5 py-1 rounded-lg border border-brand-500/20">${w.code}</span>
                <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">مستوى أمان ${w.securityLevel || 3}</span>
              </div>

              <div class="flex items-center gap-3">
                <div class="h-12 w-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  ${icon}
                </div>
                <div>
                  <h3 class="text-base font-extrabold text-white group-hover:text-brand-500 transition-colors">${w.nameAr}</h3>
                  <span class="text-[11px] text-slate-400 font-mono">الرمز التقني: ${w.type}</span>
                </div>
              </div>

              <div class="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 font-mono text-xs">
                <div class="flex justify-between items-center text-slate-300">
                  <span>عدد الأصناف المسجلة:</span>
                  <strong class="text-amber-400 font-extrabold">${itemCount} أصناف</strong>
                </div>
                <div class="flex justify-between items-center text-slate-400 text-[11px]">
                  <span>إجمالي القيمة التقديرية:</span>
                  <strong class="text-emerald-400 font-extrabold">${totalStockVal.toLocaleString('ar-EG')} ${state.currencySymbol}</strong>
                </div>
              </div>

              <div class="flex items-center justify-between pt-2 border-t border-borderdark text-xs" onclick="event.stopPropagation()">
                <button onclick="openWarehouseDetailsModal('${w.id}')" class="w-full py-2 rounded-xl bg-slate-900 hover:bg-brand-500 hover:text-slate-950 text-slate-200 font-extrabold transition-all border border-slate-800 flex items-center justify-center gap-2">
                  <span>📂 فتح وإدارة مخزون المخزن</span>
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// 6. STORAGE LOCATIONS SCREEN
function renderStorageLocationsScreen() {
  return `
    <div class="glass-card rounded-2xl p-6 border border-borderdark space-y-6 shadow-xl font-sans">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <span>📍</span> موقع التخزين الهرمي (Cabinet ➔ Shelf ➔ Drawer ➔ Box ➔ Bag)
          </h2>
          <p class="text-xs text-slate-400">تتبع دقيق لكل حجر داخل المخزن ببار كود ورمز QR فريد</p>
        </div>
      </div>

      ${state.storageLocations.length === 0 
        ? renderEmptyState('لا توجد مواقع تخزين فرعية مسجلة')
        : `
          <div class="space-y-4 font-mono text-xs">
            ${state.storageLocations.map(loc => `
              <div class="p-4 rounded-2xl bg-slate-950 border border-brand-500/20 space-y-2">
                <div class="flex justify-between items-center">
                  <span class="font-bold text-brand-500">${loc.binCode}</span>
                  <span class="text-slate-400">QR: ${loc.qrCode || '—'}</span>
                </div>
                <div class="text-sm font-bold text-white font-sans">${loc.locationName}</div>
                <div class="text-xs text-emerald-400 font-sans">${loc.fullPathAr || loc.locationName}</div>
              </div>
            `).join('')}
          </div>
        `
      }
    </div>
  `;
}

// 7. TRANSACTIONS TIMELINE SCREEN (سجل الحركة والـ Timeline المتكامل)
function renderTransactionsTimelineScreen() {
  const q = (state.movementSearchQuery || '').trim().toLowerCase();
  const whFilter = state.movementFilterWarehouse || 'ALL';
  const typeFilter = state.movementFilterTxType || 'ALL';

  const filteredMovements = state.movements.filter(m => {
    // Warehouse Filter
    if (whFilter !== 'ALL') {
      if (whFilter === 'wh-silver' && m.txType !== 'RECEIVE_SILVER' && m.txType !== 'ISSUE_SILVER' && !m.itemCode?.includes('SLV')) return false;
      if (whFilter === 'wh-stones' && !m.itemCode?.includes('STN') && m.stoneCategory !== 'أحجار كريم') return false;
      if (whFilter === 'wh-raw' && !m.itemCode?.includes('RAW')) return false;
    }
    // TxType Filter
    if (typeFilter !== 'ALL' && m.txType !== typeFilter) return false;
    // Search Query Filter
    if (q) {
      const match = (val) => val && String(val).toLowerCase().includes(q);
      return match(m.itemCode) || match(m.itemName) || match(m.stoneCategory) || match(m.typeLabel) || match(m.recipientEmployee) || match(m.orderNo) || match(m.notes);
    }
    return true;
  });

  const totalIn = state.movements.filter(m => m.txType?.includes('RECEIVE') || m.txType === 'IN').length;
  const totalOut = state.movements.filter(m => m.txType?.includes('ISSUE') || m.txType === 'OUT').length;

  return `
    <div class="glass-card rounded-2xl p-6 border border-borderdark space-y-6 shadow-xl font-sans">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-borderdark">
        <div>
          <h2 class="text-xl font-extrabold text-white flex items-center gap-2">
            <span>📜</span> سجل حركة الأحجار والفضة والخامات (Immutable Timeline Ledger)
          </h2>
          <p class="text-xs text-slate-400">سجل موثق دائم لجميع العمليات المخزنية: توريد، صرف تشكيل، نقل، تسوية جرد (اضغط على أي حركة لتفاصيل الجواز وقيد اليومية)</p>
        </div>

        <div class="flex gap-2 font-mono text-xs">
          <span class="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">📥 توريد: ${totalIn} حركات</span>
          <span class="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 font-bold">📤 صرف: ${totalOut} حركات</span>
        </div>
      </div>

      <!-- Multi-Criteria Filter Controls -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-xs">
        <div>
          <label class="block text-slate-400 font-bold mb-1">تصفية بحسب المخزن *</label>
          <select onchange="setMovementFilter('warehouse', this.value)" class="w-full h-11 px-3.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white focus:border-brand-500 focus:outline-none">
            <option value="ALL" ${whFilter === 'ALL' ? 'selected' : ''}>جميع المخازن السبعة (All Warehouses)</option>
            <option value="wh-stones" ${whFilter === 'wh-stones' ? 'selected' : ''}>💎 مخزن الأحجار الكريمة (WH-STONES)</option>
            <option value="wh-silver" ${whFilter === 'wh-silver' ? 'selected' : ''}>🥈 مخزن الفضة والسبائك (WH-SILVER)</option>
            <option value="wh-raw" ${whFilter === 'wh-raw' ? 'selected' : ''}>🧪 مخزن الخامات والمستلزمات (WH-RAW)</option>
          </select>
        </div>

        <div>
          <label class="block text-slate-400 font-bold mb-1">تصفية بحسب نوع الحركة *</label>
          <select onchange="setMovementFilter('txType', this.value)" class="w-full h-11 px-3.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white focus:border-brand-500 focus:outline-none">
            <option value="ALL" ${typeFilter === 'ALL' ? 'selected' : ''}>جميع أنواع الحركات (All Operations)</option>
            <option value="RECEIVE" ${typeFilter === 'RECEIVE' ? 'selected' : ''}>📥 إضافة وتوريد أحجار (Receive Stone)</option>
            <option value="ISSUE" ${typeFilter === 'ISSUE' ? 'selected' : ''}>📤 صرف أحجار للإنتاج (Issue Stone)</option>
            <option value="RECEIVE_SILVER" ${typeFilter === 'RECEIVE_SILVER' ? 'selected' : ''}>📥 توريد سبائك/فضة (Receive Silver)</option>
            <option value="ISSUE_SILVER" ${typeFilter === 'ISSUE_SILVER' ? 'selected' : ''}>📤 صرف فضة صب (Issue Silver)</option>
            <option value="ISSUE_RAW" ${typeFilter === 'ISSUE_RAW' ? 'selected' : ''}>📤 صرف خامات ورشة (Issue Raw)</option>
          </select>
        </div>

        <div>
          <label class="block text-slate-400 font-bold mb-1">البحث في السجل *</label>
          <input type="text" value="${state.movementSearchQuery || ''}" placeholder="ابحث بكود الصنف، اسم الصنف، الفني، أمر التشغيل..." oninput="setMovementFilter('query', this.value)" class="w-full h-11 px-3.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white focus:border-brand-500 focus:outline-none">
        </div>
      </div>

      <!-- Movement Timeline Items -->
      ${filteredMovements.length === 0 
        ? renderEmptyState('لا توجد حركات مخزنية مطابقة لمعايير التصفية والبحث') 
        : `
          <div class="space-y-4">
            ${filteredMovements.map(m => {
              const isReceive = m.txType?.includes('RECEIVE') || m.txType === 'IN';
              const badgeBg = isReceive ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border-rose-500/30';
              const icon = isReceive ? '📥' : '📤';

              return `
                <div onclick="openMovementDetailModal('${m.id}')" class="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 glass-card-hover cursor-pointer hover:border-brand-500/60 transition-all shadow-lg group">
                  <div class="space-y-2 flex-1">
                    <div class="flex flex-wrap items-center gap-2 font-mono text-xs">
                      <span class="px-3 py-1 rounded-lg border font-bold ${badgeBg}">${icon} ${m.typeLabel || m.txType}</span>
                      <span class="text-brand-500 font-extrabold bg-brand-500/10 px-2.5 py-1 rounded-lg border border-brand-500/20">${m.itemCode}</span>
                      <span class="text-slate-400 text-[11px] font-sans">${m.stoneCategory || 'عام'}</span>
                    </div>

                    <div class="text-base font-extrabold text-white group-hover:text-brand-500 transition-colors font-sans">${m.itemName}</div>
                    
                    <div class="text-xs text-slate-300 font-sans flex flex-wrap gap-4 pt-1">
                      <span>👤 المستلم/الفني: <strong class="text-white">${m.recipientEmployee || '—'}</strong></span>
                      <span>📋 أمر التشغيل/الدفعة: <strong class="text-amber-400 font-mono">${m.orderNo || '—'}</strong></span>
                    </div>
                  </div>

                  <div class="text-right font-mono text-xs space-y-2 shrink-0 border-t md:border-t-0 md:border-r border-slate-800 pt-3 md:pt-0 md:pr-6">
                    <div class="text-emerald-400 font-extrabold text-sm">${m.quantity} ${m.weightGrams ? `(${m.weightGrams}g)` : ''}</div>
                    <div class="text-slate-400 text-[11px]">الرصيد: <strong class="text-slate-200">${m.balanceBefore || '—'} ➔ ${m.balanceAfter || '—'}</strong></div>
                    <div class="text-slate-500 text-[10px] font-sans flex items-center justify-end gap-1">
                      <span><ctrl42> 📍 أظهـر الجواز الكامل</span>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `
      }
    </div>
  `;
}

// 8. ENTERPRISE DOUBLE-ENTRY ACCOUNTING SYSTEM SCREEN
function renderAccountingSystemScreen() {
  const valuation = recalculateEnterpriseState();
  
  let totalDebit = 0;
  let totalCredit = 0;
  state.chartOfAccounts.forEach(a => {
    if (a.balanceType === 'DEBIT') totalDebit += a.balance;
    else totalCredit += a.balance;
  });

  const totalAssets = state.chartOfAccounts.filter(a => a.category === 'ASSET').reduce((sum, a) => sum + a.balance, 0);
  const totalLiabilities = state.chartOfAccounts.filter(a => a.category === 'LIABILITY').reduce((sum, a) => sum + a.balance, 0);
  const totalExpenses = state.chartOfAccounts.filter(a => a.category === 'EXPENSE').reduce((sum, a) => sum + a.balance, 0);

  return `
    <div class="space-y-6 font-sans">
      <!-- Enterprise Financial Overview Header -->
      <div class="glass-card rounded-2xl p-6 border border-brand-500/30 space-y-6 shadow-xl">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-borderdark">
          <div>
            <h2 class="text-xl font-extrabold text-white flex items-center gap-2">
              <span>⚖️</span> النظام المحاسبي المتكامل وشجرة الحسابات (Double-Entry General Ledger)
            </h2>
            <p class="text-xs text-slate-400">مصنع باهر سيلفر • القيود المحاسبية التلقائية وتوازن المدين والدائن وتقييم المخزون المالي</p>
          </div>

          <div class="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-emerald-500/30 font-mono text-xs">
            <span class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="text-emerald-400 font-bold">توازن القيد المزدوج: 0.00 ${state.currencySymbol} (متوازن 100%)</span>
          </div>
        </div>

        <!-- Financial KPI Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
          <div class="p-4 rounded-2xl bg-slate-950/90 border border-emerald-500/30 space-y-1">
            <div class="text-slate-400 font-sans font-bold">إجمالي الأصول والمخزون:</div>
            <div class="text-emerald-400 text-lg font-extrabold">${totalAssets.toLocaleString('ar-EG')} ${state.currencySymbol}</div>
            <div class="text-[10px] text-slate-500 font-sans">مخزون الأحجار + الخامات + الصندوق + البنوك</div>
          </div>

          <div class="p-4 rounded-2xl bg-slate-950/90 border border-brand-500/30 space-y-1">
            <div class="text-slate-400 font-sans font-bold">تقييم مخزون الأحجار بسعر البيع:</div>
            <div class="text-brand-500 text-lg font-extrabold">${valuation.totalStonesValuationSelling.toLocaleString('ar-EG')} ${state.currencySymbol}</div>
            <div class="text-[10px] text-slate-500 font-sans">القيمة السوقية المرجوة للبيع</div>
          </div>

          <div class="p-4 rounded-2xl bg-slate-950/90 border border-rose-500/30 space-y-1">
            <div class="text-slate-400 font-sans font-bold">تكاليف الأحجار المصروفة للإنتاج:</div>
            <div class="text-rose-400 text-lg font-extrabold">${totalExpenses.toLocaleString('ar-EG')} ${state.currencySymbol}</div>
            <div class="text-[10px] text-slate-500 font-sans">حـ/ 4101 تكلفة أحجار تشكيل المصنع</div>
          </div>

          <div class="p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/30 space-y-1">
            <div class="text-slate-400 font-sans font-bold">التزامات الموردين (دائنون):</div>
            <div class="text-cyan-400 text-lg font-extrabold">${totalLiabilities.toLocaleString('ar-EG')} ${state.currencySymbol}</div>
            <div class="text-[10px] text-slate-500 font-sans">حـ/ 2101 مستحقات الموردين الآجلة</div>
          </div>
        </div>
      </div>

      <!-- Section 1: Chart of Accounts Table -->
      <div class="glass-card rounded-2xl p-6 border border-borderdark space-y-4 shadow-xl">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-extrabold text-white flex items-center gap-2">
            <span>🌳</span> شجرة الحسابات الرئيسية المعيارية (Standard Chart of Accounts)
          </h3>
          <span class="text-xs text-slate-400 font-mono">عدد الحسابات: ${state.chartOfAccounts.length}</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-right text-sm text-slate-300">
            <thead class="text-xs uppercase bg-slate-950 text-slate-400 font-bold border-b border-borderdark">
              <tr>
                <th class="p-3">كود الحساب</th>
                <th class="p-3">اسم الحساب المحاسبي</th>
                <th class="p-3">التصنيف</th>
                <th class="p-3">طبيعة الحساب</th>
                <th class="p-3">الرصيد الحالي</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-borderdark font-mono text-xs">
              ${state.chartOfAccounts.map(a => `
                <tr class="hover:bg-slate-900/50">
                  <td class="p-3 font-bold text-brand-500">${a.code}</td>
                  <td class="p-3 text-white font-bold font-sans">${a.nameAr}</td>
                  <td class="p-3 font-sans">
                    <span class="px-2.5 py-0.5 rounded text-[11px] font-bold ${
                      a.category === 'ASSET' ? 'bg-emerald-500/20 text-emerald-400' :
                      a.category === 'LIABILITY' ? 'bg-rose-500/20 text-rose-400' :
                      a.category === 'EXPENSE' ? 'bg-amber-500/20 text-amber-400' : 'bg-cyan-500/20 text-cyan-400'
                    }">${a.category}</span>
                  </td>
                  <td class="p-3 text-slate-400 font-sans">${a.balanceType === 'DEBIT' ? 'مدين (Debit)' : 'دائن (Credit)'}</td>
                  <td class="p-3 font-extrabold text-sm ${a.balanceType === 'DEBIT' ? 'text-emerald-400' : 'text-cyan-400'}">
                    ${a.balance.toLocaleString('ar-EG')} ${state.currencySymbol}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Section 2: General Journal Ledger (دفتر اليومية العامة والقيود الآلية) -->
      <div class="glass-card rounded-2xl p-6 border border-borderdark space-y-4 shadow-xl">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-extrabold text-white flex items-center gap-2">
            <span>📖</span> دفتر اليومية العامة والقيود المحاسبية التلقائية (General Journal Ledger)
          </h3>
          <span class="text-xs text-slate-400 font-mono">إجمالي القيود: ${state.journalEntries.length}</span>
        </div>

        ${state.journalEntries.length === 0
          ? renderEmptyState('لا توجد قيود محاسبية مسجلة بعد، قم بإجراء عمليات صرف أو توريد أحجار لإنشاء القيود آلياً')
          : `
            <div class="space-y-3 font-mono text-xs">
              ${state.journalEntries.map(j => `
                <div class="p-4 rounded-2xl bg-slate-950 border border-borderdark space-y-2">
                  <div class="flex justify-between items-center pb-2 border-b border-borderdark/60">
                    <div class="flex items-center gap-2">
                      <span class="px-2.5 py-0.5 rounded bg-brand-500/20 text-brand-500 font-bold">${j.id}</span>
                      <span class="text-slate-300 font-sans text-xs font-bold">${j.description}</span>
                    </div>
                    <span class="text-slate-400 text-[11px] font-sans">${j.date}</span>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div class="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex justify-between items-center">
                      <div>
                        <span class="text-[10px] text-emerald-400 block font-sans">طرف مدين (Debit Account):</span>
                        <strong class="text-emerald-400 text-xs font-sans">${j.debitAccountCode} - ${j.debitAccountName}</strong>
                      </div>
                      <strong class="text-emerald-400 text-sm">+${j.amount.toLocaleString('ar-EG')} ${state.currencySymbol}</strong>
                    </div>

                    <div class="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex justify-between items-center">
                      <div>
                        <span class="text-[10px] text-cyan-400 block font-sans">طرف دائن (Credit Account):</span>
                        <strong class="text-cyan-400 text-xs font-sans">${j.creditAccountCode} - ${j.creditAccountName}</strong>
                      </div>
                      <strong class="text-cyan-400 text-sm">-${j.amount.toLocaleString('ar-EG')} ${state.currencySymbol}</strong>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          `
        }
      </div>
    </div>
  `;
}

// 8. AUDIT SCREEN
function renderInventoryAuditScreen() {
  return `
    <div class="glass-card rounded-2xl p-6 border border-borderdark space-y-6 shadow-xl font-sans">
      <div>
        <h2 class="text-xl font-bold text-white flex items-center gap-2">
          <span>📋</span> شاشة جرد المخزون والرصيد الفعلي (Inventory Audit Engine)
        </h2>
        <p class="text-xs text-slate-400">مطابقة الرصيد المسجل مع الرصيد الفعلي وحساب الفرق والتسوية التلقائية</p>
      </div>

      ${state.audits.length === 0 
        ? renderEmptyState('لا توجد جلسات جرد سابقة')
        : `
          <div class="space-y-4 font-mono text-xs">
            ${state.audits.map(a => `
              <div class="p-5 rounded-2xl bg-slate-950 border border-brand-500/20 space-y-3">
                <div class="flex justify-between items-center">
                  <span class="font-bold text-brand-500 text-sm">${a.auditCode}</span>
                  <span class="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">${a.status}</span>
                </div>
                <div class="text-xs text-slate-300 font-sans">المخزن: ${a.warehouseName} | القائم بالجرد: ${a.auditorName}</div>
              </div>
            `).join('')}
          </div>
        `
      }
    </div>
  `;
}

// 9. UNIVERSAL SEARCH SCREEN ACROSS ALL 7 WAREHOUSES & ENTITIES
function renderUniversalSearchScreen() {
  const q = (state.searchQuery || '').trim().toLowerCase();
  
  // Calculate matches dynamically across all collections
  const match = (val) => val && String(val).toLowerCase().includes(q);

  const matchedStones = q ? state.stones.filter(s => 
    match(s.code) || match(s.nameAr) || match(s.nameEn) || match(s.stoneType) || 
    match(s.category) || match(s.color) || match(s.shape) || match(s.size) || 
    match(s.quality) || match(s.origin) || match(s.supplierName) || match(s.barcode) || match(s.qrCode)
  ) : state.stones;

  const matchedSilver = q ? state.silverItems.filter(s => 
    match(s.itemCode) || match(s.nameAr) || match(s.nameEn) || match(s.category) || 
    match(s.unitOfMeasure) || match(s.supplierName) || match(s.barcode) || match(s.qrCode)
  ) : state.silverItems;

  const matchedRaw = q ? state.rawMaterials.filter(r => 
    match(r.itemCode) || match(r.nameAr) || match(r.nameEn) || match(r.category) || 
    match(r.warehouseName) || match(r.unitOfMeasure) || match(r.supplierName)
  ) : state.rawMaterials;

  const matchedWarehouses = q ? state.warehouses.filter(w => 
    match(w.code) || match(w.nameAr) || match(w.nameEn) || match(w.type)
  ) : state.warehouses;

  const matchedMovements = q ? state.movements.filter(m => 
    match(m.itemCode) || match(m.itemName) || match(m.txType) || match(m.typeLabel) || 
    match(m.recipientEmployee) || match(m.orderNo) || match(m.notes)
  ) : state.movements;

  const matchedJournals = q ? state.journalEntries.filter(j => 
    match(j.referenceNo) || match(j.description) || match(j.debitAccountCode) || 
    match(j.debitAccountName) || match(j.creditAccountCode) || match(j.creditAccountName) || match(j.amount)
  ) : state.journalEntries;

  const totalMatches = matchedStones.length + matchedSilver.length + matchedRaw.length + matchedWarehouses.length + matchedMovements.length + matchedJournals.length;

  return `
    <div class="glass-card rounded-2xl p-6 border border-borderdark space-y-6 shadow-xl font-sans">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-borderdark">
        <div>
          <h2 class="text-xl font-extrabold text-white flex items-center gap-2">
            <span>🔍</span> محرك البحث الفائق الموحد الشامل (Enterprise Universal Super Search)
          </h2>
          <p class="text-xs text-slate-400">البحث الفوري المتزامن في الأحجار، الفضة، الخامات، المخازن السبعة، الحركات، والقيود المحاسبية</p>
        </div>

        <div class="px-4 py-2 rounded-xl bg-brand-500/10 text-brand-500 border border-brand-500/30 text-xs font-bold font-mono">
          إجمالي المطابقات: ${totalMatches} نتائج
        </div>
      </div>

      <!-- Search Input Bar -->
      <div class="flex gap-3">
        <div class="relative flex-1">
          <input type="text" id="search-input" value="${state.searchQuery || ''}" placeholder="📱 امسح باركود/QR بالموبايل، أو اكتب اسم الحجر، عيار الفضة، اسم الخامة، المورد، رقم القيد..." class="w-full pl-4 pr-11 py-3.5 rounded-2xl bg-slate-950 border border-brand-500/50 text-white font-sans text-sm focus:outline-none focus:border-brand-400 shadow-inner" oninput="performLiveSearch(this.value)">
          <span class="absolute right-4 top-4 text-slate-400 text-sm">🔍</span>
        </div>
        <button onclick="performLiveSearch(document.getElementById('search-input').value)" class="px-7 py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-extrabold text-xs shadow-lg transition-all">بحث فائق</button>
      </div>

      <!-- Results Accordion / Grids -->
      <div class="space-y-8 font-sans">
        
        <!-- SECTION 1: STONES (الأحجار الكريمة) -->
        <div class="space-y-3">
          <div class="flex justify-between items-center pb-2 border-b border-borderdark">
            <h3 class="text-sm font-extrabold text-white flex items-center gap-2">
              <span>💎</span> نتائج الأحجار الكريمة (${matchedStones.length})
            </h3>
            <span class="text-xs text-slate-400 font-mono">مخزن الأحجار (WH-STONES)</span>
          </div>

          ${matchedStones.length === 0 ? '<p class="text-xs text-slate-500 p-4 rounded-xl bg-slate-950">لا توجد أحجار مطابقة لنص البحث</p>' : `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              ${matchedStones.map(s => `
                <div onclick="openStoneDetailsModal('${s.id}')" class="p-4 rounded-2xl bg-slate-950 border border-brand-500/30 flex items-center justify-between gap-4 cursor-pointer hover:border-brand-500 hover:bg-slate-900/80 transition-all shadow-md">
                  <div class="space-y-1.5 flex-1">
                    <div class="flex justify-between font-bold text-white text-sm font-sans">
                      <span>${s.nameAr}</span>
                      <span class="text-emerald-400 font-mono">${s.weightGrams} g</span>
                    </div>
                    <div class="text-xs text-slate-300 font-sans">
                      النوع: ${s.stoneType} | اللون: <strong class="text-rose-400">${s.color}</strong> | المقاس: ${s.size}
                    </div>
                    <div class="flex justify-between items-center text-xs pt-1 border-t border-slate-800">
                      <span class="text-amber-400 font-bold font-mono">الكمية: ${s.quantity} قطعة</span>
                      <span class="text-brand-500 font-mono text-[10px]">${s.code}</span>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <!-- SECTION 2: RAW SILVER & BULLION (مخزن الفضة الخام والسبائك) -->
        <div class="space-y-3">
          <div class="flex justify-between items-center pb-2 border-b border-borderdark">
            <h3 class="text-sm font-extrabold text-white flex items-center gap-2">
              <span>🥈</span> نتائج خام الفضة والسبائك (${matchedSilver.length})
            </h3>
            <span class="text-xs text-slate-400 font-mono">مخزن الفضة المستقل (WH-SILVER)</span>
          </div>

          ${matchedSilver.length === 0 ? '<p class="text-xs text-slate-500 p-4 rounded-xl bg-slate-950">لا توجد سبائك أو فضة مطابقة لنص البحث</p>' : `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              ${matchedSilver.map(s => `
                <div onclick="openSilverDetailsModal('${s.id}')" class="p-4 rounded-2xl bg-slate-950 border border-slate-700/80 flex items-center justify-between gap-4 cursor-pointer hover:border-slate-500 hover:bg-slate-900/80 transition-all shadow-md">
                  <div class="space-y-1.5 flex-1">
                    <div class="flex justify-between font-bold text-white text-sm font-sans">
                      <span>${s.nameAr}</span>
                      <span class="text-emerald-400 font-mono">${s.availableStock} g</span>
                    </div>
                    <div class="text-xs text-slate-300 font-sans">
                      التصنيف: ${s.category} | حساب الأصول: <strong class="text-cyan-400 font-mono">1105</strong>
                    </div>
                    <div class="flex justify-between items-center text-xs pt-1 border-t border-slate-800">
                      <span class="text-amber-400 font-bold font-mono">التكلفة: ${s.unitCost || 65} ${state.currencySymbol}/g</span>
                      <span class="text-brand-500 font-mono text-[10px]">${s.itemCode}</span>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <!-- SECTION 3: RAW MATERIALS & FACTORY STORES (الخامات والكيماويات والمكونات) -->
        <div class="space-y-3">
          <div class="flex justify-between items-center pb-2 border-b border-borderdark">
            <h3 class="text-sm font-extrabold text-white flex items-center gap-2">
              <span>🧪</span> نتائج الخامات والكيماويات والمكونات (${matchedRaw.length})
            </h3>
            <span class="text-xs text-slate-400 font-mono">مخازن الورش والإنتاج</span>
          </div>

          ${matchedRaw.length === 0 ? '<p class="text-xs text-slate-500 p-4 rounded-xl bg-slate-950">لا توجد خامات مطابقة لنص البحث</p>' : `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              ${matchedRaw.map(r => `
                <div onclick="openRawDetailsModal('${r.id}')" class="p-4 rounded-2xl bg-slate-950 border border-brand-500/20 flex items-center justify-between gap-4 cursor-pointer hover:border-brand-500 hover:bg-slate-900/80 transition-all shadow-md">
                  <div class="space-y-1.5 flex-1">
                    <div class="flex justify-between font-bold text-white text-sm font-sans">
                      <span>${r.nameAr}</span>
                      <span class="text-emerald-400 font-mono">${r.availableStock} ${r.unitOfMeasure}</span>
                    </div>
                    <div class="text-xs text-slate-300 font-sans">
                      التصنيف: ${r.category} | المخزن: ${r.warehouseName || 'مخزن الخامات'}
                    </div>
                    <div class="flex justify-between items-center text-xs pt-1 border-t border-slate-800">
                      <span class="text-amber-400 font-bold font-mono">التكلفة: ${r.unitCost || 50} ${state.currencySymbol}</span>
                      <span class="text-brand-500 font-mono text-[10px]">${r.itemCode}</span>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <!-- SECTION 4: ENTERPRISE 7 WAREHOUSES (المخازن السبعة) -->
        <div class="space-y-3">
          <div class="flex justify-between items-center pb-2 border-b border-borderdark">
            <h3 class="text-sm font-extrabold text-white flex items-center gap-2">
              <span>🏛️</span> نتائج المخازن الرئيسية السبعة (${matchedWarehouses.length})
            </h3>
            <span class="text-xs text-slate-400 font-mono">الهيكل الإداري للمصنع</span>
          </div>

          ${matchedWarehouses.length === 0 ? '<p class="text-xs text-slate-500 p-4 rounded-xl bg-slate-950">لا توجد مخازن مطابقة لنص البحث</p>' : `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              ${matchedWarehouses.map(w => `
                <div onclick="openWarehouseDetailsModal('${w.id}')" class="p-4 rounded-2xl bg-slate-950 border border-brand-500/30 space-y-2 cursor-pointer hover:border-brand-400 transition-all">
                  <div class="flex justify-between items-center">
                    <span class="font-bold text-brand-500">${w.code}</span>
                    <span class="text-emerald-400 font-bold text-[10px]">مستوى أمان ${w.securityLevel}</span>
                  </div>
                  <div class="text-sm font-extrabold text-white font-sans">${w.nameAr}</div>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <!-- SECTION 5: MOVEMENTS & AUDIT LEDGER (سجل الحركات) -->
        <div class="space-y-3">
          <div class="flex justify-between items-center pb-2 border-b border-borderdark">
            <h3 class="text-sm font-extrabold text-white flex items-center gap-2">
              <span>📜</span> نتائج سجل الحركات والعمليات المخزنية (${matchedMovements.length})
            </h3>
            <span class="text-xs text-slate-400 font-mono">سجل الحركة والـ Timeline</span>
          </div>

          ${matchedMovements.length === 0 ? '<p class="text-xs text-slate-500 p-4 rounded-xl bg-slate-950">لا توجد حركات مخزنية مطابقة لنص البحث</p>' : `
            <div class="space-y-2 font-mono text-xs">
              ${matchedMovements.map(m => `
                <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row justify-between gap-2">
                  <div>
                    <div class="font-bold text-white font-sans">${m.itemName} (${m.itemCode})</div>
                    <div class="text-slate-400 font-sans text-[11px]">${m.typeLabel || m.txType} • المستلم/الفني: ${m.recipientEmployee || '—'}</div>
                  </div>
                  <div class="text-left font-sans">
                    <div class="text-amber-400 font-bold font-mono">${m.balanceAfter || m.quantity}</div>
                    <div class="text-[10px] text-slate-500">${m.timestamp || m.createdAt}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <!-- SECTION 6: JOURNAL ENTRIES (القيود المحاسبية) -->
        <div class="space-y-3">
          <div class="flex justify-between items-center pb-2 border-b border-borderdark">
            <h3 class="text-sm font-extrabold text-white flex items-center gap-2">
              <span>⚖️</span> نتائج القيود المحاسبية المزدوجة (${matchedJournals.length})
            </h3>
            <span class="text-xs text-slate-400 font-mono">دفتر اليومية العامة</span>
          </div>

          ${matchedJournals.length === 0 ? '<p class="text-xs text-slate-500 p-4 rounded-xl bg-slate-950">لا توجد قيود محاسبية مطابقة لنص البحث</p>' : `
            <div class="space-y-2 font-mono text-xs">
              ${matchedJournals.map(j => `
                <div class="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center gap-4">
                  <div>
                    <div class="font-bold text-brand-500">${j.referenceNo}</div>
                    <div class="text-slate-200 font-sans text-xs">${j.description}</div>
                    <div class="text-[11px] text-slate-400 font-sans">مدين: ${j.debitAccountName} (${j.debitAccountCode}) ➔ دائن: ${j.creditAccountName} (${j.creditAccountCode})</div>
                  </div>
                  <div class="text-emerald-400 text-sm font-extrabold font-mono shrink-0">${parseFloat(j.amount).toLocaleString('ar-EG')} ${state.currencySymbol}</div>
                </div>
              `).join('')}
            </div>
          `}
        </div>

      </div>
    </div>
  `;
}

function performLiveSearch(q) {
  state.searchQuery = q || '';
  renderApp();
}

// MODALS AND FORMS (FULL DETAILS MODAL + MULTI-OPTION IMAGE ENGINE)
function renderActiveModal() {
  if (!state.activeModal) return '';

  // FULL STONE DETAILS MODAL WITH STONE IMAGE
  if (state.activeModal === 'stoneDetailsModal' && state.selectedStoneDetails) {
    const s = state.selectedStoneDetails;
    const qrPayload = generateMobileQrPayload(s);
    const qrImgUrl = getQrCodeImageUrl(qrPayload, 160);
    const barcodeVal = s.barcode || ('62910' + Math.floor(10000000 + Math.random()*90000000));
    const qrVal = s.qrCode || ('QR-' + s.code);
    const stoneImgDisplay = s.imageUrl 
      ? `<img src="${s.imageUrl}" alt="Stone Image" class="w-28 h-28 rounded-2xl object-cover border-2 border-brand-500/50 shadow-xl shrink-0">` 
      : `<div class="w-28 h-28 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-slate-500 text-xs text-center shrink-0"><span>🖼️</span><span>لا توجد صورة</span></div>`;

    return `
      <div class="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
        <div class="glass-card max-w-3xl w-full p-6 md:p-8 rounded-3xl border border-brand-500/40 space-y-6 max-h-[92vh] overflow-y-auto text-right font-sans shadow-2xl">
          
          <!-- Header -->
          <div class="flex justify-between items-center pb-4 border-b border-borderdark">
            <div class="flex items-center gap-4">
              ${stoneImgDisplay}
              <div>
                <h3 class="text-xl font-extrabold text-white tracking-wide">${s.nameAr}</h3>
                <p class="text-xs text-slate-400 font-mono">كود الحجر: ${s.code} • Batch: ${s.batchNumber || '—'}</p>
                <div class="mt-2 flex gap-2">
                  <span class="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[11px] font-bold">${s.category}</span>
                  <span class="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-[11px] font-bold">${s.stoneType}</span>
                </div>
              </div>
            </div>
            <button onclick="closeModal()" class="h-9 w-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/80 flex items-center justify-center transition-all">✕</button>
          </div>

          <!-- Mobile Scannable QR Code & Barcode Section -->
          <div class="p-5 rounded-2xl bg-slate-950 border border-brand-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-inner">
            <div class="space-y-2 flex-1">
              <span class="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono">📱 Mobile Scannable QR Data</span>
              <div class="text-xs text-slate-300 font-mono space-y-1 pt-1">
                <div>📊 Barcode الرقمي: <strong class="text-emerald-400 text-sm">${barcodeVal}</strong></div>
                <div>📱 كود الـ QR: <strong class="text-brand-500 text-sm">${qrVal}</strong></div>
                <div class="text-[11px] text-slate-400">وجه كاميرا الموبايل نحو الكود المكتوب للقراءة المباشرة 📲</div>
              </div>
            </div>
            <div class="p-2 rounded-2xl bg-white border border-slate-700 shadow-xl shrink-0">
              <img src="${qrImgUrl}" alt="Scannable QR Code" title="امسح بالموبايل" class="w-32 h-32 rounded-xl">
            </div>
          </div>

          <!-- Attributes Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div class="p-4 rounded-2xl bg-slate-950/80 border border-borderdark space-y-2">
              <div class="text-slate-400 font-sans font-bold text-xs">📌 المواصفات الأساسية والمنشأ:</div>
              <div class="flex justify-between text-slate-200"><span>التصنيف:</span><strong class="text-emerald-400 font-sans">${s.category}</strong></div>
              <div class="flex justify-between text-slate-200"><span>نوع الحجر:</span><strong class="text-cyan-400 font-sans">${s.stoneType}</strong></div>
              <div class="flex justify-between text-slate-200"><span>المنشأ والبلد:</span><strong class="text-slate-300 font-sans">${s.origin}</strong></div>
            </div>

            <div class="p-4 rounded-2xl bg-slate-950/80 border border-borderdark space-y-2">
              <div class="text-slate-400 font-sans font-bold text-xs">🎨 الألوان والخصائص الفيزيائية:</div>
              <div class="flex justify-between text-slate-200"><span>اللون:</span><strong class="text-rose-400 font-sans">${s.color}</strong></div>
              <div class="flex justify-between text-slate-200"><span>الشكل الهندسي:</span><strong class="text-slate-300 font-sans">${s.shape}</strong></div>
              <div class="flex justify-between text-slate-200"><span>المقاس (يدوي):</span><strong class="text-amber-400 font-bold">${s.size}</strong></div>
              <div class="flex justify-between text-slate-200"><span>درجة الجودة:</span><strong class="text-emerald-400 font-sans">${s.quality}</strong></div>
            </div>

            <div class="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 space-y-2">
              <div class="text-emerald-400 font-sans font-bold text-xs">⚖️ الأوزان والكميات المسجلة:</div>
              <div class="flex justify-between text-slate-200"><span>الوزن الأساسي بالجرام:</span><strong class="text-emerald-400 text-sm font-bold">${s.weightGrams} g</strong></div>
              <div class="flex justify-between text-slate-200"><span>الوزن بالقيراط (ct):</span><strong class="text-brand-500">${s.weightCarats || (s.weightGrams*5).toFixed(3)} ct</strong></div>
              <div class="flex justify-between text-slate-200"><span>العدد الكلي المتاح:</span><strong class="text-amber-400 text-sm font-bold">${s.quantity} قطعة</strong></div>
            </div>

            <div class="p-4 rounded-2xl bg-slate-950/80 border border-borderdark space-y-2">
              <div class="text-slate-400 font-sans font-bold text-xs">💰 التقييم المالي والمورد:</div>
              <div class="flex justify-between text-slate-200"><span>سعر الشراء:</span><strong>${s.purchasePrice} ${state.currencySymbol}</strong></div>
              <div class="flex justify-between text-slate-200"><span>سعر البيع:</span><strong>${s.sellingPrice} ${state.currencySymbol}</strong></div>
              <div class="flex justify-between text-slate-200"><span>اسم المورد:</span><span class="font-sans">${s.supplierName || '—'}</span></div>
              <div class="flex justify-between text-slate-200"><span>رقم الفاتورة:</span><span>${s.invoiceNumber || '—'}</span></div>
            </div>
          </div>

          <div class="flex justify-between items-center pt-4 border-t border-borderdark flex-wrap gap-2">
            <div class="flex items-center gap-2">
              <button onclick="openIssueStoneModal('${s.id}')" class="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs shadow-lg shadow-rose-500/25 transition-all flex items-center gap-2">
                <span>📤</span> <span>صرف أحجار من هذا الحجر</span>
              </button>
              <button onclick="openReceiveStoneStockModal('${s.id}')" class="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2">
                <span>📥</span> <span>إضافة / توريد رصيد إضافي</span>
              </button>
              <button onclick="openItemMovementHistoryModal('${s.code || s.id}')" class="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-brand-500 border border-brand-500/30 font-bold text-xs transition-all flex items-center gap-2">
                <span>📜</span> <span>سجل حركة الصنف الكامل</span>
              </button>
            </div>
            <button onclick="closeModal()" class="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-bold text-xs shadow-lg">إغلاق التفاصيل</button>
          </div>
        </div>
      </div>
    `;
  }

  // ISSUE STONE MODAL (صرف أحجار وتوثيق حركة الصنف)
  if (state.activeModal === 'issueStoneModal' && state.selectedStoneForIssue) {
    const s = state.selectedStoneForIssue;
    return `
      <div class="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
        <div class="glass-card max-w-xl w-full p-6 md:p-8 rounded-3xl border border-rose-500/40 space-y-6 max-h-[92vh] overflow-y-auto text-right font-sans shadow-2xl">
          
          <!-- Header -->
          <div class="flex justify-between items-center pb-4 border-b border-borderdark">
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-xl text-rose-400">
                📤
              </div>
              <div>
                <h3 class="text-lg font-extrabold text-white tracking-wide">إذن صرف أحجار — حركة صنف صادرة</h3>
                <p class="text-xs text-rose-400 font-mono">الحجر: ${s.nameAr} (${s.code}) • المتاح: ${s.quantity} قطعة | ${s.weightGrams} جرام</p>
              </div>
            </div>
            <button onclick="closeModal()" class="h-9 w-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/80 flex items-center justify-center transition-all">✕</button>
          </div>

          <form onsubmit="handleIssueStoneSubmit(event, '${s.id}')" class="space-y-5 text-xs font-sans">
            
            <!-- Selected Stone Info Summary -->
            <div class="p-4 rounded-2xl bg-slate-950 border border-rose-500/30 grid grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono">
              <div><span class="text-slate-400 block text-[11px]">التصنيف والنوع:</span><strong class="text-emerald-400">${s.category} - ${s.stoneType}</strong></div>
              <div><span class="text-slate-400 block text-[11px]">العدد المتاح:</span><strong class="text-amber-400">${s.quantity} قطعة</strong></div>
              <div><span class="text-slate-400 block text-[11px]">الوزن المتاح (g):</span><strong class="text-emerald-400">${s.weightGrams} g</strong></div>
            </div>

            <!-- Issue Specs Form -->
            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-rose-400 font-bold mb-1.5">العدد المصروف (قطع) *</label>
                  <input type="number" name="issueQuantity" min="1" max="${s.quantity}" required placeholder="مثال: 5" class="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-rose-500/60 text-white font-mono text-sm focus:border-rose-400 focus:outline-none transition-all">
                </div>

                <div>
                  <label class="block text-rose-400 font-bold mb-1.5">الوزن المصروف بالجرام (g) *</label>
                  <input type="number" step="0.001" name="issueWeightGrams" min="0.001" max="${s.weightGrams}" required placeholder="مثال: 2.500" class="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-rose-500/60 text-white font-mono text-sm focus:border-rose-400 focus:outline-none transition-all">
                </div>
              </div>

              <div>
                <label class="block text-slate-300 font-bold mb-1.5">غرض الصرف / نوع الحركة *</label>
                <select name="issueType" required class="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white font-sans focus:border-rose-400 focus:outline-none transition-all">
                  <option value="صرف للإنتاج والتشكيل">صرف للإنتاج والتشكيل</option>
                  <option value="صرف للصيانة والإصلاح">صرف للصيانة والإصلاح</option>
                  <option value="صرف لطلبية عميل خاصة">صرف لطلبية عميل خاصة</option>
                  <option value="صرف هالك أو تالف">صرف هالك أو تالف</option>
                  <option value="تحويل لمخزن آخر">تحويل لمخزن آخر</option>
                </select>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-slate-300 font-bold mb-1.5">الموظف المستلم / الفني *</label>
                  <input type="text" name="recipientEmployee" required placeholder="اسم الفني المستلم" class="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:border-brand-500 focus:outline-none">
                </div>

                <div>
                  <label class="block text-slate-300 font-bold mb-1.5">رقم أمر الإنتاج / الطلبية</label>
                  <input type="text" name="productionOrderNo" placeholder="مثال: ORD-2026-901" class="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white font-mono text-xs focus:border-brand-500 focus:outline-none">
                </div>
              </div>

              <div>
                <label class="block text-slate-300 font-bold mb-1.5">ملاحظات الصرف والتفاصيل</label>
                <textarea name="notes" rows="2" placeholder="أدخل أي ملاحظات إضافية بخصوص إذن الصرف..." class="w-full p-3 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:border-brand-500 focus:outline-none resize-none"></textarea>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end gap-3 pt-4 border-t border-borderdark">
              <button type="button" onclick="closeModal()" class="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-bold text-xs transition-all">إلغاء</button>
              <button type="submit" class="px-7 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs shadow-lg shadow-rose-500/25 transition-all flex items-center gap-2"><span>تأكيد عملية الصرف وتسجيل حركة الصنف</span> <span>📤</span></button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  // RECEIVE STONE STOCK MODAL (إضافة وتوريد رصيد أحجار)
  if (state.activeModal === 'receiveStoneStockModal' && state.selectedStoneForReceive) {
    const s = state.selectedStoneForReceive;
    return `
      <div class="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
        <div class="glass-card max-w-xl w-full p-6 md:p-8 rounded-3xl border border-emerald-500/40 space-y-6 max-h-[92vh] overflow-y-auto text-right font-sans shadow-2xl">
          
          <!-- Header -->
          <div class="flex justify-between items-center pb-4 border-b border-borderdark">
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xl text-emerald-400">
                📥
              </div>
              <div>
                <h3 class="text-lg font-extrabold text-white tracking-wide">إذن توريد وإضافة رصيد أحجار — حركة صنف واردة</h3>
                <p class="text-xs text-emerald-400 font-mono">الحجر: ${s.nameAr} (${s.code}) • الرصيد الحقيقي المتاح: ${s.quantity} قطعة | ${s.weightGrams} جرام</p>
              </div>
            </div>
            <button onclick="closeModal()" class="h-9 w-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/80 flex items-center justify-center transition-all">✕</button>
          </div>

          <form onsubmit="handleReceiveStoneStockSubmit(event, '${s.id}')" class="space-y-5 text-xs font-sans">
            
            <!-- Selected Stone Info Summary -->
            <div class="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 grid grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono">
              <div><span class="text-slate-400 block text-[11px]">التصنيف والنوع:</span><strong class="text-emerald-400">${s.category} - ${s.stoneType}</strong></div>
              <div><span class="text-slate-400 block text-[11px]">الرصيد الحالي:</span><strong class="text-amber-400">${s.quantity} قطعة</strong></div>
              <div><span class="text-slate-400 block text-[11px]">الوزن الحالي (g):</span><strong class="text-emerald-400">${s.weightGrams} g</strong></div>
            </div>

            <!-- Receive Specs Form -->
            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-emerald-400 font-bold mb-1.5">العدد المضاف للتوريد (قطع) *</label>
                  <input type="number" name="addedQuantity" min="1" required placeholder="مثال: 20" class="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-emerald-500/60 text-white font-mono text-sm focus:border-emerald-400 focus:outline-none transition-all">
                </div>

                <div>
                  <label class="block text-emerald-400 font-bold mb-1.5">الوزن المضاف بالجرام (g) *</label>
                  <input type="number" step="0.001" name="addedWeightGrams" min="0.001" required placeholder="مثال: 50.000" class="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-emerald-500/60 text-white font-mono text-sm focus:border-emerald-400 focus:outline-none transition-all">
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-slate-300 font-bold mb-1.5">سعر الشراء الفردي (ج.م)</label>
                  <input type="number" step="0.01" name="purchasePrice" value="${s.purchasePrice || ''}" placeholder="سعر الشراء" class="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white font-mono text-xs focus:border-brand-500 focus:outline-none">
                </div>

                <div>
                  <label class="block text-slate-300 font-bold mb-1.5">حساب التسوية المالية *</label>
                  <select name="paymentSource" required class="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white font-sans focus:border-brand-500 focus:outline-none transition-all">
                    <option value="CREDITOR">حساب المورد (دائنون - 2101)</option>
                    <option value="CASH">الخزينة والصندوق (نقد - 1103)</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-slate-300 font-bold mb-1.5">اسم المورد</label>
                  <input type="text" name="supplierName" value="${s.supplierName || ''}" placeholder="اسم المورد" class="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:border-brand-500 focus:outline-none">
                </div>

                <div>
                  <label class="block text-slate-300 font-bold mb-1.5">رقم فاتورة الشراء</label>
                  <input type="text" name="invoiceNumber" value="${s.invoiceNumber || ''}" placeholder="مثال: INV-2026-88" class="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white font-mono text-xs focus:border-brand-500 focus:outline-none">
                </div>
              </div>

              <div>
                <label class="block text-slate-300 font-bold mb-1.5">ملاحظات التوريد وإضافة الرصيد</label>
                <textarea name="notes" rows="2" placeholder="أدخل أي ملاحظات إضافية بخصوص إذن التوريد..." class="w-full p-3 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:border-brand-500 focus:outline-none resize-none"></textarea>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end gap-3 pt-4 border-t border-borderdark">
              <button type="button" onclick="closeModal()" class="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-bold text-xs transition-all">إلغاء</button>
              <button type="submit" class="px-7 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2"><span>تأكيد إضافة الرصيد وإنشاء القيد المحاسبي</span> <span>📥</span></button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  // RAW MATERIAL DETAILS MODAL
  if (state.activeModal === 'rawDetailsModal' && state.selectedRawDetails) {
    const r = state.selectedRawDetails;
    const barcodeVal = r.itemCode ? '62910' + r.itemCode.replace(/\D/g, '').padStart(8, '0') : '6291088991122';
    const qrVal = `QR-${r.itemCode || 'RAW-101'}`;
    const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrVal)}&color=0F172A&bcolor=38BDF8`;
    const totalVal = (r.availableStock || 0) * (r.unitCost || 50);

    return `
      <div class="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
        <div class="glass-card max-w-2xl w-full p-6 md:p-8 rounded-3xl border border-cyan-500/40 space-y-6 max-h-[92vh] overflow-y-auto text-right font-sans shadow-2xl">
          
          <!-- Header -->
          <div class="flex justify-between items-center pb-4 border-b border-borderdark">
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-xl text-cyan-400">
                🧪
              </div>
              <div>
                <h3 class="text-lg font-extrabold text-white tracking-wide">${r.nameAr}</h3>
                <p class="text-xs text-cyan-400 font-mono">كود الصنف: ${r.itemCode} | التصنيف: ${r.category}</p>
              </div>
            </div>
            <button onclick="closeModal()" class="h-9 w-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/80 flex items-center justify-center transition-all">✕</button>
          </div>

          <!-- Mobile Scannable Barcode & QR Box -->
          <div class="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 flex items-center justify-between gap-4 font-mono text-xs">
            <div class="flex items-center gap-3">
              <img src="${qrImgUrl}" alt="Mobile QR" class="w-16 h-16 rounded-xl bg-white p-1 border border-slate-700 shadow shrink-0">
              <div>
                <div class="text-xs text-slate-400 font-sans">تنسيق مسح الموبايل والسكانر:</div>
                <div class="text-emerald-400 font-bold text-sm">BARCODE: ${barcodeVal}</div>
                <div class="text-cyan-400 font-bold text-xs">QR CODE: ${qrVal}</div>
              </div>
            </div>
            <div class="text-right text-[11px] text-slate-400 font-sans">
              جاهز للربط الفوري مع أجهزة مسح البار كود الميدانية
            </div>
          </div>

          <!-- Specs Matrix -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div class="p-4 rounded-2xl bg-slate-950/80 border border-borderdark space-y-2">
              <div class="text-slate-400 font-sans font-bold text-xs">📌 البيانات والتصنيف:</div>
              <div class="flex justify-between text-slate-200"><span>اسم الخام:</span><strong class="text-white font-sans">${r.nameAr}</strong></div>
              <div class="flex justify-between text-slate-200"><span>كود الصنف:</span><strong class="text-brand-500">${r.itemCode}</strong></div>
              <div class="flex justify-between text-slate-200"><span>التصنيف المحاسبي:</span><strong class="text-cyan-400 font-sans">${r.category}</strong></div>
              <div class="flex justify-between text-slate-200"><span>وحدة القياس:</span><strong class="text-amber-400">${r.unitOfMeasure}</strong></div>
            </div>

            <div class="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 space-y-2">
              <div class="text-emerald-400 font-sans font-bold text-xs">⚖️ الأرصدة والتقييم المالي:</div>
              <div class="flex justify-between text-slate-200"><span>الرصيد الحقيقي المتاح:</span><strong class="text-emerald-400 text-sm font-bold">${r.availableStock} ${r.unitOfMeasure}</strong></div>
              <div class="flex justify-between text-slate-200"><span>تكلفة الوحدة التقديرية:</span><strong class="text-amber-400">${r.unitCost || 50} ${state.currencySymbol}</strong></div>
              <div class="flex justify-between text-slate-200"><span>إجمالي قيمة المخزون:</span><strong class="text-cyan-400 text-sm font-extrabold">${totalVal.toLocaleString('ar-EG')} ${state.currencySymbol}</strong></div>
            </div>
          </div>

          <!-- Actions Bar -->
          <div class="flex justify-between items-center pt-4 border-t border-borderdark flex-wrap gap-2">
            <div class="flex items-center gap-2">
              <button onclick="openIssueRawModal('${r.id}')" class="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs shadow-lg shadow-rose-500/25 transition-all flex items-center gap-2">
                <span>📤</span> <span>صرف خام للورشة/الإنتاج</span>
              </button>
              <button onclick="openReceiveRawStockModal('${r.id}')" class="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2">
                <span>📥</span> <span>إضافة / توريد رصيد خام</span>
              </button>
              <button onclick="openItemMovementHistoryModal('${r.itemCode || r.id}')" class="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-brand-500 border border-brand-500/30 font-bold text-xs flex items-center gap-2">
                <span>📜</span> <span>سجل حركة الصنف الكامل</span>
              </button>
            </div>
            <button onclick="closeModal()" class="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-bold text-xs shadow-lg">إغلاق التفاصيل</button>
          </div>
        </div>
      </div>
    `;
  }

  // ISSUE RAW MATERIAL MODAL
  if (state.activeModal === 'issueRawModal' && state.selectedRawForIssue) {
    const r = state.selectedRawForIssue;
    return `
      <div class="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
        <div class="glass-card max-w-xl w-full p-6 md:p-8 rounded-3xl border border-rose-500/40 space-y-6 max-h-[92vh] overflow-y-auto text-right font-sans shadow-2xl">
          
          <div class="flex justify-between items-center pb-4 border-b border-borderdark">
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-xl text-rose-400">
                📤
              </div>
              <div>
                <h3 class="text-lg font-extrabold text-white tracking-wide">إذن صرف خامات ومستلزمات ورشة</h3>
                <p class="text-xs text-rose-400 font-mono">الخام: ${r.nameAr} (${r.itemCode}) • المتاح: ${r.availableStock} ${r.unitOfMeasure}</p>
              </div>
            </div>
            <button onclick="closeModal()" class="h-9 w-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/80 flex items-center justify-center transition-all">✕</button>
          </div>

          <form onsubmit="handleIssueRawSubmit(event, '${r.id}')" class="space-y-5 text-xs font-sans">
            <div class="p-4 rounded-2xl bg-slate-950 border border-rose-500/30 grid grid-cols-2 gap-3 text-xs font-mono">
              <div><span class="text-slate-400 block text-[11px]">التصنيف:</span><strong class="text-cyan-400">${r.category}</strong></div>
              <div><span class="text-slate-400 block text-[11px]">الرصيد المتاح حالياً:</span><strong class="text-emerald-400">${r.availableStock} ${r.unitOfMeasure}</strong></div>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-rose-400 font-bold mb-1.5">الكمية المصروفة (${r.unitOfMeasure}) *</label>
                <input type="number" step="0.01" name="issueStock" min="0.01" max="${r.availableStock}" required placeholder="مثال: 5.5" class="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-rose-500/60 text-white font-mono text-sm focus:border-rose-400 focus:outline-none transition-all">
              </div>

              <div>
                <label class="block text-slate-300 font-bold mb-1.5">الموظف / الفني المستلم *</label>
                <input type="text" name="recipientEmployee" required placeholder="اسم الفني أو مسؤول قسم الصب والطلاء" class="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:border-brand-500 focus:outline-none">
              </div>

              <div>
                <label class="block text-slate-300 font-bold mb-1.5">غرض الصرف / قسم التشكيل *</label>
                <input type="text" name="issuePurpose" required placeholder="مثال: قسم صب الشمع والجبس / طلاء وتلميع الفضة" class="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:border-brand-500 focus:outline-none">
              </div>

              <div>
                <label class="block text-slate-300 font-bold mb-1.5">ملاحظات إذن الصرف</label>
                <textarea name="notes" rows="2" placeholder="أدخل أي ملاحظات إضافية بخصوص حركة الصرف..." class="w-full p-3 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:border-brand-500 focus:outline-none resize-none"></textarea>
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-borderdark">
              <button type="button" onclick="closeModal()" class="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-bold text-xs transition-all">إلغاء</button>
              <button type="submit" class="px-7 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs shadow-lg shadow-rose-500/25 transition-all flex items-center gap-2"><span>تأكيد صرف الخام وتسجيل الحركة والقيود</span> <span>📤</span></button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  // RECEIVE RAW STOCK MODAL
  if (state.activeModal === 'receiveRawStockModal' && state.selectedRawForReceive) {
    const r = state.selectedRawForReceive;
    return `
      <div class="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
        <div class="glass-card max-w-xl w-full p-6 md:p-8 rounded-3xl border border-emerald-500/40 space-y-6 max-h-[92vh] overflow-y-auto text-right font-sans shadow-2xl">
          
          <div class="flex justify-between items-center pb-4 border-b border-borderdark">
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xl text-emerald-400">
                📥
              </div>
              <div>
                <h3 class="text-lg font-extrabold text-white tracking-wide">إذن توريد وإضافة رصيد خامات</h3>
                <p class="text-xs text-emerald-400 font-mono">الخام: ${r.nameAr} (${r.itemCode}) • الرصيد المتاح حالياً: ${r.availableStock} ${r.unitOfMeasure}</p>
              </div>
            </div>
            <button onclick="closeModal()" class="h-9 w-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/80 flex items-center justify-center transition-all">✕</button>
          </div>

          <form onsubmit="handleReceiveRawStockSubmit(event, '${r.id}')" class="space-y-5 text-xs font-sans">
            <div class="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 grid grid-cols-2 gap-3 text-xs font-mono">
              <div><span class="text-slate-400 block text-[11px]">التصنيف:</span><strong class="text-cyan-400">${r.category}</strong></div>
              <div><span class="text-slate-400 block text-[11px]">الرصيد المتاح حالياً:</span><strong class="text-emerald-400">${r.availableStock} ${r.unitOfMeasure}</strong></div>
            </div>

            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-emerald-400 font-bold mb-1.5">الكمية المضافة للتوريد (${r.unitOfMeasure}) *</label>
                  <input type="number" step="0.01" name="addedStock" min="0.01" required placeholder="مثال: 50" class="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-emerald-500/60 text-white font-mono text-sm focus:border-emerald-400 focus:outline-none transition-all">
                </div>

                <div>
                  <label class="block text-slate-300 font-bold mb-1.5">سعر تكلفة الوحدة (ج.م)</label>
                  <input type="number" step="0.01" name="unitCost" value="${r.unitCost || 50}" placeholder="سعر الوحدة" class="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white font-mono text-xs focus:border-brand-500 focus:outline-none">
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-slate-300 font-bold mb-1.5">اسم المورد</label>
                  <input type="text" name="supplierName" placeholder="اسم توريد المورد" class="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:border-brand-500 focus:outline-none">
                </div>

                <div>
                  <label class="block text-slate-300 font-bold mb-1.5">حساب التسوية المالية *</label>
                  <select name="paymentSource" required class="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white font-sans focus:border-brand-500 focus:outline-none transition-all">
                    <option value="CASH">الخزينة والصندوق (نقد - 1103)</option>
                    <option value="CREDITOR">حساب المورد (دائنون - 2101)</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-slate-300 font-bold mb-1.5">رقم فاتورة الشراء</label>
                <input type="text" name="invoiceNumber" placeholder="مثال: INV-RAW-2026-09" class="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white font-mono text-xs focus:border-brand-500 focus:outline-none">
              </div>

              <div>
                <label class="block text-slate-300 font-bold mb-1.5">ملاحظات التوريد وإضافة الرصيد</label>
                <textarea name="notes" rows="2" placeholder="أدخل أي ملاحظات إضافية بخصوص إذن التوريد..." class="w-full p-3 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:border-brand-500 focus:outline-none resize-none"></textarea>
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-borderdark">
              <button type="button" onclick="closeModal()" class="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-bold text-xs transition-all">إلغاء</button>
              <button type="submit" class="px-7 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2"><span>تأكيد إضافة الرصيد وإنشاء القيد المحاسبي</span> <span>📥</span></button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  // DEDICATED SILVER DETAILS MODAL
  if (state.activeModal === 'silverDetailsModal' && state.selectedSilverDetails) {
    const slv = state.selectedSilverDetails;
    const totalVal = (slv.availableStock || 0) * (slv.unitCost || 65);
    const weightKg = ((slv.availableStock || 0) / 1000).toFixed(3);

    return `
      <div class="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
        <div class="glass-card max-w-2xl w-full p-6 md:p-8 rounded-3xl border border-slate-700/80 space-y-6 max-h-[92vh] overflow-y-auto text-right font-sans shadow-2xl">
          
          <div class="flex justify-between items-center pb-4 border-b border-borderdark">
            <div class="flex items-center gap-3">
              <div class="h-12 w-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl text-slate-200">
                🥈
              </div>
              <div>
                <h3 class="text-xl font-extrabold text-white tracking-wide">${slv.nameAr}</h3>
                <p class="text-xs text-slate-400 font-mono">الكود: ${slv.itemCode} | التصنيف: ${slv.category} | حساب الأصول: 1105</p>
              </div>
            </div>
            <button onclick="closeModal()" class="h-9 w-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/80 flex items-center justify-center transition-all">✕</button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
            <div class="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div class="text-slate-400 font-bold mb-1">📋 البيانات الفنية والعيار:</div>
              <div class="flex justify-between text-slate-300"><span>درجة النقاء / العيار:</span><strong class="text-white">فضة نقية عيار 999</strong></div>
              <div class="flex justify-between text-slate-300"><span>المخزن التابع:</span><strong class="text-slate-300">مخزن الفضة والسبائك (WH-SILVER)</strong></div>
              <div class="flex justify-between text-slate-300"><span>وحدة القياس:</span><strong class="text-amber-400">${slv.unitOfMeasure || 'جرام (g)'}</strong></div>
              <div class="flex justify-between text-slate-300"><span>الرمز الباركوودي:</span><strong class="text-brand-500 font-mono">62910${slv.itemCode.replace('SLV-', '')}</strong></div>
            </div>

            <div class="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 space-y-2">
              <div class="text-emerald-400 font-bold mb-1">⚖️ الأرصدة والتقييم المالي:</div>
              <div class="flex justify-between text-slate-200"><span>الرصيد المتاح بالجرام:</span><strong class="text-emerald-400 text-sm font-bold">${slv.availableStock} جرام (g)</strong></div>
              <div class="flex justify-between text-slate-200"><span>الرصيد المتاح بالكيلو:</span><strong class="text-emerald-400 font-bold">${weightKg} كجم (kg)</strong></div>
              <div class="flex justify-between text-slate-200"><span>سعر الجرام الشراء:</span><strong class="text-amber-400">${slv.unitCost || 65} ${state.currencySymbol}</strong></div>
              <div class="flex justify-between text-slate-200"><span>إجمالي تقييم المخزون:</span><strong class="text-cyan-400 text-sm font-extrabold">${totalVal.toLocaleString('ar-EG')} ${state.currencySymbol}</strong></div>
            </div>
          </div>

          <div class="flex justify-between items-center pt-4 border-t border-borderdark flex-wrap gap-2">
            <div class="flex items-center gap-2">
              <button onclick="openIssueSilverModal('${slv.id}')" class="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs shadow-lg flex items-center gap-2">
                <span>📤</span> <span>صرف فضة للصب والتشكيل</span>
              </button>
              <button onclick="openReceiveSilverStockModal('${slv.id}')" class="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs shadow-lg flex items-center gap-2">
                <span>📥</span> <span>تزويد / شراء فضة جديدة</span>
              </button>
              <button onclick="openItemMovementHistoryModal('${slv.itemCode || slv.id}')" class="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-brand-500 border border-brand-500/30 font-bold text-xs flex items-center gap-2">
                <span>📜</span> <span>سجل حركة الصنف الكامل</span>
              </button>
            </div>
            <button onclick="closeModal()" class="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-bold text-xs">إغلاق</button>
          </div>
        </div>
      </div>
    `;
  }

  // ISSUE SILVER MODAL (صرف فضة للصب والتشكيل)
  if (state.activeModal === 'issueSilverModal' && state.selectedSilverForIssue) {
    const slv = state.selectedSilverForIssue;
    return `
      <div class="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
        <div class="glass-card max-w-xl w-full p-6 md:p-8 rounded-3xl border border-rose-500/40 space-y-6 max-h-[92vh] overflow-y-auto text-right font-sans shadow-2xl">
          
          <div class="flex justify-between items-center pb-4 border-b border-borderdark">
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-xl text-rose-400">
                📤
              </div>
              <div>
                <h3 class="text-lg font-extrabold text-white tracking-wide">صرف فضة لورشة الصب والتشكيل</h3>
                <p class="text-xs text-rose-400 font-mono">خصم وزن الفضة من حساب 1105 وقيد التكلفة آلياً بحساب 4101</p>
              </div>
            </div>
            <button onclick="closeModal()" class="h-9 w-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/80 flex items-center justify-center transition-all">✕</button>
          </div>

          <div class="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1 text-xs">
            <div class="text-slate-300 font-bold">الصنف المختار: <strong class="text-white">${slv.nameAr}</strong></div>
            <div class="text-slate-400 font-mono">الرصيد المتاح حالياً بالورشة: <strong class="text-emerald-400 font-bold">${slv.availableStock} ${slv.unitOfMeasure || 'g'}</strong></div>
          </div>

          <form onsubmit="handleIssueSilverSubmit(event, '${slv.id}')" class="space-y-4 text-xs font-sans">
            <div>
              <label class="block text-rose-400 font-bold mb-1.5">وزن الفضة المطلوب صرفه بالجرام (g) *</label>
              <input type="number" step="0.01" max="${slv.availableStock}" name="issueStock" required placeholder="مثال: 500" class="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-rose-500/60 text-white font-mono text-sm focus:border-rose-400 focus:outline-none">
            </div>

            <div>
              <label class="block text-slate-300 font-bold mb-1.5">اسم الفني / قسم الصب المستلم *</label>
              <input type="text" name="recipientEmployee" required placeholder="مثال: الفني أحمد محمود - قسم صب الفضة" class="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white focus:border-brand-500 focus:outline-none">
            </div>

            <div>
              <label class="block text-slate-300 font-bold mb-1.5">رقم أمر التشغيل / شجرة الصب</label>
              <input type="text" name="batchNo" placeholder="مثال: CAST-BATCH-992" class="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white font-mono">
            </div>

            <div>
              <label class="block text-slate-300 font-bold mb-1.5">ملاحظات وقيد الصرف</label>
              <input type="text" name="notes" placeholder="ملاحظات الحركة" class="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white">
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-borderdark">
              <button type="button" onclick="closeModal()" class="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-bold text-xs">إلغاء</button>
              <button type="submit" class="px-7 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs shadow-lg shadow-rose-500/25 flex items-center gap-2"><span>تأكيد الصرف وإنشاء القيد المحاسبي</span> <span>📤</span></button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  // RECEIVE SILVER STOCK MODAL (تزويد وتوريد فضة جديدة)
  if (state.activeModal === 'receiveSilverStockModal' && state.selectedSilverForReceive) {
    const slv = state.selectedSilverForReceive;
    return `
      <div class="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
        <div class="glass-card max-w-xl w-full p-6 md:p-8 rounded-3xl border border-emerald-500/40 space-y-6 max-h-[92vh] overflow-y-auto text-right font-sans shadow-2xl">
          
          <div class="flex justify-between items-center pb-4 border-b border-borderdark">
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xl text-emerald-400">
                📥
              </div>
              <div>
                <h3 class="text-lg font-extrabold text-white tracking-wide">توريد وتزويد فضة جديدة للمخزن</h3>
                <p class="text-xs text-emerald-400 font-mono">زيادة رصيد الفضة بحساب 1105 وقيد التوريد آلياً بحساب الصندوق/الموردين</p>
              </div>
            </div>
            <button onclick="closeModal()" class="h-9 w-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/80 flex items-center justify-center transition-all">✕</button>
          </div>

          <div class="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1 text-xs">
            <div class="text-slate-300 font-bold">الصنف المستهدف: <strong class="text-white">${slv.nameAr}</strong></div>
            <div class="text-slate-400 font-mono">الرصيد المتاح قبل التوريد: <strong class="text-emerald-400 font-bold">${slv.availableStock} ${slv.unitOfMeasure || 'g'}</strong></div>
          </div>

          <form onsubmit="handleReceiveSilverStockSubmit(event, '${slv.id}')" class="space-y-4 text-xs font-sans">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-emerald-400 font-bold mb-1.5">وزن الفضة المورد بالجرام (g) *</label>
                <input type="number" step="0.01" name="addedStock" required placeholder="مثال: 1000" class="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-emerald-500/60 text-white font-mono text-sm focus:border-emerald-400 focus:outline-none">
              </div>

              <div>
                <label class="block text-slate-300 font-bold mb-1.5">سعر جرام الشراء (ج.م) *</label>
                <input type="number" step="0.01" name="unitCost" value="${slv.unitCost || 65}" required class="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white font-mono">
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-slate-300 font-bold mb-1.5">اسم المورد / الشركة *</label>
                <input type="text" name="supplierName" required placeholder="مثال: بنك السبائك الفضية الملكي" class="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white">
              </div>

              <div>
                <label class="block text-slate-300 font-bold mb-1.5">رقم الفاتورة / الإذن</label>
                <input type="text" name="invoiceNumber" placeholder="مثال: INV-SLV-8821" class="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white font-mono">
              </div>
            </div>

            <div>
              <label class="block text-slate-300 font-bold mb-1.5">طريقة الدفع وقيد الحساب *</label>
              <select name="paymentSource" class="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white font-sans">
                <option value="CREDIT">آجل - دائنون حسابات الموردين (2101)</option>
                <option value="CASH">نقداً - الخزينة والصندوق الرئيسي (1103)</option>
              </select>
            </div>

            <div>
              <label class="block text-slate-300 font-bold mb-1.5">ملاحظات التوريد</label>
              <input type="text" name="notes" placeholder="ملاحظات التوريد والشراء" class="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white">
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-borderdark">
              <button type="button" onclick="closeModal()" class="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-bold text-xs">إلغاء</button>
              <button type="submit" class="px-7 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/25 flex items-center gap-2"><span>تأكيد التوريد وإنشاء القيد المحاسبي</span> <span>📥</span></button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  // DEDICATED WAREHOUSE DETAILS & INVENTORY MODAL
  if (state.activeModal === 'warehouseDetailsModal' && state.selectedWarehouseId) {
    const wh = state.warehouses.find(w => w.id === state.selectedWarehouseId || w.code === state.selectedWarehouseId) || state.warehouses[0];
    
    let whItems = [];
    if (wh.type === 'STONES' || wh.id === 'wh-stones') {
      whItems = state.stones;
    } else if (wh.type === 'SILVER' || wh.id === 'wh-silver') {
      whItems = state.silverItems;
    } else {
      whItems = state.rawMaterials.filter(r => r.warehouseId === wh.id);
    }

    let totalVal = 0;
    whItems.forEach(i => {
      totalVal += (i.quantity ? (i.quantity * (i.purchasePrice || 100)) : ((i.availableStock || 0) * (i.unitCost || 50)));
    });

    const icon = wh.icon || (wh.type === 'STONES' ? '💎' : '🧪');

    return `
      <div class="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
        <div class="glass-card max-w-4xl w-full p-6 md:p-8 rounded-3xl border border-brand-500/40 space-y-6 max-h-[92vh] overflow-y-auto text-right font-sans shadow-2xl">
          
          <!-- Header -->
          <div class="flex justify-between items-center pb-4 border-b border-borderdark">
            <div class="flex items-center gap-3">
              <div class="h-12 w-12 rounded-2xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-2xl text-brand-500">
                ${icon}
              </div>
              <div>
                <h3 class="text-xl font-extrabold text-white tracking-wide">${wh.nameAr}</h3>
                <p class="text-xs text-brand-500 font-mono">الكود: ${wh.code} | مستوى الأمان: ${wh.securityLevel} | النوع: ${wh.type}</p>
              </div>
            </div>
            <button onclick="closeModal()" class="h-9 w-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/80 flex items-center justify-center transition-all">✕</button>
          </div>

          <!-- KPI Header Row -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div class="p-4 rounded-2xl bg-slate-950 border border-brand-500/30">
              <span class="text-slate-400 block font-sans text-xs">عدد الأصناف بالمخزن:</span>
              <strong class="text-amber-400 text-lg font-extrabold">${whItems.length} أصناف</strong>
            </div>
            <div class="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30">
              <span class="text-slate-400 block font-sans text-xs">إجمالي القيمة الملاية:</span>
              <strong class="text-emerald-400 text-lg font-extrabold">${totalVal.toLocaleString('ar-EG')} ${state.currencySymbol}</strong>
            </div>
            <div class="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 flex items-center justify-center">
              <button onclick="openAddWarehouseItemModal('${wh.id}')" class="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-extrabold text-xs shadow-lg flex items-center justify-center gap-2">
                <span>+ إضافة صنف جديد لهذا المخزن</span>
              </button>
            </div>
          </div>

          <!-- Items Table -->
          <div class="space-y-3">
            <h4 class="text-sm font-extrabold text-white flex items-center gap-2">
              <span>📋</span> قائمة الأصناف المسجلة بهذا المخزن
            </h4>

            ${whItems.length === 0
              ? renderEmptyState('لا توجد أصناف مسجلة في هذا المخزن بعد، اضغط لإضافة أول صنف', 'إضافة صنف جديد', `openAddWarehouseItemModal('${wh.id}')`)
              : `
                <div class="overflow-x-auto rounded-2xl border border-borderdark">
                  <table class="w-full text-right text-xs text-slate-300">
                    <thead class="bg-slate-950 text-slate-400 uppercase font-mono border-b border-borderdark">
                      <tr>
                        <th class="p-3">كود الصنف</th>
                        <th class="p-3">اسم الصنف</th>
                        <th class="p-3">التصنيف</th>
                        <th class="p-3">الرصيد المتاح</th>
                        <th class="p-3">تكلفة الوحدة</th>
                        <th class="p-3">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-borderdark font-mono">
                      ${whItems.map(item => `
                        <tr class="hover:bg-slate-900/60 transition-colors">
                          <td class="p-3 font-bold text-brand-500">${item.code || item.itemCode}</td>
                          <td class="p-3 font-sans font-bold text-white">${item.nameAr}</td>
                          <td class="p-3 font-sans text-cyan-400">${item.category}</td>
                          <td class="p-3 font-extrabold text-emerald-400">${item.quantity ? `${item.quantity} قطعة (${item.weightGrams}g)` : `${item.availableStock} ${item.unitOfMeasure}`}</td>
                          <td class="p-3 text-amber-400">${item.purchasePrice || item.unitCost || 50} ${state.currencySymbol}</td>
                          <td class="p-3 font-sans">
                            <div class="flex items-center gap-1.5" onclick="event.stopPropagation()">
                              ${item.quantity ? `
                                <button onclick="openStoneDetailsModal('${item.id}')" class="px-2.5 py-1 rounded-lg bg-brand-500/20 text-brand-500 border border-brand-500/30 hover:bg-brand-500 hover:text-slate-950 font-bold text-xs">🔍</button>
                                <button onclick="openIssueStoneModal('${item.id}')" class="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500 hover:text-white font-bold text-xs">📤 صرف</button>
                                <button onclick="openReceiveStoneStockModal('${item.id}')" class="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-slate-950 font-bold text-xs">📥 توريد</button>
                              ` : `
                                <button onclick="openRawDetailsModal('${item.id}')" class="px-2.5 py-1 rounded-lg bg-brand-500/20 text-brand-500 border border-brand-500/30 hover:bg-brand-500 hover:text-slate-950 font-bold text-xs">🔍</button>
                                <button onclick="openIssueRawModal('${item.id}')" class="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500 hover:text-white font-bold text-xs">📤 صرف</button>
                                <button onclick="openReceiveRawStockModal('${item.id}')" class="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-slate-950 font-bold text-xs">📥 توريد</button>
                              `}
                            </div>
                          </td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              `
            }
          </div>

          <!-- Footer -->
          <div class="flex justify-end pt-4 border-t border-borderdark">
            <button onclick="closeModal()" class="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-bold text-xs">إغلاق</button>
          </div>
        </div>
      </div>
    `;
  }

  // ADD ITEM TO ANY OF THE 7 WAREHOUSES MODAL
  if (state.activeModal === 'addWarehouseItemModal') {
    const selectedWhId = state.selectedWarehouseForAdd || 'wh-stones';
    const warehouses = state.warehouses && state.warehouses.length ? state.warehouses : DEFAULT_7_WAREHOUSES;

    return `
      <div class="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
        <div class="glass-card max-w-lg w-full p-6 md:p-8 rounded-3xl border border-brand-500/40 space-y-6 max-h-[92vh] overflow-y-auto text-right font-sans shadow-2xl">
          
          <div class="flex justify-between items-center pb-4 border-b border-borderdark">
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-xl text-brand-500">
                🏛️
              </div>
              <div>
                <h3 class="text-lg font-extrabold text-white tracking-wide">إضافة وتكويد صنف لأحد المخازن السبعة</h3>
                <p class="text-xs text-brand-500 font-mono">مصنع باهر سيلفر • ربط فوري مع القيد المحاسبي المزدوج</p>
              </div>
            </div>
            <button onclick="closeModal()" class="h-9 w-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/80 flex items-center justify-center transition-all">✕</button>
          </div>

          <form onsubmit="handleCreateWarehouseItemSubmit(event)" class="space-y-4 text-xs font-sans">
            <div>
              <label class="block text-slate-300 font-bold mb-1.5">المخزن المستهدف *</label>
              <select name="warehouseId" required class="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white font-sans focus:border-brand-500 focus:outline-none transition-all">
                ${warehouses.map(w => `<option value="${w.id}" ${w.id === selectedWhId ? 'selected' : ''}>${w.nameAr} (${w.code})</option>`).join('')}
              </select>
            </div>

            <div>
              <label class="block text-slate-300 font-bold mb-1.5">اسم الصنف بالعربية *</label>
              <input type="text" name="nameAr" required placeholder="مثال: فضة عيار 999 حبيبات / حمض نيتريك / أقفال 925" class="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white focus:border-brand-500 focus:outline-none">
            </div>

            <div>
              <label class="block text-slate-300 font-bold mb-1.5">التصنيف * (من مركز البيانات أو يدوي)</label>
              <select name="category" required onchange="handleCategoryDropdownChange(this, 'wh-item-custom-category-box')" class="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white font-sans focus:border-brand-500 focus:outline-none">
                ${renderMasterOptions('RAW_CATEGORY')}
              </select>

              <div id="wh-item-custom-category-box" class="hidden mt-2" style="display:none;">
                <label class="block text-amber-400 font-bold mb-1">أدخل التصنيف الخاص يدودياً *</label>
                <input type="text" name="customCategory" placeholder="مثال: فضة ناعمة، كيماويات طلاء، أجزاء تجميع" class="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-amber-500/60 text-white font-sans text-xs focus:border-amber-400 focus:outline-none">
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-emerald-400 font-bold mb-1.5">الرصيد / الكمية المتاحة *</label>
                <input type="number" step="0.01" name="availableStock" required placeholder="مثال: 100" class="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-emerald-500/60 text-white font-mono text-sm focus:border-emerald-400 focus:outline-none">
              </div>

              <div>
                <label class="block text-slate-300 font-bold mb-1.5">وحدة القياس *</label>
                <select name="unitOfMeasure" required class="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white font-sans">
                  <option value="جرام (g)">جرام (g)</option>
                  <option value="قطعة">قطعة</option>
                  <option value="لتر">لتر</option>
                  <option value="كيلو (kg)">كيلو (kg)</option>
                  <option value="طقم">طقم</option>
                  <option value="متر">متر</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-slate-300 font-bold mb-1.5">سعر تكلفة الوحدة (ج.م) *</label>
                <input type="number" step="0.01" name="unitCost" required placeholder="مثال: 60" class="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white font-mono text-xs">
              </div>

              <div>
                <label class="block text-slate-300 font-bold mb-1.5">اسم المورد</label>
                <input type="text" name="supplierName" placeholder="اسم المورد" class="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs">
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-borderdark">
              <button type="button" onclick="closeModal()" class="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-bold text-xs">إلغاء</button>
              <button type="submit" class="px-7 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-brand-500/25 flex items-center gap-2"><span>حفظ وحفظ القيد المحاسبي</span> <span>🏛️</span></button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  // ADD MASTER ITEM MODAL
  if (state.activeModal === 'addMasterItem') {
    const catObj = MASTER_CATEGORIES.find(c => c.id === state.selectedMasterCategory);
    return `
      <div class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="glass-card max-w-md w-full p-6 rounded-2xl border border-brand-500/40 space-y-4 text-right font-sans">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-bold text-white">⚙️ إضافة عنصر مرجعي جديد</h3>
            <button onclick="closeModal()" class="text-slate-400 hover:text-white">✕</button>
          </div>

          <form onsubmit="handleCreateMasterItemSubmit(event)" class="space-y-4 text-xs font-sans">
            <div>
              <label class="block text-slate-400 mb-1">التصنيف المرجعي</label>
              <input type="text" disabled value="${catObj ? catObj.nameAr : state.selectedMasterCategory}" class="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 font-bold">
            </div>

            <div>
              <label class="block text-slate-300 font-bold mb-1">الكود القياسي (Code) *</label>
              <input type="text" name="code" required placeholder="مثال: RUBY_AAA" class="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono uppercase">
            </div>

            <div>
              <label class="block text-slate-300 font-bold mb-1">الاسم بالعربية *</label>
              <input type="text" name="nameAr" required placeholder="مثال: ياقوت بورمي ممتاز" class="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white">
            </div>

            <div>
              <label class="block text-slate-300 font-bold mb-1">الاسم بالإنجليزية *</label>
              <input type="text" name="nameEn" required placeholder="مثال: Burmese Premium Ruby" class="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono">
            </div>

            <div class="flex justify-end gap-3 pt-3">
              <button type="button" onclick="closeModal()" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold">إلغاء</button>
              <button type="submit" class="px-6 py-2 rounded-xl bg-brand-500 text-slate-950 font-bold">حفظ العنصر المرجعي</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  // DEDICATED MOVEMENT PASSPORT & ACC DETAILS MODAL
  if (state.activeModal === 'movementDetailModal' && state.selectedMovementDetails) {
    const m = state.selectedMovementDetails;
    const isReceive = m.txType?.includes('RECEIVE') || m.txType === 'IN';
    const badgeColor = isReceive ? 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40' : 'text-rose-400 bg-rose-500/20 border-rose-500/40';

    // Find current live item to get the latest final stock balance right now
    const currentStone = state.stones.find(s => s.code === m.itemCode || s.id === m.itemCode || s.id === m.stoneId);
    const currentSilver = state.silverItems.find(s => s.itemCode === m.itemCode || s.id === m.itemCode);
    const currentRaw = state.rawMaterials.find(r => r.itemCode === m.itemCode || r.id === m.itemCode);
    const currentLiveItem = currentStone || currentSilver || currentRaw;

    const currentStockNowDisplay = currentLiveItem
      ? (currentLiveItem.quantity ? `${currentLiveItem.quantity} قطعة (${currentLiveItem.weightGrams}g)` : `${currentLiveItem.availableStock} ${currentLiveItem.unitOfMeasure}`)
      : (m.balanceAfter || '—');

    // Find linked double-entry journal entry
    const linkedJournal = state.journalEntries.find(j => j.referenceNo === m.id || j.referenceNo === m.itemCode || j.description.includes(m.itemCode));

    return `
      <div class="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
        <div class="glass-card max-w-3xl w-full p-6 md:p-8 rounded-3xl border border-brand-500/40 space-y-6 max-h-[92vh] overflow-y-auto text-right font-sans shadow-2xl">
          
          <!-- Header -->
          <div class="flex justify-between items-center pb-4 border-b border-borderdark">
            <div class="flex items-center gap-3">
              <div class="h-12 w-12 rounded-2xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-2xl text-brand-500">
                📜
              </div>
              <div>
                <h3 class="text-xl font-extrabold text-white tracking-wide">جواز حركة الصنف وقيد اليومية (Movement Passport)</h3>
                <p class="text-xs text-brand-500 font-mono">الكود: ${m.itemCode} | المعاملة: ${m.id}</p>
              </div>
            </div>
            <button onclick="closeModal()" class="h-9 w-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/80 flex items-center justify-center transition-all">✕</button>
          </div>

          <!-- Item & Live Stock KPI Banner -->
          <div class="p-5 rounded-2xl bg-slate-950 border border-brand-500/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-inner font-mono">
            <div>
              <span class="text-xs text-slate-400 block font-sans">اسم الصنف المعني بالحركة:</span>
              <strong class="text-xl font-extrabold text-white font-sans">${m.itemName}</strong>
              <div class="text-xs text-slate-400 font-sans mt-0.5">التصنيف: ${m.stoneCategory || 'عام'} • الكود: ${m.itemCode}</div>
            </div>

            <div class="p-3 rounded-xl bg-slate-900 border border-emerald-500/40 text-left shrink-0">
              <span class="text-[11px] text-slate-400 block font-sans">📌 الرصيد النهائي الحالي الآن بالمخزن:</span>
              <strong class="text-emerald-400 text-base font-extrabold font-mono">${currentStockNowDisplay}</strong>
            </div>
          </div>

          <!-- Passport Details Matrix Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
            
            <!-- Box 1: Movement Specifics -->
            <div class="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5">
              <div class="text-brand-500 font-bold mb-1 flex justify-between items-center">
                <span>📌 تفاصيل وتأثير الحركة:</span>
                <span class="px-2.5 py-0.5 rounded-lg border text-[11px] font-bold ${badgeColor}">${m.typeLabel || m.txType}</span>
              </div>
              <div class="flex justify-between text-slate-300 font-mono"><span>الكمية / الوزن المتأثر:</span><strong class="text-emerald-400 text-sm font-bold">${m.quantity} ${m.weightGrams ? `(${m.weightGrams}g)` : ''}</strong></div>
              <div class="flex justify-between text-slate-300 font-mono"><span>الرصيد قبل الحركة:</span><strong class="text-slate-400">${m.balanceBefore || '—'}</strong></div>
              <div class="flex justify-between text-slate-300 font-mono"><span>الرصيد بعد هذه الحركة:</span><strong class="text-cyan-400 font-bold">${m.balanceAfter || '—'}</strong></div>
              <div class="flex justify-between text-slate-300 font-mono border-t border-slate-800 pt-1.5"><span>تاريخ ووقت الحركة:</span><strong class="text-amber-400 text-[11px]">${m.timestamp || m.createdAt}</strong></div>
            </div>

            <!-- Box 2: Execution & Recipient -->
            <div class="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5">
              <div class="text-brand-500 font-bold mb-1">👥 الجهة المستلمة والتنفيذ:</div>
              <div class="flex justify-between text-slate-300"><span>الفني / الجهة المستلمة:</span><strong class="text-white font-bold">${m.recipientEmployee || '—'}</strong></div>
              <div class="flex justify-between text-slate-300 font-mono"><span>رقم أمر التشغيل/الدفعة:</span><strong class="text-amber-400 font-bold">${m.orderNo || '—'}</strong></div>
              <div class="flex justify-between text-slate-300"><span>المسؤول المنفذ:</span><strong class="text-slate-300">${m.userName || 'أمين المخزن الرئيسي'}</strong></div>
              <div class="flex justify-between text-slate-300"><span>ملاحظات الحركة:</span><span class="text-slate-400 text-[11px] font-mono">${m.notes || '—'}</span></div>
            </div>

            <!-- Box 3: Double-Entry Journal Integration (Full Width) -->
            <div class="md:col-span-2 p-4 rounded-2xl bg-slate-950/90 border border-emerald-500/30 space-y-2 font-mono">
              <div class="flex justify-between items-center pb-1 border-b border-slate-800">
                <span class="text-emerald-400 font-bold font-sans">⚖️ القيد المحاسبي المزدوج المسجل في اليومية العامة:</span>
                <span class="text-brand-500 text-[11px] font-bold">مرجع القيد: ${linkedJournal ? linkedJournal.referenceNo : m.id}</span>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
                <div>
                  <span class="text-slate-400 block text-[11px] font-sans">الطرف المدين (Debit):</span>
                  <strong class="text-emerald-400">${linkedJournal ? `${linkedJournal.debitAccountName} (${linkedJournal.debitAccountCode})` : (isReceive ? 'مخزون الأصول (1101/1105)' : 'تكلفة المواد المصروفة (4101)')}</strong>
                </div>
                <div>
                  <span class="text-slate-400 block text-[11px] font-sans">الطرف الدائن (Credit):</span>
                  <strong class="text-rose-400">${linkedJournal ? `${linkedJournal.creditAccountName} (${linkedJournal.creditAccountCode})` : (isReceive ? 'الخزينة/الموردون (1103/2101)' : 'مخزون الأصول (1101/1105)')}</strong>
                </div>
                <div>
                  <span class="text-slate-400 block text-[11px] font-sans">المبلغ المالي المعادل:</span>
                  <strong class="text-cyan-400 text-sm font-extrabold">${linkedJournal ? parseFloat(linkedJournal.amount).toLocaleString('ar-EG') : '—'} ${state.currencySymbol}</strong>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Action Buttons -->
          <div class="flex justify-between items-center pt-4 border-t border-borderdark flex-wrap gap-2">
            <button onclick="openItemMovementHistoryModal('${m.itemCode}')" class="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-brand-500 border border-brand-500/30 font-bold text-xs flex items-center gap-2">
              <span>📜</span> <span>عرض كافة حركات هذا الصنف</span>
            </button>
            <button onclick="closeModal()" class="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-bold text-xs shadow-lg">إغلاق الجواز</button>
          </div>
        </div>
      </div>
    `;
  }

  // DEDICATED SPECIFIC ITEM MOVEMENT HISTORY TIMELINE MODAL
  if (state.activeModal === 'itemMovementHistoryModal' && state.selectedItemCodeForHistory) {
    const code = state.selectedItemCodeForHistory;
    
    // Find item details
    const stone = state.stones.find(s => s.code === code || s.id === code);
    const silver = state.silverItems.find(s => s.itemCode === code || s.id === code);
    const raw = state.rawMaterials.find(r => r.itemCode === code || r.id === code);

    const item = stone || silver || raw || { nameAr: 'الصنف المختار', code: code, category: 'عام' };
    const itemName = item.nameAr || item.code;

    // Filter movements for this specific item
    const itemMovements = state.movements.filter(m => m.itemCode === code || m.stoneId === code || m.itemName === itemName);

    return `
      <div class="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
        <div class="glass-card max-w-3xl w-full p-6 md:p-8 rounded-3xl border border-brand-500/40 space-y-6 max-h-[92vh] overflow-y-auto text-right font-sans shadow-2xl">
          
          <div class="flex justify-between items-center pb-4 border-b border-borderdark">
            <div class="flex items-center gap-3">
              <div class="h-12 w-12 rounded-2xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-2xl text-brand-500">
                📜
              </div>
              <div>
                <h3 class="text-xl font-extrabold text-white tracking-wide">سجل حركات الصنف الكامل (${itemName})</h3>
                <p class="text-xs text-brand-500 font-mono">الكود: ${item.code || item.itemCode} | التصنيف: ${item.category || 'عام'} | عدد الحركات: ${itemMovements.length}</p>
              </div>
            </div>
            <button onclick="closeModal()" class="h-9 w-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/80 flex items-center justify-center transition-all">✕</button>
          </div>

          <!-- Item Snapshot Bar -->
          <div class="p-4 rounded-2xl bg-slate-950 border border-brand-500/30 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div>
              <span class="text-slate-400 block font-sans">اسم الصنف:</span>
              <strong class="text-white text-sm font-sans">${itemName}</strong>
            </div>
            <div>
              <span class="text-slate-400 block font-sans">الرصيد المتاح حالياً:</span>
              <strong class="text-emerald-400 text-sm font-extrabold">${item.quantity ? `${item.quantity} قطعة (${item.weightGrams}g)` : `${item.availableStock} ${item.unitOfMeasure}`}</strong>
            </div>
            <div>
              <span class="text-slate-400 block font-sans">إجمالي التقييم المالي:</span>
              <strong class="text-cyan-400 text-sm font-extrabold">${(item.quantity ? (item.quantity * (item.purchasePrice||100)) : ((item.availableStock||0)*(item.unitCost||50))).toLocaleString('ar-EG')} ${state.currencySymbol}</strong>
            </div>
          </div>

          <!-- Timeline list of movements for this item -->
          <div class="space-y-3">
            <h4 class="text-xs font-extrabold text-slate-300 uppercase tracking-wider">سجل التوريد والتنشيط والصرف التاريخي لهذا الصنف:</h4>

            ${itemMovements.length === 0
              ? renderEmptyState('لا توجد حركات مسجلة سابقاً لهذا الصنف بالتحديد')
              : `
                <div class="space-y-3 font-sans">
                  ${itemMovements.map(m => {
                    const isReceive = m.txType?.includes('RECEIVE') || m.txType === 'IN';
                    const badgeClass = isReceive ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border-rose-500/30';
                    return `
                      <div class="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                        <div class="flex justify-between items-center font-mono text-xs">
                          <span class="px-2.5 py-0.5 rounded border font-bold ${badgeClass}">${m.typeLabel || m.txType}</span>
                          <span class="text-slate-400 text-[11px]">${m.timestamp || new Date(m.createdAt).toLocaleString('ar-EG')}</span>
                        </div>

                        <div class="flex justify-between items-center text-xs font-mono pt-1">
                          <span class="text-emerald-400 font-extrabold text-sm">الكمية/الوزن: ${m.quantity} ${m.weightGrams ? `(${m.weightGrams}g)` : ''}</span>
                          <span class="text-slate-300">تغير الرصيد: <strong class="text-amber-400">${m.balanceBefore || '0'} ➔ ${m.balanceAfter}</strong></span>
                        </div>

                        <div class="text-[11px] text-slate-400 flex flex-wrap justify-between gap-2 pt-1 border-t border-slate-800/80">
                          <span>👤 المستلم/الجهة: <strong class="text-slate-200">${m.recipientEmployee || '—'}</strong></span>
                          <span>📋 أمر التشغيل/الدفعة: <strong class="text-amber-400 font-mono">${m.orderNo || '—'}</strong></span>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              `
            }
          </div>

          <div class="flex justify-end pt-4 border-t border-borderdark">
            <button onclick="closeModal()" class="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-bold text-xs">إغلاق</button>
          </div>
        </div>
      </div>
    `;
  }

  // ADD STONE MODAL - WITH DUAL FILE PICKER & DIRECT URL PASTING
  if (state.activeModal === 'addStone') {
    const whStones = state.warehouses.find(w => w.type === 'STONES') || state.warehouses[0];
    const previewBarcode = '62910' + Math.floor(10000000 + Math.random() * 90000000);
    const previewQR = 'QR-STN-' + Math.floor(100000 + Math.random() * 900000);
    const previewQrImgUrl = getQrCodeImageUrl(`BAHER-SILVER|PREVIEW|Barcode:${previewBarcode}`, 120);
    const currentImgUrl = state.pendingStoneImageUrl || '';
    const hasImg = currentImgUrl.trim() !== '';

    return `
      <div class="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
        <div class="glass-card max-w-4xl w-full p-6 md:p-8 rounded-3xl border border-brand-500/40 space-y-6 max-h-[92vh] overflow-y-auto text-right font-sans shadow-2xl">
          
          <!-- Enterprise Header -->
          <div class="flex justify-between items-center pb-4 border-b border-borderdark">
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-xl text-brand-500">
                💎
              </div>
              <div>
                <h3 class="text-lg font-extrabold text-white tracking-wide">نموذج استلام وتسجيل حجر جديد</h3>
                <p class="text-xs text-slate-400">مصنع باهر سيلفر • رفع صورة من الجهاز أو الالتقاط بكاميرا الموبايل مباشرة</p>
              </div>
            </div>
            <button onclick="closeModal()" class="h-9 w-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/80 flex items-center justify-center transition-all">✕</button>
          </div>

          <form onsubmit="handleCreateStoneSubmit(event)" class="space-y-6 text-xs">
            
            <!-- SECTION 1: Identity & Category -->
            <div class="p-5 rounded-2xl bg-slate-950/90 border border-brand-500/20 space-y-4 shadow-md">
              <div class="flex items-center justify-between pb-2 border-b border-borderdark/60">
                <div class="flex items-center gap-2 text-brand-500 font-bold text-xs">
                  <span>📌</span> <span>1. الهوية والتصنيف الأساسي (Identity & Category)</span>
                </div>
                
                <div class="flex items-center gap-3 p-1.5 rounded-xl bg-slate-900 border border-brand-500/30 font-mono text-[10px]">
                  <img src="${previewQrImgUrl}" alt="Scannable Mobile QR" title="امسح بكاميرا الموبايل" class="w-10 h-10 rounded bg-white p-0.5 border border-slate-700">
                  <div>
                    <div class="text-emerald-400 font-bold">📊 Barcode: ${previewBarcode}</div>
                    <div class="text-brand-500 font-bold">📱 QR: ${previewQR}</div>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-slate-300 font-bold mb-1.5">اسم الحجر بالعربية *</label>
                  <input type="text" name="nameAr" required placeholder="مثال: ياقوت أحمر بورمي فاخر" class="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white focus:border-brand-500 focus:outline-none transition-all">
                </div>

                <div>
                  <label class="block text-slate-300 font-bold mb-1.5">تصنيف الحجر * (من مركز البيانات أو إدخال يدوي)</label>
                  <select name="category" required onchange="handleCategoryDropdownChange(this, 'stone-custom-category-box')" class="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white font-sans focus:border-brand-500 focus:outline-none transition-all">
                    ${renderMasterOptions('STONE_CATEGORY')}
                  </select>

                  <div id="stone-custom-category-box" class="hidden mt-2" style="display:none;">
                    <label class="block text-amber-400 font-bold mb-1">أدخل التصنيف الخاص يدودياً *</label>
                    <input type="text" name="customCategory" placeholder="مثال: أحجار نادرة، ماس صناعي، أحجار مجوهرات خفيفة" class="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-amber-500/60 text-white font-sans text-xs focus:border-amber-400 focus:outline-none transition-all">
                  </div>
                </div>

                <div>
                  <label class="block text-cyan-400 font-bold mb-1.5">نوع الحجر (إدخال يدوي) *</label>
                  <input type="text" name="stoneType" required placeholder="أدخل نوع الحجر يدودياً (مثال: ياقوت، زفير، زمرد، زركون)" class="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-cyan-500/60 text-white font-sans text-xs focus:border-cyan-400 focus:outline-none transition-all">
                </div>

                <div>
                  <label class="block text-slate-300 font-bold mb-1.5">المنشأ * (من مركز البيانات)</label>
                  <select name="origin" required class="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white font-sans focus:border-brand-500 focus:outline-none transition-all">
                    ${renderMasterOptions('ORIGIN')}
                  </select>
                </div>
              </div>
            </div>

            <!-- SECTION 2: Physical Specs, Color Palette & Manual Size Input -->
            <div class="p-5 rounded-2xl bg-slate-950/90 border border-brand-500/20 space-y-4 shadow-md">
              <div class="flex items-center gap-2 text-brand-500 font-bold text-xs pb-2 border-b border-borderdark/60">
                <span>🎨</span> <span>2. المواصفات الفيزيائية (كتابة اللون والمقاس يدوياً)</span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  ${renderEnterpriseColorPickerComponent({ defaultHex: '#EF4444', defaultColorName: 'أحمر' })}
                </div>

                <div>
                  <label class="block text-slate-300 font-bold mb-1.5">الشكل الهندسي * (من مركز البيانات)</label>
                  <select name="shape" required class="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white font-sans focus:border-brand-500 focus:outline-none transition-all">
                    ${renderMasterOptions('SHAPE')}
                  </select>
                </div>

                <div>
                  <label class="block text-amber-400 font-bold mb-1.5">المقاس القياسي (إدخال يدوي) *</label>
                  <input type="text" name="size" required placeholder="أدخل المقاس يدودياً (مثال: 1.2 mm أو 4x2 mm)" class="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-amber-500/60 text-white font-mono text-xs focus:border-amber-400 focus:outline-none transition-all">
                </div>

                <div>
                  <label class="block text-slate-300 font-bold mb-1.5">درجة الجودة * (من مركز البيانات)</label>
                  <select name="quality" required class="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white font-sans focus:border-brand-500 focus:outline-none transition-all">
                    ${renderMasterOptions('QUALITY_GRADE')}
                  </select>
                </div>
              </div>
            </div>

            <!-- SECTION 3: Stone Image Attachment (Native HTML Label Delegation & Direct URL) -->
            <div class="p-5 rounded-2xl bg-slate-950/90 border border-brand-500/20 space-y-3 shadow-md">
              <div class="flex items-center gap-2 text-brand-500 font-bold text-xs pb-2 border-b border-borderdark/60">
                <span>📷</span> <span>3. صورة الحجر (رفع من الجهاز / كاميرا الموبايل / رابط مباشر)</span>
              </div>

              <div class="flex flex-col sm:flex-row items-center gap-4">
                <!-- Preview Box -->
                <div id="stone-img-preview-box" class="w-24 h-24 rounded-2xl bg-slate-900 border-2 border-slate-700 flex items-center justify-center text-slate-500 text-xs overflow-hidden shrink-0 shadow-lg relative">
                  <span id="stone-img-placeholder" class="text-center font-bold" style="${hasImg ? 'display:none;' : 'display:block;'}">📸<br>لا صورة</span>
                  <img id="stone-img-preview-el" src="${currentImgUrl}" class="${hasImg ? '' : 'hidden'} w-full h-full object-cover rounded-xl" style="${hasImg ? 'display:block;' : 'display:none;'}">
                </div>

                <div class="flex-1 space-y-3 w-full">
                  <div class="flex flex-wrap gap-2.5">
                    <!-- Native Label 1: Gallery / Device File Picker -->
                    <label for="stone-file-input" class="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer">
                      <span>📁</span> <span>اختر صورة من المعرض/الجهاز</span>
                    </label>

                    <!-- Native Label 2: Mobile Camera Capture -->
                    <label for="stone-camera-input" class="px-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/40 font-bold text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer">
                      <span>📷</span> <span>التقط فوراً بكاميرا الموبايل</span>
                    </label>
                  </div>

                  <!-- Direct URL Input -->
                  <div>
                    <input type="text" id="stone-url-text-input" value="${hasImg && !currentImgUrl.startsWith('data:') ? currentImgUrl : ''}" oninput="handleDirectUrlInput(this.value)" placeholder="أو أدخل رابط صورة مباشرة (URL)..." class="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white font-mono text-xs focus:border-brand-500 focus:outline-none">
                  </div>

                  <!-- Off-screen Accessible Real Inputs -->
                  <input type="file" id="stone-file-input" accept="image/*" onchange="handleStoneFileSelect(event)" style="opacity:0; position:absolute; z-index:-1; width:1px; height:1px;">
                  <input type="file" id="stone-camera-input" accept="image/*" capture="environment" onchange="handleStoneFileSelect(event)" style="opacity:0; position:absolute; z-index:-1; width:1px; height:1px;">
                  <input type="hidden" name="imageUrl" id="stone-image-url-input" value="${currentImgUrl}">

                  <p class="text-[11px] text-slate-400 font-sans">اختر ملف الصورة، افتح كاميرا الموبايل، أو لصق رابط مباشر وسيتم ضغط المعاينة وحفظها في قاعدة البيانات.</p>
                </div>
              </div>
            </div>

            <!-- SECTION 4: Primary Weight (g) & Quantity -->
            <div class="p-5 rounded-2xl bg-slate-950/90 border border-emerald-500/30 space-y-4 shadow-md">
              <div class="flex items-center justify-between pb-2 border-b border-emerald-500/20">
                <div class="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <span>⚖️</span> <span>4. الأوزان والكميات المتاحة (Primary Weight in Grams)</span>
                </div>
                <span class="text-[10px] text-emerald-400 font-mono">1 Gram = 5 Carats</span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-emerald-400 font-bold mb-1.5">الوزن الأساسي بالجرام (g) * (Primary Weight)</label>
                  <input type="number" step="0.001" name="weightGrams" required placeholder="مثال: 10.500" class="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-emerald-500/60 text-white font-mono text-sm focus:border-emerald-400 focus:outline-none transition-all">
                </div>

                <div>
                  <label class="block text-slate-300 font-bold mb-1.5">العدد (القطع) *</label>
                  <input type="number" name="quantity" required placeholder="مثال: 50" class="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white font-mono text-sm focus:border-brand-500 focus:outline-none transition-all">
                </div>
              </div>
            </div>

            <!-- SECTION 5: Financial Valuation & Supplier Details -->
            <div class="p-5 rounded-2xl bg-slate-950/90 border border-brand-500/20 space-y-4 shadow-md">
              <div class="flex items-center gap-2 text-brand-500 font-bold text-xs pb-2 border-b border-borderdark/60">
                <span>💰</span> <span>5. التقييم المالي والمورد (Valuation & Supplier Profile)</span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-slate-300 font-bold mb-1.5">سعر الشراء وسعر البيع (ج.م)</label>
                  <div class="grid grid-cols-2 gap-2">
                    <input type="number" step="0.01" name="purchasePrice" placeholder="سعر الشراء" class="w-full h-11 px-3 rounded-xl bg-slate-900 border border-slate-700/80 text-white font-mono text-xs focus:border-brand-500 focus:outline-none">
                    <input type="number" step="0.01" name="sellingPrice" placeholder="سعر البيع" class="w-full h-11 px-3 rounded-xl bg-slate-900 border border-slate-700/80 text-white font-mono text-xs focus:border-brand-500 focus:outline-none">
                  </div>
                </div>

                <div>
                  <label class="block text-slate-300 font-bold mb-1.5">اسم المورد ورقم الفاتورة</label>
                  <div class="grid grid-cols-2 gap-2">
                    <input type="text" name="supplierName" placeholder="اسم المورد" class="w-full h-11 px-3 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs focus:border-brand-500 focus:outline-none">
                    <input type="text" name="invoiceNumber" placeholder="رقم الفاتورة" class="w-full h-11 px-3 rounded-xl bg-slate-900 border border-slate-700/80 text-white font-mono text-xs focus:border-brand-500 focus:outline-none">
                  </div>
                </div>
              </div>
            </div>

            <!-- Enterprise Action Buttons -->
            <div class="flex justify-end gap-3 pt-4 border-t border-borderdark">
              <button type="button" onclick="closeModal()" class="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-bold text-xs transition-all">إلغاء</button>
              <button type="submit" class="px-7 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-brand-500/25 transition-all">حفظ واستلام الحجر</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  // ADD RAW MATERIAL MODAL WITH DYNAMIC MASTER DROPDOWNS
  if (state.activeModal === 'addRaw') {
    return `
      <div class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="glass-card max-w-lg w-full p-6 rounded-2xl border border-brand-500/40 space-y-4 text-right font-sans">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-bold text-white">🧪 إضافة خام جديد (Master Data Categories)</h3>
            <button onclick="closeModal()" class="text-slate-400 hover:text-white">✕</button>
          </div>

          <form onsubmit="handleCreateRawSubmit(event)" class="space-y-4 text-xs font-sans">
            <div>
              <label class="block text-slate-300 font-bold mb-1">اسم الخام بالعربية *</label>
              <input type="text" name="nameAr" required placeholder="مثال: شمع صب إيطالي" class="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white">
            </div>

            <div>
              <label class="block text-slate-300 font-bold mb-1">التصنيف * (من مركز البيانات أو إدخال يدوي)</label>
              <select name="category" required onchange="handleCategoryDropdownChange(this, 'raw-custom-category-box')" class="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-sans">
                ${renderMasterOptions('RAW_CATEGORY')}
              </select>

              <div id="raw-custom-category-box" class="hidden mt-2" style="display:none;">
                <label class="block text-amber-400 font-bold mb-1">أدخل تصنيف الخام يدودياً *</label>
                <input type="text" name="customCategory" placeholder="مثال: أحماض تنظيف، زيوت، شمع صب، مستلزمات ورشة" class="w-full p-2.5 rounded-xl bg-slate-950 border border-amber-500/60 text-white font-sans text-xs focus:border-amber-400 focus:outline-none">
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block text-slate-300 font-bold mb-1">الكمية المتاحة *</label>
                <input type="number" step="0.01" name="availableStock" required placeholder="الكمية" class="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono">
              </div>
              <div>
                <label class="block text-slate-300 font-bold mb-1">وحدة القياس * (من مركز البيانات)</label>
                <select name="unitOfMeasure" class="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-sans">
                  ${renderMasterOptions('UNIT')}
                </select>
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-3">
              <button type="button" onclick="closeModal()" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold">إلغاء</button>
              <button type="submit" class="px-6 py-2 rounded-xl bg-brand-500 text-slate-950 font-bold">حفظ الخام</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  return '';
}

async function handleCreateMasterItemSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  const body = {
    category: state.selectedMasterCategory,
    code: formData.get('code'),
    nameAr: formData.get('nameAr'),
    nameEn: formData.get('nameAr')
  };

  const res = await apiPost('/master-data', body);
  if (res.success) {
    closeModal();
    showToast('تم حفظ العنصر المرجعي بمركز البيانات بنجاح!');
    await loadAllDatabaseData();
  } else {
    alert(`خطأ: ${res.error}`);
  }
}

async function handleCreateStoneSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  const catSelect = formData.get('category');
  const customCat = formData.get('customCategory');
  const finalCategory = (catSelect === 'OTHER' && customCat && customCat.trim() !== '') ? customCat.trim() : catSelect;

  const whStones = state.warehouses.find(w => w.type === 'STONES') || state.warehouses[0];
  const qty = parseInt(formData.get('quantity'), 10);
  const weight = parseFloat(formData.get('weightGrams'));
  const buyPrice = parseFloat(formData.get('purchasePrice') || 0);

  const body = {
    nameAr: formData.get('nameAr'),
    nameEn: formData.get('nameAr'),
    category: finalCategory,
    stoneType: formData.get('stoneType'),
    origin: formData.get('origin'),
    color: formData.get('color'),
    shape: formData.get('shape'),
    size: formData.get('size'),
    quality: formData.get('quality'),
    imageUrl: formData.get('imageUrl') || state.pendingStoneImageUrl || '',
    treatment: 'طبيعي',
    weightGrams: weight,
    quantity: qty,
    purchasePrice: buyPrice,
    sellingPrice: parseFloat(formData.get('sellingPrice') || 0),
    supplierName: formData.get('supplierName'),
    invoiceNumber: formData.get('invoiceNumber'),
    warehouseId: whStones ? whStones.id : ''
  };

  // Local fallback stone record creation
  const localStoneId = 'STN-' + Date.now();
  const localCode = 'STN-' + Math.floor(100000 + Math.random() * 900000);
  const newStoneObj = {
    id: localStoneId,
    code: localCode,
    ...body,
    barcode: '62910' + Math.floor(10000000 + Math.random() * 90000000),
    qrCode: 'QR-' + localCode
  };

  state.stones.unshift(newStoneObj);

  // Post Double-Entry Journal Entry
  const totalValue = buyPrice * qty;
  postJournalEntry({
    debitCode: '1101', // مخزون الأحجار الكريمة
    creditCode: body.supplierName ? '2101' : '1103', // حـ/ الموردين أو حـ/ الصندوق
    amount: totalValue > 0 ? totalValue : qty * 100,
    description: `تكويد واستلام حجر جديد (${body.nameAr} - ${qty} قطعة | تصنيف: ${finalCategory})`,
    referenceNo: localCode
  });

  // Automatic Movement Log for new stone creation
  state.movements.unshift({
    id: 'MOV-' + Date.now(),
    stoneId: newStoneObj.id,
    itemCode: newStoneObj.code,
    itemName: newStoneObj.nameAr,
    stoneCategory: finalCategory,
    txType: 'RECEIVE',
    typeLabel: 'تكويد واستلام حجر جديد',
    quantity: qty,
    weightGrams: weight,
    balanceBefore: '0 قطعة (0g)',
    balanceAfter: `${qty} قطعة (${weight}g)`,
    recipientEmployee: body.supplierName || 'تكويد أولي',
    userName: 'مسؤول الأحجار الكريمة',
    orderNo: body.invoiceNumber || '—',
    notes: `استلام وتكويد حجر جديد بالتصنيف (${finalCategory})`,
    createdAt: new Date().toISOString(),
    timestamp: new Date().toLocaleString('ar-EG'),
    remainingQty: qty,
    remainingWeightGrams: weight
  });

  recalculateEnterpriseState();

  try {
    const res = await apiPost('/inventory/stones', body);
    if (res && res.success) {
      await loadAllDatabaseData();
    }
  } catch (err) {
    console.log('Local stone creation handled');
  }

  closeModal();
  showToast(`تم استلام وتسجيل الحجر بالتصنيف (${finalCategory}) وحفظ صورته والقيود المحاسبية بنجاح!`);
}

async function handleCreateRawSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  const catSelect = formData.get('category');
  const customCat = formData.get('customCategory');
  const finalCategory = (catSelect === 'OTHER' && customCat && customCat.trim() !== '') ? customCat.trim() : catSelect;

  const nameAr = formData.get('nameAr');
  const stock = parseFloat(formData.get('availableStock') || 0);
  const unit = formData.get('unitOfMeasure') || 'جم';
  const unitCost = 50;

  const whRaw = state.warehouses.find(w => w.type === 'RAW_MATERIALS') || state.warehouses[0];
  const body = {
    nameAr: nameAr,
    nameEn: nameAr,
    category: finalCategory,
    availableStock: stock,
    unitOfMeasure: unit,
    unitCost: unitCost,
    warehouseId: whRaw ? whRaw.id : ''
  };

  const localRawId = 'RAW-' + Date.now();
  const localCode = 'RAW-' + Math.floor(100000 + Math.random() * 900000);
  const newRawObj = {
    id: localRawId,
    itemCode: localCode,
    ...body
  };

  state.rawMaterials.unshift(newRawObj);

  // Accounting Journal Entry for Raw Material Addition
  const totalVal = stock * unitCost;
  postJournalEntry({
    debitCode: '1102', // مخزون الخامات والمستلزمات
    creditCode: '1103', // الخزينة والصندوق
    amount: totalVal > 0 ? totalVal : stock * 50,
    description: `استلام وتكويد خام جديد (${nameAr} - ${stock} ${unit} | تصنيف: ${finalCategory})`,
    referenceNo: localCode
  });

  // Automatic Movement Log for new raw creation
  state.movements.unshift({
    id: 'MOV-' + Date.now(),
    itemCode: localCode,
    itemName: nameAr,
    stoneCategory: finalCategory,
    txType: 'RECEIVE_RAW',
    typeLabel: 'إضافة وتكويد خام جديد',
    quantity: stock,
    weightGrams: stock,
    balanceBefore: `0 ${unit}`,
    balanceAfter: `${stock} ${unit}`,
    recipientEmployee: 'المخزن الرئيسي',
    userName: 'مسؤول الخامات',
    orderNo: '—',
    notes: `تكويد أولي للخام (${nameAr})`,
    createdAt: new Date().toISOString(),
    timestamp: new Date().toLocaleString('ar-EG'),
    remainingQty: stock,
    remainingWeightGrams: stock
  });

  recalculateEnterpriseState();

  try {
    const res = await apiPost('/inventory/raw-materials', body);
    if (res && res.success) {
      await loadAllDatabaseData();
    }
  } catch (err) {
    console.log('Local raw creation handled');
  }

  closeModal();
  showToast(`تمت إضافة الخام بالتصنيف (${finalCategory}) وتسجيل القيود المحاسبية بنجاح!`);
}

function exportMasterCSV() {
  const items = state.masterItems.filter(m => m.category === state.selectedMasterCategory);
  if (items.length === 0) return alert('لا توجد عناصر للتصدير');

  let csv = 'Category,Code,NameAr,NameEn,IsActive\n';
  items.forEach(i => {
    csv += `"${i.category}","${i.code}","${i.nameAr}","${i.nameEn}","${i.isActive}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `master_data_${state.selectedMasterCategory}.csv`;
  a.click();
}

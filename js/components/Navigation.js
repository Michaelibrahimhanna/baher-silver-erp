/**
 * BAHER SILVER ERP v4.0 — UNIFIED NAVIGATION ENGINE
 * Single authoritative navigation module registry & menu item renderer.
 * Serves Desktop (>1200px), Tablet (768-1199px), and Mobile (<768px).
 */

const NAVIGATION_MODULES = [
  {
    group: 'الرئيسية (Core)',
    items: [
      { id: 'wh_dashboard', icon: '📊', nameAr: 'لوحة القيادة التنفيذية', nameEn: 'Executive Dashboard', badge: 'v4.0' },
      { id: 'admin_dashboard', icon: '👑', nameAr: 'لوحة تحكم الأدمن', nameEn: 'Admin Dashboard' },
      { id: 'stones', icon: '💎', nameAr: 'مخزون الأحجار الكريمة', nameEn: 'Gemstone Inventory' },
      { id: 'raw_materials', icon: '🧪', nameAr: 'الخامات والكيماويات', nameEn: 'Raw & Chemicals' },
      { id: 'silver_inventory', icon: '🪙', nameAr: 'خزينة الفضة والسبائك (925/999)', nameEn: 'Silver Bullion 925/999', badge: 'g/ct' },
      { id: 'inventory_movements', icon: '🔄', nameAr: 'حركات وسجل المخزون', nameEn: 'Stock Movements' }
    ]
  },
  {
    group: 'التصنيع والهندسة (Manufacturing)',
    items: [
      { id: 'products', icon: '💍', nameAr: 'هندسة المنتجات والموديلات', nameEn: 'Product Engineering' },
      { id: 'bom', icon: '🌲', nameAr: 'قوائم المواد ومسارات التصنيع', nameEn: 'BOM & Routings' },
      { id: 'mo_kanban', icon: '🏭', nameAr: 'أوامر التصنيع ورش المصنع MO', nameEn: 'Manufacturing Orders' },
      { id: 'manufacturing_engine', icon: '⚙️', nameAr: 'محرك أتمتة التصنيع والسباكة', nameEn: 'Casting & Production Engine' }
    ]
  },
  {
    group: 'التجارية والمشتريات (Purchasing & Sales)',
    items: [
      { id: 'suppliers', icon: '🤝', nameAr: 'إدارة الموردين SRM', nameEn: 'Supplier Portal' },
      { id: 'purchasing', icon: '📦', nameAr: 'أوامر الشراء والاستلام', nameEn: 'Purchasing & GRN' },
      { id: 'customer_orders', icon: '🛒', nameAr: 'طلبات المبيعات والعملاء', nameEn: 'Sales & Customer Orders' }
    ]
  },
  {
    group: 'خدمة العملاء والضمان (CRM & Services)',
    items: [
      { id: 'customer_service', icon: '🛠️', nameAr: 'مركز خدمة العملاء والإصلاح', nameEn: 'Customer Service Center' },
      { id: 'warranty_center', icon: '📜', nameAr: 'مركز الضمانات والعيار 25 سنة', nameEn: 'Warranty Center' }
    ]
  },
  {
    group: 'بوابة العملاء والجواز الرقمي (Customer Portal & DPP)',
    items: [
      { id: 'customer_portal', icon: '🏛️', nameAr: 'بوابة العملاء الخاصة', nameEn: 'Customer Portal' },
      { id: 'dpp_admin', icon: '🛡️', nameAr: 'جواز السفر الرقمي DPP & QR', nameEn: 'Digital Product Passport', badge: 'HMAC' }
    ]
  },
  {
    group: 'البيانات والمخازن (Master Data & Warehouses)',
    items: [
      { id: 'master_center', icon: '⚙️', nameAr: 'مركز البيانات الأساسية (12)', nameEn: 'Master Data Center' },
      { id: 'warehouses', icon: '🏛️', nameAr: 'المخازن السبعة الرئيسية', nameEn: '7 Core Warehouses' },
      { id: 'locations', icon: '📍', nameAr: 'التخزين الهرمي QR', nameEn: 'Storage Hierarchy' },
      { id: 'inventory_audit', icon: '📋', nameAr: 'الجرد الدوري والمطابقة', nameEn: 'Inventory Audit' }
    ]
  },
  {
    group: 'التحليلات والنظام (Reports & Security)',
    items: [
      { id: 'reports_analytics', icon: '📈', nameAr: 'التقارير والتحليلات المتقدمة', nameEn: 'Reports & BI Analytics' },
      { id: 'system_health', icon: '⚡', nameAr: 'صحة النظام والأجهزة HAL', nameEn: 'System Health & HAL' },
      { id: 'user_management', icon: '🔒', nameAr: 'إدارة المستخدمين والصلاحيات', nameEn: 'User Security Matrix' },
      { id: 'roles_matrix', icon: '🛡️', nameAr: 'مصفوفة الأدوار والصلاحيات', nameEn: 'Permissions Matrix' },
      { id: 'settings', icon: '⚙️', nameAr: 'إعدادات النظام العامة', nameEn: 'System Settings' }
    ]
  }
];

const Navigation = {
  getModules() {
    return NAVIGATION_MODULES;
  },

  renderMenuItems(activeTab = 'wh_dashboard', collapsed = false) {
    let html = '';

    NAVIGATION_MODULES.forEach((group) => {
      html += `
        <div class="mb-4">
          <h3 class="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 ${collapsed ? 'hidden' : 'block'}">${group.group}</h3>
          <div class="space-y-1">
      `;

      group.items.forEach((item) => {
        const isActive = activeTab === item.id || 
          (activeTab === 'stones_store' && item.id === 'stones') ||
          (activeTab === 'raw_store' && item.id === 'raw_materials') ||
          (activeTab === 'silver_store' && item.id === 'silver_inventory') ||
          (activeTab === 'product_engineering' && item.id === 'products') ||
          (activeTab === 'users_admin' && item.id === 'user_management');

        const activeClass = isActive
          ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-400 font-bold border-r-2 border-amber-500 shadow-sm'
          : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200';

        html += `
          <button data-tab="${item.id}" onclick="if(typeof switchTab==='function') switchTab('${item.id}');" class="bs-nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-all ${activeClass}" title="${item.nameAr} (${item.nameEn})">
            <span class="text-base flex-shrink-0">${item.icon}</span>
            <span class="truncate ${collapsed ? 'hidden' : 'block'}">${item.nameAr}</span>
            ${item.badge && !collapsed ? `<span class="mr-auto px-1.5 py-0.5 text-[9px] font-black rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30">${item.badge}</span>` : ''}
          </button>
        `;
      });

      html += `</div></div>`;
    });

    return html;
  }
};

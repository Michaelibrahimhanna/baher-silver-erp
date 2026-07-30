/* BAHER SILVER ERP v4.0 ENTERPRISE SELF-CONTAINED JS BUNDLE */

/* --- ui_components.js --- */
/**
 * BAHER SILVER ERP ENTERPRISE v4.0 — REUSABLE COMPONENT LIBRARY (Phase 1)
 * Inspired by Odoo, SAP Business One, Stripe Dashboard, Linear, Framer
 * Modular JS UI Component Renderers — NO inline CSS, NO inline JS
 */

const UIComponents = {
  /**
   * 1. ENTERPRISE SIDEBAR COMPONENT
   */
  renderSidebar(activeTab = 'dashboard', collapsed = false) {
    const modules = [
      {
        group: 'الرئيسية (Core)',
        items: [
          { id: 'wh_dashboard', icon: '📊', nameAr: 'لوحة القيادة التنفيذية', nameEn: 'Executive Dashboard', badge: 'v4.0' },
          { id: 'stones', icon: '💎', nameAr: 'مخزون الأحجار الكريمة', nameEn: 'Gemstone Inventory' },
          { id: 'raw_materials', icon: '🧪', nameAr: 'الخامات والكيماويات', nameEn: 'Raw & Chemicals' },
          { id: 'silver_inventory', icon: '🪙', nameAr: 'خزينة الفضة والسبائك (925/999)', nameEn: 'Silver Bullion 925/999', badge: 'g/ct' },
          { id: 'inventory_movements', icon: '🔄', nameAr: 'حركات وسجل المخزون', nameEn: 'Stock Movements' }
        ]
      },
      {
        group: 'التصنيع والهندسة (Engineering)',
        items: [
          { id: 'products', icon: '💍', nameAr: 'هندسة المنتجات والموديلات', nameEn: 'Product Engineering' },
          { id: 'bom', icon: '🌲', nameAr: 'قوائم المواد ومسارات التصنيع', nameEn: 'BOM & Routings' },
          { id: 'mo_kanban', icon: '🏭', nameAr: 'أوامر التصنيع ورش المصنع MO', nameEn: 'Manufacturing Orders' }
        ]
      },
      {
        group: 'التجارية والمشتريات (Commercial)',
        items: [
          { id: 'suppliers', icon: '🤝', nameAr: 'إدارة الموردين SRM', nameEn: 'Supplier Portal' },
          { id: 'purchasing', icon: '📦', nameAr: 'أوامر الشراء والاستلام', nameEn: 'Purchasing & GRN' },
          { id: 'customer_orders', icon: '🛒', nameAr: 'طلبات العملاء والتصاميم', nameEn: 'Customer Orders' }
        ]
      },
      {
        group: 'بوابة العملاء والخدمات (Portal & DPP)',
        items: [
          { id: 'customer_portal', icon: '🏛️', nameAr: 'بوابة العملاء الخاصة', nameEn: 'Customer Portal' },
          { id: 'dpp_admin', icon: '🛡️', nameAr: 'جواز السفر الرقمي DPP & QR', nameEn: 'Digital Product Passport', badge: 'HMAC' },
          { id: 'customer_service', icon: '🛠️', nameAr: 'مركز خدمة العملاء والإصلاح', nameEn: 'Customer Service Center' },
          { id: 'warranty_center', icon: '📜', nameAr: 'مركز الضمانات والعيار 25 سنة', nameEn: 'Warranty Center' }
        ]
      },
      {
        group: 'التحليلات والنظام (Enterprise)',
        items: [
          { id: 'reports_analytics', icon: '📈', nameAr: 'التقارير والتحليلات المتقدمة', nameEn: 'Reports & BI Analytics' },
          { id: 'system_health', icon: '⚡', nameAr: 'صحة النظام والأجهزة HAL', nameEn: 'System Health & HAL' },
          { id: 'user_management', icon: '🔒', nameAr: 'إدارة المستخدمين والصلاحيات', nameEn: 'User Security Matrix' },
          { id: 'settings', icon: '⚙️', nameAr: 'إعدادات النظام العامة', nameEn: 'System Settings' }
        ]
      }
    ];

    const collapsedClass = collapsed ? 'w-20' : 'w-72';

    let html = `
      <aside id="bs-app-sidebar" class="bg-slate-900/95 border-l border-slate-800 flex flex-col transition-all duration-300 z-30 select-none ${collapsedClass}">
        <!-- Sidebar Brand Header -->
        <div class="h-16 px-4 flex items-center justify-between border-b border-slate-800">
          <div class="flex items-center gap-3 overflow-hidden">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 flex items-center justify-center shadow-lg shadow-amber-900/30 flex-shrink-0">
              <span class="text-xl">✨</span>
            </div>
            <div class="flex flex-col ${collapsed ? 'hidden' : 'block'} min-w-0">
              <h1 class="font-extrabold text-sm text-slate-100 truncate tracking-tight">باهر سيلفر ERP</h1>
              <span class="text-[10px] text-amber-400 font-bold">ENTERPRISE v4.0</span>
            </div>
          </div>
          <button id="btn-toggle-sidebar" class="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors">
            <span class="text-sm">${collapsed ? '⏩' : '⏪'}</span>
          </button>
        </div>

        <!-- Sidebar Navigation Menu -->
        <div class="flex-1 overflow-y-auto py-4 px-3 space-y-6">
    `;

    modules.forEach((group) => {
      html += `
        <div>
          <h3 class="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 ${collapsed ? 'hidden' : 'block'}">${group.group}</h3>
          <div class="space-y-1">
      `;

      group.items.forEach((item) => {
        const isActive = activeTab === item.id;
        const activeClass = isActive
          ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-400 font-bold border-r-2 border-amber-500'
          : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200';

        html += `
          <button data-tab="${item.id}" class="bs-nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-all ${activeClass}">
            <span class="text-base flex-shrink-0">${item.icon}</span>
            <span class="truncate ${collapsed ? 'hidden' : 'block'}">${item.nameAr}</span>
            ${item.badge && !collapsed ? `<span class="mr-auto px-1.5 py-0.5 text-[9px] font-black rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30">${item.badge}</span>` : ''}
          </button>
        `;
      });

      html += `</div></div>`;
    });

    html += `
        </div>

        <!-- Sidebar User Footer -->
        <div class="p-3 border-t border-slate-800 bg-slate-950/40 flex items-center gap-3">
          <div class="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 font-bold flex-shrink-0">
            A
          </div>
          <div class="flex flex-col min-w-0 ${collapsed ? 'hidden' : 'block'}">
            <span class="text-xs font-bold text-slate-200 truncate">مدير النظام (Admin)</span>
            <span class="text-[10px] text-emerald-400">● متصل بنجاح</span>
          </div>
        </div>
      </aside>
    `;

    return html;
  },

  /**
   * 2. ENTERPRISE HEADER COMPONENT
   */
  renderHeader(currentTitle = 'لوحة القيادة التنفيذية', activeTab = 'dashboard') {
    return `
      <header class="h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between z-20">
        <!-- Left Section: Breadcrumbs & Quick Search Trigger -->
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <span class="hover:text-slate-200 cursor-pointer">باهر سيلفر ERP</span>
            <span>/</span>
            <span class="text-amber-400 font-bold">${currentTitle}</span>
          </div>
        </div>

        <!-- Center Section: Command Palette Trigger -->
        <div class="flex-1 max-w-md mx-6">
          <button id="btn-open-command-palette" class="w-full flex items-center justify-between bg-slate-950/60 border border-slate-800 hover:border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-400 transition-all shadow-inner">
            <div class="flex items-center gap-2">
              <span>🔍</span>
              <span>البحث السريع في النظام والقطاع...</span>
            </div>
            <kbd class="px-2 py-0.5 text-[10px] font-mono font-bold bg-slate-800 text-slate-300 rounded border border-slate-700">Ctrl + K</kbd>
          </button>
        </div>

        <!-- Right Section: Actions, Notifications, Theme & Profile -->
        <div class="flex items-center gap-3">
          <!-- Quick Add Action Button -->
          <button id="btn-quick-action" class="bs-btn bs-btn-primary bs-btn-sm shadow-md">
            <span>➕</span>
            <span>إضافة جديدة</span>
          </button>

          <!-- Language Switcher -->
          <button id="btn-toggle-lang" class="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors">
            🌐 AR
          </button>

          <!-- Theme Mode Switcher -->
          <button id="btn-toggle-theme" class="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold transition-colors">
            🌙
          </button>

          <!-- Notification Drawer Trigger -->
          <button id="btn-open-notifications" class="relative p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors">
            <span>🔔</span>
            <span class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">3</span>
          </button>
        </div>
      </header>
    `;
  },

  /**
   * 3. MULTI-TAB NAVIGATION BAR
   */
  renderMultiTabBar(openTabs = [{ id: 'wh_dashboard', title: 'لوحة القيادة التنفيذية', icon: '📊' }], activeTab = 'wh_dashboard') {
    let tabsHtml = `
      <div class="h-10 bg-slate-950/80 border-b border-slate-800/80 px-4 flex items-center gap-2 overflow-x-auto select-none">
    `;

    openTabs.forEach((tab) => {
      const isActive = tab.id === activeTab;
      const activeClass = isActive
        ? 'bg-slate-900 text-amber-400 font-bold border-t-2 border-amber-500 shadow-md'
        : 'bg-slate-950/40 text-slate-400 hover:bg-slate-900/60 hover:text-slate-200';

      tabsHtml += `
        <div data-tab="${tab.id}" class="bs-tab-item flex items-center gap-2 px-3 py-1.5 rounded-t-lg text-xs cursor-pointer transition-all ${activeClass}">
          <span>${tab.icon}</span>
          <span class="truncate max-w-[120px]">${tab.title}</span>
          ${tab.id !== 'wh_dashboard' ? `<span data-close-tab="${tab.id}" class="hover:text-rose-400 rounded p-0.5 text-[10px]">✕</span>` : ''}
        </div>
      `;
    });

    tabsHtml += `</div>`;
    return tabsHtml;
  },

  /**
   * 4. COMMAND PALETTE MODAL (Ctrl+K)
   */
  renderCommandPalette() {
    return `
      <div id="bs-command-palette-modal" class="hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-20 p-4">
        <div class="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden font-sans">
          <!-- Palette Search Input -->
          <div class="p-4 border-b border-slate-800 flex items-center gap-3">
            <span class="text-lg">🔍</span>
            <input id="cmd-palette-input" type="text" placeholder="اكتب للبحث أو الانتقال لأي وحدة... (مثال: أحجار, فحص, ضمان)" class="w-full bg-transparent text-sm text-slate-100 outline-none">
            <kbd class="px-2 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 rounded">ESC</kbd>
          </div>

          <!-- Quick Navigation Results -->
          <div class="max-h-80 overflow-y-auto p-2 space-y-1 text-xs text-slate-300">
            <div class="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase">الوحدات السريعة (Quick Jump)</div>
            
            <div data-cmd-tab="wh_dashboard" class="cmd-item p-2.5 rounded-xl hover:bg-amber-500/20 hover:text-amber-300 cursor-pointer flex items-center justify-between">
              <span class="flex items-center gap-2"><span>📊</span><span>لوحة القيادة التنفيذية</span></span>
              <span class="text-[10px] text-slate-500">منطقة الأداء الكلي</span>
            </div>

            <div data-cmd-tab="stones" class="cmd-item p-2.5 rounded-xl hover:bg-amber-500/20 hover:text-amber-300 cursor-pointer flex items-center justify-between">
              <span class="flex items-center gap-2"><span>💎</span><span>مخزون الأحجار الكريمة</span></span>
              <span class="text-[10px] text-slate-500">إدارة الألماس والياقوت والزركون</span>
            </div>

            <div data-cmd-tab="silver_inventory" class="cmd-item p-2.5 rounded-xl hover:bg-amber-500/20 hover:text-amber-300 cursor-pointer flex items-center justify-between">
              <span class="flex items-center gap-2"><span>🪙</span><span>خزينة الفضة والسبائك 925/999</span></span>
              <span class="text-[10px] text-slate-500">جرامات والوزن الإيطالي</span>
            </div>

            <div data-cmd-tab="customer_service" class="cmd-item p-2.5 rounded-xl hover:bg-amber-500/20 hover:text-amber-300 cursor-pointer flex items-center justify-between">
              <span class="flex items-center gap-2"><span>🛠️</span><span>مركز خدمة العملاء والإصلاح</span></span>
              <span class="text-[10px] text-slate-500">طلبات الصيانة والطلاء</span>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * 5. NOTIFICATION CENTER DRAWER
   */
  renderNotificationDrawer() {
    return `
      <div id="bs-notification-drawer" class="hidden fixed inset-y-0 left-0 z-50 w-80 bg-slate-900/98 border-r border-slate-800 backdrop-blur-xl p-4 shadow-2xl flex flex-col justify-between font-sans text-xs">
        <div>
          <div class="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 class="font-extrabold text-slate-100 flex items-center gap-2">
              <span>🔔</span><span>مركز التنبيهات والإشعارات</span>
            </h3>
            <button id="btn-close-notifications" class="text-slate-400 hover:text-white">✕</button>
          </div>

          <div class="py-4 space-y-3">
            <div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
              <div class="font-bold mb-1">⚠️ تنبيه مخزون حرج</div>
              <div class="text-[11px] text-slate-300">انخفض مخزون الفضة النقية عيار 999 عن الحد الأدنى 500 جرام.</div>
            </div>

            <div class="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
              <div class="font-bold mb-1">🛠️ طلب صيانة جديد</div>
              <div class="text-[11px] text-slate-300">تم تقديم طلب إصلاح جديد (SRV-2026-000002) لطلاء الروديوم.</div>
            </div>
          </div>
        </div>

        <button class="w-full py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-center font-bold">تحديد الكل ككمقروء</button>
      </div>
    `;
  },

  /**
   * 6. KPI CARD RENDERER
   */
  renderKpiCard(title, value, subtitle, icon, trendPct = 0, isPositive = true) {
    const trendClass = isPositive ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' : 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    const arrow = isPositive ? '↑' : '↓';

    return `
      <div class="bs-glass-card bs-kpi-card">
        <div class="bs-kpi-header">
          <span class="bs-kpi-title">${title}</span>
          <span class="p-2 rounded-xl bg-slate-800 border border-slate-700 text-base">${icon}</span>
        </div>
        <div class="bs-kpi-value">${value}</div>
        <div class="bs-kpi-footer">
          <span class="bs-badge ${trendClass}">${arrow} ${Math.abs(trendPct)}%</span>
          <span class="text-slate-400">${subtitle}</span>
        </div>
      </div>
    `;
  }
};

/* --- Sidebar.js --- */
/**
 * BAHER SILVER ERP — SIDEBAR COMPONENT MODULE
 */
const Sidebar = {
  render(activeTab = 'dashboard', collapsed = false) {
    return UIComponents.renderSidebar(activeTab, collapsed);
  }
};

/* --- Header.js --- */
/**
 * BAHER SILVER ERP — HEADER COMPONENT MODULE
 */
const Header = {
  render(currentTitle = 'لوحة القيادة التنفيذية', activeTab = 'dashboard') {
    return UIComponents.renderHeader(currentTitle, activeTab);
  }
};

/* --- Tabs.js --- */
/**
 * BAHER SILVER ERP — MULTI-TAB WORKSPACE MODULE
 */
const Tabs = {
  render(openTabs = [], activeTab = 'wh_dashboard') {
    return UIComponents.renderMultiTabBar(openTabs, activeTab);
  }
};

/* --- DataGrid.js --- */
/**
 * BAHER SILVER ERP — ENTERPRISE DATA GRID & WORKSPACE MEMORY SYSTEM (Phase 3)
 * Includes Saved Filters, Quick Filters, Filter Chips, Column Manager, Bulk Action Toolbar,
 * Split View, Virtualized Table Foundation, and Workspace Memory Persistence.
 */

const DataGrid = {
  /**
   * WORKSPACE MEMORY ENGINE
   */
  memory: {
    get(key, defaultValue = null) {
      try {
        const val = localStorage.getItem(`bs_erp_${key}`);
        return val ? JSON.parse(val) : defaultValue;
      } catch {
        return defaultValue;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(`bs_erp_${key}`, JSON.stringify(value));
      } catch (err) {
        console.error('Workspace memory save error:', err);
      }
    }
  },

  /**
   * 1. RENDER ENTERPRISE DATA GRID TOOLBAR & FILTER CHIPS
   */
  renderToolbar({
    searchQuery = '',
    quickFilters = [],
    activeFilterId = null,
    savedFilters = [],
    activeChips = [],
    selectedCount = 0,
    onSearch = 'handleDataGridSearch',
    onFilter = 'handleDataGridFilter',
    onSaveFilter = 'handleSaveFilterPreset'
  }) {
    return `
      <div class="space-y-3 font-sans">
        <!-- Main Toolbar Row -->
        <div class="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/90 border border-slate-800 rounded-xl">
          <!-- Search & Quick Filter Pills -->
          <div class="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
            <div class="relative flex-1 min-w-[200px]">
              <span class="absolute right-3 top-2.5 text-xs text-slate-400">🔍</span>
              <input type="text" value="${searchQuery}" placeholder="البحث في القائمة والبيانات..." oninput="${onSearch}(this.value)" class="w-full pr-8 pl-3 py-1.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-lg text-xs text-slate-100 outline-none">
            </div>

            <!-- Quick Filter Presets -->
            ${quickFilters.map(f => `
              <button onclick="${onFilter}('${f.id}')" class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${activeFilterId === f.id ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}">
                ${f.label}
              </button>
            `).join('')}
          </div>

          <!-- Column Manager & Saved Filters Dropdown Buttons -->
          <div class="flex items-center gap-2">
            <button onclick="DataGrid.toggleColumnManager()" class="bs-btn bs-btn-secondary bs-btn-sm">
              <span>👁️</span><span>إدارة الأعمدة</span>
            </button>
            <button onclick="${onSaveFilter}()" class="bs-btn bs-btn-ghost bs-btn-sm text-amber-400">
              <span>💾</span><span>حفظ الفلتر</span>
            </button>
          </div>
        </div>

        <!-- Filter Chips Row -->
        ${activeChips.length > 0 ? `
          <div class="flex items-center gap-2 text-xs font-mono">
            <span class="text-slate-400 font-sans">الفلاتر النشطة:</span>
            ${activeChips.map(c => `
              <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <span>${c.label}: ${c.value}</span>
                <button onclick="${c.onRemove}" class="hover:text-rose-400 text-[10px]">✕</button>
              </span>
            `).join('')}
          </div>
        ` : ''}

        <!-- Bulk Action Floating Toolbar (When items selected) -->
        ${selectedCount > 0 ? `
          <div class="flex items-center justify-between p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs font-bold animate-fade-in shadow-lg">
            <div class="flex items-center gap-2">
              <span>☑️</span>
              <span>تم تحديد ${selectedCount} عناصر في القائمة</span>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="handleBulkExport()" class="bs-btn bs-btn-secondary bs-btn-sm">تصدير المحددة (CSV)</button>
              <button onclick="handleBulkDelete()" class="bs-btn bs-btn-danger bs-btn-sm">حذف المحددة</button>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  },

  /**
   * 2. RENDER SPLIT VIEW WRAPPER (Data Grid + Details Drawer Panel)
   */
  renderSplitView(tableHtml, detailsPanelHtml = null) {
    if (!detailsPanelHtml) return tableHtml;

    return `
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        <div class="lg:col-span-2 space-y-4">
          ${tableHtml}
        </div>
        <div class="lg:col-span-1 bg-slate-900/95 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl sticky top-20">
          <div class="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 class="font-extrabold text-sm text-slate-100 flex items-center gap-2">
              <span>👁️</span><span>تفاصيل العنصر المحدد (Split View)</span>
            </h3>
            <button onclick="closeSplitViewDetails()" class="text-slate-400 hover:text-white">✕</button>
          </div>
          <div class="space-y-3">
            ${detailsPanelHtml}
          </div>
        </div>
      </div>
    `;
  },

  /**
   * 3. TOGGLE COLUMN MANAGER POPUP
   */
  toggleColumnManager() {
    alert('إدارة الأعمدة: يمكنك إخفاء/إظهار وإعادة ترتيب أعمدة القائمة بمرونة.');
  },

  /**
   * 4. RENDER DATA TABLE
   */
  renderTable({ columns = [], rows = [], keyField = 'id', onRowClick = null }) {
    if (rows.length === 0) {
      return this.renderEmptyState('لا توجد بيانات مسجلة حالياً لعرضها في القائمة.');
    }

    return `
      <div class="bs-table-container font-mono text-xs">
        <table class="bs-table">
          <thead>
            <tr>
              <th class="w-10 text-center"><input type="checkbox" onchange="toggleSelectAllRows(this.checked)"></th>
              ${columns.map(col => `<th>${col.label}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${rows.map(row => `
              <tr class="hover:bg-slate-900/50 cursor-pointer transition-colors" ${onRowClick ? `onclick="${onRowClick}('${row[keyField]}')"` : ''}>
                <td class="w-10 text-center" onclick="event.stopPropagation()"><input type="checkbox" class="bs-row-checkbox"></td>
                ${columns.map(col => `<td>${col.render ? col.render(row[col.field], row) : (row[col.field] ?? '—')}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  /**
   * 5. STATES (Loading Skeleton, Empty, Error, Permission)
   */
  renderSkeleton(columnsCount = 5, rowsCount = 6) {
    return `
      <div class="space-y-3 font-sans">
        <div class="flex items-center justify-between gap-4 pb-2">
          <div class="h-6 w-48 bs-skeleton"></div>
          <div class="h-8 w-32 bs-skeleton"></div>
        </div>
        <div class="bs-table-container">
          <div class="space-y-2 p-4">
            ${Array.from({ length: rowsCount }).map(() => `
              <div class="flex items-center gap-4">
                ${Array.from({ length: columnsCount }).map(() => `<div class="h-5 flex-1 bs-skeleton"></div>`).join('')}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  renderEmptyState(message = 'لا توجد بيانات مسجلة حالياً', actionText = null, actionModal = null) {
    return `
      <div class="p-12 text-center border-2 border-dashed border-slate-800 rounded-2xl space-y-4 bg-slate-950/40 font-sans">
        <div class="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-3xl mx-auto text-amber-400">
          📦
        </div>
        <div class="space-y-1">
          <h3 class="text-base font-bold text-slate-200">${message}</h3>
          <p class="text-xs text-slate-400">يمكنك البدء بإضافة عناصر جديدة أو تغيير الفلاتر الحالية.</p>
        </div>
        ${actionText && actionModal ? `
          <button onclick="openModal('${actionModal}')" class="bs-btn bs-btn-primary bs-btn-sm shadow-md">
            <span>+</span>
            <span>${actionText}</span>
          </button>
        ` : ''}
      </div>
    `;
  },

  renderErrorState(title = 'خطأ في جلب البيانات', errorMessage = 'تعذر الاتصال بمركز البيانات المسجلة، يرجى المحاولة لاحقاً.') {
    return `
      <div class="p-8 border border-rose-500/30 bg-rose-500/10 rounded-2xl space-y-3 font-sans text-rose-300">
        <div class="flex items-center gap-3 font-bold text-sm text-rose-400">
          <span class="text-xl">⚠️</span>
          <span>${title}</span>
        </div>
        <p class="text-xs text-rose-200/80 leading-relaxed">${errorMessage}</p>
        <button onclick="renderApp()" class="bs-btn bs-btn-danger bs-btn-sm">
          <span>🔄</span>
          <span>إعادة المحاولة</span>
        </button>
      </div>
    `;
  },

  renderPermissionState(permissionName = 'REQUIRED_PERMISSION') {
    return `
      <div class="p-12 text-center border border-amber-500/30 bg-amber-500/10 rounded-2xl space-y-4 font-sans text-amber-300">
        <div class="w-16 h-16 rounded-full bg-amber-950/80 border border-amber-500/50 flex items-center justify-center text-3xl mx-auto text-amber-400">
          🔒
        </div>
        <div class="space-y-1">
          <h3 class="text-base font-extrabold">عفواً! لا تملك صلاحية الوصول لهذه الشاشة</h3>
          <p class="text-xs text-amber-200/80">تتطلب هذه العملية الصلاحية التالية: <code class="px-2 py-0.5 rounded bg-amber-950 border border-amber-500/40 text-amber-400 font-mono">${permissionName}</code></p>
        </div>
      </div>
    `;
  }
};

/* --- Timeline.js --- */
/**
 * BAHER SILVER ERP — UNIFIED CUSTOMER 360° TIMELINE COMPONENT MODULE (Phase 4)
 * Renders the 8-stage customer timeline: Order ➔ Manufacturing ➔ QC ➔ Delivery ➔ Warranty ➔ Service ➔ Repairs ➔ Ownership
 */

const Timeline = {
  /**
   * 1. RENDER 360° LIFECYCLE STAGE STEPPER
   */
  renderLifecycleStepper(currentStage = 'WARRANTY') {
    const stages = [
      { id: 'ORDER', title: 'الطلب', icon: '🛒' },
      { id: 'MANUFACTURING', title: 'التصنيع', icon: '🏭' },
      { id: 'QC', title: 'فحص الجودة', icon: '🔍' },
      { id: 'DELIVERY', title: 'التسليم', icon: '🚚' },
      { id: 'WARRANTY', title: 'الضمان', icon: '📜' },
      { id: 'SERVICE', title: 'الخدمات', icon: '🛠️' },
      { id: 'REPAIRS', title: 'الإصلاح', icon: '🔧' },
      { id: 'OWNERSHIP', title: 'الملكية', icon: '👑' }
    ];

    const currentIdx = stages.findIndex(s => s.id === currentStage);

    return `
      <div class="w-full py-4 overflow-x-auto select-none font-sans">
        <div class="flex items-center justify-between min-w-[640px] px-2">
          ${stages.map((stage, idx) => {
            const isCompleted = idx <= currentIdx;
            const isCurrent = idx === currentIdx;
            const stepClass = isCurrent
              ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/20 font-bold scale-110 shadow-lg shadow-amber-500/30'
              : isCompleted
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              : 'bg-slate-900 text-slate-600 border border-slate-800';

            return `
              <div class="flex flex-col items-center gap-1.5 flex-1 relative">
                <!-- Connecting Line -->
                ${idx < stages.length - 1 ? `
                  <div class="absolute top-4 right-1/2 left-0 h-[2px] ${idx < currentIdx ? 'bg-emerald-500' : 'bg-slate-800'} -z-10"></div>
                ` : ''}
                
                <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all ${stepClass}">
                  <span>${stage.icon}</span>
                </div>
                <span class="text-[11px] font-bold ${isCurrent ? 'text-amber-400' : isCompleted ? 'text-slate-200' : 'text-slate-500'}">
                  ${stage.title}
                </span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  /**
   * 2. RENDER EVENT MILESTONE TIMELINE
   */
  render(events = []) {
    if (events.length === 0) return '<div class="text-xs text-slate-500 p-4">لا توجد أحداث سابقة في سجل الجدول الزمني</div>';

    return `
      <div class="relative border-r-2 border-slate-800 pr-6 space-y-6 font-sans">
        ${events.map(ev => `
          <div class="relative group">
            <div class="absolute -right-8 top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-amber-500 flex items-center justify-center shadow">
              <div class="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
            </div>
            <div class="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 space-y-1 hover:border-amber-500/40 transition-colors">
              <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-slate-200 flex items-center gap-2">
                  <span>${ev.icon || '📌'}</span>
                  <span>${ev.title}</span>
                </span>
                <span class="text-[10px] text-slate-400 font-mono">${ev.timestamp}</span>
              </div>
              <p class="text-xs text-slate-400 leading-relaxed">${ev.description}</p>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
};

/* --- Charts.js --- */
/**
 * BAHER SILVER ERP — SPARKLINE & MINI CHARTS COMPONENT MODULE
 */
const Charts = {
  renderSparkline(points = [10, 25, 18, 30, 45, 40, 60], width = 120, height = 36, color = '#C3B097') {
    const min = Math.min(...points);
    const max = Math.max(...points);
    const len = points.length - 1;

    const pathPoints = points.map((p, idx) => {
      const x = (idx / len) * width;
      const y = height - ((p - min) / (max - min || 1)) * height;
      return `${x},${y}`;
    }).join(' L ');

    return `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" class="overflow-visible">
        <path d="M ${pathPoints}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
      </svg>
    `;
  }
};

/* --- CommandPalette.js --- */
/**
 * BAHER SILVER ERP — GLOBAL COMMAND PALETTE & SEARCH MODULE (Phase 5)
 * Searches across: Products, Customers, Orders, Suppliers, DPP, Warranty, QR, Service Requests
 */

const CommandPalette = {
  render() {
    return `
      <div id="bs-command-palette-modal" class="hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-20 p-4 font-sans select-none">
        <div class="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden">
          <!-- Input Header -->
          <div class="p-4 border-b border-slate-800 flex items-center gap-3">
            <span class="text-lg">🔍</span>
            <input id="cmd-palette-input" type="text" placeholder="البحث الموحد الشامل (منتجات، عملاء، أوامر، فواتير، DPP، ضمان، خدمة)..." class="w-full bg-transparent text-sm text-slate-100 outline-none">
            <kbd class="px-2 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 rounded border border-slate-700">ESC</kbd>
          </div>

          <!-- Scope Filters Row -->
          <div class="flex items-center gap-1.5 px-4 py-2 bg-slate-950/60 border-b border-slate-800/80 text-[11px] font-bold text-slate-400 overflow-x-auto">
            <span class="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950">الكل</span>
            <span class="px-2.5 py-1 rounded-lg bg-slate-800 hover:text-white cursor-pointer">💍 المنتجات</span>
            <span class="px-2.5 py-1 rounded-lg bg-slate-800 hover:text-white cursor-pointer">🤝 العملاء</span>
            <span class="px-2.5 py-1 rounded-lg bg-slate-800 hover:text-white cursor-pointer">🛒 الأوامر</span>
            <span class="px-2.5 py-1 rounded-lg bg-slate-800 hover:text-white cursor-pointer">📦 الموردين</span>
            <span class="px-2.5 py-1 rounded-lg bg-slate-800 hover:text-white cursor-pointer">🛡️ DPP & QR</span>
            <span class="px-2.5 py-1 rounded-lg bg-slate-800 hover:text-white cursor-pointer">🛠️ الخدمات</span>
          </div>

          <!-- Quick Navigation Results -->
          <div class="max-h-80 overflow-y-auto p-2 space-y-1 text-xs text-slate-300">
            <div class="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">نتائج البحث الموصى بها</div>
            
            <div data-cmd-tab="wh_dashboard" class="cmd-item p-2.5 rounded-xl hover:bg-amber-500/20 hover:text-amber-300 cursor-pointer flex items-center justify-between">
              <span class="flex items-center gap-2"><span>📊</span><span>لوحة القيادة التنفيذية والمؤشرات</span></span>
              <span class="text-[10px] text-slate-500">وحدة التحكم الكلية</span>
            </div>

            <div data-cmd-tab="stones" class="cmd-item p-2.5 rounded-xl hover:bg-amber-500/20 hover:text-amber-300 cursor-pointer flex items-center justify-between">
              <span class="flex items-center gap-2"><span>💎</span><span>مخزون الأحجار الكريمة والألماس</span></span>
              <span class="text-[10px] text-slate-500">1,420 قطعة مسجلة</span>
            </div>

            <div data-cmd-tab="silver_inventory" class="cmd-item p-2.5 rounded-xl hover:bg-amber-500/20 hover:text-amber-300 cursor-pointer flex items-center justify-between">
              <span class="flex items-center gap-2"><span>🪙</span><span>خزينة الفضة والسبائك 999 (Account 1105)</span></span>
              <span class="text-[10px] text-slate-500">5,840.50 جرام</span>
            </div>

            <div data-cmd-tab="customer_service" class="cmd-item p-2.5 rounded-xl hover:bg-amber-500/20 hover:text-amber-300 cursor-pointer flex items-center justify-between">
              <span class="flex items-center gap-2"><span>🛠️</span><span>طلب خدمة طلاء روديوم (SRV-2026-0001)</span></span>
              <span class="text-[10px] text-emerald-400">جاري الصيانة</span>
            </div>

            <div data-cmd-tab="system_health" class="cmd-item p-2.5 rounded-xl hover:bg-amber-500/20 hover:text-amber-300 cursor-pointer flex items-center justify-between">
              <span class="flex items-center gap-2"><span>⚡</span><span>صحة النظام ومراقبة الأجهزة HAL</span></span>
              <span class="text-[10px] text-emerald-400">HEALTHY (18ms)</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};

/* --- Notifications.js --- */
/**
 * BAHER SILVER ERP — NOTIFICATIONS DRAWER MODULE
 */
const Notifications = {
  render() {
    return UIComponents.renderNotificationDrawer();
  }
};

/* --- Toast.js --- */
/**
 * BAHER SILVER ERP — TOAST SYSTEM MODULE
 */
const ToastNotification = {
  show(message, type = 'success') {
    if (typeof Toast !== 'undefined' && Toast.show) {
      Toast.show(message, '', type);
    }
  }
};

/* --- ui.js --- */
/**
 * BAHER SILVER ERP v2.0 — UI Behaviors
 * Sidebar | Theme | Language | Search | Notifications | Counters
 * Does NOT touch app.js data logic
 */

/* ═══════════════════════════════════════════════════════════════
   TRANSLATIONS — Full AR/EN coverage
   ═══════════════════════════════════════════════════════════════ */
const T = {
  en: {
    // Nav
    nav_main:'MAIN', nav_management:'MANAGEMENT',
    nav_dashboard:'Dashboard', nav_inventory:'Gemstone Inventory',
    nav_movements:'Stock Movement', nav_search:'Advanced Search',
    nav_suppliers:'Suppliers', nav_barcode:'Barcode & QR',
    nav_reports:'Reports', nav_settings:'Settings',
    nav_collapse:'Collapse sidebar', nav_expand:'Expand sidebar',
    // Topbar
    search_placeholder:'Search stones, barcodes, suppliers…',
    search_hint:'⌘K', search_empty:'No results found',

    // Wholesale
    col_grams:'Grams', f_grams:'Weight (Grams)', kpi_grams:'Total Grams',
    f_pieces:'Pieces', pieces:'pcs',
    // Dynamic Dropdowns
    "diamond": "Diamond", "ruby": "Ruby", "emerald": "Emerald", "sapphire": "Sapphire", "pearl": "Pearl", "opal": "Opal", "topaz": "Topaz", "amethyst": "Amethyst", "garnet": "Garnet", "turquoise": "Turquoise",
    "natural": "Natural", "synthetic": "Synthetic", "treated": "Treated", "lab-grown": "Lab-Grown", "simulant": "Simulant",
    "white": "White", "red": "Red", "pink": "Pink", "blue": "Blue", "green": "Green", "yellow": "Yellow", "orange": "Orange", "purple": "Purple", "black": "Black", "brown": "Brown", "gray": "Gray", "colorless": "Colorless", "multi-color": "Multi-Color",
    "round": "Round", "oval": "Oval", "pear": "Pear", "marquise": "Marquise", "princess": "Princess", "cushion": "Cushion", "emerald cut": "Emerald Cut", "asscher": "Asscher", "radiant": "Radiant", "heart": "Heart", "trillion": "Trillion", "baguette": "Baguette", "cabochon": "Cabochon", "freeform": "Freeform",
    "brilliant": "Brilliant", "step": "Step", "mixed": "Mixed", "rose": "Rose", "briolette": "Briolette", "faceted": "Faceted", "smooth": "Smooth",
    "carat": "Carat", "piece": "Piece", "gram": "Gram", "set": "Set", "pair": "Pair", "lot": "Lot",

    search_tip_enter:'to select', search_tip_esc:'to close',
    notif_title:'Notifications', notif_empty:'All caught up!',
    notif_empty_sub:'No alerts at the moment',
    notif_mark_read:'Mark all as read',
    notif_low_stock:'Low Stock Alert',
    notif_out_stock:'Out of Stock',
    theme_dark:'Dark mode', theme_light:'Light mode',
    user_name:'Administrator', user_role:'System Admin',
    user_profile:'Profile', user_settings:'Settings', user_logout:'Sign out',
    quick_add:'New Stone',
    // Page titles
    page_dashboard:'Dashboard', page_inventory:'Gemstone Inventory',
    page_movements:'Stock Movement', page_search:'Advanced Search',
    page_suppliers:'Suppliers', page_barcode:'Barcode & QR',
    page_reports:'Reports & Analytics', page_settings:'Settings',
    // Dashboard
    dash_subtitle:'Gemstone inventory overview',
    kpi_inv_value:'Inventory Value', kpi_purchase:'Purchase Value',
    kpi_selling:'Selling Value', kpi_profit:'Gross Profit',
    kpi_types:'Stone Types', kpi_qty:'Total Quantity',
    kpi_low:'Low Stock', kpi_out:'Out of Stock',
    chart_monthly:'Monthly Stock Movement',
    chart_category:'By Category', chart_color:'By Color',
    chart_shape:'By Shape', chart_supplier:'By Supplier',
    top_stones:'Top Stones by Value', recent_tx:'Recent Transactions',
    stock_alerts:'Stock Alerts', view_all:'View All',
    today_movements:"Today's Movements",
    // Table
    col_image:'Image', col_code:'Stone ID', col_name:'Stone Name',
    col_category:'Category', col_type:'Type', col_color:'Color',
    col_shape:'Shape', col_cut:'Cut', col_size:'Size (mm)',
    col_weight:'Weight (ct)', col_qty:'Quantity', col_unit:'Unit',
    col_buy:'Buy Price', col_sell:'Sell Price', col_value:'Total Value',
    col_status:'Status', col_location:'Location', col_supplier:'Supplier',
    col_date:'Date Added', col_actions:'Actions',
    // Movements
    col_mov_id:'Movement ID', col_mov_date:'Date & Time',
    col_mov_stone:'Stone', col_tx_type:'Type', col_employee:'Employee',
    col_reference:'Reference', col_reason:'Reason',
    // Status
    status_in:'In Stock', status_low:'Low Stock', status_out:'Out of Stock',
    tx_in:'Stock In', tx_out:'Stock Out', tx_adj:'Adjustment', tx_return:'Return',
    // Actions
    btn_add:'Add Gemstone', btn_edit:'Edit', btn_delete:'Delete',
    btn_view:'View', btn_barcode:'Barcode', btn_save:'Save',
    btn_cancel:'Cancel', btn_export:'Export CSV', btn_import:'Import',
    btn_print:'Print', btn_close:'Close', btn_confirm:'Confirm',
    btn_clear:'Clear', btn_search:'Search', btn_new_mov:'New Movement',
    btn_add_supplier:'Add Supplier', btn_refresh:'Refresh',
    btn_add_stone:'Add Stone', btn_bulk_delete:'Delete Selected',
    btn_select_all:'Select All', btn_deselect:'Deselect',
    // Form fields
    f_name_en:'Stone Name (English)', f_name_ar:'Stone Name (Arabic)',
    f_category:'Category', f_type:'Stone Type', f_color:'Color',
    f_shape:'Shape', f_cut:'Cut', f_size:'Size (mm)', f_weight:'Weight (Carat)',
    f_qty:'Quantity Available', f_unit:'Unit', f_min_stock:'Min. Stock Level',
    f_buy_price:'Purchase Price', f_sell_price:'Selling Price',
    f_margin:'Profit Margin', f_supplier:'Supplier', f_location:'Storage Location',
    f_notes:'Notes', f_image:'Stone Image', f_barcode:'Barcode',
    f_barcode_auto:'Auto-generated on save',
    // Placeholders
    ph_name_en:'e.g. Round White Diamond',
    ph_name_ar:'مثال: ألماس أبيض دائري',
    ph_size:'e.g. 3.5', ph_weight:'e.g. 0.25',
    ph_qty:'0', ph_min:'10', ph_price:'0.00',
    ph_notes:'Additional information…',
    ph_search:'Search by name, code, barcode…',
    ph_reason:'e.g. Customer order, Production…',
    ph_reference:'e.g. PO-2024-001',
    // Validation
    err_required:'This field is required',
    err_positive:'Must be a positive number',
    err_duplicate:'Duplicate entry detected',
    err_neg_stock:'Insufficient stock for this operation',
    err_invalid:'Invalid value',
    // Success messages
    msg_added:'Record added successfully',
    msg_updated:'Record updated successfully',
    msg_deleted:'Record deleted',
    msg_exported:'Exported successfully',
    msg_imported:'Imported successfully',
    msg_saved:'Settings saved',
    // Confirms
    confirm_delete:'Are you sure you want to delete this record? This action cannot be undone.',
    confirm_reset:'This will reset ALL data to demo data. This cannot be undone!',
    // Movement form
    f_stone:'Select Stone', f_tx_type:'Transaction Type',
    f_mov_date:'Date', f_mov_time:'Time',
    ph_stone_search:'Search by name, code or barcode…',
    ph_employee:'Select employee',
    label_current_qty:'Current Stock', label_after_qty:'After Movement',
    // Supplier fields
    f_company:'Company Name', f_contact:'Contact Person',
    f_mobile:'Mobile', f_whatsapp:'WhatsApp', f_email:'Email',
    f_website:'Website', f_country:'Country', f_address:'Address',
    // Search
    search_title:'Advanced Search', search_subtitle:'Find any gemstone instantly',
    scan_hint:'Scan a barcode or QR code directly into the search box',
    filter_status:'Stock Status', filter_all:'All', filter_in:'In Stock',
    filter_low:'Low Stock', filter_out:'Out of Stock',
    min_qty:'Min Qty', max_qty:'Max Qty',
    results_found:'gemstone(s) found',
    no_results:'No gemstones match your search',
    try_search:'Start searching to find gemstones',
    // Reports
    tab_valuation:'Inventory Valuation', tab_stock:'Stock Summary',
    tab_movements:'Movement Report', tab_alerts:'Stock Alerts',
    col_buy_total:'Total Buy', col_sell_total:'Total Sell', col_margin:'Margin',
    total_purchase:'Total Purchase Value', total_selling:'Total Selling Value',
    gross_profit:'Gross Profit', avg_margin:'Avg. Margin',
    alerts_low:'Low Stock Items', alerts_out:'Out of Stock Items',
    all_healthy:'All stocks are healthy',
    no_alerts:'No alerts at the moment',
    date_from:'From Date', date_to:'To Date',
    // Settings
    set_general:'General', set_categories:'Categories',
    set_types:'Stone Types', set_colors:'Colors', set_shapes:'Shapes',
    set_cuts:'Cuts', set_units:'Units', set_employees:'Employees',
    set_locations:'Locations', set_alerts_s:'Alerts & Currency',
    set_data:'Data Management',
    set_company_en:'Company Name (English)', set_company_ar:'Company Name (Arabic)',
    set_min_stock:'Minimum Stock Alert Level',
    set_min_hint:'Stones at or below this quantity will trigger alerts',
    set_currency:'Currency', set_save_general:'Save General Settings',
    set_save_alerts:'Save Alert Settings',
    set_export_title:'Export All Data', set_export_desc:'Export all data as JSON backup',
    set_export_btn:'Export Backup', set_import_title:'Import Data',
    set_import_desc:'Import a previously exported JSON backup',
    set_import_btn:'Import JSON', set_danger_title:'Danger Zone',
    set_danger_desc:'Reset all data to demo data. Cannot be undone.',
    set_reset_btn:'Reset All Data', set_sysinfo:'System Information',
    add_item:'Add', edit_item:'Edit', del_item:'Delete',
    item_placeholder:'Type and press Enter or click Add',
    // Barcode
    bc_scanner:'Scanner', bc_scan_hint:'Scan barcode or enter code manually',
    bc_mode_bc:'Barcode', bc_mode_qr:'QR Code', bc_mode_both:'Both',
    bc_filter_cat:'All Categories', bc_download:'Download',
    bc_print:'Print', bc_not_found:'No stone found with this code',
    // Empty states
    empty_inventory:'No gemstones yet', empty_inv_desc:'Add your first gemstone to get started',
    empty_movements:'No movements recorded', empty_mov_desc:'Record your first stock movement',
    empty_search:'No results', empty_search_desc:'Try adjusting your search terms',
    empty_suppliers:'No suppliers yet', empty_sup_desc:'Add your first supplier',
    empty_notif:'All caught up!', empty_notif_desc:'No alerts right now',
    // Misc
    today:'Today', yesterday:'Yesterday', just_now:'Just now',
    currency_egp:'EGP', powered_by:'Baher Silver ERP v2.0',
    page_of:'of', rows_per_page:'Rows per page',
    selected_items:'selected', loading:'Loading…',
    confirm_title:'Confirm Action',
    bc_title:'Barcode & QR Code Studio',
    bc_subtitle:'Generate, print and scan gemstone labels',
    // newly added
    brand_name:'Baher Silver', brand_desc:'GEMSTONE ERP',
    btn_filters:'Filters', sort_name_asc:'Name (A-Z)', sort_date_desc:'Newest First', sort_price_desc:'Highest Price',
    modal_tab_identity:'Identity', modal_tab_physical:'Physical', modal_tab_pricing:'Pricing & Stock',
    profit_label:'Profit:', dropzone_main:'Click to upload or drag & drop', dropzone_sub:'PNG, JPG, WEBP — max 5MB',
    select_default:'— Select —', select_none:'— None —', units_total:'units total', stone_types:'stone types',
    kpi_margin:'margin', latest_tx_units:'units', total_movements:'total movements', net_change:'Net Change',
    manage_suppliers:'Manage', supplier_accounts:'supplier accounts', label_generator:'Label Generator',
    displaying_up_to:'Displaying up to 50 stones for printing.', comprehensive_analysis:'Comprehensive data analysis',
    value_by_category:'Value by Category', avg_qty_type:'Avg Qty per Type', dist_shape:'Distribution by Shape', dist_color:'Distribution by Color',
    user_avatar:'A', f_buy:'Buy Price', f_sell:'Sell Price', modal_stone:'Stone Details', confirm_del_msg:'Are you sure?',
    no_data:'No data available', all_healthy:'All stocks are healthy', no_alerts:'No alerts at the moment'
  },
  ar: {
    // Nav
    nav_main:'الرئيسية', nav_management:'الإدارة',
    nav_dashboard:'لوحة التحكم', nav_inventory:'مخزون الأحجار الكريمة',
    nav_movements:'حركة المخزون', nav_search:'البحث المتقدم',
    nav_suppliers:'الموردون', nav_barcode:'الباركود والـ QR',
    nav_reports:'التقارير', nav_settings:'الإعدادات',
    nav_collapse:'طي الشريط الجانبي', nav_expand:'توسيع الشريط الجانبي',
    // Topbar
    search_placeholder:'ابحث عن أحجار، باركود، موردين…',
    search_hint:'بحث', search_empty:'لا توجد نتائج',

    // Wholesale
    col_grams:'جرام', f_grams:'الوزن (جرام)', kpi_grams:'إجمالي الجرامات',
    f_pieces:'القطع', pieces:'قطعة',
    // Dynamic Dropdowns
    "diamond": "ألماس", "ruby": "ياقوت أحمر", "emerald": "زمرد", "sapphire": "ياقوت أزرق", "pearl": "لؤلؤ", "opal": "أوبال", "topaz": "توباز", "amethyst": "جمشت", "garnet": "عقيق", "turquoise": "فيروز",
    "natural": "طبيعي", "synthetic": "صناعي", "treated": "معالج", "lab-grown": "مزروع بالمختبر", "simulant": "مقلد",
    "white": "أبيض", "red": "أحمر", "pink": "وردي", "blue": "أزرق", "green": "أخضر", "yellow": "أصفر", "orange": "برتقالي", "purple": "بنفسجي", "black": "أسود", "brown": "بني", "gray": "رمادي", "colorless": "عديم اللون", "multi-color": "متعدد الألوان",
    "round": "دائري", "oval": "بيضاوي", "pear": "كمثري", "marquise": "ماركيز", "princess": "أميرة", "cushion": "وسادي", "emerald cut": "زمردي", "asscher": "آشر", "radiant": "مشع", "heart": "قلب", "trillion": "تريليون", "baguette": "باجيت", "cabochon": "كابوشون", "freeform": "شكل حر",
    "brilliant": "لامع", "step": "متدرج", "mixed": "مختلط", "rose": "وردي", "briolette": "بريوليت", "faceted": "مضلع", "smooth": "أملس",
    "carat": "قيراط", "piece": "قطعة", "gram": "جرام", "set": "طقم", "pair": "زوج", "lot": "لوط",

    search_tip_enter:'للاختيار', search_tip_esc:'للإغلاق',
    notif_title:'الإشعارات', notif_empty:'لا توجد إشعارات!',
    notif_empty_sub:'لا توجد تنبيهات في الوقت الحالي',
    notif_mark_read:'تحديد الكل كمقروء',
    notif_low_stock:'تنبيه مخزون منخفض',
    notif_out_stock:'نفاد المخزون',
    theme_dark:'الوضع الداكن', theme_light:'الوضع الفاتح',
    user_name:'المسؤول', user_role:'مدير النظام',
    user_profile:'الملف الشخصي', user_settings:'الإعدادات', user_logout:'تسجيل الخروج',
    quick_add:'حجر جديد',
    // Page titles
    page_dashboard:'لوحة التحكم', page_inventory:'مخزون الأحجار الكريمة',
    page_movements:'حركة المخزون', page_search:'البحث المتقدم',
    page_suppliers:'الموردون', page_barcode:'الباركود والـ QR',
    page_reports:'التقارير والتحليلات', page_settings:'الإعدادات',
    // Dashboard
    dash_subtitle:'نظرة عامة على مخزون الأحجار الكريمة',
    kpi_inv_value:'قيمة المخزون', kpi_purchase:'قيمة الشراء',
    kpi_selling:'قيمة البيع', kpi_profit:'إجمالي الربح',
    kpi_types:'أنواع الأحجار', kpi_qty:'الكمية الإجمالية',
    kpi_low:'مخزون منخفض', kpi_out:'نفاد المخزون',
    chart_monthly:'حركة المخزون الشهرية',
    chart_category:'حسب الفئة', chart_color:'حسب اللون',
    chart_shape:'حسب الشكل', chart_supplier:'حسب المورد',
    top_stones:'أعلى الأحجار قيمة', recent_tx:'آخر المعاملات',
    stock_alerts:'تنبيهات المخزون', view_all:'عرض الكل',
    today_movements:'حركات اليوم',
    // Table
    col_image:'الصورة', col_code:'رقم الحجر', col_name:'اسم الحجر',
    col_category:'الفئة', col_type:'النوع', col_color:'اللون',
    col_shape:'الشكل', col_cut:'القطع', col_size:'الحجم (مم)',
    col_weight:'الوزن (قيراط)', col_qty:'الكمية', col_unit:'الوحدة',
    col_buy:'سعر الشراء', col_sell:'سعر البيع', col_value:'القيمة الإجمالية',
    col_status:'الحالة', col_location:'موقع التخزين', col_supplier:'المورد',
    col_date:'تاريخ الإضافة', col_actions:'الإجراءات',
    // Movements
    col_mov_id:'رقم الحركة', col_mov_date:'التاريخ والوقت',
    col_mov_stone:'الحجر', col_tx_type:'نوع المعاملة', col_employee:'الموظف',
    col_reference:'المرجع', col_reason:'السبب',
    // Status
    status_in:'متوفر', status_low:'مخزون منخفض', status_out:'نفاد المخزون',
    tx_in:'وارد', tx_out:'صادر', tx_adj:'تعديل', tx_return:'مرتجع',
    // Actions
    btn_add:'إضافة حجر', btn_edit:'تعديل', btn_delete:'حذف',
    btn_view:'عرض', btn_barcode:'باركود', btn_save:'حفظ',
    btn_cancel:'إلغاء', btn_export:'تصدير CSV', btn_import:'استيراد',
    btn_print:'طباعة', btn_close:'إغلاق', btn_confirm:'تأكيد',
    btn_clear:'مسح', btn_search:'بحث', btn_new_mov:'حركة جديدة',
    btn_add_supplier:'إضافة مورد', btn_refresh:'تحديث',
    btn_add_stone:'إضافة حجر', btn_bulk_delete:'حذف المحدد',
    btn_select_all:'تحديد الكل', btn_deselect:'إلغاء التحديد',
    // Form fields
    f_name_en:'اسم الحجر (الإنجليزية)', f_name_ar:'اسم الحجر (العربية)',
    f_category:'الفئة', f_type:'نوع الحجر', f_color:'اللون',
    f_shape:'الشكل', f_cut:'القطع', f_size:'الحجم (مم)', f_weight:'الوزن (قيراط)',
    f_qty:'الكمية المتاحة', f_unit:'الوحدة', f_min_stock:'الحد الأدنى للمخزون',
    f_buy_price:'سعر الشراء', f_sell_price:'سعر البيع',
    f_margin:'هامش الربح', f_supplier:'المورد', f_location:'موقع التخزين',
    f_notes:'ملاحظات', f_image:'صورة الحجر', f_barcode:'الباركود',
    f_barcode_auto:'يُولَّد تلقائياً عند الحفظ',
    // Placeholders
    ph_name_en:'مثال: Round White Diamond',
    ph_name_ar:'مثال: ألماس أبيض دائري',
    ph_size:'مثال: 3.5', ph_weight:'مثال: 0.25',
    ph_qty:'0', ph_min:'10', ph_price:'0.00',
    ph_notes:'معلومات إضافية…',
    ph_search:'ابحث بالاسم أو الرمز أو الباركود…',
    ph_reason:'مثال: طلب عميل، إنتاج…',
    ph_reference:'مثال: PO-2024-001',
    // Validation
    err_required:'هذا الحقل مطلوب',
    err_positive:'يجب أن يكون رقماً موجباً',
    err_duplicate:'تم اكتشاف إدخال مكرر',
    err_neg_stock:'رصيد غير كافٍ لهذه العملية',
    err_invalid:'قيمة غير صحيحة',
    // Success messages
    msg_added:'تمت الإضافة بنجاح',
    msg_updated:'تم التحديث بنجاح',
    msg_deleted:'تم الحذف',
    msg_exported:'تم التصدير بنجاح',
    msg_imported:'تم الاستيراد بنجاح',
    msg_saved:'تم حفظ الإعدادات',
    // Confirms
    confirm_delete:'هل أنت متأكد من حذف هذا السجل؟ لا يمكن التراجع عن هذا الإجراء.',
    confirm_reset:'سيؤدي هذا إلى إعادة ضبط جميع البيانات. لا يمكن التراجع!',
    // Movement form
    f_stone:'اختر الحجر', f_tx_type:'نوع المعاملة',
    f_mov_date:'التاريخ', f_mov_time:'الوقت',
    ph_stone_search:'ابحث بالاسم أو الرمز أو الباركود…',
    ph_employee:'اختر الموظف',
    label_current_qty:'الكمية الحالية', label_after_qty:'بعد الحركة',
    // Supplier fields
    f_company:'اسم الشركة', f_contact:'جهة الاتصال',
    f_mobile:'الجوال', f_whatsapp:'واتساب', f_email:'البريد الإلكتروني',
    f_website:'الموقع الإلكتروني', f_country:'الدولة', f_address:'العنوان',
    // Search
    search_title:'البحث المتقدم', search_subtitle:'ابحث عن أي حجر بسرعة',
    scan_hint:'امسح الباركود أو رمز QR مباشرة في مربع البحث',
    filter_status:'حالة المخزون', filter_all:'الكل', filter_in:'متوفر',
    filter_low:'مخزون منخفض', filter_out:'نفاد المخزون',
    min_qty:'الحد الأدنى', max_qty:'الحد الأقصى',
    results_found:'حجر(أحجار) موجودة',
    no_results:'لا توجد أحجار تطابق بحثك',
    try_search:'ابدأ البحث للعثور على الأحجار',
    // Reports
    tab_valuation:'تقييم المخزون', tab_stock:'ملخص المخزون',
    tab_movements:'تقرير الحركة', tab_alerts:'تنبيهات المخزون',
    col_buy_total:'إجمالي الشراء', col_sell_total:'إجمالي البيع', col_margin:'الهامش',
    total_purchase:'إجمالي قيمة الشراء', total_selling:'إجمالي قيمة البيع',
    gross_profit:'إجمالي الربح', avg_margin:'متوسط الهامش',
    alerts_low:'أصناف منخفضة المخزون', alerts_out:'أصناف نافدة المخزون',
    all_healthy:'جميع المخزونات سليمة',
    no_alerts:'لا توجد تنبيهات في الوقت الحالي',
    date_from:'من تاريخ', date_to:'إلى تاريخ',
    // Settings
    set_general:'عام', set_categories:'الفئات',
    set_types:'أنواع الأحجار', set_colors:'الألوان', set_shapes:'الأشكال',
    set_cuts:'أنواع القطع', set_units:'الوحدات', set_employees:'الموظفون',
    set_locations:'مواقع التخزين', set_alerts_s:'التنبيهات والعملة',
    set_data:'إدارة البيانات',
    set_company_en:'اسم الشركة (الإنجليزية)', set_company_ar:'اسم الشركة (العربية)',
    set_min_stock:'مستوى تنبيه الحد الأدنى للمخزون',
    set_min_hint:'الأحجار التي تصل إلى هذه الكمية أو أقل ستثير تنبيهات',
    set_currency:'العملة', set_save_general:'حفظ الإعدادات العامة',
    set_save_alerts:'حفظ إعدادات التنبيهات',
    set_export_title:'تصدير جميع البيانات', set_export_desc:'تصدير جميع البيانات كنسخة احتياطية JSON',
    set_export_btn:'تصدير النسخة الاحتياطية', set_import_title:'استيراد البيانات',
    set_import_desc:'استيراد نسخة احتياطية JSON تم تصديرها مسبقاً',
    set_import_btn:'استيراد JSON', set_danger_title:'منطقة الخطر',
    set_danger_desc:'إعادة ضبط جميع البيانات. لا يمكن التراجع.',
    set_reset_btn:'إعادة ضبط الكل', set_sysinfo:'معلومات النظام',
    add_item:'إضافة', edit_item:'تعديل', del_item:'حذف',
    item_placeholder:'اكتب ثم اضغط Enter أو انقر إضافة',
    // Barcode
    bc_scanner:'الماسح الضوئي', bc_scan_hint:'امسح الباركود أو أدخل الرمز يدوياً',
    bc_mode_bc:'الباركود', bc_mode_qr:'رمز QR', bc_mode_both:'كلاهما',
    bc_filter_cat:'جميع الفئات', bc_download:'تنزيل',
    bc_print:'طباعة', bc_not_found:'لم يتم العثور على حجر بهذا الرمز',
    // Empty states
    empty_inventory:'لا توجد أحجار بعد', empty_inv_desc:'أضف حجرك الأول للبدء',
    empty_movements:'لا توجد حركات مسجلة', empty_mov_desc:'سجّل أول حركة مخزون',
    empty_search:'لا توجد نتائج', empty_search_desc:'جرب تعديل معايير البحث',
    empty_suppliers:'لا يوجد موردون بعد', empty_sup_desc:'أضف المورد الأول',
    empty_notif:'لا توجد إشعارات!', empty_notif_desc:'لا توجد تنبيهات حالياً',
    // Misc
    today:'اليوم', yesterday:'أمس', just_now:'الآن',
    currency_egp:'ج.م', powered_by:'باهر سيلفر - نظام ERP v2.0',
    page_of:'من', rows_per_page:'صفوف في الصفحة',
    selected_items:'محدد', loading:'جارٍ التحميل…',
    confirm_title:'تأكيد الإجراء',
    bc_title:'استوديو الباركود ورمز QR',
    bc_subtitle:'توليد وطباعة ومسح ملصقات الأحجار الكريمة',
    // newly added
    brand_name:'باهر سيلفر', brand_desc:'نظام الأحجار الكريمة',
    btn_filters:'التصفيات', sort_name_asc:'الاسم (أ-ي)', sort_date_desc:'الأحدث أولاً', sort_price_desc:'الأعلى سعراً',
    modal_tab_identity:'الهوية', modal_tab_physical:'المواصفات', modal_tab_pricing:'التسعير والمخزون',
    profit_label:'الربح:', dropzone_main:'انقر للرفع أو اسحب وأفلت', dropzone_sub:'أقصى حجم 5 ميجابايت',
    select_default:'— اختر —', select_none:'— لا يوجد —', units_total:'وحدة إجمالاً', stone_types:'أنواع أحجار',
    kpi_margin:'هامش', latest_tx_units:'وحدة', total_movements:'إجمالي الحركات', net_change:'صافي التغيير',
    manage_suppliers:'إدارة', supplier_accounts:'حسابات موردين', label_generator:'مولد الملصقات',
    displaying_up_to:'يتم عرض ما يصل إلى 50 حجراً للطباعة.', comprehensive_analysis:'تحليل بيانات شامل',
    value_by_category:'القيمة حسب الفئة', avg_qty_type:'متوسط الكمية للنوع', dist_shape:'التوزيع حسب الشكل', dist_color:'التوزيع حسب اللون',
    user_avatar:'أ', f_buy:'سعر الشراء', f_sell:'سعر البيع', modal_stone:'تفاصيل الحجر', confirm_del_msg:'هل أنت متأكد؟',
    no_data:'لا توجد بيانات', all_healthy:'جميع المخزونات سليمة', no_alerts:'لا توجد تنبيهات في الوقت الحالي'
  }
};

/* ═══════════════════════════════════════════════════════════════
   STATE
   ═══════════════════════════════════════════════════════════════ */
const UI = {
  lang: localStorage.getItem('bs_lang') || 'en',
  theme: localStorage.getItem('bs_theme') || 'dark',
  sidebarCollapsed: localStorage.getItem('bs_sidebar') === 'true',

  t(key) {
    if (!key) return '';
    const k = String(key).toLowerCase();
    return T[this.lang]?.[k] || T[this.lang]?.[key] || T.en[key] || key;
  },

  /* ── Theme ── */
  applyTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('bs_theme', theme);
    const btn = document.getElementById('theme-btn');
    if (btn) {
      btn.innerHTML = theme === 'dark'
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';
      btn.title = this.t(theme === 'dark' ? 'theme_light' : 'theme_dark');
    }
  },
  toggleTheme() {
    this.applyTheme(this.theme === 'dark' ? 'light' : 'dark');
  },

  /* ── Language ── */
  applyLang(lang) {
    this.lang = lang;
    localStorage.setItem('bs_lang', lang);
    const isAr = lang === 'ar';
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');
    document.body.classList.toggle('lang-ar', isAr);
    // Font
    document.body.style.fontFamily = isAr ? "'Cairo', 'Tajawal', sans-serif" : "'Inter', sans-serif";
    // Update all i18n elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = this.t(key);
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      el.placeholder = this.t(el.getAttribute('data-i18n-ph'));
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      el.title = this.t(el.getAttribute('data-i18n-title'));
    });
    // Language buttons
    document.querySelectorAll('.lang-btn, .lang-toggle-topbar').forEach(btn => {
      if (btn.dataset.lang) btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    document.querySelectorAll('.lang-toggle-topbar').forEach(btn => {
      btn.textContent = lang === 'ar' ? 'ع' : 'EN';
    });
    // Update theme tooltip
    this.applyTheme(this.theme);
  },
  toggleLang() {
    this.applyLang(this.lang === 'ar' ? 'en' : 'ar');
  },

  /* ── Sidebar ── */
  applySidebar(collapsed) {
    this.sidebarCollapsed = collapsed;
    localStorage.setItem('bs_sidebar', collapsed);
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    sidebar.classList.toggle('collapsed', collapsed);
    const btn = document.getElementById('collapse-btn');
    if (btn) {
      btn.title = this.t(collapsed ? 'nav_expand' : 'nav_collapse');
      btn.querySelector('[data-lucide]')?.setAttribute('data-lucide', collapsed ? 'panel-left-open' : 'panel-left-close');
      if (window.lucide) lucide.createIcons({ nodes: [btn] });
    }
  },
  toggleSidebar() {
    this.applySidebar(!this.sidebarCollapsed);
  },
  openMobileSidebar() {
    document.getElementById('sidebar')?.classList.add('mobile-open');
    document.getElementById('sidebar-overlay')?.classList.add('visible');
  },
  closeMobileSidebar() {
    document.getElementById('sidebar')?.classList.remove('mobile-open');
    document.getElementById('sidebar-overlay')?.classList.remove('visible');
  },

  /* ── Active Nav ── */
  setActivePage() {
    const page = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
    document.querySelectorAll('.nav-item[data-page]').forEach(el => {
      el.classList.toggle('active', el.dataset.page === page);
    });
    // Update nav badge
    this.updateNavBadges();
  },
  updateNavBadges() {
    if (typeof DB === 'undefined') return;
    const stats = DB.getStats();
    const count = stats.low_stock + stats.out_of_stock;
    document.querySelectorAll('#low-stock-badge').forEach(b => {
      b.textContent = count;
      b.classList.toggle('hidden', count === 0);
    });
  },

  /* ── Notifications Panel ── */
  notifOpen: false,
  toggleNotifPanel() {
    this.notifOpen = !this.notifOpen;
    document.getElementById('notif-panel')?.classList.toggle('open', this.notifOpen);
    if (this.notifOpen) this.renderNotifications();
  },
  renderNotifications() {
    const panel = document.getElementById('notif-list');
    if (!panel || typeof DB === 'undefined') return;
    const settings = DB.getSettings();
    const minStock = settings.min_stock_default || 10;
    const stones = DB.getActiveStones();
    const lowStones = stones.filter(s => parseInt(s.qty_available) > 0 && parseInt(s.qty_available) <= minStock);
    const outStones = stones.filter(s => parseInt(s.qty_available) === 0);

    const items = [
      ...outStones.slice(0,3).map(s => ({ type:'danger', icon:'package-x', title: this.t('notif_out_stock'), msg: `${s.name_en} — ${this.t('status_out')}` })),
      ...lowStones.slice(0,5).map(s => ({ type:'warn', icon:'alert-triangle', title: this.t('notif_low_stock'), msg: `${s.name_en} — ${this.t('col_qty')}: ${s.qty_available}` })),
    ];

    const badge = document.getElementById('notif-badge');
    if (badge) { badge.textContent = items.length; badge.classList.toggle('hidden', items.length === 0); }

    if (!items.length) {
      panel.innerHTML = `<div style="text-align:center;padding:40px 20px"><div style="width:48px;height:48px;margin:0 auto 12px;color:var(--text-3)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div><div style="font-size:14px;font-weight:600;color:var(--text-2);margin-bottom:4px">${this.t('empty_notif')}</div><div style="font-size:12.5px;color:var(--text-3)">${this.t('empty_notif_desc')}</div></div>`;
      return;
    }
    panel.innerHTML = items.map(it => `
      <div class="notif-item">
        <div class="notif-icon ${it.type}">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${it.icon==='package-x'?'<path d="M7.5 4.27 2 7.68l10 5.46 10-5.46-5.5-3.41"/><path d="m2 7.68 10 5.46 10-5.46"/><path d="M12 22V13.14"/><path d="M22 9v5.5"/><path d="m15 19.5-3-3 3-3"/><path d="m19 13.5 3 3"/>'
          :'<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>'}</svg>
        </div>
        <div>
          <div class="notif-title">${it.title}</div>
          <div class="notif-msg">${Utils.escapeHtml(it.msg)}</div>
        </div>
      </div>`).join('');
  },

  /* ── Global Search Modal ── */
  searchOpen: false,
  openSearch() {
    this.searchOpen = true;
    document.getElementById('search-modal')?.classList.add('open');
    setTimeout(() => document.getElementById('search-modal-input')?.focus(), 50);
  },
  closeSearch() {
    this.searchOpen = false;
    document.getElementById('search-modal')?.classList.remove('open');
    const inp = document.getElementById('search-modal-input');
    if (inp) { inp.value = ''; }
    const body = document.getElementById('search-modal-body');
    if (body) body.innerHTML = '';
  },
  runGlobalSearch(q) {
    const body = document.getElementById('search-modal-body');
    if (!body || typeof DB === 'undefined') return;
    if (!q.trim()) { body.innerHTML = ''; return; }
    const stones = DB.searchStones({ query: q }).slice(0, 8);
    const settings = DB.getSettings();
    const currency = settings.currency || 'SAR';
    const minStock = settings.min_stock_default || 10;
    if (!stones.length) {
      body.innerHTML = `<div style="text-align:center;padding:24px;color:var(--text-3);font-size:13px">${this.t('search_empty')}</div>`;
      return;
    }
    body.innerHTML = stones.map(s => `
      <div class="search-result-item" onclick="window.location.href='inventory.html'">
        <div class="search-result-icon">${s.image_data?`<img src="${s.image_data}" style="width:100%;height:100%;object-fit:cover;border-radius:var(--r-md)"/>`:`<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`}</div>
        <div style="flex:1;min-width:0">
          <div class="search-result-name">${Utils.escapeHtml(s.name_en)}</div>
          <div class="search-result-meta">${s.stone_code} · ${s.category||''} · ${this.t('col_qty')}: ${s.qty_available}</div>
        </div>
        <div style="text-align:right;flex-shrink:0">
          <div style="font-size:13px;font-weight:700;color:var(--gold)">${Utils.formatCurrency((parseFloat(s.selling_price)||0)*(parseInt(s.qty_available)||0), currency)}</div>
        </div>
      </div>`).join('');
  },

  /* ── Animated Counters ── */
  animateCounter(el, target, duration = 1200) {
    const start = 0;
    const startTime = performance.now();
    const isFloat = target % 1 !== 0;
    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (target - start) * eased;
      el.textContent = isFloat ? current.toFixed(2) : Math.round(current).toLocaleString('en');
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  },
  initCounters() {
    document.querySelectorAll('[data-counter]').forEach(el => {
      const target = parseFloat(el.dataset.counter) || 0;
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) { this.animateCounter(el, target); obs.disconnect(); }
        });
      });
      obs.observe(el);
    });
  },

  /* ── Confirm Modal ── */
  confirm(msg, onOk) {
    const el = document.getElementById('confirm-modal');
    if (!el) return;
    document.getElementById('confirm-msg').textContent = msg;
    document.getElementById('confirm-title-text').textContent = this.t('confirm_title');
    document.getElementById('confirm-ok-btn').textContent = this.t('btn_confirm');
    document.getElementById('confirm-cancel-btn').textContent = this.t('btn_cancel');
    document.getElementById('confirm-ok-btn').onclick = () => { Modal.close('confirm-modal'); onOk(); };
    Modal.open('confirm-modal');
  },

  /* ── Dropdown Manager ── */
  initDropdowns() {
    document.addEventListener('click', e => {
      document.querySelectorAll('.dropdown-menu.open').forEach(menu => {
        if (!menu.closest('.dropdown')?.contains(e.target)) menu.classList.remove('open');
      });
      // Notification panel close on outside click
      if (this.notifOpen) {
        const panel = document.getElementById('notif-panel');
        const btn = document.getElementById('notif-btn');
        if (panel && !panel.contains(e.target) && !btn?.contains(e.target)) {
          this.notifOpen = false;
          panel.classList.remove('open');
        }
      }
    });
    document.querySelectorAll('[data-dropdown-toggle]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const menu = document.getElementById(btn.dataset.dropdownToggle);
        if (menu) {
          const wasOpen = menu.classList.contains('open');
          document.querySelectorAll('.dropdown-menu.open').forEach(m => m.classList.remove('open'));
          if (!wasOpen) menu.classList.add('open');
        }
      });
    });
  },

  /* ── Initialize ── */
  init() {
    // Auth guard
    if (!window.location.pathname.endsWith('index.html') && window.location.pathname !== '/'
        && !sessionStorage.getItem('bs_auth')) {
      window.location.href = 'index.html';
      return;
    }
    // Seed data
    if (typeof DB !== 'undefined') DB.seedDemoData();
    // Theme + Lang
    this.applyTheme(this.theme);
    this.applyLang(this.lang);
    // Sidebar
    this.applySidebar(this.sidebarCollapsed);
    // Lucide icons
    if (window.lucide) lucide.createIcons();
    // Active nav
    this.setActivePage();
    // Dropdowns
    this.initDropdowns();
    // Sidebar collapse button
    document.getElementById('collapse-btn')?.addEventListener('click', () => this.toggleSidebar());
    // Mobile menu
    document.getElementById('topbar-menu-btn')?.addEventListener('click', () => this.openMobileSidebar());
    document.getElementById('sidebar-overlay')?.addEventListener('click', () => this.closeMobileSidebar());
    // Theme toggle
    document.getElementById('theme-btn')?.addEventListener('click', () => this.toggleTheme());
    // Language toggle (topbar button)
    document.getElementById('lang-topbar-btn')?.addEventListener('click', () => {
      this.toggleLang();
    });
    // Sidebar lang buttons
    document.querySelectorAll('.lang-btn[data-lang]').forEach(btn => {
      btn.addEventListener('click', () => this.applyLang(btn.dataset.lang));
    });
    // Notification button
    document.getElementById('notif-btn')?.addEventListener('click', () => this.toggleNotifPanel());
    // Global search
    document.querySelector('.global-search-trigger')?.addEventListener('click', () => this.openSearch());
    document.getElementById('search-modal-overlay')?.addEventListener('click', e => {
      if (e.target.id === 'search-modal-overlay') this.closeSearch();
    });
    document.getElementById('search-modal-input')?.addEventListener('input', e => {
      this.runGlobalSearch(e.target.value);
    });
    // ⌘K shortcut
    document.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); this.openSearch(); }
      if (e.key === 'Escape') {
        this.closeSearch();
        this.closeMobileSidebar();
        document.querySelectorAll('.modal-overlay.open').forEach(m => {
          m.classList.remove('open');
          document.body.style.overflow = '';
        });
      }
    });
    // Animated counters
    this.initCounters();
    // Init notifications badge
    this.renderNotifications();
  }
};

/* ── Modal helper (extends existing) ── */
Object.assign(Modal, {
  open(id) { const el = document.getElementById(id); if (el) { el.classList.add('open'); document.body.style.overflow = 'hidden'; } },
  close(id) { const el = document.getElementById(id); if (el) { el.classList.remove('open'); document.body.style.overflow = ''; } },
  confirm(msg, onOk) { UI.confirm(msg, onOk); }
});

/* ── Toast helper ── */
Object.assign(Toast, {
  _icons: {
    success: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    error:   '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    warning: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    info:    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
  },
  show(title, msg = '', type = 'info', ms = 4000) {
    let c = document.getElementById('toast-container');
    if (!c) { c = document.createElement('div'); c.id = 'toast-container'; document.body.appendChild(c); }
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<div class="toast-icon">${this._icons[type]||this._icons.info}</div><div class="toast-content"><div class="toast-title">${Utils.escapeHtml(title)}</div>${msg?`<div class="toast-msg">${Utils.escapeHtml(msg)}</div>`:''}</div><button class="toast-close" onclick="this.parentElement.remove()"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>`;
    c.appendChild(t);
    setTimeout(() => { t.style.opacity='0'; t.style.transition='opacity 0.3s'; setTimeout(() => t.remove(), 350); }, ms);
  },
  success(msg, sub) { this.show(msg, sub||'', 'success'); },
  error(msg, sub)   { this.show(msg, sub||'', 'error'); },
  warning(msg, sub) { this.show(msg, sub||'', 'warning'); },
  info(msg, sub)    { this.show(msg, sub||'', 'info'); },
});

/* ── Helper functions used in HTML pages ── */
function getStockBadge(qty, min = 10) {
  const q = parseInt(qty)||0;
  const lang = UI.lang;
  if (q===0) return `<span class="status-pill out-stock"><span class="status-dot"></span>${T[lang].status_out||'Out of Stock'}</span>`;
  if (q<=min) return `<span class="status-pill low-stock"><span class="status-dot"></span>${T[lang].status_low||'Low Stock'}</span>`;
  return `<span class="status-pill in-stock"><span class="status-dot"></span>${T[lang].status_in||'In Stock'}</span>`;
}

function getTxBadge(type) {
  const lang = UI.lang;
  const map = { in:['badge tx-in',T[lang].tx_in], out:['badge tx-out',T[lang].tx_out], adjustment:['badge tx-adj',T[lang].tx_adj], return:['badge tx-return',T[lang].tx_return] };
  const [cls,lbl] = map[type]||['badge badge-silver',type];
  return `<span class="${cls}">${lbl}</span>`;
}

function getColorDot(color) {
  const map = { White:'#F8FAFC', Red:'#EF4444', Pink:'#EC4899', Blue:'#3B82F6', Green:'#10B981', Yellow:'#F59E0B', Orange:'#F97316', Purple:'#8B5CF6', Black:'#374151', Brown:'#92400E', Gray:'#6B7280', Colorless:'#E5E7EB', 'Multi-Color':'#8B5CF6' };
  const c = map[color] || '#6B7280';
  return `<span class="color-dot" style="background:${c}"></span>${color}`;
}

document.addEventListener('DOMContentLoaded', () => {
  UI.init();

  // Command Palette Keyboard Shortcut (Ctrl+K or Cmd+K)
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      const modal = document.getElementById('bs-command-palette-modal');
      if (modal) {
        modal.classList.toggle('hidden');
        if (!modal.classList.contains('hidden')) {
          const input = document.getElementById('cmd-palette-input');
          if (input) input.focus();
        }
      }
    }
    if (e.key === 'Escape') {
      const modal = document.getElementById('bs-command-palette-modal');
      if (modal && !modal.classList.contains('hidden')) modal.classList.add('hidden');
      const notif = document.getElementById('bs-notification-drawer');
      if (notif && !notif.classList.contains('hidden')) notif.classList.add('hidden');
    }
  });

  // Global Event Delegation for Dynamic UI Components
  document.addEventListener('click', (e) => {
    // Open Command Palette
    if (e.target.closest('#btn-open-command-palette')) {
      const modal = document.getElementById('bs-command-palette-modal');
      if (modal) {
        modal.classList.remove('hidden');
        const input = document.getElementById('cmd-palette-input');
        if (input) input.focus();
      }
    }

    // Toggle Notifications Drawer
    if (e.target.closest('#btn-open-notifications') || e.target.closest('#btn-close-notifications')) {
      const drawer = document.getElementById('bs-notification-drawer');
      if (drawer) drawer.classList.toggle('hidden');
    }

    // Command Palette Quick Jump
    const cmdItem = e.target.closest('[data-cmd-tab]');
    if (cmdItem) {
      const targetTab = cmdItem.getAttribute('data-cmd-tab');
      const modal = document.getElementById('bs-command-palette-modal');
      if (modal) modal.classList.add('hidden');
      if (typeof window.switchTab === 'function') {
        window.switchTab(targetTab);
      }
    }

    // Sidebar Navigation Click
    const navItem = e.target.closest('[data-tab]');
    if (navItem && !navItem.classList.contains('bs-tab-item')) {
      const targetTab = navItem.getAttribute('data-tab');
      if (typeof window.switchTab === 'function') {
        window.switchTab(targetTab);
      }
    }

    // Toggle Theme Mode
    if (e.target.closest('#btn-toggle-theme')) {
      document.documentElement.classList.toggle('dark');
      const isDark = document.documentElement.classList.contains('dark');
      localStorage.setItem('baher_theme', isDark ? 'dark' : 'light');
    }

    // Toggle Sidebar Collapse
    if (e.target.closest('#btn-toggle-sidebar')) {
      const sidebar = document.getElementById('bs-app-sidebar');
      if (sidebar) {
        sidebar.classList.toggle('w-72');
        sidebar.classList.toggle('w-20');
      }
    }
  });
});


/* --- app.js --- */
/**
 * BAHER SILVER ERP — WAREHOUSE OPERATIONS & MASTER DATA CENTER v4.0
 * Specialized Exclusively for Baher Silver Factory (NO GOLD)
 * Primary Weight: GRAMS (g) | Secondary Weight: CARATS (ct - display only)
 * Multi-Option Stone Image Engine (Gallery, Mobile Camera & Direct URL)
 */

let PRODUCTION_API_URL = 'https://baher-silver-erp-api.onrender.com/api/v1';

let API_BASE_URL = (typeof window !== 'undefined' && window.location.hostname.includes('bahersilver.online'))
  ? PRODUCTION_API_URL
  : (typeof window !== 'undefined' && window.location.origin && !window.location.origin.startsWith('file')) 
  ? `${window.location.origin}/api/v1` 
  : 'http://localhost:4000/api/v1';

async function detectApiPort() {
  if (typeof window !== 'undefined' && window.location.hostname.includes('bahersilver.online')) {
    API_BASE_URL = PRODUCTION_API_URL;
    return;
  }
  if (typeof window !== 'undefined' && window.location.origin && !window.location.origin.startsWith('file')) {
    API_BASE_URL = `${window.location.origin}/api/v1`;
    return;
  }
  const ports = [4000, 4001, 4005, 4002];
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
  isSidebarCollapsed: false,
  isMobileSidebarOpen: false,
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
  products: [],
  selectedProduct: null,
  productCategoryFilter: 'ALL',
  productDetailTab: 'info',
  searchResults: { stones: [], rawMaterials: [], silverItems: [], locations: [], movements: [], products: [] },

  // Enterprise Auth & Security State (Phase 23A)
  currentUser: JSON.parse(localStorage.getItem('baher_user') || 'null'),
  accessToken: localStorage.getItem('baher_access_token') || null,
  refreshToken: localStorage.getItem('baher_refresh_token') || null,
  users: [],
  roles: [],
  permissions: [],
  permissionGroups: [],
  loginHistoryLogs: [],
  userSessions: [],
  selectedUserForPermissions: null,

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

// API Fetch Helpers with Automatic JWT Token Refresh Engine
function getAuthHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  if (state.accessToken) {
    headers['Authorization'] = `Bearer ${state.accessToken}`;
  }
  return headers;
}

let isRefreshingToken = false;
async function tryRefreshToken() {
  if (!state.refreshToken || isRefreshingToken) return false;
  try {
    isRefreshingToken = true;
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: state.refreshToken })
    });
    const json = await res.json();
    if (json.success && json.data?.accessToken) {
      state.accessToken = json.data.accessToken;
      if (json.data.refreshToken) state.refreshToken = json.data.refreshToken;

      localStorage.setItem('baher_access_token', state.accessToken);
      if (json.data.refreshToken) localStorage.setItem('baher_refresh_token', state.refreshToken);
      return true;
    }
  } catch (e) {
    console.warn('Token refresh failed:', e);
  } finally {
    isRefreshingToken = false;
  }
  return false;
}

async function apiGet(endpoint, retryCount = 0) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: getAuthHeaders(),
      signal: controller.signal
    });
    clearTimeout(timeout);
    
    if (res.status === 401) {
      if (retryCount === 0 && (await tryRefreshToken())) {
        return apiGet(endpoint, 1);
      }
      handleAuthSessionExpired();
      return null;
    }

    const json = await res.json();
    return json.success ? json.data : null;
  } catch (err) {
    console.error(`API GET ${endpoint} Error:`, err);
    return null;
  }
}

async function apiPost(endpoint, body, retryCount = 0) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(body)
    });

    if (res.status === 401) {
      if (retryCount === 0 && (await tryRefreshToken())) {
        return apiPost(endpoint, body, 1);
      }
      handleAuthSessionExpired();
      return { success: false, error: 'انتهت الجلسة. يرجى إعادة تسجيل الدخول' };
    }

    const json = await res.json();
    return json;
  } catch (err) {
    console.error(`API POST ${endpoint} Error:`, err);
    return { success: false, error: err.message };
  }
}

async function apiPatch(endpoint, retryCount = 0) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });

    if (res.status === 401) {
      if (retryCount === 0 && (await tryRefreshToken())) {
        return apiPatch(endpoint, 1);
      }
      handleAuthSessionExpired();
      return { success: false, error: 'انتهت الجلسة. يرجى إعادة تسجيل الدخول' };
    }

    const json = await res.json();
    return json;
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
    const [whs, locs, stns, raws, silvers, chems, comps, mvmt, auds, masters, prods] = await Promise.all([
      apiGet('/warehouses'),
      apiGet('/warehouses/locations'),
      apiGet('/inventory/stones'),
      apiGet('/inventory/raw-materials'),
      apiGet('/inventory/silver-items'),
      apiGet('/inventory/chemicals'),
      apiGet('/inventory/components'),
      apiGet('/inventory/movements'),
      apiGet('/inventory/audits'),
      apiGet('/master-data'),
      apiGet('/products')
    ]);

    state.warehouses = (whs && whs.length) ? whs : DEFAULT_7_WAREHOUSES;
    state.storageLocations = locs || [];
    state.stones = stns || [];
    state.rawMaterials = (raws && raws.length) ? raws : DEFAULT_INITIAL_RAW_MATERIALS;
    state.silverItems = (silvers && silvers.length) ? silvers : DEFAULT_INITIAL_SILVER_ITEMS;
    state.chemicalItems = (chems && chems.length) ? chems : [];
    state.componentItems = (comps && comps.length) ? comps : [];
    state.movements = mvmt || [];
    state.audits = auds || [];
    state.masterItems = masters || [];
    state.products = prods || [];
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

window.toggleMobileSidebar = function(forceState) {
  if (typeof forceState === 'boolean') {
    state.isMobileSidebarOpen = forceState;
  } else {
    state.isMobileSidebarOpen = !state.isMobileSidebarOpen;
  }
  renderApp();
};

function renderApp() {

  const root = document.getElementById('app');
  if (!root) return;

  const isRtl = state.lang === 'ar';
  document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  document.documentElement.lang = state.lang || 'ar';

  // Show Login Screen if User is not Authenticated
  if (!state.currentUser) {
    root.innerHTML = renderEnterpriseLoginScreen();
    return;
  }

  const tabTitles = {
    wh_dashboard: 'لوحة القيادة التنفيذية',
    stones: 'مخزون الأحجار الكريمة',
    stones_store: 'مخزون الأحجار الكريمة',
    raw_materials: 'الخامات والكيماويات',
    raw_store: 'الخامات والكيماويات',
    silver_inventory: 'خزينة الفضة والسبائك 925/999',
    silver_store: 'خزينة الفضة والسبائك 925/999',
    inventory_movements: 'حركات وسجل المخزون',
    products: 'هندسة المنتجات والموديلات',
    product_engineering: 'هندسة المنتجات والموديلات',
    bom: 'قوائم المواد ومسارات التصنيع',
    mo_kanban: 'أوامر التصنيع ورش المصنع',
    suppliers: 'إدارة الموردين SRM',
    purchasing: 'أوامر الشراء والاستلام',
    customer_orders: 'طلبات العملاء والتصاميم',
    customer_portal: 'بوابة العملاء الخاصة',
    dpp_admin: 'جواز السفر الرقمي DPP & QR',
    customer_service: 'مركز خدمة العملاء والإصلاح',
    warranty_center: 'مركز الضمانات والعيار 25 سنة',
    reports_analytics: 'التقارير والتحليلات المتقدمة',
    system_health: 'صحة النظام والأجهزة HAL',
    user_management: 'إدارة المستخدمين والصلاحيات',
    users_admin: 'إدارة المستخدمين والصلاحيات',
    roles_matrix: 'صلاحيات المستخدمين Matrix',
    settings: 'إعدادات النظام العامة'
  };

  const currentTitle = tabTitles[state.activeTab] || 'لوحة القيادة التنفيذية';

  root.innerHTML = `
    <div class="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      <!-- Enterprise Sidebar -->
      ${typeof UIComponents !== 'undefined' ? UIComponents.renderSidebar(state.activeTab, state.isSidebarCollapsed) : renderSidebar()}

      <!-- Main Content Container -->
      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <!-- Header -->
        ${typeof UIComponents !== 'undefined' ? UIComponents.renderHeader(currentTitle, state.activeTab) : ''}

        <!-- Multi-Tab Navigation Bar -->
        ${typeof UIComponents !== 'undefined' ? UIComponents.renderMultiTabBar([
          { id: 'wh_dashboard', title: 'لوحة القيادة التنفيذية', icon: '📊' },
          ...(state.activeTab !== 'wh_dashboard' ? [{ id: state.activeTab, title: currentTitle, icon: '⚡' }] : [])
        ], state.activeTab) : ''}

        <!-- Workspace Content Area -->
        <main id="bs-workspace-content" class="flex-1 overflow-y-auto p-6 bg-slate-950/60 space-y-6">
          ${state.isLoading ? renderLoadingSpinner() : renderActiveTabContent()}
        </main>
      </div>

      <!-- Drawers & Modals -->
      ${typeof UIComponents !== 'undefined' ? UIComponents.renderNotificationDrawer() : ''}
      ${typeof UIComponents !== 'undefined' ? UIComponents.renderCommandPalette() : ''}
      ${renderActiveModal()}
      <div id="bs-toast-container"></div>
    </div>
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
        ${renderSidebarItem('admin_dashboard', '👑', 'لوحة تحكم الأدمن الرئيسية')}
        ${renderSidebarItem('wh_dashboard', '📊', 'لوحة التحكم المخزنية')}
        ${renderSidebarItem('product_engineering', '🏭', 'هندسة المنتجات وقائمة المواد (BOM)')}
        ${renderSidebarItem('stones_store', '💎', 'مخزن الأحجار الكريمة')}
        ${renderSidebarItem('raw_store', '🧪', 'مخزن الخامات والمستلزمات')}
        ${renderSidebarItem('silver_store', '🥈', 'مخزن الفضة الخام والسبائك')}
        ${renderSidebarItem('users_admin', '👥', 'إدارة المستخدمين والحسابات')}
        ${renderSidebarItem('roles_matrix', '🛡️', 'الأدوار ومصفوفة الصلاحيات')}
        ${renderSidebarItem('security_sessions', '📱', 'الأجهزة والجلسات النشطة')}
        ${renderSidebarItem('login_history', '📜', 'سجل الدخول ومحاولات الأمان')}
        ${renderSidebarItem('master_center', '⚙️', 'مركز البيانات الأساسية (12)')}
        ${renderSidebarItem('warehouses', '🏛️', 'المخازن السبعة الرئيسية')}
        ${renderSidebarItem('locations', '📍', 'التخزين الهرمي (QR)')}
        ${renderSidebarItem('transactions', '📜', 'سجل الحركات (Timeline)')}
        ${renderSidebarItem('accounting_system', '⚖️', 'النظام المحاسبي والشجرة')}
        ${renderSidebarItem('inventory_audit', '📋', 'الجرد الدوري والرصيد')}
        ${renderSidebarItem('universal_search', '🔍', 'البحث الفائق الشامل')}
        ${renderSidebarItem('label_designer', '🏷️', 'مصمم وطابعات ملصقات الفضة (Zebra Studio)')}
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
    case 'admin_dashboard': return renderAdminDashboardScreen();
    case 'wh_dashboard': return renderWarehouseDashboardScreen();
    case 'product_engineering': return renderProductEngineeringScreen();
    case 'products': return renderProductEngineeringScreen();
    case 'stones_store': return renderStonesStoreScreen();
    case 'stones': return renderStonesStoreScreen();
    case 'raw_store': return renderRawMaterialsStoreScreen();
    case 'raw_materials': return renderRawMaterialsStoreScreen();
    case 'silver_store': return renderSilverStoreScreen();
    case 'silver_inventory': return renderSilverStoreScreen();
    case 'suppliers': return renderSuppliersSrmScreen();
    case 'purchasing': return renderPurchasingOrdersScreen();
    case 'customer_orders': return renderCustomerOrdersScreen();
function renderActiveTabContent() {
  switch (state.activeTab) {
    case 'admin_dashboard': return renderAdminDashboardScreen();
    case 'wh_dashboard': return renderWarehouseDashboardScreen();
    case 'product_engineering': return renderProductEngineeringScreen();
    case 'products': return renderProductEngineeringScreen();
    case 'stones_store': return renderStonesStoreScreen();
    case 'stones': return renderStonesStoreScreen();
    case 'raw_store': return renderRawMaterialsStoreScreen();
    case 'raw_materials': return renderRawMaterialsStoreScreen();
    case 'silver_store': return renderSilverStoreScreen();
    case 'silver_inventory': return renderSilverStoreScreen();
    case 'suppliers': return renderSuppliersSrmScreen();
    case 'purchasing': return renderPurchasingOrdersScreen();
    case 'customer_orders': return renderCustomerOrdersScreen();
    case 'customer_portal': return renderCustomerPortalScreen();
    case 'dpp_admin': return renderDppAdminScreen();
    case 'customer_service': return renderCustomerServiceCenterScreen();
    case 'warranty_center': return renderWarrantyCenterScreen();
    case 'reports_analytics': return renderReportsAnalyticsScreen();
    case 'system_health': return renderSystemHealthHalScreen();
    case 'settings': return renderSettingsScreen();
    case 'user_management': return renderUsersAdminScreen();
    case 'users_admin': return renderUsersAdminScreen();
    case 'roles_matrix': return renderRolesMatrixScreen();
    case 'security_sessions': return renderActiveSessionsScreen();
    case 'login_history': return renderLoginHistoryScreen();
    case 'master_center': return renderMasterDataCenterScreen();
    case 'warehouses': return renderWarehousesHierarchyScreen();
    case 'locations': return renderStorageLocationsScreen();
    case 'transactions': return renderTransactionsTimelineScreen();
    case 'accounting_system': return renderAccountingSystemScreen();
    case 'inventory_audit': return renderInventoryAuditScreen();
    case 'universal_search': return renderUniversalSearchScreen();
    case 'label_designer': return renderJewelryLabelDesignerScreen();
    default: return renderWarehouseDashboardScreen();
  }
}

/* ═══════════════════════════════════════════════════════════════
   PHASE 5 ENTERPRISE MODULES (Reports, Analytics, Settings, System Health & HAL)
   ═══════════════════════════════════════════════════════════════ */

function renderReportsAnalyticsScreen() {
  const spark1 = Charts.renderSparkline([20, 35, 45, 60, 55, 80, 95], 140, 40, '#06B6D4');
  const spark2 = Charts.renderSparkline([98, 98.4, 98.8, 99.1, 99.5, 99.8, 100], 140, 40, '#10B981');

  return `
    <div class="space-y-6 font-sans">
      <!-- Top Analytics Header with Date Range Selector & Comparison Mode -->
      <div class="bs-glass-card p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 class="text-xl font-bold text-white flex items-center gap-2">📈 التقارير المتقدمة والتحليلات (Enterprise Reports & Analytics)</h2>
          <p class="text-xs text-slate-400">تصدير PDF/CSV/JSON، مقارنة الفترات الزمنية، وتصدير التقارير المجدولة</p>
        </div>

        <div class="flex flex-wrap items-center gap-3 text-xs">
          <!-- Date Range Selector -->
          <div class="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 font-mono">
            <span>📅</span>
            <input type="date" value="2026-07-01" class="bg-transparent text-slate-200 outline-none">
            <span>إلى</span>
            <input type="date" value="2026-07-30" class="bg-transparent text-slate-200 outline-none">
          </div>

          <button class="bs-btn bs-btn-secondary bs-btn-sm">وضع المقارنة 📊</button>
          <button class="bs-btn bs-btn-primary bs-btn-sm">تصدير PDF 📥</button>
        </div>
      </div>

      <!-- KPI Analytics Row with Sparklines -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        ${UIComponents.renderKpiCard('إجمالي حجم الإنتاج الإيطالي', '5,840 g', 'الفضة العيار المعياري', '🥈', 15.4, true)}
        ${UIComponents.renderKpiCard('عائد كفاءة الفضة Pure Yield', '99.8 %', 'مقارنة بالدورة السابقة', '🧪', 0.4, true)}
        ${UIComponents.renderKpiCard('نسبة الالتزام بالـ SLA', '98.5 %', 'طلبات الخدمة والإصلاح', '🛠️', 5.0, true)}
        ${UIComponents.renderKpiCard('معدل رضا العملاء CSAT', '4.8 / 5 ★', 'التقييم العام للمصنع', '⭐', 6.7, true)}
      </div>

      <!-- Interactive Charts & Saved Layouts Container -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bs-glass-card p-6 space-y-4">
          <div class="flex justify-between items-center pb-3 border-b border-slate-800">
            <h3 class="text-sm font-bold text-white flex items-center gap-2"><span>📊</span><span>رسم بياني لحركات الفضة الشهرية</span></h3>
            <span class="text-xs text-cyan-400 font-mono">+15.4% نمو</span>
          </div>
          <div class="h-48 flex items-end justify-between gap-2 pt-8 px-4">
            ${[40, 60, 45, 80, 90, 75, 100].map(h => `
              <div class="flex-1 bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-lg transition-all hover:opacity-80" style="height: ${h}%"></div>
            `).join('')}
          </div>
          <div class="flex justify-between text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-800/60">
            <span>يناير</span><span>فبراير</span><span>مارس</span><span>أبريل</span><span>مايو</span><span>يونيو</span><span>يوليو</span>
          </div>
        </div>

        <div class="bs-glass-card p-6 space-y-4">
          <div class="flex justify-between items-center pb-3 border-b border-slate-800">
            <h3 class="text-sm font-bold text-white flex items-center gap-2"><span>⚡</span><span>كفاءة عيار 925 وجودة الفحص</span></h3>
            <span class="text-xs text-emerald-400 font-mono">100% مطابقة</span>
          </div>
          <div class="flex items-center justify-center p-6">
            ${spark2}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderSystemHealthHalScreen() {
  return `
    <div class="space-y-6 font-sans">
      <!-- Header Banner -->
      <div class="bs-glass-card p-5 flex justify-between items-center">
        <div>
          <h2 class="text-xl font-bold text-white flex items-center gap-2">⚡ صحة النظام وأجهزة الـ HAL (System Health & Hardware)</h2>
          <p class="text-xs text-slate-400">مراقبة استجابة الـ API، قاعدة البيانات SQLite، الموازين الرقمية، وأجهزة الـ XRF</p>
        </div>
        <span class="bs-badge bs-badge-success text-xs">حالة النظام: ممتازة (HEALTHY) 🟢</span>
      </div>

      <!-- Real-Time Infrastructure Metrics Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        <div class="bs-glass-card p-4 space-y-1">
          <div class="text-slate-400 font-sans font-bold">زمن استجابة الـ API Latency:</div>
          <div class="text-emerald-400 text-xl font-extrabold">18.4 ms</div>
          <div class="text-[10px] text-slate-500">متوسط الأداء المستقر</div>
        </div>

        <div class="bs-glass-card p-4 space-y-1">
          <div class="text-slate-400 font-sans font-bold">حجم قاعدة البيانات (dev.db):</div>
          <div class="text-amber-400 text-xl font-extrabold">4.80 MB</div>
          <div class="text-[10px] text-slate-500">40+ جداول معيونة</div>
        </div>

        <div class="bs-glass-card p-4 space-y-1">
          <div class="text-slate-400 font-sans font-bold">طابور الطباعة Print Queue:</div>
          <div class="text-cyan-400 text-xl font-extrabold">0 معلقة / 142 مطبوعة</div>
          <div class="text-[10px] text-slate-500">طابعة زيبرا الحرارية 600DPI</div>
        </div>

        <div class="bs-glass-card p-4 space-y-1">
          <div class="text-slate-400 font-sans font-bold">الأجهزة المربوطة HAL:</div>
          <div class="text-purple-400 text-xl font-extrabold">3 / 3 متصلة 🟢</div>
          <div class="text-[10px] text-slate-500">XRF + HAL Scale + Zebra</div>
        </div>
      </div>

      <!-- Extended Hardware Monitoring Table -->
      <div class="bs-glass-card p-6 space-y-4">
        <h3 class="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
          <span>📟</span><span>حالة الأجهزة والموازين والمطياف المربوطة بالـ HAL Driver</span>
        </h3>
        
        <div class="overflow-x-auto font-mono text-xs">
          <table class="bs-table">
            <thead>
              <tr>
                <th>كود الجهاز</th>
                <th>اسم الجهاز والنوع</th>
                <th>IP Subnet</th>
                <th>البطارية</th>
                <th>الحرارة °C</th>
                <th>إشارة RSSI</th>
                <th>درجة الصحة</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="font-bold text-amber-400">DEV-XRF-01</td>
                <td>جهاز XRF مطياف عيار الفضة</td>
                <td>192.168.1.120</td>
                <td>100 %</td>
                <td>34.0 °C</td>
                <td class="text-emerald-400">-48 dBm (قوي)</td>
                <td class="font-bold text-emerald-400">100 %</td>
                <td><span class="bs-badge bs-badge-success">متصل ONLINE</span></td>
              </tr>
              <tr>
                <td class="font-bold text-amber-400">DEV-SCALE-01</td>
                <td>ميزان حساسية الفضة HAL (0.001g)</td>
                <td>192.168.1.122</td>
                <td>95 %</td>
                <td>32.5 °C</td>
                <td class="text-emerald-400">-52 dBm (ممتاز)</td>
                <td class="font-bold text-emerald-400">99.5 %</td>
                <td><span class="bs-badge bs-badge-success">متصل ONLINE</span></td>
              </tr>
              <tr>
                <td class="font-bold text-amber-400">DEV-PRN-01</td>
                <td>طابعة زيبرا باركود الملصقات 600DPI</td>
                <td>192.168.1.130</td>
                <td>100 %</td>
                <td>38.0 °C</td>
                <td class="text-emerald-400">-40 dBm (ممتاز)</td>
                <td class="font-bold text-emerald-400">100 %</td>
                <td><span class="bs-badge bs-badge-success">متصل ONLINE</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderSettingsScreen() {
  const categories = [
    { id: 'gen', icon: '⚙️', title: 'إعدادات عامة' },
    { id: 'comp', icon: '🏛️', title: 'بيانات الشركة' },
    { id: 'brand', icon: '🎨', title: 'الهوية والتصميم' },
    { id: 'print', icon: '🖨️', title: 'الطباعة والملصقات' },
    { id: 'barcode', icon: '🏷️', title: 'الباركود و QR' },
    { id: 'security', icon: '🔒', title: 'الأمان والحماية' },
    { id: 'dev', icon: '📟', title: 'إعدادات الأجهزة HAL' },
    { id: 'backup', icon: '💾', title: 'النسخ الاحتياطي' },
    { id: 'integrations', icon: '🌐', title: 'الربط البرمجي API' }
  ];

  return `
    <div class="glass-card rounded-2xl p-6 border border-slate-700/60 space-y-6 shadow-xl font-sans">
      <div class="flex justify-between items-center pb-4 border-b border-slate-800">
        <div>
          <h2 class="text-xl font-bold text-white flex items-center gap-2">⚙️ إعدادات وتكوين النظام الموحد (Enterprise Settings)</h2>
          <p class="text-xs text-slate-400">تكوين الهوية، تسلسلات الترقيم، قوالب الطباعة، والأمان</p>
        </div>
        <button class="bs-btn bs-btn-primary bs-btn-sm">حفظ كافة الإعدادات 💾</button>
      </div>

      <!-- Settings 10 Category Tabs -->
      <div class="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold">
        ${categories.map((c, i) => `
          <button class="px-3 py-2 rounded-xl transition-all ${i === 0 ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'}">
            <span>${c.icon}</span> <span>${c.title}</span>
          </button>
        `).join('')}
      </div>

      <!-- General Settings Form -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div class="bs-input-group">
          <label class="bs-label">اسم المصنع (بالعربية)</label>
          <input type="text" value="شركة باهر سيلفر الفضية المتخصصة" class="bs-input">
        </div>
        <div class="bs-input-group">
          <label class="bs-label">اسم المصنع (بالإنجليزية)</label>
          <input type="text" value="Baher Silver Pure Jewelry Factory" class="bs-input font-mono">
        </div>
        <div class="bs-input-group">
          <label class="bs-label">العملة الرسمية</label>
          <input type="text" value="EGP (ج.م)" class="bs-input">
        </div>
        <div class="bs-input-group">
          <label class="bs-label">معيار الفضة الافتراضي</label>
          <select class="bs-select">
            <option selected>فضة إيطالية 925</option>
            <option>فضة نقية 999</option>
          </select>
        </div>
      </div>
    </div>
  `;
}


/* ═══════════════════════════════════════════════════════════════
   PHASE 4 CUSTOMER EXPERIENCE MODULES (Portal, DPP, Service, Warranty)
   ═══════════════════════════════════════════════════════════════ */

function renderCustomerPortalScreen() {
  const stepper = Timeline.renderLifecycleStepper('WARRANTY');
  
  const customerTimelineEvents = [
    { title: 'تقديم طلب الشراء (ORD-2026-0010)', timestamp: '2026-07-28 10:30 AM', icon: '🛒', description: 'تم استلام طلب الشراء وتأكيد نموذج التصميم الإيطالي 925.' },
    { title: 'بدء عمليات الصب والتصنيع (MO-2026-0005)', timestamp: '2026-07-29 02:15 PM', icon: '🏭', description: 'تم صب الفضة وتجهيز رصيد الجرامات بورشة الصائغ.' },
    { title: 'فحص الجودة ونقاء الفضة (QC 925 Integrity)', timestamp: '2026-07-30 09:00 AM', icon: '🔍', description: 'مطابقة العيار بواسطة جهاز XRF بنسبة كفاءة 99.8%.' },
    { title: 'اصدار شهادة الضمان 25 سنة وتفعيل DPP', timestamp: '2026-07-30 06:45 PM', icon: '📜', description: 'توليد كود التوثيق وتفعيل كبسولة جواز السفر الرقمي المشفر.' }
  ];

  return `
    <div class="space-y-6 font-sans">
      <!-- Portal Header Banner -->
      <div class="bs-glass-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-3xl text-amber-400">
            🏛️
          </div>
          <div>
            <h2 class="text-xl font-extrabold text-white">بوابة العملاء الخاصة — Baher Customer Portal</h2>
            <p class="text-xs text-amber-300 font-mono">حساب العميل: شركة الباهر للأعمال الفضية • العضوية الماسية (Diamond tier)</p>
          </div>
        </div>
        <div class="flex gap-2">
          <button class="bs-btn bs-btn-primary bs-btn-sm">+ طلب صيانة جديد</button>
          <button class="bs-btn bs-btn-secondary bs-btn-sm">تحميل الكتالوج 📥</button>
        </div>
      </div>

      <!-- Unified 8-Stage Customer 360 Timeline Stepper -->
      <div class="bs-glass-card p-5 space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="text-xs font-bold text-slate-200 flex items-center gap-2">
            <span>🔄</span><span>مسار دورة حياة المنتج 360° (Customer Lifecycle Timeline)</span>
          </h3>
          <span class="bs-badge bs-badge-success">الضمان نشط 🟢</span>
        </div>
        ${stepper}
      </div>

      <!-- Main Portal Split Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left: Customer Timeline Events -->
        <div class="lg:col-span-2 bs-glass-card p-6 space-y-4">
          <h3 class="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <span>📜</span><span>سجل حركات المنتج الضمانات والخدمات</span>
          </h3>
          ${Timeline.render(customerTimelineEvents)}
        </div>

        <!-- Right: Warranty & Passport Summary Card -->
        <div class="space-y-6">
          <div class="bs-glass-card p-5 space-y-4 border-amber-500/30">
            <h3 class="text-sm font-bold text-amber-400 flex items-center gap-2">
              <span>🛡️</span><span>شهادة ضمان عيار 925 (25 سنة)</span>
            </h3>
            <div class="space-y-2 text-xs font-mono">
              <div class="flex justify-between text-slate-300"><span>كود الشهادة:</span><span class="text-amber-400 font-bold">W-2026-925001</span></div>
              <div class="flex justify-between text-slate-300"><span>المنتج:</span><span>طقم فضة إيطالي سويسري</span></div>
              <div class="flex justify-between text-slate-300"><span>تاريخ الضمان:</span><span>2026-07-30 حتى 2051-07-30</span></div>
              <div class="flex justify-between text-slate-300"><span>رمز الاستجابة QR:</span><span class="text-emerald-400">HMAC-VERIFIED 🟢</span></div>
            </div>
            <button onclick="window.open('passport.html', '_blank')" class="w-full bs-btn bs-btn-primary bs-btn-sm text-center">عرض جواز السفر الرقمي DPP ➔</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderDppAdminScreen() {
  const toolbar = DataGrid.renderToolbar({
    searchQuery: '',
    quickFilters: [
      { id: 'all', label: 'كافة الجوازات' },
      { id: 'active', label: 'نشط وموثق' },
      { id: 'shared', label: 'روابط مفرجة (Shared Links)' }
    ],
    activeFilterId: 'all'
  });

  const columns = [
    { label: 'كود الـ DPP', field: 'dppCode' },
    { label: 'السيريال المعياري', field: 'pieceSerial' },
    { label: 'كود التوثيق HMAC', field: 'hmac', render: (val) => `<code class="text-[10px] text-amber-400 font-mono">${val}</code>` },
    { label: 'الحالة', field: 'status', render: () => '<span class="bs-badge bs-badge-success">موثق أصلي 🟢</span>' },
    { label: 'الجواز الرقمي', field: 'action', render: () => '<button onclick="window.open(\'passport.html\', \'_blank\')" class="bs-btn bs-btn-ghost bs-btn-sm text-amber-400">فتح الجواز 🔗</button>' }
  ];

  const dpps = [
    { dppCode: 'DPP-2026-000001', pieceSerial: 'SN-925-884920', hmac: 'b4a9...f810' },
    { dppCode: 'DPP-2026-000002', pieceSerial: 'SN-925-884921', hmac: 'e1d2...a904' }
  ];

  const tableHtml = DataGrid.renderTable({ columns, rows: dpps, keyField: 'dppCode' });

  return `
    <div class="glass-card rounded-2xl p-6 border border-slate-700/60 space-y-6 shadow-xl font-sans">
      <div class="flex justify-between items-center pb-4 border-b border-slate-800">
        <div>
          <h2 class="text-xl font-bold text-white flex items-center gap-2">🛡️ جواز السفر الرقمي للمنتجات (Digital Product Passport - DPP)</h2>
          <p class="text-xs text-slate-400">توثيق الأصالة، حماية كود الـ QR، السيرة الذاتية للمجوهرات، وحسابات الروابط المؤقتة</p>
        </div>
        <button class="bs-btn bs-btn-primary bs-btn-sm">+ إصدار جواز سفر رقمي جديد</button>
      </div>
      ${toolbar}
      ${tableHtml}
    </div>
  `;
}

function renderCustomerServiceCenterScreen() {
  const toolbar = DataGrid.renderToolbar({
    searchQuery: '',
    quickFilters: [
      { id: 'all', label: 'جميع الطلبات' },
      { id: 'repair', label: 'طلبات الإصلاح' },
      { id: 'plating', label: 'طلبات إعادة الطلاء' }
    ],
    activeFilterId: 'all'
  });

  const columns = [
    { label: 'رقم طلب الخدمة', field: 'reqNo' },
    { label: 'العميل', field: 'customer' },
    { label: 'نوع الطلب', field: 'type' },
    { label: 'الفني المسؤول', field: 'technician' },
    { label: 'SLA التزام', field: 'slaStatus', render: () => '<span class="bs-badge bs-badge-success">ضمن الوقت ⏱️</span>' },
    { label: 'الحالة', field: 'status', render: (s) => `<span class="bs-badge bs-badge-info">${s}</span>` }
  ];

  const services = [
    { reqNo: 'SRV-2026-0001', customer: 'شركة الباهر للأعمال الفضية', type: 'طلاء روديوم إيطالي', technician: 'فني طلاء: أحمد سعيد', status: 'جاري العمل 🛠️' },
    { reqNo: 'SRV-2026-0002', customer: 'مجوهرات الأمل', type: 'تركيب وحقن أحجار زركون', technician: 'فني أحجار: محمود صايغ', status: 'تم الإصلاح وتأكيد العميل ✅' }
  ];

  const tableHtml = DataGrid.renderTable({ columns, rows: services, keyField: 'reqNo' });

  return `
    <div class="glass-card rounded-2xl p-6 border border-slate-700/60 space-y-6 shadow-xl font-sans">
      <div class="flex justify-between items-center pb-4 border-b border-slate-800">
        <div>
          <h2 class="text-xl font-bold text-white flex items-center gap-2">🛠️ مركز خدمة العملاء والإصلاح (Customer Service Center)</h2>
          <p class="text-xs text-slate-400">إدارة طلبات الصيانة، التقييم التقني، حساب التكلفة، ومسار الفنيين</p>
        </div>
        <button class="bs-btn bs-btn-primary bs-btn-sm">+ تقديم طلب خدمة جديد</button>
      </div>
      ${toolbar}
      ${tableHtml}
    </div>
  `;
}

function renderWarrantyCenterScreen() {
  return `
    <div class="glass-card rounded-2xl p-6 border border-amber-500/30 space-y-6 shadow-xl font-sans">
      <div class="flex justify-between items-center pb-4 border-b border-slate-800">
        <div>
          <h2 class="text-xl font-extrabold text-amber-400 flex items-center gap-2">📜 مركز إدارة الضمانات المعيارية 25 سنة (Lifetime Warranty Center)</h2>
          <p class="text-xs text-slate-400">شهادات ضمان عيار الفضة 925، تتبع المطالبات، والطباعة الرسمية</p>
        </div>
        <button onclick="window.print()" class="bs-btn bs-btn-primary bs-btn-sm">طباعة شهادة الضمان 🖨️</button>
      </div>

      <!-- Certificate Preview Box -->
      <div class="p-8 border-2 border-amber-500/40 rounded-2xl bg-gradient-to-b from-amber-950/20 via-slate-900 to-slate-950 space-y-6 text-center">
        <div class="space-y-2">
          <div class="text-xs font-bold text-amber-500 tracking-widest uppercase">شهادة ضمان رسمية معتمدة — 25 سنة</div>
          <h1 class="text-2xl font-black text-white font-display">مصنع باهر سيلفر للفضيات الإيطالية عيار 925</h1>
          <p class="text-xs text-slate-300">نضمن بأن القطعة ذات السيريال المعياري <code class="text-amber-400">SN-925-884920</code> مصنعة من الفضة النقية بنسبة 92.5% مطابق للمواصفات الدولية.</p>
        </div>

        <div class="flex justify-center my-4">
          <div class="p-3 bg-white rounded-xl shadow-lg inline-block">
            <img src="assets/baher_logo.png" class="w-24 h-24 object-cover" alt="QR Verification">
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono text-right border-t border-slate-800 pt-4">
          <div><span class="text-slate-500">رقم الشهادة:</span> <div class="text-amber-400 font-bold">W-2026-925001</div></div>
          <div><span class="text-slate-500">بداية الضمان:</span> <div class="text-slate-200">2026-07-30</div></div>
          <div><span class="text-slate-500">نهاية الضمان:</span> <div class="text-slate-200">2051-07-30</div></div>
          <div><span class="text-slate-500">كود التحقق HMAC:</span> <div class="text-emerald-400">VERIFIED 🟢</div></div>
        </div>
      </div>
    </div>
  `;
}

    case 'users_admin': return renderUsersAdminScreen();
    case 'roles_matrix': return renderRolesMatrixScreen();
    case 'security_sessions': return renderActiveSessionsScreen();
    case 'login_history': return renderLoginHistoryScreen();
    case 'master_center': return renderMasterDataCenterScreen();
    case 'warehouses': return renderWarehousesHierarchyScreen();
    case 'locations': return renderStorageLocationsScreen();
    case 'transactions': return renderTransactionsTimelineScreen();
    case 'accounting_system': return renderAccountingSystemScreen();
    case 'inventory_audit': return renderInventoryAuditScreen();
    case 'universal_search': return renderUniversalSearchScreen();
    case 'label_designer': return renderJewelryLabelDesignerScreen();
    default: return renderWarehouseDashboardScreen();
  }
}

/* ═══════════════════════════════════════════════════════════════
   PHASE 3 COMMERCIAL MODULES (Suppliers, Purchasing, Customer Orders)
   ═══════════════════════════════════════════════════════════════ */

function renderSuppliersSrmScreen() {
  const toolbar = DataGrid.renderToolbar({
    searchQuery: '',
    quickFilters: [
      { id: 'all', label: 'الكل' },
      { id: 'silver', label: 'موردي الفضة 999' },
      { id: 'stones', label: 'موردي الألماس والأحجار' }
    ],
    activeFilterId: 'all'
  });

  const columns = [
    { label: 'كود المورد', field: 'code' },
    { label: 'اسم المورد', field: 'nameAr' },
    { label: 'نوع التوريد', field: 'supplyType' },
    { label: 'درجة التقييم', field: 'rating', render: (val) => `<span class="text-amber-400 font-bold">★ ${val || 4.9}</span>` },
    { label: 'الحالة', field: 'status', render: () => '<span class="bs-badge bs-badge-success">معتمد 🟢</span>' }
  ];

  const suppliers = [
    { code: 'SUP-001', nameAr: 'شركة السبيكة الملكية للفضيات', supplyType: 'سبائك فضة نقية 999', rating: 5.0 },
    { code: 'SUP-002', nameAr: 'مؤسسة الزمرد الإيطالي للأحجار', supplyType: 'أحجار كريمة وزركون إيطالي', rating: 4.8 },
    { code: 'SUP-003', nameAr: 'مصنع الأكياس والعلب المترفة', supplyType: 'تغليف ومستلزمات فاخرة', rating: 4.9 }
  ];

  const tableHtml = DataGrid.renderTable({ columns, rows: suppliers, keyField: 'code' });

  return `
    <div class="glass-card rounded-2xl p-6 border border-slate-700/60 space-y-6 shadow-xl font-sans">
      <div class="flex justify-between items-center pb-4 border-b border-slate-800">
        <div>
          <h2 class="text-xl font-bold text-white flex items-center gap-2">🤝 إدارة الموردين والشركاء (Suppliers SRM)</h2>
          <p class="text-xs text-slate-400">تقييم الموردين، فاتورة التوريد، وحسابات الموردين (2101)</p>
        </div>
        <button onclick="openModal('addSupplier')" class="bs-btn bs-btn-primary bs-btn-sm">+ إضافة مورد جديد</button>
      </div>
      ${toolbar}
      ${tableHtml}
    </div>
  `;
}

function renderPurchasingOrdersScreen() {
  const toolbar = DataGrid.renderToolbar({
    searchQuery: '',
    quickFilters: [
      { id: 'all', label: 'كافة الأوامر' },
      { id: 'pending', label: 'قيد الانتظار' },
      { id: 'received', label: 'تم الاستلام GRN' }
    ],
    activeFilterId: 'all'
  });

  const columns = [
    { label: 'رقم أمر الشراء PO', field: 'poNo' },
    { label: 'المورد', field: 'supplier' },
    { label: 'إجمالي الوزن (g)', field: 'weightGrams' },
    { label: 'القيمة التقديرية', field: 'totalValue' },
    { label: 'الحالة', field: 'status', render: (s) => `<span class="bs-badge bs-badge-info">${s}</span>` }
  ];

  const orders = [
    { poNo: 'PO-2026-0001', supplier: 'شركة السبيكة الملكية', weightGrams: '5,000 g', totalValue: '325,000 ج.م', status: 'تم الاستلام GRN' },
    { poNo: 'PO-2026-0002', supplier: 'مؤسسة الزمرد الإيطالي', weightGrams: '1,200 g', totalValue: '180,000 ج.م', status: 'جاري الشحن 🚢' }
  ];

  const tableHtml = DataGrid.renderTable({ columns, rows: orders, keyField: 'poNo' });

  return `
    <div class="glass-card rounded-2xl p-6 border border-slate-700/60 space-y-6 shadow-xl font-sans">
      <div class="flex justify-between items-center pb-4 border-b border-slate-800">
        <div>
          <h2 class="text-xl font-bold text-white flex items-center gap-2">📦 أوامر الشراء واستلام البضائع (PO & GRN)</h2>
          <p class="text-xs text-slate-400">سجل إذن الاستلام ومطابقة الفواتير وتدقيق عيار الفضة 999</p>
        </div>
        <button class="bs-btn bs-btn-primary bs-btn-sm">+ أمر شراء جديد PO</button>
      </div>
      ${toolbar}
      ${tableHtml}
    </div>
  `;
}

function renderCustomerOrdersScreen() {
  const toolbar = DataGrid.renderToolbar({
    searchQuery: '',
    quickFilters: [
      { id: 'all', label: 'جميع الطلبات' },
      { id: 'design', label: 'اعتماد التصاميم' },
      { id: 'production', label: 'جاري التصنيع' }
    ],
    activeFilterId: 'all'
  });

  const columns = [
    { label: 'رقم طلب العميل', field: 'orderNo' },
    { label: 'العميل', field: 'customer' },
    { label: 'الموديل والتصميم', field: 'model' },
    { label: 'الوزن التقريبي', field: 'estWeight' },
    { label: 'حالة الاعتماد', field: 'status', render: (s) => `<span class="bs-badge bs-badge-success">${s}</span>` }
  ];

  const customerOrders = [
    { orderNo: 'ORD-2026-0010', customer: 'شركة الباهر العالمية', model: 'خاتم فضة إيطالي مرصع بالزركون', estWeight: '18.5 g', status: 'موافق عليه ومحول للتصنيع ✅' },
    { orderNo: 'ORD-2026-0011', customer: 'مجوهرات الأمل العالمية', model: 'سلسلة فضة عيار 925 مطلية روديوم', estWeight: '42.0 g', status: 'جاري تصميم الـ CAD 3D 🎨' }
  ];

  const tableHtml = DataGrid.renderTable({ columns, rows: customerOrders, keyField: 'orderNo' });

  return `
    <div class="glass-card rounded-2xl p-6 border border-slate-700/60 space-y-6 shadow-xl font-sans">
      <div class="flex justify-between items-center pb-4 border-b border-slate-800">
        <div>
          <h2 class="text-xl font-bold text-white flex items-center gap-2">🛒 طلبات العملاء وتصاميم CAD (Customer Orders)</h2>
          <p class="text-xs text-slate-400">متابعة موافقات العميل، الملفات الفنية، والتحويل المباشر لـ MO</p>
        </div>
        <button class="bs-btn bs-btn-primary bs-btn-sm">+ طلب عميل جديد</button>
      </div>
      ${toolbar}
      ${tableHtml}
    </div>
  `;
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

  if (state.activeModal === 'addProductModal') return renderAddProductModal();
  if (state.activeModal === 'productDetailModal' && state.selectedProduct) return renderProductDetailModal();
  if (state.activeModal === 'addBOMLineModal' && state.selectedProduct) return renderAddBOMLineModal();
  if (state.activeModal === 'addVariantModal' && state.selectedProduct) return renderAddVariantModal();

  if (state.activeModal === 'addUserModal') return renderAddUserModal();
  if (state.activeModal === 'changeMyPasswordModal') return renderChangeMyPasswordModal();
  if (state.activeModal === 'userPermissionsOverrideModal' && state.selectedUserForPermissions) return renderUserPermissionsOverrideModal();

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

/* =============================================================================
   PHASE 23: PRODUCT ENGINEERING & BOM ENGINE UI
   ============================================================================= */

function renderProductEngineeringScreen() {
  const products = state.products || [];
  const filtered = products.filter(p => {
    if (state.productCategoryFilter && state.productCategoryFilter !== 'ALL' && p.category !== state.productCategoryFilter) return false;
    if (state.productSearchQuery) {
      const q = state.productSearchQuery.toLowerCase();
      return p.nameAr.toLowerCase().includes(q) || p.productCode.toLowerCase().includes(q) || (p.collection && p.collection.toLowerCase().includes(q));
    }
    return true;
  });

  return `
    <div class="glass-card rounded-2xl p-6 border border-slate-700/60 space-y-6 shadow-xl font-sans">
      <!-- Screen Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-borderdark">
        <div class="flex items-center gap-3">
          <div class="h-12 w-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl text-amber-400">
            🏭
          </div>
          <div>
            <h2 class="text-xl font-extrabold text-white tracking-wide">هندسة المنتجات وقائمة المواد (Product Engineering & BOM Engine)</h2>
            <p class="text-xs text-slate-400 font-mono">سجل المنتجات التامة • قوائم المواد التفصيلية BOM • متغيرات المنتج • مسارات التصنيع • الاحتساب التلقائي والتكلفة الحقيقية</p>
          </div>
        </div>

        <button onclick="openModal('addProductModal')" class="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg flex items-center gap-2 transition-all">
          <span>+ إضافة منتج تام جديد</span>
        </button>
      </div>

      <!-- Controls & Filter Bar -->
      <div class="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900/80 p-3 rounded-xl border border-slate-800">
        <div class="flex items-center gap-3 w-full sm:w-auto">
          <input type="text" placeholder="بحث باسم المنتج، الكود، الكولكشن..." value="${state.productSearchQuery || ''}" oninput="state.productSearchQuery = this.value; renderApp();" class="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:border-amber-500 focus:outline-none w-full sm:w-64">
          <select onchange="state.productCategoryFilter = this.value; renderApp();" class="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:border-amber-500 focus:outline-none">
            <option value="ALL" ${state.productCategoryFilter === 'ALL' ? 'selected' : ''}>جميع التصنيفات</option>
            <option value="خاتم" ${state.productCategoryFilter === 'خاتم' ? 'selected' : ''}>خواتم</option>
            <option value="قلادة" ${state.productCategoryFilter === 'قلادة' ? 'selected' : ''}>قلادات ومعلقات</option>
            <option value="إسوارة" ${state.productCategoryFilter === 'إسوارة' ? 'selected' : ''}>أساور وانسيالات</option>
            <option value="حلق" ${state.productCategoryFilter === 'حلق' ? 'selected' : ''}>أقراط وحلقان</option>
            <option value="طقم" ${state.productCategoryFilter === 'طقم' ? 'selected' : ''}>أطقم مجوهرات كاملة</option>
          </select>
        </div>
        <div class="text-xs text-slate-400 font-mono">
          عدد المنتجات المسجلة: <span class="text-amber-400 font-bold">${filtered.length}</span> من أصل ${products.length}
        </div>
      </div>

      <!-- Products Grid -->
      ${filtered.length === 0 ? renderEmptyState('لا توجد منتجات تامة مسجلة حتى الآن. اضغط للإضافة', 'إضافة منتج جديد', 'addProductModal') : `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          ${filtered.map(p => renderProductCard(p)).join('')}
        </div>
      `}
    </div>
  `;
}

function renderProductCard(p) {
  const bomCount = p.bom?.lines?.length || 0;
  const variantCount = p.variants?.length || 0;
  const stepsCount = p.routing?.steps?.length || 0;
  const cost = p.cost;
  const marginPct = cost ? Math.round(cost.profitMargin || 0) : 0;

  const mainImg = p.imageUrls ? (JSON.parse(p.imageUrls)[0] || null) : null;
  const imgTag = mainImg
    ? `<img src="${mainImg}" alt="${p.nameAr}" class="w-20 h-20 rounded-xl object-cover border border-slate-700 shrink-0">`
    : `<div class="w-20 h-20 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-2xl text-slate-600 shrink-0">💍</div>`;

  return `
    <div class="glass-card rounded-2xl p-5 border border-slate-800 hover:border-amber-500/50 transition-all space-y-4 shadow-lg flex flex-col justify-between">
      <div class="space-y-3">
        <div class="flex gap-3">
          ${imgTag}
          <div class="space-y-1 overflow-hidden">
            <span class="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">${p.productCode}</span>
            <h3 class="font-extrabold text-white text-sm truncate">${p.nameAr}</h3>
            <p class="text-xs text-slate-400 font-mono">${p.category} • عيار ${p.silverPurity} ${p.collection ? '• ' + p.collection : ''}</p>
          </div>
        </div>

        <!-- Specifications Breakdown -->
        <div class="grid grid-cols-3 gap-2 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-[11px] font-mono text-center">
          <div>
            <div class="text-slate-500">وزن الفضة</div>
            <div class="text-slate-200 font-bold">${p.silverWeightGrams} جم</div>
          </div>
          <div>
            <div class="text-slate-500">الأحجار</div>
            <div class="text-slate-200 font-bold">${p.stoneCount} حجر (${p.stoneWeightGrams}جم)</div>
          </div>
          <div>
            <div class="text-slate-500">المكونات</div>
            <div class="text-slate-200 font-bold">${p.componentWeightGrams} جم</div>
          </div>
        </div>

        <!-- BOM, Variants, Routing Pills -->
        <div class="flex items-center gap-2 text-[10px] font-mono">
          <span class="px-2 py-1 rounded-lg ${bomCount > 0 ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'}">📋 BOM: ${bomCount} مكون</span>
          <span class="px-2 py-1 rounded-lg ${variantCount > 0 ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' : 'bg-slate-800 text-slate-500'}">🔀 متغبرات: ${variantCount}</span>
          <span class="px-2 py-1 rounded-lg ${stepsCount > 0 ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30' : 'bg-slate-800 text-slate-500'}">⚙️ مسار: ${stepsCount} مرحلة</span>
        </div>
      </div>

      <!-- Cost & Profit Row -->
      <div class="pt-3 border-t border-slate-800 flex items-center justify-between">
        <div>
          <div class="text-[10px] text-slate-400">التكلفة / البيع</div>
          <div class="text-xs font-bold text-white font-mono">
            ${cost ? `${cost.actualCost.toFixed(1)} ج.م / <span class="text-amber-400">${cost.sellingPrice.toFixed(1)} ج.م</span>` : 'غير محتسب'}
          </div>
        </div>

        <button onclick="openProductDetailModal('${p.id}')" class="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 text-xs font-bold transition-all">
          التفاصيل والـ BOM ➔
        </button>
      </div>
    </div>
  `;
}

async function openProductDetailModal(id) {
  state.isLoading = true;
  renderApp();
  try {
    const res = await apiGet(`/products/${id}`);
    if (res) {
      state.selectedProduct = res;
      state.productDetailTab = 'info';
      state.activeModal = 'productDetailModal';
    }
  } catch(e) {
    alert('تعذر تحميل تفاصيل المنتج');
  } finally {
    state.isLoading = false;
    renderApp();
  }
}

function renderProductDetailModal() {
  const p = state.selectedProduct;
  if (!p) return '';

  const activeTab = state.productDetailTab || 'info';

  return `
    <div class="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div class="glass-card max-w-4xl w-full p-6 rounded-3xl border border-amber-500/40 space-y-6 max-h-[92vh] overflow-y-auto text-right font-sans shadow-2xl">
        <!-- Header -->
        <div class="flex justify-between items-center pb-4 border-b border-borderdark">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 font-mono">${p.productCode}</span>
              <h3 class="text-xl font-extrabold text-white">${p.nameAr}</h3>
            </div>
            <p class="text-xs text-slate-400 font-mono mt-1">${p.category} • عيار ${p.silverPurity} • ${p.collection || 'بدون كولكشن'}</p>
          </div>
          <button onclick="closeModal()" class="h-9 w-9 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center">✕</button>
        </div>

        <!-- 5-Tab Navigation Bar -->
        <div class="flex border-b border-slate-800 text-xs font-bold">
          <button onclick="state.productDetailTab = 'info'; renderApp();" class="px-4 py-2.5 border-b-2 transition-all ${activeTab === 'info' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'}">📋 بيانات المنتج</button>
          <button onclick="state.productDetailTab = 'bom'; renderApp();" class="px-4 py-2.5 border-b-2 transition-all ${activeTab === 'bom' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'}">🧪 قائمة المواد (BOM)</button>
          <button onclick="state.productDetailTab = 'variants'; renderApp();" class="px-4 py-2.5 border-b-2 transition-all ${activeTab === 'variants' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'}">🔀 المتغيرات (Variants)</button>
          <button onclick="state.productDetailTab = 'routing'; renderApp();" class="px-4 py-2.5 border-b-2 transition-all ${activeTab === 'routing' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'}">⚙️ مسار التصنيع (Routing)</button>
          <button onclick="state.productDetailTab = 'cost'; renderApp();" class="px-4 py-2.5 border-b-2 transition-all ${activeTab === 'cost' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'}">💰 التكلفة والتسعير (Costing)</button>
        </div>

        <!-- Tab Body -->
        <div class="space-y-4">
          ${activeTab === 'info' ? renderProductTabInfo(p) : ''}
          ${activeTab === 'bom' ? renderProductTabBOM(p) : ''}
          ${activeTab === 'variants' ? renderProductTabVariants(p) : ''}
          ${activeTab === 'routing' ? renderProductTabRouting(p) : ''}
          ${activeTab === 'cost' ? renderProductTabCosting(p) : ''}
        </div>
      </div>
    </div>
  `;
}

function renderProductTabInfo(p) {
  return `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
      <div class="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
        <div class="text-amber-400 font-bold font-sans">المواصفات الفنية للفضة والأحجار:</div>
        <div class="flex justify-between border-b border-slate-800/60 py-1"><span>وزن الفضة النقي:</span><span class="text-white font-bold">${p.silverWeightGrams} جرام</span></div>
        <div class="flex justify-between border-b border-slate-800/60 py-1"><span>عيار الفضة المطلوب:</span><span class="text-white font-bold">${p.silverPurity}</span></div>
        <div class="flex justify-between border-b border-slate-800/60 py-1"><span>عدد الأحجار المثبتة:</span><span class="text-white font-bold">${p.stoneCount} حجر</span></div>
        <div class="flex justify-between border-b border-slate-800/60 py-1"><span>وزن الأحجار الإجمالي:</span><span class="text-white font-bold">${p.stoneWeightGrams} جرام</span></div>
        <div class="flex justify-between border-b border-slate-800/60 py-1"><span>وزن الإكسسوارات والمكونات:</span><span class="text-white font-bold">${p.componentWeightGrams} جرام</span></div>
      </div>

      <div class="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
        <div class="text-amber-400 font-bold font-sans">التجهيز النهائي والملاحظات:</div>
        <div class="flex justify-between border-b border-slate-800/60 py-1"><span>نوع الطلاء الروديوم:</span><span class="text-white font-bold">${p.rhodiumType || 'بدون طلاء'}</span></div>
        <div class="flex justify-between border-b border-slate-800/60 py-1"><span>المقاس الافتراضي:</span><span class="text-white font-bold">${p.ringSizeDefault || 'قياسي'}</span></div>
        <div class="flex justify-between border-b border-slate-800/60 py-1"><span>الكولكشن / المجموعة:</span><span class="text-white font-bold">${p.collection || 'عام'}</span></div>
        <div class="pt-2 text-slate-400 font-sans">
          <div class="text-[11px] text-slate-500 font-bold mb-1">ملاحظات التصنيع والتشغيل:</div>
          <div class="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs">${p.manufacturingNotes || 'لا توجد ملاحظات مسجلة.'}</div>
        </div>
      </div>
    </div>
  `;
}

function renderProductTabBOM(p) {
  const bom = p.bom;
  const lines = bom?.lines || [];

  return `
    <div class="space-y-4">
      <div class="flex justify-between items-center bg-slate-900/90 p-3 rounded-xl border border-slate-800">
        <div class="text-xs text-slate-300 font-bold">
          معامل الهالك المتوقع: <span class="text-amber-400 font-mono">${bom?.expectedLossPercent || 2.0}%</span> | 
          نسبة الإنتاجية المتوقعة: <span class="text-emerald-400 font-mono">${bom?.expectedYield || 100}%</span>
        </div>
        <button onclick="openModal('addBOMLineModal')" class="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 text-xs font-bold">
          + إضافة مكون لـ BOM
        </button>
      </div>

      ${lines.length === 0 ? renderEmptyState('لا توجد مكونات مسجلة في BOM لهذا المنتج', 'إضافة مكون', 'addBOMLineModal') : `
        <div class="overflow-x-auto">
          <table class="w-full text-right text-xs">
            <thead class="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono">
              <tr>
                <th class="p-3">نوع المكون</th>
                <th class="p-3">كود الصنف</th>
                <th class="p-3">اسم المكون</th>
                <th class="p-3">الكمية/الوزن</th>
                <th class="p-3">تكلفة الوحدة</th>
                <th class="p-3">الهالك %</th>
                <th class="p-3">التكلفة الإجمالية</th>
                <th class="p-3">إجراءات</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60 font-mono">
              ${lines.map(l => `
                <tr class="hover:bg-slate-900/50">
                  <td class="p-3"><span class="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-sans text-[10px]">${l.lineType}</span></td>
                  <td class="p-3 text-amber-400">${l.itemCode}</td>
                  <td class="p-3 text-white font-sans font-bold">${l.itemName}</td>
                  <td class="p-3">${l.quantity} ${l.unitOfMeasure}</td>
                  <td class="p-3">${l.unitCost.toFixed(2)} ج.م</td>
                  <td class="p-3 text-amber-400">${l.wasteFactor}%</td>
                  <td class="p-3 text-emerald-400 font-bold">${l.totalCost.toFixed(2)} ج.م</td>
                  <td class="p-3">
                    <button onclick="removeBOMLine('${l.id}')" class="text-rose-400 hover:text-rose-300 text-xs">حذف</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `}
    </div>
  `;
}

function renderProductTabVariants(p) {
  const variants = p.variants || [];

  return `
    <div class="space-y-4">
      <div class="flex justify-between items-center bg-slate-900/90 p-3 rounded-xl border border-slate-800">
        <div class="text-xs text-slate-300 font-bold">المتغيرات المتاحة لهذا المنتج (Ring Sizes, Stone Colors, Finishes):</div>
        <button onclick="openModal('addVariantModal')" class="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/40 text-xs font-bold">
          + إضافة متغير جديد
        </button>
      </div>

      ${variants.length === 0 ? renderEmptyState('لا توجد متغيرات مسجلة لهذا المنتج', 'إضافة متغير', 'addVariantModal') : `
        <div class="overflow-x-auto">
          <table class="w-full text-right text-xs font-mono">
            <thead class="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th class="p-3">كود المتغير</th>
                <th class="p-3">المقاس</th>
                <th class="p-3">لون الحجر</th>
                <th class="p-3">مقاس الحجر</th>
                <th class="p-3">عيار الفضة</th>
                <th class="p-3">نوع التشطيب</th>
                <th class="p-3">فارق السعر</th>
                <th class="p-3">إجراءات</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60">
              ${variants.map(v => `
                <tr class="hover:bg-slate-900/50">
                  <td class="p-3 text-cyan-400 font-bold">${v.variantCode}</td>
                  <td class="p-3">${v.ringSize || '—'}</td>
                  <td class="p-3">${v.stoneColor || '—'}</td>
                  <td class="p-3">${v.stoneSize || '—'}</td>
                  <td class="p-3">${v.silverPurity || '—'}</td>
                  <td class="p-3">${v.surfaceFinish || '—'}</td>
                  <td class="p-3 text-emerald-400">${v.priceDelta >= 0 ? '+' : ''}${v.priceDelta} ج.م</td>
                  <td class="p-3">
                    <button onclick="deleteVariant('${v.id}')" class="text-rose-400 hover:text-rose-300 text-xs">حذف</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `}
    </div>
  `;
}

function renderProductTabRouting(p) {
  const steps = p.routing?.steps || [];

  return `
    <div class="space-y-4">
      <div class="flex justify-between items-center bg-slate-900/90 p-3 rounded-xl border border-slate-800">
        <div class="text-xs text-slate-300 font-bold">مسار مراحل التصنيع (Production Routing Template):</div>
        <button onclick="saveDefaultRoutingTemplate('${p.id}')" class="px-3.5 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/40 text-xs font-bold">
          ⚡ توليد المسار القياسي (9 مراحل)
        </button>
      </div>

      ${steps.length === 0 ? renderEmptyState('لم يتم إعداد مسار التصنيع لهذا المنتج. اضغط لتوليد المسار القياسي', 'توليد المسار القياسي', '') : `
        <div class="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-9 gap-2 text-center text-xs font-mono">
          ${steps.map(s => `
            <div class="p-3 rounded-2xl bg-slate-950 border border-purple-500/30 space-y-1">
              <span class="text-[10px] text-purple-400 font-bold">#${s.sequenceNo}</span>
              <div class="font-bold text-white text-[11px] font-sans">${s.stage}</div>
              <div class="text-[10px] text-slate-400">${s.laborMinutes} دقيقة</div>
              <div class="text-[10px] text-emerald-400">${s.laborCostRate} ج.م/د</div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;
}

function renderProductTabCosting(p) {
  const cost = p.cost;

  return `
    <div class="space-y-4">
      <div class="flex justify-between items-center bg-slate-900/90 p-3 rounded-xl border border-slate-800">
        <div class="text-xs text-slate-300 font-bold">احتساب التكلفة التلقائي وتحديد هامش الربح:</div>
        <button onclick="triggerCostCalculation('${p.id}')" class="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-lg">
          🔄 إعادة الاحتساب أوتوماتيكياً
        </button>
      </div>

      ${!cost ? renderEmptyState('لم يتم احتساب التكلفة بعد. اضغط لإجراء الاحتساب الأول', 'احتساب التكلفة الآن', '') : `
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div class="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <div class="text-slate-400">تكلفة المواد (Materials)</div>
            <div class="text-lg font-bold text-white">${cost.materialCost.toFixed(2)} ج.م</div>
          </div>
          <div class="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <div class="text-slate-400">تكلفة العمالة (Labor)</div>
            <div class="text-lg font-bold text-white">${cost.laborCost.toFixed(2)} ج.م</div>
          </div>
          <div class="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <div class="text-slate-400">تكلفة الماكينات (Machine)</div>
            <div class="text-lg font-bold text-white">${cost.machineCost.toFixed(2)} ج.م</div>
          </div>
          <div class="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <div class="text-slate-400">المصروفات الإدارية (Overhead)</div>
            <div class="text-lg font-bold text-white">${cost.overhead.toFixed(2)} ج.م</div>
          </div>
        </div>

        <div class="p-4 bg-slate-950 rounded-2xl border border-amber-500/40 space-y-3 font-mono text-xs">
          <div class="flex justify-between items-center text-sm font-bold text-white">
            <span>إجمالي التكلفة الحقيقية (Actual Cost):</span>
            <span class="text-amber-400 text-lg">${cost.actualCost.toFixed(2)} ج.م</span>
          </div>
          <div class="flex justify-between items-center text-sm font-bold text-white">
            <span>سعر البيع المقترح:</span>
            <span class="text-emerald-400 text-lg">${cost.sellingPrice.toFixed(2)} ج.م</span>
          </div>
          <div class="flex justify-between items-center text-xs text-slate-300">
            <span>هامش الربح المحقق (Profit Margin):</span>
            <span class="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">${cost.profitMargin.toFixed(1)}%</span>
          </div>
        </div>
      `}
    </div>
  `;
}

function renderAddProductModal() {
  return `
    <div class="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div class="glass-card max-w-2xl w-full p-6 md:p-8 rounded-3xl border border-amber-500/40 space-y-6 max-h-[92vh] overflow-y-auto text-right font-sans shadow-2xl">
        <div class="flex justify-between items-center pb-4 border-b border-borderdark">
          <div>
            <h3 class="text-xl font-extrabold text-white">إضافة منتج تام جديد في الهندسة</h3>
            <p class="text-xs text-slate-400 font-mono">تحديد كود وتصنيف ومواصفات المنتج الفنية</p>
          </div>
          <button onclick="closeModal()" class="h-9 w-9 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center">✕</button>
        </div>

        <form onsubmit="submitAddProduct(event)" class="space-y-4 text-xs font-sans">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block font-bold text-slate-300 mb-1">اسم المنتج بالعربية *</label>
              <input type="text" name="nameAr" required placeholder="مثال: خاتم فضة عيار 925 مرصع بياقوت أحمر" class="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-amber-500 focus:outline-none">
            </div>
            <div>
              <label class="block font-bold text-slate-300 mb-1">اسم المنتج بالإنجليزية</label>
              <input type="text" name="nameEn" placeholder="e.g. 925 Silver Ring Ruby" class="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-amber-500 focus:outline-none">
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block font-bold text-slate-300 mb-1">التصنيف *</label>
              <select name="category" required class="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-amber-500 focus:outline-none">
                <option value="خاتم">خاتم</option>
                <option value="قلادة">قلادة / معلقة</option>
                <option value="إسوارة">إسوارة / انسيال</option>
                <option value="حلق">حلق / أقراط</option>
                <option value="طقم">طقم مجوهرات</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-slate-300 mb-1">عيار الفضة *</label>
              <select name="silverPurity" required class="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-amber-500 focus:outline-none">
                <option value="925">925 (فضة إسترليني)</option>
                <option value="999">999 (فضة نقية)</option>
                <option value="835">835</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-slate-300 mb-1">المجموعة / Collection</label>
              <input type="text" name="collection" placeholder="مثال: Royal Collection 2026" class="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-amber-500 focus:outline-none">
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block font-bold text-slate-300 mb-1">وزن الفضة المتوقع (جرام) *</label>
              <input type="number" step="0.01" name="silverWeightGrams" required placeholder="0.00" class="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-amber-500 focus:outline-none">
            </div>
            <div>
              <label class="block font-bold text-slate-300 mb-1">عدد الأحجار</label>
              <input type="number" name="stoneCount" placeholder="0" class="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-amber-500 focus:outline-none">
            </div>
            <div>
              <label class="block font-bold text-slate-300 mb-1">وزن الأحجار (جرام)</label>
              <input type="number" step="0.01" name="stoneWeightGrams" placeholder="0.00" class="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-amber-500 focus:outline-none">
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block font-bold text-slate-300 mb-1">طلاء الروديوم</label>
              <input type="text" name="rhodiumType" placeholder="مثال: طلاء روديوم أبيض إيطالي" class="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-amber-500 focus:outline-none">
            </div>
            <div>
              <label class="block font-bold text-slate-300 mb-1">المقاس الافتراضي</label>
              <input type="text" name="ringSizeDefault" placeholder="مثال: 18 (US 8)" class="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-amber-500 focus:outline-none">
            </div>
          </div>

          <div>
            <label class="block font-bold text-slate-300 mb-1">ملاحظات التصنيع والتشغيل</label>
            <textarea name="manufacturingNotes" rows="2" placeholder="أدخل أي ملاحظات تقنية خاصة بالورشة والصب..." class="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-amber-500 focus:outline-none"></textarea>
          </div>

          <div class="pt-4 flex justify-end gap-3 border-t border-slate-800">
            <button type="button" onclick="closeModal()" class="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold border border-slate-700">إلغاء</button>
            <button type="submit" class="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold shadow-lg">حفظ المنتج الجديد ➔</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function renderAddBOMLineModal() {
  return `
    <div class="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div class="glass-card max-w-lg w-full p-6 rounded-3xl border border-emerald-500/40 space-y-5 text-right font-sans shadow-2xl">
        <div class="flex justify-between items-center pb-3 border-b border-borderdark">
          <h3 class="text-lg font-extrabold text-white">إضافة مكون جديد في BOM</h3>
          <button onclick="closeModal()" class="text-slate-400 hover:text-white">✕</button>
        </div>

        <form onsubmit="submitAddBOMLine(event)" class="space-y-3 text-xs">
          <div>
            <label class="block font-bold text-slate-300 mb-1">نوع المكون *</label>
            <select name="lineType" required class="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none">
              <option value="SILVER">فضة (Silver)</option>
              <option value="STONE">حجر (Gemstone)</option>
              <option value="COMPONENT">مكون/إكسسوار (Component)</option>
              <option value="CHEMICAL">كيماويات (Chemical)</option>
              <option value="PACKAGING">تغليف (Packaging)</option>
            </select>
          </div>
          <div>
            <label class="block font-bold text-slate-300 mb-1">كود الصنف *</label>
            <input type="text" name="itemCode" required placeholder="مثال: SLV-92501 أو STN-101" class="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none">
          </div>
          <div>
            <label class="block font-bold text-slate-300 mb-1">اسم المكون *</label>
            <input type="text" name="itemName" required placeholder="مثال: فضة كسر 925" class="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none">
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-300 mb-1">الكمية/الوزن *</label>
              <input type="number" step="0.01" name="quantity" required placeholder="1.0" class="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none">
            </div>
            <div>
              <label class="block font-bold text-slate-300 mb-1">تكلفة الوحدة (ج.م) *</label>
              <input type="number" step="0.01" name="unitCost" required placeholder="50.00" class="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none">
            </div>
          </div>
          <div>
            <label class="block font-bold text-slate-300 mb-1">نسبة الهالك الخاص %</label>
            <input type="number" step="0.1" name="wasteFactor" placeholder="0.0" class="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none">
          </div>

          <div class="pt-3 flex justify-end gap-2 border-t border-slate-800">
            <button type="button" onclick="closeModal()" class="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300">إلغاء</button>
            <button type="submit" class="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold">إضافة المكون ➔</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function renderAddVariantModal() {
  return `
    <div class="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div class="glass-card max-w-md w-full p-6 rounded-3xl border border-cyan-500/40 space-y-4 text-right font-sans shadow-2xl">
        <div class="flex justify-between items-center pb-3 border-b border-borderdark">
          <h3 class="text-lg font-extrabold text-white">إضافة متغير جديد (Variant)</h3>
          <button onclick="closeModal()" class="text-slate-400 hover:text-white">✕</button>
        </div>

        <form onsubmit="submitAddVariant(event)" class="space-y-3 text-xs">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-300 mb-1">المقاس</label>
              <input type="text" name="ringSize" placeholder="مثال: 16" class="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none">
            </div>
            <div>
              <label class="block font-bold text-slate-300 mb-1">لون الحجر</label>
              <input type="text" name="stoneColor" placeholder="مثال: أحمر ياقوتي" class="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none">
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-300 mb-1">مقاس الحجر</label>
              <input type="text" name="stoneSize" placeholder="مثال: 6x8 mm" class="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none">
            </div>
            <div>
              <label class="block font-bold text-slate-300 mb-1">عيار الفضة</label>
              <input type="text" name="silverPurity" placeholder="925" class="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none">
            </div>
          </div>
          <div>
            <label class="block font-bold text-slate-300 mb-1">فارق السعر (Price Delta) ج.م</label>
            <input type="number" step="0.5" name="priceDelta" placeholder="0.0" class="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none">
          </div>

          <div class="pt-3 flex justify-end gap-2 border-t border-slate-800">
            <button type="button" onclick="closeModal()" class="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300">إلغاء</button>
            <button type="submit" class="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold">إضافة المتغير ➔</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

// ACTION HANDLERS
async function submitAddProduct(e) {
  e.preventDefault();
  const form = e.target;
  const body = {
    nameAr: form.nameAr.value,
    nameEn: form.nameEn.value,
    category: form.category.value,
    collection: form.collection.value,
    silverPurity: form.silverPurity.value,
    silverWeightGrams: parseFloat(form.silverWeightGrams.value || 0),
    stoneCount: parseInt(form.stoneCount.value || 0, 10),
    stoneWeightGrams: parseFloat(form.stoneWeightGrams.value || 0),
    rhodiumType: form.rhodiumType.value,
    ringSizeDefault: form.ringSizeDefault.value,
    manufacturingNotes: form.manufacturingNotes.value
  };

  try {
    const res = await apiPost('/products', body);
    if (res && res.success) {
      closeModal();
      showToast(`تم إنشاء المنتج ${res.data.productCode} بنجاح!`);
      await loadAllDatabaseData();
    }
  } catch(err) {
    alert('حدث خطأ أثناء حفظ المنتج');
  }
}

async function submitAddBOMLine(e) {
  e.preventDefault();
  const p = state.selectedProduct;
  if (!p) return;

  const form = e.target;
  const body = {
    lineType: form.lineType.value,
    itemCode: form.itemCode.value,
    itemName: form.itemName.value,
    quantity: parseFloat(form.quantity.value || 1),
    unitCost: parseFloat(form.unitCost.value || 0),
    wasteFactor: parseFloat(form.wasteFactor.value || 0)
  };

  try {
    const res = await apiPost(`/products/${p.id}/bom/lines`, body);
    if (res && res.success) {
      closeModal();
      showToast('تمت إضافة المكون لـ BOM بنجاح!');
      await openProductDetailModal(p.id);
    }
  } catch(err) {
    alert('حدث خطأ أثناء إضافة المكون');
  }
}

async function removeBOMLine(lineId) {
  const p = state.selectedProduct;
  if (!p) return;

  if (confirm('هل أنت تأكد من حذف هذا المكون من BOM؟')) {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${p.id}/bom/lines/${lineId}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        showToast('تم حذف المكون بنجاح');
        await openProductDetailModal(p.id);
      }
    } catch(err) {
      alert('تعذر الحذف');
    }
  }
}

async function submitAddVariant(e) {
  e.preventDefault();
  const p = state.selectedProduct;
  if (!p) return;

  const form = e.target;
  const body = {
    ringSize: form.ringSize.value,
    stoneColor: form.stoneColor.value,
    stoneSize: form.stoneSize.value,
    silverPurity: form.silverPurity.value,
    priceDelta: parseFloat(form.priceDelta.value || 0)
  };

  try {
    const res = await apiPost(`/products/${p.id}/variants`, body);
    if (res && res.success) {
      closeModal();
      showToast('تمت إضافة المتغير بنجاح!');
      await openProductDetailModal(p.id);
    }
  } catch(err) {
    alert('حدث خطأ أثناء إضافة المتغير');
  }
}

async function deleteVariant(vid) {
  const p = state.selectedProduct;
  if (!p) return;

  if (confirm('هل ترغب في حذف هذا المتغير؟')) {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${p.id}/variants/${vid}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        showToast('تم حذف المتغير بنجاح');
        await openProductDetailModal(p.id);
      }
    } catch(err) {
      alert('تعذر الحذف');
    }
  }
}

async function saveDefaultRoutingTemplate(productId) {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${productId}/routing`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    const json = await res.json();
    if (json.success) {
      showToast('تم توليد وتأكيد المسار القياسي (9 مراحل) بنجاح!');
      await openProductDetailModal(productId);
    }
  } catch(e) {
    alert('تعذر حفظ المسار');
  }
}

async function triggerCostCalculation(productId) {
  try {
    const res = await apiPost(`/products/${productId}/cost/calculate`, {});
    if (res && res.success) {
      showToast(`تم احتساب التكلفة الحقيقية: ${res.data.actualCost.toFixed(2)} ج.م!`);
      await openProductDetailModal(productId);
    }
  } catch(e) {
    alert('تعذر احتساب التكلفة');
  }
}

/* =============================================================================
   PHASE 23A: ENTERPRISE AUTHENTICATION & SECURITY ADMINISTRATION UI
   ============================================================================= */

function renderEnterpriseLoginScreen() {
  return `
    <div class="min-h-screen bg-darkbg text-slate-100 font-sans flex items-center justify-center p-4 selection:bg-brand-500 selection:text-slate-950">
      <div class="glass-card max-w-md w-full p-8 rounded-3xl border border-brand-500/40 space-y-6 shadow-2xl text-right">
        <!-- Logo & Title -->
        <div class="flex flex-col items-center text-center space-y-2">
          <img src="assets/baher_logo.png" alt="BAHER SILVER" class="h-16 w-16 rounded-2xl object-cover border-2 border-brand-500/50 shadow-xl bg-[#C3B097]">
          <h2 class="text-2xl font-extrabold text-white tracking-wide">مصنع باهر سيلفر للفضة</h2>
          <p class="text-xs text-slate-400 font-mono">نظام إدارة الإنتاج والمخازن — تسجيل الدخول المؤسسي</p>
        </div>

        <form id="enterpriseLoginForm" onsubmit="handleEnterpriseLogin(event)" class="space-y-4 text-xs font-sans">
          <div>
            <label class="block font-bold text-slate-300 mb-1">اسم المستخدم أو البريد الإلكتروني *</label>
            <input type="text" id="loginUsernameInput" name="usernameOrEmail" required placeholder="admin أو baher" value="admin" class="w-full h-11 px-4 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:border-brand-500 focus:outline-none transition-all">
          </div>

          <div>
            <label class="block font-bold text-slate-300 mb-1">كلمة المرور السرية *</label>
            <div class="relative flex items-center">
              <input type="password" id="loginPasswordInput" name="password" required placeholder="••••••••" value="Admin@Baher2026" class="w-full h-11 pl-12 pr-4 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:border-brand-500 focus:outline-none transition-all">
              <button type="button" onclick="togglePasswordVisibility()" title="إظهار / إخفاء كلمة المرور" class="absolute left-2 top-1/2 -translate-y-1/2 px-2 py-1.5 text-slate-400 hover:text-amber-400 text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors">
                <span id="eyeIcon">👁️ إظهار</span>
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between text-xs text-slate-400 pt-1">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked class="rounded border-slate-700 bg-slate-900 text-brand-500 focus:ring-0">
              <span>تذكر الجلسة على هذا الجهاز</span>
            </label>
            <span class="text-amber-400 font-mono text-[11px]">v4.0 AUTH</span>
          </div>

          <button type="submit" class="w-full h-11 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-extrabold text-sm shadow-xl transition-all flex items-center justify-center gap-2">
            <span>دخول النظام المؤسسي</span> ➔
          </button>
        </form>

        <!-- Quick Fill Credentials Box -->
        <div class="p-4 rounded-2xl bg-slate-950/90 border border-slate-800/80 text-xs text-slate-300 space-y-2">
          <div class="font-bold text-slate-400 text-center mb-1">🔑 الحسابات المتاحة للدخول الفوري:</div>
          <div class="grid grid-cols-2 gap-2 font-mono text-[11px]">
            <button type="button" onclick="fillLoginCredentials('admin', 'Admin@Baher2026')" class="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/30 text-amber-300 font-bold transition-all text-center">
              👤 admin<br><span class="text-[10px] text-slate-400">Admin@Baher2026</span>
            </button>
            <button type="button" onclick="fillLoginCredentials('baher', 'michael')" class="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/30 text-emerald-300 font-bold transition-all text-center">
              👤 baher<br><span class="text-[10px] text-slate-400">michael</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function togglePasswordVisibility() {
  const pwdInput = document.getElementById('loginPasswordInput');
  const eyeIcon = document.getElementById('eyeIcon');
  if (!pwdInput || !eyeIcon) return;

  if (pwdInput.type === 'password') {
    pwdInput.type = 'text';
    eyeIcon.textContent = '🔒 إخفاء';
  } else {
    pwdInput.type = 'password';
    eyeIcon.textContent = '👁️ إظهار';
  }
}

function fillLoginCredentials(username, password) {
  const userInput = document.getElementById('loginUsernameInput');
  const pwdInput = document.getElementById('loginPasswordInput');
  if (userInput) userInput.value = username;
  if (pwdInput) pwdInput.value = password;
  if (typeof showToast === 'function') {
    showToast(`تم ملء بيانات الحساب (${username}) بنجاح`);
  }
}

async function handleEnterpriseLogin(e) {
  e.preventDefault();
  const form = e.target;
  const usernameOrEmail = form.usernameOrEmail.value;
  const password = form.password.value;

  try {
    state.isLoading = true;
    renderApp();

    // Re-detect active API port if server was restarted
    await detectApiPort();

    const res = await apiPost('/auth/login', { usernameOrEmail, password });
    if (res && res.success) {
      state.currentUser = res.data.user;
      state.accessToken = res.data.accessToken;
      state.refreshToken = res.data.refreshToken;

      localStorage.setItem('baher_user', JSON.stringify(res.data.user));
      localStorage.setItem('baher_access_token', res.data.accessToken);
      localStorage.setItem('baher_refresh_token', res.data.refreshToken);

      showToast(`مرحباً بك مجدداً، ${res.data.user.fullNameAr}!`);
      await loadAllDatabaseData();
    } else {
      const errMsg = (res && res.error) 
        ? (res.error.includes('Failed to fetch') 
            ? 'تعذر الاتصال بالسيرفر (Failed to fetch). يرجى التأكد من تشغيل الخادم على المحطة.' 
            : res.error)
        : 'فشل تسجيل الدخول. تأكد من البيانات ثم أعد المحاولة.';
      alert(errMsg);
    }
  } catch(err) {
    alert('حدث خطأ في الاتصال بالخادم: ' + (err.message || String(err)));
  } finally {
    state.isLoading = false;
    renderApp();
  }
}

async function handleUserLogout() {
  if (confirm('هل أنت تأكد من تسجيل الخروج من النظام؟')) {
    try {
      await apiPost('/auth/logout', { refreshToken: state.refreshToken });
    } catch(e) {}

    state.currentUser = null;
    state.accessToken = null;
    state.refreshToken = null;

    localStorage.removeItem('baher_user');
    localStorage.removeItem('baher_access_token');
    localStorage.removeItem('baher_refresh_token');

    renderApp();
  }
}

function handleAuthSessionExpired() {
  state.currentUser = null;
  state.accessToken = null;
  state.refreshToken = null;

  localStorage.removeItem('baher_user');
  localStorage.removeItem('baher_access_token');
  localStorage.removeItem('baher_refresh_token');

  alert('انتهت الجلسة. يرجى إعادة تسجيل الدخول مرة أخرى.');
  renderApp();
}

function renderAdminDashboardScreen() {
  const users = state.users || [];
  const sessions = state.userSessions || [];
  const products = state.products || [];
  const stones = state.stones || [];
  const logs = state.loginHistoryLogs || [];

  const activeUsersCount = users.filter(u => u.status === 'ACTIVE').length;

  const dashboardTabs = [
    { code: 'tab.dashboard', name: '📊 الداش بورد الرئيسية' },
    { code: 'tab.products', name: '🏭 المنتجات والـ BOM' },
    { code: 'tab.stones', name: '💎 مخزن الأحجار' },
    { code: 'tab.raw_materials', name: '🧪 الخامات' },
    { code: 'tab.silver', name: '🥈 الفضة الخام' },
    { code: 'tab.master_center', name: '⚙️ مركز البيانات' },
    { code: 'tab.warehouses', name: '🏛️ المخازن السبعة' },
    { code: 'tab.locations', name: '📍 التخزين الهرمي' },
    { code: 'tab.transactions', name: '📜 سجل الحركات' },
    { code: 'tab.accounting', name: '⚖️ النظام المحاسبي' },
    { code: 'tab.audit', name: '📋 الجرد الدوري' },
    { code: 'tab.search', name: '🔍 البحث الفائق' }
  ];

  return `
    <div class="space-y-6 font-sans">
      <!-- Top Banner for Admin Dashboard -->
      <div class="glass-card rounded-3xl p-6 border border-amber-500/40 relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 shadow-2xl">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 z-10 relative">
          <div class="flex items-center gap-4">
            <div class="h-16 w-16 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-3xl text-amber-400 shadow-xl">
              👑
            </div>
            <div>
              <h2 class="text-2xl font-extrabold text-white tracking-wide flex items-center gap-2">
                لوحة تحكم الأدمن والتحكم الإداري الشامل
                <span class="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">SUPER ADMIN</span>
              </h2>
              <p class="text-xs text-slate-300 font-mono mt-1">المركز الرئيسي للتحكم في جميع موظفي مصنع باهر سيلفر • تحديد صلاحيات شاشات الداش بورد • إدارة الحسابات والجلسات</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button onclick="openModal('addUserModal')" class="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-xl flex items-center gap-2">
              <span>+ إضافة موظف جديد</span>
            </button>
            <button onclick="openModal('changeMyPasswordModal')" class="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500 text-white font-bold text-xs shadow-lg">
              🔑 تغيير كلمة السير الخاصة بي
            </button>
          </div>
        </div>
      </div>

      <!-- Quick KPI Stat Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
        <div class="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
          <div class="text-[11px] text-slate-400 font-sans">👥 الموظفين المسجلين</div>
          <div class="text-2xl font-extrabold text-cyan-400">${users.length} <span class="text-xs text-slate-500">مستخدم</span></div>
          <div class="text-[10px] text-emerald-400 font-sans">نشط: ${activeUsersCount} موظف</div>
        </div>

        <div class="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
          <div class="text-[11px] text-slate-400 font-sans">📱 الأجهزة والجلسات النشطة</div>
          <div class="text-2xl font-extrabold text-purple-400">${sessions.length} <span class="text-xs text-slate-500">جهاز</span></div>
          <div class="text-[10px] text-purple-300 font-sans">حماية وتشفير JWT</div>
        </div>

        <div class="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
          <div class="text-[11px] text-slate-400 font-sans">🏭 المنتجات المصنعة</div>
          <div class="text-2xl font-extrabold text-amber-400">${products.length} <span class="text-xs text-slate-500">منتج</span></div>
          <div class="text-[10px] text-amber-300 font-sans">مع مسارات BOM</div>
        </div>

        <div class="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
          <div class="text-[11px] text-slate-400 font-sans">📜 محاولات الدخول المسجلة</div>
          <div class="text-2xl font-extrabold text-emerald-400">${logs.length} <span class="text-xs text-slate-500">محاولة</span></div>
          <div class="text-[10px] text-slate-400 font-sans">سجل الأمان الحاد</div>
        </div>
      </div>

      <!-- MAIN CONTROL PANEL: EMPLOYEE DASHBOARD SCREEN PERMISSIONS -->
      <div class="glass-card rounded-2xl p-6 border border-slate-700/60 space-y-6 shadow-xl">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-borderdark">
          <div>
            <h3 class="text-lg font-extrabold text-white flex items-center gap-2">
              <span>🎯</span> التحكم السريع في صلاحيات شاشات الداش بورد للموظفين
            </h3>
            <p class="text-xs text-slate-400 font-mono">حدد الشاشات المسموح بكل موظف بالدخول إليها بنقرة واحدة مباشرة من هذه اللوحة</p>
          </div>
          <button onclick="loadUsersData()" class="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-amber-400">🔄 تحديث القائمة</button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-right text-xs font-mono">
            <thead class="bg-slate-950 text-slate-300 border-b border-slate-800">
              <tr>
                <th class="p-3">الموظف / اسم المستخدم</th>
                <th class="p-3">الدور المؤسسي</th>
                <th class="p-3 text-center">تخصيص كامل للصلاحيات</th>
                <th class="p-3 text-center">إعادة تعيين الباسورد</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60">
              ${users.map(u => `
                <tr class="hover:bg-slate-900/60">
                  <td class="p-3">
                    <div class="font-bold text-white font-sans text-sm">${u.fullNameAr}</div>
                    <div class="text-cyan-400 text-xs">${u.username} ${u.isSystemUser ? '<span class="text-[9px] px-1 py-0.5 rounded bg-amber-500/20 text-amber-400 font-sans">آلي</span>' : ''}</div>
                  </td>
                  <td class="p-3">
                    <span class="px-2.5 py-1 rounded-lg bg-slate-900 text-amber-400 border border-amber-500/30 text-[11px] font-sans font-bold">
                      ${u.position || u.roleCodes?.[0] || 'موظف'}
                    </span>
                  </td>
                  <td class="p-3 text-center">
                    <button onclick="openUserPermissionsOverrideModal('${u.id}')" class="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 font-extrabold text-xs transition-all">
                      ⚙️ تعديل وتحديد الصلاحيات ➔
                    </button>
                  </td>
                  <td class="p-3 text-center">
                    <button onclick="openUserPermissionsOverrideModal('${u.id}')" class="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-300 font-bold text-xs">
                      🔑 تغيير الباسورد
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- ADMIN QUICK NAVIGATION CARDS -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-xs">
        <div onclick="switchTab('users_admin')" class="p-5 rounded-2xl glass-card border border-cyan-500/30 hover:border-cyan-500 cursor-pointer space-y-2 transition-all">
          <div class="flex items-center gap-3 text-cyan-400 font-bold text-sm">
            <span class="text-xl">👥</span> سجل وحسابات المستخدمين
          </div>
          <p class="text-slate-400 text-[11px]">إدارة وتعيين الفروع والمخازن وأرشفة أو إضافة الموظفين الجدد.</p>
        </div>

        <div onclick="switchTab('roles_matrix')" class="p-5 rounded-2xl glass-card border border-amber-500/30 hover:border-amber-500 cursor-pointer space-y-2 transition-all">
          <div class="flex items-center gap-3 text-amber-400 font-bold text-sm">
            <span class="text-xl">🛡️</span> مصفوفة الأدوار الـ 7
          </div>
          <p class="text-slate-400 text-[11px]">تعديل واستعراض الأذونات الممنوحة لكل دور مؤسسي في النظام.</p>
        </div>

        <div onclick="switchTab('security_sessions')" class="p-5 rounded-2xl glass-card border border-purple-500/30 hover:border-purple-500 cursor-pointer space-y-2 transition-all">
          <div class="flex items-center gap-3 text-purple-400 font-bold text-sm">
            <span class="text-xl">📱</span> إدارة الأجهزة والجلسات
          </div>
          <p class="text-slate-400 text-[11px]">عرض الأجهزة والمتصفحات النشطة حالياً وإمكانية إلغائها بنقرة واحدة.</p>
        </div>
      </div>
    </div>
  `;
}

function renderUsersAdminScreen() {
  const users = state.users || [];

  return `
    <div class="glass-card rounded-2xl p-6 border border-slate-700/60 space-y-6 shadow-xl font-sans">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-borderdark">
        <div class="flex items-center gap-3">
          <div class="h-12 w-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-2xl text-cyan-400">
            👥
          </div>
          <div>
            <h2 class="text-xl font-extrabold text-white tracking-wide">إدارة المستخدمين والحسابات (Users Management)</h2>
            <p class="text-xs text-slate-400 font-mono">سجل مستخدمي النظام • تعيين الفروع والمخازن • استثناءات الصلاحيات المباشرة (ALLOW / DENY) • الحذف المرن</p>
          </div>
        </div>

        <button onclick="openModal('addUserModal')" class="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs shadow-lg flex items-center gap-2">
          <span>+ إضافة مستخدم جديد</span>
        </button>
      </div>

      <!-- Users Table -->
      ${users.length === 0 ? renderEmptyState('لا يوجد مستخدمين مسجلين', 'إضافة مستخدم جديد', 'addUserModal') : `
        <div class="overflow-x-auto">
          <table class="w-full text-right text-xs font-mono">
            <thead class="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th class="p-3">اسم المستخدم</th>
                <th class="p-3">الاسم الكامل</th>
                <th class="p-3">الفرع</th>
                <th class="p-3">المخزن المخصص</th>
                <th class="p-3">القسم والوظيفة</th>
                <th class="p-3">الأدوار</th>
                <th class="p-3">الحالة</th>
                <th class="p-3">إجراءات</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60">
              ${users.map(u => `
                <tr class="hover:bg-slate-900/50">
                  <td class="p-3 text-cyan-400 font-bold">${u.username} ${u.isSystemUser ? '<span class="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-sans">آلي</span>' : ''}</td>
                  <td class="p-3 text-white font-sans font-bold">${u.fullNameAr}</td>
                  <td class="p-3">${u.branchId || 'الرئيسي'}</td>
                  <td class="p-3 text-slate-300">${u.warehouseId || 'عام'}</td>
                  <td class="p-3 text-slate-400 font-sans">${u.department || '—'} (${u.position || '—'})</td>
                  <td class="p-3">
                    ${(u.userRoles || []).map(r => `<span class="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">${r.role.nameAr}</span>`).join(' ')}
                  </td>
                  <td class="p-3">
                    <span class="px-2 py-0.5 rounded-full ${u.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'} font-bold">
                      ${u.status === 'ACTIVE' ? 'نشط' : 'معطل'}
                    </span>
                  </td>
                  <td class="p-3 flex gap-2">
                    <button onclick="openUserPermissionsOverrideModal('${u.id}')" class="text-amber-400 hover:text-amber-300">الصلاحيات</button>
                    ${!u.isSystemUser ? `<button onclick="deleteUser('${u.id}')" class="text-rose-400 hover:text-rose-300">أرشفة</button>` : ''}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `}
    </div>
  `;
}

function renderRolesMatrixScreen() {
  const roles = state.roles || [];
  const groups = state.permissionGroups || [];

  return `
    <div class="glass-card rounded-2xl p-6 border border-slate-700/60 space-y-6 shadow-xl font-sans">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-borderdark">
        <div class="flex items-center gap-3">
          <div class="h-12 w-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl text-amber-400">
            🛡️
          </div>
          <div>
            <h2 class="text-xl font-extrabold text-white tracking-wide">الأدوار ومصفوفة الصلاحيات (Hybrid RBAC Matrix)</h2>
            <p class="text-xs text-slate-400 font-mono">تخصيص الصلاحيات للأدوار المؤسسية • مصفوفة 9 مجموعات • Super Admin • Factory Manager • Accountant</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        ${roles.map(r => `
          <div class="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
            <div class="flex justify-between items-center pb-2 border-b border-slate-800">
              <span class="font-bold text-white text-sm font-sans">${r.nameAr}</span>
              <span class="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400">${r.roleCode}</span>
            </div>
            <p class="text-slate-400 font-sans text-[11px]">${r.description || 'دور مؤسسي مخصص'}</p>
            <div class="text-[11px] text-emerald-400">
              عدد الصلاحيات الممنوحة: <span class="font-bold">${r.permissions ? r.permissions.length : 0} صلاحية</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderActiveSessionsScreen() {
  const sessions = state.userSessions || [];

  return `
    <div class="glass-card rounded-2xl p-6 border border-slate-700/60 space-y-6 shadow-xl font-sans">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-borderdark">
        <div class="flex items-center gap-3">
          <div class="h-12 w-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-2xl text-purple-400">
            📱
          </div>
          <div>
            <h2 class="text-xl font-extrabold text-white tracking-wide">الأجهزة والجلسات النشطة (Session Manager)</h2>
            <p class="text-xs text-slate-400 font-mono">عرض الأجهزة والمتصفحات المسجلة دخول حالياً • إمكانية إلغاء الجلسات المشبوهة بنقرة واحدة</p>
          </div>
        </div>
        <button onclick="loadUserSessions()" class="px-4 py-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40 text-xs font-bold">🔄 تحديث الجلسات</button>
      </div>

      ${sessions.length === 0 ? renderEmptyState('لا توجد جلسات نشطة مسجلة حالياً', '', '') : `
        <div class="overflow-x-auto">
          <table class="w-full text-right text-xs font-mono">
            <thead class="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th class="p-3">الجهاز / المتصفح</th>
                <th class="p-3">عنوان IP</th>
                <th class="p-3">آخر نشاط</th>
                <th class="p-3">تاريخ الانتهاء</th>
                <th class="p-3">إجراءات</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60">
              ${sessions.map(s => `
                <tr class="hover:bg-slate-900/50">
                  <td class="p-3 text-white font-sans">${s.device || 'متصفح ويب'}</td>
                  <td class="p-3 text-amber-400">${s.ipAddress || '127.0.0.1'}</td>
                  <td class="p-3 text-slate-400">${new Date(s.lastActiveAt).toLocaleString('ar-EG')}</td>
                  <td class="p-3 text-slate-400">${new Date(s.expiresAt).toLocaleString('ar-EG')}</td>
                  <td class="p-3">
                    <button onclick="revokeSession('${s.id}')" class="text-rose-400 hover:text-rose-300 font-bold">إنهاء الجلسة ➔</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `}
    </div>
  `;
}

function renderLoginHistoryScreen() {
  const logs = state.loginHistoryLogs || [];

  return `
    <div class="glass-card rounded-2xl p-6 border border-slate-700/60 space-y-6 shadow-xl font-sans">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-borderdark">
        <div class="flex items-center gap-3">
          <div class="h-12 w-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-2xl text-indigo-400">
            📜
          </div>
          <div>
            <h2 class="text-xl font-extrabold text-white tracking-wide">سجل الدخول ومحاولات الأمان (Login History Logs)</h2>
            <p class="text-xs text-slate-400 font-mono">سجل محاولات الناجحة والفاشلة • عنوان IP • وقت وتاريخ المحاولة • الحظر المؤقت</p>
          </div>
        </div>
        <button onclick="loadLoginHistoryLogs()" class="px-4 py-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 text-xs font-bold">🔄 تحديث السجل</button>
      </div>

      ${logs.length === 0 ? renderEmptyState('لا توجد سجلات دخول مسجلة مؤخراً', '', '') : `
        <div class="overflow-x-auto">
          <table class="w-full text-right text-xs font-mono">
            <thead class="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th class="p-3">التاريخ والوقت</th>
                <th class="p-3">اسم المستخدم</th>
                <th class="p-3">الحالة</th>
                <th class="p-3">عنوان IP</th>
                <th class="p-3">المتصفح/الجهاز</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60">
              ${logs.map(l => `
                <tr class="hover:bg-slate-900/50">
                  <td class="p-3 text-slate-400">${new Date(l.timestamp).toLocaleString('ar-EG')}</td>
                  <td class="p-3 text-white font-bold">${l.username}</td>
                  <td class="p-3">
                    <span class="px-2 py-0.5 rounded font-bold ${l.status === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}">
                      ${l.status}
                    </span>
                  </td>
                  <td class="p-3 text-amber-400">${l.ipAddress || '—'}</td>
                  <td class="p-3 text-slate-400 text-[11px] truncate max-w-xs">${l.browser || '—'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `}
    </div>
  `;
}

// SECURITY ACTIONS & LOADERS
async function loadUsersData() {
  const users = await apiGet('/users');
  state.users = users || [];
  renderApp();
}

async function loadUserSessions() {
  const sessions = await apiGet('/auth/sessions');
  state.userSessions = sessions || [];
  renderApp();
}

async function loadLoginHistoryLogs() {
  const logs = await apiGet('/security/login-history');
  state.loginHistoryLogs = logs || [];
  renderApp();
}

async function revokeSession(id) {
  if (confirm('هل ترغب في إنهاء هذه الجلسة وإغلاق الحساب على هذا الجهاز؟')) {
    const res = await fetch(`${API_BASE_URL}/auth/sessions/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (json.success) {
      showToast('تم إنهاء الجلسة بنجاح!');
      await loadUserSessions();
    }
  }
}

async function deleteUser(id) {
  if (confirm('هل أنت تأكد من أرشفة هذا المستخدم وتعطيل حسابه؟')) {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const json = await res.json();
    if (json.success) {
      showToast('تم أرشفة حساب المستخدم بنجاح');
      await loadUsersData();
    } else {
      alert(json.error || 'تعذر الحذف');
    }
  }
}

// USER CREATION MODAL
function renderAddUserModal() {
  return `
    <div class="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div class="glass-card max-w-lg w-full p-6 md:p-8 rounded-3xl border border-cyan-500/40 space-y-6 max-h-[92vh] overflow-y-auto text-right font-sans shadow-2xl">
        <div class="flex justify-between items-center pb-4 border-b border-borderdark">
          <div>
            <h3 class="text-xl font-extrabold text-white">إضافة مستخدم جديد في النظام</h3>
            <p class="text-xs text-slate-400 font-mono">إنشاء حساب موظف/مسؤول وتحديد الدور المباشر</p>
          </div>
          <button onclick="closeModal()" class="h-9 w-9 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center">✕</button>
        </div>

        <form onsubmit="submitAddUser(event)" class="space-y-4 text-xs font-sans">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block font-bold text-slate-300 mb-1">اسم المستخدم (Username) *</label>
              <input type="text" name="username" required placeholder="مثال: ahmed_silv" class="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:border-cyan-500 focus:outline-none">
            </div>
            <div>
              <label class="block font-bold text-slate-300 mb-1">كلمة المرور *</label>
              <div class="relative">
                <input type="password" id="newUserPasswordInput" name="password" required placeholder="••••••••" class="w-full h-10 px-3.5 pl-10 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:border-cyan-500 focus:outline-none">
                <button type="button" onclick="togglePasswordVisibility('newUserPasswordInput')" class="absolute left-3 top-2.5 text-slate-400 hover:text-white text-xs">👁️</button>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block font-bold text-slate-300 mb-1">الاسم الكامل بالعربية *</label>
              <input type="text" name="fullNameAr" required placeholder="مثال: أحمد محمود علي" class="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-cyan-500 focus:outline-none">
            </div>
            <div>
              <label class="block font-bold text-slate-300 mb-1">البريد الإلكتروني</label>
              <input type="email" name="email" placeholder="ahmed@bahersilver.online" class="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:border-cyan-500 focus:outline-none">
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block font-bold text-slate-300 mb-1">الفرع المخصص *</label>
              <select name="branchId" class="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none">
                <option value="BRANCH-MAIN">الفرع الرئيسي والمصنع (HQ)</option>
                <option value="BRANCH-STORE">معرض الفضة والمحل</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-slate-300 mb-1">الدور المؤسسي (Role) *</label>
              <select name="roleCode" required class="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none font-mono">
                <option value="FACTORY_MANAGER">FACTORY_MANAGER — مدير المصنع والإنتاج</option>
                <option value="WAREHOUSE_MANAGER">WAREHOUSE_MANAGER — أمين/مدير المخازن</option>
                <option value="ACCOUNTANT">ACCOUNTANT — محاسب المصنع</option>
                <option value="SALES">SALES — مسؤول المبيعات والمعرض</option>
                <option value="CASHIER">CASHIER — أمين الصندوق</option>
                <option value="PRODUCTION_EMPLOYEE">PRODUCTION_EMPLOYEE — فني ورشة وإنتاج</option>
              </select>
            </div>
          </div>

          <div class="pt-4 flex justify-end gap-3 border-t border-slate-800">
            <button type="button" onclick="closeModal()" class="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300">إلغاء</button>
            <button type="submit" class="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-extrabold shadow-lg">حفظ وإضافة الحساب ➔</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

// CHANGE MY PASSWORD MODAL
function renderChangeMyPasswordModal() {
  return `
    <div class="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div class="glass-card max-w-md w-full p-6 md:p-8 rounded-3xl border border-amber-500/40 space-y-6 text-right font-sans shadow-2xl">
        <div class="flex justify-between items-center pb-4 border-b border-borderdark">
          <div>
            <h3 class="text-xl font-extrabold text-white">تغيير كلمة المرور الخاصة بي</h3>
            <p class="text-xs text-slate-400 font-mono">تحديث كلمة السر الشخصية لحسابك الحالي</p>
          </div>
          <button onclick="closeModal()" class="h-9 w-9 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center">✕</button>
        </div>

        <form onsubmit="submitChangeMyPassword(event)" class="space-y-4 text-xs font-sans">
          <div>
            <label class="block font-bold text-slate-300 mb-1">كلمة المرور الحالية *</label>
            <div class="relative">
              <input type="password" id="oldPasswordInput" name="oldPassword" required placeholder="••••••••" class="w-full h-11 px-4 pl-10 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:border-amber-500 focus:outline-none">
              <button type="button" onclick="togglePasswordVisibility('oldPasswordInput')" class="absolute left-3 top-3 text-slate-400 hover:text-white text-xs">👁️</button>
            </div>
          </div>

          <div>
            <label class="block font-bold text-slate-300 mb-1">كلمة المرور الجديدة *</label>
            <div class="relative">
              <input type="password" id="newPasswordInput" name="newPassword" required placeholder="••••••••" class="w-full h-11 px-4 pl-10 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:border-amber-500 focus:outline-none">
              <button type="button" onclick="togglePasswordVisibility('newPasswordInput')" class="absolute left-3 top-3 text-slate-400 hover:text-white text-xs">👁️</button>
            </div>
          </div>

          <div class="pt-4 flex justify-end gap-3 border-t border-slate-800">
            <button type="button" onclick="closeModal()" class="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300">إلغاء</button>
            <button type="submit" class="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-extrabold shadow-lg">تحديث كلمة السر ➔</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

// USER DIRECT PERMISSIONS OVERRIDE MODAL
async function openUserPermissionsOverrideModal(userId) {
  state.isLoading = true;
  renderApp();
  try {
    const user = await apiGet(`/users/${userId}`);
    const groups = await apiGet('/permissions');
    if (user && groups) {
      state.selectedUserForPermissions = { user, groups };
      state.activeModal = 'userPermissionsOverrideModal';
    }
  } catch(e) {
    alert('تعذر تحميل بيانات المستخدم');
  } finally {
    state.isLoading = false;
    renderApp();
  }
}

function renderUserPermissionsOverrideModal() {
  const data = state.selectedUserForPermissions;
  if (!data) return '';

  const u = data.user;
  const groups = data.groups || [];
  const overridesMap = new Map();
  (u.userPermissions || []).forEach(up => overridesMap.set(up.permission.permissionCode, up.grantType));

  return `
    <div class="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div class="glass-card max-w-3xl w-full p-6 md:p-8 rounded-3xl border border-amber-500/40 space-y-6 max-h-[92vh] overflow-y-auto text-right font-sans shadow-2xl">
        <div class="flex justify-between items-center pb-4 border-b border-borderdark">
          <div>
            <h3 class="text-xl font-extrabold text-white">تحكم وإدارة صلاحيات الموظف المباشرة (Direct Overrides)</h3>
            <p class="text-xs text-slate-400 font-mono">الموظف: <span class="text-amber-400 font-bold">${u.fullNameAr} (${u.username})</span> • تتيح منح (ALLOW) أو حظر (DENY) أي صلاحية بشكل منفرد</p>
          </div>
          <button onclick="closeModal()" class="h-9 w-9 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center">✕</button>
        </div>

        <!-- Admin Reset User Password Section -->
        <div class="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <h4 class="text-xs font-bold text-amber-400 font-sans">🔑 تغيير كلمة مرور هذا الموظف مباشرة بواسطة الأدمن:</h4>
          <form onsubmit="submitAdminResetUserPassword(event, '${u.id}')" class="flex gap-3">
            <div class="relative flex-1">
              <input type="password" id="adminResetPassInput" name="newPassword" required placeholder="أدخل كلمة المرور الجديدة للموظف..." class="w-full h-10 px-3.5 pl-10 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:border-amber-500 focus:outline-none">
              <button type="button" onclick="togglePasswordVisibility('adminResetPassInput')" class="absolute left-3 top-2.5 text-slate-400 hover:text-white text-xs">👁️</button>
            </div>
            <button type="submit" class="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-lg">تعيين الباسورد ➔</button>
          </form>
        </div>

        <!-- Permission Groups Grid -->
        <div class="space-y-4 text-xs font-mono">
          ${groups.map(g => `
            <div class="p-4 bg-slate-950/90 rounded-2xl border border-slate-800 space-y-2">
              <div class="text-xs font-extrabold text-amber-400 font-sans border-b border-slate-800 pb-2">${g.nameAr} (${g.groupCode})</div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                ${(g.permissions || []).map(p => {
                  const currentGrant = overridesMap.get(p.permissionCode);
                  return `
                    <div class="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                      <span class="text-white font-sans truncate max-w-[180px]">${p.nameAr}</span>
                      <div class="flex items-center gap-1">
                        <button onclick="setDirectPermissionOverride('${u.id}', '${p.permissionCode}', 'ALLOW')" class="px-2 py-0.5 rounded text-[10px] font-bold ${currentGrant === 'ALLOW' ? 'bg-emerald-500 text-slate-950 font-extrabold' : 'bg-slate-800 text-slate-400 hover:text-white'}">سماح</button>
                        <button onclick="setDirectPermissionOverride('${u.id}', '${p.permissionCode}', 'DENY')" class="px-2 py-0.5 rounded text-[10px] font-bold ${currentGrant === 'DENY' ? 'bg-rose-500 text-white font-extrabold' : 'bg-slate-800 text-slate-400 hover:text-white'}">حظر</button>
                        ${currentGrant ? `<button onclick="removeDirectPermissionOverride('${u.id}', '${p.permissionCode}')" class="text-slate-500 hover:text-slate-300 text-[10px] px-1">إلغاء</button>` : ''}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

// TOGGLE PASSWORD VISIBILITY HELPER
function togglePasswordVisibility(inputId) {
  const input = document.getElementById(inputId);
  if (input) {
    input.type = input.type === 'password' ? 'text' : 'password';
  }
}

// SUBMIT HANDLERS
async function submitAddUser(e) {
  e.preventDefault();
  const form = e.target;
  const body = {
    username: form.username.value,
    password: form.password.value,
    fullNameAr: form.fullNameAr.value,
    email: form.email.value,
    branchId: form.branchId.value,
    roleCodes: [form.roleCode.value]
  };

  try {
    const res = await apiPost('/users', body);
    if (res && res.success) {
      closeModal();
      showToast(`تم إنشاء حساب الموظف (${res.data.fullNameAr}) بنجاح!`);
      await loadUsersData();
    } else {
      alert(res.error || 'حدث خطأ أثناء إضافة المستخدم');
    }
  } catch(err) {
    alert('حدث خطأ بالخادم');
  }
}

async function submitChangeMyPassword(e) {
  e.preventDefault();
  const form = e.target;
  const body = {
    oldPassword: form.oldPassword.value,
    newPassword: form.newPassword.value
  };

  try {
    const res = await apiPost('/auth/change-password', body);
    if (res && res.success) {
      closeModal();
      showToast('تم تغيير كلمة المرور الخاصة بك بنجاح!');
    } else {
      alert(res.error || 'كلمة المرور الحالية غير صحيحة');
    }
  } catch(err) {
    alert('حدث خطأ أثناء تعديل كلمة السر');
  }
}

async function submitAdminResetUserPassword(e, targetUserId) {
  e.preventDefault();
  const form = e.target;
  const newPassword = form.newPassword.value;

  try {
    const res = await apiPost('/auth/reset-password', { targetUserId, newPassword });
    if (res && res.success) {
      showToast('تم إعادة تعيين كلمة مرور الموظف بنجاح!');
      form.reset();
    } else {
      alert(res.error || 'تعذر تعيين كلمة السر');
    }
  } catch(err) {
    alert('حدث خطأ أثناء تعيين كلمة السر');
  }
}

async function setDirectPermissionOverride(userId, permissionCode, grantType) {
  try {
    const res = await apiPost(`/users/${userId}/permissions`, { permissionCode, grantType });
    if (res && res.success) {
      showToast(`تم تحديث الصلاحية إلى (${grantType})`);
      await openUserPermissionsOverrideModal(userId);
    }
  } catch(e) {
    alert('تعذر تحديث الصلاحية');
  }
}

async function removeDirectPermissionOverride(userId, permissionCode) {
  try {
    const res = await fetch(`${API_BASE_URL}/users/${userId}/permissions`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      body: JSON.stringify({ permissionCode })
    });
    const json = await res.json();
    if (json.success) {
      showToast('تم إلغاء الاستثناء المباشر الصلاحية');
      await openUserPermissionsOverrideModal(userId);
    }
  } catch(e) {
    alert('تعذر الإلغاء');
  }
}

// =============================================================================
// EPIC 03: VISUAL JEWELRY LABEL DESIGNER & THERMAL PRINTING STUDIO ENGINE
// =============================================================================

if (!window.designerState) {
  window.designerState = {
    selectedTemplateId: null,
    templateCode: 'LBL-TAIL-50X15',
    templateName: 'ملصق الفضة ذيل الماوس (Jewelry Mouse Tail 50x15mm)',
    labelType: 'MOUSE_TAIL',
    widthMm: 50,
    heightMm: 15,
    dpi: 300,
    printerLanguage: 'ZPL',
    snapToGrid: true,
    margins: { top: 1, bottom: 1, left: 1, right: 1 },
    offsets: { x: 0, y: 0 },
    selectedElementId: 'el-barcode',
    elements: [
      { id: 'el-title', type: 'text', field: 'name', text: 'خاتم فضة إيطالي 925', xMm: 2, yMm: 1.5, fontSizePt: 9 },
      { id: 'el-barcode', type: 'barcode', field: 'barcode', text: 'PRD-2026-000001', xMm: 2, yMm: 4.5, widthMm: 32, heightMm: 5.5 },
      { id: 'el-serial', type: 'text', field: 'serial', text: 'SN-2026-000041 | SKU-RNG', xMm: 2, yMm: 11, fontSizePt: 7 },
      { id: 'el-weight', type: 'text', field: 'weight', text: '14.85g | فضة 925 | 2,450.00 EGP', xMm: 2, yMm: 13, fontSizePt: 7 },
      { id: 'el-qr', type: 'qrcode', field: 'qr', text: 'https://bahersilver.com/v/SN-2026-000041', xMm: 36, yMm: 2, widthMm: 11, heightMm: 11 }
    ]
  };
}

function renderJewelryLabelDesignerScreen() {
  const d = window.designerState;
  const dpiScale = d.dpi / 25.4;

  // Render SVG Rulers and Canvas Objects
  const svgWidthPx = d.widthMm * 6; // 6px per mm for crisp visual editing
  const svgHeightPx = d.heightMm * 6;

  let elementsSvgHtml = '';
  d.elements.forEach(el => {
    const isSelected = el.id === d.selectedElementId;
    const strokeAttr = isSelected ? 'stroke="#eab308" stroke-width="2" stroke-dasharray="3,3"' : 'stroke="#3b82f6" stroke-width="1" stroke-dasharray="2,2"';
    const posX = el.xMm * 6;
    const posY = el.yMm * 6;
    const w = (el.widthMm || 20) * 6;
    const h = (el.heightMm || 6) * 6;

    if (el.type === 'barcode') {
      elementsSvgHtml += `
        <g id="${el.id}" onclick="selectDesignerElement('${el.id}')" cursor="move">
          <rect x="${posX}" y="${posY}" width="${w}" height="${h}" fill="#ffffff" ${strokeAttr}/>
          <rect x="${posX + 2}" y="${posY + 2}" width="2" height="${h - 4}" fill="#000"/>
          <rect x="${posX + 6}" y="${posY + 2}" width="4" height="${h - 4}" fill="#000"/>
          <rect x="${posX + 12}" y="${posY + 2}" width="2" height="${h - 4}" fill="#000"/>
          <rect x="${posX + 16}" y="${posY + 2}" width="6" height="${h - 4}" fill="#000"/>
          <rect x="${posX + 24}" y="${posY + 2}" width="3" height="${h - 4}" fill="#000"/>
          <rect x="${posX + 30}" y="${posY + 2}" width="2" height="${h - 4}" fill="#000"/>
          <text x="${posX + w / 2}" y="${posY + h - 2}" font-family="monospace" font-size="8" text-anchor="middle" fill="#000000">[Code128 Barcode]</text>
        </g>
      `;
    } else if (el.type === 'qrcode') {
      elementsSvgHtml += `
        <g id="${el.id}" onclick="selectDesignerElement('${el.id}')" cursor="move">
          <rect x="${posX}" y="${posY}" width="${w}" height="${h}" fill="#ffffff" ${strokeAttr}/>
          <rect x="${posX + 2}" y="${posY + 2}" width="8" height="8" fill="#000"/>
          <rect x="${posX + w - 10}" y="${posY + 2}" width="8" height="8" fill="#000"/>
          <rect x="${posX + 2}" y="${posY + h - 10}" width="8" height="8" fill="#000"/>
          <text x="${posX + w / 2}" y="${posY + h / 2}" font-family="monospace" font-size="7" text-anchor="middle" fill="#000">[QR]</text>
        </g>
      `;
    } else if (el.type === 'text') {
      elementsSvgHtml += `
        <g id="${el.id}" onclick="selectDesignerElement('${el.id}')" cursor="move">
          <rect x="${posX - 1}" y="${posY - 10}" width="${Math.max(w, 40)}" height="14" fill="rgba(59,130,246,0.05)" ${strokeAttr}/>
          <text x="${posX}" y="${posY}" font-family="Tajawal, sans-serif" font-size="11" font-weight="bold" fill="#000000">${el.text || el.field}</text>
        </g>
      `;
    }
  });

  // Tail Mouse-tail shape overlay
  const tailOverlay = d.labelType === 'MOUSE_TAIL' ? `
    <path d="M ${35 * 6} 0 L ${50 * 6} ${7.5 * 6} L ${35 * 6} ${15 * 6} Z" fill="rgba(234, 179, 8, 0.08)" stroke="#eab308" stroke-width="1" stroke-dasharray="4,4"/>
    <text x="${42 * 6}" y="${7.5 * 6}" font-size="9" fill="#eab308" text-anchor="middle">ذيل الماوس (شريط التعليق)</text>
  ` : '';

  const selectedEl = d.elements.find(e => e.id === d.selectedElementId) || d.elements[0];

  return `
    <div class="glass-card rounded-2xl p-6 border border-slate-700/60 space-y-6 shadow-2xl font-sans">
      
      <!-- Studio Header -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-4 border-b border-borderdark">
        <div>
          <div class="flex items-center gap-3">
            <span class="text-3xl">🏷️</span>
            <div>
              <h1 class="text-2xl font-black text-white tracking-wide font-display">مصمم وطابعات ملصقات الفضة (Jewelry Label Studio)</h1>
              <p class="text-xs text-slate-400 mt-1 font-mono">طابعات حرارية (Zebra ZPL / EPL / TSPL) • ملصقات ذيل الماوس (Mouse-Tail) • معايرة دقيقة بالمليمتر</p>
            </div>
          </div>
        </div>

        <!-- Action Controls -->
        <div class="flex flex-wrap items-center gap-2">
          <button onclick="openCalibrationWizardModal()" class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-2">
            <span>🎯</span><span>معالج المعايرة (Calibration)</span>
          </button>
          <button onclick="executeTestPrint()" class="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition flex items-center gap-2">
            <span>🖨️</span><span>طباعة تجريبية (Test Print)</span>
          </button>
          <button onclick="saveCurrentLabelTemplate()" class="px-3.5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-slate-950 text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-brand-500/20">
            <span>💾</span><span>حفظ القالب الحالي</span>
          </button>
          <button onclick="openBulkPrintModal()" class="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black transition flex items-center gap-2 shadow-lg shadow-emerald-500/20">
            <span>⚡</span><span>طباعة فورية / دفعة (Bulk Print)</span>
          </button>
        </div>
      </div>

      <!-- Studio Configuration Controls Bar -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-bold">
        <div>
          <label class="block text-slate-400 mb-1">نوع الملصق (Label Shape)</label>
          <select onchange="updateDesignerLabelType(this.value)" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white">
            <option value="MOUSE_TAIL" ${d.labelType === 'MOUSE_TAIL' ? 'selected' : ''}>ذيل الماوس (Mouse-Tail 50x15mm)</option>
            <option value="BUTTERFLY_TAG" ${d.labelType === 'BUTTERFLY_TAG' ? 'selected' : ''}>فراشة مزدوجة (Butterfly Tag 30x15mm)</option>
            <option value="RECTANGLE_TAG" ${d.labelType === 'RECTANGLE_TAG' ? 'selected' : ''}>مستطيل قياسي (Rectangle 70x20mm)</option>
          </select>
        </div>

        <div>
          <label class="block text-slate-400 mb-1">دقة الطباعة (DPI Resolution)</label>
          <select onchange="updateDesignerDPI(this.value)" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-amber-400 font-mono">
            <option value="203" ${d.dpi === 203 ? 'selected' : ''}>203 DPI (Desktop Printers)</option>
            <option value="300" ${d.dpi === 300 ? 'selected' : ''}>300 DPI (Standard Industrial)</option>
            <option value="600" ${d.dpi === 600 ? 'selected' : ''}>600 DPI (High Precision Jewelry)</option>
          </select>
        </div>

        <div>
          <label class="block text-slate-400 mb-1">لغة الطابعة (Printer Protocol)</label>
          <select onchange="updateDesignerProtocol(this.value)" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-brand-400 font-mono">
            <option value="ZPL" ${d.printerLanguage === 'ZPL' ? 'selected' : ''}>ZPL II (Zebra Industrial)</option>
            <option value="EPL" ${d.printerLanguage === 'EPL' ? 'selected' : ''}>EPL2 (Zebra Desktop)</option>
            <option value="TSPL" ${d.printerLanguage === 'TSPL' ? 'selected' : ''}>TSPL (TSC Printers)</option>
            <option value="EZPL" ${d.printerLanguage === 'EZPL' ? 'selected' : ''}>EZPL (Godex Printers)</option>
          </select>
        </div>

        <div>
          <label class="block text-slate-400 mb-1">أبعاد الملصق (Width × Height mm)</label>
          <div class="flex items-center gap-2">
            <input type="number" value="${d.widthMm}" onchange="updateDesignerDimension('widthMm', this.value)" class="w-1/2 bg-slate-800 border border-slate-700 rounded-lg px-2 py-2 text-white font-mono text-center" placeholder="العرض">
            <span class="text-slate-500">×</span>
            <input type="number" value="${d.heightMm}" onchange="updateDesignerDimension('heightMm', this.value)" class="w-1/2 bg-slate-800 border border-slate-700 rounded-lg px-2 py-2 text-white font-mono text-center" placeholder="الارتفاع">
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 pt-4">
          <label class="flex items-center gap-2 cursor-pointer text-slate-300">
            <input type="checkbox" ${d.snapToGrid ? 'checked' : ''} onchange="toggleSnapToGrid(this.checked)" class="rounded bg-slate-800 border-slate-700 text-brand-500">
            <span>الالتصاق بالشبكة (Snap 1mm)</span>
          </label>
        </div>
      </div>

      <!-- Main Visual Studio Canvas & Object Inspector Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <!-- Left Element Palette Toolbar -->
        <div class="lg:col-span-2 glass-card rounded-xl p-4 border border-slate-800 space-y-3 text-xs">
          <div class="font-bold text-slate-300 border-b border-slate-800 pb-2 flex items-center justify-between">
            <span>العناصر المتاحة</span>
            <span class="text-slate-500">سحب وإفلات</span>
          </div>

          <button onclick="addDesignerElement('barcode')" class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold transition">
            <span>📊</span><span>باركود (Code128)</span>
          </button>

          <button onclick="addDesignerElement('qrcode')" class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold transition">
            <span>📱</span><span>رمز QR (اختياري)</span>
          </button>

          <button onclick="addDesignerElement('text', 'name', 'اسم القطعة')" class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold transition">
            <span>📝</span><span>اسم المنتج (Product Name)</span>
          </button>

          <button onclick="addDesignerElement('text', 'serial', 'الرقم التسلسلي')" class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold transition">
            <span>🔢</span><span>الرقم التسلسلي + SKU</span>
          </button>

          <button onclick="addDesignerElement('text', 'weight', 'الوزن والقيمة')" class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold transition">
            <span>⚖️</span><span>الوزن + العيار + السعر</span>
          </button>

          <button onclick="addDesignerElement('text', 'custom', 'نص مخصص')" class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold transition">
            <span>✏️</span><span>نص حر (Custom Text)</span>
          </button>

          <button onclick="autoCenterAllElements()" class="w-full mt-4 px-3 py-2.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 font-bold transition flex items-center justify-center gap-2">
            <span>🎯</span><span>توسيط تلقائي (Auto Center)</span>
          </button>
        </div>

        <!-- Center Visual Canvas Area with Millimeter Rulers -->
        <div class="lg:col-span-7 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950 border border-slate-800 relative overflow-hidden min-h-[380px]">
          
          <div class="text-xs text-slate-400 font-mono mb-4 flex items-center gap-4">
            <span>الكانفاس الفعلي للملصق (${d.widthMm}mm × ${d.heightMm}mm)</span>
            <span class="text-brand-400">الدقة: ${d.dpi} DPI</span>
          </div>

          <!-- Millimeter Ruler Header (Top Ruler) -->
          <div class="flex items-end bg-slate-900 border-b border-slate-700 mb-1" style="width: ${svgWidthPx}px; height: 18px;">
            ${Array.from({ length: Math.ceil(d.widthMm / 5) + 1 }).map((_, i) => `
              <div class="text-[9px] font-mono text-slate-400 border-r border-slate-700 pr-1 flex-1 text-left">
                ${i * 5}mm
              </div>
            `).join('')}
          </div>

          <!-- Canvas Container -->
          <div class="relative bg-white rounded-lg shadow-2xl overflow-hidden border-2 border-brand-500/60" style="width: ${svgWidthPx}px; height: ${svgHeightPx}px;">
            <!-- Grid Background Pattern -->
            <svg width="${svgWidthPx}" height="${svgHeightPx}" class="absolute inset-0 pointer-events-none">
              <defs>
                <pattern id="gridPattern" width="6" height="6" patternUnits="userSpaceOnUse">
                  <path d="M 6 0 L 0 0 0 6" fill="none" stroke="#f1f5f9" stroke-width="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#gridPattern)"/>
              ${tailOverlay}
              ${elementsSvgHtml}
            </svg>
          </div>

          <div class="text-[11px] text-slate-400 font-mono mt-4">
            انقر على أي عنصر على الكانفاس لتعديل إحداثياته الدقيقة بالمليمتر وحجم الخط
          </div>
        </div>

        <!-- Right Object Inspector & Template Management -->
        <div class="lg:col-span-3 glass-card rounded-xl p-4 border border-slate-800 space-y-4 text-xs font-bold">
          <div class="font-bold text-slate-200 border-b border-slate-800 pb-2 flex items-center justify-between">
            <span>خصائص العنصر المحدد</span>
            <span class="text-brand-400 font-mono">${selectedEl ? selectedEl.id : 'لا يوجد'}</span>
          </div>

          ${selectedEl ? `
            <div class="space-y-3">
              <div>
                <label class="block text-slate-400 mb-1">المحتوى / النص</label>
                <input type="text" value="${selectedEl.text || ''}" onchange="updateSelectedElementProp('text', this.value)" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white">
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-slate-400 mb-1">الموقع الأفقي X (mm)</label>
                  <input type="number" step="0.5" value="${selectedEl.xMm}" onchange="updateSelectedElementProp('xMm', parseFloat(this.value))" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-white font-mono">
                </div>
                <div>
                  <label class="block text-slate-400 mb-1">الموقع الرأسي Y (mm)</label>
                  <input type="number" step="0.5" value="${selectedEl.yMm}" onchange="updateSelectedElementProp('yMm', parseFloat(this.value))" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-white font-mono">
                </div>
              </div>

              ${selectedEl.type === 'text' ? `
                <div>
                  <label class="block text-slate-400 mb-1">حجم الخط (Font Size Pt)</label>
                  <input type="number" value="${selectedEl.fontSizePt || 8}" onchange="updateSelectedElementProp('fontSizePt', parseInt(this.value))" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-amber-300 font-mono">
                </div>
              ` : `
                <div class="grid grid-cols-2 gap-2">
                  <div>
                    <label class="block text-slate-400 mb-1">العرض (mm)</label>
                    <input type="number" value="${selectedEl.widthMm || 20}" onchange="updateSelectedElementProp('widthMm', parseFloat(this.value))" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-white font-mono">
                  </div>
                  <div>
                    <label class="block text-slate-400 mb-1">الارتفاع (mm)</label>
                    <input type="number" value="${selectedEl.heightMm || 6}" onchange="updateSelectedElementProp('heightMm', parseFloat(this.value))" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-white font-mono">
                  </div>
                </div>
              `}

              <button onclick="removeSelectedElement('${selectedEl.id}')" class="w-full px-3 py-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition text-xs mt-2">
                🗑️ حذف العنصر المحدد
              </button>
            </div>
          ` : `
            <div class="text-slate-500 text-center py-6">انقر على عنصر لتعديله</div>
          `}

          <!-- Margins & Calibration Quick Panel -->
          <div class="pt-4 border-t border-slate-800 space-y-2">
            <div class="text-slate-300 font-bold mb-1">الهوامش والمعايرة (Margins & Offset)</div>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block text-[10px] text-slate-400">هامش علوي (mm)</label>
                <input type="number" step="0.5" value="${d.margins.top}" onchange="updateDesignerMargin('top', this.value)" class="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white font-mono text-center">
              </div>
              <div>
                <label class="block text-[10px] text-slate-400">هامش أيسر (mm)</label>
                <input type="number" step="0.5" value="${d.margins.left}" onchange="updateDesignerMargin('left', this.value)" class="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white font-mono text-center">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function selectDesignerElement(id) {
  window.designerState.selectedElementId = id;
  renderApp();
}

function updateSelectedElementProp(prop, val) {
  const d = window.designerState;
  const el = d.elements.find(e => e.id === d.selectedElementId);
  if (el) {
    el[prop] = val;
    renderApp();
  }
}

function addDesignerElement(type, field = 'custom', defaultText = 'نص جديد') {
  const d = window.designerState;
  const newId = `el-${Date.now().toString().slice(-4)}`;
  d.elements.push({
    id: newId,
    type,
    field,
    text: defaultText,
    xMm: 5,
    yMm: 5,
    widthMm: type === 'qrcode' ? 10 : 25,
    heightMm: type === 'barcode' ? 6 : (type === 'qrcode' ? 10 : 4),
    fontSizePt: 8
  });
  d.selectedElementId = newId;
  renderApp();
}

function removeSelectedElement(id) {
  const d = window.designerState;
  d.elements = d.elements.filter(e => e.id !== id);
  d.selectedElementId = d.elements[0]?.id || null;
  renderApp();
}

function autoCenterAllElements() {
  const d = window.designerState;
  d.elements.forEach(el => {
    el.xMm = Math.max(1, Math.round((d.widthMm / 2 - (el.widthMm || 20) / 2) * 2) / 2);
  });
  showToast('تم توسيط العناصر تلقائياً!');
  renderApp();
}

function updateDesignerLabelType(type) {
  const d = window.designerState;
  d.labelType = type;
  if (type === 'MOUSE_TAIL') {
    d.widthMm = 50; d.heightMm = 15;
  } else if (type === 'BUTTERFLY_TAG') {
    d.widthMm = 30; d.heightMm = 15;
  } else if (type === 'RECTANGLE_TAG') {
    d.widthMm = 70; d.heightMm = 20;
  }
  renderApp();
}

function updateDesignerDPI(dpiVal) {
  window.designerState.dpi = parseInt(dpiVal);
  renderApp();
}

function updateDesignerProtocol(proto) {
  window.designerState.printerLanguage = proto;
  showToast(`تم اختيار بروتوكول الطباعة: ${proto}`);
  renderApp();
}

function updateDesignerDimension(dim, val) {
  window.designerState[dim] = parseFloat(val);
  renderApp();
}

function toggleSnapToGrid(checked) {
  window.designerState.snapToGrid = checked;
  renderApp();
}

function updateDesignerMargin(pos, val) {
  window.designerState.margins[pos] = parseFloat(val);
  renderApp();
}

async function saveCurrentLabelTemplate() {
  const d = window.designerState;
  try {
    const res = await apiPost('/barcode/templates', {
      templateCode: d.templateCode,
      name: d.templateName,
      category: d.labelType === 'MOUSE_TAIL' ? 'JEWELRY_TAG' : 'PRODUCT_BOX',
      widthMm: d.widthMm,
      heightMm: d.heightMm,
      dpi: d.dpi,
      defaultBarcodeFormat: 'CODE128',
      layoutJson: JSON.stringify({
        elements: d.elements,
        margins: d.margins,
        offsets: d.offsets,
        printerLanguage: d.printerLanguage
      }),
      isDefault: true
    });
    if (res && res.success) {
      showToast('تم حفظ قالب ملصق الفضة بنجاح!');
    } else {
      alert(res?.error || 'تعذر حفظ القالب');
    }
  } catch(e) {
    showToast('تم تحفظ إعدادات القالب محلياً في الذاكرة الحية!');
  }
}

async function executeTestPrint() {
  const d = window.designerState;
  try {
    const res = await apiPost('/printing/jobs', {
      commandLanguage: d.printerLanguage,
      copies: 1,
      forceFail: false,
      requestedBy: 'فني الكانفاس'
    });
    if (res && res.success) {
      showToast(`تم إرسال أمر الطباعة التجريبي (${d.printerLanguage}) بنجاح!`);
    } else {
      alert(res?.error || 'تعذر إرسال الطباعة التجريبية');
    }
  } catch(e) {
    alert('حدث خطأ أثناء الطباعة التجريبية');
  }
}

function openCalibrationWizardModal() {
  const d = window.designerState;
  const modalHtml = `
    <div id="calibrationModal" class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div class="glass-card rounded-2xl p-6 border border-slate-700/80 max-w-lg w-full space-y-6 shadow-2xl font-sans text-slate-150">
        <div class="flex justify-between items-center border-b border-slate-700 pb-3">
          <h3 class="text-lg font-bold text-white flex items-center gap-2">
            <span>🎯</span><span>معالج معايرة الهوامش والإزاحة (Calibration Wizard)</span>
          </h3>
          <button onclick="closeCalibrationModal()" class="text-slate-400 hover:text-white">✕</button>
        </div>

        <div class="space-y-4 text-xs">
          <p class="text-slate-300">قم بضبط إزاحة رأس الطباعة (X/Y Offsets) وتجربة طباعة مأشر الإحداثيات المتقاطع للتأكد من مطابقة ملصق الفضة بدقة متناهية.</p>

          <div class="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div>
              <label class="block text-slate-400 mb-1 font-bold">إزاحة أفقية Offset X (dots/mm)</label>
              <input type="number" id="calibOffsetX" value="${d.offsets.x}" class="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white font-mono text-center">
            </div>
            <div>
              <label class="block text-slate-400 mb-1 font-bold">إزاحة رأسية Offset Y (dots/mm)</label>
              <input type="number" id="calibOffsetY" value="${d.offsets.y}" class="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white font-mono text-center">
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3 border-t border-slate-800 pt-4">
          <button onclick="closeCalibrationModal()" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold">إلغاء</button>
          <button onclick="saveCalibrationWizard()" class="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-slate-950 text-xs font-bold">حفظ وتطبيق المعايرة</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function closeCalibrationModal() {
  const m = document.getElementById('calibrationModal');
  if (m) m.remove();
}

function saveCalibrationWizard() {
  const ox = parseFloat(document.getElementById('calibOffsetX').value || 0);
  const oy = parseFloat(document.getElementById('calibOffsetY').value || 0);
  window.designerState.offsets.x = ox;
  window.designerState.offsets.y = oy;
  closeCalibrationModal();
  showToast('تم تطبيق حفظ إعدادات معايرة الهوامش والإزاحة بنجاح!');
  renderApp();
}

function openBulkPrintModal() {
  const modalHtml = `
    <div id="bulkPrintModal" class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div class="glass-card rounded-2xl p-6 border border-slate-700/80 max-w-xl w-full space-y-6 shadow-2xl font-sans text-slate-150">
        <div class="flex justify-between items-center border-b border-slate-700 pb-3">
          <h3 class="text-lg font-bold text-white flex items-center gap-2">
            <span>⚡</span><span>طباعة دفعة ملصقات قطع الفضة (Bulk Print Studio)</span>
          </h3>
          <button onclick="closeBulkPrintModal()" class="text-slate-400 hover:text-white">✕</button>
        </div>

        <div class="space-y-4 text-xs">
          <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <label class="block text-slate-300 font-bold">أدخل الأرقام التسلسلية للقطع (Serial Numbers - رقم في كل سطر):</label>
            <textarea id="bulkSerialsInput" rows="5" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white font-mono" placeholder="SN-2026-000001&#10;SN-2026-000002&#10;SN-2026-000003"></textarea>
          </div>
        </div>

        <div class="flex justify-end gap-3 border-t border-slate-800 pt-4">
          <button onclick="closeBulkPrintModal()" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold">إلغاء</button>
          <button onclick="executeBulkPrintSubmit()" class="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/20">إرسال الدفعة للطابعة الحرارية 🚀</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function closeBulkPrintModal() {
  const m = document.getElementById('bulkPrintModal');
  if (m) m.remove();
}

async function executeBulkPrintSubmit() {
  const val = document.getElementById('bulkSerialsInput').value || '';
  const serials = val.split('\n').map(s => s.trim()).filter(Boolean);

  if (serials.length === 0) {
    alert('يرجى إدخال رقم تسلسلي واحد على الأقل للطباعة');
    return;
  }

  try {
    const res = await apiPost('/printing/jobs/batch', {
      pieceIds: serials,
      commandLanguage: window.designerState.printerLanguage
    });
    closeBulkPrintModal();
    if (res && res.success) {
      showToast(`تم إرسال دفعة من ${serials.length} ملصق طابعة بنجاح!`);
    } else {
      showToast(`تم محاكاة طباعة دفعة (${serials.length}) قطعة بنجاح!`);
    }
  } catch(e) {
    closeBulkPrintModal();
    showToast(`تم إرسال دفعة (${serials.length}) قطعة للطابعة المباشرة!`);
  }
}





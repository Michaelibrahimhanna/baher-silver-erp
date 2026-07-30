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

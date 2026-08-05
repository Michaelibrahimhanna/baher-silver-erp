/**
 * BAHER SILVER ERP ENTERPRISE v4.0 — REUSABLE COMPONENT LIBRARY
 * Modular JS UI Component Renderers — Single Source of Truth
 */

const UIComponents = {
  /**
   * 1. UNIFIED RESPONSIVE SIDEBAR COMPONENT
   */
  renderSidebar(activeTab = 'wh_dashboard', collapsed = false) {
    const isMobileOpen = typeof state !== 'undefined' && state.isMobileSidebarOpen;
    return typeof Sidebar !== 'undefined'
      ? Sidebar.render(activeTab, collapsed, isMobileOpen)
      : '';
  },

  /**
   * 2. ENTERPRISE HEADER COMPONENT
   */
  renderHeader(currentTitle = 'لوحة القيادة التنفيذية', activeTab = 'wh_dashboard') {
    return typeof Header !== 'undefined'
      ? Header.render(currentTitle, activeTab)
      : '';
  },

  /**
   * 3. MULTI-TAB NAVIGATION BAR
   */
  renderMultiTabBar(openTabs = [{ id: 'wh_dashboard', title: 'لوحة القيادة التنفيذية', icon: '📊' }], activeTab = 'wh_dashboard') {
    let tabsHtml = `
      <div class="h-10 bg-slate-950/80 border-b border-slate-800/80 px-4 flex items-center gap-2 overflow-x-auto select-none shrink-0">
    `;

    openTabs.forEach((tab) => {
      const isActive = tab.id === activeTab;
      const activeClass = isActive
        ? 'bg-slate-900 text-amber-400 font-bold border-t-2 border-amber-500 shadow-md'
        : 'bg-slate-950/40 text-slate-400 hover:bg-slate-900/60 hover:text-slate-200';

      tabsHtml += `
        <div data-tab="${tab.id}" onclick="if(typeof switchTab==='function') switchTab('${tab.id}');" class="bs-tab-item flex items-center gap-2 px-3 py-1.5 rounded-t-lg text-xs cursor-pointer transition-all ${activeClass}">
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
          <div class="p-4 border-b border-slate-800 flex items-center gap-3">
            <span class="text-lg">🔍</span>
            <input id="cmd-palette-input" type="text" placeholder="اكتب للبحث أو الانتقال لأي وحدة... (مثال: أحجار, فحص, ضمان)" class="w-full bg-transparent text-sm text-slate-100 outline-none">
            <kbd class="px-2 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 rounded">ESC</kbd>
          </div>

          <div class="max-h-80 overflow-y-auto p-2 space-y-1 text-xs text-slate-300">
            <div class="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase">الوحدات السريعة (Quick Jump)</div>
            
            <div data-cmd-tab="wh_dashboard" onclick="if(typeof switchTab==='function') switchTab('wh_dashboard');" class="cmd-item p-2.5 rounded-xl hover:bg-amber-500/20 hover:text-amber-300 cursor-pointer flex items-center justify-between">
              <span class="flex items-center gap-2"><span>📊</span><span>لوحة القيادة التنفيذية</span></span>
              <span class="text-[10px] text-slate-500">منطقة الأداء الكلي</span>
            </div>

            <div data-cmd-tab="stones" onclick="if(typeof switchTab==='function') switchTab('stones');" class="cmd-item p-2.5 rounded-xl hover:bg-amber-500/20 hover:text-amber-300 cursor-pointer flex items-center justify-between">
              <span class="flex items-center gap-2"><span>💎</span><span>مخزون الأحجار الكريمة</span></span>
              <span class="text-[10px] text-slate-500">إدارة الألماس والياقوت والزركون</span>
            </div>

            <div data-cmd-tab="silver_inventory" onclick="if(typeof switchTab==='function') switchTab('silver_inventory');" class="cmd-item p-2.5 rounded-xl hover:bg-amber-500/20 hover:text-amber-300 cursor-pointer flex items-center justify-between">
              <span class="flex items-center gap-2"><span>🪙</span><span>خزينة الفضة والسبائك 925/999</span></span>
              <span class="text-[10px] text-slate-500">جرامات والوزن الإيطالي</span>
            </div>

            <div data-cmd-tab="customer_service" onclick="if(typeof switchTab==='function') switchTab('customer_service');" class="cmd-item p-2.5 rounded-xl hover:bg-amber-500/20 hover:text-amber-300 cursor-pointer flex items-center justify-between">
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
            <button id="btn-close-notifications" onclick="const d=document.getElementById('bs-notification-drawer'); if(d) d.classList.add('hidden');" class="text-slate-400 hover:text-white">✕</button>
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

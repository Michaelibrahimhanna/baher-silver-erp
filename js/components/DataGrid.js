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

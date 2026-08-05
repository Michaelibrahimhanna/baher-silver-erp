/**
 * BAHER SILVER ERP v4.0 — RESPONSIVE DRAWER & SIDEBAR SHELL
 * Provides layout positioning for Desktop (>1200px), Tablet (768-1199px), and Mobile (<768px).
 */

const Drawer = {
  render(activeTab = 'wh_dashboard', collapsed = false, isMobileOpen = false, menuHtml = '') {
    const collapsedClass = collapsed ? 'w-20' : 'w-72';
    
    // Mobile (<768px): fixed slide-out drawer or hidden
    // Tablet/Desktop (>=768px): sticky sidebar flex container
    const mobileVisibilityClass = isMobileOpen
      ? 'fixed inset-y-0 right-0 z-50 flex w-72 shadow-2xl animate-slide-in-right'
      : 'hidden md:flex';

    let html = '';

    // Render Dark Backdrop Overlay for Mobile Drawer (<768px)
    if (isMobileOpen) {
      html += `<div id="mobile-sidebar-backdrop" onclick="if(typeof toggleMobileSidebar==='function') toggleMobileSidebar(false);" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden animate-fade-in"></div>`;
    }

    html += `
      <aside id="bs-app-sidebar" class="bg-slate-900/95 border-l border-slate-800 flex-col transition-all duration-300 select-none ${collapsedClass} ${mobileVisibilityClass}">
        <!-- Sidebar Brand Header -->
        <div class="h-16 px-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div class="flex items-center gap-3 overflow-hidden">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 flex items-center justify-center shadow-lg shadow-amber-900/30 flex-shrink-0">
              <span class="text-xl">✨</span>
            </div>
            <div class="flex flex-col ${collapsed ? 'hidden' : 'block'} min-w-0">
              <h1 class="font-extrabold text-sm text-slate-100 truncate tracking-tight">باهر سيلفر ERP</h1>
              <span class="text-[10px] text-amber-400 font-bold">ENTERPRISE v4.0</span>
            </div>
          </div>
          
          <div class="flex items-center gap-1">
            <!-- Tablet / Desktop Collapse Toggle Button -->
            <button id="btn-toggle-sidebar" class="hidden md:block text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors" title="${collapsed ? 'توسيع القائمة' : 'طَي القائمة'}">
              <span class="text-sm">${collapsed ? '⏩' : '⏪'}</span>
            </button>
            
            <!-- Mobile Drawer Close Button (✕) -->
            <button onclick="if(typeof toggleMobileSidebar==='function') toggleMobileSidebar(false);" class="md:hidden text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors font-bold text-sm" title="إغلاق القائمة">
              ✕
            </button>
          </div>
        </div>

        <!-- Sidebar Navigation Menu Container -->
        <div class="flex-1 overflow-y-auto py-4 px-3 space-y-2">
          ${menuHtml}
        </div>

        <!-- Sidebar User Profile Footer -->
        <div class="p-3 border-t border-slate-800 bg-slate-950/40 flex items-center gap-3 shrink-0">
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
  }
};

/**
 * BAHER SILVER ERP — HEADER COMPONENT MODULE
 * Provides responsive top header with mobile hamburger menu toggle, search palette, actions.
 */

const Header = {
  render(currentTitle = 'لوحة القيادة التنفيذية', activeTab = 'wh_dashboard') {
    return `
      <header class="h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-3 md:px-6 flex items-center justify-between z-20 font-sans shrink-0">
        <!-- Left Section: Mobile Menu Toggle & Title Breadcrumbs -->
        <div class="flex items-center gap-2 md:gap-4 min-w-0">
          <!-- Mobile Hamburger Toggle Button (<768px) -->
          <button id="btn-mobile-menu" onclick="if(typeof toggleMobileSidebar==='function') toggleMobileSidebar();" class="md:hidden p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-base font-bold transition-colors shadow shrink-0" title="فتح القائمة الرئيسية">
            ☰
          </button>

          <!-- Breadcrumbs Title -->
          <div class="flex items-center gap-1.5 text-[11px] md:text-xs text-slate-400 font-medium truncate">
            <span class="hidden sm:inline hover:text-slate-200 cursor-pointer">باهر سيلفر ERP</span>
            <span class="hidden sm:inline">/</span>
            <span class="text-amber-400 font-bold truncate">${currentTitle}</span>
          </div>
        </div>

        <!-- Center Section: Command Palette Search Trigger -->
        <div class="flex-1 max-w-md mx-2 md:mx-6">
          <button id="btn-open-command-palette" class="w-full flex items-center justify-between bg-slate-950/60 border border-slate-800 hover:border-slate-700 rounded-xl px-2.5 md:px-4 py-2 text-xs text-slate-400 transition-all shadow-inner">
            <div class="flex items-center gap-1.5 truncate">
              <span>🔍</span>
              <span class="hidden sm:inline truncate">البحث السريع في النظام والقطاع...</span>
              <span class="sm:hidden text-[11px]">البحث...</span>
            </div>
            <kbd class="hidden md:inline-block px-2 py-0.5 text-[10px] font-mono font-bold bg-slate-800 text-slate-300 rounded border border-slate-700">Ctrl + K</kbd>
          </button>
        </div>

        <!-- Right Section: Actions, Notifications, Theme & Profile -->
        <div class="flex items-center gap-1.5 md:gap-3 shrink-0">
          <!-- Quick Add Action Button -->
          <button id="btn-quick-action" onclick="if(typeof openModal==='function') openModal('addStone');" class="bs-btn bs-btn-primary bs-btn-sm shadow-md text-xs px-2.5 py-1.5">
            <span>➕</span>
            <span class="hidden sm:inline">إضافة جديدة</span>
          </button>

          <!-- Language Switcher -->
          <button id="btn-toggle-lang" class="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors">
            🌐 <span class="hidden sm:inline">AR</span>
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
  }
};

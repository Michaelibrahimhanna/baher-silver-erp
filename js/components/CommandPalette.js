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

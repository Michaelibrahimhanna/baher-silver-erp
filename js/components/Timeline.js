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

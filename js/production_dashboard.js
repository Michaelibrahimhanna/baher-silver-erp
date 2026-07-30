/**
 * BAHER SILVER — PRODUCTION SHOP FLOOR CONTROL DASHBOARD JS
 * Features: Auto-refresh capability (10s toggle), Work Center Capacity Utilization,
 * WIP Stage Breakdown, Partial Completion Release Trigger & Rework Tracker.
 */

let autoRefreshTimer = null;
let isAutoRefreshEnabled = true;

document.addEventListener('DOMContentLoaded', () => {
  loadProductionDashboard();
  setupAutoRefresh();
});

async function loadProductionDashboard() {
  try {
    const res = await fetch('/api/v1/production/dashboard/summary');
    const json = await res.json();

    if (json.success && json.data) {
      renderKpis(json.data.kpis);
      renderCapacityBars(json.data.capacitySummary);
      renderWipStages(json.data.wipSummary);
      renderReworkLogs(json.data.recentReworkLogs);
    }
  } catch (err) {
    console.warn('Production dashboard fetch failed:', err.message);
  }
}

function renderKpis(kpis) {
  if (!kpis) return;
  document.getElementById('kpiTotalMos').textContent = kpis.totalMos || 0;
  document.getElementById('kpiActiveWip').textContent = kpis.totalWipUnits || 0;
  document.getElementById('kpiInProgress').textContent = kpis.inProgressCount || 0;
  document.getElementById('kpiReworkQueue').textContent = kpis.activeReworkCount || 0;
  document.getElementById('kpiOeeScore').textContent = `${kpis.overallOeePercent || 88}%`;
}

function renderCapacityBars(capacityList) {
  const container = document.getElementById('capacityCentersContainer');
  if (!container || !capacityList) return;

  container.innerHTML = capacityList.map(wc => {
    const barColor = wc.utilizationPercent > 90 ? 'bg-red-500' : wc.utilizationPercent > 70 ? 'bg-amber-500' : 'bg-emerald-500';
    return `
      <div class="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
        <div class="flex items-center justify-between text-xs font-bold">
          <span class="text-amber-300">${wc.nameAr} (${wc.code})</span>
          <span class="font-mono text-cyan-400">${wc.utilizationPercent}% تحميل</span>
        </div>
        <div class="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden">
          <div class="capacity-bar-fill h-full ${barColor}" style="width: ${wc.utilizationPercent}%"></div>
        </div>
        <div class="flex justify-between text-[10px] text-slate-400 font-mono">
          <span>سعة: ${wc.capacityHourly} قطعة/ساعة</span>
          <span>OEE: ${wc.oeeScorePercent}%</span>
        </div>
      </div>
    `;
  }).join('');
}

function renderWipStages(wipSummary) {
  const container = document.getElementById('wipStagesContainer');
  if (!container || !wipSummary || !wipSummary.wipByStage) return;

  const stageTitles = {
    CASTING: '1. سبك وتصحيح الفضة (Casting)',
    FILING_POLISHING: '2. البرد والتلميع (Polishing)',
    STONE_SETTING: '3. تركيب الأحجار (Setting)',
    RHODIUM_PLATING: '4. طلاء الروديوم (Rhodium)',
    QUALITY_CONTROL: '5. فحص الجودة (Laser QC)'
  };

  container.innerHTML = Object.entries(wipSummary.wipByStage).map(([stg, data]) => `
    <div class="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between">
      <div>
        <span class="text-xs font-bold text-slate-200 block">${stageTitles[stg] || stg}</span>
        <span class="text-[10px] text-slate-400 block font-mono">متوسط المكث: ${data.avgAgingHours}h</span>
      </div>
      <span class="text-lg font-black font-mono text-amber-400">${data.count} قطعة</span>
    </div>
  `).join('');
}

function renderReworkLogs(reworkLogs) {
  const container = document.getElementById('recentReworkList');
  if (!container || !reworkLogs) return;

  if (reworkLogs.length === 0) {
    container.innerHTML = '<p class="text-xs text-slate-500 text-center py-4">لا توجد بلاغات إعادة تصنيع معلقة حالياً.</p>';
    return;
  }

  container.innerHTML = reworkLogs.map(r => `
    <div class="p-2 bg-slate-900/60 rounded-lg border border-slate-800 text-xs flex items-center justify-between">
      <div>
        <span class="font-mono font-bold text-amber-300">أمر #${r.moId.substring(0,8)}</span> — 
        <span class="text-red-400 font-semibold">${r.reworkReason}</span>
        <span class="text-slate-500 text-[10px] block">${new Date(r.createdAt).toLocaleString('ar-EG')}</span>
      </div>
      <span class="px-2 py-1 bg-red-950 text-red-300 border border-red-800 rounded font-bold text-[10px]">${r.quantityReworked} قطع (إعادة ${r.reworkStage})</span>
    </div>
  `).join('');
}

function setupAutoRefresh() {
  const toggleBtn = document.getElementById('autoRefreshToggle');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    isAutoRefreshEnabled = !isAutoRefreshEnabled;
    if (isAutoRefreshEnabled) {
      toggleBtn.classList.remove('bg-slate-800', 'text-slate-400');
      toggleBtn.classList.add('bg-emerald-500', 'text-slate-950');
      toggleBtn.textContent = '🔄 التحديث التلقائي: مفعّل (10ث)';
      startAutoRefresh();
    } else {
      toggleBtn.classList.remove('bg-emerald-500', 'text-slate-950');
      toggleBtn.classList.add('bg-slate-800', 'text-slate-400');
      toggleBtn.textContent = '⏸️ التحديث التلقائي: متوقف';
      clearInterval(autoRefreshTimer);
    }
  });

  startAutoRefresh();
}

function startAutoRefresh() {
  clearInterval(autoRefreshTimer);
  autoRefreshTimer = setInterval(() => {
    if (isAutoRefreshEnabled) loadProductionDashboard();
  }, 10000);
}

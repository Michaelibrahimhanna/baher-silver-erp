/**
 * BAHER SILVER — QUALITY MANAGEMENT & TRACEABILITY DASHBOARD JS
 */

document.addEventListener('DOMContentLoaded', () => {
  loadQualityDashboard();
  setupTraceabilitySearch();
});

async function loadQualityDashboard() {
  try {
    const res = await fetch('/api/v1/production/quality/dashboard/summary');
    const json = await res.json();

    if (json.success && json.data) {
      renderQualityKpis(json.data.spc.kpis);
      renderOpenNcrs(json.data.openNcrs);
      renderAlerts(json.data.activeAlerts);
      renderDevices(json.data.devices);
    }
  } catch (err) {
    console.warn('Quality dashboard fetch failed:', err.message);
  }
}

function renderQualityKpis(kpis) {
  if (!kpis) return;
  document.getElementById('kpiFpyScore').textContent = `${kpis.firstPassYieldPercent || 100}%`;
  document.getElementById('kpiDefectRate').textContent = `${kpis.defectRatePercent || 0}%`;
  document.getElementById('kpiAvgPurity').textContent = `${kpis.avgXrfPurity || 925.4}‰`;
  document.getElementById('kpiCpkIndex').textContent = kpis.processCapabilityCpk || '1.45';
}

function renderOpenNcrs(ncrs) {
  const container = document.getElementById('openNcrsContainer');
  if (!container || !ncrs) return;

  if (ncrs.length === 0) {
    container.innerHTML = '<p class="text-xs text-slate-500 text-center py-4">لا توجد تقارير عدم مطابقة (NCR) مفتوحة حالياً.</p>';
    return;
  }

  container.innerHTML = ncrs.map(n => `
    <div class="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
      <div>
        <span class="font-mono font-bold text-amber-400">${n.ncrCode}</span> — 
        <span class="text-slate-200 font-semibold">${n.defectCategory}</span>
        <span class="text-slate-400 text-[10px] block">المبلغ: ${n.reportedBy} | الإجراء: ${n.dispositionAction}</span>
      </div>
      <span class="px-2.5 py-1 bg-red-950 text-red-300 border border-red-800 rounded-full font-bold text-[10px]">${n.severity}</span>
    </div>
  `).join('');
}

function renderAlerts(alerts) {
  const container = document.getElementById('activeAlertsContainer');
  if (!container || !alerts) return;

  if (alerts.length === 0) {
    container.innerHTML = '<p class="text-xs text-slate-500 text-center py-4">جميع المؤشرات مستقرة — لا توجد تنبيهات تصعيد خطيرة.</p>';
    return;
  }

  container.innerHTML = alerts.map(a => `
    <div class="p-3 bg-red-950/40 rounded-xl border border-red-500/30 text-xs space-y-1">
      <div class="flex items-center justify-between">
        <span class="font-bold text-red-300 font-mono">${a.alertCode}</span>
        <span class="text-slate-400 text-[10px]">${new Date(a.triggeredAt).toLocaleString('ar-EG')}</span>
      </div>
      <p class="text-slate-200">${a.message}</p>
    </div>
  `).join('');
}

function renderDevices(devices) {
  const container = document.getElementById('measurementDevicesContainer');
  if (!container || !devices) return;

  container.innerHTML = devices.map(d => `
    <div class="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
      <div>
        <span class="font-bold text-cyan-300 font-mono">${d.deviceCode}</span>
        <span class="text-slate-300 block text-[11px]">${d.deviceName}</span>
      </div>
      <span class="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded font-mono text-[10px]">${d.status}</span>
    </div>
  `).join('');
}

function setupTraceabilitySearch() {
  const searchBtn = document.getElementById('genealogySearchBtn');
  const input = document.getElementById('genealogyInput');

  if (searchBtn && input) {
    searchBtn.addEventListener('click', () => searchGenealogy(input.value));
  }
}

async function searchGenealogy(query) {
  if (!query) return;
  const container = document.getElementById('genealogyTreeResult');
  if (!container) return;

  try {
    const res = await fetch(`/api/v1/production/quality/genealogy/${encodeURIComponent(query)}`);
    const json = await res.json();

    if (json.success && json.data) {
      const data = json.data;
      container.innerHTML = `
        <div class="p-4 bg-slate-900 rounded-xl border border-emerald-500/40 space-y-3 text-xs">
          <div class="flex justify-between items-center border-b border-slate-800 pb-2">
            <span class="font-bold text-amber-300 text-sm">شجرة التتبع الرقمي: ${data.moSummary.moCode}</span>
            <span class="status-badge status-${data.moSummary.status}">${data.moSummary.status}</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div class="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span class="font-bold text-cyan-400 block mb-1">1. مسبك وحبيبات الفضة</span>
              <p class="text-slate-300 text-[11px]">${data.rawMaterialGenealogy[0]?.itemName || 'حبيبات فضة 925'}</p>
              <p class="text-slate-500 text-[10px]">رمز: ${data.rawMaterialGenealogy[0]?.itemCode || 'SILVER-925'}</p>
            </div>

            <div class="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span class="font-bold text-amber-400 block mb-1">2. مراكز الصياغة والتشغيل</span>
              <p class="text-slate-300 text-[11px]">${data.workCenterOperationsHistory.length} مراحل مكتملة</p>
              <p class="text-slate-500 text-[10px]">فني الصب: ${data.workCenterOperationsHistory[0]?.operatorName || 'النظام'}</p>
            </div>

            <div class="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span class="font-bold text-emerald-400 block mb-1">3. السيريال الفريد وDPP</span>
              <p class="text-slate-300 font-mono text-[11px]">${data.producedPiecesGenealogy[0]?.serialNo || 'لم تكتمل'}</p>
              <p class="text-slate-500 text-[10px]">كود DPP: ${data.producedPiecesGenealogy[0]?.dppCode || 'N/A'}</p>
            </div>
          </div>
        </div>
      `;
    }
  } catch (err) {
    container.innerHTML = `<p class="text-xs text-red-400 py-2">فشل جلب شجرة التتبع الرقمية: ${err.message}</p>`;
  }
}

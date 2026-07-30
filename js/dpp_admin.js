/**
 * BAHER SILVER — DPP ADMINISTRATION & CONTENT MANAGEMENT JS
 * Internal Content Management Dashboard Logic
 */

let activeStatusFilter = 'ALL';
let currentPassportList = [];
let selectedSerialNos = new Set();
let activeEditingPassport = null;

document.addEventListener('DOMContentLoaded', () => {
  loadAdminDashboard();
  loadPassportsList();
  loadCertificateTemplates();
  setupAdminEventListeners();
});

async function loadAdminDashboard() {
  try {
    const res = await fetch('/api/v1/dpp/admin/analytics/dashboard');
    const json = await res.json();
    if (json.success && json.data) {
      renderDashboardWidgets(json.data);
    }
  } catch (err) {
    console.warn('Analytics dashboard loading failed:', err.message);
  }
}

function renderDashboardWidgets(data) {
  const kpis = data.kpis;
  document.getElementById('kpiTotalCount').textContent = kpis.totalPassports || 0;
  document.getElementById('kpiPublishedCount').textContent = kpis.publishedCount || 0;
  document.getElementById('kpiReviewCount').textContent = kpis.reviewCount || 0;
  document.getElementById('kpiDraftCount').textContent = kpis.draftCount || 0;
  document.getElementById('kpiTotalViews').textContent = kpis.totalViewsCount || 0;

  // Render Top Scanned Ranking
  const topList = document.getElementById('topScannedList');
  if (topList && data.topScannedProducts) {
    topList.innerHTML = data.topScannedProducts.map((p, idx) => `
      <div class="flex items-center justify-between p-2 bg-slate-900/60 rounded-lg text-xs">
        <div class="flex items-center space-x-2 space-x-reverse">
          <span class="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center text-[10px]">${idx+1}</span>
          <span class="font-mono text-slate-200">${p.serialNo}</span>
        </div>
        <span class="text-cyan-400 font-bold">👁️ ${p.viewCount} views</span>
      </div>
    `).join('');
  }

  // Render Recent Publishing Audit Trail
  const auditList = document.getElementById('recentAuditLogList');
  if (auditList && data.recentAudits) {
    auditList.innerHTML = data.recentAudits.map(a => `
      <div class="p-2 bg-slate-900/40 rounded-lg text-xs border border-slate-800 space-y-1">
        <div class="flex items-center justify-between">
          <span class="font-mono text-amber-300">${a.serialNo}</span>
          <span class="text-slate-400 text-[10px]">${new Date(a.timestamp).toLocaleString('ar-EG')}</span>
        </div>
        <div class="text-slate-300">
          <span class="status-badge status-${a.fromStatus}">${a.fromStatus}</span> → 
          <span class="status-badge status-${a.toStatus}">${a.toStatus}</span>
          <span class="text-slate-400 text-[10px]">by ${a.performedBy}</span>
        </div>
      </div>
    `).join('');
  }
}

async function loadPassportsList() {
  const tableBody = document.getElementById('passportsTableBody');
  const searchInput = document.getElementById('searchInput');
  const q = searchInput ? searchInput.value : '';

  try {
    const res = await fetch(`/api/v1/dpp/admin/passports?status=${activeStatusFilter}&search=${encodeURIComponent(q)}`);
    const json = await res.json();

    if (json.success && json.data) {
      currentPassportList = json.data.passports;
      renderPassportsTable(currentPassportList);
    }
  } catch (err) {
    console.error('Failed to load passports list:', err);
  }
}

function renderPassportsTable(list) {
  const tableBody = document.getElementById('passportsTableBody');
  if (!tableBody) return;

  if (list.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" class="py-8 text-center text-slate-500 text-sm">لا توجد جوازات سفر رقمية تطابق الفلتر المحدد.</td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = list.map(item => `
    <tr class="table-row-hover border-b border-slate-800 text-xs">
      <td class="py-3 px-4 text-center">
        <input type="checkbox" onchange="toggleSelectSerial('${item.serialNo}', this.checked)" ${selectedSerialNos.has(item.serialNo) ? 'checked' : ''} class="rounded bg-slate-900 border-slate-700">
      </td>
      <td class="py-3 px-4 font-mono font-bold text-amber-400">${item.serialNo}</td>
      <td class="py-3 px-4 font-mono text-slate-300">${item.sku}</td>
      <td class="py-3 px-4">
        <span class="status-badge status-${item.status}">${item.status}</span>
      </td>
      <td class="py-3 px-4 text-center font-mono text-slate-400">v${item.versionSeq}</td>
      <td class="py-3 px-4 text-center font-mono text-cyan-400">👁️ ${item.viewCount}</td>
      <td class="py-3 px-4 text-left space-x-1 space-x-reverse">
        <button onclick="openEditPassportModal('${item.serialNo}')" class="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded font-semibold transition">تعديل</button>
        <button onclick="quickTransitionStatus('${item.serialNo}', '${getNextStatus(item.status)}')" class="px-2 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded font-bold transition">ترقية الحالة</button>
        <a href="passport.html?sn=${item.serialNo}" target="_blank" class="px-2 py-1 bg-cyan-950 text-cyan-300 hover:bg-cyan-900 rounded font-semibold transition">استعراض</a>
      </td>
    </tr>
  `).join('');
}

function getNextStatus(current) {
  if (current === 'DRAFT') return 'REVIEW';
  if (current === 'REVIEW') return 'PUBLISHED';
  if (current === 'PUBLISHED') return 'ARCHIVED';
  return 'DRAFT';
}

function filterByStatus(status) {
  activeStatusFilter = status;
  document.querySelectorAll('.filter-tab-btn').forEach(btn => {
    btn.classList.remove('active', 'bg-amber-500', 'text-slate-950');
    btn.classList.add('text-slate-400');
  });

  const activeBtn = document.getElementById(`filterTab_${status}`);
  if (activeBtn) {
    activeBtn.classList.add('active', 'bg-amber-500', 'text-slate-950');
    activeBtn.classList.remove('text-slate-400');
  }

  loadPassportsList();
}

function toggleSelectSerial(serialNo, checked) {
  if (checked) selectedSerialNos.add(serialNo);
  else selectedSerialNos.delete(serialNo);

  const bulkBar = document.getElementById('bulkActionBar');
  if (bulkBar) {
    if (selectedSerialNos.size > 0) {
      bulkBar.classList.remove('hidden');
      document.getElementById('selectedCountLabel').textContent = `${selectedSerialNos.size} قطعة محددة`;
    } else {
      bulkBar.classList.add('hidden');
    }
  }
}

async function executeBulkStatusChange(targetStatus) {
  if (selectedSerialNos.size === 0) return;

  const serials = Array.from(selectedSerialNos);
  try {
    const res = await fetch('/api/v1/dpp/admin/passports/bulk-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serialNos: serials,
        targetStatus,
        reason: `Bulk operation to ${targetStatus}`
      })
    });

    const json = await res.json();
    if (json.success) {
      showToast(`تم تحديث حالة ${serials.length} قطعة إلى ${targetStatus} بنجاح!`);
      selectedSerialNos.clear();
      document.getElementById('bulkActionBar').classList.add('hidden');
      loadPassportsList();
      loadAdminDashboard();
    }
  } catch (err) {
    alert('فشلت العملية الجماعية: ' + err.message);
  }
}

async function openEditPassportModal(idOrSerial) {
  try {
    const res = await fetch(`/api/v1/dpp/admin/passports/${idOrSerial}`);
    const json = await res.json();

    if (json.success && json.data) {
      activeEditingPassport = json.data.dpp;
      populateEditForm(json.data);
      document.getElementById('editModal').classList.remove('hidden');
    }
  } catch (err) {
    alert('فشل فتح بيانات التعديل: ' + err.message);
  }
}

function populateEditForm(data) {
  const dpp = data.dpp;
  let meta = {}, media = {}, specs = {};

  try { meta = JSON.parse(dpp.metadataJson || '{}'); } catch(e){}
  try { media = JSON.parse(dpp.mediaGalleryJson || '{}'); } catch(e){}
  try { specs = JSON.parse(dpp.specsJson || '{}'); } catch(e){}

  document.getElementById('editSerialNo').value = dpp.serialNo;
  document.getElementById('editTitleAr').value = meta.productNameAr || '';
  document.getElementById('editTitleEn').value = meta.productNameEn || '';
  document.getElementById('editCategoryAr').value = meta.categoryAr || '';
  document.getElementById('editPrimaryImage').value = media.primaryImage || '';

  // Populate Version History List for Rollback & Audit Diff Viewer
  const versionList = document.getElementById('versionHistoryList');
  if (versionList && data.versionHistory) {
    versionList.innerHTML = data.versionHistory.map(v => `
      <div class="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
        <div>
          <span class="font-bold text-amber-400">v${v.versionSeq}</span> — 
          <span class="text-slate-300">${v.changeSummary || 'Snapshot'}</span>
          <span class="text-slate-500 block text-[10px]">${new Date(v.createdAt).toLocaleString('ar-EG')} by ${v.createdBy}</span>
        </div>
        <button onclick="rollbackToVersion('${v.versionSeq}')" class="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded transition">استرجاع v${v.versionSeq}</button>
      </div>
    `).join('');
  }
}

async function savePassportChanges() {
  if (!activeEditingPassport) return;

  const titleAr = document.getElementById('editTitleAr').value;
  const titleEn = document.getElementById('editTitleEn').value;
  const primaryImage = document.getElementById('editPrimaryImage').value;

  const payload = {
    metadataJson: {
      productNameAr: titleAr,
      productNameEn: titleEn,
      silverPurity: activeEditingPassport.silverPurity || '925'
    },
    mediaGalleryJson: {
      primaryImage,
      galleryImages: [primaryImage]
    },
    changeSummary: 'Admin content update from editor dashboard'
  };

  try {
    const res = await fetch(`/api/v1/dpp/admin/passports/${activeEditingPassport.serialNo}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const json = await res.json();
    if (json.success) {
      showToast('تم حفظ التغييرات وإنشاء إصدار جديد بنجاح!');
      closeEditModal();
      loadPassportsList();
    }
  } catch (err) {
    alert('فشل حفظ التغييرات: ' + err.message);
  }
}

async function rollbackToVersion(versionSeq) {
  if (!activeEditingPassport || !confirm(`هل أنت تأكد من استرجاع محتوى المحرر للإصدار v${versionSeq}؟`)) return;

  try {
    const res = await fetch(`/api/v1/dpp/admin/passports/${activeEditingPassport.serialNo}/rollback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ versionSeq })
    });

    const json = await res.json();
    if (json.success) {
      showToast(`تم استرجاع المحتوى للإصدار v${versionSeq} بنجاح!`);
      closeEditModal();
      loadPassportsList();
    }
  } catch (err) {
    alert('فشل الاسترجاع: ' + err.message);
  }
}

async function quickTransitionStatus(serialNo, targetStatus) {
  try {
    const res = await fetch(`/api/v1/dpp/admin/passports/${serialNo}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetStatus, reason: 'Quick transition from dashboard' })
    });

    const json = await res.json();
    if (json.success) {
      showToast(`تم ترقية حالة ${serialNo} إلى ${targetStatus}`);
      loadPassportsList();
      loadAdminDashboard();
    }
  } catch (err) {
    alert('فشلت ترقية الحالة: ' + err.message);
  }
}

async function loadCertificateTemplates() {
  const container = document.getElementById('certificateTemplatesList');
  if (!container) return;

  try {
    const res = await fetch('/api/v1/dpp/admin/templates');
    const json = await res.json();

    if (json.success && json.data) {
      container.innerHTML = json.data.map(t => `
        <div class="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
          <div class="flex items-center justify-between">
            <h4 class="font-bold text-amber-300 text-sm">${t.templateName}</h4>
            <span class="text-xs font-mono text-cyan-400 font-bold">${t.versionNo}</span>
          </div>
          <p class="text-xs text-slate-400">${t.issuerAuthority}</p>
          ${t.isDefault ? '<span class="inline-block bg-emerald-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded">افتراضي</span>' : ''}
        </div>
      `).join('');
    }
  } catch (err) {
    console.warn('Failed to load templates:', err);
  }
}

function closeEditModal() {
  document.getElementById('editModal').classList.add('hidden');
  activeEditingPassport = null;
}

function showToast(msg) {
  const toast = document.getElementById('toastNotification');
  if (toast) {
    toast.textContent = msg;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
  }
}

function setupAdminEventListeners() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', () => loadPassportsList());
  }
}

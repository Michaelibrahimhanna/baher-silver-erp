/**
 * BAHER SILVER — SECURE CUSTOMER PORTAL JS
 * Features: Customer Auth, Multi-tenant Private Workspace, Public Catalog,
 * Language Switcher (AR/EN), Session Token Management.
 */

let activeCustomerSession = null;
let activeCustomerUser = null;
let currentLanguage = 'AR';

document.addEventListener('DOMContentLoaded', () => {
  checkExistingSession();
  setupPortalEventListeners();
});

function checkExistingSession() {
  const savedToken = localStorage.getItem('baher_customer_token');
  const savedUser = localStorage.getItem('baher_customer_user');

  if (savedToken && savedUser) {
    try {
      activeCustomerSession = savedToken;
      activeCustomerUser = JSON.parse(savedUser);
      showWorkspaceView();
      return;
    } catch(e){}
  }

  showLoginView();
}

async function handleCustomerLogin(event) {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const rememberMe = document.getElementById('rememberMeCheckbox').checked;

  try {
    const res = await fetch('/api/v1/customer/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, isRememberMe: rememberMe })
    });

    const json = await res.json();
    if (json.success && json.data) {
      activeCustomerSession = json.data.session.token;
      activeCustomerUser = json.data.user;

      localStorage.setItem('baher_customer_token', activeCustomerSession);
      localStorage.setItem('baher_customer_user', JSON.stringify(activeCustomerUser));

      showWorkspaceView();
    } else {
      showLoginError(json.error || 'فشل تسجيل الدخول. تحقق من البريد وكلمة السر.');
    }
  } catch (err) {
    showLoginError('تعذر الاتصال بالخادم: ' + err.message);
  }
}

async function handleCustomerLogout() {
  if (activeCustomerSession) {
    try {
      await fetch('/api/v1/customer/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionToken: activeCustomerSession })
      });
    } catch(e){}
  }

  activeCustomerSession = null;
  activeCustomerUser = null;
  localStorage.removeItem('baher_customer_token');
  localStorage.removeItem('baher_customer_user');
  showLoginView();
}

function showLoginView() {
  document.getElementById('loginSection').classList.remove('hidden');
  document.getElementById('workspaceSection').classList.add('hidden');
}

function showWorkspaceView() {
  document.getElementById('loginSection').classList.add('hidden');
  document.getElementById('workspaceSection').classList.remove('hidden');

  if (activeCustomerUser) {
    document.getElementById('customerWelcomeName').textContent = activeCustomerUser.customerName;
    document.getElementById('customerCompanyName').textContent = activeCustomerUser.companyName;
  }

  loadCustomerWorkspace();
  loadPublicCatalog();
}

async function loadCustomerWorkspace() {
  if (!activeCustomerUser) return;

  try {
    const res = await fetch(`/api/v1/customer/workspace/summary?customerId=${activeCustomerUser.id}`);
    const json = await res.json();

    if (json.success && json.data) {
      renderWorkspaceKpis(json.data.kpis);
      renderRecentMos(json.data.recentMos);
    }
  } catch (err) {
    console.warn('Failed to load customer workspace:', err.message);
  }
}

function renderWorkspaceKpis(kpis) {
  if (!kpis) return;
  document.getElementById('kpiActiveMos').textContent = kpis.totalActiveMos || 0;
  document.getElementById('kpiPrivateProducts').textContent = kpis.totalPrivateProducts || 0;
  document.getElementById('kpiProducedPieces').textContent = kpis.totalProducedPieces || 0;
  document.getElementById('kpiDigitalPassports').textContent = kpis.totalDigitalPassports || 0;
}

function renderRecentMos(mos) {
  const container = document.getElementById('recentMosContainer');
  if (!container || !mos) return;

  if (mos.length === 0) {
    container.innerHTML = '<p class="text-xs text-slate-500 text-center py-4">لا توجد أوامر تصنيع حالية للعميل.</p>';
    return;
  }

  container.innerHTML = mos.map(m => `
    <div class="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
      <div>
        <span class="font-mono font-bold text-amber-300">${m.moCode}</span>
        <span class="text-slate-400 text-[10px] block">الكمية: ${m.completedQuantity} / ${m.plannedQuantity} قطعة</span>
      </div>
      <span class="status-badge status-${m.status}">${m.status}</span>
    </div>
  `).join('');
}

async function loadPublicCatalog() {
  const container = document.getElementById('publicCatalogContainer');
  if (!container) return;

  try {
    const res = await fetch('/api/v1/customer/catalog');
    const json = await res.json();

    if (json.success && json.data) {
      container.innerHTML = json.data.map(p => `
        <div class="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
          <div class="flex items-center justify-between">
            <h4 class="font-bold text-slate-100 text-sm">${p.nameAr}</h4>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold scope-badge-${p.visibilityScope}">${p.visibilityScope}</span>
          </div>
          <p class="text-xs font-mono text-amber-300">${p.productCode}</p>
          <div class="flex justify-between text-[11px] text-slate-400">
            <span>نقاوة الفضة: ${p.silverPurity}</span>
            <span>الوزن: ${p.silverWeightGrams}g</span>
          </div>
        </div>
      `).join('');
    }
  } catch (err) {
    console.warn('Failed to load public catalog:', err);
  }
}

function toggleLanguage() {
  currentLanguage = currentLanguage === 'AR' ? 'EN' : 'AR';
  document.documentElement.dir = currentLanguage === 'AR' ? 'rtl' : 'ltr';
  document.documentElement.lang = currentLanguage.toLowerCase();
  document.getElementById('langToggleBtn').textContent = currentLanguage === 'AR' ? 'English 🌐' : 'العربية 🌐';
}

function showLoginError(msg) {
  const errorBox = document.getElementById('loginErrorBox');
  if (errorBox) {
    errorBox.textContent = msg;
    errorBox.classList.remove('hidden');
  }
}

function setupPortalEventListeners() {
  const loginForm = document.getElementById('customerLoginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleCustomerLogin);
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleCustomerLogout);
  }

  const langBtn = document.getElementById('langToggleBtn');
  if (langBtn) {
    langBtn.addEventListener('click', toggleLanguage);
  }
}

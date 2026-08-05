const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '..', 'js', 'app.js');
const content = fs.readFileSync(appJsPath, 'utf8');

const appJsMarker = '/* --- app.js --- */';
const idx = content.indexOf(appJsMarker);

if (idx !== -1) {
  let appCore = content.slice(idx);
  
  // Normalize CRLF to LF
  appCore = appCore.replace(/\r\n/g, '\n');

  // 1. Ensure default currentUser so app boots directly into ERP workspace
  appCore = appCore.replace(
    "const state = {\n  lang: 'ar',",
    "var state = window.state = {\n  lang: 'ar',\n  currentUser: { id: 1, name: 'مدير النظام (Admin)', role: 'ADMIN' },"
  );

  // 2. Auto-close mobile drawer on tab switch and attach to window
  appCore = appCore.replace(
    'function switchTab(tabId) { state.activeTab = tabId; renderApp(); }',
    'function switchTab(tabId) { const s = (typeof state !== "undefined" && state) ? state : window.state; if (s) { s.activeTab = tabId; s.isMobileSidebarOpen = false; } if (typeof renderApp === "function") renderApp(); }\nwindow.switchTab = switchTab;'
  );

  // 3. Attach toggleMobileSidebar cleanly to function and window
  appCore = appCore.replace(
    "window.toggleMobileSidebar = function(forceState) {\n  if (typeof forceState === 'boolean') {\n    state.isMobileSidebarOpen = forceState;\n  } else {\n    state.isMobileSidebarOpen = !state.isMobileSidebarOpen;\n  }\n  renderApp();\n};",
    'function toggleMobileSidebar(forceState) {\n  const s = (typeof state !== "undefined" && state) ? state : window.state;\n  if (s) {\n    if (typeof forceState === "boolean") s.isMobileSidebarOpen = forceState;\n    else s.isMobileSidebarOpen = !s.isMobileSidebarOpen;\n  }\n  if (typeof renderApp === "function") renderApp();\n}\nwindow.toggleMobileSidebar = toggleMobileSidebar;'
  );

  // 4. Update renderApp to use safe state reference 's'
  appCore = appCore.replace(
    `function renderApp() {\n\n  const root = document.getElementById('app');\n  if (!root) return;\n\n  const isRtl = state.lang === 'ar';`,
    `function renderApp() {\n\n  const root = document.getElementById('app');\n  if (!root) return;\n  const s = (typeof state !== "undefined" && state) ? state : window.state;\n  if (!s) return;\n\n  const isRtl = s.lang === 'ar';`
  );

  appCore = appCore.replace(
    "if (!state.currentUser) {",
    "if (!s.currentUser) {"
  );

  appCore = appCore.replace(
    "const currentTitle = tabTitles[state.activeTab] || 'لوحة القيادة التنفيذية';",
    "const currentTitle = tabTitles[s.activeTab] || 'لوحة القيادة التنفيذية';"
  );

  appCore = appCore.replace(
    "${typeof UIComponents !== 'undefined' ? UIComponents.renderSidebar(state.activeTab, state.isSidebarCollapsed) : renderSidebar()}",
    "${typeof Sidebar !== 'undefined' ? Sidebar.render(s.activeTab, s.isSidebarCollapsed, s.isMobileSidebarOpen) : (typeof UIComponents !== 'undefined' ? UIComponents.renderSidebar(s.activeTab, s.isSidebarCollapsed) : '')}"
  );

  appCore = appCore.replace(
    "${typeof UIComponents !== 'undefined' ? UIComponents.renderHeader(currentTitle, state.activeTab) : ''}",
    "${typeof Header !== 'undefined' ? Header.render(currentTitle, s.activeTab) : (typeof UIComponents !== 'undefined' ? UIComponents.renderHeader(currentTitle, s.activeTab) : '')}"
  );

  appCore = appCore.replace(
    "..., state.activeTab) : ''}",
    "..., s.activeTab) : ''}"
  );

  appCore = appCore.replace(
    "${state.isLoading ? renderLoadingSpinner() : renderActiveTabContent()}",
    "${s.isLoading ? renderLoadingSpinner() : renderActiveTabContent()}"
  );

  // 5. Remove duplicate fallback renderSidebar function
  const duplicateSidebarStart = 'function renderSidebar() {';
  const duplicateSidebarEnd = 'function renderActiveTabContent() {';
  const startIdx = appCore.indexOf(duplicateSidebarStart);
  const endIdx = appCore.indexOf(duplicateSidebarEnd);
  if (startIdx !== -1 && endIdx !== -1) {
    appCore = appCore.slice(0, startIdx) + appCore.slice(endIdx);
    console.log('✓ Removed duplicate renderSidebar function from core application code');
  }

  // 6. Add touch swipe, window resize, and DOM ready auto-bootstrap
  const listenerCode = `
/* ═══════════════════════════════════════════════════════════════
   GLOBAL WINDOW RESIZE, TOUCH SWIPE GESTURE & BOOTSTRAP HANDLERS
   ═══════════════════════════════════════════════════════════════ */
if (typeof window !== 'undefined') {
  window.addEventListener('resize', () => {
    const s = (typeof state !== 'undefined' && state) ? state : window.state;
    if (window.innerWidth >= 768 && s && s.isMobileSidebarOpen) {
      s.isMobileSidebarOpen = false;
      if (typeof renderApp === 'function') renderApp();
    }
  });

  let touchStartX = 0;
  let touchStartY = 0;
  document.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches[0]) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    const s = (typeof state !== 'undefined' && state) ? state : window.state;
    if (!s || !s.isMobileSidebarOpen) return;
    if (e.changedTouches && e.changedTouches[0]) {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;
      if (Math.abs(diffX) > Math.abs(diffY) && diffX > 60) {
        if (typeof toggleMobileSidebar === 'function') toggleMobileSidebar(false);
      }
    }
  }, { passive: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initApp());
  } else {
    initApp();
  }
}
`;

  appCore += listenerCode;

  const appCorePath = path.join(__dirname, '..', 'js', 'app_core.js');
  fs.writeFileSync(appCorePath, appCore, 'utf8');
  console.log(`✓ Successfully updated js/app_core.js (${appCore.length} bytes)`);
} else {
  console.error('❌ Could not find app.js marker in app.js');
}

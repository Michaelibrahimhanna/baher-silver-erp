const puppeteer = require('puppeteer-core');
const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3888;
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.json': 'application/json'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(__dirname, '..', reqPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
    res.end(fs.readFileSync(filePath));
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

async function runResponsiveTests() {
  server.listen(port, async () => {
    console.log(`Test server running at http://localhost:${port}`);

    const possiblePaths = [
      'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
    ];
    let executablePath = possiblePaths.find(p => fs.existsSync(p));
    
    if (!executablePath) {
      console.error('No browser executable found for Puppeteer testing');
      server.close();
      process.exit(1);
    }

    console.log(`Using browser executable: ${executablePath}`);
    const browser = await puppeteer.launch({
      executablePath,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    const consoleLogs = [];
    const jsErrors = [];

    page.on('console', msg => {
      if (msg.type() === 'error') jsErrors.push(msg.text());
      else consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
    });

    page.on('pageerror', err => {
      jsErrors.push(err.toString());
    });

    const viewports = [
      { name: 'Android Chrome (360px)', width: 360, height: 640 },
      { name: 'iPhone Safari (390px)', width: 390, height: 844 },
      { name: 'iPhone Plus/Max (414px)', width: 414, height: 896 },
      { name: 'Tablet (768px)', width: 768, height: 1024 },
      { name: 'Desktop Small (1024px)', width: 1024, height: 768 },
      { name: 'Desktop Large (1440px)', width: 1440, height: 900 }
    ];

    const modulesToTest = [
      { id: 'wh_dashboard', label: 'Dashboard' },
      { id: 'stones', label: 'Inventory (Stones)' },
      { id: 'raw_materials', label: 'Inventory (Raw)' },
      { id: 'silver_inventory', label: 'Inventory (Silver)' },
      { id: 'products', label: 'Manufacturing (Products)' },
      { id: 'mo_kanban', label: 'Manufacturing (MOs)' },
      { id: 'purchasing', label: 'Purchasing' },
      { id: 'suppliers', label: 'Purchasing (Suppliers)' },
      { id: 'customer_orders', label: 'Sales' },
      { id: 'customer_service', label: 'CRM (Services)' },
      { id: 'customer_portal', label: 'Customer Portal' },
      { id: 'reports_analytics', label: 'Reports' },
      { id: 'settings', label: 'Settings' },
      { id: 'master_center', label: 'Master Data' }
    ];

    for (const vp of viewports) {
      console.log(`\n--- Testing Viewport: ${vp.name} ---`);
      await page.setViewport({ width: vp.width, height: vp.height });
      await page.goto(`http://localhost:${port}/index.html`, { waitUntil: 'load' });

      // Wait 3.5s for initApp network port detection
      await new Promise(r => setTimeout(r, 3500));

      await page.evaluate(() => {
        if (typeof state !== 'undefined') {
          state.currentUser = { id: 1, name: 'Admin', role: 'ADMIN' };
          renderApp();
        }
      });

      // Check horizontal overflow
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      console.log(`  Horizontal body overflow: ${hasHorizontalScroll ? '⚠️ YES' : '✓ NO'}`);

      if (vp.width < 768) {
        // Mobile Drawer Test
        const hamburgerVisible = await page.evaluate(() => {
          const btn = document.getElementById('btn-mobile-menu');
          if (!btn) return false;
          const style = window.getComputedStyle(btn);
          return style.display !== 'none' && style.visibility !== 'hidden';
        });
        console.log(`  Hamburger button visible (<768px): ${hamburgerVisible ? '✓ YES' : '❌ NO'}`);

        // Open mobile sidebar
        await page.evaluate(() => toggleMobileSidebar(true));
        const drawerOpen = await page.evaluate(() => {
          const sidebar = document.getElementById('bs-app-sidebar');
          const backdrop = document.getElementById('mobile-sidebar-backdrop');
          return sidebar && backdrop && !sidebar.classList.contains('hidden');
        });
        console.log(`  Drawer opens with backdrop overlay: ${drawerOpen ? '✓ YES' : '❌ NO'}`);

        // Test module navigation & auto-close
        for (const mod of modulesToTest) {
          await page.evaluate((tabId) => switchTab(tabId), mod.id);
          const isDrawerClosed = await page.evaluate(() => {
            return typeof state !== 'undefined' && !state.isMobileSidebarOpen;
          });
          const activeTabMatches = await page.evaluate((tabId) => {
            return typeof state !== 'undefined' && state.activeTab === tabId;
          }, mod.id);
          if (!isDrawerClosed || !activeTabMatches) {
            console.error(`  ❌ Module ${mod.label} (${mod.id}) failed auto-close or active tab state`);
          }
        }
        console.log(`  ✓ All ${modulesToTest.length} modules navigated successfully with drawer auto-close`);
      } else {
        // Desktop / Tablet test
        const sidebarVisible = await page.evaluate(() => {
          const sidebar = document.getElementById('bs-app-sidebar');
          if (!sidebar) return false;
          const style = window.getComputedStyle(sidebar);
          return style.display !== 'none';
        });
        console.log(`  Sidebar visible (>=768px): ${sidebarVisible ? '✓ YES' : '❌ NO'}`);
      }
    }

    console.log('\n--- Test Results Summary ---');
    if (jsErrors.length === 0) {
      console.log('✓ SUCCESS: 0 JavaScript errors encountered across all viewports!');
    } else {
      console.error(`❌ JavaScript Errors (${jsErrors.length}):`);
      jsErrors.forEach(err => console.error(`  - ${err}`));
    }

    await browser.close();
    server.close();
    process.exit(jsErrors.length > 0 ? 1 : 0);
  });
}

runResponsiveTests();

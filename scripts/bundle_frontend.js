const fs = require('fs');
const path = require('path');

console.log('Building self-contained production bundle for Hostinger deployment...');

const rootDir = path.join(__dirname, '..');

// 1. Bundle CSS into css/main.css
const cssDir = path.join(rootDir, 'css');
const cssFiles = [
  'tokens.css',
  'typography.css',
  'animations.css',
  'buttons.css',
  'cards.css',
  'tables.css',
  'forms.css',
  'sidebar.css',
  'header.css',
  'light.css',
  'dark.css',
  'design_system.css'
];

let bundledCss = `/* BAHER SILVER ERP v4.0 ENTERPRISE SELF-CONTAINED CSS BUNDLE */\n`;
for (const file of cssFiles) {
  const filePath = path.join(cssDir, file);
  if (fs.existsSync(filePath)) {
    bundledCss += `\n/* --- ${file} --- */\n` + fs.readFileSync(filePath, 'utf8');
  }
}
fs.writeFileSync(path.join(cssDir, 'main.css'), bundledCss, 'utf8');
console.log('✓ Successfully bundled 12 CSS files into css/main.css');

// 2. Bundle JS components into js/app.js
const jsDir = path.join(rootDir, 'js');
const jsFiles = [
  path.join(jsDir, 'ui_components.js'),
  path.join(jsDir, 'components', 'Sidebar.js'),
  path.join(jsDir, 'components', 'Header.js'),
  path.join(jsDir, 'components', 'Tabs.js'),
  path.join(jsDir, 'components', 'DataGrid.js'),
  path.join(jsDir, 'components', 'Timeline.js'),
  path.join(jsDir, 'components', 'Charts.js'),
  path.join(jsDir, 'components', 'CommandPalette.js'),
  path.join(jsDir, 'components', 'Notifications.js'),
  path.join(jsDir, 'components', 'Toast.js'),
  path.join(jsDir, 'ui.js')
];

const appJsPath = path.join(jsDir, 'app.js');
const rawAppJs = fs.readFileSync(appJsPath, 'utf8');

let bundledJs = `/* BAHER SILVER ERP v4.0 ENTERPRISE SELF-CONTAINED JS BUNDLE */\n`;
for (const filePath of jsFiles) {
  if (fs.existsSync(filePath)) {
    bundledJs += `\n/* --- ${path.basename(filePath)} --- */\n` + fs.readFileSync(filePath, 'utf8');
  }
}

// Only append rawAppJs if it's not already bundled
if (!rawAppJs.includes('/* BAHER SILVER ERP v4.0 ENTERPRISE SELF-CONTAINED JS BUNDLE */')) {
  bundledJs += `\n/* --- app.js --- */\n` + rawAppJs;
} else {
  bundledJs = rawAppJs;
}

fs.writeFileSync(appJsPath, bundledJs, 'utf8');
console.log('✓ Successfully bundled 11 JS components into self-contained js/app.js');

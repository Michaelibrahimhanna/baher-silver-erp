const fs = require('fs');
const path = require('path');

console.log('Building self-contained production bundle for Baher Silver ERP...');

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
console.log(`✓ Successfully bundled ${cssFiles.length} CSS files into css/main.css`);

// 2. Bundle JS components and app core into js/app.js in correct dependency order
const jsDir = path.join(rootDir, 'js');
const jsFiles = [
  path.join(jsDir, 'components', 'Navigation.js'),
  path.join(jsDir, 'components', 'Drawer.js'),
  path.join(jsDir, 'components', 'Sidebar.js'),
  path.join(jsDir, 'components', 'Header.js'),
  path.join(jsDir, 'components', 'Tabs.js'),
  path.join(jsDir, 'components', 'DataGrid.js'),
  path.join(jsDir, 'components', 'Timeline.js'),
  path.join(jsDir, 'components', 'Charts.js'),
  path.join(jsDir, 'components', 'CommandPalette.js'),
  path.join(jsDir, 'components', 'Notifications.js'),
  path.join(jsDir, 'components', 'Toast.js'),
  path.join(jsDir, 'ui_components.js'),
  path.join(jsDir, 'ui.js'),
  path.join(jsDir, 'app_core.js')
];

let bundledJs = `/* BAHER SILVER ERP v4.0 ENTERPRISE SELF-CONTAINED JS BUNDLE */\n`;
for (const filePath of jsFiles) {
  if (fs.existsSync(filePath)) {
    bundledJs += `\n/* --- ${path.basename(filePath)} --- */\n` + fs.readFileSync(filePath, 'utf8');
  } else {
    console.warn(`⚠️ Warning: file not found: ${filePath}`);
  }
}

const appJsPath = path.join(jsDir, 'app.js');
fs.writeFileSync(appJsPath, bundledJs, 'utf8');
console.log(`✓ Successfully bundled ${jsFiles.length} JS components into self-contained js/app.js`);

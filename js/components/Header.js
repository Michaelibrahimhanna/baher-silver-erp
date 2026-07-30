/**
 * BAHER SILVER ERP — HEADER COMPONENT MODULE
 */
const Header = {
  render(currentTitle = 'لوحة القيادة التنفيذية', activeTab = 'dashboard') {
    return UIComponents.renderHeader(currentTitle, activeTab);
  }
};

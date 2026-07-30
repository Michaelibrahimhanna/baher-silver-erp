/**
 * BAHER SILVER ERP — SIDEBAR COMPONENT MODULE
 */
const Sidebar = {
  render(activeTab = 'dashboard', collapsed = false) {
    return UIComponents.renderSidebar(activeTab, collapsed);
  }
};

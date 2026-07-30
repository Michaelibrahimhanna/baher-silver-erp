/**
 * BAHER SILVER ERP — MULTI-TAB WORKSPACE MODULE
 */
const Tabs = {
  render(openTabs = [], activeTab = 'wh_dashboard') {
    return UIComponents.renderMultiTabBar(openTabs, activeTab);
  }
};

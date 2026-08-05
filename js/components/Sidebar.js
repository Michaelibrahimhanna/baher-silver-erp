/**
 * BAHER SILVER ERP — SIDEBAR COMPONENT MODULE
 * Delegates menu rendering to Navigation engine and shell layout to Drawer component.
 */

const Sidebar = {
  render(activeTab = 'wh_dashboard', collapsed = false, isMobileOpen = false) {
    const menuHtml = typeof Navigation !== 'undefined'
      ? Navigation.renderMenuItems(activeTab, collapsed)
      : '';
      
    return typeof Drawer !== 'undefined'
      ? Drawer.render(activeTab, collapsed, isMobileOpen, menuHtml)
      : '';
  }
};

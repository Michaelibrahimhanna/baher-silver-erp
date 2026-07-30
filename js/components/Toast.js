/**
 * BAHER SILVER ERP — TOAST SYSTEM MODULE
 */
const ToastNotification = {
  show(message, type = 'success') {
    if (typeof Toast !== 'undefined' && Toast.show) {
      Toast.show(message, '', type);
    }
  }
};

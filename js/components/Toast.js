/**
 * BAHER SILVER ERP — TOAST SYSTEM MODULE
 */
const Toast = {
  show(message, title = '', type = 'info') {
    const container = document.getElementById('bs-toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `p-3.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs font-bold shadow-2xl flex items-center gap-3 animate-fade-in mb-2`;
    toast.innerHTML = `<span>⚡</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 4000);
  },
  success(msg) { this.show(msg, '', 'success'); },
  error(msg) { this.show(msg, '', 'error'); },
  info(msg) { this.show(msg, '', 'info'); }
};

const ToastNotification = Toast;

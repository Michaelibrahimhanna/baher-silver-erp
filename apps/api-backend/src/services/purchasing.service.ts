export class PurchasingService {
  static async listSuppliers() { return []; }
  static async createSupplier(data: any) { return { id: 'sup-1', ...data }; }
  static async listPurchaseOrders() { return []; }
  static async createPurchaseOrder(data: any) { return { id: 'po-1', ...data }; }
}

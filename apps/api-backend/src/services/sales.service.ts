export class SalesService {
  static async listCustomers() { return []; }
  static async createCustomer(data: any) { return { id: 'cust-1', ...data }; }
  static async listSalesOrders() { return []; }
  static async createSalesOrder(data: any) { return { id: 'so-1', ...data }; }
}

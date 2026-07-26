export class ProductionService {
  static async getWipOrders() { return []; }
  static async getWorkerYield() { return []; }
  static async createOrder(data: any) { return { id: 'wip-1', status: 'created' }; }
}

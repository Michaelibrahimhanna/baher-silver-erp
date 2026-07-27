import { ProductService } from './product.service';
import { BOMService } from './bom.service';
import { RoutingService } from './routing.service';
import { CostingService } from './costing.service';

export class ProductionService {
  static async getWipOrders() {
    const products = await ProductService.listProducts({});
    return products.map(p => ({
      id: `wip-${p.id.slice(0, 8)}`,
      productCode: p.productCode,
      productName: p.nameAr,
      status: 'IN_PROGRESS',
      category: p.category,
      silverWeightGrams: p.silverWeightGrams,
      updatedAt: p.updatedAt
    }));
  }

  static async getWorkerYield() {
    return [
      { workerName: 'أحمد محمود', stage: 'CASTING', yieldPct: 98.5, completedOrders: 42 },
      { workerName: 'مصطفى حسن', stage: 'STONE_SETTING', yieldPct: 99.1, completedOrders: 38 },
      { workerName: 'إبراهيم علي', stage: 'POLISHING', yieldPct: 97.8, completedOrders: 50 }
    ];
  }

  static async createOrder(data: any) {
    const product = await ProductService.getProductById(data.productId || data.finishedProductId);
    if (!product) throw new Error('Product not found');

    const bom = await BOMService.getBOMForProduct(product.id);
    const routing = await RoutingService.getRoutingForProduct(product.id);
    const cost = await CostingService.getCostForProduct(product.id);

    return {
      id: `ORD-${Date.now()}`,
      productCode: product.productCode,
      productName: product.nameAr,
      targetQuantity: data.targetQuantity || 1,
      status: 'CREATED',
      bom,
      routing,
      cost,
      createdAt: new Date().toISOString()
    };
  }
}

import { StoneService } from './stone.service';

export class InventoryService {
  static async getActiveInventorySummary(filters: any) {
    return StoneService.listStones(filters);
  }
}

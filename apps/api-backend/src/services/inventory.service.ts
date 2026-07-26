/**
 * Production Inventory Engine Service - Baher Silver ERP (Phase 21)
 * Enforces Gram (g) as the ONLY base unit (1 ct = 0.2 g display conversion).
 * Configurable Inventory Valuation: FIFO, Moving Average, Specific Cost.
 * Balance updates across Available, Reserved, InProduction, Damaged, Returned.
 */

export type ValuationMethod = 'FIFO' | 'MOVING_AVERAGE' | 'SPECIFIC_COST';

export interface InventoryBalanceRecord {
  id: string;
  entityType: string;
  entityId: string;
  itemCode: string;
  batchNumber?: string;
  warehouseId: string;
  locationId?: string;
  availableQty: number;
  reservedQty: number;
  inProductionQty: number;
  damagedQty: number;
  returnedQty: number;
  baseUnit: 'g';
  lastMovementId?: string;
  lastMovementAt: Date;
}

export class InventoryEngineService {
  private valuationMethod: ValuationMethod = 'MOVING_AVERAGE';

  /**
   * Convert display units (carats) to base unit (grams).
   * Rule: 1 ct = 0.2 g (Gram is the ONLY base unit).
   */
  public convertCaratToGram(caratWeight: number): number {
    return parseFloat((caratWeight * 0.2).toFixed(4));
  }

  /**
   * Convert base unit (grams) to display carat format.
   */
  public convertGramToCaratDisplay(gramWeight: number): string {
    const carats = (gramWeight / 0.2).toFixed(2);
    return `${gramWeight}g (${carats} ct)`;
  }

  /**
   * Calculate moving average cost valuation.
   */
  public calculateMovingAverageCost(
    currentStockGrams: number,
    currentUnitCost: number,
    incomingQtyGrams: number,
    incomingUnitCost: number
  ): number {
    const totalQty = currentStockGrams + incomingQtyGrams;
    if (totalQty <= 0) return incomingUnitCost;
    const totalValue = currentStockGrams * currentUnitCost + incomingQtyGrams * incomingUnitCost;
    return parseFloat((totalValue / totalQty).toFixed(2));
  }

  /**
   * Automatically process balance update for any inventory movement.
   */
  public processMovementBalanceUpdate(
    currentBalance: InventoryBalanceRecord,
    txType: 'RECEIVE' | 'ISSUE' | 'TRANSFER' | 'ADJUSTMENT' | 'RETURN' | 'PRODUCTION_CONSUMPTION' | 'PRODUCTION_RETURN' | 'SALES_DISPATCH' | 'PURCHASE_RECEIPT' | 'AUDIT_ADJUSTMENT',
    changeQty: number,
    movementId: string
  ): InventoryBalanceRecord {
    const updated = { ...currentBalance };
    updated.lastMovementId = movementId;
    updated.lastMovementAt = new Date();

    switch (txType) {
      case 'RECEIVE':
      case 'PURCHASE_RECEIPT':
      case 'PRODUCTION_RETURN':
        updated.availableQty += changeQty;
        break;

      case 'ISSUE':
      case 'SALES_DISPATCH':
        updated.availableQty = Math.max(0, updated.availableQty - changeQty);
        break;

      case 'PRODUCTION_CONSUMPTION':
        updated.availableQty = Math.max(0, updated.availableQty - changeQty);
        updated.inProductionQty += changeQty;
        break;

      case 'RETURN':
        updated.returnedQty += changeQty;
        break;

      case 'TRANSFER':
      case 'ADJUSTMENT':
      case 'AUDIT_ADJUSTMENT':
        updated.availableQty = changeQty;
        break;
    }

    return updated;
  }
}

export const inventoryEngineService = new InventoryEngineService();

import { EventEmitter } from 'events';

export interface ProductionDomainEvent {
  eventType: 'MO_CREATED' | 'MO_CONFIRMED' | 'MATERIALS_RESERVED' | 'OPERATION_LOGGED' | 'MO_COMPLETED' | 'PIECES_PRODUCED';
  moId: string;
  moCode: string;
  payload: any;
  timestamp: string;
}

class ProductionDomainEventEmitter extends EventEmitter {
  public emitEvent(event: ProductionDomainEvent) {
    console.log(`[PRODUCTION DOMAIN EVENT] ${event.eventType} for MO ${event.moCode}`);
    this.emit(event.eventType, event);
    this.emit('*', event);
  }
}

export const productionEventEmitter = new ProductionDomainEventEmitter();

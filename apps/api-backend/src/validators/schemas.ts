import { z } from 'zod';

export const LoginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

export const GemstoneItemSchema = z.object({
  stoneCode: z.string().min(2),
  nameEn: z.string().min(2),
  nameAr: z.string().min(2),
  category: z.string(),
  weightCarats: z.number().positive(),
  qtyAvailable: z.number().int().nonnegative(),
  purchasePricePerCarat: z.number().nonnegative(),
  sellingPricePerCarat: z.number().nonnegative(),
  storageLocationId: z.string().uuid(),
});

export const SilverItemSchema = z.object({
  batchCode: z.string().min(2),
  silverCategory: z.string(),
  purityId: z.string().uuid(),
  grossWeightGrams: z.number().positive(),
  costPerGram: z.number().positive(),
  storageLocationId: z.string().uuid(),
});

export const ProductionOrderSchema = z.object({
  productionCode: z.string().min(2),
  finishedProductId: z.string().uuid(),
  bomId: z.string().uuid(),
  targetQuantity: z.number().int().positive(),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
});

export const PurchaseOrderSchema = z.object({
  poNumber: z.string().min(2),
  supplierId: z.string().uuid(),
  currencyId: z.string().uuid(),
  items: z.array(z.object({
    itemDescription: z.string().min(2),
    quantityOrdered: z.number().positive(),
    unitPrice: z.number().positive(),
    unitId: z.string().uuid(),
  })).min(1),
});

export const SalesOrderSchema = z.object({
  soNumber: z.string().min(2),
  customerId: z.string().uuid(),
  currencyId: z.string().uuid(),
  items: z.array(z.object({
    finishedProductId: z.string().uuid(),
    quantityOrdered: z.number().int().positive(),
    unitPrice: z.number().positive(),
  })).min(1),
});

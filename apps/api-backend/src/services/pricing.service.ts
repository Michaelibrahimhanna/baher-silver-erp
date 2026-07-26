import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class PricingService {
  static async getPricesForItem(itemId: string) {
    return prisma.itemPriceProfile.findMany({
      where: { itemId }
    });
  }

  static async setPriceProfile(data: {
    itemId: string;
    profileType: string; // 'RETAIL' | 'WHOLESALE' | 'VIP' | 'EXPORT' | 'FACTORY'
    pricePerGram?: number;
    pricePerPiece?: number;
    pricePerCarat?: number;
    currency?: string;
  }) {
    return prisma.itemPriceProfile.upsert({
      where: {
        itemId_profileType: {
          itemId: data.itemId,
          profileType: data.profileType
        }
      },
      update: {
        pricePerGram: Number(data.pricePerGram || 0),
        pricePerPiece: Number(data.pricePerPiece || 0),
        pricePerCarat: Number(data.pricePerCarat || 0),
        currency: data.currency || 'EGP'
      },
      create: {
        itemId: data.itemId,
        profileType: data.profileType,
        pricePerGram: Number(data.pricePerGram || 0),
        pricePerPiece: Number(data.pricePerPiece || 0),
        pricePerCarat: Number(data.pricePerCarat || 0),
        currency: data.currency || 'EGP'
      }
    });
  }
}

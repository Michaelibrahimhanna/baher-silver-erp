import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SearchService {
  static async universalSearch(query: string) {
    if (!query || query.trim() === '') {
      return { stones: [], rawMaterials: [], locations: [], movements: [] };
    }

    const q = query.trim();

    const stones = await prisma.itemGemstone.findMany({
      where: {
        OR: [
          { code: { contains: q } },
          { internalCode: { contains: q } },
          { qrCode: { contains: q } },
          { barcode: { contains: q } },
          { nameAr: { contains: q } },
          { nameEn: { contains: q } },
          { category: { contains: q } },
          { stoneType: { contains: q } },
          { color: { contains: q } },
          { shape: { contains: q } },
          { size: { contains: q } },
          { origin: { contains: q } },
          { quality: { contains: q } },
          { supplierName: { contains: q } },
          { batchNumber: { contains: q } }
        ]
      },
      include: {
        warehouse: { select: { nameAr: true } },
        storageLocation: { select: { fullPathAr: true, binCode: true } }
      },
      take: 50
    });

    const rawMaterials = await prisma.itemRawMaterial.findMany({
      where: {
        OR: [
          { itemCode: { contains: q } },
          { nameAr: { contains: q } },
          { nameEn: { contains: q } },
          { category: { contains: q } },
          { supplierName: { contains: q } },
          { batchNumber: { contains: q } },
          { barcode: { contains: q } },
          { qrCode: { contains: q } }
        ]
      },
      include: {
        warehouse: { select: { nameAr: true } },
        storageLocation: { select: { fullPathAr: true } }
      },
      take: 50
    });

    const locations = await prisma.storageLocation.findMany({
      where: {
        OR: [
          { binCode: { contains: q } },
          { locationName: { contains: q } },
          { cabinet: { contains: q } },
          { shelf: { contains: q } },
          { drawer: { contains: q } },
          { box: { contains: q } },
          { bag: { contains: q } },
          { fullPathAr: { contains: q } },
          { barcode: { contains: q } },
          { qrCode: { contains: q } }
        ]
      },
      take: 20
    });

    const movements = await prisma.stockMovement.findMany({
      where: {
        OR: [
          { itemCode: { contains: q } },
          { itemName: { contains: q } },
          { batchNumber: { contains: q } },
          { referenceDoc: { contains: q } },
          { userName: { contains: q } }
        ]
      },
      take: 20,
      orderBy: { createdAt: 'desc' }
    });

    return { stones, rawMaterials, locations, movements };
  }
}

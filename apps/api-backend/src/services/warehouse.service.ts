import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class WarehouseService {
  static async listWarehouses() {
    return prisma.warehouse.findMany({
      where: { isActive: true },
      include: {
        _count: { select: { itemsGemstone: true, itemsRawMaterials: true, storageLocations: true } }
      },
      orderBy: { code: 'asc' }
    });
  }

  static async listLocations(warehouseId?: string) {
    const where: any = { isActive: true };
    if (warehouseId) where.warehouseId = warehouseId;

    return prisma.storageLocation.findMany({
      where,
      include: {
        warehouse: { select: { code: true, nameAr: true } }
      },
      orderBy: { binCode: 'asc' }
    });
  }

  static async createLocation(data: {
    warehouseId: string;
    parentLocationId?: string;
    binCode: string;
    locationName: string;
    cabinet?: string;
    shelf?: string;
    drawer?: string;
    box?: string;
    bag?: string;
  }) {
    const wh = await prisma.warehouse.findUnique({ where: { id: data.warehouseId } });
    if (!wh) throw new Error('Warehouse not found');

    const pathParts = ['المخزن الرئيسي', wh.nameAr];
    if (data.cabinet) pathParts.push(data.cabinet);
    if (data.shelf) pathParts.push(data.shelf);
    if (data.drawer) pathParts.push(data.drawer);
    if (data.box) pathParts.push(data.box);
    if (data.bag) pathParts.push(data.bag);

    const fullPathAr = pathParts.join(' ➔ ');
    const qrCode = `QR-LOC-${data.binCode}`;
    const barcode = `BAR-LOC-${data.binCode}`;

    return prisma.storageLocation.create({
      data: {
        warehouseId: data.warehouseId,
        parentLocationId: data.parentLocationId,
        binCode: data.binCode,
        locationName: data.locationName,
        cabinet: data.cabinet,
        shelf: data.shelf,
        drawer: data.drawer,
        box: data.box,
        bag: data.bag,
        fullPathAr,
        qrCode,
        barcode
      }
    });
  }
}

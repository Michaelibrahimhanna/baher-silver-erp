import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class VariantService {
  static async getVariantsForProduct(productId: string) {
    return prisma.productVariant.findMany({
      where: { productId, isActive: true },
      orderBy: { createdAt: 'asc' }
    });
  }

  static async createVariant(productId: string, data: {
    ringSize?: string;
    stoneColor?: string;
    stoneSize?: string;
    silverPurity?: string;
    surfaceFinish?: string;
    priceDelta?: number;
  }) {
    const product = await prisma.productMaster.findUnique({ where: { id: productId } });
    if (!product) throw new Error('Product not found');

    const count = await prisma.productVariant.count({ where: { productId } });
    const variantCode = `${product.productCode}-V${count + 1}`;

    return prisma.productVariant.create({
      data: {
        productId,
        variantCode,
        ringSize: data.ringSize,
        stoneColor: data.stoneColor,
        stoneSize: data.stoneSize,
        silverPurity: data.silverPurity,
        surfaceFinish: data.surfaceFinish,
        priceDelta: data.priceDelta || 0
      }
    });
  }

  static async updateVariant(id: string, data: any) {
    return prisma.productVariant.update({
      where: { id },
      data: {
        ringSize: data.ringSize,
        stoneColor: data.stoneColor,
        stoneSize: data.stoneSize,
        silverPurity: data.silverPurity,
        surfaceFinish: data.surfaceFinish,
        priceDelta: data.priceDelta
      }
    });
  }

  static async deleteVariant(id: string) {
    return prisma.productVariant.update({
      where: { id },
      data: { isActive: false }
    });
  }
}

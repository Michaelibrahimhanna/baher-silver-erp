import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ProductService {
  static async listProducts(filters: { search?: string; category?: string; collection?: string; silverPurity?: string }) {
    const where: any = { isActive: true };

    if (filters.category && filters.category !== 'ALL') where.category = filters.category;
    if (filters.collection) where.collection = filters.collection;
    if (filters.silverPurity) where.silverPurity = filters.silverPurity;

    if (filters.search) {
      const q = filters.search;
      where.OR = [
        { nameAr: { contains: q } },
        { nameEn: { contains: q } },
        { productCode: { contains: q } },
        { collection: { contains: q } }
      ];
    }

    return prisma.productMaster.findMany({
      where,
      include: {
        bom: { include: { lines: true } },
        variants: true,
        routing: { include: { steps: { orderBy: { sequenceNo: 'asc' } } } },
        cost: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getProductById(id: string) {
    return prisma.productMaster.findUnique({
      where: { id },
      include: {
        bom: { include: { lines: true } },
        variants: true,
        routing: { include: { steps: { orderBy: { sequenceNo: 'asc' } } } },
        cost: true
      }
    });
  }

  static async createProduct(data: {
    nameAr: string;
    nameEn?: string;
    category?: string;
    collection?: string;
    silverPurity?: string;
    silverWeightGrams?: number;
    stoneCount?: number;
    stoneWeightGrams?: number;
    componentWeightGrams?: number;
    rhodiumType?: string;
    ringSizeDefault?: string;
    imageUrls?: string;
    attachmentUrls?: string;
    manufacturingNotes?: string;
  }) {
    const count = await prisma.productMaster.count();
    const productCode = `PRD-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;

    return prisma.productMaster.create({
      data: {
        productCode,
        nameAr: data.nameAr,
        nameEn: data.nameEn || data.nameAr,
        category: data.category || 'خاتم',
        collection: data.collection,
        silverPurity: data.silverPurity || '925',
        silverWeightGrams: data.silverWeightGrams || 0,
        stoneCount: data.stoneCount || 0,
        stoneWeightGrams: data.stoneWeightGrams || 0,
        componentWeightGrams: data.componentWeightGrams || 0,
        rhodiumType: data.rhodiumType,
        ringSizeDefault: data.ringSizeDefault,
        imageUrls: data.imageUrls,
        attachmentUrls: data.attachmentUrls,
        manufacturingNotes: data.manufacturingNotes
      }
    });
  }

  static async updateProduct(id: string, data: any) {
    return prisma.productMaster.update({
      where: { id },
      data: {
        nameAr: data.nameAr,
        nameEn: data.nameEn,
        category: data.category,
        collection: data.collection,
        silverPurity: data.silverPurity,
        silverWeightGrams: data.silverWeightGrams,
        stoneCount: data.stoneCount,
        stoneWeightGrams: data.stoneWeightGrams,
        componentWeightGrams: data.componentWeightGrams,
        rhodiumType: data.rhodiumType,
        ringSizeDefault: data.ringSizeDefault,
        imageUrls: data.imageUrls,
        attachmentUrls: data.attachmentUrls,
        manufacturingNotes: data.manufacturingNotes
      }
    });
  }

  static async deleteProduct(id: string) {
    return prisma.productMaster.update({
      where: { id },
      data: { isActive: false }
    });
  }
}

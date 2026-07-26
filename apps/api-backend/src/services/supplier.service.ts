import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SupplierService {
  static async listSuppliers() {
    return prisma.supplierProfile.findMany({
      where: { isActive: true },
      orderBy: { companyNameAr: 'asc' }
    });
  }

  static async createSupplier(data: {
    supplierCode?: string;
    companyNameAr: string;
    companyNameEn: string;
    contactPerson?: string;
    phone?: string;
    email?: string;
    country?: string;
    currency?: string;
    defaultStoneCategories?: string;
    defaultRawCategories?: string;
    paymentTerms?: string;
    leadTimeDays?: number;
    rating?: number;
    certificates?: string;
  }) {
    const supplierCode = data.supplierCode || `SUP-${Date.now().toString().slice(-4)}`;
    return prisma.supplierProfile.create({
      data: {
        supplierCode,
        companyNameAr: data.companyNameAr,
        companyNameEn: data.companyNameEn,
        contactPerson: data.contactPerson || '',
        phone: data.phone || '',
        email: data.email || '',
        country: data.country || 'تايلاند',
        currency: data.currency || 'USD',
        defaultStoneCategories: data.defaultStoneCategories || '[]',
        defaultRawCategories: data.defaultRawCategories || '[]',
        paymentTerms: data.paymentTerms || 'Net 30',
        leadTimeDays: Number(data.leadTimeDays || 14),
        rating: Number(data.rating || 5.0),
        certificates: data.certificates || ''
      }
    });
  }
}

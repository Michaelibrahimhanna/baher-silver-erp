import { PrismaClient } from '@prisma/client';
import { createHash, randomBytes } from 'crypto';

const prisma = new PrismaClient();

export interface CreateApiTokenInput {
  name: string;
  companyId?: string;
  customerId?: string;
  scopes?: string[];
  rateLimitPerMin?: number;
  expiresInDays?: number;
}

export interface UpdateBrandingInput {
  companyId: string;
  companyNameAr: string;
  companyNameEn: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  customDomain?: string;
  customCss?: string;
  supportEmail?: string;
  supportPhone?: string;
}

export interface RegisterWebhookInput {
  companyId?: string;
  customerId?: string;
  name: string;
  targetUrl: string;
  subscribedEvents: string[];
}

export class ApiIntegrationService {
  /**
   * 1. GENERATE API TOKEN
   */
  static async generateApiToken(input: CreateApiTokenInput) {
    const rawToken = `bs_live_tok_${randomBytes(24).toString('hex')}`;
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');
    const tokenKey = `${rawToken.substring(0, 16)}...${rawToken.substring(rawToken.length - 4)}`;

    const scopes = input.scopes || ['read:dpp', 'read:orders', 'write:service'];
    const companyId = input.companyId || 'default-company';
    const rateLimitPerMin = input.rateLimitPerMin || 100;

    let expiresAt: Date | null = null;
    if (input.expiresInDays) {
      expiresAt = new Date(Date.now() + input.expiresInDays * 24 * 60 * 60 * 1000);
    }

    const tokenRecord = await prisma.customerApiToken.create({
      data: {
        tokenKey,
        tokenHash,
        companyId,
        customerId: input.customerId || null,
        name: input.name,
        scopesJson: JSON.stringify(scopes),
        rateLimitPerMin,
        status: 'ACTIVE',
        expiresAt
      }
    });

    return {
      tokenRecord: {
        id: tokenRecord.id,
        name: tokenRecord.name,
        tokenKey: tokenRecord.tokenKey,
        scopes,
        rateLimitPerMin,
        expiresAt,
        createdAt: tokenRecord.createdAt
      },
      rawTokenSecret: rawToken // Only exposed upon creation!
    };
  }

  /**
   * 2. VERIFY API TOKEN & ENFORCE SCOPES & RATE LIMIT
   */
  static async verifyApiToken(rawToken: string, requiredScope?: string) {
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');
    const tokenRecord = await prisma.customerApiToken.findUnique({
      where: { tokenHash }
    });

    if (!tokenRecord || tokenRecord.status !== 'ACTIVE') {
      throw new Error('Invalid or revoked API token.');
    }

    if (tokenRecord.expiresAt && tokenRecord.expiresAt < new Date()) {
      await prisma.customerApiToken.update({ where: { id: tokenRecord.id }, data: { status: 'EXPIRED' } });
      throw new Error('API token has expired.');
    }

    const scopes: string[] = JSON.parse(tokenRecord.scopesJson || '[]');
    if (requiredScope && !scopes.includes(requiredScope) && !scopes.includes('admin:full')) {
      throw new Error(`Forbidden: Token lacks required scope '${requiredScope}'.`);
    }

    // Update last used timestamp
    await prisma.customerApiToken.update({
      where: { id: tokenRecord.id },
      data: { lastUsedAt: new Date() }
    });

    return {
      tokenId: tokenRecord.id,
      companyId: tokenRecord.companyId,
      customerId: tokenRecord.customerId,
      scopes,
      rateLimitPerMin: tokenRecord.rateLimitPerMin
    };
  }

  /**
   * 3. REVOKE API TOKEN
   */
  static async revokeApiToken(tokenId: string, companyId = 'default-company') {
    const tokenRecord = await prisma.customerApiToken.findUnique({ where: { id: tokenId } });
    if (!tokenRecord) throw new Error(`API token '${tokenId}' not found.`);

    return await prisma.customerApiToken.update({
      where: { id: tokenId },
      data: { status: 'REVOKED' }
    });
  }

  /**
   * 4. LIST API TOKENS
   */
  static async listApiTokens(companyId = 'default-company', customerId?: string) {
    const where: any = { companyId };
    if (customerId) where.customerId = customerId;

    const tokens = await prisma.customerApiToken.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return tokens.map((t) => ({
      id: t.id,
      name: t.name,
      tokenKey: t.tokenKey,
      scopes: JSON.parse(t.scopesJson || '[]'),
      rateLimitPerMin: t.rateLimitPerMin,
      status: t.status,
      expiresAt: t.expiresAt,
      lastUsedAt: t.lastUsedAt,
      createdAt: t.createdAt
    }));
  }

  /**
   * 5. LOG API ACCESS AUDIT LOG
   */
  static async logApiAccess(input: {
    tokenId?: string;
    customerId?: string;
    companyId?: string;
    endpoint: string;
    httpMethod: string;
    statusCode: number;
    responseTimeMs: number;
    ipAddress?: string;
    userAgent?: string;
    errorMessage?: string;
  }) {
    return await prisma.apiAccessAuditLog.create({
      data: {
        tokenId: input.tokenId || null,
        customerId: input.customerId || null,
        companyId: input.companyId || 'default-company',
        endpoint: input.endpoint,
        httpMethod: input.httpMethod,
        statusCode: input.statusCode,
        responseTimeMs: input.responseTimeMs,
        ipAddress: input.ipAddress || '127.0.0.1',
        userAgent: input.userAgent || 'External API Client',
        errorMessage: input.errorMessage || null
      }
    });
  }

  /**
   * 6. MULTI-COMPANY BRANDING
   */
  static async getCompanyBranding(companyId = 'default-company') {
    let branding = await prisma.customerCompanyBranding.findUnique({
      where: { companyId }
    });

    if (!branding) {
      branding = await prisma.customerCompanyBranding.create({
        data: {
          companyId,
          companyNameAr: 'شركة باهر سيلفر الفضية المتخصصة',
          companyNameEn: 'Baher Silver Pure Jewelry Factory',
          logoUrl: 'assets/baher_logo.png',
          faviconUrl: 'assets/baher_logo.png',
          primaryColor: '#C3B097',
          secondaryColor: '#06B6D4',
          supportEmail: 'support@bahersilver.com',
          supportPhone: '+20 100 000 9250'
        }
      });
    }

    return branding;
  }

  static async updateCompanyBranding(input: UpdateBrandingInput) {
    return await prisma.customerCompanyBranding.upsert({
      where: { companyId: input.companyId },
      update: {
        companyNameAr: input.companyNameAr,
        companyNameEn: input.companyNameEn,
        logoUrl: input.logoUrl,
        faviconUrl: input.faviconUrl,
        primaryColor: input.primaryColor || '#C3B097',
        secondaryColor: input.secondaryColor || '#06B6D4',
        customDomain: input.customDomain,
        customCss: input.customCss,
        supportEmail: input.supportEmail,
        supportPhone: input.supportPhone,
        updatedAt: new Date()
      },
      create: {
        companyId: input.companyId,
        companyNameAr: input.companyNameAr,
        companyNameEn: input.companyNameEn,
        logoUrl: input.logoUrl,
        faviconUrl: input.faviconUrl,
        primaryColor: input.primaryColor || '#C3B097',
        secondaryColor: input.secondaryColor || '#06B6D4',
        customDomain: input.customDomain,
        customCss: input.customCss,
        supportEmail: input.supportEmail,
        supportPhone: input.supportPhone
      }
    });
  }

  /**
   * 7. WEBHOOK SUBSCRIPTIONS
   */
  static async registerWebhook(input: RegisterWebhookInput) {
    const secretToken = `whsec_${randomBytes(16).toString('hex')}`;
    return await prisma.customerWebhookSubscription.create({
      data: {
        companyId: input.companyId || 'default-company',
        customerId: input.customerId || null,
        name: input.name,
        targetUrl: input.targetUrl,
        secretToken,
        subscribedEventsJson: JSON.stringify(input.subscribedEvents),
        isActive: true
      }
    });
  }

  static async listWebhooks(companyId = 'default-company', customerId?: string) {
    const where: any = { companyId };
    if (customerId) where.customerId = customerId;

    return await prisma.customerWebhookSubscription.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * 8. DATA RETENTION POLICIES
   */
  static async getRetentionPolicies(companyId = 'default-company') {
    const policies = await prisma.dataRetentionPolicy.findMany({
      where: { companyId }
    });

    if (policies.length === 0) {
      // Seed default policies
      const defaultPolicies = [
        { entityType: 'API_LOGS', retentionDays: 90 },
        { entityType: 'AUDIT_LOGS', retentionDays: 365 },
        { entityType: 'QR_SCANS', retentionDays: 180 }
      ];

      for (const p of defaultPolicies) {
        await prisma.dataRetentionPolicy.create({
          data: { companyId, entityType: p.entityType, retentionDays: p.retentionDays, autoPurgeEnabled: true }
        });
      }

      return await prisma.dataRetentionPolicy.findMany({ where: { companyId } });
    }

    return policies;
  }
}

import { Injectable, NestMiddleware, HttpException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { masterPrisma } from '../prisma/master-prisma.service'; 
import { TenantManager } from '../prisma/tenant-manager.service';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private tenantManager: TenantManager) {}

  async use(req: Request & any, res: Response, next: NextFunction) {
    const headerTenant = req.headers['x-tenant-id'] as string | undefined;
    const host = req.hostname || req.headers.host || '';
    const subdomain = host.split('.')[0];

    const slug = headerTenant ?? subdomain;
    if (!slug) {
      throw new HttpException('Tenant not specified', 400);
    }

    const tenant = await masterPrisma.tenant.findUnique({ where: { slug }});
    if (!tenant) {
      throw new HttpException('Tenant not registered', 404);
    }

    try {
      const prisma = await this.tenantManager.getPrismaForTenant(tenant);
      req.tenant = tenant;
      req.prisma = prisma;
      next();
    } catch (err) {
      console.error('tenant middleware error', err);
      throw new HttpException('Failed to initialize tenant DB', 500);
    }
  }
}

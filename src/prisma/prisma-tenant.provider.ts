import { Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

export const TenantPrismaProvider = {
  provide: 'TENANT_PRISMA',
  scope: Scope.REQUEST,
  inject: [REQUEST],
  useFactory: (req: any) => {
    if (!req || !req.prisma) {
      throw new Error('Tenant Prisma not found on request. Ensure TenantMiddleware runs first.');
    }
    return req.prisma;
  },
};

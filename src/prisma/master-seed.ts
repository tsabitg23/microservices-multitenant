import { PrismaClient } from '@prisma/client';
import { encrypt } from '../utils/crypto';
// import { PrismaClient as TenantPrismaClient } from '../../node_modules/.prisma/tenant-client';

export const masterPrisma = new PrismaClient();
// export const tenantPrisma = new TenantPrismaClient();

async function execute() {
  const plainUrl = process.env.TENANT_DATABASE_URL!;
  const encryptedUrl = encrypt(plainUrl);

  await masterPrisma.tenant.create({
    data: {
      name: 'Store 1',
      slug: 'store1',
      dbUrl: encryptedUrl,
    },
  });

  console.log('✅ Tenant registered with encrypted dbUrl:', encryptedUrl);
}
execute();

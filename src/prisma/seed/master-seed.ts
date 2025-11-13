import { encrypt } from '../../utils/crypto';
import { masterPrisma } from '../master-prisma.service';

async function execute() {
  const tenantSeed = [
    {
      slug: 'store1',
      name: 'Store 1',
      dbUrl: encrypt(process.env.TENANT_DATABASE_URL!),
    },
    {
      slug: 'store2',
      name: 'Store 2',
      dbUrl: encrypt(process.env.TENANT2_DATABASE_URL!),
    },
  ];
  const isValidDbUrl = (url?: string): boolean => {
    return !!url
  };

  // Filter valid tenants only
  const validTenants = tenantSeed.filter((t) => isValidDbUrl(t.dbUrl));

  for (const tenant of validTenants) {
    await masterPrisma.tenant.upsert({
      where: { slug: tenant.slug },
      update: {
        dbUrl: tenant.dbUrl, // optionally encrypted if needed
        name: tenant.name,
      },
      create: {
        slug: tenant.slug,
        name: tenant.name,
        dbUrl: tenant.dbUrl,
      },
    });
    console.log('✅ Tenant registered with encrypted dbUrl', tenant.dbUrl);
  }
}
execute()
  .catch(console.error)
  .finally(() => masterPrisma.$disconnect());

import { PrismaClient } from '.prisma/master-client';
import { encrypt } from '../utils/crypto';

export const masterPrisma = new PrismaClient();

async function execute() {
  const plainUrl = process.env.TENANT_DATABASE_URL!;
  const encryptedUrl = encrypt(plainUrl);

  const isExists = await masterPrisma.tenant.findUnique({
    where: {
      slug: 'store1',
    },
  });

  if (!isExists) {
    await masterPrisma.tenant.create({
      data: {
        name: 'Store 1',
        slug: 'store1',
        dbUrl: encryptedUrl,
      },
    });
  }

  console.log('✅ Tenant registered with encrypted dbUrl:', encryptedUrl);
}
execute()
  .catch(console.error)
  .finally(() => masterPrisma.$disconnect());

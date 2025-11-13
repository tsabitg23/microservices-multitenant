import { PrismaClient } from '.prisma/tenant-client';

export type UserSeed = {
  email: string;
  roleId: string
  name: string;
  password: string; 
};

export const isValidDbUrl = (u?: string) => !!u;


export async function executeTenant(
  dbUrl: string,
  adminUsers: UserSeed[] = [],
  normalUsers: UserSeed[] = [],
) {
  if (!isValidDbUrl(dbUrl)) {
    console.warn('invalid DB URL:', dbUrl);
    return;
  }

  const prisma = new PrismaClient({ datasources: { db: { url: dbUrl } } });

  try {
    console.log('Seeding tenant:', dbUrl);

    for (const a of adminUsers) {
      await prisma.user.upsert({
        where: { email: a.email },
        update: {
          ...a,
        },
        create: a,
      });
    }

    for (const u of normalUsers) {
      await prisma.user.upsert({
        where: { email: u.email },
        update: { ...u },
        create: u,
      });
    }

    console.log('Seed finished for tenant:', dbUrl);
  } catch (err) {
    console.error('Error seeding tenant', dbUrl, err);
    throw err;
  } finally {
    await prisma.$disconnect();
  }
}

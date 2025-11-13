import { PrismaClient } from '.prisma/tenant-client';
import { ROLES_DATA } from '../../constants/roles';

export type UserSeed = {
  email: string;
  roleId: string;
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

  await Promise.all(
    ROLES_DATA.map(async (role) => {
      await prisma.role.upsert({
        where: {
          id: role.id,
        },
        update: {
          name: role.name,
        },
        create: {
          id: role.id,
          name: role.name,
        },
      });
    }),
  );

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

import 'dotenv/config'
import bcrypt from 'bcryptjs';
import { PrismaClient as TenantPrismaClient } from '.prisma/tenant-client';
import { Role, ROLES_DATA } from '../constants/roles';

const prisma = new TenantPrismaClient({
    datasources: { db: { url: process.env.TENANT_DATABASE_URL! } },
});

async function main() {
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

  const password = await bcrypt.hash('admin-password', 10);
  await prisma.user.upsert({
    where: {
        email: 'admin@store1.com'
    },
    update: {
        password,
        roleId: Role.admin
    },
    create: {
      email: 'admin@store1.com',
      password,
      roleId: Role.admin,
    },
  });

  console.log('success')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient as TenantPrismaClient } from '.prisma/tenant-client';
import { Role } from '../../constants/roles';
import { executeTenant, isValidDbUrl, UserSeed } from './tenant-seed-util';

const prisma = new TenantPrismaClient({
  datasources: { db: { url: process.env.TENANT_DATABASE_URL! } },
});

async function main() {
  const adminUserTenant1: UserSeed[] = [
    {
      email: 'admin@store1.com',
      password: await bcrypt.hash('admin-password', 10),
      roleId: Role.admin,
    },
  ];

  const userTenant1: UserSeed[] = [
    {
      email: 'user@store1.local',
      password: await bcrypt.hash('user-password', 10),
      roleId: Role.user,
    },
  ];

  const adminUserTenant2: UserSeed[] = [
    {
      email: 'admin@store2.com',
      password: await bcrypt.hash('admin-password', 10),
      roleId: Role.admin,
    },
  ];
  const userTenant2: UserSeed[] = [
    {
      email: 'user@store2.local',
      password: await bcrypt.hash('user-password', 10),
      roleId: Role.user,
    },
  ];

  console.log('success');

  const db1 = process.env.TENANT_DATABASE_URL;
  const db2 = process.env.TENANT2_DATABASE_URL;

  const promises: Promise<any>[] = [];

  if (isValidDbUrl(db1)) {
    promises.push(executeTenant(db1!, adminUserTenant1, userTenant1));
  } else {
    console.warn(
      'TENANT_DATABASE_URL is invalid or not set, skipping tenant 1',
    );
  }

  if (isValidDbUrl(db2)) {
    promises.push(executeTenant(db2!, adminUserTenant2, userTenant2));
  } else {
    console.warn(
      'TENANT2_DATABASE_URL is invalid or not set, skipping tenant 2',
    );
  }

  await Promise.all(promises);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

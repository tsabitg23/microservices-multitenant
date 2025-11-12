import { PrismaClient } from '.prisma/master-client'; // uses master client generated earlier

export const masterPrisma = new PrismaClient();
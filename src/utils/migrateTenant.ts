import { execSync } from 'child_process';

function run(cmd: string, envVars: Record<string, string> = {}) {
  execSync(cmd, { stdio: 'inherit', env: { ...process.env, ...envVars } });
}

export function migrateTenant(tenantDbUrl: string) {
  run(`npx prisma migrate deploy --schema=prisma/schema.prisma`, {
    DATABASE_URL: tenantDbUrl,
    PRISMA_SCHEMA_PATH: 'prisma/schema.prisma',
    PRISMA_MIGRATIONS_PATH: 'prisma/migrations/tenant',
  });
}

export function migrateMaster() {
  run(`npx prisma migrate deploy --schema=prisma/master.prisma`);
}

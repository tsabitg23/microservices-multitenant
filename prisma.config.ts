import "dotenv/config";
import { defineConfig, env } from "prisma/config";


const schemaPath = process.env.PRISMA_SCHEMA_PATH ?? "prisma/master.prisma";
const migrationsPath = process.env.PRISMA_MIGRATIONS_PATH ?? "prisma/migrations/master";

export default defineConfig({
  schema: schemaPath,
  migrations: {
    path: migrationsPath,
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});

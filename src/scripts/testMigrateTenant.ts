import "dotenv/config"; 
import { env } from "prisma/config";
import { migrateTenant } from "../utils/migrateTenant";

migrateTenant(env("TENANT_DATABASE_URL"))
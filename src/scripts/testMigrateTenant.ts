import 'dotenv/config';
import { env } from 'prisma/config';
import { migrateTenant } from '../utils/migrateTenant';

migrateTenant(env('TENANT_DATABASE_URL'));
if (env('TENANT2_DATABASE_URL')) {
  migrateTenant(env('TENANT2_DATABASE_URL'));
}

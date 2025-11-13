import { Module } from '@nestjs/common';
import { TenantPrismaProvider } from '../prisma/prisma-tenant.provider';
import { ProductsController } from './product.controller';
import { ProductsService } from './product.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ProductsController],
  providers: [ProductsService, TenantPrismaProvider],
})
export class ProductsModule {}

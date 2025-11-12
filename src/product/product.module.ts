import { Module } from '@nestjs/common';
import { TenantPrismaProvider } from '../prisma/prisma-tenant.provider';
import { ProductsController } from './product.controller';
import { ProductsService } from './product.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, TenantPrismaProvider],
})
export class ProductsModule {}

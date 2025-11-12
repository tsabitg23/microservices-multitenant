import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TenantMiddleware } from './common/tenant.middleware';
import { TenantManager } from './prisma/tenant-manager.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './product/product.module'

@Module({
  imports: [ProductsModule],
  controllers: [AppController],
  providers: [AppService, TenantManager],
})
export class AppModule {
   configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}

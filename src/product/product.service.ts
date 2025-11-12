import { Inject, Injectable } from '@nestjs/common';
import type { PrismaClient } from '.prisma/tenant-client';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('TENANT_PRISMA') private readonly prisma: PrismaClient,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private productsCacheKey(tenantSlug: string, page: number, perPage: number) {
    return `products:${tenantSlug}:page:${page}:per:${perPage}`;
  }

  private async invalidateProductCache(tenantSlug: string) {
    try {
      const client = (this.cacheManager as any).store.getClient();
      const pattern = `products:${tenantSlug}:*`;
      const keys = await client.keys(pattern);
      if (keys.length > 0) {
        await client.del(keys);
      }
    } catch (err) {
      console.warn('Error validate redis', err);
    }
  }

  async findAll(
    tenantSlug: string,
    p: { page?: number; perPage?: number } = {},
  ) {
    const page = p.page ?? 1;
    const perPage = p.perPage ?? 10;
    const cacheKey = this.productsCacheKey(tenantSlug, page, perPage);
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const products = await this.prisma.product.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: { createdAt: 'desc' },
    });

    await this.cacheManager.set(cacheKey, products, 30);
    return products;
  }

  findOne(id: string) {
    return this.prisma.product.findUnique({ where: { id } });
  }

  async create(
    tenantSlug: string,
    data: { name: string; price: number; stock?: number },
  ) {
    const product = await this.prisma.product.create({
      data: { ...data, stock: data.stock ?? 0 },
    });
    await this.invalidateProductCache(tenantSlug);
    return product;
  }

  async update(
    id: string,
    data: { name: string; price: number; stock?: number },
  ) {
    return this.prisma.product.update({
      where: {
        id: id,
      },
      data,
    });
  }

  async delete(id: string) {
    // return this.prisma.product
  }
}

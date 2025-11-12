// src/products/products.service.ts
import { Inject, Injectable } from '@nestjs/common';
import type { PrismaClient } from '.prisma/tenant-client'

@Injectable()
export class ProductsService {
  constructor(
    @Inject('TENANT_PRISMA') private readonly prisma: PrismaClient,
  ) {}

  findAll(p: { page?: number; perPage?: number } = {}) {
    const page = p.page ?? 1;
    const perPage = p.perPage ?? 10;
    return this.prisma.product.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.product.findUnique({ where: { id } });
  }

  async create(data: { name: string; price: number; stock?: number }) {
    return this.prisma.product.create({ data: { ...data, stock: data.stock ?? 0 } });
  }
}

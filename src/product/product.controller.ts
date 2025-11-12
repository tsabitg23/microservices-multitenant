// src/products/products.controller.ts
import { Controller, Get, Post, Body, Param, Req, Query } from '@nestjs/common';
import { ProductsService } from './product.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly svc: ProductsService) {}

  @Get()
  async list(@Query('page') page: number, @Query('perPage') perPage: number) {
    return this.svc.findAll({ page: Number(page) || 1, perPage: Number(perPage) || 10 });
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.svc.findOne(id);
  }

  @Post()
  async create(@Body() body: any) {
    return this.svc.create(body);
  }
}

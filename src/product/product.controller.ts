import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  Query,
  UseGuards,
  Put,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './product.service';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateProductDTO } from './dto/update-product.dto';

@ApiBearerAuth('access-token')
@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly svc: ProductsService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  async list(@Req() req: Request & any, @Query('page') page = 1, @Query('perPage') perPage = 10) {
    const tenantSlug = req.tenant.slug;
    return this.svc.findAll(tenantSlug, {
      page: Number(page) || 1,
      perPage: Number(perPage) || 10,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  async get(@Param('id') id: string) {
    return this.svc.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async create(@Req() req: Request & any, @Body() dto: CreateProductDto) {
    const tenantSlug = req.tenant.slug;
    return this.svc.create(tenantSlug, dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async update(@Req() req: Request & any, @Body() dto: UpdateProductDTO, @Param('id') id: string) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async deleteData(@Param('id') id: string) {
    return this.svc.delete(id);
  }
}

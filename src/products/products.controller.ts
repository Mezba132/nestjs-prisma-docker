import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/auth/decorators/user.decorator';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('product')
@ApiTags('Products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'file', maxCount: 5 }], {
      storage: diskStorage({
        destination: './uploads/files/',
        filename: (req, file, callback) => {
          const name = file.originalname.split('.')[0];
          const fileExtName = extname(file.originalname);
          const dateTime = Date.now();
          callback(null, `${dateTime}-${name}${fileExtName}`);
        },
      }),
    }),
  )
  @Post('create')
  @UseGuards(RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  async createProduct(
    @UploadedFiles() files: { files?: Express.Multer.File[] },
    @Body() body: CreateProductDto,
    @User() user: any,
  ) {
    return await this.productsService.createProduct(body, files, user);
  }

  @Public()
  @Get('all')
  async getAllProduct(
    @Query('category') category: string,
    @Query('search') search: string,
    @Query('skip') skip: number,
  ) {
    return await this.productsService.getAllProduct(category, skip, search);
  }

  @Patch('update/:id')
  async updateProduct(@Param('id') id: number, @Body() body: UpdateProductDto) {
    return await this.productsService.updateProduct(id, body);
  }

  @Delete('delete/:id')
  async deleteProduct(@Param('id') id: number) {
    return await this.productsService.deleteProduct(id);
  }
}

import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  createProduct = async (body: CreateProductDto, files: any, user: any) => {
    try {
      let price = isNaN(parseInt(body.price)) ? 0 : parseInt(body.price);
      const product = await this.prisma.product
        .create({
          data: {
            name: body.name,
            description: body.description,
            price,
            productCode: body.productCode,
            category: body.category,
            createdBy: user.id,
          },
      });

      if (product) {
          let imageInfos = [];
          for (let file of files.file) {
            imageInfos.push({
              prodId: product.id,
              path: file.path,
            });
          }

        await this.prisma.image.createMany({
          data: imageInfos,
          skipDuplicates: false,
        });
      }

      return {
        success: true,
        message: 'Product Saved Successfully',
        data: product,
      };
    } catch (error) {
      return {
        success: false,
        message: error,
      };
    }
  };

  getAllProduct = async (category: string, skip: number, search: string) => {
    try {
      if (isNaN(skip)) skip = undefined;
      let products = await this.prisma.product.findMany({
        where: { category, name: { search } },
        skip,
        take: 3,
        orderBy: {
          id: 'asc',
        },
      });
      return {
        success: true,
        message: 'All Products fetch successfully.',
        data: products,
      };
    } catch (error) {
      return {
        success: false,
        message: error,
      };
    }
  };

  updateProduct = async (id: number, body: UpdateProductDto) => {
    try {
      let updateProduct = await this.prisma.product.update({
        where: { id },
        data: body,
      });
      return {
        success: true,
        message: 'Update data successfully.',
        data: updateProduct,
      };
    } catch (error) {
      return {
        success: false,
        message: error,
      };
    }
  };

  deleteProduct = async (id: number) => {
    try {
      let deleteProduct = await this.prisma.product.delete({ where: { id } });
      return {
        sussces: true,
        message: 'deleted data successfully.',
        data: deleteProduct,
      };
    } catch (error) {
      return {
        success: false,
        message: error,
      };
    }
  };
}

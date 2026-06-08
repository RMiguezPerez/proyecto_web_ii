import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { UsersService } from '../../users/services/users.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { ProductResponseDto } from '../dto/product-response.dto';
import type { IProductsRepository } from '../repositories/products.repository';
import { Product } from '../schemas/product.schema';
import { PublicProductOwnerDto, PublicProductResponseDto } from '../dto/public-product-responde.dto';
import { Types } from 'mongoose';


@Injectable()
export class ProductsService {
  constructor(
    @Inject('IProductsRepository')
    private readonly productsRepository: IProductsRepository,
    private readonly usersService: UsersService,
  ) {}

  async create(
    ownerId: string,
    createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {

    try {
      const product = await this.productsRepository.create({
        ...createProductDto,
        ownerId: new Types.ObjectId(ownerId),
        imagesBase64: createProductDto.imagesBase64 ?? [],
        isActive: true,
      });

      return this.toProductResponse(product);
    } catch {
      throw new InternalServerErrorException('Could not create product');
    }
  }

  async findPublic(): Promise<ProductResponseDto[]> {
    const products = await this.productsRepository.findPublic();
    return products.map((product) => this.toProductResponse(product));
  }

  async findPublicById(id: string): Promise<PublicProductResponseDto> {
    const product = await this.productsRepository.findPublicById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const owner = await this.usersService.findById(product.ownerId.toString());

    return {
      ...this.toProductResponse(product),
      owner: {
        id: product.ownerId.toString(),
        name: owner.name,
        surname: owner.surname,
      } as PublicProductOwnerDto,
    };
  }

  private toProductResponse(product: Product): ProductResponseDto {
    return plainToClass(ProductResponseDto, {
      id: product._id.toString(),
      ownerId: product.ownerId.toString(),
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      paymentOptions: product.paymentOptions,
      imagesBase64: product.imagesBase64,
      isActive: product.isActive
    });
  }
}
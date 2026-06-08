import { Inject, Injectable } from '@nestjs/common';
import { Product } from '../schemas/product.schema';
import type { IProductsDao } from '../dao/products.mongoose.dao';

export interface IProductsRepository {
  create(productData: Partial<Product>): Promise<Product>;
  findPublic(): Promise<Product[]>;
  findPublicById(id: string): Promise<Product | null>;
  findById(id: string): Promise<Product | null>;
}

@Injectable()
export class ProductsRepository implements IProductsRepository {
  constructor(
    @Inject('IProductsDao')
    private readonly dao: IProductsDao,
  ) {}

  async create(productData: Partial<Product>): Promise<Product> {
    return this.dao.create(productData);
  }

  async findPublic(): Promise<Product[]> {
    return this.dao.findPublic();
  }

  async findPublicById(id: string): Promise<Product | null> {
    return this.dao.findPublicById(id);
  }

  async findById(id: string): Promise<Product | null> {
    return this.dao.findById(id);
  }
}
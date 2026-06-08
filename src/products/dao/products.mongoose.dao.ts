import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../schemas/product.schema';

export interface IProductsDao {
  create(productData: Partial<Product>): Promise<Product>;
  findPublic(): Promise<Product[]>;
  findPublicById(id: string): Promise<Product | null>;
  findById(id: string): Promise<Product | null>;
}

@Injectable()
export class ProductsMongooseDao implements IProductsDao {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
  ) {}

  async create(productData: Partial<Product>): Promise<Product> {
    const createdProduct = new this.productModel(productData);
    return createdProduct.save();
  }

  async findPublic(): Promise<Product[]> {
    return this.productModel.find({ isActive: true }).sort({ createdAt: -1 }).exec();
  }

  async findPublicById(id: string): Promise<Product | null> {
    return this.productModel.findOne({ _id: id, isActive: true }).exec();
  }

  async findById(id: string): Promise<Product | null> {
    return this.productModel.findById(id).exec();
  }
}
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart } from '../schemas/cart.schema';

export interface ICartDao {
  create(cartData: Partial<Cart>): Promise<Cart>;
  createOrUpdate(cartData: Partial<Cart>): Promise<Cart>;
  findByUserAndProduct(userId: string, productId: string): Promise<Cart | null>;
  findByUserId(userId: string): Promise<Cart[]>;
  deleteByUserAndProduct(userId: string, productId: string): Promise<boolean>;
  upsertQuantity(userId: string, productId: string, quantity: number): Promise<Cart>; // <--- Asegurado acá
}

@Injectable()
export class CartMongooseDao implements ICartDao {
  constructor(
    @InjectModel(Cart.name)
    private readonly cartModel: Model<Cart>,
  ) {}

  async create(cartData: Partial<Cart>): Promise<Cart> {
    const cart = new this.cartModel(cartData);
    return cart.save();
  }

  async createOrUpdate(cartData: Partial<Cart>): Promise<Cart> {
    const userId = cartData.userId?.toString() || '';
    const productId = cartData.productId?.toString() || '';
    const quantity = cartData.quantity || 1;

    return this.upsertQuantity(userId, productId, quantity);
  }

  async findByUserAndProduct(
    userId: string,
    productId: string,
  ): Promise<Cart | null> {
    return this.cartModel.findOne({ 
      userId: new Types.ObjectId(userId),    
      productId: new Types.ObjectId(productId)
    }).exec();
  }

  async findByUserId(userId: string): Promise<Cart[]> {
    return this.cartModel.find({ 
      userId: new Types.ObjectId(userId)
    }).sort({ createdAt: -1 }).exec();
  }

  async deleteByUserAndProduct(
    userId: string,
    productId: string,
  ): Promise<boolean> {
    const result = await this.cartModel.findOneAndDelete({
      userId: new Types.ObjectId(userId),
      productId: new Types.ObjectId(productId),
    }).exec();

    return result !== null;
  }

  async upsertQuantity(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<Cart> {
    return this.cartModel
      .findOneAndUpdate(
        {
          userId: new Types.ObjectId(userId),
          productId: new Types.ObjectId(productId),
        },
        { $inc: { quantity: quantity } },
        { new: true, upsert: true },      
      )
      .exec();
  }
}
import { Inject, Injectable } from '@nestjs/common';
import type { ICartDao } from '../dao/cart.mongoose.dao';
import { Cart } from '../schemas/cart.schema';

export interface ICartRepository {
  createOrUpdate(cartData: Partial<Cart>): Promise<Cart>;
  findByUserAndProduct(userId: string, productId: string): Promise<Cart | null>;
  findByUserId(userId: string): Promise<Cart[]>;
  deleteByUserAndProduct(userId: string, productId: string): Promise<boolean>;
}

@Injectable()
export class CartRepository implements ICartRepository {
  constructor(
    @Inject('ICartDao')
    private readonly dao: ICartDao,
  ) {}

  async createOrUpdate(cartData: Partial<Cart>): Promise<Cart> {
    return this.dao.createOrUpdate(cartData);
  }

  async findByUserAndProduct(
    userId: string,
    productId: string,
  ): Promise<Cart | null> {
    return this.dao.findByUserAndProduct(userId, productId);
  }

  async findByUserId(userId: string): Promise<Cart[]> {
    return this.dao.findByUserId(userId);
  }

  async deleteByUserAndProduct(
    userId: string,
    productId: string,
  ): Promise<boolean> {
    return this.dao.deleteByUserAndProduct(userId, productId);
  }
}
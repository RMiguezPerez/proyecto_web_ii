import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { ICartRepository } from '../repositories/cart.repository';
import { CartResponseDto } from '../dto/cart-response.dto';
import { Cart } from '../schemas/cart.schema';
import { ProductsService } from './products.service';
import { Types } from 'mongoose';

@Injectable()
export class CartService {
  constructor(
    @Inject('ICartRepository')
    private readonly cartRepository: ICartRepository,
    private readonly productsService: ProductsService,
  ) {}

  async create(
    userId: string, 
    productId: string, 
    quantity: number,
  ): Promise<CartResponseDto> {

    const product = await this.productsService.findActiveEntityOrThrow(productId);
    const cartItem = await this.cartRepository.createOrUpdate({
      userId: new Types.ObjectId(userId),
      productId: new Types.ObjectId(productId),
      quantity,
    });

    return this.toCartResponse(cartItem, product);
  }

  async remove(userId: string, productId: string) {
    const deleted = await this.cartRepository.deleteByUserAndProduct(
      userId,
      productId,
    );

    return {
      deleted,
    };
  }

  async findMine(userId: string): Promise<CartResponseDto[]> {
    const cartItems = await this.cartRepository.findByUserId(userId);

    const responses = await Promise.all(
      cartItems.map(async (cartItem) => {
        try {
          const product = await this.productsService.findActiveEntityOrThrow(
            cartItem.productId.toString(),
          );

          return this.toCartResponse(cartItem, product);
        } catch (error) {
          if (error instanceof NotFoundException) {
            return null;
          }

          throw error;
        }
      }),
    );

    return responses.filter(
      (cartItem): cartItem is CartResponseDto => cartItem !== null,
    );
  }

private toCartResponse(
    cartItem: Cart,
    product: any,
  ): CartResponseDto {
    return {
      cartId: cartItem._id.toString(),
      productId: cartItem.productId.toString(),
      quantity: cartItem.quantity,
      savedAt: (cartItem as any).createdAt,
      product: {
        id: product._id.toString(),
        name: product.name,
        price: product.price,
        quantity: product.quantity ?? product.stock ?? 0,
        category: product.category,
        isActive: product.isActive,
      },
    };
  }
}
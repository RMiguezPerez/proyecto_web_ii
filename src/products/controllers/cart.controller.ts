import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../users/guards/jwt-auth.guard';
import { CartService } from '../services/cart.service';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post(':productId')
  async create(
    @Param('productId') productId: string,
    @Body('quantity') quantity: number = 1,
    @Request() req: { user: { userId: string } },
  ) {
    return this.cartService.create(req.user.userId, productId, quantity);
  }

  @Delete(':productId')
  async remove(
    @Param('productId') productId: string,
    @Request() req: { user: { userId: string } },
  ) {
    return this.cartService.remove(req.user.userId, productId);
  }

  @Get('me')
  async findMine(@Request() req: { user: { userId: string } }) {
    return this.cartService.findMine(req.user.userId);
  }
}
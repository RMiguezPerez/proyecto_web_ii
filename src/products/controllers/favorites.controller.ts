import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../users/guards/jwt-auth.guard';
import { FavoritesService } from '../services/favorites.service';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(':productId')
  async create(
    @Param('productId') productId: string,
    @Request() req: { user: { userId: string } },
  ) {
    return this.favoritesService.create(req.user.userId, productId);
  }

  @Delete(':productId')
  async remove(
    @Param('productId') productId: string,
    @Request() req: { user: { userId: string } },
  ) {
    return this.favoritesService.remove(req.user.userId, productId);
  }

  @Get('me')
  async findMine(@Request() req: { user: { userId: string } }) {
    return this.favoritesService.findMine(req.user.userId);
  }
}
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../users/guards/jwt-auth.guard';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { ProductCommentsService } from '../services/product-comments.service';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductCommentsController {
  constructor(
    private readonly productCommentsService: ProductCommentsService,
  ) {}

  @Post(':id/comments')
  async create(
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req: { user: { userId: string } },
  ) {
    return this.productCommentsService.create(
      id,
      req.user.userId,
      createCommentDto,
    );
  }

  @Get(':id/comments')
  async findByProductId(@Param('id') id: string) {
    return this.productCommentsService.findByProductId(id);
  }
}
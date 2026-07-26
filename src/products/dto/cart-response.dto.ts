import { ProductCategory } from '../constants/product-category.enum';

export class CartResponseDto {
  cartId: string;
  productId: string;
  quantity: number;
  savedAt: Date;
  product: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    category: ProductCategory;
    isActive: boolean;
  };
}
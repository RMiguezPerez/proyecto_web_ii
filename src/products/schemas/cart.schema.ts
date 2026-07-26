import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Product } from './product.schema';

@Schema({ timestamps: true })
export class Cart extends Document {
    @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
    userId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: Product.name, required: true, index: true })
    productId: Types.ObjectId;

    @Prop({ type: Number, required: true, default: 1, min: 1 })
    quantity: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);

CartSchema.index({ userId: 1, productId: 1 }, { unique: true });
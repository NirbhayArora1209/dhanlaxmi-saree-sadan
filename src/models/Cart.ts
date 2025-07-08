import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ICart extends Document {
  user_id: string;
  items: ICartItem[];
  total_amount: number;
  created_at: Date;
  updated_at: Date;
}

const CartItemSchema = new Schema<ICartItem>({
  product_id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  image: {
    type: String,
    required: true,
  },
});

const CartSchema = new Schema<ICart>({
  user_id: {
    type: String,
    required: true,
  },
  items: [CartItemSchema],
  total_amount: {
    type: Number,
    default: 0,
    min: 0,
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

// Calculate total amount before saving
CartSchema.pre('save', function(next) {
  this.total_amount = this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  next();
});

// Indexes
CartSchema.index({ user_id: 1 });

export default mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema); 
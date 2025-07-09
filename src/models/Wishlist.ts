import mongoose, { Schema, Document } from 'mongoose';

export interface IWishlistItem {
  product_id: mongoose.Types.ObjectId;
  name: string;
  price: number;
  image: string;
  added_at: Date;
}

export interface IWishlist extends Document {
  user_id: mongoose.Types.ObjectId;
  items: IWishlistItem[];
  created_at: Date;
  updated_at: Date;
}

const WishlistItemSchema = new Schema<IWishlistItem>({
  product_id: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
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
  image: {
    type: String,
    required: true,
  },
  added_at: {
    type: Date,
    default: Date.now,
  },
});

const WishlistSchema = new Schema<IWishlist>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [WishlistItemSchema],
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

// Indexes
WishlistSchema.index({ user_id: 1 });

const WishlistModel: mongoose.Model<IWishlist> = mongoose.models.Wishlist || mongoose.model<IWishlist>('Wishlist', WishlistSchema);

export default WishlistModel; 
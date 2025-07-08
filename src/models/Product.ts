import mongoose, { Schema, Model } from 'mongoose';

export interface IProduct {
  name: string;
  description: string;
  category: string;
  images: {
    url: string;
    view_type: 'front' | 'back' | 'side' | 'drape' | 'flat' | 'mannequin' | 'close-up' | 'detail';
    alt_text?: string;
  }[];
  pricing: {
    base_price: number;
    selling_price: number;
    discount_percentage: number;
  };
  specifications: {
    fabric: string;
    occasion: string;
    length: number;
    blouse_included: boolean;
    care_instructions: string;
  };
  ratings: {
    average_rating: number;
    total_reviews: number;
  };
  inventory: {
    available_stock: number;
    sku: string;
  };
  is_featured: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

const ProductSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    index: true,
  },
  images: [{
    url: {
      type: String,
      required: true,
    },
    view_type: {
      type: String,
      enum: ['front', 'back', 'side', 'drape', 'flat', 'mannequin', 'close-up', 'detail'],
      default: 'front',
    },
    alt_text: {
      type: String,
      default: '',
    },
  }],
  pricing: {
    base_price: {
      type: Number,
      required: true,
      min: 0,
    },
    selling_price: {
      type: Number,
      required: true,
      min: 0,
    },
    discount_percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  specifications: {
    fabric: {
      type: String,
      required: true,
    },
    occasion: {
      type: String,
      required: true,
    },
    length: {
      type: Number,
      required: true,
      min: 0,
    },
    blouse_included: {
      type: Boolean,
      default: false,
    },
    care_instructions: {
      type: String,
      required: true,
    },
  },
  ratings: {
    average_rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    total_reviews: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  inventory: {
    available_stock: {
      type: Number,
      required: true,
      min: 0,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
    },
  },
  is_featured: {
    type: Boolean,
    default: false,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

// Indexes for better query performance
ProductSchema.index({ category: 1, is_active: 1 });
ProductSchema.index({ is_featured: 1, is_active: 1 });
ProductSchema.index({ 'pricing.selling_price': 1 });
ProductSchema.index({ 'ratings.average_rating': -1 });
ProductSchema.index({ name: 'text', description: 'text' });

export const ProductModel: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
export default ProductModel; 
import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  category: string;
  images: string[];
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

const ProductSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  category: {
    type: String,
    required: true,
    enum: ['silk-sarees', 'cotton-sarees', 'designer-sarees', 'wedding-sarees', 'party-wear']
  },
  images: [{
    type: String,
    required: true
  }],
  pricing: {
    base_price: {
      type: Number,
      required: true,
      min: 0
    },
    selling_price: {
      type: Number,
      required: true,
      min: 0
    },
    discount_percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  specifications: {
    fabric: {
      type: String,
      required: true
    },
    occasion: {
      type: String,
      required: true
    },
    length: {
      type: Number,
      required: true,
      min: 5,
      max: 10
    },
    blouse_included: {
      type: Boolean,
      default: false
    },
    care_instructions: {
      type: String,
      default: 'Dry clean only'
    }
  },
  ratings: {
    average_rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    total_reviews: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  inventory: {
    available_stock: {
      type: Number,
      required: true,
      min: 0
    },
    sku: {
      type: String,
      required: true,
      unique: true
    }
  },
  is_featured: {
    type: Boolean,
    default: false
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Indexes for better query performance
ProductSchema.index({ category: 1, is_active: 1 });
ProductSchema.index({ is_featured: 1, is_active: 1 });
ProductSchema.index({ name: 'text', description: 'text' });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema); 
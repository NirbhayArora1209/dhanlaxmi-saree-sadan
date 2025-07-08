import mongoose, { Schema, Model } from 'mongoose';

export interface ICategory {
  name: string;
  slug: string;
  description: string;
  image: string;
  product_count: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

const CategorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  product_count: {
    type: Number,
    default: 0,
    min: 0,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

// Indexes
CategorySchema.index({ is_active: 1 });

export const CategoryModel: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
export default CategoryModel; 
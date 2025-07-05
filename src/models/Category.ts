import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description: string;
  image: string;
  product_count: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

const CategorySchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  image: {
    type: String,
    required: true
  },
  product_count: {
    type: Number,
    default: 0,
    min: 0
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Indexes
CategorySchema.index({ slug: 1 });
CategorySchema.index({ is_active: 1 });

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema); 
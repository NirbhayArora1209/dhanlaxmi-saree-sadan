import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  product_id: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface IOrder extends Document {
  user_id: mongoose.Types.ObjectId;
  order_number: string;
  items: IOrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  payment_status: 'pending' | 'paid' | 'failed';
  payment_method: 'cod' | 'online';
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

const OrderItemSchema: Schema = new Schema({
  product_id: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  image: {
    type: String,
    required: true
  }
});

const ShippingAddressSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  pincode: {
    type: String,
    required: true,
    trim: true,
    match: [/^[0-9]{6}$/, 'Please enter a valid 6-digit pincode']
  }
});

const OrderSchema: Schema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  order_number: {
    type: String,
    required: true,
    unique: true
  },
  items: [OrderItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  tax: {
    type: Number,
    required: true,
    min: 0
  },
  shipping: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shipping_address: ShippingAddressSchema,
  payment_status: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  payment_method: {
    type: String,
    enum: ['cod', 'online'],
    required: true
  },
  notes: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Generate order number
OrderSchema.pre('save', function(next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.order_number = `DSS${year}${month}${day}${random}`;
  }
  next();
});

// Indexes
OrderSchema.index({ user_id: 1, created_at: -1 });
OrderSchema.index({ order_number: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ payment_status: 1 });

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema); 
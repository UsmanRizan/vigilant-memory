import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  items: [
    {
      size: String,
      quantity: Number,
    },
  ],
  totalValue: { type: Number, required: true },
  size: { type: String },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'failed'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now },
});

export const OrderModel = (
  mongoose.models.Order_v2 || mongoose.model('Order_v2', orderSchema)
) as mongoose.Model<Record<string, unknown>>;

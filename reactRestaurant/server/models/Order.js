import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema(
  {
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
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
  },
  { _id: false },
)

const orderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      default: 'Guest',
      trim: true,
    },
    customerEmail: {
      type: String,
      default: '',
      trim: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator(items) {
          return items.length > 0
        },
        message: 'Order must contain at least one item.',
      },
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'preparing', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true },
)

export default mongoose.model('Order', orderSchema)

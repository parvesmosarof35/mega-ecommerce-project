import { Schema, model } from 'mongoose';

const OrderSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: [true, 'Customer ID is required'],
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'products',
          required: [true, 'Product ID is required'],
        },
        quantity: {
          type: Number,
          required: [true, 'Quantity is required'],
          min: [1, 'Quantity must be at least 1'],
        },
        price: {
          type: Number,
          required: [true, 'Price is required'],
          min: [0, 'Price must be positive'],
        },
        name: {
          type: String,
          required: false,
        },
        image: {
          type: String,
          required: false,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount must be positive'],
    },
    shippingAddress: {
      street: { type: String, required: [true, 'Street is required'] },
      city: { type: String, required: [true, 'City is required'] },
      state: { type: String, required: [true, 'State is required'] },
      postalCode: { type: String, required: [true, 'Postal code is required'] },
      country: { type: String, required: [true, 'Country is required'] },
      phone: { type: String, required: [true, 'Phone is required'] },
      email: { type: String, required: [true, 'Email is required'] },
    },
    billingAddress: {
      street: { type: String, required: false },
      city: { type: String, required: false },
      state: { type: String, required: false },
      postalCode: { type: String, required: false },
      country: { type: String, required: false },
      phone: { type: String, required: false },
      email: { type: String, required: false },
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      required: [true, 'Payment status is required'],
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentIntentId: {
      type: String,
      required: false,
    },
    stripePaymentId: {
      type: String,
      required: false,
    },
    notes: {
      type: String,
      required: false,
    },
    currency: {
      type: String,
      required: [true, 'Currency is required'],
      default: 'usd',
    },
  },
  {
    timestamps: true,
  }
);

const OrderModel = model('orders', OrderSchema);

export default OrderModel;

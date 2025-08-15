import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  // Customer placed the order
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Products in this order (shopping cart contents)
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    // Price at time of order (price might change later)
    priceAtOrder: {
      type: Number,
      required: true,
      min: 0
    },
    // Ref vendor info (for order tracking)
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }],
  
  // Order totals
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Delivery information (copied from customer at order time)
  deliveryAddress: {
    type: String,
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  
  // Random hub assignment
  distributionHub: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DistributionHub',
    required: true
  },
  
  // Order status for shipper management
  status: {
    type: String,
    enum: ['active', 'delivered', 'canceled'],
    default: 'active',
    required: true
  },
  
  // When shipper takes the order
  shipperId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Tracking timestamps
  deliveredAt: Date,
  canceledAt: Date
  
}, {
  timestamps: true // orderDate = createdAt
});

// Indexes for assignment functionality
orderSchema.index({ customerId: 1, status: 1 }); // Customer order history
orderSchema.index({ distributionHub: 1, status: 1 }); // Shipper dashboard
orderSchema.index({ shipperId: 1, status: 1 }); // Shipper's active orders
orderSchema.index({ status: 1, createdAt: -1 }); // Recent orders first

export default mongoose.model('Order', orderSchema);

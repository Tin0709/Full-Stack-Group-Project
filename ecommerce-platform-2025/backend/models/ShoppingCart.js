import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  }
});

const shoppingCartSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // One cart per customer
  },
  items: [cartItemSchema],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Clean up cart items when products are deleted
shoppingCartSchema.methods.removeInvalidItems = async function() {
  const Product = mongoose.model('Product');
  const validItems = [];
  
  for (const item of this.items) {
    const product = await Product.findById(item.productId);
    if (product && product.isActive) {
      validItems.push(item);
    }
  }
  
  this.items = validItems;
  await this.save();
};

export default mongoose.model('ShoppingCart', shoppingCartSchema);

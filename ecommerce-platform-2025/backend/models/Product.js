
import mongoose from 'mongoose';
const productSchema = new mongoose.Schema({
  
  // CORE PRODUCT INFORMATION
  name: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 20,
    trim: true,
    // Assignment length requirements
  },
  
  price: {
    type: Number,
    required: true,
    min: 0.01,
    validate: {
      validator: function(value) {
        return value > 0;
      },
      message: 'Price must be a positive number'
    },
    // WHY: Prevent 0/negative prices
  },
  
  description: {
    type: String,
    required: true,
    maxlength: 500,
    trim: true,
    // product information for customers
  },
  
  image: {
    type: String,
    required: true,
    // Stores filename
  },
  
  // VENDOR RELATIONSHIP  
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    // Must know which vendor owns each product
  },
  
  // PRODUCT STATUS & INVENTORY  
  isActive: {
    type: Boolean,
    default: true,
    // WHY: delete but hide products without losing order history
  },
  
  stock: {
    type: Number,
    default: 1,
    min: 0,
    // Basic inventory tracking
  },
  
  // METADATA   
  viewCount: {
    type: Number,
    default: 0,
    // Track product popularity for recommendations
  },
  
  totalSold: {
    type: Number,
    default: 0,
    //Track sales performance, updated when orders placed
  }
  
}, {
  timestamps: true,
});

// INDEXES FOR PERFORMANCE

// get products by vendor
productSchema.index({ vendorId: 1, isActive: 1 });
// WHY: Vendor dashboard "my products" query

// Customer browsing: active products with sorting
productSchema.index({ isActive: 1, createdAt: -1 });
// WHY: Product listing page, newest first

// Search functionality
productSchema.index({ name: 'text', description: 'text' });
// Full-text search on product names and descriptions

// Price filtering 
productSchema.index({ isActive: 1, price: 1 });
// Price range filtering on product browser

export default mongoose.model('Product', productSchema);

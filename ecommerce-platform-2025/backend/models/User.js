import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // All user types
  username: {
    type: String,
    required: true,
    unique: true,// Unique regardless of role
    minlength: 8, 
    maxlength: 15,
    match: /^[a-zA-Z0-9]{8,15}$/,// Only letters and digits
    trim: true
  },
  
  password: {
    type: String,
    required: true,
    minlength: 8, 
  },
  
  profilePicture: {
    type: String,
    // Stores filename, no need reuqired
  },
  
  role: {
    type: String,
    required: true,
    enum: ['customer', 'vendor', 'shipper'],
    // Determines roles for below fieldsd
  },
  
  // CUSTOMER ROLE FIELDS
  name: {
    type: String,
    required: function() { 
      return this.role === 'customer'; 
    },
    minlength: 5, // Assignment requires
    trim: true
  },
  
  address: { // Delivery address, copied to orders when placed
    type: String,
    required: function() { 
      return this.role === 'customer'; 
    },
    minlength: 5, // Assignment requires
    trim: true
  },

// VENDOR ROLE FIELDS  
  businessName: {
    type: String,
    required: function() { // Displayed on product cards, must be unique among vendors
      return this.role === 'vendor'; 
    },
    minlength: 5,
    trim: true
  },
  
  businessAddress: {
    type: String,
    // Vendor location, must be unique among vendors
    required: function() { 
      return this.role === 'vendor'; 
    },
    minlength: 5,
    trim: true
  },
  
  // SHIPPER ROLE FIELDS
  
  distributionHub: {
    // Shipper can only see orders assigned to their hub
    type: String,
    required: function() { 
      return this.role === 'shipper'; 
    },
    enum: ['Ho Chi Minh', 'Hanoi', 'Da Nang']
  }
  
}, {
  timestamps: true, // Adds createdAt, updatedAt automatically
});

// INDEXES FOR PERFORMANCE

// Primary lookup: username (for login)
userSchema.index({ username: 1 });

// Secondary lookups: role-based queries
userSchema.index({ role: 1 });

// Vendor uniqueness constraints (only among vendors)
userSchema.index(
  { businessName: 1 }, 
  { 
    unique: true, 
    partialFilterExpression: { role: 'vendor' },
    //Two vendors can't have same business name, but customer can have same name as business
  }
);

userSchema.index(
  { businessAddress: 1 }, 
  { 
    unique: true, 
    partialFilterExpression: { role: 'vendor' },
    // Two vendors can't operate from same address, but customer can live at vendor address
  }
);

// Shipper hub lookup (for order assignment)
userSchema.index({ distributionHub: 1, role: 1 });

// SCHEMA METHODS

// Remove password from JSON output (security)
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Get role specific fields only
userSchema.methods.getRoleFields = function() {
  const baseFields = {
    _id: this._id,
    username: this.username,
    profilePicture: this.profilePicture,
    role: this.role,
    createdAt: this.createdAt
  };
  
  switch(this.role) {
    case 'customer':
      return { ...baseFields, name: this.name, address: this.address };
    case 'vendor':
      return { ...baseFields, businessName: this.businessName, businessAddress: this.businessAddress };
    case 'shipper':
      return { ...baseFields, distributionHub: this.distributionHub };
    default:
      return baseFields;
  }
};

// PRE-SAVE VALIDATION
userSchema.pre('save', function(next) {
  // Ensure role-specific fields are null for other roles
  if (this.role !== 'customer') {
    this.name = undefined;
    this.address = undefined;
  }
  if (this.role !== 'vendor') {
    this.businessName = undefined;
    this.businessAddress = undefined;
  }
  if (this.role !== 'shipper') {
    this.distributionHub = undefined;
  }
  next();
});

export default mongoose.model('User', userSchema);

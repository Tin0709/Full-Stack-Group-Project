import mongoose from 'mongoose';

const distributionHubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ['Ho Chi Minh', 'Da Nang', 'Hanoi'],
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  // Track hub performance/activity
  activeOrders: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('DistributionHub', distributionHubSchema);

import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  adminCode: {
    type: String,
    unique: true,
    length: 14
  },
  isActive: {
    type: Boolean,
    default: true
  },
  registeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PortalAdmin'
  }
}, {
  timestamps: true
});

// Generate a random 14-digit admin code
companySchema.statics.generateAdminCode = function() {
  return Math.floor(10000000000000 + Math.random() * 90000000000000).toString();
};

// Pre-save hook removed - admin code is generated manually in controller

export default mongoose.model('Company', companySchema); 
import mongoose from 'mongoose';

const applicantSchema = new mongoose.Schema({
  applicant_id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  resumePath: {
    type: String,
    default: ''
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
});

const jobSchema = new mongoose.Schema({
  job_category: {
    type: String,
    required: true,
    trim: true
  },
  job_type: {
    type: String,
    required: true,
    trim: true
  },
  job_designation: {
    type: String,
    required: true,
    trim: true
  },
  job_location: {
    type: String,
    required: true,
    trim: true
  },
  company_name: {
    type: String,
    required: true,
    trim: true
  },
  company_logo: {
    type: String,
    default: ''
  },
  salary: {
    type: String,
    required: true
  },
  apply_by: {
    type: Date,
    required: true
  },
  skills_required: [{
    type: String,
    trim: true
  }],
  number_of_openings: {
    type: Number,
    required: true,
    min: 1
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  job_posted: {
    type: Date,
    default: Date.now
  },
  applicants: [applicantSchema],
  posted_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Job || mongoose.model('Job', jobSchema);
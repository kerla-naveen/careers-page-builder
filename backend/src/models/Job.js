const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true,
  },
  companySlug: {
    type: String,
    required: true,
    index: true,
    lowercase: true,
  },
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
  },
  job_slug: {
    type: String,
    required: true,
    index: true,
  },
  work_policy: {
    type: String,
    default: 'Remote',
  },
  location: {
    type: String,
    default: 'Global',
  },
  department: {
    type: String,
    default: 'Engineering',
  },
  employment_type: {
    type: String,
    default: 'Full time',
  },
  experience_level: {
    type: String,
    default: 'Mid-level',
  },
  job_type: {
    type: String,
    default: 'Permanent',
  },
  salary_range: {
    type: String,
    default: 'Competitive',
  },
  status: {
    type: String,
    enum: ['DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED', 'UNPUBLISHED'],
    default: 'DRAFT',
    index: true,
  },
  published_at: {
    type: Date,
    default: null,
  },
  description: {
    type: String,
    default: '',
  },
  requirements: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Job', JobSchema);

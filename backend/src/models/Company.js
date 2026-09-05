const mongoose = require('mongoose');

const SectionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['HERO', 'ABOUT', 'CULTURE', 'PERKS', 'JOBS', 'TEAM', 'TESTIMONIALS', 'FAQ', 'CTA', 'GALLERY'],
    required: true,
  },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  content: { type: mongoose.Schema.Types.Mixed, default: {} },
  orderIndex: { type: Number, default: 0 },
  isVisible: { type: Boolean, default: true },
}, { _id: true });

const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
  },
  slug: {
    type: String,
    required: [true, 'Company slug is required'],
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  logoUrl: { type: String, default: '' },
  bannerUrl: { type: String, default: 'https://images.unsplash.com/photo-1497366216548-37526070297c' },
  primaryColor: { type: String, default: '#2563eb' },
  accentColor: { type: String, default: '#3b82f6' },
  backgroundColor: { type: String, default: '#0f172a' },
  textColor: { type: String, default: '#f8fafc' },
  fontFamily: { type: String, default: 'Outfit' },
  borderRadius: { type: String, default: '16px' },
  description: { type: String, default: '' },
  website: { type: String, default: '' },
  videoUrl: { type: String, default: '' },
  socialLinks: {
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    github: { type: String, default: '' },
    glassdoor: { type: String, default: '' },
    instagram: { type: String, default: '' },
    facebook: { type: String, default: '' },
  },
  sections: [SectionSchema],
  draftSections: [SectionSchema],
  publishedSections: [SectionSchema],
  isPublished: { type: Boolean, default: true },
  lastPublishedAt: { type: Date, default: Date.now },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Company', CompanySchema);

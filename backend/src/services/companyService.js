const Company = require('../models/Company');
const { generateUniqueCompanySlug } = require('../utils/slugGenerator');

async function getAllCompanies() {
  const companies = await Company.find({}).sort({ createdAt: -1 });
  return companies;
}

async function createCompany(data) {
  const { name, slug, primaryColor, accentColor, backgroundColor, textColor, description, website } = data;

  if (!name || !slug) {
    const error = new Error('Company Name and Slug are required');
    error.statusCode = 400;
    throw error;
  }

  const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]+/g, '-');
  const existing = await Company.findOne({ slug: cleanSlug });
  if (existing) {
    const error = new Error(`Company with slug '${cleanSlug}' already exists`);
    error.statusCode = 400;
    throw error;
  }

  const company = await Company.create({
    name,
    slug: cleanSlug,
    primaryColor: primaryColor || '#2563eb',
    accentColor: accentColor || '#3b82f6',
    backgroundColor: backgroundColor || '#FAFAF9',
    textColor: textColor || '#18181B',
    description: description || '',
    website: website || '',
  });

  return company;
}

async function getCompanyBySlug(slug) {
  const cleanSlug = slug.toLowerCase();
  const company = await Company.findOne({ slug: cleanSlug });
  if (!company) {
    const error = new Error(`Company '${cleanSlug}' not found`);
    error.statusCode = 404;
    throw error;
  }
  return company;
}

async function updateCompanyBySlug(slug, updateData) {
  const cleanSlug = slug.toLowerCase();
  const company = await Company.findOne({ slug: cleanSlug });

  if (!company) {
    const error = new Error(`Company '${cleanSlug}' not found`);
    error.statusCode = 404;
    throw error;
  }

  const allowedFields = [
    'name',
    'primaryColor',
    'accentColor',
    'backgroundColor',
    'textColor',
    'fontFamily',
    'borderRadius',
    'description',
    'website',
    'videoUrl',
    'bannerUrl',
    'logoUrl',
    'socialLinks',
    'sections',
  ];

  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      company[field] = updateData[field];
    }
  });

  await company.save();
  return company;
}

async function publishCompanyBySlug(slug) {
  const cleanSlug = slug.toLowerCase();
  const company = await Company.findOne({ slug: cleanSlug });

  if (!company) {
    const error = new Error(`Company '${cleanSlug}' not found`);
    error.statusCode = 404;
    throw error;
  }

  if (company.sections && company.sections.length > 0) {
    company.publishedSections = company.sections;
  }
  company.isPublished = true;
  company.lastPublishedAt = new Date();

  await company.save();
  return company;
}

async function deleteCompanyBySlug(slug) {
  const cleanSlug = slug.toLowerCase();
  const result = await Company.deleteOne({ slug: cleanSlug });

  if (result.deletedCount === 0) {
    const error = new Error(`Company '${cleanSlug}' not found`);
    error.statusCode = 404;
    throw error;
  }

  return true;
}

module.exports = {
  getAllCompanies,
  createCompany,
  getCompanyBySlug,
  updateCompanyBySlug,
  publishCompanyBySlug,
  deleteCompanyBySlug,
};

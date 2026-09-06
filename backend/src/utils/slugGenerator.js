const Company = require('../models/Company');
const Job = require('../models/Job');

/**
 * Generate a clean, unique slug for a company
 */
async function generateUniqueCompanySlug(name) {
  let baseSlug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (!baseSlug) baseSlug = 'company';

  let slug = baseSlug;
  let counter = 1;
  while (await Company.findOne({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  return slug;
}

/**
 * Generate a unique slug for a job posting
 */
async function generateUniqueJobSlug(title, companySlug) {
  let baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (!baseSlug) baseSlug = 'job';

  let slug = `${baseSlug}-${Date.now().toString(36)}`;
  let counter = 1;
  while (await Job.findOne({ companySlug, job_slug: slug })) {
    slug = `${baseSlug}-${Date.now().toString(36)}-${counter}`;
    counter++;
  }
  return slug;
}

module.exports = {
  generateUniqueCompanySlug,
  generateUniqueJobSlug,
};

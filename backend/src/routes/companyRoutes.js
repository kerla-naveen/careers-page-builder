const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const Job = require('../models/Job');
const { protect } = require('../middleware/auth');
const checkCompanyOwnership = require('../middleware/checkCompanyOwnership');

/**
 * @route   GET /api/companies
 * @desc    Get all companies list
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find({}).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: companies.length,
      data: companies,
    });
  } catch (error) {
    console.error('Error in GET /companies:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

/**
 * @route   POST /api/companies
 * @desc    Create a brand new company portal dynamically
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const { name, slug, primaryColor, accentColor, backgroundColor, textColor, description, website } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ success: false, error: 'Company Name and Slug are required' });
    }

    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]+/g, '-');
    const existing = await Company.findOne({ slug: cleanSlug });
    if (existing) {
      return res.status(400).json({ success: false, error: `Company with slug '${cleanSlug}' already exists` });
    }

    // Default initial sections for new SaaS company portal
    const defaultSections = [
      {
        type: 'HERO',
        title: `Build Your Career at ${name}`,
        subtitle: 'Join a world-class team driving innovation.',
        content: {
          headline: `Welcome to ${name}`,
          tagline: 'Empowering talented individuals to build the future.',
          ctaText: 'Explore Open Positions',
          badgeText: '🚀 We are actively hiring',
          stats: [
            { value: '100+', label: 'Team Members' },
            { value: '50+', label: 'Global Clients' },
            { value: '4.8★', label: 'Glassdoor Rating' },
          ],
        },
        orderIndex: 0,
        isVisible: true,
      },
      {
        type: 'ABOUT',
        title: 'Who We Are',
        subtitle: 'Our story, mission, and vision.',
        content: {
          story: `${name} was founded to solve critical challenges and empower teams globally.\n\nWe believe in high-velocity innovation, transparent communication, and giving our people autonomy to build extraordinary products.`,
          stats: [
            { value: '2024', label: 'Founded' },
            { value: '100%', label: 'Remote Friendly' },
          ],
        },
        orderIndex: 1,
        isVisible: true,
      },
      {
        type: 'CULTURE',
        title: 'Our Culture & Values',
        subtitle: 'The principles that define how we build.',
        content: {
          description: `Culture at ${name} is driven by accountability, trust, and continuous growth.`,
          values: [
            { icon: '💡', name: 'Innovation First', description: 'We encourage experimentation and challenge the status quo.' },
            { icon: '🤝', name: 'Transparency', description: 'We communicate open context and clear goals across teams.' },
            { icon: '🎯', name: 'Impact Driven', description: 'Every line of code and customer interaction is built for impact.' },
          ],
        },
        orderIndex: 2,
        isVisible: true,
      },
      {
        type: 'PERKS',
        title: 'Perks & Benefits',
        subtitle: 'Invested in your growth, health, and happiness.',
        content: {
          perks: [
            { icon: '🏠', title: 'Remote Work Stipend', description: '$1,000 home office setup allowance.' },
            { icon: '📚', title: 'Learning Allowance', description: '$2,000 annual budget for courses and conferences.' },
            { icon: '🏥', title: 'Comprehensive Healthcare', description: 'Full medical, dental, and vision coverage.' },
          ],
        },
        orderIndex: 3,
        isVisible: true,
      },
      {
        type: 'JOBS',
        title: 'Open Positions',
        subtitle: 'Find your next role with us.',
        content: {},
        orderIndex: 4,
        isVisible: true,
      },
    ];

    const newCompany = await Company.create({
      name,
      slug: cleanSlug,
      primaryColor: primaryColor || '#2563eb',
      accentColor: accentColor || '#3b82f6',
      backgroundColor: backgroundColor || '#0f172a',
      textColor: textColor || '#f8fafc',
      description: description || `Careers at ${name}`,
      website: website || '',
      sections: defaultSections,
      isPublished: true,
    });

    return res.status(201).json({
      success: true,
      message: 'Company created successfully!',
      data: newCompany,
    });
  } catch (error) {
    console.error('Error in POST /companies:', error);
    return res.status(500).json({ success: false, error: 'Failed to create company: ' + error.message });
  }
});

/**
 * @route   GET /api/companies/:slug
 * @desc    Get company brand theme, details, and sections by slug
 * @access  Public
 */
router.get('/:slug', async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();
    const company = await Company.findOne({ slug });

    if (!company) {
      return res.status(404).json({
        success: false,
        error: `Company with slug '${slug}' not found`,
      });
    }

    return res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    console.error('Error in GET /companies/:slug:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
});

/**
 * Helper: Generate unique URL-safe job slug for a company
 */
async function generateUniqueJobSlug(companySlug, title, location, excludeJobId = null) {
  const raw = `${title}-${location || 'remote'}`;
  let baseSlug = raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (!baseSlug) baseSlug = 'job-posting';

  let slug = baseSlug;
  let counter = 1;
  while (true) {
    const existing = await Job.findOne({ companySlug, job_slug: slug });
    if (!existing || (excludeJobId && existing._id.toString() === excludeJobId.toString())) {
      break;
    }
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  return slug;
}

/**
 * Helper: Calculate relative days ago from published_at timestamp
 */
function computeDaysAgo(publishedAt) {
  if (!publishedAt) return 0;
  const diffMs = Date.now() - new Date(publishedAt).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return days >= 0 ? days : 0;
}

/**
 * @route   GET /api/companies/:slug/jobs
 * @desc    Get PUBLISHED jobs for candidate careers page with filters
 * @access  Public
 */
router.get('/:slug/jobs', async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();
    const company = await Company.findOne({ slug });
    if (!company) {
      return res.status(404).json({ success: false, error: `Company with slug '${slug}' not found` });
    }

    const { search, work_policy, department, employment_type, location, experience_level } = req.query;

    // Build filter query object — ONLY fetch PUBLISHED jobs for candidate view
    const filterQuery = { companySlug: slug, status: 'PUBLISHED' };

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filterQuery.$or = [
        { title: searchRegex },
        { department: searchRegex },
        { location: searchRegex },
      ];
    }

    if (work_policy) filterQuery.work_policy = { $in: work_policy.split(',') };
    if (department) filterQuery.department = { $in: department.split(',') };
    if (employment_type) filterQuery.employment_type = { $in: employment_type.split(',') };
    if (location) filterQuery.location = { $in: location.split(',') };
    if (experience_level) filterQuery.experience_level = { $in: experience_level.split(',') };

    const jobs = await Job.find(filterQuery).sort({ published_at: -1, createdAt: -1 });

    // Format output with dynamically computed posted_days_ago
    const formattedJobs = jobs.map((job) => {
      const jObj = job.toObject();
      jObj.posted_days_ago = computeDaysAgo(job.published_at || job.createdAt);
      return jObj;
    });

    const allPublishedCompanyJobs = await Job.find({ companySlug: slug, status: 'PUBLISHED' })
      .select('work_policy department employment_type location experience_level');

    const facets = {
      work_policy: [...new Set(allPublishedCompanyJobs.map((j) => j.work_policy).filter(Boolean))],
      department: [...new Set(allPublishedCompanyJobs.map((j) => j.department).filter(Boolean))],
      employment_type: [...new Set(allPublishedCompanyJobs.map((j) => j.employment_type).filter(Boolean))],
      location: [...new Set(allPublishedCompanyJobs.map((j) => j.location).filter(Boolean))],
      experience_level: [...new Set(allPublishedCompanyJobs.map((j) => j.experience_level).filter(Boolean))],
    };

    return res.status(200).json({
      success: true,
      count: formattedJobs.length,
      facets,
      data: formattedJobs,
    });
  } catch (error) {
    console.error('Error in GET /companies/:slug/jobs:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

/**
 * @route   GET /api/companies/:slug/jobs/recruiter
 * @desc    Get paginated, filtered, sorted company jobs for recruiter management dashboard
 * @access  Private (Recruiter Owner)
 */
router.get('/:slug/jobs/recruiter', protect, checkCompanyOwnership, async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const { search, status, department, location, employment_type, sort } = req.query;

    const query = { companySlug: slug };

    // Status filter
    if (status && status !== 'ALL') {
      if (status === 'CLOSED') {
        query.status = { $in: ['CLOSED', 'UNPUBLISHED'] };
      } else {
        query.status = status;
      }
    }

    // Department filter
    if (department && department !== 'ALL') {
      query.department = department;
    }

    // Location filter
    if (location && location !== 'ALL') {
      query.location = location;
    }

    // Employment type filter
    if (employment_type && employment_type !== 'ALL') {
      query.employment_type = employment_type;
    }

    // Search query across title, department, location, work_policy, description
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { department: searchRegex },
        { location: searchRegex },
        { work_policy: searchRegex },
        { description: searchRegex },
      ];
    }

    // Sort order
    let sortOption = { createdAt: -1 };
    if (sort === 'recently_updated') {
      sortOption = { updatedAt: -1 };
    } else if (sort === 'recently_created') {
      sortOption = { createdAt: -1 };
    } else if (sort === 'title') {
      sortOption = { title: 1 };
    } else if (sort === 'status') {
      sortOption = { status: 1, createdAt: -1 };
    }

    const totalJobs = await Job.countDocuments(query);
    const jobs = await Job.find(query).sort(sortOption).skip(skip).limit(limit);

    const formattedJobs = jobs.map((job) => {
      const jObj = job.toObject();
      jObj.posted_days_ago = computeDaysAgo(job.published_at || job.createdAt);
      return jObj;
    });

    // Fetch distinct filter options and status counts across ALL jobs of this company
    const allCompanyJobs = await Job.find({ companySlug: slug }).select('department location status');
    const availableDepartments = [...new Set(allCompanyJobs.map((j) => j.department).filter(Boolean))].sort();
    const availableLocations = [...new Set(allCompanyJobs.map((j) => j.location).filter(Boolean))].sort();

    const statusCounts = {
      ALL: allCompanyJobs.length,
      DRAFT: allCompanyJobs.filter((j) => j.status === 'DRAFT').length,
      PUBLISHED: allCompanyJobs.filter((j) => j.status === 'PUBLISHED').length,
      CLOSED: allCompanyJobs.filter((j) => j.status === 'CLOSED' || j.status === 'UNPUBLISHED').length,
      ARCHIVED: allCompanyJobs.filter((j) => j.status === 'ARCHIVED').length,
    };

    return res.status(200).json({
      success: true,
      data: formattedJobs,
      totalJobs,
      page,
      limit,
      totalPages: Math.ceil(totalJobs / limit) || 1,
      availableDepartments,
      availableLocations,
      statusCounts,
    });
  } catch (error) {
    console.error('Error in GET /companies/:slug/jobs/recruiter:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

/**
 * @route   POST /api/companies/:slug/jobs/bulk-status
 * @desc    Bulk update job statuses
 * @access  Private (Recruiter Owner)
 */
router.post('/:slug/jobs/bulk-status', protect, checkCompanyOwnership, async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();
    const { jobIds, status } = req.body;

    if (!Array.isArray(jobIds) || jobIds.length === 0) {
      return res.status(400).json({ success: false, error: 'No job IDs provided' });
    }

    if (!['DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status value' });
    }

    const updateDoc = { status };
    if (status === 'PUBLISHED') {
      updateDoc.published_at = new Date();
    }

    const result = await Job.updateMany(
      { _id: { $in: jobIds }, companySlug: slug },
      { $set: updateDoc }
    );

    return res.status(200).json({
      success: true,
      message: `Successfully updated ${result.modifiedCount} job(s) to ${status}`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error('Error in POST /companies/:slug/jobs/bulk-status:', error);
    return res.status(500).json({ success: false, error: 'Failed to perform bulk status update' });
  }
});

/**
 * @route   POST /api/companies/:slug/jobs/bulk-delete
 * @desc    Bulk delete job postings
 * @access  Private (Recruiter Owner)
 */
router.post('/:slug/jobs/bulk-delete', protect, checkCompanyOwnership, async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();
    const { jobIds } = req.body;

    if (!Array.isArray(jobIds) || jobIds.length === 0) {
      return res.status(400).json({ success: false, error: 'No job IDs provided' });
    }

    const result = await Job.deleteMany({ _id: { $in: jobIds }, companySlug: slug });

    return res.status(200).json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} job(s)`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Error in POST /companies/:slug/jobs/bulk-delete:', error);
    return res.status(500).json({ success: false, error: 'Failed to perform bulk deletion' });
  }
});

/**
 * @route   POST /api/companies/:slug/jobs/:id/duplicate
 * @desc    Duplicate an existing job posting as a DRAFT
 * @access  Private (Recruiter Owner)
 */
router.post('/:slug/jobs/:id/duplicate', protect, checkCompanyOwnership, async (req, res) => {
  try {
    const { slug, id } = req.params;
    const original = await Job.findOne({ _id: id, companySlug: slug.toLowerCase() });

    if (!original) {
      return res.status(404).json({ success: false, error: 'Original job posting not found' });
    }

    const newTitle = `${original.title} (Copy)`;
    const newSlug = await generateUniqueJobSlug(slug, newTitle, original.location);

    const duplicatedJob = await Job.create({
      companyId: original.companyId,
      companySlug: original.companySlug,
      title: newTitle,
      job_slug: newSlug,
      department: original.department,
      location: original.location,
      work_policy: original.work_policy,
      employment_type: original.employment_type,
      experience_level: original.experience_level,
      job_type: original.job_type,
      salary_range: original.salary_range,
      description: original.description,
      requirements: original.requirements,
      status: 'DRAFT',
      published_at: null,
    });

    const jObj = duplicatedJob.toObject();
    jObj.posted_days_ago = 0;

    return res.status(201).json({
      success: true,
      message: 'Job posting duplicated successfully!',
      data: jObj,
    });
  } catch (error) {
    console.error('Error in POST /companies/:slug/jobs/:id/duplicate:', error);
    return res.status(500).json({ success: false, error: 'Failed to duplicate job' });
  }
});

/**
 * @route   GET /api/companies/:slug/jobs/:job_slug
 * @desc    Get single PUBLISHED job details by company slug and job_slug for candidate page
 * @access  Public
 */
router.get('/:slug/jobs/:job_slug', async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();
    const jobSlug = req.params.job_slug;

    const company = await Company.findOne({ slug });
    if (!company) {
      return res.status(404).json({ success: false, error: `Company '${slug}' not found` });
    }

    // Must be PUBLISHED for candidate view
    const job = await Job.findOne({ companySlug: slug, job_slug: jobSlug, status: 'PUBLISHED' });
    if (!job) {
      return res.status(404).json({
        success: false,
        error: `Job '${jobSlug}' not found or is currently unpublished`,
      });
    }

    const jObj = job.toObject();
    jObj.posted_days_ago = computeDaysAgo(job.published_at || job.createdAt);

    return res.status(200).json({
      success: true,
      data: {
        company,
        job: jObj,
      },
    });
  } catch (error) {
    console.error('Error in GET /companies/:slug/jobs/:job_slug:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

/**
 * @route   POST /api/companies/:slug/jobs
 * @desc    Create a new job posting (DRAFT or PUBLISHED)
 * @access  Private (Recruiter Owner)
 */
router.post('/:slug/jobs', protect, checkCompanyOwnership, async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();
    const company = await Company.findOne({ slug });

    if (!company) {
      return res.status(404).json({ success: false, error: `Company '${slug}' not found` });
    }

    const {
      title,
      department,
      location,
      work_policy,
      employment_type,
      experience_level,
      job_type,
      salary_range,
      description,
      requirements,
      status,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, error: 'Job Title is required' });
    }

    const initialStatus = status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT';
    const uniqueSlug = await generateUniqueJobSlug(slug, title, location);

    const newJob = await Job.create({
      companyId: company._id,
      companySlug: company.slug,
      title: title.trim(),
      job_slug: uniqueSlug,
      department: department || 'Engineering',
      location: location || 'Remote',
      work_policy: work_policy || 'Hybrid',
      employment_type: employment_type || 'Full time',
      experience_level: experience_level || 'Mid Level',
      job_type: job_type || 'Permanent',
      salary_range: salary_range || 'Competitive',
      description: description || `We are looking for a highly skilled ${title} to join our team.`,
      requirements: requirements || '',
      status: initialStatus,
      published_at: initialStatus === 'PUBLISHED' ? new Date() : null,
    });

    const jObj = newJob.toObject();
    jObj.posted_days_ago = computeDaysAgo(newJob.published_at);

    return res.status(201).json({
      success: true,
      message: 'Job posting created successfully!',
      data: jObj,
    });
  } catch (error) {
    console.error('Error in POST /companies/:slug/jobs:', error);
    return res.status(500).json({ success: false, error: 'Failed to create job: ' + error.message });
  }
});

/**
 * @route   PUT /api/companies/:slug/jobs/:id
 * @desc    Update an existing job posting
 * @access  Private (Recruiter Owner)
 */
router.put('/:slug/jobs/:id', protect, checkCompanyOwnership, async (req, res) => {
  try {
    const { slug, id } = req.params;
    const job = await Job.findOne({ _id: id, companySlug: slug.toLowerCase() });

    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }

    const {
      title,
      department,
      location,
      work_policy,
      employment_type,
      experience_level,
      job_type,
      salary_range,
      description,
      requirements,
      status,
    } = req.body;

    if (title && title.trim()) job.title = title.trim();
    if (department) job.department = department;
    if (location) job.location = location;
    if (work_policy) job.work_policy = work_policy;
    if (employment_type) job.employment_type = employment_type;
    if (experience_level) job.experience_level = experience_level;
    if (job_type) job.job_type = job_type;
    if (salary_range !== undefined) job.salary_range = salary_range;
    if (description !== undefined) job.description = description;
    if (requirements !== undefined) job.requirements = requirements;

    // Update slug if title/location changed
    if (title || location) {
      job.job_slug = await generateUniqueJobSlug(job.companySlug, job.title, job.location, job._id);
    }

    if (status && ['DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED', 'UNPUBLISHED'].includes(status)) {
      if (status === 'PUBLISHED' && job.status !== 'PUBLISHED') {
        job.published_at = job.published_at || new Date();
      }
      job.status = status;
    }

    await job.save();

    const jObj = job.toObject();
    jObj.posted_days_ago = computeDaysAgo(job.published_at);

    return res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      data: jObj,
    });
  } catch (error) {
    console.error('Error in PUT /companies/:slug/jobs/:id:', error);
    return res.status(500).json({ success: false, error: 'Failed to update job: ' + error.message });
  }
});

/**
 * @route   PATCH /api/companies/:slug/jobs/:id/status
 * @desc    Publish / Unpublish / Close / Archive / Set Draft status for a job
 * @access  Private (Recruiter Owner)
 */
router.patch('/:slug/jobs/:id/status', protect, checkCompanyOwnership, async (req, res) => {
  try {
    const { slug, id } = req.params;
    const { status } = req.body;

    if (!['DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED', 'UNPUBLISHED'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status value' });
    }

    const job = await Job.findOne({ _id: id, companySlug: slug.toLowerCase() });
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }

    job.status = status;
    if (status === 'PUBLISHED' && !job.published_at) {
      job.published_at = new Date();
    }

    await job.save();

    const jObj = job.toObject();
    jObj.posted_days_ago = computeDaysAgo(job.published_at);

    return res.status(200).json({
      success: true,
      message: `Job status updated to ${status}`,
      data: jObj,
    });
  } catch (error) {
    console.error('Error in PATCH /companies/:slug/jobs/:id/status:', error);
    return res.status(500).json({ success: false, error: 'Failed to update job status' });
  }
});

/**
 * @route   DELETE /api/companies/:slug/jobs/:id
 * @desc    Delete a job posting
 * @access  Private (Recruiter Owner)
 */
router.delete('/:slug/jobs/:id', protect, checkCompanyOwnership, async (req, res) => {
  try {
    const { slug, id } = req.params;
    const result = await Job.deleteOne({ _id: id, companySlug: slug.toLowerCase() });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, error: 'Job not found or already deleted' });
    }

    return res.status(200).json({
      success: true,
      message: 'Job posting deleted successfully',
    });
  } catch (error) {
    console.error('Error in DELETE /companies/:slug/jobs/:id:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete job' });
  }
});

/**
 * @route   PUT /api/companies/:slug
 * @desc    Update company brand theme, details, and sections by slug
 * @access  Public (Recruiter Dashboard)
 */
router.put('/:slug', protect, checkCompanyOwnership, async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();
    const company = await Company.findOne({ slug });

    if (!company) {
      return res.status(404).json({
        success: false,
        error: `Company with slug '${slug}' not found`,
      });
    }

    const {
      name,
      primaryColor,
      accentColor,
      backgroundColor,
      textColor,
      fontFamily,
      borderRadius,
      description,
      website,
      videoUrl,
      bannerUrl,
      logoUrl,
      socialLinks,
      sections,
      isPublished,
    } = req.body;

    if (name !== undefined) company.name = name;
    if (primaryColor !== undefined) company.primaryColor = primaryColor;
    if (accentColor !== undefined) company.accentColor = accentColor;
    if (backgroundColor !== undefined) company.backgroundColor = backgroundColor;
    if (textColor !== undefined) company.textColor = textColor;
    if (fontFamily !== undefined) company.fontFamily = fontFamily;
    if (borderRadius !== undefined) company.borderRadius = borderRadius;
    if (description !== undefined) company.description = description;
    if (website !== undefined) company.website = website;
    if (videoUrl !== undefined) company.videoUrl = videoUrl;
    if (bannerUrl !== undefined) company.bannerUrl = bannerUrl;
    if (logoUrl !== undefined) company.logoUrl = logoUrl;
    if (socialLinks !== undefined) company.socialLinks = socialLinks;
    if (isPublished !== undefined) company.isPublished = isPublished;

    if (Array.isArray(sections)) {
      const normalized = sections.map((sec, idx) => ({
        type: sec.type,
        title: sec.title || '',
        subtitle: sec.subtitle || '',
        content: sec.content || {},
        orderIndex: sec.orderIndex !== undefined ? sec.orderIndex : idx,
        isVisible: sec.isVisible !== undefined ? sec.isVisible : true,
      }));
      company.sections = normalized;
      company.draftSections = normalized;
    }

    await company.save();

    return res.status(200).json({
      success: true,
      message: 'Company settings updated successfully',
      data: company,
    });
  } catch (error) {
    console.error('Error in PUT /companies/:slug:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update company settings: ' + error.message,
    });
  }
});

/**
 * @route   POST /api/companies/:slug/publish
 * @desc    Publish draft changes to live candidate site
 * @access  Public (Recruiter Studio)
 */
router.post('/:slug/publish', protect, checkCompanyOwnership, async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();
    const company = await Company.findOne({ slug });

    if (!company) {
      return res.status(404).json({ success: false, error: `Company '${slug}' not found` });
    }

    if (company.draftSections && company.draftSections.length > 0) {
      company.publishedSections = company.draftSections;
      company.sections = company.draftSections;
    }
    company.isPublished = true;
    company.lastPublishedAt = new Date();

    await company.save();

    return res.status(200).json({
      success: true,
      message: 'Careers page published successfully!',
      data: company,
    });
  } catch (error) {
    console.error('Error in POST /companies/:slug/publish:', error);
    return res.status(500).json({ success: false, error: 'Failed to publish: ' + error.message });
  }
});

/**
 * @route   DELETE /api/companies/:slug
 * @desc    Delete a company portal by slug
 * @access  Public
 */
router.delete('/:slug', async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();
    const result = await Company.deleteOne({ slug });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, error: `Company '${slug}' not found` });
    }

    return res.status(200).json({
      success: true,
      message: `Company '${slug}' deleted successfully`,
    });
  } catch (error) {
    console.error('Error in DELETE /companies/:slug:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

/**
 * @route   PUT /api/companies/jobs/:id
 * @desc    Update an existing job posting by ID
 * @access  Public (Recruiter Studio)
 */
router.put('/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ success: false, error: 'Job posting not found' });
    }

    const {
      title,
      department,
      location,
      work_policy,
      employment_type,
      experience_level,
      job_type,
      salary_range,
      posted_days_ago,
      description,
      requirements,
    } = req.body;

    if (title !== undefined) job.title = title;
    if (department !== undefined) job.department = department;
    if (location !== undefined) job.location = location;
    if (work_policy !== undefined) job.work_policy = work_policy;
    if (employment_type !== undefined) job.employment_type = employment_type;
    if (experience_level !== undefined) job.experience_level = experience_level;
    if (job_type !== undefined) job.job_type = job_type;
    if (salary_range !== undefined) job.salary_range = salary_range;
    if (posted_days_ago !== undefined) job.posted_days_ago = posted_days_ago;
    if (description !== undefined) job.description = description;
    if (requirements !== undefined) job.requirements = requirements;

    await job.save();

    return res.status(200).json({
      success: true,
      message: 'Job posting updated successfully!',
      data: job,
    });
  } catch (error) {
    console.error('Error in PUT /jobs/:id:', error);
    return res.status(500).json({ success: false, error: 'Failed to update job: ' + error.message });
  }
});

/**
 * @route   DELETE /api/companies/jobs/:id
 * @desc    Delete a job posting by ID
 * @access  Public (Recruiter Studio)
 */
router.delete('/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Job.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ success: false, error: 'Job posting not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Job posting deleted successfully!',
    });
  } catch (error) {
    console.error('Error in DELETE /jobs/:id:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete job: ' + error.message });
  }
});

module.exports = router;

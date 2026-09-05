const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const Job = require('../models/Job');

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
 * @route   GET /api/companies/:slug/jobs
 * @desc    Get all open jobs for a company by slug (supports search & multi-field filtering)
 * @access  Public
 */
router.get('/:slug/jobs', async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();

    // Verify company exists
    const company = await Company.findOne({ slug });
    if (!company) {
      return res.status(404).json({
        success: false,
        error: `Company with slug '${slug}' not found`,
      });
    }

    const { search, work_policy, department, employment_type, location, experience_level } = req.query;

    // Build filter query object
    const filterQuery = { companySlug: slug };

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filterQuery.$or = [
        { title: searchRegex },
        { department: searchRegex },
        { location: searchRegex },
      ];
    }

    if (work_policy) {
      filterQuery.work_policy = { $in: work_policy.split(',') };
    }

    if (department) {
      filterQuery.department = { $in: department.split(',') };
    }

    if (employment_type) {
      filterQuery.employment_type = { $in: employment_type.split(',') };
    }

    if (location) {
      filterQuery.location = { $in: location.split(',') };
    }

    if (experience_level) {
      filterQuery.experience_level = { $in: experience_level.split(',') };
    }

    // Query matching jobs
    const jobs = await Job.find(filterQuery).sort({ createdAt: -1 });

    // Compute filter facets for candidate UI
    const allCompanyJobs = await Job.find({ companySlug: slug }).select('work_policy department employment_type location experience_level');
    const facets = {
      work_policy: [...new Set(allCompanyJobs.map(j => j.work_policy))],
      department: [...new Set(allCompanyJobs.map(j => j.department))],
      employment_type: [...new Set(allCompanyJobs.map(j => j.employment_type))],
      location: [...new Set(allCompanyJobs.map(j => j.location))],
      experience_level: [...new Set(allCompanyJobs.map(j => j.experience_level))],
    };

    return res.status(200).json({
      success: true,
      count: jobs.length,
      facets,
      data: jobs,
    });
  } catch (error) {
    console.error('Error in GET /companies/:slug/jobs:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
});

/**
 * @route   PUT /api/companies/:slug
 * @desc    Update company brand theme, details, and sections by slug
 * @access  Public (Recruiter Dashboard)
 */
router.put('/:slug', async (req, res) => {
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
      company.sections = sections.map((sec, idx) => ({
        type: sec.type,
        title: sec.title || '',
        subtitle: sec.subtitle || '',
        content: sec.content || {},
        orderIndex: sec.orderIndex !== undefined ? sec.orderIndex : idx,
        isVisible: sec.isVisible !== undefined ? sec.isVisible : true,
      }));
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

module.exports = router;

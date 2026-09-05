const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const Job = require('../models/Job');

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

module.exports = router;

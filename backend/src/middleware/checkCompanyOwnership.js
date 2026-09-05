const Company = require('../models/Company');

/**
 * Ensures that the authenticated user owns or is associated with the requested company.
 */
const checkCompanyOwnership = async (req, res, next) => {
  try {
    if (!req.user || !req.user.company) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: You do not own any company careers page',
      });
    }

    const { slug } = req.params;
    if (!slug) {
      return next();
    }

    const userCompanySlug = req.user.company.slug ? req.user.company.slug.toLowerCase() : '';
    const targetSlug = slug.toLowerCase();

    // Check if slug matches user's associated company
    if (userCompanySlug !== targetSlug) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: You are not authorized to edit this company\'s careers page',
      });
    }

    next();
  } catch (error) {
    console.error('Company ownership check error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error in authorization' });
  }
};

module.exports = checkCompanyOwnership;

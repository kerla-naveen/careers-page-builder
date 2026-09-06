const companyService = require('../services/companyService');

/**
 * @route   GET /api/companies
 * @desc    Get all companies list
 */
async function getCompanies(req, res) {
  try {
    const companies = await companyService.getAllCompanies();
    return res.status(200).json({
      success: true,
      count: companies.length,
      data: companies,
    });
  } catch (error) {
    console.error('Error in getCompanies controller:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}

/**
 * @route   POST /api/companies
 * @desc    Create a brand new company portal dynamically
 */
async function createCompany(req, res) {
  try {
    const company = await companyService.createCompany(req.body);
    return res.status(201).json({
      success: true,
      message: 'Company created successfully',
      data: company,
    });
  } catch (error) {
    console.error('Error in createCompany controller:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Internal Server Error',
    });
  }
}

/**
 * @route   GET /api/companies/:slug
 * @desc    Get single company profile & sections by slug
 */
async function getCompanyBySlug(req, res) {
  try {
    const company = await companyService.getCompanyBySlug(req.params.slug);
    return res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    console.error('Error in getCompanyBySlug controller:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Internal Server Error',
    });
  }
}

/**
 * @route   PUT /api/companies/:slug
 * @desc    Update company theme, branding, sections layout
 */
async function updateCompany(req, res) {
  try {
    const company = await companyService.updateCompanyBySlug(req.params.slug, req.body);
    return res.status(200).json({
      success: true,
      message: 'Company settings & deep section content saved to server!',
      data: company,
    });
  } catch (error) {
    console.error('Error in updateCompany controller:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      error: 'Failed to update company settings: ' + error.message,
    });
  }
}

/**
 * @route   POST /api/companies/:slug/publish
 * @desc    Publish draft changes to live candidate site
 */
async function publishCompany(req, res) {
  try {
    const company = await companyService.publishCompanyBySlug(req.params.slug);
    return res.status(200).json({
      success: true,
      message: 'Careers page published successfully!',
      data: company,
    });
  } catch (error) {
    console.error('Error in publishCompany controller:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      error: 'Failed to publish: ' + error.message,
    });
  }
}

/**
 * @route   DELETE /api/companies/:slug
 * @desc    Delete a company portal by slug
 */
async function deleteCompany(req, res) {
  try {
    await companyService.deleteCompanyBySlug(req.params.slug);
    return res.status(200).json({
      success: true,
      message: `Company '${req.params.slug}' deleted successfully`,
    });
  } catch (error) {
    console.error('Error in deleteCompany controller:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Internal Server Error',
    });
  }
}

module.exports = {
  getCompanies,
  createCompany,
  getCompanyBySlug,
  updateCompany,
  publishCompany,
  deleteCompany,
};

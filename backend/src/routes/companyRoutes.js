const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const checkCompanyOwnership = require('../middleware/checkCompanyOwnership');
const companyController = require('../controllers/companyController');
const jobController = require('../controllers/jobController');

/**
 * Legacy Job endpoints by ID (must be before /:slug to avoid matching slug="jobs")
 */
router.put('/jobs/:id', jobController.updateJob);
router.delete('/jobs/:id', jobController.deleteJob);

/**
 * Company Collection Routes
 */
router.get('/', companyController.getCompanies);
router.post('/', companyController.createCompany);

/**
 * Job Bulk & Recruiter Operations (must precede /:slug/jobs/:job_slug)
 */
router.get('/:slug/jobs/recruiter', protect, checkCompanyOwnership, jobController.getRecruiterJobs);
router.post('/:slug/jobs/bulk-status', protect, checkCompanyOwnership, jobController.bulkUpdateStatus);
router.post('/:slug/jobs/bulk-delete', protect, checkCompanyOwnership, jobController.bulkDelete);

/**
 * Job Collection & Detail Routes
 */
router.get('/:slug/jobs', jobController.getCandidateJobs);
router.post('/:slug/jobs', protect, checkCompanyOwnership, jobController.createJob);

router.post('/:slug/jobs/:id/duplicate', protect, checkCompanyOwnership, jobController.duplicateJob);
router.put('/:slug/jobs/:id', protect, checkCompanyOwnership, jobController.updateJob);
router.patch('/:slug/jobs/:id/status', protect, checkCompanyOwnership, jobController.toggleJobStatus);
router.delete('/:slug/jobs/:id', protect, checkCompanyOwnership, jobController.deleteJob);

router.get('/:slug/jobs/:job_slug', jobController.getJobBySlug);

/**
 * Company Item Routes
 */
router.get('/:slug', companyController.getCompanyBySlug);
router.put('/:slug', protect, checkCompanyOwnership, companyController.updateCompany);
router.post('/:slug/publish', protect, checkCompanyOwnership, companyController.publishCompany);
router.delete('/:slug', companyController.deleteCompany);

module.exports = router;

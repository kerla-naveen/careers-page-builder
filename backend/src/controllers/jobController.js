const jobService = require('../services/jobService');

/**
 * @route   GET /api/companies/:slug/jobs
 * @desc    Candidate job search & multi-facet filtering
 */
async function getCandidateJobs(req, res) {
  try {
    const result = await jobService.getFilteredJobsForCandidate(req.params.slug, req.query);
    return res.status(200).json({
      success: true,
      data: result.jobs,
      facets: result.facets,
      count: result.count,
    });
  } catch (error) {
    console.error('Error in getCandidateJobs controller:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Internal Server Error',
    });
  }
}

/**
 * @route   GET /api/companies/:slug/jobs/recruiter
 * @desc    Recruiter table view of all company jobs (published & draft)
 */
async function getRecruiterJobs(req, res) {
  try {
    const jobs = await jobService.getRecruiterJobs(req.params.slug, req.query);
    return res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    console.error('Error in getRecruiterJobs controller:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Internal Server Error',
    });
  }
}

/**
 * @route   GET /api/companies/:slug/jobs/:job_slug
 * @desc    Get single job posting details for candidate page
 */
async function getJobBySlug(req, res) {
  try {
    const { company, job } = await jobService.getJobBySlug(req.params.slug, req.params.job_slug);
    return res.status(200).json({
      success: true,
      data: {
        company,
        job,
      },
    });
  } catch (error) {
    console.error('Error in getJobBySlug controller:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Internal Server Error',
    });
  }
}

/**
 * @route   POST /api/companies/:slug/jobs
 * @desc    Create a new job posting for a company
 */
async function createJob(req, res) {
  try {
    const job = await jobService.createJob(req.params.slug, req.body);
    return res.status(201).json({
      success: true,
      message: 'Job posting created successfully!',
      data: job,
    });
  } catch (error) {
    console.error('Error in createJob controller:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Failed to create job posting',
    });
  }
}

/**
 * @route   PUT /api/companies/:slug/jobs/:id OR /api/companies/jobs/:id
 * @desc    Update an existing job posting by ID
 */
async function updateJob(req, res) {
  try {
    const id = req.params.id;
    const job = await jobService.updateJob(id, req.body);
    return res.status(200).json({
      success: true,
      message: 'Job posting updated successfully!',
      data: job,
    });
  } catch (error) {
    console.error('Error in updateJob controller:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      error: 'Failed to update job: ' + error.message,
    });
  }
}

/**
 * @route   PATCH /api/companies/:slug/jobs/:id/status
 * @desc    Toggle job status (published / draft)
 */
async function toggleJobStatus(req, res) {
  try {
    const job = await jobService.toggleJobStatus(req.params.id, req.body.status);
    return res.status(200).json({
      success: true,
      message: `Job status updated to '${job.status}'!`,
      data: job,
    });
  } catch (error) {
    console.error('Error in toggleJobStatus controller:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      error: 'Failed to update job status: ' + error.message,
    });
  }
}

/**
 * @route   POST /api/companies/:slug/jobs/:id/duplicate
 * @desc    Duplicate an existing job posting
 */
async function duplicateJob(req, res) {
  try {
    const clone = await jobService.duplicateJob(req.params.id);
    return res.status(201).json({
      success: true,
      message: 'Job posting duplicated successfully!',
      data: clone,
    });
  } catch (error) {
    console.error('Error in duplicateJob controller:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      error: 'Failed to duplicate job: ' + error.message,
    });
  }
}

/**
 * @route   DELETE /api/companies/:slug/jobs/:id OR /api/companies/jobs/:id
 * @desc    Delete a job posting by ID
 */
async function deleteJob(req, res) {
  try {
    await jobService.deleteJob(req.params.id);
    return res.status(200).json({
      success: true,
      message: 'Job posting deleted successfully!',
    });
  } catch (error) {
    console.error('Error in deleteJob controller:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      error: 'Failed to delete job: ' + error.message,
    });
  }
}

/**
 * @route   POST /api/companies/:slug/jobs/bulk-status
 * @desc    Bulk update status for selected jobs
 */
async function bulkUpdateStatus(req, res) {
  try {
    const { jobIds, status } = req.body;
    const result = await jobService.bulkUpdateJobStatus(jobIds, status);
    return res.status(200).json({
      success: true,
      message: `Successfully updated ${result.modifiedCount} job(s) to '${status}'`,
      data: result,
    });
  } catch (error) {
    console.error('Error in bulkUpdateStatus controller:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      error: 'Bulk status update failed: ' + error.message,
    });
  }
}

/**
 * @route   POST /api/companies/:slug/jobs/bulk-delete
 * @desc    Bulk delete selected jobs
 */
async function bulkDelete(req, res) {
  try {
    const { jobIds } = req.body;
    const result = await jobService.bulkDeleteJobs(jobIds);
    return res.status(200).json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} job(s)`,
      data: result,
    });
  } catch (error) {
    console.error('Error in bulkDelete controller:', error);
    return res.status(error.statusCode || 500).json({
      success: false,
      error: 'Bulk delete failed: ' + error.message,
    });
  }
}

module.exports = {
  getCandidateJobs,
  getRecruiterJobs,
  getJobBySlug,
  createJob,
  updateJob,
  toggleJobStatus,
  duplicateJob,
  deleteJob,
  bulkUpdateStatus,
  bulkDelete,
};

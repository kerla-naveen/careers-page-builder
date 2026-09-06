const Job = require('../models/Job');
const Company = require('../models/Company');
const { generateUniqueJobSlug } = require('../utils/slugGenerator');

async function getFilteredJobsForCandidate(companySlug, query) {
  const cleanSlug = companySlug.toLowerCase();
  const company = await Company.findOne({ slug: cleanSlug });

  if (!company) {
    const error = new Error(`Company '${cleanSlug}' not found`);
    error.statusCode = 404;
    throw error;
  }

  const { search, department, work_policy, employment_type, experience_level, location } = query;

  const dbQuery = {
    companySlug: cleanSlug,
    status: { $ne: 'draft' },
  };

  if (search && search.trim()) {
    const regex = new RegExp(search.trim(), 'i');
    dbQuery.$or = [
      { title: regex },
      { department: regex },
      { location: regex },
      { description: regex },
    ];
  }

  if (department) {
    const depts = department.split(',').map((d) => d.trim()).filter(Boolean);
    if (depts.length > 0) dbQuery.department = { $in: depts };
  }

  if (work_policy) {
    const policies = work_policy.split(',').map((p) => p.trim()).filter(Boolean);
    if (policies.length > 0) dbQuery.work_policy = { $in: policies };
  }

  if (employment_type) {
    const types = employment_type.split(',').map((t) => t.trim()).filter(Boolean);
    if (types.length > 0) dbQuery.employment_type = { $in: types };
  }

  if (experience_level) {
    const levels = experience_level.split(',').map((l) => l.trim()).filter(Boolean);
    if (levels.length > 0) dbQuery.experience_level = { $in: levels };
  }

  if (location) {
    const locs = location.split(',').map((l) => l.trim()).filter(Boolean);
    if (locs.length > 0) dbQuery.location = { $in: locs };
  }

  const jobs = await Job.find(dbQuery).sort({ createdAt: -1 });

  const allCompanyJobs = await Job.find({ companySlug: cleanSlug, status: { $ne: 'draft' } });
  const facets = {
    department: [...new Set(allCompanyJobs.map((j) => j.department).filter(Boolean))],
    work_policy: [...new Set(allCompanyJobs.map((j) => j.work_policy).filter(Boolean))],
    employment_type: [...new Set(allCompanyJobs.map((j) => j.employment_type).filter(Boolean))],
    location: [...new Set(allCompanyJobs.map((j) => j.location).filter(Boolean))],
    experience_level: [...new Set(allCompanyJobs.map((j) => j.experience_level).filter(Boolean))],
  };

  return {
    jobs,
    facets,
    count: jobs.length,
  };
}

async function getRecruiterJobs(companySlug, query = {}) {
  const cleanSlug = companySlug.toLowerCase();
  const company = await Company.findOne({ slug: cleanSlug });

  if (!company) {
    const error = new Error(`Company '${cleanSlug}' not found`);
    error.statusCode = 404;
    throw error;
  }

  const { search, department, status } = query;
  const dbQuery = { companySlug: cleanSlug };

  if (search && search.trim()) {
    const regex = new RegExp(search.trim(), 'i');
    dbQuery.$or = [{ title: regex }, { department: regex }, { location: regex }];
  }

  if (department && department !== 'All') {
    dbQuery.department = department;
  }

  if (status && status !== 'All') {
    dbQuery.status = status.toLowerCase();
  }

  const jobs = await Job.find(dbQuery).sort({ createdAt: -1 });
  return jobs;
}

async function getJobBySlug(companySlug, jobSlug) {
  const cleanCompSlug = companySlug.toLowerCase();
  const cleanJobSlug = jobSlug.toLowerCase();

  const company = await Company.findOne({ slug: cleanCompSlug });
  if (!company) {
    const error = new Error(`Company '${cleanCompSlug}' not found`);
    error.statusCode = 404;
    throw error;
  }

  const job = await Job.findOne({ companySlug: cleanCompSlug, job_slug: cleanJobSlug });
  if (!job) {
    const error = new Error(`Job position '${cleanJobSlug}' not found for company '${cleanCompSlug}'`);
    error.statusCode = 404;
    throw error;
  }

  return { company, job };
}

async function createJob(companySlug, jobData) {
  const cleanSlug = companySlug.toLowerCase();
  const company = await Company.findOne({ slug: cleanSlug });

  if (!company) {
    const error = new Error(`Company '${cleanSlug}' not found`);
    error.statusCode = 404;
    throw error;
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
    status,
  } = jobData;

  if (!title || !description) {
    const error = new Error('Job Title and Description are required fields');
    error.statusCode = 400;
    throw error;
  }

  const job_slug = await generateUniqueJobSlug(title, cleanSlug);

  const job = await Job.create({
    companyId: company._id,
    companySlug: cleanSlug,
    title: title.trim(),
    job_slug,
    department: department || 'Engineering',
    location: location || 'Remote',
    work_policy: work_policy || 'Hybrid',
    employment_type: employment_type || 'Full time',
    experience_level: experience_level || 'Mid-level',
    job_type: job_type || 'Permanent',
    salary_range: salary_range || 'Competitive',
    posted_days_ago: posted_days_ago !== undefined ? posted_days_ago : 0,
    description,
    requirements: requirements || '',
    status: status || 'published',
  });

  return job;
}

async function updateJob(id, updateData) {
  const job = await Job.findById(id);
  if (!job) {
    const error = new Error('Job posting not found');
    error.statusCode = 404;
    throw error;
  }

  const allowedFields = [
    'title',
    'department',
    'location',
    'work_policy',
    'employment_type',
    'experience_level',
    'job_type',
    'salary_range',
    'posted_days_ago',
    'description',
    'requirements',
    'status',
  ];

  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      job[field] = updateData[field];
    }
  });

  await job.save();
  return job;
}

async function toggleJobStatus(id, status) {
  const job = await Job.findById(id);
  if (!job) {
    const error = new Error('Job posting not found');
    error.statusCode = 404;
    throw error;
  }

  job.status = status || (job.status === 'published' ? 'draft' : 'published');
  await job.save();
  return job;
}

async function duplicateJob(id) {
  const original = await Job.findById(id);
  if (!original) {
    const error = new Error('Original job posting not found');
    error.statusCode = 404;
    throw error;
  }

  const newTitle = `${original.title} (Copy)`;
  const newSlug = await generateUniqueJobSlug(newTitle, original.companySlug);

  const clone = await Job.create({
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
    posted_days_ago: 0,
    description: original.description,
    requirements: original.requirements,
    status: 'draft',
  });

  return clone;
}

async function deleteJob(id) {
  const result = await Job.findByIdAndDelete(id);
  if (!result) {
    const error = new Error('Job posting not found');
    error.statusCode = 404;
    throw error;
  }
  return true;
}

async function bulkUpdateJobStatus(jobIds, status) {
  if (!Array.isArray(jobIds) || jobIds.length === 0) {
    const error = new Error('Please provide an array of jobIds to update');
    error.statusCode = 400;
    throw error;
  }

  const result = await Job.updateMany(
    { _id: { $in: jobIds } },
    { $set: { status: status.toLowerCase() } }
  );

  return result;
}

async function bulkDeleteJobs(jobIds) {
  if (!Array.isArray(jobIds) || jobIds.length === 0) {
    const error = new Error('Please provide an array of jobIds to delete');
    error.statusCode = 400;
    throw error;
  }

  const result = await Job.deleteMany({ _id: { $in: jobIds } });
  return result;
}

module.exports = {
  getFilteredJobsForCandidate,
  getRecruiterJobs,
  getJobBySlug,
  createJob,
  updateJob,
  toggleJobStatus,
  duplicateJob,
  deleteJob,
  bulkUpdateJobStatus,
  bulkDeleteJobs,
};

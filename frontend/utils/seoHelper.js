/**
 * Generates Schema.org JSON-LD object for Organization (Company)
 */
export function generateCompanySchema(company, jobs = []) {
  if (!company) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company.name,
    url: company.website || `https://careers.example.com/companies/${company.slug}`,
    logo: company.logoUrl,
    description: company.description,
    sameAs: company.website ? [company.website] : [],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${company.name} Careers & Open Opportunities`,
      itemListElement: jobs.map((job, idx) => ({
        '@type': 'OfferCatalogItem',
        position: idx + 1,
        item: {
          '@type': 'JobPosting',
          title: job.title,
          description: job.description || `Career opportunity for ${job.title} at ${company.name}`,
          employmentType: formatEmploymentType(job.employment_type),
          jobLocation: {
            '@type': 'Place',
            address: {
              '@type': 'PostalAddress',
              addressLocality: job.location || 'Remote',
            },
          },
        },
      })),
    },
  };
}

/**
 * Generates ItemList of Schema.org JobPosting objects for Jobs Page
 */
export function generateJobListSchema(company, jobs = []) {
  if (!company) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Open Job Positions at ${company.name}`,
    numberOfItems: jobs.length,
    itemListElement: jobs.map((job, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: generateSingleJobSchema(company, job),
    })),
  };
}

/**
 * Generates Schema.org JobPosting object for an individual job
 */
export function generateSingleJobSchema(company, job) {
  if (!job) return null;

  const schema = {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description || `<p>Open position for ${job.title} at ${company.name}.</p>`,
    identifier: {
      '@type': 'PropertyValue',
      name: company.name,
      value: job._id || job.job_slug,
    },
    datePosted: job.createdAt ? new Date(job.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    employmentType: formatEmploymentType(job.employment_type),
    hiringOrganization: {
      '@type': 'Organization',
      name: company.name,
      sameAs: company.website || undefined,
      logo: company.logoUrl,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location || 'Remote',
      },
    },
  };

  if (job.work_policy && job.work_policy.toLowerCase() === 'remote') {
    schema.jobLocationType = 'TELECOMMUTE';
  }

  if (job.salary_range) {
    schema.baseSalary = {
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: {
        '@type': 'QuantitativeValue',
        unitText: 'YEAR',
        value: job.salary_range,
      },
    };
  }

  return schema;
}

/**
 * Helper to map employment type strings to Schema.org standard constants
 */
function formatEmploymentType(type) {
  if (!type) return 'FULL_TIME';
  const lower = type.toLowerCase();
  if (lower.includes('part')) return 'PART_TIME';
  if (lower.includes('contract')) return 'CONTRACTOR';
  if (lower.includes('intern')) return 'INTERN';
  if (lower.includes('temp')) return 'TEMPORARY';
  return 'FULL_TIME';
}

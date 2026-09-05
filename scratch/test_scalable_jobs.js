const http = require('http');

function request(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTests() {
  console.log('=== STARTING SCALABLE JOBS SYSTEM VERIFICATION ===\n');

  // Step 1: Register test recruiter
  const randomStr = Math.random().toString(36).substring(7);
  const companyName = `Scalable Corp ${randomStr}`;
  const companySlug = `scalable-corp-${randomStr}`;
  const email = `recruiter_${randomStr}@scalable.com`;
  const password = 'password123';

  console.log(`1. Registering recruiter ${email} for company '${companyName}' (${companySlug})...`);
  const regRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/register',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    name: 'Recruiter Lead',
    email,
    password,
    companyName,
  });

  if (regRes.status !== 201 || !regRes.body.token) {
    console.error('❌ Registration failed:', regRes.body);
    process.exit(1);
  }
  const token = regRes.body.token;
  console.log('✓ Recruiter registered successfully. Token acquired.\n');

  // Step 2: Seed 105 jobs across multiple departments & statuses
  console.log('2. Seeding 105 jobs into the company inventory...');
  const departments = ['Engineering', 'Product', 'Design', 'Marketing', 'Data', 'Sales'];
  const locations = ['Hyderabad', 'Bangalore', 'Mumbai', 'Remote', 'London', 'New York'];
  const statuses = ['DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED'];

  const createdJobIds = [];
  for (let i = 1; i <= 105; i++) {
    const dept = departments[i % departments.length];
    const loc = locations[i % locations.length];
    const status = statuses[i % statuses.length];
    const title = `Role ${i} - ${dept} ${status === 'PUBLISHED' ? 'Specialist' : 'Lead'}`;

    const createRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/companies/${companySlug}/jobs`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    }, {
      title,
      department: dept,
      location: loc,
      work_policy: i % 2 === 0 ? 'Remote' : 'Hybrid',
      employment_type: 'Full time',
      status,
      description: `Job description for ${title} in ${loc}`
    });

    if (createRes.status === 201 && createRes.body.data) {
      createdJobIds.push(createRes.body.data._id);
    }
  }
  console.log(`✓ Seeded ${createdJobIds.length} jobs successfully.\n`);

  // Step 3: Test Recruiter Paginated API
  console.log('3. Testing GET /api/companies/:slug/jobs/recruiter pagination & total counts...');
  const page1Res = await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/companies/${companySlug}/jobs/recruiter?page=1&limit=10`,
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  });

  if (page1Res.status !== 200 || !page1Res.body.success) {
    console.error('❌ Recruiter GET failed:', page1Res.body);
    process.exit(1);
  }

  const { totalJobs, totalPages, data: page1Jobs, statusCounts } = page1Res.body;
  console.log(`✓ Recruiter API returned: totalJobs=${totalJobs}, totalPages=${totalPages}, page1Count=${page1Jobs.length}`);
  console.log(`✓ Status counts breakdown:`, statusCounts);

  if (totalJobs !== 105 || totalPages !== 11 || page1Jobs.length !== 10) {
    console.error('❌ Pagination math mismatch!');
    process.exit(1);
  }

  // Step 4: Test Search & Filtering
  console.log('\n4. Testing search & status filtering...');
  const filterRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/companies/${companySlug}/jobs/recruiter?status=PUBLISHED&department=Engineering`,
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  });

  console.log(`✓ Filtered PUBLISHED + Engineering jobs count: ${filterRes.body.totalJobs}`);

  // Step 5: Test Bulk Status Change
  console.log('\n5. Testing bulk status change (Publishing first 5 jobs)...');
  const targetIds = createdJobIds.slice(0, 5);
  const bulkRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/companies/${companySlug}/jobs/bulk-status`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  }, {
    jobIds: targetIds,
    status: 'PUBLISHED'
  });

  if (bulkRes.status !== 200 || !bulkRes.body.success) {
    console.error('❌ Bulk status update failed:', bulkRes.body);
    process.exit(1);
  }
  console.log(`✓ Bulk status update success: modified ${bulkRes.body.modifiedCount} jobs.`);

  // Step 6: Test Job Duplication
  console.log('\n6. Testing single job duplication...');
  const dupRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/companies/${companySlug}/jobs/${createdJobIds[0]}/duplicate`,
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });

  if (dupRes.status !== 201 || !dupRes.body.success) {
    console.error('❌ Duplication failed:', dupRes.body);
    process.exit(1);
  }
  console.log(`✓ Duplicated job created: '${dupRes.body.data.title}' (Status: ${dupRes.body.data.status})`);

  // Step 7: Test Bulk Deletion
  console.log('\n7. Testing bulk deletion (Deleting 3 jobs)...');
  const deleteIds = createdJobIds.slice(10, 13);
  const deleteRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/companies/${companySlug}/jobs/bulk-delete`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  }, {
    jobIds: deleteIds
  });

  if (deleteRes.status !== 200 || !deleteRes.body.success) {
    console.error('❌ Bulk delete failed:', deleteRes.body);
    process.exit(1);
  }
  console.log(`✓ Bulk delete success: deleted ${deleteRes.body.deletedCount} jobs.`);

  // Step 8: Test Public Candidate Scoping (Only PUBLISHED returned)
  console.log('\n8. Testing public candidate API scoping (GET /api/companies/:slug/jobs)...');
  const candidateRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/companies/${companySlug}/jobs`,
    method: 'GET'
  });

  if (candidateRes.status !== 200 || !candidateRes.body.success) {
    console.error('❌ Candidate API failed:', candidateRes.body);
    process.exit(1);
  }

  const candidateJobs = candidateRes.body.data;
  console.log(`✓ Candidate API returned ${candidateJobs.length} jobs.`);
  const nonPublished = candidateJobs.filter(j => j.status !== 'PUBLISHED');

  if (nonPublished.length > 0) {
    console.error('❌ SECURITY FAILURE: Candidate API returned non-published jobs!', nonPublished);
    process.exit(1);
  }
  console.log('✓ Candidate view strictly enforces status: PUBLISHED.\n');

  console.log('=== ALL SCALABLE JOBS SYSTEM TESTS PASSED SUCCESSFULLY! ===');
}

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});

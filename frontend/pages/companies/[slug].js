import React from 'react';

export default function CompanyPage({ company, jobs, error }) {
  if (error) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <h1>Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>SSR Fetch Test for: {company?.name}</h1>
      <p>This page fetched data from the backend via <code>getServerSideProps</code>.</p>
      
      <h2>Company Raw JSON</h2>
      <pre style={{ background: '#f4f4f4', padding: '1rem', overflowX: 'auto' }}>
        {JSON.stringify(company, null, 2)}
      </pre>

      <h2>Jobs Raw JSON ({jobs?.length || 0})</h2>
      <pre style={{ background: '#f4f4f4', padding: '1rem', overflowX: 'auto' }}>
        {JSON.stringify(jobs, null, 2)}
      </pre>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { slug } = context.params;

  try {
    // Fetch company details
    const companyRes = await fetch(`http://127.0.0.1:5000/companies/${slug}`);
    const companyData = await companyRes.json();

    if (!companyRes.ok || !companyData.success) {
      return {
        props: {
          error: companyData.error || 'Failed to fetch company',
        },
      };
    }

    // Fetch jobs for the company
    const jobsRes = await fetch(`http://127.0.0.1:5000/companies/${slug}/jobs`);
    const jobsData = await jobsRes.json();

    return {
      props: {
        company: companyData.data,
        jobs: jobsData.data || [],
      },
    };
  } catch (err) {
    console.error('Error fetching data:', err);
    return {
      props: {
        error: 'Failed to fetch data from backend. Is the server running on port 5000?',
      },
    };
  }
}

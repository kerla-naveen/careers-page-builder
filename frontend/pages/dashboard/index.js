import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function DashboardIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/workable');
  }, [router]);

  return (
    <div style={{ background: '#090d16', color: '#f8fafc', minHeight: '100vh', padding: '4rem', textAlign: 'center' }}>
      <p>Redirecting to Recruiter Studio...</p>
    </div>
  );
}

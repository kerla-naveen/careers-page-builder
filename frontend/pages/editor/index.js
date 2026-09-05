import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function EditorIndex() {
  const router = useRouter();

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/companies')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.length > 0) {
          router.replace(`/editor/${data.data[0].slug}`);
        } else {
          router.replace('/dashboard');
        }
      })
      .catch(() => router.replace('/dashboard'));
  }, [router]);

  return null;
}

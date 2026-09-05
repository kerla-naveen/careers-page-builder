import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';

export default function EditorIndex() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (user && user.company && user.company.slug) {
      router.replace(`/editor/${user.company.slug}`);
    } else {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  return null;
}

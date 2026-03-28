'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// /view with no domain just shows the full store browser
// We reuse the same view/[domain] page logic by redirecting to a neutral state
export default function ViewIndex() {
  const router = useRouter();
  useEffect(() => {
    // redirect to a placeholder that shows all stores
    router.replace('/view/all');
  }, []);
  return null;
}

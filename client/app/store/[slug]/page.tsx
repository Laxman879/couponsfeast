'use client';
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getStoreBySlug } from '@/services/api';

export default function StorePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  useEffect(() => {
    getStoreBySlug(slug).then(res => {
      const store = res.data;
      const domain = store.websiteUrl
        ? store.websiteUrl.replace(/https?:\/\/(www\.)?/, '').replace(/\/$/, '')
        : `${store.slug}.com`;
      router.replace(`/view/${domain}`);
    }).catch(() => router.replace('/stores'));
  }, [slug, router]);

  return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Redirecting...</p></div>;
}

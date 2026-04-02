import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://couponsfeast.com';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function fetchJSON(url: string) {
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json();
    return data?.data ?? data ?? [];
  } catch { return []; }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [stores, categories, pages] = await Promise.all([
    fetchJSON(`${API_URL}/public/stores/list`),
    fetchJSON(`${API_URL}/public/categories/list`),
    fetchJSON(`${API_URL}/admin/pages`),
  ]);

  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1 },
    { url: `${BASE_URL}/stores`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${BASE_URL}/category`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${BASE_URL}/deals`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
  ];

  const storePages = (Array.isArray(stores) ? stores : []).map((s: any) => ({
    url: `${BASE_URL}/coupons/${s.slug}-coupons`,
    lastModified: new Date(s.updatedAt || Date.now()),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  const categoryPages = (Array.isArray(categories) ? categories : []).map((c: any) => ({
    url: `${BASE_URL}/coupons/${c.slug}-coupons`,
    lastModified: new Date(c.updatedAt || Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const dynamicPages = (Array.isArray(pages) ? pages : [])
    .filter((p: any) => p.isActive && p.slug !== 'home')
    .map((p: any) => ({
      url: `${BASE_URL}/${p.slug}`,
      lastModified: new Date(p.updatedAt || Date.now()),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }));

  return [...staticPages, ...storePages, ...categoryPages, ...dynamicPages];
}

'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCategories } from '@/services/api';
import { useDynamicTheme } from '@/components/DynamicThemeProvider';
import { useTheme } from '@/components/ThemeProvider';

interface Category { _id: string; name: string; slug: string; color: string; icon?: string; description: string; }

export default function Categories({ title = 'Browse by Category', limit = 8 }: { title?: string; limit?: number }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { siteConfig, darkPalette } = useDynamicTheme();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const primary = siteConfig?.theme?.primaryColor || '#7c3aed';
  const sectionBg = isDark ? darkPalette.cardBg : '#ffffff';
  const titleColor = isDark ? darkPalette.text : '#111827';
  const cardBg = isDark ? darkPalette.cardBg : '#f9fafb';
  const cardText = isDark ? darkPalette.text : '#374151';
  const skeletonBg = isDark ? darkPalette.cardBg : '#e5e7eb';

  useEffect(() => {
    getCategories()
      .then(res => {
        const data = res.data?.data ?? res.data;
        setCategories(Array.isArray(data) ? data.slice(0, limit) : []);
      })
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, [limit]);

  if (loading) return (
    <section className="py-10 px-4 sm:px-6" style={{ backgroundColor: sectionBg }}>
      <div className="max-w-7xl mx-auto">
        <div className="h-6 w-48 animate-pulse rounded mb-6" style={{ backgroundColor: skeletonBg }} />
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {Array.from({ length: limit }).map((_, i) => <div key={i} className="h-24 animate-pulse rounded-xl" style={{ backgroundColor: skeletonBg }} />)}
        </div>
      </div>
    </section>
  );

  if (!categories.length) return null;

  return (
    <section className="py-10 px-4 sm:px-6" style={{ backgroundColor: sectionBg }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 rounded-full" style={{ backgroundColor: primary }} />
          <h2 className="text-xl font-bold" style={{ color: titleColor }}>{title}</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.map(cat => (
            <Link key={cat._id} href={`/category/${cat.slug}`} className="no-underline group">
              <div
                className="flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 text-center h-24"
                style={{ backgroundColor: cardBg, borderColor: `${primary}30` }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = `${primary}20`)}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = cardBg)}
              >
                <span className="text-2xl mb-1">{cat.icon || '🏷️'}</span>
                <span className="text-xs font-semibold leading-tight line-clamp-2" style={{ color: cardText }}>{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

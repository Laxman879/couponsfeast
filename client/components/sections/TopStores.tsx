'use client';
import { useEffect, useState } from 'react';
import { getStores } from '@/services/api';
import { useDynamicTheme } from '@/components/DynamicThemeProvider';
import { useTheme } from '@/components/ThemeProvider';
import StoreCard from '@/components/store/StoreCard';

export default function TopStores({ title = 'Shop at Top Stores', limit = 6 }: { title?: string; limit?: number }) {
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { siteConfig, darkPalette } = useDynamicTheme();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const primary = siteConfig?.theme?.primaryColor || '#7c3aed';
  const sectionBg = isDark ? darkPalette.cardBg : '#ffffff';
  const titleColor = isDark ? darkPalette.text : '#111827';
  const skeletonBg = isDark ? darkPalette.cardBg : '#e5e7eb';

  useEffect(() => {
    getStores()
      .then(res => {
        const data = res.data?.data ?? res.data;
        setStores(Array.isArray(data) ? data.slice(0, limit) : []);
      })
      .catch(() => setStores([]))
      .finally(() => setLoading(false));
  }, [limit]);

  return (
    <section className="py-10 px-4 sm:px-6" style={{ backgroundColor: sectionBg }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 rounded-full" style={{ backgroundColor: primary }} />
          <h2 className="text-xl font-bold" style={{ color: titleColor }}>{title}</h2>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-xl" style={{ backgroundColor: skeletonBg }} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {stores.map(store => <StoreCard key={store._id} store={store} />)}
          </div>
        )}
      </div>
    </section>
  );
}

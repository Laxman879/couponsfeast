'use client';
import { useEffect, useState } from 'react';
import { getCoupons } from '@/services/api';
import { useDynamicTheme } from '@/components/DynamicThemeProvider';
import { useTheme } from '@/components/ThemeProvider';
import CouponCard from '@/components/coupon/CouponCard';

export default function TrendingCoupons({ title = 'Trending Deals Right Now', limit = 8 }: { title?: string; limit?: number }) {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { siteConfig, darkPalette } = useDynamicTheme();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const primary = siteConfig?.theme?.primaryColor || '#7c3aed';
  const sectionBg = isDark ? darkPalette.bg : `${primary}08`;
  const titleColor = isDark ? darkPalette.text : '#111827';
  const skeletonBg = isDark ? darkPalette.cardBg : '#e5e7eb';

  useEffect(() => {
    getCoupons({ limit })
      .then(res => {
        const data = res.data?.data ?? res.data;
        setCoupons(Array.isArray(data) ? data : []);
      })
      .catch(() => setCoupons([]))
      .finally(() => setLoading(false));
  }, [limit]);

  return (
    <section  className="py-10 px-4 sm:px-6" style={{ backgroundColor: sectionBg }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 rounded-full" style={{ backgroundColor: primary }} />
          <h2 className="text-xl font-bold" style={{ color: titleColor }}>{title}</h2>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="h-48 animate-pulse rounded-xl" style={{ backgroundColor: skeletonBg }} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {coupons.map(coupon => <CouponCard key={coupon._id} coupon={coupon} />)}
          </div>
        )}
      </div>
    </section>
  );
}

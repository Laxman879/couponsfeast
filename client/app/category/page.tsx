'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCategories, getCoupons } from '@/services/api';
import { useDynamicTheme } from '@/components/DynamicThemeProvider';
import { useTheme } from '@/components/ThemeProvider';
import { Tag, ChevronRight, Search } from 'lucide-react';
import FAQSection from '@/components/store/FAQSection';

interface Category {
  _id: string;
  name: string;
  slug: string;
  color: string;
  icon?: string;
  description?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [couponCounts, setCouponCounts] = useState<Record<string, number>>({});
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { siteConfig } = useDynamicTheme();
  const { theme } = useTheme();

  const isDark = theme === 'dark';
  const primary = siteConfig?.theme?.primaryColor || '#7c3aed';
  const pageBg = isDark ? '#111827' : '#f8fafc';
  const cardBg = isDark ? '#1f2937' : '#ffffff';
  const textPrimary = isDark ? '#f9fafb' : '#0f172a';
  const textSecondary = isDark ? '#9ca3af' : '#64748b';
  const borderColor = isDark ? '#374151' : '#e2e8f0';

  useEffect(() => {
    const load = async () => {
      try {
        const [catRes, couponRes] = await Promise.all([getCategories(), getCoupons()]);
        const cats: Category[] = catRes.data?.data ?? catRes.data ?? [];
        setCategories(cats);

        // Count coupons per category
        const coupons = couponRes.data?.data ?? couponRes.data ?? [];
        const counts: Record<string, number> = {};
        coupons.forEach((c: any) => {
          const cat = c.category?.slug || c.category;
          if (cat) counts[cat] = (counts[cat] || 0) + 1;
        });
        setCouponCounts(counts);
      } catch {
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const iconList = ['🛍️','💻','👗','🏠','🍔','✈️','💄','📱','🎮','🏋️','📚','🚗','💊','🎁','🌿','👶'];

  return (
    <div style={{ backgroundColor: pageBg, minHeight: '100vh' }}>

      {/* ── Hero Banner ── */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${primary}ee 0%, ${primary}99 50%, ${primary}cc 100%)`,
          minHeight: 220,
        }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
                              radial-gradient(circle at 80% 20%, white 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Floating icons decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {['🛍️','💻','👗','🏠','🍔','✈️','💄','📱'].map((icon, i) => (
            <span
              key={i}
              className="absolute text-2xl opacity-20 select-none"
              style={{
                top: `${10 + (i * 11) % 70}%`,
                left: `${5 + (i * 13) % 90}%`,
                transform: `rotate(${i % 2 === 0 ? '-15deg' : '15deg'})`,
              }}
            >
              {icon}
            </span>
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 flex flex-col items-center text-center">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/70 text-sm mb-4">
            <Link href="/" className="no-underline text-white/70 hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white font-medium">Categories</span>
          </div>

          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-white/20 backdrop-blur-sm">
            <Tag size={26} className="text-white" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 leading-tight">
            Browse All Categories
          </h1>
          <p className="text-white/80 text-base sm:text-lg max-w-xl mb-8">
            Explore {categories.length}+ categories and find the best coupons & deals for everything you love
          </p>

          {/* Search bar */}
          <div className="relative w-full max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm font-medium outline-none shadow-lg"
              style={{ background: '#fff', color: '#0f172a' }}
            />
          </div>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div
        className="border-b"
        style={{ background: cardBg, borderColor }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: primary }} />
            <span className="text-sm font-semibold" style={{ color: textPrimary }}>
              {filtered.length} Categories
            </span>
          </div>
          <span className="text-sm" style={{ color: textSecondary }}>
            Find coupons across all product categories
          </span>
        </div>
      </div>

      {/* ── Category Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-32 rounded-2xl animate-pulse" style={{ background: isDark ? '#374151' : '#e2e8f0' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: `${primary}15` }}>
              <Tag size={28} style={{ color: primary }} />
            </div>
            <p className="font-semibold text-lg" style={{ color: textPrimary }}>No categories found</p>
            <p className="text-sm" style={{ color: textSecondary }}>Try a different search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filtered.map((cat, i) => {
              const count = couponCounts[cat.slug] || 0;
              const icon = cat.icon || iconList[i % iconList.length];
              return (
                <Link
                  key={cat._id}
                  href={`/category/${cat.slug}`}
                  className="no-underline group"
                >
                  <div
                    className="flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-200 text-center h-32 cursor-pointer hover:-translate-y-1 hover:shadow-lg"
                    style={{
                      background: cardBg,
                      borderColor,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = primary;
                      e.currentTarget.style.background = `${primary}0d`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = borderColor;
                      e.currentTarget.style.background = cardBg;
                    }}
                  >
                    <span className="text-3xl mb-2 group-hover:scale-110 transition-transform inline-block">
                      {icon}
                    </span>
                    <span className="text-xs font-bold leading-tight line-clamp-2 mb-1" style={{ color: textPrimary }}>
                      {cat.name}
                    </span>
                    {count > 0 && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1"
                        style={{ background: `${primary}15`, color: primary }}>
                        {count} deals
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <FAQSection heading="Categories - Frequently Asked Questions" pageType="category" />
      </div>
    </div>
  );
}

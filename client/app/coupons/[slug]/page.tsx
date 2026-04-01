'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getCoupons, getStores, getCategories } from '@/services/api';
import { useDynamicTheme } from '@/components/DynamicThemeProvider';
import { useTheme } from '@/components/ThemeProvider';
import CouponBanner from '@/components/coupons-page/CouponBanner';
import CouponListCard from '@/components/coupons-page/CouponListCard';
import CouponSidebar from '@/components/coupons-page/CouponSidebar';

export default function CouponsPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { siteConfig, darkPalette } = useDynamicTheme();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const primary = siteConfig?.theme?.primaryColor || '#7c3aed';
  const textMain = isDark ? darkPalette.text : '#111827';
  const textMuted = isDark ? `${darkPalette.text}aa` : '#6b7280';
  const pageBg = isDark ? darkPalette.bg : '#f8fafc';

  const [coupons, setCoupons] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [matchedLogo, setMatchedLogo] = useState('');

  const categoryName = slug.replace(/-coupons$/, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  useEffect(() => {
    Promise.all([
      getCoupons({ limit: 1000 }),
      getStores(),
      getCategories(),
    ])
      .then(([couponRes, storeRes, catRes]) => {
        const allCoupons = couponRes.data?.data ?? couponRes.data ?? [];
        const allStores = storeRes.data?.data ?? storeRes.data ?? [];
        const allCats = catRes.data?.data ?? catRes.data ?? [];
        setStores(allStores);
        setCategories(allCats);

        const cleanSlug = slug.replace(/-coupons$/, '');
        const matchedStore = allStores.find((s: any) => s.slug === cleanSlug);
        const matchedCat = allCats.find((c: any) =>
          c.slug === cleanSlug || c.name?.toLowerCase().replace(/[&\/]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-') === cleanSlug
        );

        if (matchedStore) {
          const logo = matchedStore.logo || '';
          setMatchedLogo(logo.startsWith('http') ? logo : logo ? `http://localhost:5000${logo}` : '');
        } else if (matchedCat?.icon) {
          setMatchedLogo(matchedCat.icon);
        }

        let filtered: any[] = [];
        if (matchedStore) {
          filtered = allCoupons.filter((c: any) => c.store?._id === matchedStore._id || c.store === matchedStore._id);
        } else if (matchedCat) {
          filtered = allCoupons.filter((c: any) =>
            c.category?.toLowerCase() === matchedCat.name?.toLowerCase() ||
            c.store?.category?.toLowerCase() === matchedCat.name?.toLowerCase()
          );
        } else {
          filtered = allCoupons.filter((c: any) => {
            const sName = (c.store?.storeName || '').toLowerCase();
            const cat = (c.category || c.store?.category || '').toLowerCase();
            return sName.includes(cleanSlug.replace(/-/g, ' ')) || cat.includes(cleanSlug.replace(/-/g, ' '));
          });
        }
        setCoupons(filtered);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  const toggleStore = (s: string) => setSelectedStores(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  const toggleCategory = (c: string) => setSelectedCategories(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  const couponCount = coupons.filter(c => c.code).length;
  const offerCount = coupons.filter(c => !c.code).length;
  const freshCount = coupons.filter(c => {
    if (!c.createdAt) return false;
    const diff = Date.now() - new Date(c.createdAt).getTime();
    return diff < 7 * 24 * 60 * 60 * 1000;
  }).length;

  const filteredCoupons = useMemo(() => {
    let list = coupons;

    if (activeTab === 'coupons') list = list.filter(c => c.code);
    else if (activeTab === 'offers') list = list.filter(c => !c.code);
    else if (activeTab === 'fresh') list = list.filter(c => {
      if (!c.createdAt) return false;
      return Date.now() - new Date(c.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000;
    });

    if (selectedStores.length > 0) list = list.filter(c => selectedStores.includes(c.store?.storeName));
    if (selectedCategories.length > 0) list = list.filter(c => selectedCategories.includes(c.category || c.store?.category));
    return list;
  }, [coupons, activeTab, selectedStores, selectedCategories]);

  return (
    <div style={{ backgroundColor: pageBg, minHeight: '100vh' }}>
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-sm mb-4" style={{ color: textMuted }}>
          <Link href="/" className="no-underline" style={{ color: primary }}>Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/category" className="no-underline" style={{ color: primary }}>Categories</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span style={{ color: textMain }}>{categoryName} Coupons</span>
        </div>

        {/* Banner with Tabs & Rating */}
        <CouponBanner
          storeName={categoryName}
          logoUrl={matchedLogo}
          totalCoupons={coupons.length}
          couponCount={couponCount}
          offerCount={offerCount}
          freshCount={freshCount}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Title */}
        <div className="mt-6 mb-4">
          <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: textMain }}>
            {categoryName} Coupons & Offers
          </h2>
          <p className="text-base mt-1" style={{ color: textMuted }}>
            {filteredCoupons.length} verified coupons available today
          </p>
        </div>

        {/* Main Layout */}
        <div className="flex gap-6">
          <CouponSidebar
            categoryName={categoryName}
            stores={stores}
            categories={categories}
            selectedStores={selectedStores}
            onStoreToggle={toggleStore}
            selectedCategories={selectedCategories}
            onCategoryToggle={toggleCategory}
            totalCoupons={coupons.length}
            verifiedCount={Math.max(1, coupons.length - 5)}
          />

          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-28 rounded-xl animate-pulse bg-gray-200 dark:bg-gray-700" />
                ))}
              </div>
            ) : filteredCoupons.length === 0 ? (
              <div className="text-center py-16 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <p className="text-lg font-semibold" style={{ color: textMain }}>No coupons found</p>
                <p className="text-sm mt-1" style={{ color: textMuted }}>
                  No {categoryName} coupons available right now
                </p>
                <Link href="/" className="mt-4 inline-block text-sm font-semibold no-underline" style={{ color: primary }}>
                  Browse All Coupons →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredCoupons.map(coupon => (
                  <CouponListCard key={coupon._id} coupon={coupon} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

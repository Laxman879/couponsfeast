'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getStores, getCoupons, getSiteConfig } from '@/services/api';
import { useDynamicTheme } from '@/components/DynamicThemeProvider';
import { useTheme } from '@/components/ThemeProvider';
import { ChevronRight } from 'lucide-react';
import PageHeader from '@/components/store/PageHeader';
import CouponCard from '@/components/coupon/CouponCard';
import Sidebar from '@/components/store/Sidebar';
import PromoCodeInfo from '@/components/store/PromoCodeInfo';
import StoreInfo from '@/components/store/StoreInfo';
import AboutSection from '@/components/store/AboutSection';
import FAQSection from '@/components/store/FAQSection';

interface Store {
  _id: string; storeName: string; slug: string; logo?: string;
  websiteUrl?: string; description?: string; category?: string;
  logoBgColor?: string; customDate?: string;
  promoInfo?: any; storeInfo?: any; aboutSection?: any;
  sidebarData?: any;
}
interface Coupon {
  _id: string; title: string; code?: string; discount?: string;
  description?: string; store: any; expiryDate?: string;
  type?: 'code' | 'sale' | 'cashback' | 'freeshipping';
  labelType?: string; interestedUsers?: number;
  limitedTime?: boolean; expiringToday?: boolean;
  addedBy?: string; exclusive?: boolean; details?: string;
}

export default function StorePage() {
  const params = useParams();
  const domain = params?.domain as string;
  const { siteConfig, darkPalette } = useDynamicTheme();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const primary = siteConfig?.theme?.primaryColor || '#7c3aed';

  const [store, setStore] = useState<Store | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [similarStores, setSimilarStores] = useState<Store[]>([]);
  const [popularStores, setPopularStores] = useState<Store[]>([]);
  const [faqs, setFaqs] = useState<{ heading: string; showOn: string; items: any[] }>({ heading: '', showOn: 'both', items: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [storeRes, couponRes, cfgRes] = await Promise.all([
          getStores(), getCoupons({ limit: 1000 }), getSiteConfig()
        ]);
        const stores: Store[] = storeRes.data?.data ?? storeRes.data ?? [];
        const allCoupons: Coupon[] = couponRes.data?.data ?? couponRes.data ?? [];
        setFaqs({ heading: cfgRes.data?.faqs?.heading || '', showOn: cfgRes.data?.faqs?.showOn || 'both', items: cfgRes.data?.faqs?.items || [] });

        const matched = stores.find((s: Store) =>
          s.websiteUrl?.replace(/https?:\/\/(www\.)?/, '').replace(/\/$/, '') === domain ||
          `${s.slug}.com` === domain ||
          s.slug === domain?.replace('.com', '')
        );
        setStore(matched || null);

        if (matched) {
          const storeCoupons = allCoupons.filter(c => c.store?._id === matched._id || c.store === matched._id);
          storeCoupons.sort((a, b) => (a.type === 'cashback' ? -1 : 0) - (b.type === 'cashback' ? -1 : 0));
          setCoupons(storeCoupons);
          const similar = stores.filter((s: Store) =>
            s._id !== matched._id &&
            s.category?.toLowerCase() === matched.category?.toLowerCase()
          ).slice(0, 8);
          setSimilarStores(similar);
          setPopularStores(stores.filter((s: Store) => s._id !== matched._id).slice(0, 8));
        }
      } catch { }
      finally { setLoading(false); }
    };
    load();
  }, [domain]);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse space-y-4">
      <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      <div className="flex gap-8">
        <div className="w-64 h-96 bg-gray-200 dark:bg-gray-700 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-3">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />)}
        </div>
      </div>
    </div>
  );

  if (!store) return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">Store not found</p>
      <p className="text-gray-500 dark:text-gray-400 mt-2">No store matched <strong>{domain}</strong></p>
      <Link href="/view" className="mt-4 inline-block underline" style={{ color: primary }}>Browse all stores</Link>
    </div>
  );

  const storeName = store.storeName;
  const codeCoupons = coupons.filter(c => c.code);
  const freeShippingCoupons = coupons.filter(c => c.type === 'freeshipping');
  const today = store.customDate || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const sidebarSimilar = similarStores.map(s => ({
    name: s.storeName,
    slug: s.websiteUrl
      ? s.websiteUrl.replace(/https?:\/\/(www\.)?/, '').replace(/\/$/, '')
      : `${s.slug}.com`
  }));

  const sidebarPopular = popularStores.map(s => ({
    name: s.storeName,
    slug: s.websiteUrl
      ? s.websiteUrl.replace(/https?:\/\/(www\.)?/, '').replace(/\/$/, '')
      : `${s.slug}.com`
  }));

  const sd = (store as any).sidebarData ?? {};

  return (
    <div className="min-h-screen" style={{ backgroundColor: isDark ? darkPalette.bg : (siteConfig?.theme?.backgroundColor || '#faf8ff'), color: isDark ? darkPalette.text : '#111827' }}>
      <div className="max-w-7xl mx-auto px-4 py-4">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mb-4 flex-wrap">
          <Link href="/" className="hover:underline">Home</Link>
          <ChevronRight size={13} />
          <Link href="/view" className="hover:underline">All Stores</Link>
          <ChevronRight size={13} />
          <span className="font-semibold" style={{ color: primary }}>{storeName}</span>
        </div>

        {/* Page Header */}
        <PageHeader
          storeName={storeName}
          logoUrl={store.logo}
          logoBgColor={store.logoBgColor || primary}
          verifiedOffers={coupons.length}
          date={today}
        />

        {/* Main Layout: Sidebar + Coupons */}
        <div className="flex flex-col lg:flex-row gap-8 mt-6">

          {/* Left Sidebar */}
          <aside className="w-full lg:w-64 xl:w-72 flex-shrink-0 order-2 lg:order-1">
            <Sidebar
              storeName={storeName}
              primaryColor={primary}
              totalOffers={coupons.length}
              couponCodes={codeCoupons.length}
              inStoreCoupons={sd.inStoreCoupons ?? 0}
              freeShippingDeals={freeShippingCoupons.length}
              topOffers={coupons.slice(0, 3).map(c => c.title)}
              authorName={sd.authorName}
              authorRole={sd.authorRole}
              authorImage={sd.authorImage}
              authorBio={sd.authorBio}
              authorBioUrl={sd.authorBioUrl}
              trustText={sd.trustText}
              lastVerified={sd.lastVerified}
              howToSteps={sd.howToSteps ?? []}
              featuredArticleImage={sd.featuredArticleImage}
              featuredArticleTitle={sd.featuredArticleTitle}
              featuredArticleDesc={sd.featuredArticleDesc}
              featuredArticleAuthor={sd.featuredArticleAuthor}
              featuredArticleUrl={sd.featuredArticleUrl}
              similarStores={sidebarSimilar}
              popularStores={sidebarPopular}
              storeAddress={sd.storeAddress}
              storeRating={sd.storeRating ?? 5}
              storeRatingCount={sd.storeRatingCount ?? 0}
              commissionNote={sd.commissionNote}
            />
          </aside>

          {/* Coupon List + Content Sections */}
          <main className="flex-1 min-w-0 order-1 lg:order-2">
            {coupons.length === 0 ? (
              <div className="text-center py-16 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-500 dark:text-gray-400">
                <p className="text-lg font-semibold">No coupons available right now</p>
                <p className="text-sm mt-1">Check back soon for deals from {storeName}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {coupons.map(c => <CouponCard key={c._id} coupon={{ ...c, websiteUrl: store.websiteUrl }} />)}
              </div>
            )}

            <div className="mt-10">
              <PromoCodeInfo
                storeName={storeName}
                heading={store.promoInfo?.heading}
                logoBgColor={store.promoInfo?.logoBgColor}
                logoText={store.promoInfo?.logoText}
                logoUrl={store.logo}
                sections={store.promoInfo?.sections ?? []}
                primaryColor={primary}
              />
              <StoreInfo
                storeName={storeName}
                heading={store.storeInfo?.heading}
                subheading={store.storeInfo?.subheading}
                sales={store.storeInfo?.sales ?? []}
              />
              <AboutSection
                storeName={storeName}
                heading={store.aboutSection?.heading}
                paragraphs={store.aboutSection?.paragraphs ?? []}
                primaryColor={primary}
              />
            </div>

            {(faqs.showOn === 'store' || faqs.showOn === 'both') && (
              <FAQSection
                heading={
                  (store as any).faqs?.items?.filter((f: any) => f.question?.trim()).length > 0
                    ? ((store as any).faqs.heading || `${storeName} Frequently Asked Questions`)
                    : (faqs.heading || `{storeName} Frequently Asked Questions`)
                }
                items={
                  (store as any).faqs?.items?.filter((f: any) => f.question?.trim()).length > 0
                    ? (store as any).faqs.items
                    : faqs.items
                }
                primaryColor={primary}
                storeName={storeName}
                pageType="store"
              />
            )}
          </main>
        </div>

        {/* Bottom breadcrumb — above footer */}
        <div className="mt-10 py-5 border-t border-gray-200 dark:border-gray-700 flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 flex-wrap justify-start">
          <Link href="/" className="hover:underline text-gray-600 dark:text-gray-400">Home</Link>
          <ChevronRight size={13} className="text-gray-400" />
          {store.category && (
            <>
              <Link href={`/view?category=${encodeURIComponent(store.category)}`} className="hover:underline text-gray-600 dark:text-gray-400">
                {store.category}
              </Link>
              <ChevronRight size={13} className="text-gray-400" />
            </>
          )}
          <span className="font-semibold text-gray-800 dark:text-gray-200">{storeName}</span>
        </div>

      </div>
    </div>
  );
}

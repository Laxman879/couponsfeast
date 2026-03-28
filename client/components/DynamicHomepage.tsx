'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import { useDynamicTheme } from '@/components/DynamicThemeProvider';
import { useTheme } from '@/components/ThemeProvider';
import HeroBanner from '@/components/sections/HeroBanner';
import FeaturedCoupons from '@/components/sections/FeaturedCoupons';
import TrendingCoupons from '@/components/sections/TrendingCoupons';
import TopStores from '@/components/sections/TopStores';
import LatestCoupons from '@/components/sections/LatestCoupons';

import CashBackSection from '@/components/sections/CashBackSection';
import PromoCard from '@/components/sections/PromoCard';
import DealsSection from '@/components/sections/DealsSection';
import TopDealsCarousel from '@/components/home/TopDealsCarousel';
import BlogSection from '@/components/sections/BlogSection';
import PromoBanner from '@/components/common/PromoBanner';
import StickyPromoBanner from '@/components/common/StickyPromoBanner';
import PopularAccordion from '@/components/common/PopularAccordion';
import FAQSection from '@/components/store/FAQSection';
import { getPage, getSiteConfig } from '@/services/api';

interface Section { order: number; type: string; title?: string; image?: string; limit?: number; }

export default function DynamicHomepage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [faqs, setFaqs] = useState<{ heading: string; showOn: string; items: any[] }>({ heading: '', showOn: 'both', items: [] });
  const [loading, setLoading] = useState(true);
  const { siteConfig, darkPalette } = useDynamicTheme();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const pageBg = isDark ? darkPalette.bg : (siteConfig?.theme?.backgroundColor || '#faf8ff');
  const textColor = isDark ? darkPalette.text : (siteConfig?.theme?.textColor || '#111827');

  const fetchPage = async () => {
    try {
      const [res, cfgRes] = await Promise.all([getPage('home'), getSiteConfig()]);
      const data = res.data?.data ?? res.data;
      setSections((data?.sections || []).sort((a: Section, b: Section) => a.order - b.order));
      setFaqs({ heading: cfgRes.data?.faqs?.heading || '', showOn: cfgRes.data?.faqs?.showOn || 'both', items: cfgRes.data?.faqs?.items || [] });
    } catch {
      setSections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage();
    const interval = setInterval(fetchPage, 30000);
    const onStorage = (e: StorageEvent) => { if (e.key === 'cms-updated') fetchPage(); };
    window.addEventListener('storage', onStorage);
    return () => { clearInterval(interval); window.removeEventListener('storage', onStorage); };
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: pageBg }}>
      <div className="animate-pulse text-lg" style={{ color: siteConfig?.theme?.primaryColor || '#7c3aed' }}>Loading...</div>
    </div>
  );

  const renderSection = (section: Section) => {
    switch (section.type) {
      case 'heroBanner':      return <HeroBanner key={section.order} data={section} />;
      case 'featuredCoupons': return <FeaturedCoupons key={section.order} title={section.title} limit={section.limit} />;
      case 'trendingCoupons': return <TrendingCoupons key={section.order} title={section.title} limit={section.limit} />;
      case 'topStores':       return <TopStores key={section.order} title={section.title} limit={section.limit} />;
      case 'latestCoupons':   return <LatestCoupons key={section.order} title={section.title} limit={section.limit} />;

      default: return null;
    }
  };

  if (sections.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-center px-4" style={{ backgroundColor: pageBg }}>
      <h1 className="text-2xl font-bold" style={{ color: textColor }}>No homepage content yet</h1>
      <p style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Add sections from the admin CMS panel.</p>
    </div>
  );

  return (
    <div style={{ backgroundColor: pageBg }}>
      {sections.map((section) => (
        <React.Fragment key={section.order}>
          {renderSection(section)}
          {section.type === 'heroBanner' && (
            <>
              <FeaturedCoupons title="The Best Coupons, Promo Codes & Cash Back Offers" />
              <CashBackSection />
              <PromoCard />
              <div className="mb-16 md:mb-20 px-4 md:px-6 max-w-7xl mx-auto">
                <PromoBanner closable={false} />
              </div>
              <DealsSection />
              <BlogSection />
              <TopDealsCarousel />
              <PopularAccordion />
              {(faqs.showOn === 'home' || faqs.showOn === 'both') && (
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                  <FAQSection
                    heading={faqs.items.filter((f: any) => f.question?.trim()).length > 0 ? faqs.heading : 'Frequently Asked Questions'}
                    items={faqs.items.filter((f: any) => f.question?.trim())}
                    pageType="home"
                  />
                </div>
              )}
            </>
          )}
          {section.type === 'heroBanner' && <StickyPromoBanner />}
        </React.Fragment>
      ))}
    </div>
  );
}

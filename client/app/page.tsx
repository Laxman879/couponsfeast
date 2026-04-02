'use client';
import { useEffect } from 'react';
import HeroBanner from '@/components/home/HeroBanner';
import PopularOffers from '@/components/home/PopularOffers';
import PopularStores from '@/components/home/PopularStores';
import TopCoupons from '@/components/home/TopCoupons';
import DealsOfTheDay from '@/components/home/DealsOfTheDay';
import Collections from '@/components/home/Collections';
import PopularCategories from '@/components/home/PopularCategories';
import LazySection from '@/components/common/LazySection';
import { useDynamicTheme } from '@/components/DynamicThemeProvider';

export default function HomePage() {
  const { siteConfig } = useDynamicTheme();

  // Dynamic page title & meta from admin config
  useEffect(() => {
    if (!siteConfig) return;
    const sc = siteConfig as any;
    document.title = sc.seo?.metaTitle || sc.siteName || 'Coupon Feast';
    const setMeta = (name: string, content: string) => {
      if (!content) return;
      let el = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
      if (!el) { el = document.createElement('meta'); (name.startsWith('og:') || name.startsWith('twitter:')) ? el.setAttribute('property', name) : el.setAttribute('name', name); document.head.appendChild(el); }
      el.setAttribute('content', content);
    };
    setMeta('description', sc.seo?.metaDescription || sc.siteDescription || '');
    setMeta('keywords', (sc.seo?.metaKeywords || []).join(', '));
    setMeta('og:title', sc.seo?.ogTitle || sc.siteName || '');
    setMeta('og:description', sc.seo?.ogDescription || sc.siteDescription || '');
    setMeta('og:type', 'website');
    setMeta('twitter:card', sc.seo?.twitterCard || 'summary_large_image');
    setMeta('twitter:site', sc.seo?.twitterSite || '');
  }, [siteConfig]);

  return (
    <main>
      <HeroBanner />
      <LazySection skeleton="cards">
        <PopularOffers />
      </LazySection>
      <LazySection skeleton="stores">
        <PopularStores />
      </LazySection>
      <LazySection skeleton="coupons">
        <TopCoupons />
      </LazySection>
      <LazySection skeleton="cards">
        <DealsOfTheDay />
      </LazySection>
      <LazySection skeleton="cards">
        <Collections />
      </LazySection>
      <LazySection skeleton="grid">
        <PopularCategories />
      </LazySection>
    </main>
  );
}

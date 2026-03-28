'use client';
import { useState, useEffect } from 'react';
import SectionHeader from '@/components/common/SectionHeader';
import FeaturedArticle from '@/components/common/FeaturedArticle';
import { getBlogArticles, getSiteConfig } from '@/services/api';

const fallbackFeatured = {
  image: 'https://media.base44.com/images/public/69c6184cc52b93ea85ba2201/a9185adad_generated_8eb79ea4.png',
  category: 'BE A TAX PRO',
  title: 'Tax Season Survival Guide',
  description: 'Make filing a breeze this year with TurboTax and Credit Karma. Click for discounts!',
  slug: 'tax-season-survival-guide-turbotax-credit-karma-discounts',
};

const fallbackSidebar = [
  { image: 'https://media.base44.com/images/public/69c6184cc52b93ea85ba2201/18ef57799_generated_98abd1ae.png', title: 'HAIR GOALS', subtitle: 'Shop Must-Haves at CVS', slug: 'hair-goals-shop-must-haves-cvs' },
  { image: 'https://media.base44.com/images/public/69c6184cc52b93ea85ba2201/1f0d01cd3_generated_4ef000da.png', title: 'CVS BEAUTY HAUL', subtitle: 'Expert-Curated Picks', slug: 'cvs-beauty-haul-expert-curated-picks' },
  { image: 'https://media.base44.com/images/public/69c6184cc52b93ea85ba2201/04428d5f9_generated_15fbdd65.png', title: 'CVS EPIC BEAUTY SALE', subtitle: "Steal an Influencer's Picks", slug: 'cvs-epic-beauty-sale-influencer-picks' },
];

export default function BlogSection() {
  const [featured, setFeatured] = useState(fallbackFeatured);
  const [sidebar, setSidebar] = useState(fallbackSidebar);
  const [siteName, setSiteName] = useState('CouponsFeast');

  useEffect(() => {
    getSiteConfig().then(res => {
      const name = res.data?.data?.siteName || res.data?.siteName;
      if (name) setSiteName(name);
    }).catch(() => {});

    getBlogArticles()
      .then((res) => {
        const articles = res.data?.data ?? [];
        if (articles.length === 0) return;
        const feat = articles.find((a: any) => a.isFeatured) || articles[0];
        const rest = articles.filter((a: any) => a._id !== feat._id).slice(0, 3);
        setFeatured({
          image: feat.image || fallbackFeatured.image,
          category: feat.category || '',
          title: feat.title,
          description: feat.description || feat.subtitle || '',
          slug: feat.slug,
        });
        if (rest.length > 0) {
          setSidebar(rest.map((a: any) => ({
            image: a.image || '',
            title: a.title?.toUpperCase() || '',
            subtitle: a.subtitle || a.description || '',
            slug: a.slug,
          })));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <SectionHeader subtitleBold={siteName} />
      <FeaturedArticle {...featured} sidebarItems={sidebar} />
    </section>
  );
}

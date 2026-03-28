'use client';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getBlogArticleBySlug } from '@/services/api';
import BlogPost from '@/components/common/BlogPost';
import type { BlogPostData } from '@/components/common/BlogPost';

const fallbackData: Record<string, BlogPostData> = {
  'tax-season-survival-guide-turbotax-credit-karma-discounts': {
    category: 'BE A TAX PRO', title: 'Tax Season Survival Guide', subtitle: 'TurboTax & Credit Karma Discounts',
    image: 'https://media.base44.com/images/public/69c6184cc52b93ea85ba2201/a9185adad_generated_8eb79ea4.png',
    content: [
      "Tax season doesn't have to be stressful. With the right tools and a little planning, you can breeze through your filing and even save money along the way.",
      "TurboTax makes it easy to file your taxes with step-by-step guidance, whether you're a first-timer or a seasoned filer.",
      "This year, take advantage of exclusive discounts on TurboTax plans. From simple returns to complex filings, there's a plan that fits your needs — and your budget.",
    ],
  },
  'hair-goals-shop-must-haves-cvs': {
    category: 'BEAUTY', title: 'Hair Goals', subtitle: 'Shop Must-Haves at CVS',
    image: 'https://media.base44.com/images/public/69c6184cc52b93ea85ba2201/18ef57799_generated_98abd1ae.png',
    content: ["Achieve your best hair day ever with these must-have products from CVS."],
  },
  'cvs-beauty-haul-expert-curated-picks': {
    category: 'BEAUTY', title: 'CVS Beauty Haul', subtitle: 'Expert-Curated Picks',
    image: 'https://media.base44.com/images/public/69c6184cc52b93ea85ba2201/1f0d01cd3_generated_4ef000da.png',
    content: ["Our beauty experts have scoured the aisles of CVS to bring you the best picks of the season."],
  },
  'cvs-epic-beauty-sale-influencer-picks': {
    category: 'BEAUTY', title: 'CVS Epic Beauty Sale', subtitle: "Steal an Influencer's Picks",
    image: 'https://media.base44.com/images/public/69c6184cc52b93ea85ba2201/04428d5f9_generated_15fbdd65.png',
    content: ["The CVS Epic Beauty Sale is here, and influencers are sharing their top picks."],
  },
};

export default function BlogPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    getBlogArticleBySlug(slug)
      .then((res) => {
        const data = res.data?.data;
        if (data) {
          setPost({ category: data.category, title: data.title, subtitle: data.subtitle, image: data.image, content: data.content || [] });
        } else {
          setPost(fallbackData[slug] || null);
        }
      })
      .catch(() => setPost(fallbackData[slug] || null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-400">Loading...</p></div>;

  return <BlogPost post={post} backHref="/" backLabel="Back to Home" />;
}

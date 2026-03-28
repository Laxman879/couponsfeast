'use client';
import { Star, MapPin, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface SidebarProps {
  storeName: string;
  primaryColor?: string;
  // Stats
  totalOffers: number;
  couponCodes: number;
  inStoreCoupons?: number;
  freeShippingDeals?: number;
  topOffers?: string[];
  // Author
  authorName?: string;
  authorRole?: string;
  authorImage?: string;
  authorBio?: string;
  authorBioUrl?: string;
  // Trust
  trustText?: string;
  lastVerified?: string;
  // How to use
  howToSteps?: string[];
  // Featured article
  featuredArticleImage?: string;
  featuredArticleTitle?: string;
  featuredArticleDesc?: string;
  featuredArticleAuthor?: string;
  featuredArticleUrl?: string;
  // Stores
  similarStores?: { name: string; slug: string }[];
  popularStores?: { name: string; slug: string }[];
  // Store info
  storeAddress?: string;
  storeRating?: number;
  storeRatingCount?: number;
  // Commission note
  commissionNote?: string;
}

function Section({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="py-5 border-b border-gray-200 dark:border-gray-700">
      {title && (
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200 mb-3">{title}</h3>
      )}
      {children}
    </div>
  );
}

export default function Sidebar({
  storeName,
  primaryColor = '#7c3aed',
  totalOffers,
  couponCodes,
  inStoreCoupons = 0,
  freeShippingDeals = 0,
  topOffers = [],
  authorName,
  authorRole,
  authorImage,
  authorBio,
  authorBioUrl = '#',
  trustText,
  lastVerified,
  howToSteps = [],
  featuredArticleImage,
  featuredArticleTitle,
  featuredArticleDesc,
  featuredArticleAuthor,
  featuredArticleUrl = '#',
  similarStores = [],
  popularStores = [],
  storeAddress,
  storeRating = 5,
  storeRatingCount = 0,
  commissionNote,
}: SidebarProps) {
  const stats = [
    { label: 'Total Offers',        value: totalOffers },
    { label: 'Coupon Codes',        value: couponCodes },
    { label: 'In-Store Coupons',    value: inStoreCoupons },
    { label: 'Free Shipping Deals', value: freeShippingDeals },
  ];

  const defaultHowTo = [
    'Add items to your shopping cart.',
    'Proceed to checkout.',
    'Enter the code in the "Discount code or gift card" box and click "Apply". Your total will be updated if there is an eligible discount.',
    'Follow the instructions to complete checkout.',
  ];

  const steps = howToSteps.length > 0 ? howToSteps : defaultHowTo;

  return (
    <div className="w-full text-sm">

      {/* Commission Note */}
      {commissionNote && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">{commissionNote}</p>
      )}

      {/* Today's Top Offers + Stats */}
      <Section title={`Today's Top ${storeName} Offers:`}>
        {topOffers.length > 0 && (
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1.5 mb-3">
            {topOffers.map((offer, i) => (
              <li key={i} className="flex items-start gap-1">
                <span className="mt-0.5 text-gray-400">•</span>
                <span>{offer}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="space-y-2">
          {stats.map(s => (
            <div key={s.label} className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">{s.label}</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">{s.value}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Author */}
      {authorName && (
        <Section title="This Page Has Been Updated By">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
              {authorImage
                ? <img src={authorImage} alt={authorName} className="w-full h-full object-cover" />
                : <span className="w-full h-full flex items-center justify-center text-sm font-bold text-gray-600">
                    {authorName[0]}
                  </span>
              }
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{authorName}</p>
              {authorRole && <p className="text-sm mt-0.5" style={{ color: primaryColor }}>{authorRole}</p>}
            </div>
          </div>
          {authorBio && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">{authorBio}</p>
          )}
          <a href={authorBioUrl} className="text-sm underline text-gray-700 dark:text-gray-300 mt-2 inline-block hover:text-gray-900 dark:hover:text-gray-100">
            See Bio
          </a>
        </Section>
      )}

      {/* Featured Article */}
      {featuredArticleTitle && (
        <Section title={`${storeName} Featured Articles`}>
          <a href={featuredArticleUrl} className="block no-underline group">
            {featuredArticleImage && (
              <div className="rounded-lg overflow-hidden mb-2">
                <img src={featuredArticleImage} alt={featuredArticleTitle}
                  className="w-full h-24 object-cover group-hover:opacity-90 transition-opacity" />
              </div>
            )}
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:underline">{featuredArticleTitle}</p>
          </a>
          {featuredArticleDesc && (
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">{featuredArticleDesc}</p>
          )}
          {featuredArticleAuthor && (
            <p className="text-sm text-gray-500 mt-1">By {featuredArticleAuthor}</p>
          )}
        </Section>
      )}

      {/* Why Trust Us */}
      {trustText && (
        <Section title="Why Trust Us?">
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{trustText}</p>
          {lastVerified && (
            <p className="text-sm text-gray-500 mt-1">
              Our team last verified offers for {storeName} deals on {lastVerified}.
            </p>
          )}
          <a href="#" className="text-sm underline text-gray-700 mt-2 inline-block hover:text-gray-900">
            Learn How We Verify Coupons
          </a>
        </Section>
      )}

      {/* How to Use */}
      <Section title={`How To Use ${storeName} Coupons?`}>
        <ol className="text-sm text-gray-500 dark:text-gray-400 space-y-2.5 list-decimal list-inside leading-relaxed">
          {steps.map((step, i) => <li key={i}>{step}</li>)}
        </ol>
      </Section>

      {/* Submit Coupon */}
      <Section>
        <a href="#" className="text-base font-semibold flex items-center gap-1 hover:underline"
          style={{ color: primaryColor }}>
          SUBMIT A COUPON <ExternalLink className="w-3 h-3" />
        </a>
      </Section>

      {/* About Store */}
      <Section title={`About ${storeName}`}>
        {storeRatingCount > 0 && (
          <div className="flex items-center gap-1 mb-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < Math.round(storeRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
            ))}
            <span className="text-sm text-gray-700 ml-1">{storeRating.toFixed(1)} Rating ({storeRatingCount})</span>
          </div>
        )}
        {storeAddress && (
          <div className="flex items-start gap-1 mt-2">
            <MapPin className="w-3 h-3 mt-0.5 text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-500">{storeAddress}</span>
          </div>
        )}
      </Section>

      {/* Similar Stores */}
      {similarStores.length > 0 && (
        <Section title="Similar Stores">
          <div className="space-y-1">
            {similarStores.map(s => (
              <Link key={s.slug} href={`/view/${s.slug}`}
                className="block text-sm hover:underline" style={{ color: primaryColor }}>
                {s.name}
              </Link>
            ))}
            <Link href="/view" className="block text-sm font-semibold text-gray-700 mt-2 hover:underline uppercase">
              View All
            </Link>
          </div>
        </Section>
      )}

      {/* Popular Stores */}
      {popularStores.length > 0 && (
        <Section title="Popular Stores">
          <div className="space-y-1">
            {popularStores.map(s => (
              <Link key={s.slug} href={`/view/${s.slug}`}
                className="block text-sm hover:underline" style={{ color: primaryColor }}>
                {s.name}
              </Link>
            ))}
            <Link href="/view" className="block text-sm font-semibold mt-2 hover:underline uppercase"
              style={{ color: primaryColor }}>
              All Stores
            </Link>
          </div>
        </Section>
      )}

    </div>
  );
}

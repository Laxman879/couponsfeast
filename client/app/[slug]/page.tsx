'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getPage, getCoupons, getStores, getCategories, getFeaturedCoupons, getStoreBySlug } from '@/services/api';
import Link from 'next/link';
import { useDynamicTheme } from '@/components/DynamicThemeProvider';
import { useTheme } from '@/components/ThemeProvider';
import { ChevronRight } from 'lucide-react';

interface Section {
  id: string;
  type: string;
  title: string;
  content?: string;
  image?: string;
  backgroundColor?: string;
  buttonText?: string;
  buttonLink?: string;
  limit?: number;
  order: number;
}

interface PageData {
  title: string;
  slug: string;
  description?: string;
  template?: string;
  isActive?: boolean;
  sections: Section[];
}

export default function DynamicPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { siteConfig } = useDynamicTheme();
  const { theme } = useTheme();

  const isDark = theme === 'dark';
  const primary = siteConfig?.theme?.primaryColor || '#7c3aed';
  const pageBg = isDark ? '#111827' : '#f8fafc';
  const textPrimary = isDark ? '#f9fafb' : '#0f172a';
  const textSecondary = isDark ? '#9ca3af' : '#64748b';
  const cardBg = isDark ? '#1f2937' : '#ffffff';
  const borderColor = isDark ? '#374151' : '#e2e8f0';

  useEffect(() => {
    if (!slug) return;
    const load = async () => {
      try {
        const res = await getPage(slug);
        const data = res.data?.data ?? res.data;
        if (!data || data.isActive === false) {
          // Redirect all -coupons slugs to /coupons/{slug} page
          if (slug.endsWith('-coupons')) {
            const itemSlug = slug.replace(/-coupons$/, '');
            router.replace(`/coupons/${itemSlug}`);
            return;
          }
          setNotFound(true);
          return;
        }
        setPage(data);
      } catch {
        if (slug.endsWith('-coupons')) {
          const itemSlug = slug.replace(/-coupons$/, '');
          router.replace(`/coupons/${itemSlug}`);
          return;
        }
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug, router]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: pageBg }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: `${primary}40`, borderTopColor: primary }} />
        <p className="text-sm" style={{ color: textSecondary }}>Loading...</p>
      </div>
    </div>
  );

  if (notFound) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: pageBg }}>
      <p className="text-6xl font-black" style={{ color: primary }}>404</p>
      <p className="text-xl font-bold" style={{ color: textPrimary }}>Page not found</p>
      <p className="text-sm" style={{ color: textSecondary }}>The page <code className="px-1 rounded bg-slate-100">/{slug}</code> doesn't exist or is inactive.</p>
      <Link href="/" className="mt-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold no-underline" style={{ background: primary }}>
        Go Home
      </Link>
    </div>
  );

  const sorted = [...(page?.sections || [])].sort((a, b) => a.order - b.order);
  const isLegal = page?.template === 'legal';

  return (
    <div style={{ background: pageBg, minHeight: '100vh' }}>
      {isLegal && (
        <div style={{ borderBottom: `1px solid ${borderColor}` }}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-2 text-sm py-3">
              <Link href="/" className="no-underline hover:underline" style={{ color: primary }}>Home</Link>
              <ChevronRight size={14} style={{ color: textSecondary }} />
              <span style={{ color: textPrimary }}>{page?.title}</span>
            </div>
          </div>
        </div>
      )}

      {isLegal && (
        <div className="max-w-7xl mx-auto px-4 pt-8 pb-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold" style={{ color: primary }}>{page?.title}</h1>
        </div>
      )}

      {sorted.map((section, i) => (
        <SectionRenderer
          key={section.id || i}
          section={section}
          primary={primary}
          isDark={isDark}
          pageBg={pageBg}
          cardBg={cardBg}
          textPrimary={textPrimary}
          textSecondary={textSecondary}
          borderColor={borderColor}
          pageTitle={page?.title || ''}
          pageSlug={slug}
          pageTemplate={page?.template || 'default'}
        />
      ))}
    </div>
  );
}

function SectionRenderer({ section, primary, isDark, pageBg, cardBg, textPrimary, textSecondary, borderColor, pageTitle, pageSlug, pageTemplate }: any) {
  const isLegal = pageTemplate === 'legal';
  switch (section.type) {
    case 'heroBanner':     return <HeroBannerSection section={section} primary={primary} pageTitle={pageTitle} pageSlug={pageSlug} textSecondary={textSecondary} />;
    case 'textContent':    return <TextSection section={section} cardBg={cardBg} textPrimary={textPrimary} textSecondary={textSecondary} borderColor={borderColor} primary={primary} isLegal={isLegal} />;
    case 'customHTML':     return <HTMLSection section={section} cardBg={cardBg} textPrimary={textPrimary} textSecondary={textSecondary} borderColor={borderColor} primary={primary} isLegal={isLegal} />;
    case 'featuredCoupons':
    case 'trendingCoupons': return <CouponsSection section={section} primary={primary} cardBg={cardBg} textPrimary={textPrimary} textSecondary={textSecondary} borderColor={borderColor} pageBg={pageBg} />;
    case 'topStores':      return <StoresSection section={section} primary={primary} cardBg={cardBg} textPrimary={textPrimary} textSecondary={textSecondary} borderColor={borderColor} pageBg={pageBg} />;
    case 'categories':     return <CategoriesSection section={section} primary={primary} cardBg={cardBg} textPrimary={textPrimary} textSecondary={textSecondary} borderColor={borderColor} pageBg={pageBg} />;
    default:               return null;
  }
}

// ── Hero Banner ──────────────────────────────────────────────────────────────
function HeroBannerSection({ section, primary, pageTitle, pageSlug, textSecondary }: any) {
  return (
    <div className="relative w-full overflow-hidden" style={{ minHeight: 240, background: section.backgroundColor || `linear-gradient(135deg, ${primary}ee, ${primary}99)` }}>
      {section.image && (
        <img src={section.image} alt={section.title} className="absolute inset-0 w-full h-full object-cover opacity-30" />
      )}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20 flex flex-col items-center text-center">
        <div className="flex items-center gap-2 text-white/60 text-sm mb-4">
          <Link href="/" className="no-underline text-white/60 hover:text-white transition-colors">Home</Link>
          <ChevronRight size={14} />
          <span className="text-white font-medium capitalize">{pageTitle || pageSlug}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 leading-tight">{section.title}</h1>
        {section.content && <p className="text-white/80 text-base sm:text-lg max-w-xl mb-6">{section.content}</p>}
        {section.buttonText && section.buttonLink && (
          <Link href={section.buttonLink}
            className="no-underline px-6 py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90"
            style={{ background: '#fff', color: primary }}>
            {section.buttonText}
          </Link>
        )}
      </div>
    </div>
  );
}

// ── Text Content ─────────────────────────────────────────────────────────────
function TextSection({ section, cardBg, textPrimary, textSecondary, borderColor, primary, isLegal }: any) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {!isLegal && section.title && <h2 className="text-xl font-bold mb-4 pb-2" style={{ color: primary, borderBottom: `2px solid ${borderColor}` }}>{section.title}</h2>}
      {section.content && (
        <div
          className="max-w-none [&_*]:max-w-none [&_p]:mb-4 [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_ul]:mb-4 [&_ul]:pl-6 [&_ul]:list-disc [&_ol]:mb-4 [&_ol]:pl-6 [&_ol]:list-decimal [&_li]:mb-2 [&_a]:underline"
          style={{ color: textSecondary, lineHeight: '1.8', fontSize: '15px' }}
          dangerouslySetInnerHTML={{ __html: section.content }}
        />
      )}
    </div>
  );
}

// ── Custom HTML ───────────────────────────────────────────────────────────────
function HTMLSection({ section, cardBg, textPrimary, textSecondary, borderColor, primary, isLegal }: any) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {!isLegal && section.title && <h2 className="text-xl font-bold mb-4 pb-2" style={{ color: primary, borderBottom: `2px solid ${borderColor}` }}>{section.title}</h2>}
      <div
        className="max-w-none [&_*]:max-w-none [&_p]:mb-4 [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_ul]:mb-4 [&_ul]:pl-6 [&_ul]:list-disc [&_ol]:mb-4 [&_ol]:pl-6 [&_ol]:list-decimal [&_li]:mb-2 [&_a]:underline"
        style={{ color: textSecondary, lineHeight: '1.8', fontSize: '15px' }}
        style={{ color: textSecondary }}
        dangerouslySetInnerHTML={{ __html: section.content || '' }}
      />
    </div>
  );
}

// ── Coupons ───────────────────────────────────────────────────────────────────
function CouponsSection({ section, primary, cardBg, textPrimary, textSecondary, borderColor, pageBg }: any) {
  const [coupons, setCoupons] = useState<any[]>([]);
  useEffect(() => {
    getCoupons().then(res => {
      const data = res.data?.data ?? res.data ?? [];
      setCoupons(Array.isArray(data) ? data.slice(0, section.limit || 8) : []);
    }).catch(() => {});
  }, [section.limit]);

  return (
    <div className="py-10 px-4 sm:px-6" style={{ background: pageBg }}>
      <div className="max-w-7xl mx-auto">
        {section.title && <h2 className="text-2xl font-bold mb-6" style={{ color: textPrimary }}>{section.title}</h2>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {coupons.map(coupon => (
            <div key={coupon._id} className="rounded-2xl p-4 flex flex-col gap-2 hover:shadow-md transition-shadow"
              style={{ background: cardBg, border: `1px solid ${borderColor}` }}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: `${primary}15`, color: primary }}>{coupon.discount}</span>
                <span className="text-xs font-mono font-bold px-2 py-1 rounded-lg bg-slate-100 text-slate-600">{coupon.code}</span>
              </div>
              <p className="font-semibold text-sm leading-snug" style={{ color: textPrimary }}>{coupon.title}</p>
              {coupon.store?.storeName && <p className="text-xs" style={{ color: textSecondary }}>{coupon.store.storeName}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Stores ────────────────────────────────────────────────────────────────────
function StoresSection({ section, primary, cardBg, textPrimary, textSecondary, borderColor, pageBg }: any) {
  const [stores, setStores] = useState<any[]>([]);
  useEffect(() => {
    getStores().then(res => {
      const data = res.data?.data ?? res.data ?? [];
      setStores(Array.isArray(data) ? data.slice(0, section.limit || 8) : []);
    }).catch(() => {});
  }, [section.limit]);

  return (
    <div className="py-10 px-4 sm:px-6" style={{ background: pageBg }}>
      <div className="max-w-7xl mx-auto">
        {section.title && <h2 className="text-2xl font-bold mb-6" style={{ color: textPrimary }}>{section.title}</h2>}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {stores.map(store => {
            const domain = store.websiteUrl
              ? store.websiteUrl.replace(/https?:\/\/(www\.)?/, '').replace(/\/$/, '')
              : `${store.slug}.com`;
            return (
            <Link key={store._id} href={`/view/${domain}`} className="no-underline group">
              <div className="rounded-2xl p-4 flex flex-col items-center gap-2 hover:shadow-md transition-all hover:-translate-y-0.5"
                style={{ background: cardBg, border: `1px solid ${borderColor}` }}>
                {store.logo
                  ? <img src={store.logo} alt={store.storeName} className="w-10 h-10 object-contain rounded-lg" onError={e => { e.currentTarget.style.display = 'none'; }} />
                  : <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: primary }}>{store.storeName?.[0]}</div>
                }
                <p className="text-xs font-semibold text-center truncate w-full" style={{ color: textPrimary }}>{store.storeName}</p>
              </div>
            </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Categories ────────────────────────────────────────────────────────────────
function CategoriesSection({ section, primary, cardBg, textPrimary, textSecondary, borderColor, pageBg }: any) {
  const [categories, setCategories] = useState<any[]>([]);
  useEffect(() => {
    getCategories().then(res => {
      const data = res.data?.data ?? res.data ?? [];
      setCategories(Array.isArray(data) ? data.slice(0, section.limit || 12) : []);
    }).catch(() => {});
  }, [section.limit]);

  return (
    <div className="py-10 px-4 sm:px-6" style={{ background: pageBg }}>
      <div className="max-w-7xl mx-auto">
        {section.title && <h2 className="text-2xl font-bold mb-6" style={{ color: textPrimary }}>{section.title}</h2>}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map(cat => (
            <Link key={cat._id} href={`/category/${cat.slug}`} className="no-underline group">
              <div className="rounded-2xl p-4 flex flex-col items-center gap-2 h-24 hover:shadow-md transition-all hover:-translate-y-0.5"
                style={{ background: cardBg, border: `1px solid ${borderColor}` }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = primary; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = borderColor; }}>
                <span className="text-2xl">{cat.icon || '🏷️'}</span>
                <p className="text-xs font-semibold text-center line-clamp-2" style={{ color: textPrimary }}>{cat.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

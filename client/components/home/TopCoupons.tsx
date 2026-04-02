'use client';

import { useState, useEffect } from 'react';
import {
  ChevronLeft, ChevronRight, ExternalLink, Flame, Plane, Smartphone, Shirt,
  UtensilsCrossed, Monitor, ShoppingCart, Home, Heart, Car, Gamepad2, Baby,
  BookOpen, Dumbbell, Pill, Gift, Briefcase, Music, Camera, Wrench, Tag,
  type LucideIcon
} from 'lucide-react';
import { useDynamicTheme } from '@/components/DynamicThemeProvider';
import { useTheme } from '@/components/ThemeProvider';
import { getCoupons, getCategories } from '@/services/api';

// Map category slug/name to Lucide icon
const ICON_MAP: Record<string, LucideIcon> = {
  'most-used': Flame, 'popular': Flame, 'trending': Flame, 'hot': Flame,
  'travel': Plane, 'flight': Plane, 'flights': Plane, 'hotels': Plane,
  'recharge': Smartphone, 'mobile': Smartphone, 'phone': Smartphone, 'telecom': Smartphone,
  'fashion': Shirt, 'clothing': Shirt, 'apparel': Shirt,
  'food': UtensilsCrossed, 'restaurant': UtensilsCrossed, 'dining': UtensilsCrossed, 'grocery': UtensilsCrossed,
  'electronics': Monitor, 'tech': Monitor, 'gadgets': Monitor, 'computers': Monitor,
  'shopping': ShoppingCart, 'ecommerce': ShoppingCart, 'online-shopping': ShoppingCart,
  'home': Home, 'furniture': Home, 'home-decor': Home, 'kitchen': Home,
  'health': Heart, 'wellness': Heart, 'fitness': Dumbbell, 'gym': Dumbbell,
  'beauty': Heart, 'cosmetics': Heart, 'skincare': Heart,
  'automotive': Car, 'cars': Car, 'bikes': Car, 'cab': Car, 'ride': Car,
  'gaming': Gamepad2, 'games': Gamepad2,
  'kids': Baby, 'baby': Baby, 'toys': Baby,
  'books': BookOpen, 'education': BookOpen, 'courses': BookOpen, 'learning': BookOpen,
  'pharmacy': Pill, 'medicine': Pill, 'medical': Pill,
  'gifts': Gift, 'gifting': Gift,
  'business': Briefcase, 'office': Briefcase, 'hosting': Briefcase, 'software': Briefcase,
  'entertainment': Music, 'music': Music, 'movies': Music, 'streaming': Music,
  'photography': Camera,
  'tools': Wrench, 'hardware': Wrench, 'services': Wrench,
};

function getIcon(slug: string, name: string): LucideIcon {
  const s = slug?.toLowerCase() || '';
  const n = name?.toLowerCase() || '';
  return ICON_MAP[s] || ICON_MAP[n] || Object.entries(ICON_MAP).find(([k]) => s.includes(k) || n.includes(k))?.[1] || Tag;
}

export default function TopCoupons() {
  const { siteConfig, darkPalette, labels } = useDynamicTheme();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const primary = siteConfig?.theme?.primaryColor || '#7c3aed';
  const textColor = isDark ? darkPalette.text : (siteConfig?.theme?.textColor || '#111827');
  const mutedText = isDark ? `${darkPalette.text}99` : `${textColor}80`;
  const cardBg = isDark ? darkPalette.cardBg : '#ffffff';
  const borderClr = isDark ? `${darkPalette.text}15` : `${textColor}12`;
  const sectionBg = isDark ? darkPalette.bg : '#f9fafb';

  const [tabs, setTabs] = useState<{ label: string; slug: string; Icon: LucideIcon }[]>([]);
  const [allCoupons, setAllCoupons] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('');
  const [fade, setFade] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    // Fetch categories as tabs
    getCategories()
      .then(res => {
        const data = res.data?.data ?? res.data ?? [];
        const cats = (Array.isArray(data) ? data : []).slice(0, 6).map((c: any) => ({
          label: c.name,
          slug: c.slug || c.name.toLowerCase().replace(/\s+/g, '-'),
          Icon: getIcon(c.slug || '', c.name || ''),
        }));
        if (cats.length > 0) {
          setTabs(cats);
          setActiveTab(cats[0].label);
        }
      })
      .catch(() => {});

    // Fetch coupons
    getCoupons({ limit: 50, sort: 'clickCount' })
      .then(res => {
        const data = res.data?.data ?? res.data ?? [];
        const serverUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
        const mapped = (Array.isArray(data) ? data : []).map((c: any) => {
          const storeLogo = c.store?.logo
            ? (c.store.logo.startsWith('http') ? c.store.logo : `${serverUrl}${c.store.logo}`)
            : '';
          return {
            badge: c.discount || c.labelType || 'DEAL',
            title: c.title || '',
            store: c.store?.storeName || '',
            storeSlug: c.store?.slug || '',
            logo: c.customLogo || storeLogo,
            category: c.category?.name || c.category || '',
            tags: c.tags || [],
            link: c.affiliateUrl || c.store?.websiteUrl || '',
          };
        });
        setAllCoupons(mapped);
      })
      .catch(() => {});
  }, []);

  const activeSlug = tabs.find(t => t.label === activeTab)?.slug || '';
  const filtered = !activeSlug ? allCoupons : allCoupons.filter(c => {
    const cat = (c.category || '').toLowerCase();
    const slug = activeSlug.toLowerCase();
    return cat === slug || cat === activeTab.toLowerCase()
      || c.tags.some((t: string) => t.toLowerCase().includes(slug));
  });
  const showAll = filtered.length === 0 ? allCoupons : filtered;

  const perPage = 6;
  const totalPages = Math.max(1, Math.ceil(showAll.length / perPage));
  const visible = showAll.slice(page * perPage, page * perPage + perPage);

  const switchTab = (label: string) => {
    setFade(false);
    setTimeout(() => { setActiveTab(label); setPage(0); setFade(true); }, 200);
  };

  if (allCoupons.length === 0) return null;

  return (
    <section className="py-8" style={{ backgroundColor: sectionBg }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold" style={{ color: textColor }}>
            {labels?.homepage?.topCouponsTitle || "Today's Top Coupons & Offers"}
          </h2>
          <div className="flex items-center gap-3">
            <button onClick={() => setPage(p => Math.max(0, p - 1))}
              className="w-8 h-8 rounded-full flex items-center justify-center border transition-colors"
              style={{ borderColor: borderClr, color: mutedText, backgroundColor: cardBg }}>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-1.5">
              {Array.from({ length: totalPages }).map((_, i) => (
                <span key={i} className="h-2 rounded-full transition-all"
                  style={{ width: i === page ? 20 : 8, backgroundColor: i === page ? primary : (isDark ? `${darkPalette.text}30` : '#d1d5db') }} />
              ))}
            </div>
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              className="w-8 h-8 rounded-full flex items-center justify-center border transition-colors"
              style={{ borderColor: borderClr, color: mutedText, backgroundColor: cardBg }}>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabs from admin categories */}
        {tabs.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-6">
            {tabs.map(({ label, Icon }) => (
              <button key={label} onClick={() => switchTab(label)}
                className="flex items-center gap-2 px-5 py-2 rounded-full border text-sm font-medium transition-all cursor-pointer"
                style={{
                  backgroundColor: activeTab === label ? primary : cardBg,
                  color: activeTab === label ? '#ffffff' : textColor,
                  borderColor: activeTab === label ? primary : (isDark ? `${darkPalette.text}30` : '#d1d5db'),
                }}>
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 transition-opacity duration-300"
          style={{ opacity: fade ? 1 : 0 }}>
          {visible.map((item, index) => (
            <div key={index}
              className="rounded-xl overflow-hidden border transition-all duration-300 hover:shadow-xl hover:-translate-y-2 flex flex-col cursor-pointer"
              style={{ backgroundColor: cardBg, borderColor: borderClr, boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px', minHeight: 200 }}>
              <div className="flex p-5 gap-4 flex-1 items-center">
                <div className="min-w-[90px] flex items-center justify-center font-bold text-center text-sm" style={{ color: primary }}>
                  {item.badge}
                </div>
                <div className="border-l border-dashed self-stretch" style={{ borderColor: borderClr }} />
                <div className="text-sm leading-relaxed flex items-center" style={{ color: mutedText }}>
                  {item.title}
                </div>
              </div>
              <div className="flex justify-between items-center border-t px-4 py-3"
                style={{ borderColor: borderClr, backgroundColor: sectionBg }}>
                <div className="flex items-center gap-2">
                  {item.logo && <img src={item.logo} alt={item.store} className="h-6 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />}
                  {!item.logo && item.store && <span className="text-xs font-bold" style={{ color: textColor }}>{item.store}</span>}
                </div>
                {item.store && (
                  <div className="flex items-center gap-1 text-sm cursor-pointer hover:underline" style={{ color: primary }}
                    onClick={() => { if (item.storeSlug) window.location.href = `/coupons/${item.storeSlug}-coupons`; }}>
                    View All {item.store} Coupons
                    <ExternalLink size={14} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

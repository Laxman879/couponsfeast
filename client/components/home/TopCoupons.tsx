'use client';

import { useState, useEffect } from 'react';
import { IconType } from 'react-icons';
import {
  FiChevronLeft, FiChevronRight, FiExternalLink, FiTag,
} from 'react-icons/fi';
import {
  FaFire, FaPlane, FaMobileAlt, FaTshirt, FaUtensils, FaDesktop,
  FaShoppingCart, FaHome, FaHeart, FaCar, FaGamepad, FaBaby,
  FaBookOpen, FaDumbbell, FaPills, FaGift, FaBriefcase, FaMusic,
  FaCamera, FaWrench,
} from 'react-icons/fa';
import { useDynamicTheme } from '@/components/DynamicThemeProvider';
import { useTheme } from '@/components/ThemeProvider';
import { getCoupons, getCategories } from '@/services/api';

const ICON_MAP: Record<string, IconType> = {
  'most-used': FaFire, popular: FaFire, trending: FaFire, hot: FaFire,
  travel: FaPlane, flight: FaPlane, flights: FaPlane, hotels: FaPlane,
  recharge: FaMobileAlt, mobile: FaMobileAlt, phone: FaMobileAlt, telecom: FaMobileAlt,
  fashion: FaTshirt, clothing: FaTshirt, apparel: FaTshirt,
  food: FaUtensils, restaurant: FaUtensils, dining: FaUtensils, grocery: FaUtensils,
  electronics: FaDesktop, tech: FaDesktop, gadgets: FaDesktop, computers: FaDesktop,
  shopping: FaShoppingCart, ecommerce: FaShoppingCart, 'online-shopping': FaShoppingCart,
  home: FaHome, furniture: FaHome, 'home-decor': FaHome, kitchen: FaHome,
  health: FaHeart, wellness: FaHeart, fitness: FaDumbbell, gym: FaDumbbell,
  beauty: FaHeart, cosmetics: FaHeart, skincare: FaHeart,
  automotive: FaCar, cars: FaCar, bikes: FaCar, cab: FaCar, ride: FaCar,
  gaming: FaGamepad, games: FaGamepad,
  kids: FaBaby, baby: FaBaby, toys: FaBaby,
  books: FaBookOpen, education: FaBookOpen, courses: FaBookOpen, learning: FaBookOpen,
  pharmacy: FaPills, medicine: FaPills, medical: FaPills,
  gifts: FaGift, gifting: FaGift,
  business: FaBriefcase, office: FaBriefcase, hosting: FaBriefcase, software: FaBriefcase,
  entertainment: FaMusic, music: FaMusic, movies: FaMusic, streaming: FaMusic,
  photography: FaCamera,
  tools: FaWrench, hardware: FaWrench, services: FaWrench,
};

function getIcon(slug: string, name: string): IconType {
  const s = slug?.toLowerCase() || '';
  const n = name?.toLowerCase() || '';
  return (
    ICON_MAP[s] ||
    ICON_MAP[n] ||
    Object.entries(ICON_MAP).find(([k]) => s.includes(k) || n.includes(k))?.[1] ||
    FiTag
  );
}

export default function TopCoupons() {
  const { siteConfig, darkPalette, labels } = useDynamicTheme();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const primary = siteConfig?.theme?.primaryColor || '#7c3aed';
  const textColor = isDark ? darkPalette.text : siteConfig?.theme?.textColor || '#111827';
  const mutedText = isDark ? `${darkPalette.text}99` : `${textColor}80`;
  const cardBg = isDark ? darkPalette.cardBg : '#ffffff';
  const borderClr = isDark ? `${darkPalette.text}15` : `${textColor}12`;
  const sectionBg = isDark ? darkPalette.bg : '#f9fafb';

  const [tabs, setTabs] = useState<{ label: string; slug: string; Icon: IconType }[]>([]);
  const [allCoupons, setAllCoupons] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('');
  const [fade, setFade] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    getCategories()
      .then((res) => {
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
    getCoupons({ limit: 50, sort: 'clickCount' })
      .then((res) => {
        const data = res.data?.data ?? res.data ?? [];
        const serverUrl =
          process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
        const mapped = (Array.isArray(data) ? data : []).map((c: any) => {
          const storeLogo = c.store?.logo
            ? c.store.logo.startsWith('http')
              ? c.store.logo
              : `${serverUrl}${c.store.logo}`
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

  const activeSlug = tabs.find((t) => t.label === activeTab)?.slug || '';
  const filtered = !activeSlug
    ? allCoupons
    : allCoupons.filter((c) => {
        const cat = (c.category || '').toLowerCase();
        const slug = activeSlug.toLowerCase();
        return (
          cat === slug ||
          cat === activeTab.toLowerCase() ||
          c.tags.some((t: string) => t.toLowerCase().includes(slug))
        );
      });
  const showAll = filtered.length === 0 ? allCoupons : filtered;

  const perPage = 6;
  const totalPages = Math.max(1, Math.ceil(showAll.length / perPage));
  const visible = showAll.slice(page * perPage, page * perPage + perPage);

  const switchTab = (label: string) => {
    setFade(false);
    setTimeout(() => {
      setActiveTab(label);
      setPage(0);
      setFade(true);
    }, 200);
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
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="w-8 h-8 rounded-full flex items-center justify-center border transition-colors"
              style={{ borderColor: borderClr, color: mutedText, backgroundColor: cardBg }}
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-1.5">
              {Array.from({ length: totalPages }).map((_, i) => (
                <span
                  key={i}
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: i === page ? 20 : 8,
                    backgroundColor:
                      i === page ? primary : isDark ? `${darkPalette.text}30` : '#d1d5db',
                  }}
                />
              ))}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              className="w-8 h-8 rounded-full flex items-center justify-center border transition-colors"
              style={{ borderColor: borderClr, color: mutedText, backgroundColor: cardBg }}
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {tabs.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-6">
            {tabs.map(({ label, Icon }) => (
              <button
                key={label}
                onClick={() => switchTab(label)}
                className="flex items-center gap-2 px-5 py-2 rounded-full border text-sm font-medium transition-all cursor-pointer"
                style={{
                  backgroundColor: activeTab === label ? primary : cardBg,
                  color: activeTab === label ? '#ffffff' : textColor,
                  borderColor:
                    activeTab === label ? primary : isDark ? `${darkPalette.text}30` : '#d1d5db',
                }}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        )}

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 transition-opacity duration-300"
          style={{ opacity: fade ? 1 : 0 }}
        >
          {visible.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                if (item.storeSlug) window.location.href = `/coupons/${item.storeSlug}-coupons`;
              }}
              className="rounded-xl overflow-hidden border transition-all duration-300 hover:shadow-xl hover:-translate-y-2 flex flex-col cursor-pointer"
              style={{
                backgroundColor: cardBg,
                borderColor: borderClr,
                boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
                minHeight: 180,
              }}
            >
              <div className="flex p-4 sm:p-5 gap-3 sm:gap-4 flex-1 items-center">
                <div
                  className="min-w-[90px] sm:min-w-[120px] flex items-center justify-center font-extrabold text-center text-xl sm:text-2xl md:text-3xl"
                  style={{ color: primary }}
                >
                  {item.badge}
                </div>
                <div
                  className="border-l border-dashed self-stretch"
                  style={{ borderColor: borderClr }}
                />
                <div
                  className="text-base sm:text-lg font-semibold leading-snug flex items-center"
                  style={{ color: textColor }}
                >
                  {item.title}
                </div>
              </div>
              <div
                className="flex justify-between items-center border-t px-3 sm:px-4 py-2.5 sm:py-3"
                style={{ borderColor: borderClr, backgroundColor: sectionBg }}
              >
                <div className="flex items-center gap-2">
                  {item.logo && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.logo}
                      alt={item.store}
                      className="h-10 sm:h-12 md:h-14 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  {!item.logo && item.store && (
                    <span className="text-sm sm:text-base font-bold" style={{ color: textColor }}>
                      {item.store}
                    </span>
                  )}
                </div>
                {item.store && (
                  <div
                    className="flex items-center gap-1 text-sm cursor-pointer hover:underline"
                    style={{ color: primary }}
                    onClick={() => {
                      if (item.storeSlug)
                        window.location.href = `/coupons/${item.storeSlug}-coupons`;
                    }}
                  >
                    View All {item.store} Coupons
                    <FiExternalLink size={14} />
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

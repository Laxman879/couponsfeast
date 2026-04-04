'use client';
import { Search, Bell, User, Gift, Menu, X, Sun, Moon } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useDynamicTheme } from '@/components/DynamicThemeProvider';
import { useTheme } from '@/components/ThemeProvider';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const currentMonth = months[new Date().getMonth()];

const navLinks = [
  { label: 'Stores', href: '/stores', icon: 'https://cdn.grabon.in/gograbon/v8/icons/header-store-icon-v2.png' },
  { label: 'Categories', href: '/category', icon: 'https://cdn.grabon.in/gograbon/v8/icons/header-category-icon-v2.png' },
  { label: 'All Coupons', href: '/all-coupons', icon: 'https://cdn.grabon.in/gograbon/v8/icons/calendar-v3.svg' },
  { label: 'Deals', href: '/deals', icon: 'https://cdn.grabon.in/gograbon/v8/icons/header-deals.png' },
  { label: 'Blog', href: '/blog', icon: 'https://cdn.grabon.in/gograbon/v8/icons/header-blog-icon-v2.png' },
];

const mobilePageLinks = [
  { label: 'Stores', href: '/stores', icon: 'https://cdn.grabon.in/gograbon/v8/icons/header-store-icon-v2.png' },
  { label: 'Categories', href: '/category', icon: 'https://cdn.grabon.in/gograbon/v8/icons/header-category-icon-v2.png' },
  { label: 'All Coupons', href: '/all-coupons', icon: 'https://cdn.grabon.in/gograbon/v8/icons/calendar-v3.svg' },
  { label: 'Deals', href: '/deals', icon: 'https://cdn.grabon.in/gograbon/v8/icons/header-deals.png' },
  { label: 'Blog', href: '/blog', icon: 'https://cdn.grabon.in/gograbon/v8/icons/header-blog-icon-v2.png' },
];

const notifications = [
  {
    id: 1,
    title: 'Big Bachat Days is Live - Up to 80% OFF | 10% Bank Offer + FREE Delivery',
    img: 'https://cdn.grabon.in/gograbon/images/banners/banner-1774872788866.jpg',
    alt: 'Flipkart',
  },
  {
    id: 2,
    title: "Today's Deals Of The Day - Save Up to 90% on a Wide Range of Products",
    img: 'https://cdn.grabon.in/gograbon/images/banners/banner-1769678698340.jfif',
    alt: 'Amazon Offers',
  },
];

const recommendedStores = [
  { label: 'Myntra', count: 54, logo: 'https://cdn.grabon.in/gograbon/images/merchant/1774444164712/myntra-logo.jpg', href: '/stores' },
  { label: 'Amazon', count: 70, logo: 'https://cdn.grabon.in/gograbon/images/merchant/1773381281318/amazon-logo.jpg', href: '/stores' },
  { label: 'Dominos', count: 16, logo: 'https://cdn.grabon.in/gograbon/images/merchant/1773237436092/dominos-logo.jpg', href: '/stores' },
  { label: 'Swiggy', count: 40, logo: 'https://cdn.grabon.in/gograbon/images/merchant/1773237598679/swiggy-logo.jpg', href: '/stores' },
  { label: 'Blinkit', count: 30, logo: 'https://cdn.grabon.in/gograbon/images/merchant/1773237406955/blinkit-logo.jpg', href: '/stores' },
  { label: 'Flipkart', count: 47, logo: 'https://cdn.grabon.in/gograbon/images/merchant/1773826357590/flipkart-logo.jpg', href: '/stores' },
  { label: 'Bookmyshow', count: 40, logo: 'https://cdn.grabon.in/gograbon/images/merchant/1773237409670/bookmyshow-logo.jpg', href: '/stores' },
  { label: 'Hostinger', count: 51, logo: 'https://cdn.grabon.in/gograbon/images/merchant/1773237471658/hostinger-logo.jpg', href: '/stores' },
  { label: 'Zomato', count: 32, logo: 'https://cdn.grabon.in/gograbon/images/merchant/1773237646847/zomato-logo.jpg', href: '/stores' },
  { label: 'Rapido', count: 23, logo: 'https://cdn.grabon.in/gograbon/images/merchant/1773237563453/rapido-logo.jpg', href: '/stores' },
];

const recommendedCategories = [
  { label: 'Movie Tickets', count: 302, img: 'https://cdn.grabon.in/gograbon/images/category/1773409653189/movie-tickets.svg', href: '/category' },
  { label: 'Train Tickets', count: 97, img: 'https://cdn.grabon.in/gograbon/images/category/1773409656637/train-tickets.svg', href: '/category' },
  { label: 'Flight', count: 1263, img: 'https://cdn.grabon.in/gograbon/images/category/1773409648397/flight.svg', href: '/category' },
  { label: 'Electronics', count: 2325, img: 'https://cdn.grabon.in/gograbon/images/category/1773409647250/electronics.svg', href: '/category' },
  { label: 'Bus', count: 502, img: 'https://cdn.grabon.in/gograbon/images/category/1773409644498/bus.svg', href: '/category' },
];

const offersYouMayLike = [
  { store: 'Hostinger', badge: 'Up To 40% OFF', desc: 'Special Offer: Avail Up To 30% OFF + Extra 10% OFF On Hostinger Horizons', logo: 'https://cdn.grabon.in/gograbon/images/merchant/1773237471658/hostinger-logo.jpg' },
  { store: 'Myntra', badge: 'EXTRA ₹300 OFF', desc: 'Sitewide Offer - Up To 90% OFF + Extra Rs 300 OFF on Orders | New User', logo: 'https://cdn.grabon.in/gograbon/images/merchant/1774444164712/myntra-logo.jpg' },
  { store: 'Zomato', badge: 'FLAT ₹30 OFF', desc: 'Save Flat Rs 30 OFF On Onecard Credit Card', logo: 'https://cdn.grabon.in/gograbon/images/merchant/1773237646847/zomato-logo.jpg' },
  { store: 'Rapido', badge: 'Up To 55% OFF', desc: 'Up To 55% OFF + Up To Rs 4000 OFF + 0 Service Fee On All Bookings!', logo: 'https://cdn.grabon.in/gograbon/images/merchant/1773237563453/rapido-logo.jpg' },
  { store: 'Swiggy', badge: 'FLAT ₹150 OFF', desc: 'Flat Rs 150 OFF On Orders Above Rs 299', logo: 'https://cdn.grabon.in/gograbon/images/merchant/1773237598679/swiggy-logo.jpg' },
  { store: 'Blinkit', badge: 'Up To 55% OFF', desc: 'Fresh Fruits & Veggies - Up to 50% OFF + Extra 5% OFF', logo: 'https://cdn.grabon.in/gograbon/images/merchant/1773237406955/blinkit-logo.jpg' },
];

export default function NavbarFour() {
  const { siteConfig, refreshConfig, darkPalette } = useDynamicTheme();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const primary = siteConfig?.theme?.primaryColor || '#7c3aed';
  const secondary = siteConfig?.theme?.secondaryColor || '#9333ea';
  const siteName = siteConfig?.siteName || 'CouponsFeast';
  const customNavBg = siteConfig?.navbar?.bgColor;
  const hasCustomNavBg = customNavBg && customNavBg !== '#ffffff' && customNavBg !== '#fff' && customNavBg !== 'rgb(250, 248, 255)';
  const navBg = isDark ? darkPalette.cardBg : (hasCustomNavBg ? customNavBg : primary);
  const navText = isDark ? darkPalette.text : (siteConfig?.navbar?.textColor || '#ffffff');
  const borderColor = isDark ? `${darkPalette.text}20` : 'rgba(255,255,255,0.2)';
  const mutedText = isDark ? `${darkPalette.text}99` : 'rgba(255,255,255,0.7)';
  const hoverBg = isDark ? `${darkPalette.text}12` : 'rgba(255,255,255,0.15)';
  const drawerBg = isDark ? darkPalette.bg : '#ffffff';
  const inputBg = isDark ? darkPalette.bg : 'rgba(255,255,255,0.2)';
  const cardBg = isDark ? darkPalette.cardBg : '#ffffff';
  const iconFilter = (!isDark && navText === '#ffffff') || isDark ? 'brightness(0) invert(1)' : 'none';

  // Re-fetch config when admin saves
  useEffect(() => {
    const onUpdate = () => refreshConfig();
    window.addEventListener('cms-updated', onUpdate);
    window.addEventListener('storage', (e) => { if (e.key === 'cms-updated') onUpdate(); });
    return () => window.removeEventListener('cms-updated', onUpdate);
  }, [refreshConfig]);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [query, setQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Drawer animation
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => setDrawerVisible(true));
    } else {
      setDrawerVisible(false);
      const t = setTimeout(() => { document.body.style.overflow = ''; }, 300);
      return () => clearTimeout(t);
    }
  }, [mobileOpen]);

  // Search modal animation
  useEffect(() => {
    if (searchOpen) {
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => {
        setSearchVisible(true);
        setTimeout(() => searchInputRef.current?.focus(), 100);
      });
    } else {
      setSearchVisible(false);
      const t = setTimeout(() => { document.body.style.overflow = ''; }, 300);
      return () => clearTimeout(t);
    }
  }, [searchOpen]);

  const closeDrawer = () => setMobileOpen(false);
  const closeSearch = () => { setSearchOpen(false); setQuery(''); };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 shadow-sm" style={{ backgroundColor: navBg }}>

      {/* Top Promo Banner */}

      <div className="max-w-7xl mx-auto px-4">

        {/* Main Row */}
        <div className="flex items-center justify-between h-16 gap-3">

          {/* Hamburger — mobile + tablet */}
          <button className="lg:hidden p-2 rounded-lg transition-colors shrink-0" style={{ color: navText }} onClick={() => setMobileOpen(true)}>
            <Menu className="w-5 h-5" style={{ color: navText }} />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 shrink-0 no-underline">
            {siteConfig?.logos?.navbar ? (
              <img src={siteConfig.logos.navbar.startsWith('http') ? siteConfig.logos.navbar : `http://localhost:5000${siteConfig.logos.navbar}`} alt={siteName} className="hidden sm:block h-12 w-auto object-contain" />
            ) : (
              <span className="hidden sm:block text-2xl font-extrabold" style={{ color: isDark ? primary : '#ffffff' }}>{siteName}</span>
            )}
          </Link>

          {/* Search Bar — desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: mutedText }} />
              <input
                type="text"
                placeholder="Search for stores, coupons & offers..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full border text-sm focus:outline-none focus:ring-2 transition-all"
                style={{ borderColor, backgroundColor: inputBg, color: navText }}
                onFocus={() => setSearchOpen(true)}
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1">

            {/* Theme Toggle */}
            <button onClick={toggleTheme} className="p-2 rounded-full transition-colors" style={{ color: navText }}>
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Mobile Search Icon */}
            <button
              className="lg:hidden p-2 rounded-full transition-colors"
              style={{ color: navText }}
              onClick={() => setSearchOpen(true)}
            >
              <Search className="w-5 h-5" style={{ color: navText }} />
            </button>

            
          </div>
        </div>

        {/* Bottom Nav Row — desktop only */}
        <hr className="hidden lg:block border-0 m-0" style={{ borderTop: `1px solid ${borderColor}` }} />
        <div className="hidden lg:flex items-center justify-between py-2.5" style={{ borderColor }}>
          <div className="flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-base font-normal transition-all no-underline"
                style={{ color: mutedText }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = hoverBg; e.currentTarget.style.color = navText; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = mutedText; }}
              >
                <img src={link.icon} alt="" className="w-5 h-5 object-contain" style={{ filter: iconFilter, opacity: 0.8 }} />
                {link.label}
              </Link>
            ))}
          </div>
          
        </div>
      </div>

      {/* ── Full-screen Search Modal ── */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[60] flex flex-col transition-all duration-300" style={{ backgroundColor: navBg, opacity: searchVisible ? 1 : 0, transform: searchVisible ? 'translateY(0)' : 'translateY(-8px)' }}
        >
          {/* Search Header */}
          <div className="flex items-center gap-3 px-4 py-4 border-b shrink-0" style={{ borderColor }}>
            <div className="flex items-center flex-1 gap-3 rounded-full px-4 py-2.5 border transition-all" style={{ backgroundColor: inputBg, borderColor }}>
              <Search className="w-5 h-5 shrink-0" style={{ color: mutedText }} />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for stores, coupons & offers..."
                className="flex-1 bg-transparent border-none outline-none text-sm placeholder-gray-400"
                style={{ color: navText }}
              />
              {query && (
                <button onClick={() => setQuery('')} className="bg-transparent border-none cursor-pointer p-0">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
            <button onClick={closeSearch} className="shrink-0 p-2 rounded-full bg-transparent border-none cursor-pointer">
              <X className="w-5 h-5" style={{ color: navText }} />
            </button>
          </div>

          {/* Search Body */}
          <div className="flex-1 overflow-y-auto py-4 space-y-6">

            {/* Recommended Stores */}
            {(() => {
              const filtered = recommendedStores.filter(s => s.label.toLowerCase().includes(query.toLowerCase()));
              if (filtered.length === 0) return null;
              return (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-3 px-4" style={{ color: mutedText }}>Recommended Stores</p>
                  <div className="flex gap-3 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {filtered.map((s) => (
                      <Link key={s.label} href={s.href} onClick={closeSearch}
                        className="flex items-center gap-3 p-3 md:p-4 rounded-xl border transition-all no-underline shrink-0 w-44 md:w-56 lg:w-64"
                        style={{ borderColor }}
                      >
                        <img src={s.logo} alt={s.label} className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-xl object-contain border shrink-0 p-1" style={{ borderColor, backgroundColor: cardBg }} />
                        <div className="min-w-0">
                          <p className="text-sm md:text-base font-semibold truncate" style={{ color: navText }}>{s.label}</p>
                          <p className="text-xs mt-0.5" style={{ color: mutedText }}><span className="font-bold" style={{ color: navText }}>{s.count}</span> offers</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Recommended Categories */}
            {(() => {
              const filtered = recommendedCategories.filter(c => c.label.toLowerCase().includes(query.toLowerCase()));
              if (filtered.length === 0) return null;
              return (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-3 px-4" style={{ color: mutedText }}>Recommended Categories</p>
                  <div className="flex gap-3 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {filtered.map((c) => (
                      <Link key={c.label} href={c.href} onClick={closeSearch}
                        className="flex items-center gap-3 p-3 md:p-4 rounded-xl border transition-all no-underline shrink-0 w-44 md:w-56 lg:w-64"
                        style={{ borderColor }}
                      >
                        <img src={c.img} alt={c.label} className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 object-contain shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm md:text-base font-semibold truncate" style={{ color: navText }}>{c.label}</p>
                          <p className="text-xs mt-0.5" style={{ color: mutedText }}><span className="font-bold" style={{ color: navText }}>{c.count}</span> offers</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Offers You May Like */}
            {(() => {
              const filtered = offersYouMayLike.filter(o =>
                o.store.toLowerCase().includes(query.toLowerCase()) ||
                o.desc.toLowerCase().includes(query.toLowerCase()) ||
                o.badge.toLowerCase().includes(query.toLowerCase())
              );
              if (filtered.length === 0) return null;
              return (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-3 px-4" style={{ color: mutedText }}>Offers You May Like</p>
                  <div className="flex gap-3 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {filtered.map((o, i) => (
                      <a key={i} href="#" onClick={closeSearch}
                        className="flex items-start gap-3 p-3 md:p-4 rounded-xl border transition-all no-underline shrink-0 w-60 md:w-72 lg:w-80"
                        style={{ borderColor }}
                      >
                        <img src={o.logo} alt={o.store} className="w-11 h-11 md:w-14 md:h-14 rounded-xl object-contain border p-1 shrink-0" style={{ borderColor, backgroundColor: cardBg }} />
                        <div className="min-w-0">
                          <p className="text-sm md:text-base font-bold mb-0.5" style={{ color: navText }}>{o.store}</p>
                      <p className="text-xs md:text-sm font-semibold mb-1" style={{ color: primary }}>{o.badge}</p>
                          <p className="text-xs line-clamp-2 leading-relaxed" style={{ color: mutedText }}>{o.desc}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* No results */}
            {query && [
              ...recommendedStores.filter(s => s.label.toLowerCase().includes(query.toLowerCase())),
              ...recommendedCategories.filter(c => c.label.toLowerCase().includes(query.toLowerCase())),
              ...offersYouMayLike.filter(o => o.store.toLowerCase().includes(query.toLowerCase()) || o.desc.toLowerCase().includes(query.toLowerCase())),
            ].length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <Search className="w-10 h-10 mb-3 opacity-30" />
                <p className="text-sm">No results for &ldquo;{query}&rdquo;</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Mobile / Tablet Drawer ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 transition-opacity duration-300"
            style={{ opacity: drawerVisible ? 1 : 0 }}
            onClick={closeDrawer}
          />
          <nav
            className="absolute left-0 top-0 h-full w-full flex flex-col shadow-2xl transition-transform duration-300 ease-in-out overflow-y-auto"
            style={{ backgroundColor: drawerBg, transform: drawerVisible ? 'translateX(0)' : 'translateX(-100%)' }}
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b shrink-0" style={{ borderColor: isDark ? borderColor : '#e5e7eb' }}>
              <Link href="/" onClick={closeDrawer} className="no-underline">
                {siteConfig?.logos?.navbar ? (
                  <img src={siteConfig.logos.navbar.startsWith('http') ? siteConfig.logos.navbar : `http://localhost:5000${siteConfig.logos.navbar}`} alt={siteName} className="h-10 w-auto object-contain" />
                ) : (
                  <span className="text-xl font-extrabold" style={{ color: primary }}>{siteName}</span>
                )}
              </Link>
              <button onClick={closeDrawer} className="p-1.5 rounded-full bg-transparent border-none cursor-pointer">
                <X className="w-5 h-5" style={{ color: isDark ? navText : '#374151' }} />
              </button>
            </div>

            {/* Nav vertical list */}
            <div className="flex flex-col flex-1">
              {[
                { label: 'Stores', href: '/stores', icon: 'https://cdn.grabon.in/gograbon/v8/icons/header-store-icon-v2.png' },
                { label: 'Categories', href: '/category', icon: 'https://cdn.grabon.in/gograbon/v8/icons/header-category-icon-v2.png' },
                { label: 'All Coupons', href: '/all-coupons', icon: 'https://cdn.grabon.in/gograbon/v8/icons/calendar-v3.svg' },
                { label: 'Deals', href: '/deals', icon: 'https://cdn.grabon.in/gograbon/v8/icons/header-deals.png' },
                { label: 'Blog', href: '/blog', icon: 'https://cdn.grabon.in/gograbon/v8/icons/header-blog-icon-v2.png' },
                              ].map((link) => (
                <Link key={link.label} href={link.href} onClick={closeDrawer}
                  className="flex items-center gap-3 px-5 py-4 text-base font-normal transition-colors no-underline border-b"
                  style={{ color: isDark ? mutedText : '#6b7280', borderColor: isDark ? borderColor : '#e5e7eb' }}
                  onMouseEnter={e => { e.currentTarget.style.color = isDark ? navText : primary; e.currentTarget.style.backgroundColor = isDark ? hoverBg : `${primary}12`; }}
                  onMouseLeave={e => { e.currentTarget.style.color = isDark ? mutedText : '#6b7280'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <img src={link.icon} alt="" className="w-5 h-5 object-contain shrink-0" style={{ filter: isDark ? 'brightness(0) invert(1)' : 'none' }} />
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

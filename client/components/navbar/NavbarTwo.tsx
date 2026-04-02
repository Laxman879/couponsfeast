'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Menu, X, ChevronDown, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { useDynamicTheme } from '@/components/DynamicThemeProvider';
import StoresDropdown from '@/components/layout/StoresDropdown';
import { searchCoupons, getStores, getCategories } from '@/services/api';

interface NavLink { name: string; url: string; hasDropdown?: boolean; }
interface NavbarTwoProps { navLinks: NavLink[]; config: any; }

export default function NavbarTwo({ navLinks, config }: NavbarTwoProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [storesDropdownOpen, setStoresDropdownOpen] = useState(false);
  const [mobileStoresOpen, setMobileStoresOpen] = useState(false);
  const [mobileCategories, setMobileCategories] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ coupons: any[]; stores: any[] }>({ coupons: [], stores: [] });
  const [searching, setSearching] = useState(false);
  const [allStores, setAllStores] = useState<any[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { siteConfig, darkPalette } = useDynamicTheme();

  const isDark = theme === 'dark';
  const navStyle = config?.style || 'solid';
  const navBgOverride = config?.bgColor;
  const navTextOverride = config?.textColor;
  const showSearch = config?.showSearch ?? true;
  const showThemeToggle = config?.showThemeToggle ?? true;
  const isSticky = config?.sticky ?? true;

  const getNavBg = () => {
    if (isDark) return darkPalette.cardBg;
    if (navBgOverride) return navBgOverride;
    switch (navStyle) {
      case 'gradient': return `linear-gradient(90deg, ${siteConfig?.theme?.primaryColor || '#7c3aed'}, ${siteConfig?.theme?.secondaryColor || '#9333ea'})`;
      case 'transparent': return 'rgba(0,0,0,0.3)';
      case 'white': return '#ffffff';
      case 'dark': return '#1f2937';
      default: return siteConfig?.theme?.primaryColor || '#7c3aed';
    }
  };

  const navBg = getNavBg();
  const navText = isDark ? darkPalette.text : (navTextOverride || (navStyle === 'white' ? '#111827' : '#ffffff'));
  const mobileBg = isDark ? darkPalette.bg : (siteConfig?.theme?.secondaryColor || '#9333ea');
  const primary = siteConfig?.theme?.primaryColor || '#7c3aed';

  const dropBg = isDark ? darkPalette.cardBg : '#ffffff';
  const dropText = isDark ? darkPalette.text : '#111827';
  const dropMuted = isDark ? (darkPalette.text + 'aa') : '#9ca3af';
  const dropHover = isDark ? darkPalette.bg : '#f9fafb';
  const dropBorder = isDark ? darkPalette.cardBg : '#f3f4f6';

  // Load stores and categories, refresh on CMS updates
  useEffect(() => {
    const load = () => {
      getStores().then(res => setAllStores(res.data?.data ?? res.data ?? [])).catch(() => {});
      getCategories().then(res => setMobileCategories(res.data?.data ?? res.data ?? [])).catch(() => {});
    };
    load();
    const onStorage = (e: StorageEvent) => { if (e.key === 'cms-updated') load(); };
    const onCustom = () => load();
    window.addEventListener('storage', onStorage);
    window.addEventListener('cms-updated', onCustom);
    return () => { window.removeEventListener('storage', onStorage); window.removeEventListener('cms-updated', onCustom); };
  }, []);

  // Close search dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const doSearch = useCallback((q: string) => {
    if (!q.trim()) { setResults({ coupons: [], stores: [] }); setSearching(false); return; }
    setSearching(true);
    const regex = new RegExp(q, 'i');
    const matchedStores = allStores.filter(s => regex.test(s.storeName || '')).slice(0, 5);

    searchCoupons(q).then(res => {
      const coupons = res.data?.coupons ?? [];
      setResults({ coupons: coupons.slice(0, 5), stores: matchedStores });
    }).catch(() => {
      setResults({ coupons: [], stores: matchedStores });
    }).finally(() => setSearching(false));
  }, [allStores]);

  const handleSearchChange = (val: string) => {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val), 300);
  };

  const goToStore = (store: any) => {
    setQuery(''); setSearchFocused(false);
    const domain = store.websiteUrl
      ? store.websiteUrl.replace(/https?:\/\/(www\.)?/, '').replace(/\/$/, '')
      : `${store.slug}.com`;
    router.push(`/view/${domain}`);
  };

  const goToCouponStore = (coupon: any) => {
    setQuery(''); setSearchFocused(false);
    const store = coupon.store;
    if (!store) return;
    const domain = store.websiteUrl
      ? store.websiteUrl.replace(/https?:\/\/(www\.)?/, '').replace(/\/$/, '')
      : `${store.slug}.com`;
    router.push(`/view/${domain}`);
  };

  const showDropdown = searchFocused && query.trim().length > 0;
  const hasResults = results.coupons.length > 0 || results.stores.length > 0;

  const renderSearchDropdown = () => {
    if (!showDropdown) return null;
    return (
      <div className="absolute top-full left-0 right-0 mt-2 rounded-xl shadow-2xl border overflow-hidden z-50 max-h-[400px] overflow-y-auto"
        style={{ backgroundColor: dropBg, borderColor: dropBorder }}>
        {searching && (
          <div className="px-4 py-3 text-sm" style={{ color: dropMuted }}>Searching...</div>
        )}
        {!searching && !hasResults && (
          <div className="px-4 py-6 text-center text-sm" style={{ color: dropMuted }}>No results for "{query}"</div>
        )}

        {results.stores.length > 0 && (
          <div>
            <div className="px-4 py-2 text-[10px] font-bold tracking-widest uppercase" style={{ color: dropMuted, backgroundColor: dropHover }}>Stores</div>
            {results.stores.map((store: any) => (
              <button key={store._id} onClick={() => goToStore(store)}
                className="w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left cursor-pointer bg-transparent border-none outline-none"
                style={{ color: dropText }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = dropHover)}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                {store.logo && (
                  <img src={store.logo.startsWith('http') ? store.logo : `http://localhost:5000${store.logo}`}
                    alt="" className="w-8 h-8 rounded-lg object-contain p-1" style={{ backgroundColor: dropHover }} />
                )}
                <div>
                  <p className="text-sm font-semibold">{store.storeName}</p>
                  {store.category && <p className="text-[10px]" style={{ color: dropMuted }}>{store.category}</p>}
                </div>
              </button>
            ))}
          </div>
        )}

        {results.coupons.length > 0 && (
          <div>
            <div className="px-4 py-2 text-[10px] font-bold tracking-widest uppercase" style={{ color: dropMuted, backgroundColor: dropHover }}>Coupons</div>
            {results.coupons.map((coupon: any) => (
              <button key={coupon._id} onClick={() => goToCouponStore(coupon)}
                className="w-full flex items-center justify-between gap-3 px-4 py-2.5 transition-colors text-left cursor-pointer bg-transparent border-none outline-none"
                style={{ color: dropText }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = dropHover)}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{coupon.title}</p>
                  <p className="text-[10px]" style={{ color: dropMuted }}>{coupon.store?.storeName || ''}</p>
                </div>
                {coupon.discount && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: `${primary}15`, color: primary }}>
                    {coupon.discount}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className={`${isSticky ? 'sticky top-0' : 'relative'} z-50`} style={{ background: navBg, color: navText }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            {siteConfig?.logos?.navbar ? (
              <img src={siteConfig.logos.navbar.startsWith('http') ? siteConfig.logos.navbar : `http://localhost:5000${siteConfig.logos.navbar}`} alt={siteConfig.siteName || 'Logo'} className="h-8 w-auto" />
            ) : (
              <span className="font-extrabold text-2xl tracking-tight" style={{ color: navText }}>
                {siteConfig?.siteName || 'CouponsFeast'}
              </span>
            )}
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1 ml-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.url || (link.url !== '/' && pathname.startsWith(link.url));
              return link.hasDropdown ? (
                <div key={link.name} className="relative"
                  onMouseEnter={() => setStoresDropdownOpen(true)}
                  onMouseLeave={() => setTimeout(() => setStoresDropdownOpen(false), 150)}
                >
                  <Link href={link.url}
                    className={`text-sm font-bold px-3 py-2 rounded-md transition-all duration-300 flex items-center gap-1 relative group no-underline cursor-pointer ${storesDropdownOpen || isActive ? 'bg-white/10' : 'hover:bg-white/10'}`}
                    style={{ color: navText }}
                    onClick={(e) => { e.preventDefault(); setStoresDropdownOpen(!storesDropdownOpen); }}
                  >
                    {link.name}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${storesDropdownOpen ? 'rotate-180' : ''}`} />
                    <span className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} style={{ backgroundColor: navText }} />
                  </Link>
                  {storesDropdownOpen && <StoresDropdown onClose={() => setStoresDropdownOpen(false)} />}
                </div>
              ) : (
                <Link key={link.name} href={link.url}
                  className={`text-sm font-bold px-3 py-2 rounded-md transition-all duration-300 flex items-center gap-1 relative group no-underline ${isActive ? 'bg-white/10' : 'hover:bg-white/10'}`}
                  style={{ color: navText }}
                >
                  {link.name}
                  <span className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} style={{ backgroundColor: navText }} />
                </Link>
              );
            })}
          </div>

          {/* Desktop Search */}
          {showSearch && (
            <div ref={searchRef} className="hidden md:flex flex-1 max-w-xs lg:max-w-sm mx-4 relative">
              <div className={`flex items-center w-full rounded-full px-4 py-2 transition-all border ${searchFocused ? 'bg-white shadow-lg border-white' : 'bg-white/10 border-white/20 hover:bg-white/15'}`}>
                <Search className="w-4 h-4 flex-shrink-0" style={{ color: searchFocused ? '#9ca3af' : navText + 'b3' }} />
                <input type="text" placeholder="Search stores, coupons..."
                  value={query}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm ml-2 w-full nav-search-input"
                  style={{ color: searchFocused ? '#111827' : navText }}
                  onFocus={() => setSearchFocused(true)}
                />
                {query && (
                  <button onClick={() => { setQuery(''); setResults({ coupons: [], stores: [] }); }}
                    className="p-0.5 hover:opacity-70 cursor-pointer bg-transparent border-none outline-none">
                    <X className="w-3.5 h-3.5" style={{ color: searchFocused ? '#6b7280' : navText }} />
                  </button>
                )}
              </div>
              {renderSearchDropdown()}
            </div>
          )}

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {showThemeToggle && (
              <div onClick={toggleTheme} className="hover:opacity-75 transition-opacity p-2 cursor-pointer">
                {isDark ? <Sun className="w-5 h-5" style={{ color: navText }} /> : <Moon className="w-5 h-5" style={{ color: navText }} />}
              </div>
            )}
            <div className="lg:hidden cursor-pointer" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-6 h-6 stroke-2" style={{ color: navText }} /> : <Menu className="w-6 h-6 stroke-2" style={{ color: navText }} />}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t px-4 pb-4" style={{ backgroundColor: mobileBg, borderColor: 'rgba(255,255,255,0.2)' }}>
          {/* Mobile Search */}
          <div className="relative my-3">
            <div className="flex items-center bg-white/15 rounded-full px-4 py-2.5">
              <Search className="w-4 h-4" style={{ color: navText + 'b3' }} />
              <input type="text" placeholder="Search stores, coupons..."
                value={query}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="bg-transparent border-none outline-none text-sm ml-2 w-full placeholder-white/60"
                style={{ color: navText }}
                onFocus={() => setSearchFocused(true)}
              />
              {query && (
                <button onClick={() => { setQuery(''); setResults({ coupons: [], stores: [] }); }}
                  className="p-0.5 cursor-pointer bg-transparent border-none outline-none">
                  <X className="w-3.5 h-3.5" style={{ color: navText }} />
                </button>
              )}
            </div>
            {showDropdown && (
              <div className="mt-2 rounded-xl shadow-lg border overflow-hidden max-h-[300px] overflow-y-auto"
                style={{ backgroundColor: dropBg, borderColor: dropBorder }}>
                {searching && <div className="px-4 py-3 text-sm" style={{ color: dropMuted }}>Searching...</div>}
                {!searching && !hasResults && <div className="px-4 py-4 text-center text-sm" style={{ color: dropMuted }}>No results</div>}
                {results.stores.map((store: any) => (
                  <button key={store._id} onClick={() => { goToStore(store); setMobileOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left cursor-pointer bg-transparent border-none outline-none"
                    style={{ color: dropText }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = dropHover)}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                    <p className="text-sm font-semibold">{store.storeName}</p>
                  </button>
                ))}
                {results.coupons.map((coupon: any) => (
                  <button key={coupon._id} onClick={() => { goToCouponStore(coupon); setMobileOpen(false); }}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-left cursor-pointer bg-transparent border-none outline-none"
                    style={{ color: dropText }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = dropHover)}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                    <p className="text-sm truncate">{coupon.title}</p>
                    {coupon.discount && <span className="text-xs font-bold flex-shrink-0" style={{ color: primary }}>{coupon.discount}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {navLinks.map((link) => {
            const isActive = pathname === link.url || (link.url !== '/' && pathname.startsWith(link.url));
            return link.hasDropdown ? (
              <div key={link.name}>
                <div className="flex items-center justify-between">
                  <Link href={link.url}
                    className={`flex-1 block text-sm font-bold px-4 py-4 rounded-lg transition-all duration-300 no-underline relative ${isActive ? 'border-l-4' : 'hover:bg-white/10'}`}
                    style={{ color: navText, borderLeftColor: isActive ? navText : 'transparent' }}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.name}
                  </Link>
                  <button
                    onClick={() => setMobileStoresOpen(!mobileStoresOpen)}
                    className="p-3 hover:bg-white/10 rounded-lg transition-colors cursor-pointer bg-transparent border-none outline-none">
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileStoresOpen ? 'rotate-180' : ''}`} style={{ color: navText }} />
                  </button>
                </div>
                {mobileStoresOpen && (
                  <div className="mx-2 mb-2 rounded-xl overflow-hidden bg-white/10 backdrop-blur">
                    {mobileCategories.length > 0 ? (
                      <div className="max-h-[250px] overflow-y-auto">
                        {mobileCategories.map((cat: any) => (
                          <Link key={cat._id} href={`/stores?category=${cat.slug}`}
                            className="block px-4 py-2.5 text-sm hover:bg-white/10 transition-colors no-underline"
                            style={{ color: navText }}
                            onClick={() => { setMobileOpen(false); setMobileStoresOpen(false); }}
                          >{cat.name}</Link>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-3 text-sm opacity-60" style={{ color: navText }}>Loading...</div>
                    )}
                    <Link href="/stores"
                      className="block px-4 py-2.5 text-sm font-bold border-t border-white/10 no-underline"
                      style={{ color: navText }}
                      onClick={() => { setMobileOpen(false); setMobileStoresOpen(false); }}
                    >View All Stores</Link>
                  </div>
                )}
              </div>
            ) : (
              <Link key={link.name} href={link.url}
                className={`block text-sm font-bold px-4 py-4 rounded-lg transition-all duration-300 no-underline relative ${isActive ? 'border-l-4' : 'hover:bg-white/10'}`}
                style={{ color: navText, borderLeftColor: isActive ? navText : 'transparent' }}
                onClick={() => setMobileOpen(false)}
              >
                <div className="flex items-center justify-between">
                  <span>{link.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}

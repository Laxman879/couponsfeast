'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Store, ChevronRight, ExternalLink } from 'lucide-react';
import { getStores, getCategories } from '@/services/api';
import { useDynamicTheme } from '@/components/DynamicThemeProvider';
import { useTheme } from '@/components/ThemeProvider';
import CategorySidebar from '@/components/categories/CategorySidebar';
import MobileNavTabs from '@/components/common/MobileNavTabs';
import FAQSection from '@/components/store/FAQSection';

const letters = ['ALL','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

export default function StoresPage() {
  const [stores, setStores] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [activeLetter, setActiveLetter] = useState('ALL');
  const [columns, setColumns] = useState(3);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setColumns(window.innerWidth < 640 ? 2 : 3);
  }, []);
  const router = useRouter();
  const { siteConfig, darkPalette } = useDynamicTheme();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const primary = siteConfig?.theme?.primaryColor || '#7c3aed';

  useEffect(() => {
    Promise.all([getStores(), getCategories()])
      .then(([storeRes, catRes]) => {
        setStores(storeRes.data?.data ?? storeRes.data ?? []);
        setCategories(catRes.data?.data ?? catRes.data ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = stores;
    if (activeLetter !== 'ALL') {
      list = list.filter(s => s.storeName?.charAt(0).toUpperCase() === activeLetter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(s => s.storeName?.toLowerCase().includes(q));
    }
    return list;
  }, [stores, activeLetter, search]);

  const serverUrl = 'http://localhost:5000';

  const gridClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
  }[columns] || 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';

  return (
    <div className="max-w-7xl mx-auto px-4 py-3">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 py-2">
        <Link href="/" className="text-primary hover:underline no-underline">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span>Stores</span>
      </div>

      {/* Stats Bar */}
      <div
        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px' }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Store className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Stores</h2>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 sm:ml-3">
            <div>
              <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">{stores.length}</p>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Total Stores</p>
            </div>
            <div>
              <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">{categories.length}</p>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Categories</p>
            </div>
          </div>
        </div>
        <p className="text-[10px] sm:text-xs text-green-600 font-medium">
          Verified On: {new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
        </p>
      </div>

      {/* Main Content */}
      <div className="mt-6 flex flex-col lg:flex-row gap-6">
        {/* Sidebar — desktop */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <CategorySidebar />
        </aside>

        {/* Mobile tabs */}
        <MobileNavTabs />

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Popular Stores */}
          {!loading && stores.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Popular Stores</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stores.slice(0, 4).map((store) => {
                  const rawLogo = store.logo || '';
                  const logo = rawLogo.startsWith('http') ? rawLogo : rawLogo ? `${serverUrl}${rawLogo}` : '';
                  return (
                    <Link key={store._id} href={`/${store.slug}-coupons`}
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:border-primary/30 transition-all cursor-pointer group text-center no-underline block"
                      style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px' }}>
                      <div className="flex justify-center mb-3">
                        <div className="w-14 h-14 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors overflow-hidden">
                          {logo ? (
                            <img src={logo} alt={store.storeName} className="w-full h-full object-cover" />
                          ) : (
                            <Store className="w-7 h-7 text-primary/70" />
                          )}
                        </div>
                      </div>
                      <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">{store.storeName}</h3>
                      {store.category && (
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">{store.category}</p>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Alphabet Filter */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">All Stores</h2>
              <div className="flex items-center gap-1 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
                {[2, 3].map((col) => (
                  <button
                    key={col}
                    title={`${col} Columns`}
                    onClick={() => setColumns(col)}
                    className={`p-2 transition-colors flex items-center gap-[2px] sm:hidden ${columns === col ? 'bg-primary text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  >
                    {Array.from({ length: col }).map((_, i) => (
                      <span key={i} className="block w-[3px] h-3.5 rounded-[1px]" style={{ backgroundColor: columns === col ? '#fff' : '#9ca3af' }} />
                    ))}
                  </button>
                ))}
                {[3, 4, 5].map((col) => (
                  <button
                    key={col}
                    title={`${col} Columns`}
                    onClick={() => setColumns(col)}
                    className={`p-2 transition-colors items-center gap-[2px] hidden sm:flex ${columns === col ? 'bg-primary text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  >
                    {Array.from({ length: col }).map((_, i) => (
                      <span key={i} className="block w-[3px] h-3.5 rounded-[1px]" style={{ backgroundColor: columns === col ? '#fff' : '#9ca3af' }} />
                    ))}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-1 flex-wrap overflow-x-auto">
                {letters.map((letter) => (
                  <button
                    key={letter}
                    onClick={() => setActiveLetter(letter)}
                    className={`w-7 h-7 rounded-full text-xs font-semibold flex items-center justify-center transition-colors shrink-0 ${
                      activeLetter === letter
                        ? 'bg-primary text-white'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {letter}
                  </button>
                ))}
              </div>
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                <input
                  placeholder="Search stores..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 text-xs border border-gray-200 dark:border-gray-700 rounded-md w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none px-3"
                />
              </div>
            </div>
          </div>

          {/* Store Grid */}
          {loading ? (
            <div className={`grid gap-4 ${gridClass}`}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-24 rounded-lg animate-pulse bg-gray-100 dark:bg-gray-700" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">No stores found</p>
              <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
                {search ? `No results for "${search}"` : 'No stores matching this filter'}
              </p>
            </div>
          ) : (
            <div className={`grid gap-4 ${gridClass}`} key={columns}>
              {filtered.map((store, i) => {
                const rawLogo = store.logo || '';
                const logo = rawLogo.startsWith('http') ? rawLogo : rawLogo ? `${serverUrl}${rawLogo}` : '';
                return (
                  <Link key={store._id} href={`/${store.slug}-coupons`} className="text-center cursor-pointer group no-underline block animate-scaleIn" style={{ animationDelay: `${i * 20}ms` }}>
                    <div
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden flex items-center justify-center hover:border-primary/30 transition-all h-[80px] p-3"
                      style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px' }}
                    >
                      {logo ? (
                        <img src={logo} alt={store.storeName} className="max-w-full max-h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <span className="text-lg font-bold text-primary">{store.storeName?.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-2 leading-tight">{store.storeName}</p>
                    {store.category && (
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{store.category}</p>
                    )}
                  </Link>
                );
              })}
            </div>
          )}

          <FAQSection heading="Stores - Frequently Asked Questions" pageType="stores" />
        </div>
      </div>
    </div>
  );
}

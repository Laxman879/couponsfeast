'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { getStores, getCategories } from '@/services/api';
import { useDynamicTheme } from '@/components/DynamicThemeProvider';
import { useTheme } from '@/components/ThemeProvider';
import FAQSection from '@/components/store/FAQSection';

export default function StoresPage() {
  const [stores, setStores] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { siteConfig, darkPalette } = useDynamicTheme();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const primary = siteConfig?.theme?.primaryColor || '#7c3aed';

  const pageBg = isDark ? darkPalette.bg : (siteConfig?.theme?.backgroundColor || '#faf8ff');
  const cardBg = isDark ? darkPalette.cardBg : '#ffffff';
  const textMain = isDark ? darkPalette.text : '#111827';
  const textMuted = isDark ? (darkPalette.text + 'aa') : '#6b7280';
  const borderCol = isDark ? darkPalette.cardBg : '#e5e7eb';

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
    if (activeCategory !== 'all') {
      list = list.filter(s => s.category?.toLowerCase() === activeCategory.toLowerCase());
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(s => s.storeName?.toLowerCase().includes(q));
    }
    return list;
  }, [stores, activeCategory, search]);

  const goToStore = (store: any) => {
    const domain = store.websiteUrl
      ? store.websiteUrl.replace(/https?:\/\/(www\.)?/, '').replace(/\/$/, '')
      : `${store.slug}.com`;
    router.push(`/view/${domain}`);
  };

  const serverUrl = 'http://localhost:5000';

  return (
    <div className="min-h-screen" style={{ backgroundColor: pageBg, color: textMain }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">All Stores</h1>
          <p className="text-sm" style={{ color: textMuted }}>
            Browse {stores.length} stores and find the best coupons & deals
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="flex items-center flex-1 rounded-full px-4 py-2.5 border" style={{ backgroundColor: cardBg, borderColor: borderCol }}>
            <Search className="w-4 h-4 flex-shrink-0" style={{ color: textMuted }} />
            <input
              type="text" placeholder="Search stores..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-sm ml-2 w-full"
              style={{ color: textMain }}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            <button
              onClick={() => setActiveCategory('all')}
              className="px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border-none cursor-pointer"
              style={activeCategory === 'all' ? { backgroundColor: primary, color: '#fff' } : { backgroundColor: cardBg, color: textMuted }}
            >All</button>
            {categories.map(cat => (
              <button
                key={cat._id}
                onClick={() => setActiveCategory(cat.name)}
                className="px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border-none cursor-pointer"
                style={activeCategory === cat.name ? { backgroundColor: primary, color: '#fff' } : { backgroundColor: cardBg, color: textMuted }}
              >{cat.name}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-32 rounded-xl animate-pulse" style={{ backgroundColor: cardBg }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg font-semibold">No stores found</p>
            <p className="text-sm mt-1" style={{ color: textMuted }}>
              {search ? `No results for "${search}"` : 'No stores in this category'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filtered.map(store => {
              const rawLogo = store.logo || '';
              const logo = rawLogo.startsWith('http') ? rawLogo : rawLogo ? `${serverUrl}${rawLogo}` : '';
              return (
                <div
                  key={store._id}
                  onClick={() => goToStore(store)}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border cursor-pointer transition-all hover:shadow-lg"
                  style={{ backgroundColor: cardBg, borderColor: borderCol }}
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center mb-3" style={{ backgroundColor: `${primary}10` }}>
                    {logo ? (
                      <img src={logo} alt={store.storeName} className="w-full h-full object-contain p-2" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    ) : (
                      <span className="text-lg font-bold" style={{ color: primary }}>{store.storeName?.charAt(0)}</span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-center line-clamp-1">{store.storeName}</p>
                  {store.category && (
                    <p className="text-[10px] mt-0.5" style={{ color: textMuted }}>{store.category}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <FAQSection heading="Stores - Frequently Asked Questions" pageType="stores" />
      </div>
    </div>
  );
}

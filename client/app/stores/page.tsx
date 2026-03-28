'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { getStores, getCategories } from '@/services/api';
import { useDynamicTheme } from '@/components/DynamicThemeProvider';
import { useTheme } from '@/components/ThemeProvider';

export default function StoresPage() {
  const [stores, setStores] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { siteConfig } = useDynamicTheme();
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
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">All Stores</h1>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Browse {stores.length} stores and find the best coupons & deals
          </p>
        </div>

        {/* Search + Category Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className={`flex items-center flex-1 rounded-full px-4 py-2.5 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              type="text" placeholder="Search stores..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className={`bg-transparent border-none outline-none text-sm ml-2 w-full ${isDark ? 'text-gray-100 placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border-none cursor-pointer ${activeCategory === 'all' ? 'text-white' : isDark ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'}`}
              style={activeCategory === 'all' ? { backgroundColor: primary } : {}}
            >All</button>
            {categories.map(cat => (
              <button
                key={cat._id}
                onClick={() => setActiveCategory(cat.name)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border-none cursor-pointer ${activeCategory === cat.name ? 'text-white' : isDark ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'}`}
                style={activeCategory === cat.name ? { backgroundColor: primary } : {}}
              >{cat.name}</button>
            ))}
          </div>
        </div>

        {/* Stores Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className={`h-32 rounded-xl animate-pulse ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg font-semibold">No stores found</p>
            <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
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
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border cursor-pointer transition-all hover:shadow-lg ${isDark ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-200 hover:border-gray-300'}`}
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
                    <p className={`text-[10px] mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{store.category}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

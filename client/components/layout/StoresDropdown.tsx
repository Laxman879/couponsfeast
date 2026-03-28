'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getCategories, getStores } from '@/services/api';
import { useDynamicTheme } from '@/components/DynamicThemeProvider';
import { useTheme } from '@/components/ThemeProvider';

interface Category { _id: string; name: string; slug: string; color: string; }
interface Store    { _id: string; storeName: string; slug: string; logo?: string; websiteUrl?: string; category?: string; }

export default function StoresDropdown({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const { siteConfig, darkPalette } = useDynamicTheme();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const primary = siteConfig?.theme?.primaryColor || '#7c3aed';

  const dropBg    = isDark ? darkPalette.cardBg : '#ffffff';
  const textColor = isDark ? darkPalette.text : '#374151';
  const mutedText = isDark ? (darkPalette.text + 'aa') : '#374151';
  const skelBg    = isDark ? darkPalette.cardBg : '#f3f4f6';

  const [categories, setCategories] = useState<Category[]>([]);
  const [allStores,  setAllStores]  = useState<Store[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [activeCat,  setActiveCat]  = useState<Category | null>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [catRes, storeRes] = await Promise.all([getCategories(), getStores()]);
        const cats   = catRes.data?.data   ?? catRes.data   ?? [];
        const stores = storeRes.data?.data ?? storeRes.data ?? [];
        const catList: Category[] = Array.isArray(cats) ? cats : [];
        setCategories(catList);
        setAllStores(Array.isArray(stores) ? stores : []);
        if (catList.length > 0) setActiveCat(catList[0]);
      } catch {
        const fallback: Category[] = [
          { _id: '1', name: 'Popular',     slug: 'popular',     color: '#7c3aed' },
          { _id: '2', name: 'Fashion',     slug: 'fashion',     color: '#ec4899' },
          { _id: '3', name: 'Electronics', slug: 'electronics', color: '#3b82f6' },
        ];
        setCategories(fallback);
        setActiveCat(fallback[0]);
        setAllStores([
          { _id: '1', storeName: 'Amazon',  slug: 'amazon',  websiteUrl: 'https://amazon.com',  category: 'Popular' },
          { _id: '2', storeName: 'Flipkart',slug: 'flipkart',websiteUrl: 'https://flipkart.com',category: 'Popular' },
          { _id: '3', storeName: 'Myntra',  slug: 'myntra',  websiteUrl: 'https://myntra.com',  category: 'Fashion' },
        ]);
      } finally { setLoading(false); }
    };
    load();
    const onStorage = (e: StorageEvent) => { if (e.key === 'cms-updated') load(); };
    const onCustom = () => load();
    window.addEventListener('storage', onStorage);
    window.addEventListener('cms-updated', onCustom);
    return () => { window.removeEventListener('storage', onStorage); window.removeEventListener('cms-updated', onCustom); };
  }, []);

  const categoryStores = activeCat
    ? allStores.filter(s =>
        s.category?.toLowerCase() === activeCat.name.toLowerCase() ||
        s.category?.toLowerCase() === activeCat.slug.toLowerCase()
      )
    : [];
  const displayStores = categoryStores.length > 0 ? categoryStores : allStores.slice(0, 10);

  const handleStoreClick = (store: Store) => {
    onClose();
    const domain = store.websiteUrl
      ? store.websiteUrl.replace(/https?:\/\/(www\.)?/, '').replace(/\/$/, '')
      : `${store.slug}.com`;
    router.push(`/view/${domain}`);
  };

  const handleMouseEnter = () => { if (leaveTimer.current) clearTimeout(leaveTimer.current); };
  const handleMouseLeave = () => { leaveTimer.current = setTimeout(onClose, 150); };

  if (loading) return (
    <div className="absolute top-full left-0 mt-0 shadow-lg z-50 flex" style={{ width: 384, backgroundColor: dropBg }}>
      <div className="w-36 p-3 space-y-2">
        {[1,2,3,4,5].map(i => <div key={i} className="h-6 rounded animate-pulse" style={{ backgroundColor: skelBg }} />)}
      </div>
      <div className="flex-1 p-3 space-y-2">
        {[1,2,3,4,5].map(i => <div key={i} className="h-6 rounded animate-pulse" style={{ backgroundColor: skelBg }} />)}
      </div>
    </div>
  );

  return (
    <div
      className="absolute top-full left-0 mt-0 shadow-lg z-50"
      style={{ width: 384, backgroundColor: dropBg }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex" style={{ minHeight: 280 }}>
        <div className="flex-shrink-0 pt-4 pb-2" style={{ width: 144 }}>
          {categories.map(cat => {
            const isActive = activeCat?._id === cat._id;
            return (
              <button
                key={cat._id}
                className="flex w-full cursor-pointer flex-row py-2 px-3 text-left text-sm transition-colors bg-transparent border-none outline-none"
                style={{
                  borderRight: isActive ? `4px solid ${primary}` : '4px solid transparent',
                  color: isActive ? primary : mutedText,
                  fontWeight: isActive ? 700 : 400,
                }}
                onMouseEnter={() => setActiveCat(cat)}
                onClick={() => setActiveCat(cat)}
              >
                {cat.name}
              </button>
            );
          })}
          <button
            onClick={() => { onClose(); router.push('/category'); }}
            className="block w-full text-left px-3 pb-6 pt-2 text-sm font-semibold hover:underline mt-1 bg-transparent border-none outline-none cursor-pointer"
            style={{ color: primary }}
          >
            All Categories
          </button>
        </div>

        <div className="flex-1 pt-2 pb-2 px-2 overflow-y-auto" style={{ maxHeight: 360 }}>
          <ul className="grid grid-cols-2 list-none p-0 m-0">
            {displayStores.slice(0, 10).map(store => (
              <li key={store._id} className="mt-2 py-1 px-2 list-none">
                <button
                  onClick={() => handleStoreClick(store)}
                  className="text-sm text-left w-full hover:underline transition-colors bg-transparent border-none outline-none cursor-pointer"
                  style={{ color: mutedText, textDecorationColor: primary }}
                  onMouseEnter={e => (e.currentTarget.style.color = primary)}
                  onMouseLeave={e => (e.currentTarget.style.color = mutedText)}
                >
                  {store.storeName}
                </button>
              </li>
            ))}
            <li className="mt-2 py-1 px-2 col-span-2 list-none">
              <button
                onClick={() => { onClose(); router.push('/view'); }}
                className="text-sm font-semibold hover:underline transition-colors bg-transparent border-none outline-none cursor-pointer"
                style={{ color: primary }}
              >
                All Stores
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

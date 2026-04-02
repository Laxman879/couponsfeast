'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ChevronUp, ChevronDown, Tag, CheckCircle, Zap } from 'lucide-react';
import { useDynamicTheme } from '@/components/DynamicThemeProvider';

interface Props {
  categoryName: string;
  stores: any[];
  categories: any[];
  selectedStores: string[];
  onStoreToggle: (s: string) => void;
  selectedCategories: string[];
  onCategoryToggle: (c: string) => void;
  totalCoupons: number;
  verifiedCount: number;
}

export default function CouponSidebar({ categoryName, stores, categories, selectedStores, onStoreToggle, selectedCategories, onCategoryToggle, totalCoupons, verifiedCount }: Props) {
  const { siteConfig } = useDynamicTheme();
  const primary = siteConfig?.theme?.primaryColor || '#7c3aed';

  const [storesOpen, setStoresOpen] = useState(true);
  const [catsOpen, setCatsOpen] = useState(true);
  const [search, setSearch] = useState('');

  const filteredStores = stores.filter(s => s.storeName?.toLowerCase().includes(search.toLowerCase()));
  const filteredCats = categories.filter(c => c.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <aside className="w-72 shrink-0 hidden lg:flex flex-col gap-0 text-base">
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search Filters"
          className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-base focus:outline-none focus:ring-2"
          style={{ focusRingColor: primary }}
        />
      </div>

      {/* Stores */}
      <div className="mb-4">
        <button onClick={() => setStoresOpen(o => !o)} className="flex items-center justify-between w-full font-bold text-gray-900 dark:text-gray-100 py-1 mb-2 text-lg">
          Stores
          {storesOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        {storesOpen && (
          <div className="space-y-2 pl-1 max-h-48 overflow-y-auto">
            {filteredStores.slice(0, 10).map(s => (
              <label key={s._id} className="flex items-center gap-2.5 cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 text-sm">
                <input
                  type="checkbox"
                  checked={selectedStores.includes(s.storeName)}
                  onChange={() => onStoreToggle(s.storeName)}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: primary }}
                />
                {s.storeName}
              </label>
            ))}
          </div>
        )}
      </div>

      <hr className="border-gray-200 dark:border-gray-700 mb-4" />

      {/* Categories */}
      <div className="mb-4">
        <button onClick={() => setCatsOpen(o => !o)} className="flex items-center justify-between w-full font-bold text-gray-900 dark:text-gray-100 py-1 mb-2 text-lg">
          Categories
          {catsOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        {catsOpen && (
          <div className="space-y-2 pl-1 max-h-48 overflow-y-auto">
            {filteredCats.slice(0, 10).map(c => (
              <label key={c._id} className="flex items-center gap-2.5 cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 text-sm">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(c.name)}
                  onChange={() => onCategoryToggle(c.name)}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: primary }}
                />
                {c.name}
              </label>
            ))}
          </div>
        )}
      </div>

      <hr className="border-gray-200 dark:border-gray-700 mb-4" />

      {/* Coupons Info */}
      <div className="mb-4">
        <p className="font-bold text-gray-900 dark:text-gray-100 mb-2 text-lg">Coupons Info</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 text-gray-500 dark:text-gray-400 text-sm">
            <Tag className="w-4 h-4" style={{ color: primary }} />
            <span>Coupons & Offers : <strong className="text-gray-900 dark:text-gray-100">{totalCoupons}</strong></span>
          </div>
          <div className="flex items-center gap-2.5 text-gray-500 dark:text-gray-400 text-sm">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Verified : <strong className="text-gray-900 dark:text-gray-100">{verifiedCount}</strong></span>
          </div>
          <div className="flex items-center gap-2.5 text-gray-500 dark:text-gray-400 text-sm">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span>Fresh Coupons : <strong className="text-gray-900 dark:text-gray-100">{Math.min(10, totalCoupons)}</strong></span>
          </div>
        </div>
      </div>

      <hr className="border-gray-200 dark:border-gray-700 mb-4" />

      {/* Related Categories */}
      <div className="mb-4">
        <p className="font-bold text-gray-900 dark:text-gray-100 mb-2 text-lg">Related Categories</p>
        <div className="space-y-2">
          {categories.slice(0, 6).map(c => (
            <Link key={c._id} href={`/coupons/${c.name?.toLowerCase().replace(/[&\/]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')}-coupons`}
              className="block text-sm no-underline" style={{ color: primary }}>
              {c.name} Coupons
            </Link>
          ))}
        </div>
      </div>

      <hr className="border-gray-200 dark:border-gray-700 mb-4" />

      {/* Top Stores */}
      <div className="mb-4">
        <p className="font-bold text-gray-900 dark:text-gray-100 mb-2 text-lg">Top {categoryName} Stores</p>
        <div className="space-y-2">
          {stores.slice(0, 6).map(s => (
            <Link key={s._id} href={`/coupons/${s.slug}-coupons`}
              className="block text-sm no-underline" style={{ color: primary }}>
              {s.storeName} Coupons
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}

'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import CategoryStats from '@/components/categories/CategoryStats';
import CategorySidebar from '@/components/categories/CategorySidebar';
import PopularCategories from '@/components/categories/PopularCategories';
import AlphabetFilter from '@/components/categories/AlphabetFilter';
import CategoryGrid from '@/components/categories/CategoryGrid';
import MobileNavTabs from '@/components/common/MobileNavTabs';

export default function CategoriesPage() {
  const [activeLetter, setActiveLetter] = useState('ALL');
  const [columns, setColumns] = useState(3);

  useEffect(() => {
    setColumns(window.innerWidth < 640 ? 2 : 3);
  }, []);
  const [search, setSearch] = useState('');

  return (
    <div className="max-w-7xl mx-auto px-4 py-3">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 py-2">
        <Link href="/" className="text-primary hover:underline no-underline">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span>Categories</span>
      </div>

      {/* Stats Bar */}
      <CategoryStats />

      {/* Main Content */}
      <div className="mt-6 flex flex-col lg:flex-row gap-6">
        {/* Sidebar — hidden on mobile, shown on lg */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <CategorySidebar />
        </aside>

        {/* Mobile sidebar nav */}
        <MobileNavTabs />

        {/* Main Grid */}
        <div className="flex-1 min-w-0">
          <PopularCategories />

          <AlphabetFilter
            activeLetter={activeLetter}
            onLetterChange={setActiveLetter}
            columns={columns}
            onColumnsChange={setColumns}
            search={search}
            onSearchChange={setSearch}
          />

          <CategoryGrid activeLetter={activeLetter} search={search} columns={columns} />
        </div>
      </div>
    </div>
  );
}

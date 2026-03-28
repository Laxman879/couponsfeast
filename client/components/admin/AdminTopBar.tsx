'use client';
import { usePathname } from 'next/navigation';
import { Search, Bell, RefreshCw } from 'lucide-react';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/admin/dashboard': { title: 'Dashboard', subtitle: 'Welcome back, Admin 👋' },
  '/admin/stores':    { title: 'Stores', subtitle: 'Manage your store listings' },
  '/admin/coupons':   { title: 'Coupons', subtitle: 'Create & manage discount coupons' },
  '/admin/banners':   { title: 'Banners', subtitle: 'Hero carousel management' },
  '/admin/cms':       { title: 'CMS & Config', subtitle: 'Site settings & content management' },
};

export default function AdminTopBar() {
  const pathname = usePathname();
  const page = pageTitles[pathname] ?? { title: 'Admin', subtitle: 'CouponsFeast Management' };

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-6 py-3 border-b"
      style={{
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(16px)',
        borderColor: 'rgba(99,102,241,0.1)',
        boxShadow: '0 1px 16px rgba(99,102,241,0.06)',
      }}
    >
      {/* Left: Page title */}
      <div>
        <h1 className="text-gray-900 font-bold text-lg leading-tight">{page.title}</h1>
        <p className="text-gray-400 text-xs">{page.subtitle}</p>
      </div>

      {/* Right: Search + actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden sm:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-8 pr-4 py-2 text-sm rounded-xl border outline-none transition-all w-44 focus:w-56"
            style={{
              background: 'rgba(99,102,241,0.05)',
              borderColor: 'rgba(99,102,241,0.15)',
              color: '#374151',
            }}
          />
        </div>

        {/* Refresh */}
        <button
          onClick={() => window.location.reload()}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105"
          style={{ background: 'rgba(99,102,241,0.08)', color: '#6366f1' }}
          title="Refresh"
        >
          <RefreshCw size={15} />
        </button>

        {/* Notifications */}
        <button
          className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105"
          style={{ background: 'rgba(99,102,241,0.08)', color: '#6366f1' }}
        >
          <Bell size={15} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2 border-white"
            style={{ background: '#6366f1' }}
          />
        </button>

        {/* Avatar */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:scale-105 transition-all"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 2px 8px rgba(99,102,241,0.35)' }}
        >
          A
        </div>
      </div>
    </header>
  );
}

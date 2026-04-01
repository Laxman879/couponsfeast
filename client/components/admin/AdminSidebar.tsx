'use client';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Store, Tag, Image, Settings, FileText,
  ChevronLeft, ChevronRight, Zap, LogOut, Bell, Menu, X, LayoutGrid, Flame,
  BookOpen, Megaphone, Link2, Hash,
} from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard',      label: 'Dashboard',      icon: LayoutDashboard, badge: null },
  { href: '/admin/stores',         label: 'Stores',          icon: Store,           badge: null },
  { href: '/admin/coupons',        label: 'Coupons',         icon: Tag,             badge: null },
  { href: '/admin/deals',          label: 'Deals',           icon: Flame,           badge: null },
  { href: '/admin/blog',           label: 'Blog Articles',   icon: BookOpen,        badge: null },
  { href: '/admin/promo-banners',  label: 'Promo Banners',   icon: Megaphone,       badge: null },
  { href: '/admin/popular-links',  label: 'Popular Links',   icon: Link2,           badge: null },
  { href: '/admin/categories',     label: 'Categories',      icon: LayoutGrid,      badge: null },
  { href: '/admin/tags',            label: 'Tags',             icon: Hash,            badge: null },
  { href: '/admin/banners',        label: 'Banners',         icon: Image,           badge: null },
  { href: '/admin/pages',          label: 'Pages',           icon: FileText,        badge: null },
  { href: '/admin/cms',            label: 'CMS & Config',    icon: Settings,        badge: null },
];

function SidebarInner({
  collapsed, setCollapsed, isMobile, onClose, pathname, onLogout,
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  isMobile: boolean;
  onClose: () => void;
  pathname: string;
  onLogout: () => void;
}) {
  const narrow = !isMobile && collapsed;

  return (
    <aside
      className={`
        flex flex-col h-screen relative transition-all duration-300 ease-in-out
        ${isMobile ? 'w-64' : collapsed ? 'w-[72px]' : 'w-60'}
        bg-white border-r border-slate-200
      `}
      style={{ boxShadow: isMobile ? '8px 0 32px rgba(0,0,0,0.12)' : '1px 0 0 #e2e8f0' }}
    >
      {/* ── Logo ── */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-slate-100 flex-shrink-0 ${narrow ? 'justify-center' : ''}`}>
        <Link href="/admin/dashboard" className="flex items-center gap-3 no-underline">
          <div className="w-9 h-9 flex-shrink-0 rounded-xl flex items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md shadow-indigo-200">
            <Zap size={17} className="text-white" />
          </div>
          {!narrow && (
            <div className="flex-1 min-w-0">
              <p className="text-slate-800 font-bold text-base leading-tight">CouponsFeast</p>
              <p className="text-indigo-400 text-[10px] font-semibold tracking-widest uppercase mt-0.5">Admin Panel</p>
            </div>
          )}
        </Link>
        {isMobile && (
          <button onClick={onClose} className="ml-auto p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all">
            <X size={16} />
          </button>
        )}
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 flex flex-col px-3 py-4 gap-1 overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
        {!narrow && (
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">
            Main Menu
          </p>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={narrow ? item.label : undefined}
              className={`
                group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                no-underline transition-all duration-200 relative
                ${narrow ? 'justify-center' : ''}
                ${isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }
              `}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-gradient-to-b from-indigo-500 to-violet-500" />
              )}
              <Icon
                size={18}
                className={`flex-shrink-0 transition-colors ${isActive ? 'text-indigo-500' : 'text-slate-400 group-hover:text-slate-600'}`}
              />
              {!narrow && (
                <>
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-600">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Divider ── */}
      <div className="mx-4 border-t border-slate-100" />

      {/* ── Bottom ── */}
      <div className="flex-shrink-0 px-3 py-3 flex flex-col gap-1">
        <button
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all text-sm font-medium ${narrow ? 'justify-center' : ''}`}
        >
          <Bell size={17} className="flex-shrink-0 text-slate-400" />
          {!narrow && <span>Notifications</span>}
        </button>

        <div onClick={onLogout} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-red-50 transition-all ${narrow ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center text-white text-sm font-bold bg-gradient-to-br from-indigo-500 to-violet-600 shadow-sm">
            A
          </div>
          {!narrow && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-slate-700 text-sm font-semibold truncate">Admin</p>
                <p className="text-slate-400 text-xs truncate">admin@couponsfeast.com</p>
              </div>
              <LogOut size={14} className="flex-shrink-0 text-red-400" />
            </>
          )}
        </div>
      </div>

      {/* ── Collapse toggle ── */}
      {!isMobile && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-16 z-10 w-6 h-6 rounded-full flex items-center justify-center text-white bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md shadow-indigo-200 ring-2 ring-white hover:scale-110 transition-transform"
        >
          {collapsed ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
        </button>
      )}
    </aside>
  );
}

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    router.push('/admin/login');
  };

  useEffect(() => { setMobileOpen(false); }, [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 w-10 h-10 rounded-xl flex items-center justify-center text-white bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-200"
      >
        <Menu size={18} />
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 flex self-stretch">
            <SidebarInner collapsed={false} setCollapsed={setCollapsed} isMobile onClose={() => setMobileOpen(false)} pathname={pathname} onLogout={handleLogout} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex self-stretch">
        <SidebarInner collapsed={collapsed} setCollapsed={setCollapsed} isMobile={false} onClose={() => {}} pathname={pathname} onLogout={handleLogout} />
      </div>
    </>
  );
}

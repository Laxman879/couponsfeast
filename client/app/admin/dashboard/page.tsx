'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminShell from '@/components/admin/AdminShell';
import { Store, Tag, TrendingUp, LayoutGrid, Plus, ArrowRight, CheckCircle, Activity, Zap, Image, ShoppingBag } from 'lucide-react';
import api from '@/services/api';

const card = 'rounded-2xl bg-white border border-slate-100 shadow-sm';

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.floor(hrs / 24)} day(s) ago`;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard/stats')
      .then(res => setStats(res.data?.data || res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const s = stats || {};

  const kpiCards = [
    { title: 'Total Stores',   value: s.totalStores ?? 0,      change: `+${s.storesThisMonth ?? 0} this month`,     icon: Store,      gradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)', lightBg: 'rgba(99,102,241,0.09)',  iconColor: '#6366f1' },
    { title: 'Active Coupons', value: s.totalCoupons ?? 0,      change: `+${s.couponsThisWeek ?? 0} this week`,       icon: Tag,        gradient: 'linear-gradient(135deg,#10b981,#059669)', lightBg: 'rgba(16,185,129,0.09)',  iconColor: '#10b981' },
    { title: 'Categories',     value: s.totalCategories ?? 0,   change: `+${s.categoriesThisMonth ?? 0} this month`,  icon: LayoutGrid, gradient: 'linear-gradient(135deg,#f59e0b,#d97706)', lightBg: 'rgba(245,158,11,0.09)', iconColor: '#f59e0b' },
    { title: 'Total Clicks',   value: s.totalClicks ?? 0,       change: `${s.totalBanners ?? 0} banners · ${s.totalDeals ?? 0} deals`, icon: TrendingUp, gradient: 'linear-gradient(135deg,#ec4899,#db2777)', lightBg: 'rgba(236,72,153,0.09)', iconColor: '#ec4899' },
  ];

  const managementCards = [
    { title: 'Manage Stores',     desc: 'Add, edit, or delete stores.',           href: '/admin/stores',      icon: Store,       color: '#6366f1', bg: 'rgba(99,102,241,0.08)' },
    { title: 'Manage Coupons',    desc: 'Create coupons, assign to stores.',      href: '/admin/coupons',     icon: Tag,         color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
    { title: 'Manage Banners',    desc: 'Hero carousel banners.',                 href: '/admin/banners',     icon: Image,       color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
    { title: 'Manage Categories', desc: 'Organize coupons into categories.',      href: '/admin/categories',  icon: LayoutGrid,  color: '#ec4899', bg: 'rgba(236,72,153,0.08)' },
    { title: 'Manage Deals',      desc: 'Product deals with images.',             href: '/admin/deals',       icon: ShoppingBag, color: '#0ea5e9', bg: 'rgba(14,165,233,0.08)' },
    { title: 'Site Settings',     desc: 'Branding, labels, theme, footer.',       href: '/admin/cms',         icon: Zap,         color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)' },
  ];

  const recentActivity = (s.recentActivity || []).map((item: any) => ({
    label: item.label,
    time: timeAgo(item.time),
    color: item.type === 'store' ? '#6366f1' : '#10b981',
  }));

  return (
    <AdminShell>
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
        <p className="text-base text-slate-500 mt-1">Real-time stats from your database.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-7">
        {kpiCards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.title} className={`${card} p-5 flex flex-col gap-4 hover:-translate-y-0.5 hover:shadow-md transition-all`}>
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: c.lightBg }}>
                  <Icon size={22} style={{ color: c.iconColor }} />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: c.lightBg, color: c.iconColor }}>
                  {c.change}
                </span>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-slate-800 leading-tight">
                  {loading ? <span className="inline-block w-16 h-8 bg-slate-100 animate-pulse rounded" /> : c.value.toLocaleString()}
                </p>
                <p className="text-base font-medium text-slate-500 mt-1">{c.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Management Cards + Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-7">
        <div className="xl:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-5">
          {managementCards.map((c) => {
            const Icon = c.icon;
            return (
              <Link key={c.title} href={c.href}
                className={`${card} no-underline group p-5 flex flex-col gap-3 hover:-translate-y-0.5 hover:shadow-md transition-all`}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: c.bg }}>
                  <Icon size={22} style={{ color: c.color }} />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-base">{c.title}</p>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">{c.desc}</p>
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold mt-auto" style={{ color: c.color }}>
                  Open <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className={`${card} p-5`}>
          <div className="flex items-center gap-2 mb-5">
            <Activity size={18} className="text-indigo-500" />
            <p className="font-bold text-slate-800 text-base">Recent Activity</p>
          </div>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No activity yet. Start by adding stores and coupons.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {recentActivity.map((item: any, i: number) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0" style={{ background: item.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 leading-snug">{item.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions + System Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className={`${card} p-5`}>
          <div className="flex items-center gap-2 mb-5">
            <Plus size={18} className="text-indigo-500" />
            <p className="font-bold text-slate-800 text-base">Quick Actions</p>
          </div>
          <div className="flex flex-col gap-2">
            {[
              { label: 'Add New Store',    href: '/admin/stores',     color: '#6366f1', bg: 'rgba(99,102,241,0.07)',  icon: Store },
              { label: 'Add New Coupon',   href: '/admin/coupons',    color: '#10b981', bg: 'rgba(16,185,129,0.07)', icon: Tag },
              { label: 'Add New Banner',   href: '/admin/banners',    color: '#f59e0b', bg: 'rgba(245,158,11,0.07)', icon: Image },
              { label: 'Add New Category', href: '/admin/categories', color: '#ec4899', bg: 'rgba(236,72,153,0.07)', icon: LayoutGrid },
              { label: 'Site Settings',    href: '/admin/cms',        color: '#8b5cf6', bg: 'rgba(139,92,246,0.07)', icon: Zap },
            ].map((a) => {
              const Icon = a.icon;
              return (
                <Link key={a.label} href={a.href}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl no-underline hover:scale-[1.01] transition-all"
                  style={{ background: a.bg }}>
                  <Icon size={16} style={{ color: a.color }} />
                  <span className="text-sm font-semibold flex-1" style={{ color: a.color }}>{a.label}</span>
                  <ArrowRight size={14} style={{ color: a.color }} />
                </Link>
              );
            })}
          </div>
        </div>

        <div className={`${card} p-5`}>
          <div className="flex items-center gap-2 mb-5">
            <CheckCircle size={18} className="text-emerald-500" />
            <p className="font-bold text-slate-800 text-base">System Status</p>
          </div>
          <div className="flex flex-col gap-2">
            {[{ label: 'API Server', status: 'Operational' }, { label: 'Database', status: 'Connected' }, { label: 'Frontend', status: 'Active' }].map((item) => (
              <div key={item.label} className="flex items-center justify-between px-4 py-3.5 rounded-xl bg-emerald-50">
                <span className="text-sm font-medium text-slate-700">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm font-semibold text-emerald-600">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

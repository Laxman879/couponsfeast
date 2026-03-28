'use client';
import Link from 'next/link';
import AdminShell from '@/components/admin/AdminShell';
import { Store, Tag, TrendingUp, LayoutGrid, Plus, ArrowRight, CheckCircle, Activity, Zap } from 'lucide-react';

const kpiCards = [
  { title: 'Total Stores',   value: '400+',   change: '+12 this month',     progress: 72, icon: Store,      gradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)', lightBg: 'rgba(99,102,241,0.09)',  iconColor: '#6366f1' },
  { title: 'Active Coupons', value: '1,200+', change: '+85 this week',      progress: 88, icon: Tag,        gradient: 'linear-gradient(135deg,#10b981,#059669)', lightBg: 'rgba(16,185,129,0.09)',  iconColor: '#10b981' },
  { title: 'Categories',     value: '25+',    change: '+3 new added',       progress: 50, icon: LayoutGrid, gradient: 'linear-gradient(135deg,#f59e0b,#d97706)', lightBg: 'rgba(245,158,11,0.09)', iconColor: '#f59e0b' },
  { title: 'Monthly Clicks', value: '15K+',   change: '+2.4K vs last month',progress: 65, icon: TrendingUp, gradient: 'linear-gradient(135deg,#ec4899,#db2777)', lightBg: 'rgba(236,72,153,0.09)',  iconColor: '#ec4899' },
];

const managementCards = [
  { title: 'Manage Stores',   description: 'Add, edit, or delete stores. Manage logos and store details.',          href: '/admin/stores',  icon: Store,      color: '#6366f1', bg: 'rgba(99,102,241,0.08)' },
  { title: 'Manage Coupons',  description: 'Create discount coupons, set expiry dates, assign to stores.',          href: '/admin/coupons', icon: Tag,        color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
  { title: 'CMS & Site Config',description: 'Manage navigation, categories, branding, and site settings.',         href: '/admin/cms',     icon: Zap,        color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
];

const recentActivity = [
  { label: 'New store "Nike" added',          time: '2 min ago',  color: '#6366f1' },
  { label: 'Coupon "SAVE20" created',         time: '15 min ago', color: '#10b981' },
  { label: 'Banner updated',                  time: '1 hr ago',   color: '#f59e0b' },
  { label: 'Category "Electronics" added',    time: '3 hr ago',   color: '#ec4899' },
  { label: 'Store "Adidas" updated',          time: '5 hr ago',   color: '#6366f1' },
];

const systemStatus = [
  { label: 'API Server', status: 'Operational' },
  { label: 'Database',   status: 'Connected'   },
  { label: 'Frontend',   status: 'Active'      },
];

const card = 'rounded-2xl bg-white border border-slate-100 shadow-sm';

export default function AdminDashboard() {
  return (
    <AdminShell>

      {/* Page heading */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
        <p className="text-base text-slate-500 mt-1">Monitor your coupon platform and manage all aspects of your business.</p>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-7">
        {kpiCards.map((card_) => {
          const Icon = card_.icon;
          return (
            <div key={card_.title} className={`${card} p-5 flex flex-col gap-4 hover:-translate-y-0.5 hover:shadow-md transition-all`}>
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: card_.lightBg }}>
                  <Icon size={22} style={{ color: card_.iconColor }} />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: card_.lightBg, color: card_.iconColor }}>
                  {card_.change}
                </span>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-slate-800 leading-tight">{card_.value}</p>
                <p className="text-base font-medium text-slate-500 mt-1">{card_.title}</p>
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-medium">
                  <span>Progress</span>
                  <span>{card_.progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${card_.progress}%`, background: card_.gradient }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Management Cards + Activity ── */}
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
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">{c.description}</p>
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
          <div className="flex flex-col gap-4">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0" style={{ background: item.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 leading-snug">{item.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Quick Actions + System Status ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

        {/* Quick Actions */}
        <div className={`${card} p-5`}>
          <div className="flex items-center gap-2 mb-5">
            <Plus size={18} className="text-indigo-500" />
            <p className="font-bold text-slate-800 text-base">Quick Actions</p>
          </div>
          <div className="flex flex-col gap-2">
            {[
              { label: 'Add New Coupon', href: '/admin/coupons', color: '#6366f1', bg: 'rgba(99,102,241,0.07)',  icon: Tag   },
              { label: 'Add New Store',  href: '/admin/stores',  color: '#10b981', bg: 'rgba(16,185,129,0.07)', icon: Store },
              { label: 'Site Settings',  href: '/admin/cms',     color: '#f59e0b', bg: 'rgba(245,158,11,0.07)', icon: Zap   },
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

        {/* System Status */}
        <div className={`${card} p-5`}>
          <div className="flex items-center gap-2 mb-5">
            <CheckCircle size={18} className="text-emerald-500" />
            <p className="font-bold text-slate-800 text-base">System Status</p>
          </div>
          <div className="flex flex-col gap-2">
            {systemStatus.map((item) => (
              <div key={item.label} className="flex items-center justify-between px-4 py-3.5 rounded-xl bg-emerald-50">
                <span className="text-sm font-medium text-slate-700">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm font-semibold text-emerald-600">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 px-4 py-3 rounded-xl bg-indigo-50 text-center">
            <p className="text-sm font-semibold text-indigo-600">All systems running normally ✓</p>
          </div>
        </div>

      </div>
    </AdminShell>
  );
}

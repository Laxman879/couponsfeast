'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Box, Paper, Typography, Avatar } from '@mui/material';
import { Dashboard, Store, LocalOffer, Settings, ViewCarousel } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { formatDate } from '@/utils/dateUtils';

export default function AdminNav() {
  const pathname = usePathname();
  const [currentDate, setCurrentDate] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  
  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: Dashboard },
    { href: '/admin/stores', label: 'Stores', icon: Store },
    { href: '/admin/coupons', label: 'Coupons', icon: LocalOffer },
    { href: '/admin/banners', label: 'Banners', icon: ViewCarousel },
    { href: '/admin/cms', label: 'CMS', icon: Settings },
  ];

  useEffect(() => {
    setCurrentDate(formatDate(new Date()));
    setMounted(true);
  }, []);

  return (
    <Paper className="mb-8 overflow-hidden" elevation={3}>
      {/* Header */}
      <Box className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="bg-white text-blue-600 w-10 h-10">
              <Dashboard />
            </Avatar>
            <div>
              <Typography variant="h5" className="font-bold">
                Admin Panel
              </Typography>
              <Typography variant="body2" className="opacity-90">
                CouponsFeast Management
              </Typography>
            </div>
          </div>
          <div className="text-right">
            <Typography variant="body2" className="opacity-90">
              Welcome back!
            </Typography>
            <Typography variant="caption" className="opacity-75">
              {mounted ? currentDate : ''}
            </Typography>
          </div>
        </div>
      </Box>
      
      {/* Navigation */}
      <Box className="p-4 bg-gray-50">
        <div className="flex flex-wrap gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-medium no-underline transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 shadow-sm hover:shadow-md'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </Box>
    </Paper>
  );
}
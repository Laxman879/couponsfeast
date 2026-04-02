'use client';
import { useEffect, useState } from 'react';
import { Grid3X3 } from "lucide-react";
import { getCategories, getCoupons } from '@/services/api';

export default function CategoryStats() {
  const [catCount, setCatCount] = useState(0);
  const [couponCount, setCouponCount] = useState(0);

  useEffect(() => {
    getCategories().then(res => {
      const data = res.data?.data ?? res.data ?? [];
      setCatCount(Array.isArray(data) ? data.length : 0);
    }).catch(() => {});
    getCoupons({ limit: 1 }).then(res => {
      const total = res.data?.total ?? (res.data?.data ?? res.data ?? []).length;
      setCouponCount(total);
    }).catch(() => {});
  }, []);

  const today = new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric', weekday: 'short' });

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px' }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Grid3X3 className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Categories</h2>
        </div>
        <div className="flex items-center gap-4 sm:gap-6 sm:ml-3">
          <div>
            <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">{catCount.toLocaleString()}</p>
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Total Categories</p>
          </div>
          <div>
            <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">{couponCount.toLocaleString()}</p>
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Total Coupons &amp; Offers</p>
          </div>
        </div>
      </div>
      <p className="text-[10px] sm:text-xs text-green-600 font-medium">Verified On: {today}</p>
    </div>
  );
}

import { Grid3X3 } from "lucide-react";

export default function CategoryStats() {
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
            <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">172</p>
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Total Categories</p>
          </div>
          <div>
            <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">98,634</p>
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Total Coupons &amp; Offers</p>
          </div>
        </div>
      </div>
      <p className="text-[10px] sm:text-xs text-green-600 font-medium">Verified On: 31 Mar 2026 (TUE)</p>
    </div>
  );
}

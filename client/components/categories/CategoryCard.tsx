import { LucideIcon, ExternalLink } from "lucide-react";
import Link from "next/link";

interface Props {
  icon: LucideIcon;
  name: string;
}

export default function CategoryCard({ icon: Icon, name }: Props) {
  const slug = name.toLowerCase().replace(/[&\/]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
  const cleanSlug = slug.replace(/-coupons$/, '');
  return (
    <Link href={`/coupons/${cleanSlug}-coupons`} className="text-center cursor-pointer group no-underline block">
      <div
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center justify-center hover:border-primary/30 transition-all min-h-[80px]"
        style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px' }}
      >
        <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
          <Icon className="w-6 h-6 text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors" />
        </div>
      </div>
      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-2 leading-tight flex items-center justify-center gap-1">
        {name}
        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-primary" />
      </p>
    </Link>
  );
}

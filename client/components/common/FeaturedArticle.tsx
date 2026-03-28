'use client';
import Link from 'next/link';
import { useDynamicTheme } from '@/components/DynamicThemeProvider';

interface SidebarItem {
  image: string;
  title: string;
  subtitle: string;
  slug: string;
}

interface FeaturedArticleProps {
  image: string;
  category: string;
  title: string;
  description: string;
  slug: string;
  basePath?: string;
  sidebarItems?: SidebarItem[];
}

export default function FeaturedArticle({
  image, category, title, description, slug, basePath = '/blog', sidebarItems = [],
}: FeaturedArticleProps) {
  const href = `${basePath}/${slug}`;
  const { siteConfig } = useDynamicTheme();
  const primary = siteConfig?.theme?.primaryColor || '#7c3aed';

  return (
    <div
      className="flex flex-col lg:grid lg:grid-cols-3 rounded-2xl overflow-hidden"
      style={{ backgroundColor: primary }}
    >
      {/* Featured - full bleed image */}
      <Link href={href} target="_blank" className="lg:col-span-2 block relative min-h-[200px] sm:min-h-[280px] md:min-h-[350px] lg:min-h-[400px] group cursor-pointer overflow-hidden">
        <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 flex flex-col gap-1">
          <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-white/70">{category}</span>
          <h2 className="text-base sm:text-xl md:text-2xl font-bold text-white leading-tight group-hover:underline underline-offset-4">{title}</h2>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed line-clamp-2">{description}</p>
        </div>
      </Link>

      {/* Sidebar - horizontal scroll on mobile, vertical on desktop */}
      {sidebarItems.length > 0 && (
        <div className="flex lg:flex-col gap-4 lg:gap-5 p-4 sm:p-5 lg:p-6 lg:justify-center overflow-x-auto lg:overflow-x-visible scrollbar-hide">
          {sidebarItems.map((item, idx) => (
            <Link key={idx} href={`${basePath}/${item.slug}`} target="_blank" className="flex items-center gap-3 lg:gap-4 group cursor-pointer flex-shrink-0 min-w-[220px] sm:min-w-[250px] lg:min-w-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex-shrink-0 rounded-xl overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div className="flex flex-col gap-0.5 min-w-0">
                <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-white group-hover:underline underline-offset-2 leading-tight line-clamp-2">{item.title}</h3>
                <p className="text-[10px] sm:text-xs text-white/70 line-clamp-1">{item.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

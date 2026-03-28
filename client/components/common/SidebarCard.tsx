'use client';
import Link from 'next/link';

interface SidebarCardProps {
  image: string;
  title: string;
  subtitle: string;
  slug: string;
  basePath?: string;
}

export default function SidebarCard({
  image,
  title,
  subtitle,
  slug,
  basePath = '/blog',
}: SidebarCardProps) {
  return (
    <Link
      href={`${basePath}/${slug}`}
      target="_blank"
      className="flex items-center gap-4 group cursor-pointer"
    >
      <div className="w-24 h-24 md:w-28 md:h-28 flex-shrink-0 rounded-2xl overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-extrabold uppercase tracking-wide text-gray-900 group-hover:text-primary transition-colors leading-tight">
          {title}
        </h3>
        <p className="text-xs text-gray-500">
          {subtitle}
        </p>
      </div>
    </Link>
  );
}

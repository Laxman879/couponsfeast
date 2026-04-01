'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getBlogArticles } from '@/services/api';
import { useDynamicTheme } from '@/components/DynamicThemeProvider';
import { useTheme } from '@/components/ThemeProvider';

export default function BlogPage() {
  const { siteConfig, darkPalette } = useDynamicTheme();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const primary = siteConfig?.theme?.primaryColor || '#7c3aed';
  const pageBg = isDark ? darkPalette.bg : '#f8fafc';
  const cardBg = isDark ? darkPalette.cardBg : '#ffffff';
  const textMain = isDark ? darkPalette.text : '#111827';
  const textMuted = isDark ? `${darkPalette.text}aa` : '#6b7280';
  const borderCol = isDark ? `${darkPalette.text}20` : '#e5e7eb';

  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlogArticles()
      .then(res => setArticles(res.data?.data ?? res.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: pageBg, color: textMain }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-1 text-xs mb-6" style={{ color: textMuted }}>
          <Link href="/" className="no-underline hover:underline" style={{ color: primary }}>Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span>Blog</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Blog</h1>
        <p className="text-sm mb-8" style={{ color: textMuted }}>Latest tips, guides & savings advice</p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="h-64 rounded-xl animate-pulse" style={{ backgroundColor: cardBg }} />)}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg font-semibold">No articles yet</p>
            <p className="text-sm mt-1" style={{ color: textMuted }}>Check back soon for new content</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article: any) => (
              <Link
                key={article._id}
                href={`/blog/${article.slug}`}
                className="rounded-xl overflow-hidden border no-underline transition-all hover:shadow-lg hover:-translate-y-1"
                style={{ backgroundColor: cardBg, borderColor: borderCol }}
              >
                {article.image && (
                  <img src={article.image} alt={article.title} className="w-full h-44 object-cover" />
                )}
                <div className="p-4">
                  {article.category && (
                    <span className="text-xs font-bold uppercase tracking-wide" style={{ color: primary }}>{article.category}</span>
                  )}
                  <h3 className="text-base font-bold mt-1 line-clamp-2" style={{ color: textMain }}>{article.title}</h3>
                  {article.subtitle && <p className="text-sm mt-1 line-clamp-2" style={{ color: textMuted }}>{article.subtitle}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

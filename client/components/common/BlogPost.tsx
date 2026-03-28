'use client';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import SectionHeader from '@/components/common/SectionHeader';

export interface BlogPostData {
  category: string;
  title: string;
  subtitle: string;
  image: string;
  content: string[];
}

interface BlogPostProps {
  post: BlogPostData | null;
  backHref?: string;
  backLabel?: string;
}

export default function BlogPost({
  post,
  backHref = '/',
  backLabel = 'Back to Home',
}: BlogPostProps) {
  if (!post) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-lg">Blog post not found.</p>
        <Link href={backHref} className="text-primary font-semibold hover:underline">
          ← {backLabel}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <SectionHeader />

        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {backLabel}
        </Link>

        <article className="flex flex-col gap-6">
          <div className="rounded-2xl overflow-hidden">
            <img src={post.image} alt={post.title} className="w-full h-auto object-cover" />
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold tracking-widest uppercase text-primary">
              {post.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
              {post.title}
            </h1>
            <p className="text-lg text-gray-500 font-medium">
              {post.subtitle}
            </p>
          </div>

          <div className="h-px bg-gray-200" />

          <div className="flex flex-col gap-5">
            {post.content.map((paragraph, idx) => (
              <p key={idx} className="text-base text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-8 p-6 bg-gray-50 rounded-2xl text-center">
            <p className="text-sm font-semibold text-gray-900 mb-2">
              Enjoyed this article?
            </p>
            <Link href={backHref} className="text-primary font-bold hover:underline text-sm">
              Browse more deals →
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}

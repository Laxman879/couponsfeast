'use client';
import Link from 'next/link';

interface SectionHeaderProps {
  title?: string;
  subtitle?: string;
  subtitleBold?: string;
  href?: string;
  dotColor?: string;
  titleColor?: string;
  subtitleColor?: string;
}

export default function SectionHeader({
  title = 'THE REAL DEAL',
  subtitle = 'by',
  subtitleBold = 'RetailMeNot',
  href = '/',
  dotColor = 'hsl(168, 55%, 38%)',
  titleColor = 'hsl(220, 60%, 25%)',
  subtitleColor = 'hsl(168, 55%, 38%)',
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col items-center py-8">
      <Link href={href} className="flex flex-col items-center gap-1 group">
        <div className="relative">
          <div className="absolute -top-3 -left-4 w-16 h-8 opacity-40">
            <svg viewBox="0 0 60 30" className="w-full h-full">
              {[...Array(18)].map((_, i) => (
                <circle
                  key={i}
                  cx={5 + (i % 6) * 10}
                  cy={5 + Math.floor(i / 6) * 10}
                  r="2"
                  fill={dotColor}
                />
              ))}
            </svg>
          </div>
          <h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black italic tracking-tight"
            style={{ fontFamily: "'Georgia', serif", color: titleColor }}
          >
            {title}
          </h1>
        </div>
        <span
          className="text-sm tracking-wide"
          style={{ fontFamily: "'Georgia', serif", fontStyle: 'italic', color: subtitleColor }}
        >
          {subtitle} <span className="font-semibold">{subtitleBold}</span>
        </span>
      </Link>
    </div>
  );
}

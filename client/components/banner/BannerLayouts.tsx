'use client';
import { useTheme } from '@/components/ThemeProvider';

export interface BannerData {
  _id?: string;
  title: string;
  label?: string;
  cta?: string;
  image?: string;
  secondaryImage?: string;
  bgColor?: string;
  textPanelBg?: string;
  textPanelMargin?: number;
  buttonLink?: string;
  storeUrl?: string;
  couponCode?: string;
  description?: string;
  discount?: string;
  store?: string;
  expiryDate?: string;
  type?: 'code' | 'sale' | 'cashback' | 'freeshipping';
  labelType?: string;
  interestedUsers?: number;
  addedBy?: string;
  details?: string;
  limitedTime?: boolean;
  expiringToday?: boolean;
  exclusive?: boolean;
  imagePosition?: string;
  isActive: boolean;
}

function isLightColor(hex: string): boolean {
  const c = hex.replace('#', '');
  if (c.length < 6) return true;
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 150;
}

export function BannerRenderer({ banner, onCtaClick }: { banner: any; onCtaClick?: () => void }) {
  const image = banner.image || banner.leftImage || banner.rightImage;
  const label = banner.label || banner.tag || banner.subtitle;
  const cta = banner.cta || banner.buttonText || 'Shop Now';
  const link = banner.buttonLink || '#';
  const bg = banner.bgColor || '#ffffff';
  const panelBgRaw = banner.textPanelBg || '#ffffff';
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const panelBg = isDark ? 'var(--dark-card-bg, #1f2937)' : panelBgRaw;
  const light = isDark ? false : isLightColor(panelBgRaw);

  const handleClick = (e: React.MouseEvent) => {
    if (onCtaClick) {
      e.preventDefault();
      onCtaClick();
    }
  };

  return (
    <div
      className="relative flex items-stretch min-h-[200px] sm:min-h-[280px] md:min-h-[340px] rounded-2xl overflow-hidden"
      style={{ backgroundColor: bg }}
    >
      {image && (
        <img src={image} alt={banner.title} className="absolute inset-0 w-full h-full object-cover" />
      )}
      <div className="absolute inset-0 bg-black/30" />
      {/* Panel: full width on mobile, auto width with margin on sm+ */}
      <div
        className="relative z-10 flex flex-col justify-center px-5 py-5 sm:px-8 sm:py-8 md:px-12 w-full sm:w-auto sm:max-w-[65%] md:max-w-[50%] lg:max-w-[40%] sm:ml-12 md:ml-20 lg:ml-24"
        style={{ backgroundColor: panelBg }}
      >
        {label && (
          <p className={`text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-2 sm:mb-3 ${light ? 'text-black/70' : 'text-white/70'}`}>{label}</p>
        )}
        <h2 className={`text-lg sm:text-xl md:text-2xl lg:text-[1.7rem] font-bold leading-tight mb-3 sm:mb-5 ${light ? 'text-black' : 'text-white'}`}>
          {banner.title}
        </h2>
        <a
          href={link}
          onClick={handleClick}
          className={`text-xs sm:text-sm font-bold underline underline-offset-4 decoration-2 transition-colors w-fit cursor-pointer ${light ? 'text-black hover:text-black/60' : 'text-white hover:text-white/70'}`}
        >
          {cta}
        </a>
      </div>
    </div>
  );
}

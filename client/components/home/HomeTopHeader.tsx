'use client';
import { Search, Bell, User } from "lucide-react";
import Link from "next/link";
import { useDynamicTheme } from "@/components/DynamicThemeProvider";

interface Props {
  onSearchClick?: () => void;
}

export default function HomeTopHeader({ onSearchClick }: Props) {
  const { siteConfig } = useDynamicTheme();
  const siteName = siteConfig?.siteName || "CouponsFeast";
  const primary = siteConfig?.theme?.primaryColor || "#7c3aed";

  return (
    <header className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 no-underline">
          {siteConfig?.logos?.navbar ? (
            <img
              src={siteConfig.logos.navbar.startsWith("http") ? siteConfig.logos.navbar : `http://localhost:5000${siteConfig.logos.navbar}`}
              alt={siteName}
              className="h-8 w-auto"
            />
          ) : (
            <div>
              <h1 className="text-2xl font-extrabold text-foreground tracking-tight" style={{ color: primary }}>
                {siteName}
              </h1>
              <p className="text-[9px] text-muted-foreground -mt-1 tracking-wider">SAVE ON EVERYTHING</p>
            </div>
          )}
        </Link>

        {/* Search Bar */}
        <button
          onClick={onSearchClick}
          className="flex-1 max-w-lg flex items-center gap-3 px-4 py-2.5 rounded-md border border-border bg-card text-muted-foreground text-sm cursor-pointer hover:border-primary/40 transition-colors"
        >
          <Search className="w-4 h-4 flex-shrink-0" />
          <span>Search for brands, categories</span>
        </button>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Bell className="w-5 h-5 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-orange-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
              4
            </span>
          </div>
          <button className="flex items-center gap-1.5 font-medium text-sm hover:underline" style={{ color: primary }}>
            <User className="w-4 h-4" />
            Login
          </button>
        </div>
      </div>
    </header>
  );
}

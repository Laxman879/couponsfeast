'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Grid3X3, Store, Tag, CalendarDays, Plus, Sparkles } from "lucide-react";
import { useDynamicTheme } from "@/components/DynamicThemeProvider";

const leftNav = [
  { icon: Store, label: "Stores", href: "/stores" },
  { icon: Grid3X3, label: "Categories", href: "/category" },
  { icon: CalendarDays, label: "Today's Deals", href: "#" },
  { icon: Tag, label: "Coupons", href: "#" },
];

const rightNav = [
  { icon: Plus, label: "Submit Coupon", href: "#" },
  { icon: Sparkles, label: "Deals Of The Day", href: "#" },
];

export default function HomeNavBar() {
  const pathname = usePathname();
  const { siteConfig } = useDynamicTheme();
  const primary = siteConfig?.theme?.primaryColor || "#7c3aed";

  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-1">
          {leftNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-1.5 px-3 py-3 text-sm font-medium transition-colors no-underline"
                style={{ color: isActive ? primary : undefined }}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-1">
          {rightNav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-1.5 px-3 py-3 text-sm font-medium text-foreground hover:text-primary transition-colors no-underline"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

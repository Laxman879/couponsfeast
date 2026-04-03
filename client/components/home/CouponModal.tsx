"use client";

import { Dialog, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
import { useDynamicTheme } from "@/components/DynamicThemeProvider";
import { useTheme } from "@/components/ThemeProvider";

interface CouponModalProps {
  open: boolean;
  handleClose: () => void;
  storeName: string;
  storeLogoUrl?: string;
  couponCode: string;
  dealTitle: string;
  cashbackPercentage: number;
  storeUrl: string;
}

export default function CouponModal({
  open,
  handleClose,
  storeName,
  storeLogoUrl,
  couponCode,
  dealTitle,
  cashbackPercentage,
  storeUrl
}: CouponModalProps) {
  const [copied, setCopied] = useState(false);
  const { siteConfig, darkPalette } = useDynamicTheme();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const primary = siteConfig?.theme?.primaryColor || '#7c3aed';
  const accent = (siteConfig?.theme as any)?.accentColor || '#f59e0b';
  const modalBg = isDark ? darkPalette.cardBg : '#ffffff';
  const textColor = isDark ? darkPalette.text : '#111827';
  const subText = isDark ? (darkPalette.text + 'aa') : '#6b7280';
  const borderColor = isDark ? darkPalette.cardBg : '#e5e7eb';
  const cashbackBg = isDark ? darkPalette.bg : '#dbeafe';
  const cashbackText = isDark ? darkPalette.text : '#1e40af';
  const inputBg = isDark ? darkPalette.cardBg : '#ffffff';
  const inputText = isDark ? darkPalette.text : '#111827';

  // Auto-copy code when modal opens
  useEffect(() => {
    if (open && couponCode) {
      navigator.clipboard.writeText(couponCode).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }).catch(() => {});
    }
  }, [open, couponCode]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className: "rounded-2xl p-4",
        style: { backgroundColor: modalBg, color: textColor }
      }}
    >
      <DialogContent className="relative text-center">
        {/* Close Button */}
        <IconButton
          onClick={handleClose}
          className="!absolute right-2 top-2"
        >
          <CloseIcon />
        </IconButton>

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: primary }}>
            {storeLogoUrl ? (
              <img src={storeLogoUrl} alt={storeName} className="w-full h-full rounded-full object-cover" />
            ) : (
              storeName.substring(0, 3).toUpperCase()
            )}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl md:text-2xl font-bold mb-4" style={{ color: textColor }}>
          {dealTitle}
        </h2>

        {/* Coupon Box */}
        <div className="flex items-center justify-between rounded-full p-1 max-w-sm mx-auto mb-3" style={{ border: `1px solid ${borderColor}` }}>
          <span className="px-4 font-semibold text-lg" style={{ color: textColor }}>{couponCode}</span>
          <button
            onClick={handleCopy}
            className="text-white px-6 py-2 rounded-full font-semibold transition"
            style={{ backgroundColor: copied ? accent : primary }}
          >
            {copied ? "COPIED" : "COPY"}
          </button>
        </div>

        {/* Text */}
        <p className="text-sm mb-6" style={{ color: subText }}>
          Copy and paste this code at{" "}
          <span
            className="underline cursor-pointer"
            style={{ color: primary }}
            onClick={() => window.open(storeUrl, '_blank')}
          >
            {storeName}
          </span>
        </p>

        {/* Cashback Box */}
        <div className="rounded-xl p-6" style={{ backgroundColor: cashbackBg }}>
          <p className="text-xs tracking-widest font-semibold mb-2" style={{ color: cashbackText }}>
            SAVE EVEN MORE
          </p>

          <h3 className="text-xl md:text-2xl font-bold mb-3" style={{ color: textColor }}>
            Add {cashbackPercentage}% cash back to this offer
          </h3>

          <p className="text-sm mb-4" style={{ color: subText }}>
            By continuing, you agree to our{" "}
            <span className="underline" style={{ color: primary }}><a href="/terms-and-conditions" style={{ color: 'inherit' }}>Terms & Conditions</a></span> and{" "}
            <span className="underline" style={{ color: primary }}><a href="/privacy-policy" style={{ color: 'inherit' }}>Privacy Policy</a></span>
          </p>

          {/* Email */}
          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-3 rounded-md mb-4 outline-none"
            style={{ backgroundColor: inputBg, color: inputText, border: `1px solid ${borderColor}` }}
          />

          {/* CTA */}
          <button
            className="w-full text-white py-3 rounded-full font-semibold transition hover:opacity-90"
            style={{ backgroundColor: primary }}
          >
            Activate {cashbackPercentage}% cash back
          </button>

          <p className="text-sm mt-4" style={{ color: subText }}>
            Or{" "}
            <span className="underline cursor-pointer" style={{ color: primary }}>
              continue with social accounts
            </span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
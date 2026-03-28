'use client';
import PromoBanner from '@/components/common/PromoBanner';

export default function StickyPromoBanner() {
  return (
    <div className="fixed bottom-0 left-0 right-0 px-4 pb-4" style={{ zIndex: 1000 }}>
      <div className="max-w-7xl mx-auto">
        <PromoBanner closable placement="sticky" />
      </div>
    </div>
  );
}

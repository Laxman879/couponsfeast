'use client';

import { Box, Card, Chip, Typography } from '@mui/material';
import Link from 'next/link';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { useState, useEffect } from 'react';
import { getCoupons, getPage, trackClick } from '@/services/api';
import PromoModal from '@/components/coupon/PromoModal';

interface Deal {
  _id: string;
  title: string;
  description: string;
  discount: string;
  code?: string;
  store: {
    storeName: string;
    logo?: string;
  };
  expiryDate: string;
  clickCount: number;
  isActive: boolean;
}

interface PageSection {
  id: string;
  type: string;
  title: string;
  content?: string;
  limit?: number;
  order: number;
}

export default function TrendingDeals() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [modalDeal, setModalDeal] = useState<Deal | null>(null);
  const [sectionTitle, setSectionTitle] = useState('🔥 Trending Deals');
  const [sectionSubtitle, setSectionSubtitle] = useState('Hot offers you don\'t want to miss');
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch page configuration to get section settings
        const pageResponse = await getPage('home');
        const trendingSection = pageResponse.data?.sections?.find(
          (section: PageSection) => section.type === 'trendingCoupons'
        );
        
        if (trendingSection) {
          if (trendingSection.title) setSectionTitle(trendingSection.title);
          if (trendingSection.content) setSectionSubtitle(trendingSection.content);
          if (trendingSection.limit) setLimit(trendingSection.limit);
        }

        // Fetch trending coupons data
        const response = await getCoupons({ 
          limit: limit,
          sortBy: 'clickCount',
          sortOrder: 'desc'
        });
        setDeals(response.data || []);
      } catch (error) {
        console.error('Error fetching trending deals:', error);
        // No fallback data - just empty array
        setDeals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [limit]);

  if (loading) {
    return (
      <Box className="mb-16">
        <Box className="flex items-center justify-between mb-8">
          <Box>
            <Typography variant="h5" className="font-bold mb-2">
              {sectionTitle}
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              {sectionSubtitle}
            </Typography>
          </Box>
        </Box>
        <Box className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-48 bg-gray-200 animate-pulse rounded-lg" />
          ))}
        </Box>
      </Box>
    );
  }

  if (deals.length === 0) {
    return null;
  }

  const getStoreColor = (storeName: string) => {
    const colors = {
      'Nike': '#000000',
      'Sephora': '#000000',
      'Best Buy': '#0046BE',
      'Target': '#CC0000',
      'Macy\'s': '#E21A2C'
    };
    return colors[storeName as keyof typeof colors] || '#6366f1';
  };

  return (
    <Box className="mb-16">
      <Box className="flex items-center justify-between mb-8">
        <Box>
          <Typography variant="h5" className="font-bold mb-2">
            {sectionTitle}
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            {sectionSubtitle}
          </Typography>
        </Box>
        <Link href="/deals" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 underline">
          View All Deals
        </Link>
      </Box>

      <Box className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {deals.slice(0, limit).map((deal) => (
          <div key={deal._id} className="cursor-pointer" onClick={() => {
            trackClick(deal._id).catch(() => {});
            const storeUrl = deal.store?.websiteUrl || '';
            if (storeUrl) window.open(storeUrl, '_blank', 'noopener,noreferrer');
            setModalDeal(deal);
          }}>
            <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
              <Box className="absolute top-3 left-3 z-10">
                <Chip
                  icon={<LocalFireDepartmentIcon />}
                  label={deal.discount}
                  size="small"
                  className="bg-red-500 text-white font-bold"
                />
              </Box>

              <Box
                className="h-32 flex items-center justify-center text-white text-4xl font-bold"
                sx={{ bgcolor: getStoreColor(deal.store.storeName) }}
              >
                {deal.store.logo ? (
                  <img 
                    src={deal.store.logo} 
                    alt={deal.store.storeName}
                    className="w-16 h-16 object-contain"
                  />
                ) : (
                  deal.store.storeName.charAt(0)
                )}
              </Box>

              <Box className="p-4">
                <Typography className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  {deal.store.storeName}
                </Typography>
                <Typography className="text-sm font-semibold mb-3 line-clamp-2">
                  {deal.title}
                </Typography>
                <Box className="flex items-center justify-between">
                  {deal.code && (
                    <Chip
                      icon={<ConfirmationNumberIcon />}
                      label="Coupon Code"
                      size="small"
                      className="bg-indigo-50 text-indigo-700 font-semibold"
                    />
                  )}
                  <Typography variant="caption" className="text-gray-500">
                    {deal.clickCount} uses
                  </Typography>
                </Box>
              </Box>
            </Card>
          </div>
        ))}
      </Box>

      {modalDeal && (
        <PromoModal
          onClose={() => setModalDeal(null)}
          title={modalDeal.title}
          code={modalDeal.code}
          discount={modalDeal.discount}
          storeName={modalDeal.store?.storeName}
          storeLogo={modalDeal.store?.logo}
          storeUrl={modalDeal.store?.websiteUrl}
          expiryDate={modalDeal.expiryDate}
          details={modalDeal.description}
        />
      )}
    </Box>
  );
}

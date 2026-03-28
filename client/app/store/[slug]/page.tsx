'use client';
import { useEffect, useState } from 'react';
import { Typography, Box } from '@mui/material';
import Container from '@/components/layout/Container';
import CouponGrid from '@/components/coupon/CouponGrid';
import { getStoreBySlug, getCoupons } from '@/services/api';

export default function StorePage({ params }: { params: { slug: string } }) {
  const [store, setStore] = useState<any>(null);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storeRes = await getStoreBySlug(params.slug);
        setStore(storeRes.data);
        
        const couponsRes = await getCoupons({ store: storeRes.data._id });
        setCoupons(couponsRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [params.slug]);

  if (loading) return <Container><Typography>Loading...</Typography></Container>;
  if (!store) return <Container><Typography>Store not found</Typography></Container>;

  return (
    <Container>
      <Box className="mb-8">
        <Typography variant="h3" className="font-bold mb-4">
          {store.name}
        </Typography>
        {store.description && (
          <Typography variant="body1" color="text.secondary">
            {store.description}
          </Typography>
        )}
      </Box>

      <CouponGrid coupons={coupons} />
    </Container>
  );
}

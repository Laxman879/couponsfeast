'use client';
import React, { memo } from 'react';
import { Grid, CircularProgress, Box, Typography } from '@mui/material';
import CouponCard from './CouponCard';

interface CouponGridProps {
  coupons: any[];
  loading?: boolean;
}

const CouponGrid: React.FC<CouponGridProps> = ({ coupons, loading }) => {
  if (loading) {
    return (
      <Box className="flex justify-center py-12">
        <CircularProgress />
      </Box>
    );
  }

  if (!coupons || coupons.length === 0) {
    return (
      <Box className="text-center py-12">
        <Typography variant="h6" color="text.secondary">
          No coupons available
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {coupons.map((coupon) => (
        <Grid item xs={12} sm={6} md={4} key={coupon._id}>
          <CouponCard coupon={coupon} />
        </Grid>
      ))}
    </Grid>
  );
};

export default memo(CouponGrid);

'use client';
import React, { memo } from 'react';
import { Grid, CircularProgress, Box, Typography } from '@mui/material';
import StoreCard from './StoreCard';

interface StoreGridProps {
  stores: any[];
  loading?: boolean;
}

const StoreGrid: React.FC<StoreGridProps> = ({ stores, loading }) => {
  if (loading) {
    return (
      <Box className="flex justify-center py-12">
        <CircularProgress />
      </Box>
    );
  }

  if (!stores || stores.length === 0) {
    return (
      <Box className="text-center py-12">
        <Typography variant="h6" color="text.secondary">
          No stores available
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {stores.map((store) => (
        <Grid item xs={12} sm={6} md={3} key={store._id}>
          <StoreCard store={store} />
        </Grid>
      ))}
    </Grid>
  );
};

export default memo(StoreGrid);

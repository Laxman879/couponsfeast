import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import { Store } from '@mui/icons-material';
import Link from 'next/link';

interface StoreCardProps {
  store: {
    _id: string;
    storeName: string;
    slug: string;
    description: string;
    logoUrl: string;
    websiteUrl: string;
    isActive: boolean;
  };
  showAdminActions?: boolean;
  onEdit?: (storeId: string) => void;
  onDelete?: (storeId: string) => void;
}

const StoreCard: React.FC<StoreCardProps> = ({
  store,
  showAdminActions = false,
  onEdit,
  onDelete
}) => {
  return (
    <Card
      sx={{
        maxWidth: 345,
        m: 2,
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3
        }
      }}
    >
      <CardMedia
        component="img"
        height="140"
        image={store.logoUrl || '/images/default-store.png'}
        alt={store.storeName}
        sx={{ objectFit: 'contain', p: 2 }}
      />

      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          <Store sx={{ mr: 1, verticalAlign: 'middle' }} />
          {store.storeName}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {store.description}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Link href={`/view/${store.websiteUrl ? store.websiteUrl.replace(/https?:\/\/(www\.)?/, '').replace(/\/$/, '') : `${store.slug}.com`}`} passHref>
            <Button variant="contained" size="small">
              View Store
            </Button>
          </Link>

          <Button
            variant="outlined"
            size="small"
            href={store.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit Website
          </Button>

          {showAdminActions && (
            <>
              <Button
                variant="outlined"
                size="small"
                color="primary"
                onClick={() => onEdit?.(store._id)}
              >
                Edit
              </Button>

              <Button
                variant="outlined"
                size="small"
                color="error"
                onClick={() => onDelete?.(store._id)}
              >
                Delete
              </Button>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default StoreCard;

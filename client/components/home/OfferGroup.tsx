import { Box, Typography } from '@mui/material';
import Link from 'next/link';
import OfferTile from './OfferTile';

interface Offer {
  id: string;
  logo: string;
  storeName: string;
  title: string;
  discount: string;
  link: string;
  type?: 'sale' | 'coupon' | 'cashback';
  bgColor?: string;
}

interface OfferGroupProps {
  title: string;
  offers: Offer[];
  viewAllLink?: string;
  viewAllText?: string;
}

export default function OfferGroup({ title, offers, viewAllLink, viewAllText }: OfferGroupProps) {
  return (
    <Box className="mb-16 max-w-6xl mx-auto px-4">
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h5" className="font-bold capitalize">
          {title}
        </Typography>
        {viewAllLink && (
          <Link href={viewAllLink} className="text-xs font-semibold uppercase tracking-widest underline">
            {viewAllText || 'View All'}
          </Link>
        )}
      </Box>
      
      <Box className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {offers.map((offer) => (
          <OfferTile key={offer.id} {...offer} />
        ))}
      </Box>
    </Box>
  );
}

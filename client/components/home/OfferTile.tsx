import { Box, Card, Chip, Typography } from '@mui/material';
import Link from 'next/link';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

interface OfferTileProps {
  logo: string;
  storeName: string;
  title: string;
  discount: string;
  link: string;
  type?: 'sale' | 'coupon' | 'cashback';
  bgColor?: string;
}

export default function OfferTile({ logo, storeName, title, discount, link, type = 'sale', bgColor = '#fff' }: OfferTileProps) {
  return (
    <Link href={link}>
      <Card className="h-32 md:h-auto md:min-h-[278px] flex md:flex-col hover:shadow-lg transition-shadow relative">
        <Box className="absolute top-2 left-2 z-10">
          <Chip
            icon={<LocalFireDepartmentIcon />}
            label={discount}
            size="small"
            className="bg-white font-bold"
          />
        </Box>
        
        <Box
          className="w-36 md:w-full md:h-32 flex items-center justify-center p-4 rounded-xl md:rounded-none border md:border-0"
          sx={{ bgcolor: bgColor }}
        >
          <img src={logo} alt={storeName} className="max-w-full max-h-full object-contain" />
        </Box>

        <Box className="flex-1 p-2 flex flex-col">
          <Typography variant="caption" className="uppercase font-bold tracking-wide">
            {storeName}
          </Typography>
          <Typography variant="body2" className="my-2 line-clamp-2 md:line-clamp-3">
            {title}
          </Typography>
          {type === 'coupon' && (
            <Chip label="Coupon code" size="small" className="mt-auto self-start" />
          )}
          {type === 'cashback' && (
            <Chip label="Cash Back" size="small" className="mt-auto self-start" />
          )}
        </Box>
      </Card>
    </Link>
  );
}

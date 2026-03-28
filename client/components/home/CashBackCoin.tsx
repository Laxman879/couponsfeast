import { Box, Typography } from '@mui/material';
import Link from 'next/link';

interface CashBackCoinProps {
  logo: string;
  name: string;
  cashback: string;
  link: string;
  bgColor?: string;
}

export default function CashBackCoin({ logo, name, cashback, link, bgColor = '#fff' }: CashBackCoinProps) {
  return (
    <Link href={link} className="group flex flex-col items-center">
      <Box
        className="w-32 h-32 rounded-full border flex items-center justify-center p-5 mb-3 transition-shadow hover:shadow-xl"
        sx={{ bgcolor: bgColor }}
      >
        <img src={logo} alt={name} className="w-full h-full object-contain" />
      </Box>
      <Typography variant="caption" className="text-center max-w-28 group-hover:underline">
        <strong className="mr-1">{cashback}</strong>
        Cash Back
      </Typography>
    </Link>
  );
}

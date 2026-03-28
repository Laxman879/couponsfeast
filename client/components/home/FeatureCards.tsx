import { Box, Card, Typography } from '@mui/material';
import Link from 'next/link';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

interface FeatureCardProps {
  storeName: string;
  title: string;
  discount: string;
  link: string;
  gradient: string;
}

const features: FeatureCardProps[] = [
  {
    storeName: 'Amazon',
    title: 'Up to 50% Off Electronics',
    discount: '50% OFF',
    link: '/store/amazon',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    storeName: 'Target',
    title: 'Extra 20% Off Home Decor',
    discount: '20% OFF',
    link: '/store/target',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  {
    storeName: 'Walmart',
    title: 'Free Shipping on Orders $35+',
    discount: 'FREE SHIP',
    link: '/store/walmart',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
];

export default function FeatureCards() {
  return (
    <Box className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
      {features.map((feature, idx) => (
        <Link href={feature.link} key={idx}>
          <Card className="h-[200px] relative overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <Box
              className="absolute inset-0 opacity-90 group-hover:opacity-100 transition-opacity"
              sx={{ background: feature.gradient }}
            />
            <Box className="relative h-full flex flex-col justify-between p-6 text-white">
              <Box className="flex items-center justify-between">
                <Typography className="text-sm font-bold uppercase tracking-wider opacity-90">
                  {feature.storeName}
                </Typography>
                <Box className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <Typography className="text-xs font-bold">{feature.discount}</Typography>
                </Box>
              </Box>
              
              <Typography className="text-2xl font-bold leading-tight">
                {feature.title}
              </Typography>
              
              <Box className="flex items-center gap-2 text-sm font-semibold">
                <span>Shop Now</span>
                <LocalOfferIcon sx={{ fontSize: 18 }} />
              </Box>
            </Box>
          </Card>
        </Link>
      ))}
    </Box>
  );
}

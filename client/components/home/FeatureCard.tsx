import { Box, Card, CardContent, Typography } from '@mui/material';
import Link from 'next/link';

interface FeatureCardProps {
  logo: string;
  title: string;
  description: string;
  link: string;
  image: string;
  bgColor?: string;
}

export default function FeatureCard({ logo, title, description, link, image, bgColor = '#fff' }: FeatureCardProps) {
  return (
    <Link href={link} className="block">
      <Card className="h-[170px] flex shadow-lg hover:shadow-xl transition-shadow">
        <Box className="flex-1 flex flex-col p-5">
          <img src={logo} alt={title} className="h-10 w-auto mb-4" />
          <Typography variant="body2" className="font-semibold mb-2 line-clamp-2">
            {description}
          </Typography>
          <Typography variant="caption" className="uppercase tracking-widest underline mt-auto">
            {title}
          </Typography>
        </Box>
        <Box className="w-40 shrink-0">
          <img src={image} alt="" className="w-full h-full object-cover rounded-r-xl" />
        </Box>
      </Card>
    </Link>
  );
}

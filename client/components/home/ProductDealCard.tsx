import { Box, Button, Card, Chip, Typography } from '@mui/material';
import Link from 'next/link';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

interface ProductDealCardProps {
  image: string;
  title: string;
  discount: string;
  link: string;
}

export default function ProductDealCard({ image, title, discount, link }: ProductDealCardProps) {
  return (
    <Link href={link} target="_blank">
      <Card className="h-36 flex shadow-lg hover:shadow-xl transition-shadow">
        <Box className="w-1/3 flex items-center justify-center p-2">
          <img src={image} alt={title} className="max-w-full max-h-full object-contain" />
        </Box>
        
        <Box className="w-2/3 bg-gray-100 p-3 flex flex-col gap-2">
          <Chip
            icon={<LocalFireDepartmentIcon />}
            label={discount}
            size="small"
            className="self-start bg-white font-semibold"
          />
          
          <Typography variant="caption" className="line-clamp-3 font-medium flex-1">
            {title}
          </Typography>
          
          <Button size="small" className="rounded-full bg-gray-200 text-black font-bold">
            Check price
          </Button>
        </Box>
      </Card>
    </Link>
  );
}

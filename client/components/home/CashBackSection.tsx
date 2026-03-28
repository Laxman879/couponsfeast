import { Box, Typography } from '@mui/material';
import Link from 'next/link';
import BoltIcon from '@mui/icons-material/Bolt';

interface CashBackStore {
  name: string;
  cashback: string;
  link: string;
  color: string;
  icon: string;
}

const stores: CashBackStore[] = [
  { name: 'Amazon', cashback: '5%', link: '/store/amazon', color: '#FF9900', icon: '🛒' },
  { name: 'Target', cashback: '10%', link: '/store/target', color: '#CC0000', icon: '🎯' },
  { name: 'Walmart', cashback: '3%', link: '/store/walmart', color: '#0071CE', icon: '🏪' },
  { name: 'Best Buy', cashback: '8%', link: '/store/bestbuy', color: '#0046BE', icon: '💻' },
  { name: 'Macy\'s', cashback: '12%', link: '/store/macys', color: '#E21A2C', icon: '👗' },
  { name: 'Nike', cashback: '7%', link: '/store/nike', color: '#000000', icon: '👟' },
  { name: 'Sephora', cashback: '6%', link: '/store/sephora', color: '#000000', icon: '💄' },
  { name: 'Home Depot', cashback: '4%', link: '/store/homedepot', color: '#F96302', icon: '🔨' },
];

export default function CashBackSection() {
  return (
    <Box className="mb-16">
      <Box className="flex items-center justify-between mb-8">
        <Box>
          <Box className="flex items-center gap-2 mb-2">
            <BoltIcon sx={{ color: '#f59e0b', fontSize: 28 }} />
            <Typography variant="h5" className="font-bold">
              Cash Back at Top Stores
            </Typography>
          </Box>
          <Typography variant="body2" className="text-gray-600">
            Earn money back on every purchase
          </Typography>
        </Box>
        <Link href="/cashback" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 underline">
          View All Stores
        </Link>
      </Box>

      <Box className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {stores.map((store, idx) => (
          <Link href={store.link} key={idx} className="group">
            <Box className="flex flex-col items-center">
              <Box
                className="w-24 h-24 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg"
                sx={{ bgcolor: store.color }}
              >
                <Typography className="text-4xl">{store.icon}</Typography>
              </Box>
              <Typography className="text-sm font-semibold text-center mb-1">
                {store.name}
              </Typography>
              <Box className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full">
                <BoltIcon sx={{ fontSize: 14, color: '#f59e0b' }} />
                <Typography className="text-xs font-bold text-amber-600">
                  {store.cashback} Back
                </Typography>
              </Box>
            </Box>
          </Link>
        ))}
      </Box>
    </Box>
  );
}

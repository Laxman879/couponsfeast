'use client';

import { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import Link from 'next/link';
import { getNavigation, getSiteConfig } from '@/services/api';

interface MenuItem {
  name: string;
  url: string;
}

export default function DynamicNavbar() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [siteConfig, setSiteConfig] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [navRes, configRes] = await Promise.all([
          getNavigation(),
          getSiteConfig()
        ]);
        
        setMenuItems(navRes.data.menu || []);
        setSiteConfig(configRes.data);
      } catch (error) {
        console.error('Error fetching navigation data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <AppBar 
      position="static" 
      sx={{ 
        bgcolor: siteConfig?.theme?.primaryColor || '#7c3aed',
        fontFamily: siteConfig?.fonts?.heading || 'Inter'
      }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            {siteConfig?.siteName || 'CouponsFeast'}
          </Link>
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          {menuItems.map((item) => (
            <Button 
              key={item.name} 
              color="inherit" 
              component={Link} 
              href={item.url}
            >
              {item.name}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
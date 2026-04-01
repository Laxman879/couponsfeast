'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { adminVerify } from '@/services/api';
import { CircularProgress } from '@mui/material';

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [verified, setVerified] = useState(false);
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setVerified(true);
      return;
    }
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.replace('/admin/login');
      return;
    }
    adminVerify()
      .then(() => setVerified(true))
      .catch(() => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        router.replace('/admin/login');
      });
  }, [isLoginPage, router]);

  if (!verified) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f1f5fb' }}>
        <CircularProgress style={{ color: '#6366f1' }} />
      </div>
    );
  }

  return <>{children}</>;
}

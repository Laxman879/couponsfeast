'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, IconButton, InputAdornment, CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff, Lock } from '@mui/icons-material';
import { Zap } from 'lucide-react';
import { adminLogin } from '@/services/api';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please fill in all fields');
    setLoading(true);
    try {
      const res = await adminLogin({ email, password });
      localStorage.setItem('admin_token', res.data.token);
      localStorage.setItem('admin_user', JSON.stringify(res.data.admin));
      toast.success('Welcome back!');
      router.push('/admin/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #faf5ff 100%)' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-200 mb-4">
            <Zap size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">CouponsFeast</h1>
          <p className="text-slate-400 text-sm mt-1">Admin Panel</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-indigo-100/50 border border-slate-100 p-8">
          <div className="flex items-center gap-2 mb-6">
            <Lock style={{ color: '#6366f1', fontSize: 20 }} />
            <h2 className="text-lg font-bold text-slate-800">Sign in to your account</h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@couponsfeast.com"
              variant="outlined"
              autoComplete="email"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', height: 52 } }}
            />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              variant="outlined"
              autoComplete="current-password"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', height: 52 } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              style={{
                background: loading ? '#a5b4fc' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                borderRadius: 12,
                height: 52,
                textTransform: 'none',
                fontSize: 16,
                fontWeight: 600,
                boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
              }}
            >
              {loading ? <CircularProgress size={24} style={{ color: '#fff' }} /> : 'Sign In'}
            </Button>
          </form>
        </div>

        <p className="text-center text-slate-400 text-xs mt-6">
          © {new Date().getFullYear()} CouponsFeast. All rights reserved.
        </p>
      </div>
    </div>
  );
}

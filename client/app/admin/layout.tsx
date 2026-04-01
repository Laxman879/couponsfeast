'use client';
import { Provider } from 'react-redux';
import { store } from '@/store';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Toaster } from 'react-hot-toast';
import AdminAuthGuard from '@/components/admin/AdminAuthGuard';

const adminTheme = createTheme({
  typography: {
    fontFamily: '"Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    allVariants: {
      fontFamily: '"Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*, *::before, *::after': {
          fontFamily: '"Roboto", sans-serif !important',
        },
      },
    },
    MuiTableCell:   { styleOverrides: { root: { fontFamily: '"Roboto", sans-serif !important' } } },
    MuiButton:      { styleOverrides: { root: { fontFamily: '"Roboto", sans-serif !important' } } },
    MuiInputBase:   { styleOverrides: { root: { fontFamily: '"Roboto", sans-serif !important' } } },
    MuiMenuItem:    { styleOverrides: { root: { fontFamily: '"Roboto", sans-serif !important' } } },
    MuiChip:        { styleOverrides: { root: { fontFamily: '"Roboto", sans-serif !important' } } },
    MuiTypography:  { styleOverrides: { root: { fontFamily: '"Roboto", sans-serif !important' } } },
  },
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={adminTheme}>
        <CssBaseline />
        <div className="min-h-screen" style={{ background: '#f1f5fb', fontFamily: '"Roboto", sans-serif' }}>
          <AdminAuthGuard>
            {children}
          </AdminAuthGuard>
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { background: '#363636', color: '#fff', fontFamily: '"Roboto", sans-serif' },
            success: { duration: 3000, iconTheme: { primary: '#4ade80', secondary: '#fff' } },
            error:   { duration: 4000, iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            loading: { iconTheme: { primary: '#3b82f6', secondary: '#fff' } },
          }}
        />
      </ThemeProvider>
    </Provider>
  );
}

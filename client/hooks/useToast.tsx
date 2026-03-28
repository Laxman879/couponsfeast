'use client';
import { useState } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

interface Toast {
  id: string;
  message: string;
  severity: AlertColor;
  open: boolean;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, severity: AlertColor = 'success') => {
    const id = Date.now().toString();
    const newToast: Toast = { id, message, severity, open: true };
    
    setToasts(prev => [...prev, newToast]);
    
    setTimeout(() => {
      setToasts(prev => prev.map(toast => 
        toast.id === id ? { ...toast, open: false } : toast
      ));
    }, 4000);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 4500);
  };

  const showSuccess = (message: string) => showToast(message, 'success');
  const showError = (message: string) => showToast(message, 'error');
  const showWarning = (message: string) => showToast(message, 'warning');
  const showInfo = (message: string) => showToast(message, 'info');

  const handleClose = (id: string) => {
    setToasts(prev => prev.map(toast => 
      toast.id === id ? { ...toast, open: false } : toast
    ));
  };

  const ToastContainer = () => (
    <>
      {toasts.map((toast) => (
        <Snackbar
          key={toast.id}
          open={toast.open}
          autoHideDuration={4000}
          onClose={() => handleClose(toast.id)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{ mt: 8 }}
        >
          <Alert 
            onClose={() => handleClose(toast.id)} 
            severity={toast.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );

  return { showToast, showSuccess, showError, showWarning, showInfo, ToastContainer };
};
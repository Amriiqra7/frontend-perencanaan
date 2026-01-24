'use client';

import { Snackbar, Alert, type AlertColor } from '@mui/material';
import React, { createContext, useContext, useState, useCallback, type ReactNode, useEffect } from 'react';
import { setGlobalToast as setInterceptorToast } from '@/core/services/interceptors';

interface ToastContextType {
  showToast: (message: string, severity?: AlertColor) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps): React.ReactElement {
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [severity, setSeverity] = useState<AlertColor>('error');

  const showToast = useCallback((msg: string, sev: AlertColor = 'error'): void => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  }, []);

  useEffect(() => { 
    setInterceptorToast(showToast);
  }, [showToast]);

  const handleClose = useCallback((event?: React.SyntheticEvent | Event, reason?: string): void => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  }, []);

  const providerValue: ToastContextType = {
    showToast: showToast,
  };

  return (
    <ToastContext.Provider value={providerValue}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
}

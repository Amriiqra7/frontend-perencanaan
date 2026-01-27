'use client';

import { Toaster } from 'react-hot-toast';

interface ToastProviderWrapperProps {
  children: React.ReactNode;
}

export default function ToastProviderWrapper({ children }: ToastProviderWrapperProps): React.ReactElement {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '8px',
            padding: '12px 16px',
          },
          success: {
            iconTheme: {
              primary: '#4caf50',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#f44336',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
}

'use client';

import { ToastProvider } from '@/lib/toast';

interface ToastProviderWrapperProps {
  children: React.ReactNode;
}

export default function ToastProviderWrapper({ children }: ToastProviderWrapperProps): React.ReactElement {
  return <ToastProvider>{children}</ToastProvider>;
}

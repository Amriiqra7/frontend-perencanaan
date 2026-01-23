'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import DashboardLayout from './DashboardLayout';

interface ConditionalDashboardLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalDashboardLayout({ children }: ConditionalDashboardLayoutProps): React.ReactElement {
  const pathname = usePathname();
  
  const isAuthenticationRoute = pathname?.startsWith('/authentication');
  
  if (isAuthenticationRoute) {
    return <>{children}</>;
  }
  
  return <DashboardLayout>{children}</DashboardLayout>;
}

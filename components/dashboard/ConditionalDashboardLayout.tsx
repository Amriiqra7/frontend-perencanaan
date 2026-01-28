'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import DashboardLayout from './DashboardLayout';

interface ConditionalDashboardLayoutProps {
  children: React.ReactNode;
}

const checkIsNotFound = (node: React.ReactNode): boolean => {
  if (React.isValidElement(node)) {
    const componentName = (node.type as { name?: string; displayName?: string })?.name ||
      (node.type as { displayName?: string })?.displayName;

    if (componentName === 'NotFound') {
      return true;
    }

    const props = node.props as { 'data-page'?: string; children?: React.ReactNode } | null;
    if (props && typeof props === 'object' && 'data-page' in props) {
      if (props['data-page'] === 'not-found') {
        return true;
      }
    }

    if (props && props.children) {
      return checkIsNotFound(props.children);
    }
  }

  if (Array.isArray(node)) {
    return node.some(child => checkIsNotFound(child));
  }

  return false;
};

export default function ConditionalDashboardLayout({ children }: ConditionalDashboardLayoutProps): React.ReactElement {
  const pathname = usePathname();
  const [isNotFoundPage, setIsNotFoundPage] = useState(false);

  const isAuthenticationRoute = pathname?.startsWith('/authentication');

  const childrenIsNotFound = useMemo(() => checkIsNotFound(children), [children]);

  useEffect(() => {
    const checkNotFound = (): void => {
      const bodyHasAttribute = document.body.getAttribute('data-page') === 'not-found';
      const notFoundElement = document.querySelector('[data-page="not-found"]');
      setIsNotFoundPage(!!(bodyHasAttribute || notFoundElement || childrenIsNotFound));
    };

    checkNotFound();

    const timeout = setTimeout(checkNotFound, 100);

    const observer = new MutationObserver(checkNotFound);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-page'],
    });

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [pathname, childrenIsNotFound]);

  if (isAuthenticationRoute || isNotFoundPage || childrenIsNotFound) {
    return <>{children}</>;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}

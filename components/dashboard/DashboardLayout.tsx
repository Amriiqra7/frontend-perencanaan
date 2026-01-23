'use client';

import React, { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton, Avatar, Badge, Tooltip } from '@mui/material';
import { Menu, Notification, InfoCircle, Setting2, Logout } from 'iconsax-reactjs';
import MainDrawer from './MainDrawer';
import { useMenu } from '@/hooks/useMenu';
import { DRAWER_WIDTH } from '@/constant';
import { removeBackendToken } from '@/lib/session';
import type { User } from '@/types/user';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps): React.ReactElement {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('drawerOpen');
      return saved ? JSON.parse(saved) : true;
    }
    return true;
  });
  const { menuData, isLoading } = useMenu();
  const [user, setUser] = useState<User | undefined>(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    }
    return undefined;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('drawerOpen', JSON.stringify(drawerOpen));
    }
  }, [drawerOpen]);

  useEffect(() => {
    const handleDrawerToggle = (): void => {
      setDrawerOpen((prev) => !prev);
    };

    window.addEventListener('drawerToggle', handleDrawerToggle);
    return () => {
      window.removeEventListener('drawerToggle', handleDrawerToggle);
    };
  }, []);

  const handleDrawerToggle = (): void => {
    setDrawerOpen(!drawerOpen);
  };

  if (isLoading || !menuData || !user) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Box
          component="img"
          src="/logo/Hublang.png"
          alt="Logo"
          sx={{
            width: 56,
            height: 56,
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            '@keyframes pulse': {
              '0%, 100%': {
                opacity: 1,
              },
              '50%': {
                opacity: 0.5,
              },
            },
          }}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <MainDrawer drawerOpen={drawerOpen} onDrawerToggle={handleDrawerToggle} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerOpen ? DRAWER_WIDTH : 64}px)` },
          transition: (theme) =>
            theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          bgcolor: 'background.default',
        }}
      >
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerOpen ? DRAWER_WIDTH : 64}px)` },
            ml: { sm: `${drawerOpen ? DRAWER_WIDTH : 64}px` },
            transition: (theme) =>
              theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            boxShadow: '0 1px 3px rgba(255, 140, 0, 0.12)',
            bgcolor: 'background.paper',
            color: 'text.primary',
            borderBottom: '1px solid #FFE0B2',
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <Menu size={24} />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              Dashboard
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {user && (
                <Tooltip title={typeof user.name === 'string' ? user.name : 'User'}>
                  <IconButton
                    color="inherit"
                    aria-label="user profile"
                    sx={{
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                      ml: 0.5,
                    }}
                  >
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#FF8C00', color: '#ffffff' }}>
                      {typeof user.name === 'string' ? user.name.charAt(0).toUpperCase() : 'U'}
                    </Avatar>
                  </IconButton>
                </Tooltip>
              )}

              <Tooltip title="Logout">
                <IconButton
                  color="inherit"
                  aria-label="logout"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      localStorage.removeItem('user');
                      localStorage.removeItem('settings_p');
                      localStorage.removeItem('drawerOpen');
                      
                      removeBackendToken();
                      
                      const portalUrl = process.env.NEXT_PUBLIC_PORTAL_URL;
                      if (portalUrl) {
                        window.location.href = portalUrl;
                      } else {
                        window.location.href = '/authentication/receiver';
                      }
                    }
                  }}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'error.light',
                      color: 'error.main',
                    },
                    ml: 0.5,
                  }}
                >
                  <Logout size={22} />
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>
        <Toolbar />
        <Box sx={{ mt: 2 }}>{children}</Box>
      </Box>
    </Box>
  );
}

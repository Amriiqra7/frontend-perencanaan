'use client';

import React, { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton, Avatar, Badge, Tooltip, useMediaQuery, useTheme, Menu, MenuItem, Divider, ListItemText } from '@mui/material';
import { Menu as MenuIcon, Notification, InfoCircle, Setting2, Logout, Sun1, Moon } from 'iconsax-reactjs';
import MainDrawer from './MainDrawer';
import { useMenu } from '@/hooks/useMenu';
import { DRAWER_WIDTH } from '@/constant';
import { removeBackendToken } from '@/lib/session';
import { useThemeMode } from './ThemeProvider';
import type { User } from '@/types/user';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps): React.ReactElement {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const { mode, toggleColorMode } = useThemeMode();
  
  const [drawerOpen, setDrawerOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const isMobileDevice = window.innerWidth < 1200;
      if (isMobileDevice) {
        return false;
      }
      const saved = localStorage.getItem('drawerOpen');
      return saved ? JSON.parse(saved) : true;
    }
    return false;
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
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  useEffect(() => {
    if (typeof window !== 'undefined' && !isMobile) {
      localStorage.setItem('drawerOpen', JSON.stringify(drawerOpen));
    }
  }, [drawerOpen, isMobile]);
  
  useEffect(() => {
    if (isMobile && drawerOpen) {
      setTimeout(() => {
        setDrawerOpen(false);
      }, 0);
    }
  }, [isMobile, drawerOpen]);

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
  
  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = (): void => {
    setAnchorEl(null);
  };
  
  const handleKembaliKePortal = (): void => {
    handleMenuClose();
    const portalUrl = process.env.NEXT_PUBLIC_PORTAL_URL;
    if (portalUrl) {
      window.location.href = portalUrl;
    }
  };
  
  const handleLogout = (): void => {
    handleMenuClose();
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
          p: { xs: 1, sm: 2, md: 3 },
          width: { 
            xs: '100%', 
            lg: `calc(100% - ${drawerOpen ? DRAWER_WIDTH : 64}px)` 
          },
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
            width: { 
              xs: '100%',
              lg: `calc(100% - ${drawerOpen ? DRAWER_WIDTH : 64}px)` 
            },
            ml: { 
              xs: 0,
              lg: `${drawerOpen ? DRAWER_WIDTH : 64}px` 
            },
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
          <Toolbar sx={{ px: { xs: 1, sm: 2 } }}>
            {/* Burger menu button for mobile */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{
                  ml: "-1px",
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <MenuIcon size={24} />
              </IconButton>
            )}
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mr: { xs: 1, sm: 0 } }}>
              {/* Dark mode toggle */}
              <Tooltip title={mode === 'light' ? 'Dark Mode' : 'Light Mode'}>
                <IconButton
                  color="inherit"
                  aria-label="toggle theme"
                  onClick={toggleColorMode}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  {mode === 'light' ? <Moon size={22} /> : <Sun1 size={22} />}
                </IconButton>
              </Tooltip>
              
              {user && (
                <>
                  <IconButton
                    color="inherit"
                    aria-label="user profile"
                    onClick={handleAvatarClick}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#FF8C00', color: '#ffffff' }}>
                      {typeof user.name === 'string' ? user.name.charAt(0).toUpperCase() : 'U'}
                    </Avatar>
                  </IconButton>
                  
                  <Menu
                    anchorEl={anchorEl}
                    open={menuOpen}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    PaperProps={{
                      sx: {
                        minWidth: 200,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                      },
                    }}
                  >
                    <MenuItem disabled>
                      <ListItemText
                        primary={String(user.username || user.nama || 'User')}
                        primaryTypographyProps={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: 'text.primary',
                        }}
                      />
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleKembaliKePortal}>
                      <ListItemText
                        primary="Kembali ke Portal"
                        primaryTypographyProps={{
                          fontSize: '0.875rem',
                        }}
                      />
                    </MenuItem>
                    <Divider />
                    <MenuItem 
                      onClick={handleLogout}
                      sx={{
                        color: 'error.main',
                        '&:hover': {
                          backgroundColor: 'error.light',
                          color: 'error.contrastText',
                        },
                      }}
                    >
                      <Logout size={18} style={{ marginRight: 8 }} />
                      <ListItemText
                        primary="Logout"
                        primaryTypographyProps={{
                          fontSize: '0.875rem',
                        }}
                      />
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          </Toolbar>
        </AppBar>
        <Toolbar sx={{ minHeight: '48px !important' }} />
        <Box>{children}</Box>
      </Box>
    </Box>
  );
}

'use client';

import React, { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import DrawerHeader from './DrawerHeader';
import DrawerContent from './DrawerContent';
import MiniDrawerStyled from './MiniDrawerStyled';
import { DRAWER_WIDTH } from '@/constant';
import { useMenu } from '@/hooks/useMenu';

interface MainDrawerProps {
  window?: () => Window;
  drawerOpen: boolean;
  onDrawerToggle: () => void;
}

export default function MainDrawer({ window, drawerOpen, onDrawerToggle }: MainDrawerProps): React.ReactElement {
  const theme = useTheme();
  const downLG = useMediaQuery(theme.breakpoints.down('lg'));
  const { menuData } = useMenu();

  const handlerDrawerOpen = (open: boolean): void => {
    if (!open) {
      onDrawerToggle();
    }
  };

  const container = window !== undefined ? () => window().document.body : undefined;

  const drawerContent = useMemo(() => {
    if (!menuData || menuData.length === 0) {
      return null;
    }
    return <DrawerContent menuData={menuData} open={drawerOpen} />;
  }, [menuData, drawerOpen]);

  const drawerHeader = useMemo(
    () => <DrawerHeader open={drawerOpen} onToggle={onDrawerToggle} />,
    [drawerOpen, onDrawerToggle]
  );

  return (
    <Box component="nav" sx={{ flexShrink: { md: 0 }, zIndex: 1200 }} aria-label="mailbox folders">
      {!downLG ? (
        <MiniDrawerStyled variant="permanent" open={drawerOpen}>
          {drawerHeader}
          {drawerContent}
        </MiniDrawerStyled>
      ) : (
        <Drawer
          container={container}
          variant="temporary"
          open={drawerOpen}
          onClose={() => handlerDrawerOpen(false)}
          ModalProps={{
            keepMounted: false,
            disableScrollLock: false,
          }}
          sx={{
            display: { xs: 'block', lg: 'none' },
            zIndex: 1300,
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              borderRight: `1px solid ${theme.palette.divider}`,
              backgroundImage: 'none',
              zIndex: 1300,
            },
            '& .MuiBackdrop-root': {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1299,
            },
          }}
        >
          {drawerHeader}
          {drawerContent}
        </Drawer>
      )}
    </Box>
  );
}

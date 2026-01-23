'use client';

import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import { DRAWER_WIDTH } from '@/constant';

interface MiniDrawerStyledProps {
  open: boolean;
  variant: 'permanent' | 'temporary';
  children: React.ReactNode;
}

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{ open: boolean }>(({ theme, open }) => ({
  width: open ? DRAWER_WIDTH : 64,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  '& .MuiDrawer-paper': {
    width: open ? DRAWER_WIDTH : 64,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
    borderRight: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.shadows[8],
  },
}));

export default function MiniDrawerStyled({ open, variant, children }: MiniDrawerStyledProps): React.ReactElement {
  return (
    <StyledDrawer variant={variant} open={open}>
      {children}
    </StyledDrawer>
  );
}

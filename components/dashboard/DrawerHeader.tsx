
'use client';

import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { Menu, ArrowLeft2 } from 'iconsax-reactjs';

interface DrawerHeaderProps {
  open: boolean;
  onToggle: () => void;
}

export default function DrawerHeader({ open, onToggle }: DrawerHeaderProps): React.ReactElement {

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: open ? 'space-between' : 'center',
        padding: '16px',
        borderBottom: '1px solid',
        borderColor: 'divider',
        minHeight: '64px',
      }}
    >
      {open && (
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
          Dashboard
        </Typography>
      )}
      <IconButton
        onClick={onToggle}
        sx={{
          color: 'text.primary',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
      >
        {open ? <ArrowLeft2 size={24} /> : <Menu size={24} />}
      </IconButton>
    </Box>
  );
}

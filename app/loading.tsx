'use client';

import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function Loading(): React.ReactElement {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 2,
        backgroundColor: 'rgba(128, 128, 128, 0.1)',
      }}
    >
      <CircularProgress 
        sx={{
          color: '#FF8C00',
        }}
        size={48}
      />
      <Typography
        variant="body1"
        sx={{
          color: '#666',
          fontSize: '1rem',
          '@media (prefers-color-scheme: dark)': {
            color: '#b0b0b0',
          },
        }}
      >
        Loading...
      </Typography>
    </Box>
  );
}

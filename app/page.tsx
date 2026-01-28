'use client';

import React from 'react';
import { Box, Typography, Paper, useTheme } from '@mui/material';
import { Chart2, DocumentText, Profile, MoneyRecive } from 'iconsax-reactjs';

export default function Dashboard(): React.ReactElement {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const statCards = [
    {
      title: 'Total RAB',
      value: '0',
      icon: DocumentText,
      color: '#FF8C00',
    },
    {
      title: 'Total Pelanggan',
      value: '0',
      icon: Profile,
      color: '#2196F3',
    },
    {
      title: 'Total Pendapatan',
      value: 'Rp 0',
      icon: MoneyRecive,
      color: '#4CAF50',
    },
    {
      title: 'Statistik',
      value: '0',
      icon: Chart2,
      color: '#9C27B0',
    },
  ];

  return (
    <Box 
      sx={{ 
        width: { 
          xs: 'calc(100% + 16px)', 
          sm: 'calc(100% + 32px)', 
          md: 'calc(100% + 48px)' 
        },
        maxWidth: 'none',
        position: 'relative',
        marginLeft: { xs: -1, sm: -2, md: -3 },
        marginRight: { xs: -1, sm: -2, md: -3 },
        paddingLeft: { xs: 1, sm: 2, md: 3 },
        paddingRight: { xs: 1, sm: 2, md: 3 },
        boxSizing: 'border-box',
      }}
    >
      <Box sx={{ mb: 3, pt: { xs: 2, sm: 3, md: 4 } }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            mb: 1,
          }}
        >
          Dashboard
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
          }}
        >
          Selamat datang di dashboard aplikasi perencanaan
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3, width: '100%' }}>
        {statCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <Box
              key={index}
              sx={{
                flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', md: '1 1 calc(25% - 12px)' },
                minWidth: 0,
              }}
            >
              <Paper
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  width: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: isDarkMode
                      ? '0 4px 12px rgba(255, 140, 0, 0.2)'
                      : '0 4px 12px rgba(0, 0, 0, 0.1)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      backgroundColor: `${card.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconComponent size={24} color={card.color} variant="Bold" />
                  </Box>
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    mb: 0.5,
                  }}
                >
                  {card.value}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: '0.875rem',
                  }}
                >
                  {card.title}
                </Typography>
              </Paper>
            </Box>
          );
        })}
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, pb: { xs: 1, sm: 2, md: 3 }, width: '100%' }}>
        <Box
          sx={{
            flex: { xs: '1 1 100%', md: '1 1 calc(66.666% - 8px)' },
            minWidth: 0,
          }}
        >
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              minHeight: 400,
              width: '100%',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
                mb: 2,
              }}
            >
              Ringkasan Aktivitas
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 300,
                color: theme.palette.text.secondary,
              }}
            >
              <Typography variant="body1">Tidak ada aktivitas terbaru</Typography>
            </Box>
          </Paper>
        </Box>
        <Box
          sx={{
            flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 8px)' },
            minWidth: 0,
          }}
        >
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              minHeight: 400,
              width: '100%',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
                mb: 2,
              }}
            >
              Informasi
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Box
                sx={{
                  p: 2,
                  borderRadius: 1,
                  backgroundColor: isDarkMode ? 'rgba(255, 140, 0, 0.1)' : 'rgba(255, 140, 0, 0.05)',
                  border: `1px solid ${isDarkMode ? 'rgba(255, 140, 0, 0.2)' : 'rgba(255, 140, 0, 0.2)'}`,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: '#FF8C00',
                    mb: 0.5,
                  }}
                >
                  Menu RAB
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: '0.875rem',
                  }}
                >
                  Kelola RAB dengan mudah melalui menu RAB
                </Typography>
              </Box>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 1,
                  backgroundColor: isDarkMode ? 'rgba(33, 150, 243, 0.1)' : 'rgba(33, 150, 243, 0.05)',
                  border: `1px solid ${isDarkMode ? 'rgba(33, 150, 243, 0.2)' : 'rgba(33, 150, 243, 0.2)'}`,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: '#2196F3',
                    mb: 0.5,
                  }}
                >
                  Dashboard
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: '0.875rem',
                  }}
                >
                  Pantau aktivitas dan statistik di sini
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

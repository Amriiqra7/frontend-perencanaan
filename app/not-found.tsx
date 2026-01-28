'use client';

import React, { useEffect } from 'react';
import { Box, Typography, Button, Container, useTheme } from '@mui/material';
import { Home2 } from 'iconsax-reactjs';
import { useRouter } from 'next/navigation';

export default function NotFound(): React.ReactElement {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const router = useRouter();

    const handleGoHome = (): void => {
        router.push('/');
    };

    useEffect(() => {
        document.body.setAttribute('data-page', 'not-found');
        return () => {
            document.body.removeAttribute('data-page');
        };
    }, []);

    return (
        <Box
            data-page="not-found"
            sx={{
                minHeight: '100vh',
                width: '100vw',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.palette.background.default,
                backgroundImage: isDarkMode
                    ? 'radial-gradient(circle at 20% 50%, rgba(255, 140, 0, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 140, 0, 0.1) 0%, transparent 50%)'
                    : 'radial-gradient(circle at 20% 50%, rgba(255, 140, 0, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 140, 0, 0.05) 0%, transparent 50%)',
                overflow: 'hidden',
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '10%',
                    left: '10%',
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    backgroundColor: isDarkMode ? 'rgba(255, 140, 0, 0.05)' : 'rgba(255, 140, 0, 0.03)',
                    filter: 'blur(60px)',
                    zIndex: 0,
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: '10%',
                    right: '10%',
                    width: 300,
                    height: 300,
                    borderRadius: '50%',
                    backgroundColor: isDarkMode ? 'rgba(255, 140, 0, 0.05)' : 'rgba(255, 140, 0, 0.03)',
                    filter: 'blur(80px)',
                    zIndex: 0,
                }}
            />

            <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                <Box
                    sx={{
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 3,
                    }}
                >
                    <Box
                        sx={{
                            position: 'relative',
                            mb: 2,
                        }}
                    >
                        <Typography
                            variant="h1"
                            sx={{
                                fontSize: { xs: '120px', sm: '150px', md: '200px' },
                                fontWeight: 800,
                                background: isDarkMode
                                    ? 'linear-gradient(135deg, #FF8C00 0%, #FFA500 100%)'
                                    : 'linear-gradient(135deg, #FF8C00 0%, #FF7F00 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                lineHeight: 1,
                                letterSpacing: '-0.02em',
                                textShadow: isDarkMode
                                    ? '0 0 40px rgba(255, 140, 0, 0.3)'
                                    : '0 0 20px rgba(255, 140, 0, 0.2)',
                            }}
                        >
                            404
                        </Typography>
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: { xs: '100px', sm: '120px', md: '150px' },
                                height: { xs: '100px', sm: '120px', md: '150px' },
                                borderRadius: '50%',
                                backgroundColor: isDarkMode ? 'rgba(255, 140, 0, 0.1)' : 'rgba(255, 140, 0, 0.05)',
                                filter: 'blur(40px)',
                                zIndex: -1,
                            }}
                        />
                    </Box>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                            color: theme.palette.text.primary,
                            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                            mb: 1,
                        }}
                    >
                        Halaman Tidak Ditemukan
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: theme.palette.text.secondary,
                            fontSize: { xs: '0.875rem', sm: '1rem' },
                            maxWidth: '500px',
                            mb: 2,
                        }}
                    >
                        Maaf, halaman yang Anda cari tidak ditemukan atau telah dipindahkan.
                        Silakan kembali ke halaman utama.
                    </Typography>
                    <Box
                        sx={{
                            gap: 2,
                            mt: 2,
                            width: '100%',
                            maxWidth: '500px',
                        }}
                    >
                        <Button
                            variant="contained"
                            startIcon={<Home2 size={20} />}
                            onClick={handleGoHome}
                            sx={{
                                textTransform: 'none',
                                backgroundColor: '#FF8C00',
                                color: '#fff',
                                fontWeight: 600,
                                fontSize: '1rem',
                                py: 1.5,
                                px: 3,
                                flex: { xs: 1, sm: 'none' },
                                '&:hover': {
                                    backgroundColor: '#FF7F00',
                                    boxShadow: '0 4px 12px rgba(255, 140, 0, 0.4)',
                                },
                            }}
                        >
                            Kembali ke Beranda
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}

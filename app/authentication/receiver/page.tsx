'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Typography, Paper } from '@mui/material';
import { decryptPayload } from '@/app/authentication/auth/AuthReceiver';
import { setBackendToken } from '@/lib/session';
import { deleteSidebar } from '@/lib/sidebar';
import { validateToken } from '@/core/services/api';

function AuthReceiverContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState(() => {
    const data = searchParams.get('data');
    return data ? "Memproses keamanan..." : "Data otentikasi tidak ditemukan.";
  });
  const hasProcessedRef = useRef<boolean>(false);

  useEffect(() => {
    const encryptedData = searchParams.get('data');

    if (!encryptedData || hasProcessedRef.current) {
      return;
    }

    hasProcessedRef.current = true;

    // Panggil Server Action
    const doAuth = async () => {
      try {
        // Decrypt payload yang berisi token dan user dari portal
        const result = await decryptPayload(encryptedData);

        if (result.success && result.token && result.user) {
          // Simpan token ke cookies menggunakan utility function
          setBackendToken(result.token);

          deleteSidebar();

          // Simpan user data ke localStorage
          localStorage.setItem('user', JSON.stringify(result.user));

          setStatus("Memvalidasi token...");
          try {
            const validationResult = await validateToken();

            if (validationResult.success) {
              setStatus("Berhasil! Mengalihkan...");
              router.replace('/');
            } else {
              setStatus(`Gagal validasi: ${validationResult.message || 'Token tidak valid'}`);
            }
          } catch (validationError) {
            console.error('[AuthReceiver] Token validation error:', validationError);
            setStatus("Gagal memvalidasi token. Silakan coba lagi.");
          }
        } else {
          setStatus(`Gagal: ${result.message}`);
        }
      } catch {
        setStatus("Terjadi kesalahan sistem.");
      }
    };

    doAuth();
  }, [searchParams, router]);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#f5f5f5',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          textAlign: 'center',
          maxWidth: 400,
          width: '100%',
          mx: 'auto',
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontWeight: 600,
            mb: 2,
            textAlign: 'center',
          }}
        >
          Autentikasi Silang
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            textAlign: 'center',
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
        >
          {status}
        </Typography>
      </Paper>
    </Box>
  );
}

export default function AuthReceiverPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthReceiverContent />
    </Suspense>
  );
}
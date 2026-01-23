'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { decryptPayload } from '@/app/authentication/auth/AuthReceiver';
import { setBackendToken } from '@/lib/session';
import { deleteSidebar } from '@/lib/sidebar';

function AuthReceiverContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState(() => {
    const data = searchParams.get('data');
    return data ? "Memproses keamanan..." : "Data otentikasi tidak ditemukan.";
  });

  useEffect(() => {
    const encryptedData = searchParams.get('data');

    if (!encryptedData) {
      return;
    }

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

          setStatus("Berhasil! Mengalihkan...");
          router.replace('/');
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
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">Autentikasi Silang</h2>
        <p className="text-gray-600 animate-pulse">{status}</p>
      </div>
    </div>
  );
}

export default function AuthReceiverPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthReceiverContent />
    </Suspense>
  );
}
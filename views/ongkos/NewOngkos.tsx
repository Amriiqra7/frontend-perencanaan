'use client';

import React, { useState } from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { ArrowLeft } from 'iconsax-reactjs';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { getOngkos } from '@/core/services/api';
import toast from 'react-hot-toast';
import { parseRupiahInput } from '@/config/global';
import OngkosForm, { type OngkosFormValues } from '@/components/ongkos/OngkosForm';
import type { OngkosCreatePayload } from '@/types/ongkos';

export default function NewOngkos(): React.ReactElement {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { data: satuanResponse, isLoading: isLoadingSatuan } = useSWR(
    'satuan-ongkos',
    () => getOngkos.getComboSatuanOngkos(),
    {
      revalidateOnFocus: false,
    }
  );

  const satuanOptions = satuanResponse?.data || [];

  const initialValues: OngkosFormValues = {
    kode: '',
    nama: '',
    satuanId: null,
    harga: '',
  };

  const handleSubmit = async (values: OngkosFormValues): Promise<void> => {
    setIsSubmitting(true);
    
    const payload: OngkosCreatePayload = {
      kode: values.kode.trim(),
      nama: values.nama.trim(),
      satuanId: values.satuanId!,
      harga: parseRupiahInput(values.harga),
    };

    const createPromise = getOngkos.create(payload).then((response) => {
      if (!response.success) {
        throw new Error(response.message || 'Gagal menambahkan ongkos');
      }
      return response;
    });

    toast.promise(
      createPromise,
      {
        loading: 'Menambahkan ongkos...',
        success: (response) => {
          setIsSubmitting(false);
          router.push('/ongkos');
          return response.message || 'Ongkos berhasil ditambahkan';
        },
        error: (error) => {
          setIsSubmitting(false);
          console.error('[NewOngkos] Failed to create Ongkos:', error);
          return error instanceof Error ? error.message : 'Gagal menambahkan ongkos';
        },
      }
    );
  };

  const handleBack = (): void => {
    router.push('/ongkos');
  };

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Button
        startIcon={<ArrowLeft size={20} />}
        onClick={handleBack}
        sx={{ mb: 2, textTransform: 'none' }}
      >
        Kembali
      </Button>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
          Tambah Ongkos
        </Typography>

        <OngkosForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          onCancel={handleBack}
          isSubmitting={isSubmitting}
          satuanOptions={satuanOptions}
          isLoadingSatuan={isLoadingSatuan}
        />
      </Paper>
    </Box>
  );
}

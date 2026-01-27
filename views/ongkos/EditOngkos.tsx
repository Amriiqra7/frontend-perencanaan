'use client';

import React, { useState, useMemo } from 'react';
import { Box, Paper, Typography, Button, CircularProgress } from '@mui/material';
import { ArrowLeft } from 'iconsax-reactjs';
import { useRouter, useParams } from 'next/navigation';
import useSWR from 'swr';
import { getOngkos } from '@/core/services/api';
import toast from 'react-hot-toast';
import { parseRupiahInput, formatRupiahInput } from '@/config/global';
import OngkosForm, { type OngkosFormValues } from '@/components/ongkos/OngkosForm';
import type { OngkosUpdatePayload, OngkosData } from '@/types/ongkos';

export default function EditOngkos(): React.ReactElement {
  const router = useRouter();
  const params = useParams();
  const id = params?.id ? Number(params.id) : null;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { data: ongkosResponse, isLoading: isLoadingOngkos } = useSWR<{ success: boolean; data: OngkosData }>(
    id ? ['ongkos-detail', id] : null,
    () => getOngkos.getById(id!),
    {
      revalidateOnFocus: false,
    }
  );

  const { data: satuanResponse, isLoading: isLoadingSatuan } = useSWR(
    'satuan-ongkos',
    () => getOngkos.getComboSatuanOngkos(),
    {
      revalidateOnFocus: false,
    }
  );

  const satuanOptions = satuanResponse?.data || [];

  const initialValues: OngkosFormValues = useMemo(() => {
    if (ongkosResponse?.success && ongkosResponse.data) {
      const data = ongkosResponse.data;
      const hargaValue = parseFloat(data.harga_ongkos || '0');
      return {
        kode: data.kode_ongkos,
        nama: data.nama_ongkos,
        satuanId: data.satuan_ongkos?.id || null,
        harga: formatRupiahInput(hargaValue),
      };
    }
    return {
      kode: '',
      nama: '',
      satuanId: null,
      harga: '',
    };
  }, [ongkosResponse]);

  const handleSubmit = async (values: OngkosFormValues): Promise<void> => {
    if (!id) {
      return;
    }

    setIsSubmitting(true);

    const payload: OngkosUpdatePayload = {
      kode: values.kode.trim(),
      nama: values.nama.trim(),
      satuanId: values.satuanId!,
      harga: parseRupiahInput(values.harga),
    };

    const updatePromise = getOngkos.update(id, payload).then((response) => {
      if (!response.success) {
        throw new Error(response.message || 'Gagal mengupdate ongkos');
      }
      return response;
    });

    toast.promise(
      updatePromise,
      {
        loading: 'Mengupdate ongkos...',
        success: (response) => {
          setIsSubmitting(false);
          router.push('/ongkos');
          return response.message || 'Ongkos berhasil diupdate';
        },
        error: (error) => {
          setIsSubmitting(false);
          console.error('[EditOngkos] Failed to update Ongkos:', error);
          return error instanceof Error ? error.message : 'Gagal mengupdate ongkos';
        },
      }
    );
  };

  const handleBack = (): void => {
    router.push('/ongkos');
  };

  if (isLoadingOngkos) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!ongkosResponse?.success || !id) {
    return (
      <Box sx={{ width: '100%', p: 2 }}>
        <Typography variant="h6" color="error">
          Data tidak ditemukan
        </Typography>
      </Box>
    );
  }

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
          Edit Ongkos
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

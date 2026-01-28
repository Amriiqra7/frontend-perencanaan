'use client';

import React, { useState, useMemo } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import DetailPelanggan from '@/components/menu-rab/DetailPelanggan';
import MaterialForm, { type PaketItem, type CartItem } from '@/components/menu-rab/MaterialForm';
import * as API from '@/core/services/api';
import type { PelangganData } from '@/types/rab';

export default function NewMenuRab(): React.ReactElement {
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const pelangganId = searchParams.get('pelangganId');
  const isPasangBaru = type === 'pasang-baru';

  const {
    data: pelangganResponse,
    isLoading: isLoadingPelanggan,
  } = useSWR(
    pelangganId ? ['pelanggan', pelangganId] : null,
    () => API.getRab.getByPelanggan(Number(pelangganId)),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  const pelangganData: PelangganData | null = useMemo(() => {
    if (pelangganResponse && pelangganResponse.success && pelangganResponse.data) {
      return pelangganResponse.data;
    }
    return null;
  }, [pelangganResponse]);

  const customerDetail = useMemo(() => {
    if (pelangganData) {
      return {
        noReg: '',
        nopel: pelangganData.no_pelanggan || '',
        nama: pelangganData.nama || '',
        alamat: pelangganData.alamat || '',
        wilayah: pelangganData.namaWilayah || '',
        rayon: pelangganData.namaRayon || '',
      };
    }
    return {
      noReg: '',
      nopel: '',
      nama: '',
      alamat: '',
      wilayah: '',
      rayon: '',
    };
  }, [pelangganData]);

  const [paketItems, setPaketItems] = useState<PaketItem[]>([]);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const [, setSubtotalMaterial] = useState<number>(0);

  if (pelangganId && isLoadingPelanggan) {
    return (
      <Box sx={{ width: '100%', p: 0, minHeight: 'calc(100vh - 64px)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        p: { xs: 1, sm: 1, md: 0 },
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: { xs: 2, md: 1 },
        alignItems: { xs: 'stretch', md: 'stretch' },
      }}
    >
      <DetailPelanggan
        customerDetail={customerDetail}
      />

      <MaterialForm
        paketItems={paketItems}
        cartItems={cartItems}
        onPaketItemsChange={setPaketItems}
        onCartItemsChange={setCartItems}
        onTotalMaterialChange={setSubtotalMaterial}
        isPasangBaru={isPasangBaru}
        pelangganData={pelangganData}
        pendaftaranId={pelangganData?.id || null}
      />
    </Box>
  );
}

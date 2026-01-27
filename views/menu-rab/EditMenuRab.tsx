'use client';

import React, { useState, useMemo } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import DetailPelanggan from '@/components/menu-rab/DetailPelanggan';
import MaterialForm, { type PaketItem, type CartItem } from '@/components/menu-rab/MaterialForm';
import * as API from '@/core/services/api';
import type { PelangganData, RabDetailData } from '@/types/rab';

function convertMaterialToPaketItems(material: RabDetailData['material']): PaketItem[] {
  const paketItems: PaketItem[] = [];
  
  if (!material || material.length === 0) return paketItems;

  const paketMap = new Map<number, typeof material>();
  
  material.forEach((item) => {
    if (item.is_paket === 1 && item.harga_paket > 0) {
      const paketKey = item.harga_paket;
      if (!paketMap.has(paketKey)) {
        paketMap.set(paketKey, []);
      }
      paketMap.get(paketKey)!.push(item);
    }
  });

  let itemIdCounter = 1;
  paketMap.forEach((items, hargaPaket) => {
    const paketId = items[0]?.id || itemIdCounter;
    items.forEach((item) => {
      paketItems.push({
        id: itemIdCounter++,
        paketId: paketId,
        namaPaket: `Paket ${paketId}`,
        namaBarang: item.nama_barang,
        qty: item.qty,
        harga: item.harga,
        hargaPaket: item.harga_paket,
        kodeBarang: item.kode_barang || '',
        satuan: item.satuan,
      });
    });
  });

  return paketItems;
}

function convertMaterialToCartItems(material: RabDetailData['material']): CartItem[] {
  if (!material || material.length === 0) return [];

  return material
    .filter((item) => item.is_paket === 0 && item.is_tambahan === 1)
    .map((item) => ({
      id: item.id,
      namaBarang: item.nama_barang,
      qty: item.qty,
      harga: item.harga,
      kodeBarang: item.kode_barang || '',
      satuan: item.satuan || '',
    }));
}

function convertOngkosToPaketItems(ongkos: RabDetailData['ongkos']): PaketItem[] {
  const paketItems: PaketItem[] = [];
  
  if (!ongkos || ongkos.length === 0) return paketItems;

  const paketMap = new Map<number, typeof ongkos>();
  
  ongkos.forEach((item) => {
    if (item.is_paket === 1 && item.harga_paket > 0) {
      const paketKey = item.harga_paket;
      if (!paketMap.has(paketKey)) {
        paketMap.set(paketKey, []);
      }
      paketMap.get(paketKey)!.push(item);
    }
  });

  let itemIdCounter = 1;
  paketMap.forEach((items, hargaPaket) => {
    const paketId = items[0]?.id || itemIdCounter;
    items.forEach((item) => {
      paketItems.push({
        id: itemIdCounter++,
        paketId: paketId,
        namaPaket: `Paket ${paketId}`,
        namaBarang: item.nama_ongkos,
        qty: 1,
        harga: item.harga,
        hargaPaket: item.harga_paket,
        kodeBarang: item.nama_ongkos,
        satuan: item.satuan_kode,
      });
    });
  });

  return paketItems;
}

function convertOngkosToCartItems(ongkos: RabDetailData['ongkos']): CartItem[] {
  if (!ongkos || ongkos.length === 0) return [];

  return ongkos
    .filter((item) => item.is_paket === 0 && item.is_tambahan === 1)
    .map((item) => ({
      id: item.id,
      namaBarang: item.nama_ongkos,
      qty: 1,
      harga: item.harga,
      kodeOngkos: item.nama_ongkos,
    }));
}

export default function EditMenuRab(): React.ReactElement {
  const params = useParams();
  const rabId = params?.id ? Number(params.id) : null;

  const {
    data: rabDetailResponse,
    isLoading: isLoadingRab,
  } = useSWR(
    rabId ? ['rab-detail-edit', rabId] : null,
    () => API.getRab.getById(rabId!),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  const rabData: RabDetailData | null = useMemo(() => {
    if (rabDetailResponse && rabDetailResponse.success && rabDetailResponse.data) {
      return rabDetailResponse.data;
    }
    return null;
  }, [rabDetailResponse]);

  const isPasangBaru = useMemo(() => {
    return rabData?.detail_rab.pendaftaranpel_id !== null && rabData?.detail_rab.pendaftaranpel_id !== undefined;
  }, [rabData]);

  const pelangganId = useMemo(() => {
    return null;
  }, [rabData]);

  const [paketItems, setPaketItems] = useState<PaketItem[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [paketItemsOngkos, setPaketItemsOngkos] = useState<PaketItem[]>([]);
  const [cartItemsOngkos, setCartItemsOngkos] = useState<CartItem[]>([]);

  const initialPaketChecked = useMemo(() => {
    if (!rabData?.material || rabData.material.length === 0) return false;
    return rabData.material.some((item) => item.is_paket === 1);
  }, [rabData]);

  const initialPaketCheckedOngkos = useMemo(() => {
    if (!rabData?.ongkos || rabData.ongkos.length === 0) return false;
    return rabData.ongkos.some((item) => item.is_paket === 1);
  }, [rabData]);

  React.useEffect(() => {
    if (rabData) {
      setPaketItems(convertMaterialToPaketItems(rabData.material));
      setCartItems(convertMaterialToCartItems(rabData.material));
      setPaketItemsOngkos(convertOngkosToPaketItems(rabData.ongkos));
      setCartItemsOngkos(convertOngkosToCartItems(rabData.ongkos));
    }
  }, [rabData]);

  const pelangganData: PelangganData | null = useMemo(() => {
    if (rabData?.detail_rab) {
      const detail = rabData.detail_rab;
      return {
        id: rabData.id,
        no_pelanggan: detail.no_pelanggan,
        nama: detail.nama_pelanggan,
        alamat: detail.alamat,
        wilayah_id: detail.wilayah_id,
        rayon_id: detail.rayon_id || 0,
        golongan_id: detail.golongan_id,
        diameter_id: detail.diameter_id,
        namaWilayah: detail.wilayah,
        namaRayon: detail.rayon || '',
      } as PelangganData;
    }
    return null;
  }, [rabData]);

  const customerDetail = useMemo(() => {
    if (rabData?.detail_rab) {
      const detail = rabData.detail_rab;
      return {
        noReg: '',
        nopel: detail.no_pelanggan || '',
        nama: detail.nama_pelanggan || '',
        alamat: detail.alamat || '',
        wilayah: detail.wilayah || '',
        rayon: detail.rayon || '',
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
  }, [rabData]);

  const pendaftaranId = useMemo(() => {
    if (rabData?.detail_rab) {
      return isPasangBaru 
        ? rabData.detail_rab.pendaftaranpel_id 
        : rabData.detail_rab.pendaftaranlain_id;
    }
    return null;
  }, [rabData, isPasangBaru]);

  if (!rabId) {
    return (
      <Box sx={{ width: '100%', p: 0, minHeight: 'calc(100vh - 64px)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography>ID RAB tidak ditemukan</Typography>
      </Box>
    );
  }

  if (isLoadingRab) {
    return (
      <Box sx={{ width: '100%', p: 0, minHeight: 'calc(100vh - 64px)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!rabData) {
    return (
      <Box sx={{ width: '100%', p: 0, minHeight: 'calc(100vh - 64px)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography>Data RAB tidak ditemukan</Typography>
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
        onGantiClick={() => {
          console.log('Ganti pelanggan');
        }}
      />

      <MaterialForm
        paketItems={paketItems}
        cartItems={cartItems}
        onPaketItemsChange={setPaketItems}
        onCartItemsChange={setCartItems}
        isPasangBaru={isPasangBaru}
        pelangganData={pelangganData}
        pendaftaranId={pendaftaranId}
        rabId={rabId}
        rabData={rabData}
        paketItemsOngkos={paketItemsOngkos}
        cartItemsOngkos={cartItemsOngkos}
        onPaketItemsOngkosChange={setPaketItemsOngkos}
        onCartItemsOngkosChange={setCartItemsOngkos}
        initialPaketChecked={initialPaketChecked}
        initialPaketCheckedOngkos={initialPaketCheckedOngkos}
      />
    </Box>
  );
}

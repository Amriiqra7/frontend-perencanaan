'use client';

import React, { useState, useMemo } from 'react';
import { Box } from '@mui/material';
import DetailPelanggan from '@/components/menu-rab/DetailPelanggan';
import MaterialForm, { type PaketItem, type CartItem } from '@/components/menu-rab/MaterialForm';

export default function NewMenuRab(): React.ReactElement {
  const [customerDetail] = useState({
    noReg: 'REG000051',
    nopel: '0705489',
    nama: 'PARTONO',
    alamat: 'SEMPU RT 17 PAKEMBINANGUN',
    wilayah: 'Wilayah 1',
    rayon: 'Rayon 1',
  });

  const [paketItems, setPaketItems] = useState<PaketItem[]>([]);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const [subtotalMaterial, setSubtotalMaterial] = useState<number>(0);

  const handlePilihPaket = (paketId: string): void => {
    console.log('Pilih paket:', paketId);
  };

  const handleAddBarang = (barang: string): void => {
    const newItem: CartItem = {
      id: Date.now(),
      namaBarang: barang,
      qty: 1,
      harga: 0,
    };
    setCartItems([...cartItems, newItem]);
  };

  return (
    <Box sx={{ width: '100%', p: 0, minHeight: 'calc(100vh - 64px)', display: 'flex', gap: 1, alignItems: 'stretch' }}>
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
        onPilihPaket={handlePilihPaket}
        onAddBarang={handleAddBarang}
        onTotalMaterialChange={setSubtotalMaterial}
      />
    </Box>
  );
}

'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  useTheme,
} from '@mui/material';
import ProsesTambahRabDrawer from './ProsesTambahRabDrawer';
import MaterialTab from './MaterialTab';
import OngkosTab from './OngkosTab';

export interface PaketItem {
  id: number;
  paketId: number;
  namaPaket: string;
  namaBarang: string;
  qty: number;
  harga: number;
  hargaPaket: number;
  kodeBarang: string;
  satuan: string;
}

export interface CartItem {
  id: number;
  namaBarang: string;
  qty: number;
  harga: number;
  kodeBarang?: string;
  satuan?: string;
  kodeOngkos?: string;
}

interface MaterialFormProps {
  paketItems: PaketItem[];
  cartItems: CartItem[];
  onPaketItemsChange: (items: PaketItem[]) => void;
  onCartItemsChange: (items: CartItem[]) => void;
  onPilihPaket?: (paketId: string) => void;
  onAddBarang?: (barang: string) => void;
  onTotalMaterialChange?: (total: number) => void;
  isPasangBaru?: boolean;
  pelangganData?: import('@/types/rab').PelangganData | null;
  pendaftaranId?: number | null;
  rabId?: number | null;
  rabData?: import('@/types/rab').RabDetailData | null;
  paketItemsOngkos?: PaketItem[];
  cartItemsOngkos?: CartItem[];
  onPaketItemsOngkosChange?: (items: PaketItem[]) => void;
  onCartItemsOngkosChange?: (items: CartItem[]) => void;
  initialPaketChecked?: boolean;
  initialPaketCheckedOngkos?: boolean;
}

export default function MaterialForm({
  paketItems,
  cartItems,
  onPaketItemsChange,
  onCartItemsChange,
  onPilihPaket,
  onAddBarang,
  onTotalMaterialChange,
  isPasangBaru = false,
  pelangganData = null,
  pendaftaranId = null,
  rabId = null,
  rabData = null,
  paketItemsOngkos: initialPaketItemsOngkos = [],
  cartItemsOngkos: initialCartItemsOngkos = [],
  onPaketItemsOngkosChange,
  onCartItemsOngkosChange,
  initialPaketChecked = false,
  initialPaketCheckedOngkos = false,
}: MaterialFormProps): React.ReactElement {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [activeTab, setActiveTab] = useState<number>(0);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [hargaPaketChecked, setHargaPaketChecked] = useState<boolean>(false);
  const [hargaPaketCheckedOngkos, setHargaPaketCheckedOngkos] = useState<boolean>(false);
  
  const [paketItemsOngkos, setPaketItemsOngkos] = useState<PaketItem[]>(initialPaketItemsOngkos);
  const [cartItemsOngkos, setCartItemsOngkos] = useState<CartItem[]>(initialCartItemsOngkos);

  const prevRabIdRef = useRef<number | null>(rabId);
  const prevInitialPaketItemsOngkosLengthRef = useRef<number>(initialPaketItemsOngkos.length);
  const prevInitialCartItemsOngkosLengthRef = useRef<number>(initialCartItemsOngkos.length);

  useEffect(() => {
    const rabIdChanged = prevRabIdRef.current !== rabId;
    const paketLengthChanged = prevInitialPaketItemsOngkosLengthRef.current !== initialPaketItemsOngkos.length;
    const cartLengthChanged = prevInitialCartItemsOngkosLengthRef.current !== initialCartItemsOngkos.length;

    if (rabIdChanged || paketLengthChanged || cartLengthChanged) {
      setTimeout(() => {
        setPaketItemsOngkos(initialPaketItemsOngkos);
        setCartItemsOngkos(initialCartItemsOngkos);
        prevInitialPaketItemsOngkosLengthRef.current = initialPaketItemsOngkos.length;
        prevInitialCartItemsOngkosLengthRef.current = initialCartItemsOngkos.length;
      }, 0);
      
      if (rabIdChanged) {
        prevRabIdRef.current = rabId;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rabId, initialPaketItemsOngkos.length, initialCartItemsOngkos.length]);

  const totalMaterial = useMemo(() => {
    let totalPaket = 0;
    if (paketItems.length > 0) {
      if (hargaPaketChecked) {
        totalPaket = paketItems[0]?.hargaPaket || 0;
      } else {
        totalPaket = paketItems.reduce((sum, item) => sum + (item.harga * item.qty), 0);
      }
    }
    const totalCart = cartItems.reduce((sum, item) => sum + item.harga * item.qty, 0);
    return totalPaket + totalCart;
  }, [paketItems, cartItems, hargaPaketChecked]);

  const totalOngkos = useMemo(() => {
    let totalPaket = 0;
    if (paketItemsOngkos.length > 0) {
      if (hargaPaketCheckedOngkos) {
        totalPaket = paketItemsOngkos[0]?.hargaPaket || 0;
      } else {
        totalPaket = paketItemsOngkos.reduce((sum, item) => sum + item.harga, 0);
      }
    }
    const totalCart = cartItemsOngkos.reduce((sum, item) => sum + item.harga, 0);
    return totalPaket + totalCart;
  }, [paketItemsOngkos, cartItemsOngkos, hargaPaketCheckedOngkos]);

  const isProsesDisabled = useMemo(() => {
    const hasMaterial = paketItems.length > 0 || cartItems.length > 0;
    const hasOngkos = paketItemsOngkos.length > 0 || cartItemsOngkos.length > 0;
    return !hasMaterial && !hasOngkos;
  }, [paketItems.length, cartItems.length, paketItemsOngkos.length, cartItemsOngkos.length]);

  useEffect(() => {
    if (onTotalMaterialChange) {
      onTotalMaterialChange(totalMaterial);
    }
  }, [totalMaterial, onTotalMaterialChange]);

  return (
    <Box 
      sx={{ 
        width: { xs: '100%', sm: '100%', md: '80%' }, 
        p: { xs: 0, md: 1 },
        display: 'flex', 
        minWidth: 0, 
        flex: 1, 
        alignSelf: 'stretch',
      }}
    >
      <Paper
        sx={{
          p: { xs: 1.5, sm: 2, md: 2 },
          width: '100%',
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${isDarkMode ? '#333333' : '#FFE0B2'}`,
          display: 'flex',
          flexDirection: 'column',
          height: { xs: 'auto', md: '100%' },
          minHeight: { xs: 'auto', md: 'calc(100vh - 64px)' },
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(event, newValue) => setActiveTab(newValue)}
          sx={{
            mb: 2,
            borderBottom: '2px solid #FF8C00',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1.25rem',
              color: theme.palette.text.secondary,
              '&.Mui-selected': {
                color: '#FF8C00',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#FF8C00',
            },
          }}
        >
          <Tab label="Material" />
          <Tab label="Ongkos" />
        </Tabs>

        {activeTab === 0 ? (
          <MaterialTab
            paketItems={paketItems}
            cartItems={cartItems}
            onPaketItemsChange={onPaketItemsChange}
            onCartItemsChange={onCartItemsChange}
            onDrawerOpen={() => setDrawerOpen(true)}
            isProsesDisabled={isProsesDisabled}
            onHargaPaketCheckedChange={(checked) => {
              setHargaPaketChecked(checked);
            }}
            initialPaketChecked={initialPaketChecked}
          />
        ) : null}

        {activeTab === 1 ? (
          <OngkosTab
            paketItems={paketItemsOngkos}
            cartItems={cartItemsOngkos}
            onPaketItemsChange={(items) => {
              setPaketItemsOngkos(items);
              if (onPaketItemsOngkosChange) {
                onPaketItemsOngkosChange(items);
              }
            }}
            onCartItemsChange={(items) => {
              setCartItemsOngkos(items);
              if (onCartItemsOngkosChange) {
                onCartItemsOngkosChange(items);
              }
            }}
            onDrawerOpen={() => setDrawerOpen(true)}
            isProsesDisabled={isProsesDisabled}
            onHargaPaketCheckedChange={(checked) => {
              setHargaPaketCheckedOngkos(checked);
            }}
            initialPaketChecked={initialPaketCheckedOngkos}
          />
        ) : null}
      </Paper>

      <ProsesTambahRabDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        totalMaterial={totalMaterial}
        totalOngkos={totalOngkos}
        isPasangBaru={isPasangBaru}
        paketItems={paketItems}
        cartItems={cartItems}
        paketItemsOngkos={paketItemsOngkos}
        cartItemsOngkos={cartItemsOngkos}
        pelangganData={pelangganData}
        pendaftaranId={pendaftaranId}
        rabId={rabId}
        rabData={rabData}
      />
    </Box>
  );
}

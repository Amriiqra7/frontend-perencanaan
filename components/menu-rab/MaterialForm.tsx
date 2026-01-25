'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Autocomplete,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Trash } from 'iconsax-reactjs';
import useSWR from 'swr';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import * as API from '@/core/services/api';
import type { PaketBarangData, BarangData } from '@/types/rab';

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
}

interface MaterialFormProps {
  paketItems: PaketItem[];
  cartItems: CartItem[];
  onPaketItemsChange: (items: PaketItem[]) => void;
  onCartItemsChange: (items: CartItem[]) => void;
  onPilihPaket?: (paketId: string) => void;
  onAddBarang?: (barang: string) => void;
  onTotalMaterialChange?: (total: number) => void;
}

export default function MaterialForm({
  paketItems,
  cartItems,
  onPaketItemsChange,
  onCartItemsChange,
  onPilihPaket,
  onAddBarang,
  onTotalMaterialChange,
}: MaterialFormProps): React.ReactElement {
  const [paketChecked, setPaketChecked] = useState<boolean>(false);
  const [selectedPaket, setSelectedPaket] = useState<PaketBarangData | null>(null);
  const [hargaPaketChecked, setHargaPaketChecked] = useState<boolean>(false);
  const [pencarianBarang, setPencarianBarang] = useState<string>('');
  const [selectedBarang, setSelectedBarang] = useState<BarangData | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [itemIdCounter, setItemIdCounter] = useState<number>(1);
  const [expandedPaket, setExpandedPaket] = useState<boolean>(true);
  const [expandedKeranjang, setExpandedKeranjang] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<number>(0);

  const paketItemsRef = useRef(paketItems);
  const cartItemsRef = useRef(cartItems);
  const onPaketItemsChangeRef = useRef(onPaketItemsChange);
  const onCartItemsChangeRef = useRef(onCartItemsChange);
  const prevPaketItemsLengthRef = useRef(paketItems.length);
  const prevCartItemsLengthRef = useRef(cartItems.length);

  useEffect(() => {
    paketItemsRef.current = paketItems;
  }, [paketItems]);

  useEffect(() => {
    cartItemsRef.current = cartItems;
  }, [cartItems]);

  useEffect(() => {
    onPaketItemsChangeRef.current = onPaketItemsChange;
  }, [onPaketItemsChange]);

  useEffect(() => {
    onCartItemsChangeRef.current = onCartItemsChange;
  }, [onCartItemsChange]);

  const {
    data: paketBarangResponse,
    isLoading: isLoadingPaket,
  } = useSWR(
    paketChecked ? 'combo-paket-barang' : null,
    () => API.getRab.getComboPaketBarang(),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  const paketBarangOptions: PaketBarangData[] = paketBarangResponse?.success && paketBarangResponse?.data
    ? paketBarangResponse.data
    : [];

  const handlePaketSelect = (paket: PaketBarangData | null): void => {
    setSelectedPaket(paket);
  };

  const handleAddPaket = (): void => {
    if (selectedPaket) {
      if (paketItems.length > 0) {
        let currentCounter = itemIdCounter;
        const newPaketItems: PaketItem[] = selectedPaket.detail_barang.map((barang) => {
          const uniqueId = currentCounter++;

          return {
            id: uniqueId,
            paketId: selectedPaket.id,
            namaPaket: selectedPaket.nama_paket,
            namaBarang: barang.nama_barang,
            qty: barang.qty,
            harga: barang.harga,
            hargaPaket: selectedPaket.harga_paket,
            kodeBarang: barang.kode_barang,
            satuan: barang.satuan,
          };
        });

        setItemIdCounter(currentCounter);

        onPaketItemsChange(newPaketItems);
      } else {
        let currentCounter = itemIdCounter;
        const newPaketItems: PaketItem[] = selectedPaket.detail_barang.map((barang) => {
          const uniqueId = currentCounter++;

          return {
            id: uniqueId,
            paketId: selectedPaket.id,
            namaPaket: selectedPaket.nama_paket,
            namaBarang: barang.nama_barang,
            qty: barang.qty,
            harga: barang.harga,
            hargaPaket: selectedPaket.harga_paket,
            kodeBarang: barang.kode_barang,
            satuan: barang.satuan,
          };
        });

        setItemIdCounter(currentCounter);

        onPaketItemsChange([...paketItems, ...newPaketItems]);
      }
      setSelectedPaket(null);
      setExpandedPaket(true);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(pencarianBarang);
        }, 500);

    return () => clearTimeout(timer);
  }, [pencarianBarang]);

  const queryParams = useMemo(() => {
    if (!debouncedSearch.trim()) return {};
    return { q: debouncedSearch };
  }, [debouncedSearch]);

  const {
    data: barangResponse,
    isLoading: isLoadingBarang,
  } = useSWR(
    ['combo-barang', queryParams],
    () => API.getRab.getComboBarang(queryParams),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  const barangOptions: BarangData[] = barangResponse?.success && barangResponse?.data
    ? barangResponse.data
    : [];

  const handleBarangSelect = (barang: BarangData | null): void => {
    if (barang) {
      const existingBarang = cartItems.find((item) => item.id === barang.id);
      if (!existingBarang) {
        const newCartItem: CartItem = {
          id: barang.id,
          namaBarang: barang.nama_barang,
          qty: 1,
          harga: parseFloat(barang.harga_jual) || 0,
        };
        onCartItemsChange([...cartItems, newCartItem]);
        setExpandedKeranjang(true);
      }
      setSelectedBarang(null);
      setPencarianBarang('');
    }
  };

  const handleAddBarang = (): void => {
    if (selectedBarang) {
      handleBarangSelect(selectedBarang);
    }
  };

  const handlePaketQtyChange = useCallback((paketId: number, newQty: number): void => {
    const currentItems = paketItemsRef.current;
    const updateFn = onPaketItemsChangeRef.current;

    if (newQty < 1) {
      const updated = currentItems.map((item) =>
        item.id === paketId ? { ...item, qty: 1 } : item
      );
      updateFn(updated);
      return;
    }
    const updated = currentItems.map((item) =>
      item.id === paketId ? { ...item, qty: newQty } : item
    );
    updateFn(updated);
  }, []);

  const handleCartQtyChange = useCallback((itemId: number, value: string): void => {
    const numValue = value === '' ? 0 : parseInt(value, 10);
    if (isNaN(numValue) || numValue < 0) return;

    const currentItems = cartItemsRef.current;
    const updateFn = onCartItemsChangeRef.current;

    const updated = currentItems.map((item) =>
      item.id === itemId ? { ...item, qty: numValue || 0 } : item
    );
    updateFn(updated);
  }, []);

  const handleDeletePaket = useCallback((itemId: number): void => {
    const currentItems = paketItemsRef.current;
    const updateFn = onPaketItemsChangeRef.current;
    const updated = currentItems.filter((item) => item.id !== itemId);
    updateFn(updated);
  }, []);

  const handleDeleteCartItem = useCallback((itemId: number): void => {
    const currentItems = cartItemsRef.current;
    const updateFn = onCartItemsChangeRef.current;
    const updated = currentItems.filter((item) => item.id !== itemId);
    updateFn(updated);
  }, []);

  const calculatePaketTotal = (item: PaketItem): number => {
    if (hargaPaketChecked) {
      return item.harga * item.qty;
    } else {
      return item.harga * item.qty;
    }
  };

  const totalPaketFooter = useMemo(() => {
    if (paketItems.length === 0) return 0;

    if (hargaPaketChecked) {
      return paketItems[0]?.hargaPaket || 0;
    } else {
      return paketItems.reduce((sum, item) => sum + (item.harga * item.qty), 0);
    }
  }, [paketItems, hargaPaketChecked]);

  const totalPaket = paketItems.reduce((sum, item) => sum + calculatePaketTotal(item), 0);
  const totalCart = cartItems.reduce((sum, item) => sum + item.harga * item.qty, 0);
  const totalMaterial = totalPaketFooter + totalCart;

  useEffect(() => {
    if (onTotalMaterialChange) {
      onTotalMaterialChange(totalMaterial);
    }
  }, [totalMaterial, onTotalMaterialChange]);

  useEffect(() => {
    if (paketItems.length > prevPaketItemsLengthRef.current && paketItems.length > 0) {
      setExpandedPaket(true);
    }
    prevPaketItemsLengthRef.current = paketItems.length;
  }, [paketItems.length]);

  useEffect(() => {
    if (cartItems.length > prevCartItemsLengthRef.current && cartItems.length > 0) {
      setExpandedKeranjang(true);
    }
    prevCartItemsLengthRef.current = cartItems.length;
  }, [cartItems.length]);

  const paketColumns = useMemo<MRT_ColumnDef<PaketItem>[]>(
    () => [
      {
        accessorKey: 'no',
        header: 'NO',
        size: 50,
        Cell: ({ row }) => row.index + 1,
        enableSorting: false,
      },
      {
        accessorKey: 'namaBarang',
        header: 'NAMA BARANG',
        enableSorting: false,
      },
      {
        accessorKey: 'qty',
        header: 'QTY',
        size: 120,
        Cell: ({ row }) => {
          const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            if (value === '') {
              handlePaketQtyChange(row.original.id, 1);
              return;
            }
            const numValue = parseInt(value, 10);
            if (!isNaN(numValue) && numValue >= 1) {
              handlePaketQtyChange(row.original.id, numValue);
            }
          };
          return (
            <TextField
              type="number"
              value={row.original.qty}
              onChange={handleChange}
              size="small"
              inputProps={{ min: 1 }}
              sx={{ width: '80px' }}
            />
          );
        },
        enableSorting: false,
      },
      {
        accessorKey: 'harga',
        header: 'HARGA',
        size: 150,
        Cell: ({ row }) =>
          calculatePaketTotal(row.original).toLocaleString('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
          }),
        enableSorting: false,
      },
      {
        accessorKey: 'action',
        header: 'ACTION',
        size: 80,
        Cell: ({ row }) => (
          <IconButton
            size="small"
            onClick={() => handleDeletePaket(row.original.id)}
            sx={{
              color: '#d32f2f',
              '&:hover': {
                backgroundColor: '#ffebee',
              },
            }}
          >
            <Trash size={18} />
          </IconButton>
        ),
        enableSorting: false,
      },
    ],
    [hargaPaketChecked, handlePaketQtyChange, handleDeletePaket]
  );

  const cartColumns = useMemo<MRT_ColumnDef<CartItem>[]>(
    () => [
      {
        accessorKey: 'no',
        header: 'NO',
        size: 50,
        Cell: ({ row }) => row.index + 1,
        enableSorting: false,
      },
      {
        accessorKey: 'namaBarang',
        header: 'NAMA BARANG',
        enableSorting: false,
      },
      {
        accessorKey: 'qty',
        header: 'QTY',
        size: 120,
        Cell: ({ row }) => (
          <TextField
            type="number"
            value={row.original.qty === 0 ? '' : row.original.qty.toString()}
            onChange={(e) => handleCartQtyChange(row.original.id, e.target.value)}
            size="small"
            inputProps={{ min: 0 }}
            sx={{ width: '80px' }}
          />
        ),
        enableSorting: false,
      },
      {
        accessorKey: 'harga',
        header: 'HARGA',
        size: 150,
        Cell: ({ row }) =>
          (row.original.harga * row.original.qty).toLocaleString('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
          }),
        enableSorting: false,
      },
      {
        accessorKey: 'action',
        header: 'ACTION',
        size: 80,
        Cell: ({ row }) => (
          <IconButton
            size="small"
            onClick={() => handleDeleteCartItem(row.original.id)}
            sx={{
              color: '#d32f2f',
              '&:hover': {
                backgroundColor: '#ffebee',
              },
            }}
          >
            <Trash size={18} />
          </IconButton>
        ),
        enableSorting: false,
      },
    ],
    [handleCartQtyChange, handleDeleteCartItem]
  );

  return (
    <Box sx={{ width: { xs: '100%', md: '80%' }, p: 1, display: 'flex', minWidth: 0, flex: 1, alignSelf: 'stretch' }}>
      <Paper
        sx={{
          p: 2,
          width: '100%',
          backgroundColor: '#fff',
          border: '1px solid #FFE0B2',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
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
              color: '#666',
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, width: '100%', minHeight: 0 }}>
          <Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={paketChecked}
                    onChange={(e) => setPaketChecked(e.target.checked)}
                    sx={{
                      color: '#FF8C00',
                      '&.Mui-checked': {
                        color: '#FF8C00',
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    PAKET
                  </Typography>
                }
              />

              {paketChecked && (
                <>
                  <Autocomplete
                    options={paketBarangOptions}
                    getOptionLabel={(option) => option.nama_paket || ''}
                    value={selectedPaket}
                    onChange={(event, newValue) => handlePaketSelect(newValue)}
                    loading={isLoadingPaket}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="PILIH PAKET"
                        size="small"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {isLoadingPaket ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                        sx={{
                          flex: 1,
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                              borderColor: '#FF8C00',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#FF8C00',
                            },
                          },
                        }}
                      />
                    )}
                    sx={{ flex: 1, minWidth: 0 }}
                  />
                  <Button
                    variant="contained"
                    size="medium"
                    onClick={handleAddPaket}
                    disabled={!selectedPaket}
                    sx={{
                      textTransform: 'none',
                      backgroundColor: '#FF8C00',
                      '&:hover': {
                        backgroundColor: '#FF7F00',
                      },
                      '&:disabled': {
                        backgroundColor: '#ccc',
                      },
                      minWidth: '120px',
                      fontSize: '0.875rem',
                      py: 1,
                    }}
                  >
                    ADD
                  </Button>
                </>
              )}
            </Box>

            {paketChecked && (
              <Box sx={{ mt: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={hargaPaketChecked}
                      onChange={(e) => setHargaPaketChecked(e.target.checked)}
                      sx={{
                        color: '#FF8C00',
                        '&.Mui-checked': {
                          color: '#FF8C00',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body1" sx={{ color: '#666' }}>
                      HARGA PAKET
                    </Typography>
                  }
                />
              </Box>
            )}

            {paketChecked && (
              <Accordion
                expanded={expandedPaket}
                onChange={(event, isExpanded) => setExpandedPaket(isExpanded)}
                sx={{ mt: 2, mb: 2, boxShadow: 'none', border: '1px solid #FFE0B2', borderRadius: 1 }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    backgroundColor: '#FFF8E1',
                    '&:hover': {
                      backgroundColor: '#FFF3E0',
                    },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, color: '#666' }}
                  >
                    TABEL PAKET{paketItems.length > 0 && paketItems[0]?.namaPaket ? ` (${paketItems[0].namaPaket})` : ''}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0 }}>
                  <MaterialReactTable
                    columns={paketColumns}
                    data={paketItems}
                    enablePagination={false}
                    enableColumnResizing={false}
                    enableSorting={false}
                    enableColumnActions={false}
                    enableColumnFilters={false}
                    enableTopToolbar={false}
                    enableBottomToolbar={true}
                    renderBottomToolbarCustomActions={() => (
                      <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', width: '100%', backgroundColor: '#FFF8E1' }}>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#333' }}>
                          Total: {totalPaketFooter.toLocaleString('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            minimumFractionDigits: 0,
                          })}
                        </Typography>
                      </Box>
                    )}
                    muiTableContainerProps={{
                      sx: {
                        maxHeight: '300px',
                        border: 'none',
                        borderRadius: 0,
                      },
                    }}
                    muiTableHeadCellProps={{
                      sx: {
                        backgroundColor: '#FFF8E1',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        borderRight: '1px solid #FFE0B2',
                        '&:last-child': {
                          borderRight: 'none',
                        },
                      },
                    }}
                    muiTableBodyCellProps={{
                      sx: {
                        backgroundColor: '#fff',
                        borderRight: '1px solid #FFE0B2',
                        '&:last-child': {
                          borderRight: 'none',
                        },
                      },
                    }}
                    muiTableBodyRowProps={{
                      sx: {
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        },
                      },
                    }}
                  />
                </AccordionDetails>
              </Accordion>
            )}
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              variant="body1"
              sx={{ fontWeight: 500, mb: 1, color: '#333' }}
            >
              TAMBAHAN
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
              <Autocomplete
                options={barangOptions}
                getOptionLabel={(option) => option.nama_barang || ''}
                value={selectedBarang}
                inputValue={pencarianBarang}
                onInputChange={(event, newInputValue) => {
                  setPencarianBarang(newInputValue);
                }}
                onChange={(event, newValue) => {
                  setSelectedBarang(newValue);
                  if (newValue) {
                    handleBarangSelect(newValue);
                  }
                }}
                loading={isLoadingBarang}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    placeholder="Pencarian Barang"
                    size="small"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isLoadingBarang ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: '#FF8C00',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#FF8C00',
                        },
                      },
                    }}
                  />
                )}
                sx={{ flexGrow: 1 }}
              />
            </Box>

            <Accordion
              expanded={expandedKeranjang}
              onChange={(event, isExpanded) => setExpandedKeranjang(isExpanded)}
              sx={{ boxShadow: 'none', border: '1px solid #FFE0B2', borderRadius: 1 }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  backgroundColor: '#FFF8E1',
                  '&:hover': {
                    backgroundColor: '#FFF3E0',
                  },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, color: '#666' }}
                >
                  TABEL KERANJANG
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0 }}>
                <MaterialReactTable
                  columns={cartColumns}
                  data={cartItems}
                  enablePagination={false}
                  enableColumnResizing={false}
                  enableSorting={false}
                  enableColumnActions={false}
                  enableColumnFilters={false}
                  enableTopToolbar={false}
                  enableBottomToolbar={true}
                  renderBottomToolbarCustomActions={() => (
                    <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', width: '100%', backgroundColor: '#FFF8E1' }}>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#333' }}>
                        Total: {totalCart.toLocaleString('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          minimumFractionDigits: 0,
                        })}
                      </Typography>
                    </Box>
                  )}
                  muiTableContainerProps={{
                    sx: {
                      maxHeight: '400px',
                      border: 'none',
                      borderRadius: 0,
                    },
                  }}
                  muiTableHeadCellProps={{
                    sx: {
                      backgroundColor: '#FFF8E1',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      borderRight: '1px solid #FFE0B2',
                      '&:last-child': {
                        borderRight: 'none',
                      },
                    },
                  }}
                  muiTableBodyCellProps={{
                    sx: {
                      backgroundColor: '#fff',
                      borderRight: '1px solid #FFE0B2',
                      '&:last-child': {
                        borderRight: 'none',
                      },
                    },
                  }}
                  muiTableBodyRowProps={{
                    sx: {
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      },
                    },
                  }}
                />
              </AccordionDetails>
            </Accordion>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  variant="outlined"
                  sx={{
                    textTransform: 'none',
                    borderColor: '#FF8C00',
                    color: '#FF8C00',
                    '&:hover': {
                      borderColor: '#FF7F00',
                      backgroundColor: '#FFF3E0',
                    },
                  }}
                >
                  PROSES
                </Button>
              </Box>
            </Box>
          </Box>
          </Box>
        ) : null}

        {activeTab === 1 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, width: '100%', minHeight: 0 }}>
            <Box>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={paketChecked}
                      onChange={(e) => setPaketChecked(e.target.checked)}
                      sx={{
                        color: '#FF8C00',
                        '&.Mui-checked': {
                          color: '#FF8C00',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      PAKET
                    </Typography>
                  }
                />

                {paketChecked && (
                  <>
                    <Autocomplete
                      options={paketBarangOptions}
                      getOptionLabel={(option) => option.nama_paket || ''}
                      value={selectedPaket}
                      onChange={(event, newValue) => handlePaketSelect(newValue)}
                      loading={isLoadingPaket}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="PILIH PAKET"
                          size="small"
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {isLoadingPaket ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                          sx={{
                            flex: 1,
                            '& .MuiOutlinedInput-root': {
                              '&:hover fieldset': {
                                borderColor: '#FF8C00',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#FF8C00',
                              },
                            },
                          }}
                        />
                      )}
                      sx={{ flex: 1, minWidth: 0 }}
                    />
                    <Button
                      variant="contained"
                      size="medium"
                      onClick={handleAddPaket}
                      disabled={!selectedPaket}
                      sx={{
                        textTransform: 'none',
                        backgroundColor: '#FF8C00',
                        '&:hover': {
                          backgroundColor: '#FF7F00',
                        },
                        '&:disabled': {
                          backgroundColor: '#ccc',
                        },
                        minWidth: '120px',
                        fontSize: '0.875rem',
                        py: 1,
                      }}
                    >
                      ADD
                    </Button>
                  </>
                )}
              </Box>

              {paketChecked && (
                <Box sx={{ mt: 1 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={hargaPaketChecked}
                        onChange={(e) => setHargaPaketChecked(e.target.checked)}
                        sx={{
                          color: '#FF8C00',
                          '&.Mui-checked': {
                            color: '#FF8C00',
                          },
                        }}
                      />
                    }
                    label={
                      <Typography variant="body1" sx={{ color: '#666' }}>
                        HARGA PAKET
                      </Typography>
                    }
                  />
                </Box>
              )}

              {paketChecked && (
                <Accordion sx={{ mt: 2, mb: 2, boxShadow: 'none', border: '1px solid #FFE0B2', borderRadius: 1 }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      backgroundColor: '#FFF8E1',
                      '&:hover': {
                        backgroundColor: '#FFF3E0',
                      },
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 500, color: '#666' }}
                    >
                      TABEL PAKET
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 0 }}>
                    <MaterialReactTable
                      columns={paketColumns}
                      data={paketItems}
                      enablePagination={false}
                      enableColumnResizing={false}
                      enableSorting={false}
                      enableColumnActions={false}
                      enableColumnFilters={false}
                      enableTopToolbar={false}
                      enableBottomToolbar={true}
                      renderBottomToolbarCustomActions={() => (
                        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', width: '100%', backgroundColor: '#FFF8E1' }}>
                          <Typography variant="body1" sx={{ fontWeight: 600, color: '#333' }}>
                            Total: {totalPaketFooter.toLocaleString('id-ID', {
                              style: 'currency',
                              currency: 'IDR',
                              minimumFractionDigits: 0,
                            })}
                          </Typography>
                        </Box>
                      )}
                      muiTableContainerProps={{
                        sx: {
                          maxHeight: '300px',
                          border: 'none',
                          borderRadius: 0,
                        },
                      }}
                      muiTableHeadCellProps={{
                        sx: {
                          backgroundColor: '#FFF8E1',
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          borderRight: '1px solid #FFE0B2',
                          '&:last-child': {
                            borderRight: 'none',
                          },
                        },
                      }}
                      muiTableBodyCellProps={{
                        sx: {
                          backgroundColor: '#fff',
                          borderRight: '1px solid #FFE0B2',
                          '&:last-child': {
                            borderRight: 'none',
                          },
                        },
                      }}
                      muiTableBodyRowProps={{
                        sx: {
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                          },
                        },
                      }}
                    />
                  </AccordionDetails>
                </Accordion>
              )}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography
                variant="body1"
                sx={{ fontWeight: 500, mb: 1, color: '#333' }}
              >
                TAMBAHAN
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
                <Autocomplete
                  options={barangOptions}
                  getOptionLabel={(option) => option.nama_barang || ''}
                  value={selectedBarang}
                  inputValue={pencarianBarang}
                  onInputChange={(event, newInputValue) => {
                    setPencarianBarang(newInputValue);
                  }}
                  onChange={(event, newValue) => {
                    setSelectedBarang(newValue);
                    if (newValue) {
                      handleBarangSelect(newValue);
                    }
                  }}
                  loading={isLoadingBarang}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      placeholder="Pencarian Barang"
                      size="small"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {isLoadingBarang ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: '#FF8C00',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#FF8C00',
                          },
                        },
                      }}
                    />
                  )}
                  sx={{ flexGrow: 1 }}
                />
              </Box>
              <Accordion
                expanded={expandedKeranjang}
                onChange={(event, isExpanded) => setExpandedKeranjang(isExpanded)}
                sx={{ boxShadow: 'none', border: '1px solid #FFE0B2', borderRadius: 1 }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    backgroundColor: '#FFF8E1',
                    '&:hover': {
                      backgroundColor: '#FFF3E0',
                    },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, color: '#666' }}
                  >
                    TABEL KERANJANG
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0 }}>
                  <MaterialReactTable
                    columns={cartColumns}
                    data={cartItems}
                    enablePagination={false}
                    enableColumnResizing={false}
                    enableSorting={false}
                    enableColumnActions={false}
                    enableColumnFilters={false}
                    enableTopToolbar={false}
                    enableBottomToolbar={true}
                    renderBottomToolbarCustomActions={() => (
                      <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', width: '100%', backgroundColor: '#FFF8E1' }}>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#333' }}>
                          Total: {totalCart.toLocaleString('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            minimumFractionDigits: 0,
                          })}
                        </Typography>
                      </Box>
                    )}
                    muiTableContainerProps={{
                      sx: {
                        maxHeight: '400px',
                        border: 'none',
                        borderRadius: 0,
                      },
                    }}
                    muiTableHeadCellProps={{
                      sx: {
                        backgroundColor: '#FFF8E1',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        borderRight: '1px solid #FFE0B2',
                        '&:last-child': {
                          borderRight: 'none',
                        },
                      },
                    }}
                    muiTableBodyCellProps={{
                      sx: {
                        backgroundColor: '#fff',
                        borderRight: '1px solid #FFE0B2',
                        '&:last-child': {
                          borderRight: 'none',
                        },
                      },
                    }}
                    muiTableBodyRowProps={{
                      sx: {
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        },
                      },
                    }}
                  />
                </AccordionDetails>
              </Accordion>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Button
                    variant="outlined"
                    sx={{
                      textTransform: 'none',
                      borderColor: '#FF8C00',
                      color: '#FF8C00',
                      '&:hover': {
                        borderColor: '#FF7F00',
                        backgroundColor: '#FFF3E0',
                      },
                    }}
                  >
                    PROSES
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        ) : null}
      </Paper>
    </Box>
  );
}

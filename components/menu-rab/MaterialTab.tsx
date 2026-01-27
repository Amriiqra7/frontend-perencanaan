'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Box,
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
  useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Trash } from 'iconsax-reactjs';
import useSWR from 'swr';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import * as API from '@/core/services/api';
import type { PaketBarangData, BarangData } from '@/types/rab';
import type { PaketItem, CartItem } from './MaterialForm';

interface MaterialTabProps {
  paketItems: PaketItem[];
  cartItems: CartItem[];
  onPaketItemsChange: (items: PaketItem[]) => void;
  onCartItemsChange: (items: CartItem[]) => void;
  onDrawerOpen: () => void;
  isProsesDisabled: boolean;
  onHargaPaketCheckedChange?: (checked: boolean) => void;
  initialPaketChecked?: boolean;
}

export default function MaterialTab({
  paketItems,
  cartItems,
  onPaketItemsChange,
  onCartItemsChange,
  onDrawerOpen,
  isProsesDisabled,
  onHargaPaketCheckedChange,
  initialPaketChecked = false,
}: MaterialTabProps): React.ReactElement {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [paketChecked, setPaketChecked] = useState<boolean>(initialPaketChecked);
  const [selectedPaket, setSelectedPaket] = useState<PaketBarangData | null>(null);
  const [hargaPaketChecked, setHargaPaketChecked] = useState<boolean>(false);
  const [pencarianBarang, setPencarianBarang] = useState<string>('');
  const [selectedBarang, setSelectedBarang] = useState<BarangData | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [itemIdCounter, setItemIdCounter] = useState<number>(1);
  const [expandedPaket, setExpandedPaket] = useState<boolean>(true);
  const [expandedKeranjang, setExpandedKeranjang] = useState<boolean>(true);

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

  useEffect(() => {
    if (initialPaketChecked) {
      setPaketChecked(true);
    }
  }, [initialPaketChecked]);

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
          kodeBarang: barang.kode_barang,
          satuan: barang.satuan,
        };
        onCartItemsChange([...cartItems, newCartItem]);
        setExpandedKeranjang(true);
      }
      setSelectedBarang(null);
      setPencarianBarang('');
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

  const totalCart = cartItems.reduce((sum, item) => sum + item.harga * item.qty, 0);

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
                  minWidth: { xs: '100px', sm: '120px' },
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
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
                  onChange={(e) => {
                    setHargaPaketChecked(e.target.checked);
                    if (onHargaPaketCheckedChange) {
                      onHargaPaketCheckedChange(e.target.checked);
                    }
                  }}
                  sx={{
                    color: '#FF8C00',
                    '&.Mui-checked': {
                      color: '#FF8C00',
                    },
                  }}
                />
              }
              label={
                <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
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
            sx={{ mt: 2, mb: 2, boxShadow: 'none', border: `1px solid ${isDarkMode ? '#333333' : '#FFE0B2'}`, borderRadius: 1 }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                backgroundColor: isDarkMode ? '#2A2A2A' : '#FFF8E1',
                '&:hover': {
                  backgroundColor: isDarkMode ? '#333333' : '#FFF3E0',
                },
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, color: theme.palette.text.secondary }}
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
                  <Box sx={{ p: { xs: 1, sm: 2 }, display: 'flex', justifyContent: 'flex-end', width: '100%', backgroundColor: isDarkMode ? '#2A2A2A' : '#FFF8E1' }}>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.text.primary, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
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
                    maxHeight: { xs: '250px', sm: '300px' },
                    border: 'none',
                    borderRadius: 0,
                    overflowX: 'auto',
                  },
                }}
                muiTableHeadCellProps={{
                  sx: {
                    backgroundColor: isDarkMode ? '#2A2A2A' : '#FFF8E1',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    borderRight: `1px solid ${isDarkMode ? '#333333' : '#FFE0B2'}`,
                    color: theme.palette.text.primary,
                    '&:last-child': {
                      borderRight: 'none',
                    },
                  },
                }}
                muiTableBodyCellProps={{
                  sx: {
                    backgroundColor: theme.palette.background.paper,
                    borderRight: `1px solid ${isDarkMode ? '#333333' : '#FFE0B2'}`,
                    color: theme.palette.text.primary,
                    '&:last-child': {
                      borderRight: 'none',
                    },
                  },
                }}
                muiTableBodyRowProps={{
                  sx: {
                    '&:hover': {
                      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
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
          sx={{ fontWeight: 500, mb: 1, color: theme.palette.text.primary }}
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
          sx={{ boxShadow: 'none', border: `1px solid ${isDarkMode ? '#333333' : '#FFE0B2'}`, borderRadius: 1 }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              backgroundColor: isDarkMode ? '#2A2A2A' : '#FFF8E1',
              '&:hover': {
                backgroundColor: isDarkMode ? '#333333' : '#FFF3E0',
              },
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, color: theme.palette.text.secondary }}
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
                <Box sx={{ p: { xs: 1, sm: 2 }, display: 'flex', justifyContent: 'flex-end', width: '100%', backgroundColor: isDarkMode ? '#2A2A2A' : '#FFF8E1' }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.text.primary, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
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
                  maxHeight: { xs: '300px', sm: '400px' },
                  border: 'none',
                  borderRadius: 0,
                  overflowX: 'auto',
                },
              }}
              muiTableHeadCellProps={{
                sx: {
                  backgroundColor: isDarkMode ? '#2A2A2A' : '#FFF8E1',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  borderRight: `1px solid ${isDarkMode ? '#333333' : '#FFE0B2'}`,
                  color: theme.palette.text.primary,
                  '&:last-child': {
                    borderRight: 'none',
                  },
                },
              }}
              muiTableBodyCellProps={{
                sx: {
                  backgroundColor: theme.palette.background.paper,
                  borderRight: `1px solid ${isDarkMode ? '#333333' : '#FFE0B2'}`,
                  color: theme.palette.text.primary,
                  '&:last-child': {
                    borderRight: 'none',
                  },
                },
              }}
              muiTableBodyRowProps={{
                sx: {
                  '&:hover': {
                    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
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
              onClick={onDrawerOpen}
              disabled={isProsesDisabled}
              sx={{
                textTransform: 'none',
                borderColor: '#FF8C00',
                color: '#FF8C00',
                '&:hover': {
                  borderColor: '#FF7F00',
                  backgroundColor: '#FFF3E0',
                },
                '&:disabled': {
                  borderColor: '#ccc',
                  color: '#ccc',
                },
              }}
            >
              PROSES
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

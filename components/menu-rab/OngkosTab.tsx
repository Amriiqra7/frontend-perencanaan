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
import type { PaketOngkosData, OngkosComboData } from '@/types/rab';
import type { PaketItem, CartItem } from './MaterialForm';

interface OngkosTabProps {
  paketItems: PaketItem[];
  cartItems: CartItem[];
  onPaketItemsChange: (items: PaketItem[]) => void;
  onCartItemsChange: (items: CartItem[]) => void;
  onDrawerOpen: () => void;
  isProsesDisabled: boolean;
  onHargaPaketCheckedChange?: (checked: boolean) => void;
  initialPaketChecked?: boolean;
}

export default function OngkosTab({
  paketItems,
  cartItems,
  onPaketItemsChange,
  onCartItemsChange,
  onDrawerOpen,
  isProsesDisabled,
  onHargaPaketCheckedChange,
  initialPaketChecked = false,
}: OngkosTabProps): React.ReactElement {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [paketChecked, setPaketChecked] = useState<boolean>(initialPaketChecked);
  const [selectedPaket, setSelectedPaket] = useState<PaketOngkosData | null>(null);
  const [hargaPaketChecked, setHargaPaketChecked] = useState<boolean>(false);
  const [pencarianOngkos, setPencarianOngkos] = useState<string>('');
  const [selectedOngkos, setSelectedOngkos] = useState<OngkosComboData | null>(null);
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
    data: paketOngkosResponse,
    isLoading: isLoadingPaket,
  } = useSWR(
    paketChecked ? 'combo-paket-ongkos' : null,
    () => API.getRab.getComboPaketOngkos(),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  const paketOngkosOptions: PaketOngkosData[] = paketOngkosResponse?.success && paketOngkosResponse?.data
    ? paketOngkosResponse.data
    : [];

  const handlePaketSelect = (paket: PaketOngkosData | null): void => {
    setSelectedPaket(paket);
  };

  const handleAddPaket = (): void => {
    if (selectedPaket) {
      const currentItems = paketItemsRef.current;
      const updateFn = onPaketItemsChangeRef.current;
      
      let currentCounter = itemIdCounter;
      const newPaketItems: PaketItem[] = selectedPaket.detail_ongkos.map((ongkos) => {
        const uniqueId = currentCounter++;

        return {
          id: uniqueId,
          paketId: selectedPaket.id,
          namaPaket: selectedPaket.nama_paket,
          namaBarang: ongkos.nama_ongkos,
          qty: 1,
          harga: ongkos.harga,
          hargaPaket: selectedPaket.harga_paket,
          kodeBarang: ongkos.kode_ongkos,
          satuan: '',
        };
      });

      setItemIdCounter(currentCounter);
      
      const finalItems = currentItems.length > 0 ? newPaketItems : [...currentItems, ...newPaketItems];
      
      updateFn(finalItems);
      
      setSelectedPaket(null);
      setExpandedPaket(true);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(pencarianOngkos);
    }, 500);

    return () => clearTimeout(timer);
  }, [pencarianOngkos]);

  const queryParams = useMemo(() => {
    if (!debouncedSearch.trim()) return {};
    return { q: debouncedSearch };
  }, [debouncedSearch]);

  const {
    data: ongkosResponse,
    isLoading: isLoadingOngkos,
  } = useSWR(
    ['combo-ongkos', queryParams],
    () => API.getRab.getComboOngkos(queryParams),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  const ongkosOptions: OngkosComboData[] = ongkosResponse?.success && ongkosResponse?.data
    ? ongkosResponse.data
    : [];

  const handleOngkosSelect = (ongkos: OngkosComboData | null): void => {
    if (ongkos) {
      const currentItems = cartItemsRef.current;
      const updateFn = onCartItemsChangeRef.current;
      
      const existingOngkos = currentItems.find((item) => item.id === ongkos.id);
      if (!existingOngkos) {
        const newCartItem: CartItem = {
          id: ongkos.id,
          namaBarang: ongkos.nama_ongkos,
          qty: 1,
          harga: parseFloat(ongkos.harga_ongkos) || 0,
          kodeOngkos: ongkos.kode_ongkos,
        };
        updateFn([...currentItems, newCartItem]);
        setExpandedKeranjang(true);
      }
      setSelectedOngkos(null);
      setPencarianOngkos('');
    }
  };


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

  const totalPaketFooter = useMemo(() => {
    if (paketItems.length === 0) return 0;

    if (hargaPaketChecked) {
      return paketItems[0]?.hargaPaket || 0;
    } else {
      return paketItems.reduce((sum, item) => sum + item.harga, 0);
    }
  }, [paketItems, hargaPaketChecked]);

  const totalCart = cartItems.reduce((sum, item) => sum + item.harga, 0);

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
        header: 'NAMA ONGKOS',
        enableSorting: false,
      },
      {
        accessorKey: 'harga',
        header: 'HARGA',
        size: 150,
        Cell: ({ row }) =>
          row.original.harga.toLocaleString('id-ID', {
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
    [handleDeletePaket]
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
        header: 'NAMA ONGKOS',
        enableSorting: false,
      },
      {
        accessorKey: 'harga',
        header: 'HARGA',
        size: 150,
        Cell: ({ row }) =>
          row.original.harga.toLocaleString('id-ID', {
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
    [handleDeleteCartItem]
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
                options={paketOngkosOptions}
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
            options={ongkosOptions}
            getOptionLabel={(option) => option.nama_ongkos || ''}
            value={selectedOngkos}
            inputValue={pencarianOngkos}
            onInputChange={(event, newInputValue) => {
              setPencarianOngkos(newInputValue);
            }}
            onChange={(event, newValue) => {
              setSelectedOngkos(newValue);
              if (newValue) {
                handleOngkosSelect(newValue);
              }
            }}
            loading={isLoadingOngkos}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                placeholder="Pencarian Ongkos"
                size="small"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {isLoadingOngkos ? <CircularProgress color="inherit" size={20} /> : null}
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

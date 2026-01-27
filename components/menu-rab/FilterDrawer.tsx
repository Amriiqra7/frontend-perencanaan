'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Divider,
  IconButton,
  Autocomplete,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { CloseCircle } from 'iconsax-reactjs';
import useSWR from 'swr';
import { getRab } from '@/core/services/api';
import type { RabFilter, WilayahData, RayonData } from '@/types/rab';

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  filter: RabFilter;
  onFilterChange: (filter: RabFilter) => void;
  onReset: () => void;
}

export default function FilterDrawer({
  open,
  onClose,
  filter,
  onFilterChange,
  onReset,
}: FilterDrawerProps): React.ReactElement {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [localSelectedWilayah, setLocalSelectedWilayah] = useState<WilayahData | null>(null);
  const [localSelectedRayon, setLocalSelectedRayon] = useState<RayonData | null>(null);

  const [localNoRab, setLocalNoRab] = useState<string>(filter.noRab || '');
  const [localJenisRab, setLocalJenisRab] = useState<string>(filter.jenisRab || '');
  const [localNoPel, setLocalNoPel] = useState<string>(filter.noPel || '');
  const [localNama, setLocalNama] = useState<string>(filter.nama || '');

  const [debouncedNoRab, setDebouncedNoRab] = useState<string>(filter.noRab || '');
  const [debouncedJenisRab, setDebouncedJenisRab] = useState<string>(filter.jenisRab || '');
  const [debouncedNoPel, setDebouncedNoPel] = useState<string>(filter.noPel || '');
  const [debouncedNama, setDebouncedNama] = useState<string>(filter.nama || '');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedNoRab(localNoRab);
    }, 500);

    return () => clearTimeout(timer);
  }, [localNoRab]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedJenisRab(localJenisRab);
    }, 500);

    return () => clearTimeout(timer);
  }, [localJenisRab]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedNoPel(localNoPel);
    }, 500);

    return () => clearTimeout(timer);
  }, [localNoPel]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedNama(localNama);
    }, 500);

    return () => clearTimeout(timer);
  }, [localNama]);

  useEffect(() => {
    const hasChanges =
      debouncedNoRab !== (filter.noRab || '') ||
      debouncedJenisRab !== (filter.jenisRab || '') ||
      debouncedNoPel !== (filter.noPel || '') ||
      debouncedNama !== (filter.nama || '');

    if (hasChanges) {
      const newFilter: RabFilter = { ...filter };

      if (debouncedNoRab) {
        newFilter.noRab = debouncedNoRab;
      } else {
        delete newFilter.noRab;
      }

      if (debouncedJenisRab) {
        newFilter.jenisRab = debouncedJenisRab;
      } else {
        delete newFilter.jenisRab;
      }

      if (debouncedNoPel) {
        newFilter.noPel = debouncedNoPel;
      } else {
        delete newFilter.noPel;
      }

      if (debouncedNama) {
        newFilter.nama = debouncedNama;
      } else {
        delete newFilter.nama;
      }

      onFilterChange(newFilter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedNoRab, debouncedJenisRab, debouncedNoPel, debouncedNama]);

  useEffect(() => {
    setLocalNoRab(filter.noRab || '');
    setLocalJenisRab(filter.jenisRab || '');
    setLocalNoPel(filter.noPel || '');
    setLocalNama(filter.nama || '');
  }, [filter.noRab, filter.jenisRab, filter.noPel, filter.nama]);

  const {
    data: wilayahResponse,
    isLoading: isLoadingWilayah,
  } = useSWR(
    open ? 'combo-wilayah' : null,
    () => getRab.getComboWilayah(),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  const wilayahOptions: WilayahData[] = useMemo(() => {
    if (wilayahResponse?.status === 200 && wilayahResponse?.data) {
      return wilayahResponse.data;
    }
    return [];
  }, [wilayahResponse]);

  const rayonQueryParams = useMemo(() => {
    if (filter.wilayah_id) {
      return { wilayah_id: filter.wilayah_id };
    }
    return null;
  }, [filter.wilayah_id]);

  const {
    data: rayonResponse,
    isLoading: isLoadingRayon,
  } = useSWR(
    open && rayonQueryParams ? ['combo-rayon', rayonQueryParams] : null,
    () => getRab.getComboRayon(rayonQueryParams || {}),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  const rayonOptions: RayonData[] = useMemo(() => {
    if (rayonResponse?.status === 200 && rayonResponse?.data) {
      return rayonResponse.data;
    }
    return [];
  }, [rayonResponse]);

  const selectedWilayah = useMemo(() => {
    if (localSelectedWilayah) {
      return localSelectedWilayah;
    }
    if (filter.wilayah_id && wilayahOptions.length > 0) {
      return wilayahOptions.find((w) => w.id === filter.wilayah_id) || null;
    }
    return null;
  }, [filter.wilayah_id, wilayahOptions, localSelectedWilayah]);

  const selectedRayon = useMemo(() => {
    if (localSelectedRayon) {
      return localSelectedRayon;
    }
    if (filter.rayon_id && rayonOptions.length > 0 && filter.wilayah_id) {
      return rayonOptions.find((r) => r.id === filter.rayon_id) || null;
    }
    return null;
  }, [filter.rayon_id, filter.wilayah_id, rayonOptions, localSelectedRayon]);

  const handleFieldChange = (field: keyof RabFilter, value: string | boolean | number | undefined): void => {
    const newFilter: RabFilter = { ...filter };

    if (value === undefined) {
      if (field === 'wilayah_id') {
        const { wilayah_id, ...rest } = newFilter;
        onFilterChange(rest);
        return;
      } else if (field === 'rayon_id') {
        const { rayon_id, ...rest } = newFilter;
        onFilterChange(rest);
        return;
      } else if (field === 'wilayah') {
        const { wilayah, ...rest } = newFilter;
        onFilterChange(rest);
        return;
      } else if (field === 'rayon') {
        const { rayon, ...rest } = newFilter;
        onFilterChange(rest);
        return;
      }
    } else {
      newFilter[field] = value as string & number & boolean;
    }

    if (field === 'wilayah_id' && value !== filter.wilayah_id) {
      const { rayon_id, rayon, ...rest } = newFilter;
      const finalFilter = { ...rest };
      setLocalSelectedRayon(null);
      onFilterChange(finalFilter);
      return;
    }

    onFilterChange(newFilter);
  };

  const handleWilayahChange = (event: unknown, newValue: WilayahData | null): void => {
    setLocalSelectedWilayah(newValue);
    const newFilter: RabFilter = { ...filter };

    if (newValue) {
      newFilter.wilayah_id = newValue.id;
      newFilter.wilayah = newValue.nama;
      delete newFilter.rayon_id;
      delete newFilter.rayon;
      setLocalSelectedRayon(null);
    } else {
      delete newFilter.wilayah_id;
      delete newFilter.wilayah;
      delete newFilter.rayon_id;
      delete newFilter.rayon;
      setLocalSelectedRayon(null);
    }

    onFilterChange(newFilter);
  };

  const handleRayonChange = (event: unknown, newValue: RayonData | null): void => {
    setLocalSelectedRayon(newValue);
    const newFilter: RabFilter = { ...filter };

    if (newValue) {
      newFilter.rayon_id = newValue.id;
      newFilter.rayon = newValue.nama;
    } else {
      delete newFilter.rayon_id;
      delete newFilter.rayon;
    }

    onFilterChange(newFilter);
  };

  const handleReset = (): void => {
    setLocalSelectedWilayah(null);
    setLocalSelectedRayon(null);
    setLocalNoRab('');
    setLocalJenisRab('');
    setLocalNoPel('');
    setLocalNama('');
    onReset();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 320,
          padding: 2,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          backgroundColor: theme.palette.background.paper,
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
          Filter
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseCircle size={24} color={isDarkMode ? '#b0b0b0' : '#666'} />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 2, borderColor: theme.palette.divider }} />

      <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', gap: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, overflowY: 'auto', overflowX: 'hidden', pb: 1 }}>
          <Box sx={{ pt: 3, pb: 1 }}>
            <TextField
              label="TGL RAB"
              type="date"
              value={filter.tglRab || ''}
              onChange={(e) => handleFieldChange('tglRab', e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              size="small"
              slotProps={{
                input: {
                  sx: {
                    '& input[type="date"]::-webkit-calendar-picker-indicator': {
                      cursor: 'pointer',
                    },
                  },
                },
              }}
              sx={{
                '& .MuiInputBase-root': {
                  overflow: 'visible',
                },
                '& .MuiInputBase-input': {
                  overflow: 'visible',
                },
              }}
            />
          </Box>

          <TextField
            label="NO RAB"
            value={localNoRab}
            onChange={(e) => setLocalNoRab(e.target.value)}
            fullWidth
            size="small"
          />

          <TextField
            label="Jenis RAB"
            value={localJenisRab}
            onChange={(e) => setLocalJenisRab(e.target.value)}
            fullWidth
            size="small"
          />

          <TextField
            label="No. Pel"
            value={localNoPel}
            onChange={(e) => setLocalNoPel(e.target.value)}
            fullWidth
            size="small"
          />

          <TextField
            label="Nama"
            value={localNama}
            onChange={(e) => setLocalNama(e.target.value)}
            fullWidth
            size="small"
          />

          <Autocomplete
            options={wilayahOptions}
            getOptionLabel={(option) => option.nama || ''}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={selectedWilayah}
            onChange={handleWilayahChange}
            loading={isLoadingWilayah}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Wilayah"
                fullWidth
                size="small"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {isLoadingWilayah ? <CircularProgress color="inherit" size={20} /> : null}
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
          />

          <Autocomplete
            options={rayonOptions}
            getOptionLabel={(option) => option.nama || ''}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={selectedRayon}
            onChange={handleRayonChange}
            disabled={!filter.wilayah_id}
            loading={isLoadingRayon}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Rayon"
                fullWidth
                size="small"
                placeholder={filter.wilayah_id ? 'Pilih Rayon' : 'Pilih Wilayah terlebih dahulu'}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {isLoadingRayon ? <CircularProgress color="inherit" size={20} /> : null}
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
          />

          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filter.setuju || false}
                  onChange={(e) => handleFieldChange('setuju', e.target.checked)}
                  sx={{
                    '& .MuiSvgIcon-root': {
                      fontSize: 28,
                    },
                    padding: '4px',
                  }}
                />
              }
              label="Setuju"
              sx={{
                margin: 0,
                '& .MuiFormControlLabel-label': {
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: theme.palette.text.primary,
                },
              }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={filter.lunas || false}
                  onChange={(e) => handleFieldChange('lunas', e.target.checked)}
                  sx={{
                    '& .MuiSvgIcon-root': {
                      fontSize: 28,
                    },
                    padding: '4px',
                  }}
                />
              }
              label="Lunas"
              sx={{
                margin: 0,
                '& .MuiFormControlLabel-label': {
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: theme.palette.text.primary,
                },
              }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 1,
            pt: 2,
            borderTop: `1px solid #FFE0B2`,
            position: 'sticky',
            bottom: 0,
          }}
        >
          <Button variant="outlined" onClick={handleReset} fullWidth>
            Reset
          </Button>
          <Button variant="contained" onClick={onClose} fullWidth>
            Cari Data
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}

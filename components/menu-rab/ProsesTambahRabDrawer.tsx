'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Box,
  Drawer,
  Typography,
  TextField,
  Button,
  Divider,
  Checkbox,
  FormControlLabel,
  Autocomplete,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
} from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { handleRupiahInputChange, parseRupiahInput, formatRupiahInput } from '@/config/global';
import useSWR from 'swr';
import { toast } from 'react-hot-toast';
import * as API from '@/core/services/api';
import type { JasaData, PPNData, PelangganData, RabCreatePayload, GolonganData, DiameterData } from '@/types/rab';
import type { PaketItem, CartItem } from './MaterialForm';
import { useSWRConfig } from 'swr';
import {
  generateNoRab,
  getTanggalRab,
  getJenisRab,
  buildMaterialPaket,
  buildMaterialTambahan,
  buildOngkosPaket,
  buildOngkosTambahan,
} from '@/lib/rabPayloadBuilder';

interface ProsesTambahRabDrawerProps {
  open: boolean;
  onClose: () => void;
  totalMaterial: number;
  totalOngkos: number;
  isPasangBaru?: boolean;
  paketItems: PaketItem[];
  cartItems: CartItem[];
  paketItemsOngkos: PaketItem[];
  cartItemsOngkos: CartItem[];
  pelangganData: PelangganData | null;
  pendaftaranId?: number | null;
  rabId?: number | null;
  rabData?: import('@/types/rab').RabDetailData | null;
}

interface RabFormValues {
  golongan_id: number | null;
  diameter_id: number | null;
}

export default function ProsesTambahRabDrawer({
  open,
  onClose,
  totalMaterial,
  totalOngkos,
  isPasangBaru = false,
  paketItems,
  cartItems,
  paketItemsOngkos,
  cartItemsOngkos,
  pelangganData,
  pendaftaranId = null,
  rabId = null,
  rabData = null,
}: ProsesTambahRabDrawerProps): React.ReactElement {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const isEditMode = rabId !== null && rabId !== undefined;
  
  const initialDiskon = useMemo(() => {
    if (isEditMode && rabData?.detail_rab) {
      return formatRupiahInput(rabData.detail_rab.diskon || 0);
    }
    return '';
  }, [isEditMode, rabData]);

  const initialJasaId = useMemo(() => {
    if (isEditMode && rabData?.detail_rab) {
      return rabData.detail_rab.jasa_id || null;
    }
    return null;
  }, [isEditMode, rabData]);

  const initialPPN = useMemo(() => {
    if (isEditMode && rabData?.detail_rab) {
      return rabData.detail_rab.ppn || 0;
    }
    return 0;
  }, [isEditMode, rabData]);

  const initialPembulatan = useMemo(() => {
    if (isEditMode && rabData?.detail_rab) {
      return '';
    }
    return '';
  }, [isEditMode, rabData]);

  const computedDiskon = useMemo(() => {
    if (isEditMode && rabData?.detail_rab) {
      return formatRupiahInput(rabData.detail_rab.diskon || 0);
    }
    return '';
  }, [isEditMode, rabData]);

  const computedJasaChecked = useMemo(() => {
    if (isEditMode && rabData?.detail_rab) {
      return rabData.detail_rab.jasa_id !== null && rabData.detail_rab.jasa_id !== undefined;
    }
    return false;
  }, [isEditMode, rabData]);

  const computedPpnChecked = useMemo(() => {
    if (isEditMode && rabData?.detail_rab) {
      return (rabData.detail_rab.ppn || 0) > 0;
    }
    return false;
  }, [isEditMode, rabData]);

  const [diskon, setDiskon] = useState<string>(computedDiskon);
  const [jasaChecked, setJasaChecked] = useState<boolean>(computedJasaChecked);
  const [ppnChecked, setPpnChecked] = useState<boolean>(computedPpnChecked);
  const [pembulatan, setPembulatan] = useState<string>(initialPembulatan);
  const [selectedGolongan, setSelectedGolongan] = useState<GolonganData | null>(null);
  const [selectedDiameter, setSelectedDiameter] = useState<DiameterData | null>(null);

  const initializedRef = useRef<boolean>(false);
  const rabDataIdRef = useRef<number | null>(null);
  const prevComputedDiskonRef = useRef<string>(computedDiskon);
  const prevComputedJasaCheckedRef = useRef<boolean>(computedJasaChecked);
  const prevComputedPpnCheckedRef = useRef<boolean>(computedPpnChecked);

  useEffect(() => {
    prevComputedDiskonRef.current = computedDiskon;
    prevComputedJasaCheckedRef.current = computedJasaChecked;
    prevComputedPpnCheckedRef.current = computedPpnChecked;
  }, [computedDiskon, computedJasaChecked, computedPpnChecked]);

  useEffect(() => {
    const currentRabId = rabData?.detail_rab?.id || null;
    const shouldInitialize = isEditMode && 
      (!initializedRef.current || rabDataIdRef.current !== currentRabId);

    if (shouldInitialize && currentRabId) {
      setTimeout(() => {
        setDiskon(prevComputedDiskonRef.current);
        setJasaChecked(prevComputedJasaCheckedRef.current);
        setPpnChecked(prevComputedPpnCheckedRef.current);
      }, 0);
      
      initializedRef.current = true;
      rabDataIdRef.current = currentRabId;
    } else if (!isEditMode) {
      initializedRef.current = false;
      rabDataIdRef.current = null;
    }
  }, [isEditMode, rabData?.detail_rab?.id]);

  const {
    data: golonganResponse,
    isLoading: isLoadingGolongan,
  } = useSWR(
    open && isPasangBaru ? 'combo-golongan' : null,
    () => API.getRab.getComboGolongan(),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  const golonganOptions: GolonganData[] = golonganResponse?.status === 200 && golonganResponse?.data
    ? golonganResponse.data
    : [];

  const {
    data: diameterResponse,
    isLoading: isLoadingDiameter,
  } = useSWR(
    open && isPasangBaru ? 'combo-diameter' : null,
    () => API.getRab.getComboDiameter(),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  const diameterOptions: DiameterData[] = diameterResponse?.success && diameterResponse?.data
    ? diameterResponse.data
    : [];

  const {
    data: jasaResponse,
    isLoading: isLoadingJasa,
  } = useSWR(
    open ? 'combo-jasa' : null,
    () => API.getRab.getComboJasa(),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  const jasaOptions: JasaData[] = jasaResponse?.success && jasaResponse?.data
    ? jasaResponse.data
    : [];

  const {
    data: ppnResponse,
    isLoading: isLoadingPPN,
  } = useSWR(
    open ? 'combo-ppn' : null,
    () => API.getRab.getComboPPN(),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  const ppnOptions: PPNData[] = ppnResponse?.success && ppnResponse?.data
    ? ppnResponse.data
    : [];

  const computedSelectedJasa = useMemo(() => {
    if (isEditMode && rabData?.detail_rab?.jasa_id && jasaOptions.length > 0) {
      return jasaOptions.find((j) => j.id === rabData.detail_rab.jasa_id) || null;
    }
    return null;
  }, [isEditMode, rabData, jasaOptions]);

  const computedSelectedPPN = useMemo(() => {
    if (isEditMode && rabData?.detail_rab?.ppn && ppnOptions.length > 0) {
      return ppnOptions.find((p) => Math.abs(parseFloat(p.jml) - rabData.detail_rab.ppn) < 0.001) || null;
    }
    return null;
  }, [isEditMode, rabData, ppnOptions]);

  const [userSelectedJasa, setUserSelectedJasa] = useState<JasaData | null>(null);
  const [userSelectedPPN, setUserSelectedPPN] = useState<PPNData | null>(null);

  const selectedJasa = userSelectedJasa || computedSelectedJasa;
  const selectedPPN = userSelectedPPN || computedSelectedPPN;

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setUserSelectedJasa(null);
        setUserSelectedPPN(null);
      }, 0);
    }
  }, [open]);

  const subtotal = useMemo(() => {
    return totalMaterial + totalOngkos;
  }, [totalMaterial, totalOngkos]);

  const totalJasa = useMemo(() => {
    if (!jasaChecked || !selectedJasa) return 0;
    const persen = parseFloat(selectedJasa.persen || '0');
    return (subtotal * persen) / 100;
  }, [jasaChecked, selectedJasa, subtotal]);

  const totalPPN = useMemo(() => {
    if (!ppnChecked || !selectedPPN) return 0;
    const persen = parseFloat(selectedPPN.jml || '0');
    return subtotal * persen;
  }, [ppnChecked, selectedPPN, subtotal]);

  const totalJasaPPN = useMemo(() => {
    return totalJasa + totalPPN;
  }, [totalJasa, totalPPN]);

  const pembulatanValue = useMemo(() => {
    if (!pembulatan || totalJasaPPN === 0) return 0;
    
    let roundedValue: number;
    if (pembulatan === 'RATUSAN') {
      roundedValue = Math.ceil(totalJasaPPN / 100) * 100;
    } else if (pembulatan === 'RIBUAN') {
      roundedValue = Math.ceil(totalJasaPPN / 1000) * 1000;
    } else {
      return 0;
    }
    
    return roundedValue - totalJasaPPN;
  }, [pembulatan, totalJasaPPN]);

  const totalSebelumBulat = useMemo(() => {
    return subtotal + totalJasa + totalPPN;
  }, [subtotal, totalJasa, totalPPN]);

  const totalRab = useMemo(() => {
    return subtotal + totalJasa + totalPPN + pembulatanValue;
  }, [subtotal, totalJasa, totalPPN, pembulatanValue]);

  const validationSchema = useMemo(() => {
    return Yup.object().shape({
      golongan_id: isPasangBaru
        ? Yup.number().nullable().required('Golongan harus dipilih')
        : Yup.number().nullable(),
      diameter_id: isPasangBaru
        ? Yup.number().nullable().required('Diameter harus dipilih')
        : Yup.number().nullable(),
    });
  }, [isPasangBaru]);

  const initialValues: RabFormValues = useMemo(() => {
    return {
      golongan_id: isPasangBaru && pelangganData?.golongan_id ? pelangganData.golongan_id : null,
      diameter_id: isPasangBaru && pelangganData?.diameter_id ? pelangganData.diameter_id : null,
    };
  }, [isPasangBaru, pelangganData]);


  const {
    data: paketOngkosResponse,
  } = useSWR(
    open && paketItemsOngkos.length > 0 ? 'combo-paket-ongkos-full' : null,
    () => API.getRab.getComboPaketOngkos(),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  const paketOngkosFullData = paketOngkosResponse?.success && paketOngkosResponse?.data
    ? paketOngkosResponse.data
    : [];

  const handleSubmit = async (values: RabFormValues): Promise<void> => {
    if (!pelangganData) {
      toast.error('Data pelanggan tidak ditemukan');
      return;
    }

    const tanggalRab = isEditMode && rabData?.detail_rab 
      ? rabData.detail_rab.tanggal_rab 
      : getTanggalRab();
    const jenisRab = isEditMode && rabData?.detail_rab
      ? rabData.detail_rab.jenis_rab
      : getJenisRab(isPasangBaru);
    const noRab = isEditMode && rabData?.detail_rab
      ? rabData.detail_rab.no_rab
      : generateNoRab();

    const tipePembulatan = pembulatan.toLowerCase() === 'ratusan' ? 'ratusan' : pembulatan.toLowerCase() === 'ribuan' ? 'ribuan' : '';

    const payload: RabCreatePayload = {
      tanggal_rab: tanggalRab,
      jenis_rab: jenisRab,
      no_rab: noRab,
      no_pelanggan: pelangganData.no_pelanggan || '',
      nama_pelanggan: pelangganData.nama || '',
      alamat: pelangganData.alamat || '',
      wilayah_id: pelangganData.wilayah_id || 0,
      golongan_id: isPasangBaru ? (selectedGolongan?.id || values.golongan_id || null) : null,
      diameter_id: isPasangBaru ? (selectedDiameter?.id || values.diameter_id || null) : null,
      rayon_id: pelangganData.rayon_id || 0,
      pendaftaranpel_id: isPasangBaru ? (pendaftaranId || null) : null,
      pendaftaranlain_id: !isPasangBaru ? (pendaftaranId || null) : null,
      jasa_id: jasaChecked && selectedJasa ? selectedJasa.id : null,
      ppn: ppnChecked && selectedPPN ? parseFloat(selectedPPN.jml || '0') : 0,
      diskon: parseRupiahInput(diskon) || 0,
      flag_ambil_gudang: 0,
      tipe_pembulatan: tipePembulatan,
      total_sebelum_bulat: totalSebelumBulat,
      material: {
        paket: buildMaterialPaket(paketItems),
        tambahan: buildMaterialTambahan(cartItems),
      },
      ongkos: {
        paket: buildOngkosPaket(paketItemsOngkos, paketOngkosFullData),
        tambahan: buildOngkosTambahan(cartItemsOngkos),
      },
    };

    const apiPromise = isEditMode && rabId
      ? API.getRab.update(rabId, payload).then((response) => {
          if (!response.success) {
            throw new Error(response.message || 'Gagal mengupdate RAB');
          }
          return response;
        })
      : API.getRab.create(payload).then((response) => {
          if (!response.success) {
            throw new Error(response.message || 'Gagal menyimpan RAB');
          }
          return response;
        });

    toast.promise(
      apiPromise,
      {
        loading: isEditMode ? 'Mengupdate RAB...' : 'Menyimpan RAB...',
        success: (response) => {
          mutate('rab-list');
          setTimeout(() => {
            router.push('/menu-rab');
          }, 1000);
          return response.message || (isEditMode ? 'RAB berhasil diupdate' : 'RAB berhasil disimpan');
        },
        error: (error: Error) => error.message || (isEditMode ? 'Gagal mengupdate RAB' : 'Gagal menyimpan RAB'),
      }
    );
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: '90%', md: '400px' },
          maxWidth: { xs: '100%', sm: '500px', md: '400px' },
          height: '100%',
          backgroundColor: theme.palette.background.paper,
        },
      }}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {(formik) => (
          <Form>
            <Box
              sx={{
                width: '100%',
                p: { xs: 2, sm: 2.5, md: 3 },
                backgroundColor: theme.palette.background.paper,
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: 1.5, sm: 2 },
                height: '100%',
                overflowY: 'auto',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: { xs: 1.5, sm: 2 },
                  color: theme.palette.text.primary,
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                }}
              >
                Perhitungan
              </Typography>

              {/* Golongan dan Diameter - hanya tampil jika isPasangBaru = true */}
              {isPasangBaru && (
                <>
                  {/* Golongan */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: theme.palette.text.secondary }}>
                      Pilih Golongan
                    </Typography>
                    <Autocomplete
                      options={golonganOptions}
                      getOptionLabel={(option) => `${option.kode_golongan} - ${option.nama}`}
                      value={selectedGolongan}
                      onChange={(event, newValue) => {
                        setSelectedGolongan(newValue);
                        formik.setFieldValue('golongan_id', newValue?.id || null);
                      }}
                      loading={isLoadingGolongan}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          size="small"
                          placeholder="Pilih Golongan"
                          error={formik.touched.golongan_id && !!formik.errors.golongan_id}
                          helperText={formik.touched.golongan_id ? formik.errors.golongan_id : ''}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {isLoadingGolongan ? <CircularProgress color="inherit" size={20} /> : null}
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
                  </Box>

                  {/* Diameter */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: theme.palette.text.secondary }}>
                      Pilih Diameter
                    </Typography>
                    <Autocomplete
                      options={diameterOptions}
                      getOptionLabel={(option) => option.nama || ''}
                      value={selectedDiameter}
                      onChange={(event, newValue) => {
                        setSelectedDiameter(newValue);
                        formik.setFieldValue('diameter_id', newValue?.id || null);
                      }}
                      loading={isLoadingDiameter}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          size="small"
                          placeholder="Pilih Diameter"
                          error={formik.touched.diameter_id && !!formik.errors.diameter_id}
                          helperText={formik.touched.diameter_id ? formik.errors.diameter_id : ''}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {isLoadingDiameter ? <CircularProgress color="inherit" size={20} /> : null}
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
                  </Box>
                </>
              )}

              {/* TOTAL Material - hanya tampil jika totalMaterial > 0 */}
              {totalMaterial > 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: theme.palette.text.secondary }}>
                    TOTAL Material
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={totalMaterial.toLocaleString('id-ID')}
                    InputProps={{
                      readOnly: true,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: isDarkMode ? '#2A2A2A' : '#f5f5f5',
                        color: theme.palette.text.primary,
                      },
                    }}
                  />
                </Box>
              )}

              {/* TOTAL Ongkos - hanya tampil jika totalOngkos > 0 */}
              {totalOngkos > 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: theme.palette.text.secondary }}>
                    TOTAL Ongkos
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={totalOngkos.toLocaleString('id-ID')}
                    InputProps={{
                      readOnly: true,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: isDarkMode ? '#2A2A2A' : '#f5f5f5',
                        color: theme.palette.text.primary,
                      },
                    }}
                  />
                </Box>
              )}

              {/* Diskons */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: theme.palette.text.secondary }}>
                  Diskons (TARIF)
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={diskon}
                  onChange={(e) => handleRupiahInputChange(e, setDiskon)}
                  placeholder="0"
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
              </Box>

              <Divider sx={{ borderColor: theme.palette.divider }} />

              {/* Sub TOTAL */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: theme.palette.text.secondary }}>
                  Sub TOTAL
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={subtotal.toLocaleString('id-ID')}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: isDarkMode ? '#2A2A2A' : '#f5f5f5',
                      color: theme.palette.text.primary,
                    },
                  }}
                />
              </Box>

              {/* Biaya JASA */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={jasaChecked}
                      onChange={(e) => {
                        setJasaChecked(e.target.checked);
                        if (!e.target.checked) {
                          setUserSelectedJasa(null);
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
                    <Typography variant="body2" sx={{ fontWeight: 500, color: theme.palette.text.secondary }}>
                      Biaya JASA
                    </Typography>
                  }
                />
                <Box sx={{ display: 'flex', gap: { xs: 0.5, sm: 1 }, alignItems: 'flex-start', flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                  <Autocomplete
                    options={jasaOptions}
                    getOptionLabel={(option) => {
                      const persen = parseFloat(option.persen || '0');
                      return `${option.namajasa || ''} (${persen}%)`;
                    }}
                    value={selectedJasa}
                    onChange={(event, newValue) => setUserSelectedJasa(newValue)}
                    disabled={!jasaChecked}
                    loading={isLoadingJasa}
                    sx={{ flex: 1, minWidth: { xs: '100%', sm: 'auto' } }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        size="small"
                        placeholder="Pilih Jasa"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {isLoadingJasa ? <CircularProgress color="inherit" size={20} /> : null}
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
                  {jasaChecked && selectedJasa && (
                    <TextField
                      size="small"
                      value={totalJasa.toLocaleString('id-ID')}
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{
                        width: { xs: '100px', sm: '120px' },
                        minWidth: { xs: '80px', sm: '100px' },
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: isDarkMode ? '#2A2A2A' : '#f5f5f5',
                          color: theme.palette.text.primary,
                        },
                      }}
                    />
                  )}
                </Box>
              </Box>

              {/* PPN */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={ppnChecked}
                      onChange={(e) => {
                        setPpnChecked(e.target.checked);
                        if (!e.target.checked) {
                          setUserSelectedPPN(null);
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
                    <Typography variant="body2" sx={{ fontWeight: 500, color: theme.palette.text.secondary }}>
                      PPN
                    </Typography>
                  }
                />
                <Box sx={{ display: 'flex', gap: { xs: 0.5, sm: 1 }, alignItems: 'flex-start', flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                  <Autocomplete
                    options={ppnOptions}
                    getOptionLabel={(option) => {
                      const jml = parseFloat(option.jml || '0');
                      return `${(jml * 100).toFixed(0)}%`;
                    }}
                    value={selectedPPN}
                    onChange={(event, newValue) => setUserSelectedPPN(newValue)}
                    disabled={!ppnChecked}
                    loading={isLoadingPPN}
                    sx={{ flex: 1, minWidth: { xs: '100%', sm: 'auto' } }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        size="small"
                        placeholder="Pilih PPN"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {isLoadingPPN ? <CircularProgress color="inherit" size={20} /> : null}
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
                  {ppnChecked && selectedPPN && (
                    <TextField
                      size="small"
                      value={totalPPN.toLocaleString('id-ID')}
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{
                        width: { xs: '100px', sm: '120px' },
                        minWidth: { xs: '80px', sm: '100px' },
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: isDarkMode ? '#2A2A2A' : '#f5f5f5',
                          color: theme.palette.text.primary,
                        },
                      }}
                    />
                  )}
                </Box>
              </Box>

              {/* Pembulatan */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: theme.palette.text.secondary }}>
                  Pembulatan
                </Typography>
                <Box sx={{ display: 'flex', gap: { xs: 0.5, sm: 1 }, alignItems: 'flex-start', flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                  <FormControl fullWidth size="small" sx={{ flex: 1, minWidth: { xs: '100%', sm: 'auto' } }}>
                    <Select
                      value={pembulatan}
                      onChange={(e) => setPembulatan(e.target.value)}
                      displayEmpty
                      sx={{
                        color: theme.palette.text.primary,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: theme.palette.divider,
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#FF8C00',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#FF8C00',
                        },
                      }}
                      renderValue={(selected) => {
                        if (!selected) {
                          return <span style={{ color: theme.palette.text.disabled }}>Pilih Pembulatan</span>;
                        }
                        return <span style={{ color: theme.palette.text.primary }}>{selected}</span>;
                      }}
                    >
                      <MenuItem value="" disabled>
                        Pilih Pembulatan
                      </MenuItem>
                      <MenuItem value="RATUSAN">RATUSAN</MenuItem>
                      <MenuItem value="RIBUAN">RIBUAN</MenuItem>
                    </Select>
                  </FormControl>
                  {pembulatan && totalJasaPPN > 0 && (
                    <TextField
                      size="small"
                      value={pembulatanValue.toLocaleString('id-ID')}
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{
                        width: { xs: '100px', sm: '120px' },
                        minWidth: { xs: '80px', sm: '100px' },
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: isDarkMode ? '#2A2A2A' : '#f5f5f5',
                          color: theme.palette.text.primary,
                        },
                      }}
                    />
                  )}
                </Box>
              </Box>

              {/* TOTAL RAB - hanya tampil jika pembulatan sudah dipilih */}
              {pembulatan && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                    TOTAL RAB
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={totalRab.toLocaleString('id-ID')}
                    InputProps={{
                      readOnly: true,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: isDarkMode ? '#2A2A2A' : '#FFF8E1',
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                      },
                    }}
                  />
                </Box>
              )}

              {/* Button Simpan */}
              <Box sx={{ mt: 'auto', pt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={formik.isSubmitting || !pembulatan}
                  sx={{
                    textTransform: 'none',
                    backgroundColor: '#FF8C00',
                    '&:hover': {
                      backgroundColor: '#FF7F00',
                    },
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                >
                  {formik.isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </Button>
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
    </Drawer>
  );
}

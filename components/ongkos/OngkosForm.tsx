'use client';

import React from 'react';
import { Box, TextField, Button, Autocomplete, CircularProgress } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { handleRupiahInputChange, parseRupiahInput } from '@/config/global';
import type { SatuanOngkos } from '@/types/ongkos';

export interface OngkosFormValues {
  kode: string;
  nama: string;
  satuanId: number | null;
  harga: string;
}

interface OngkosFormProps {
  initialValues: OngkosFormValues;
  onSubmit: (values: OngkosFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  satuanOptions: SatuanOngkos[];
  isLoadingSatuan: boolean;
}

const validationSchema = Yup.object().shape({
  kode: Yup.string().trim().required('Kode harus diisi'),
  nama: Yup.string().trim().required('Nama harus diisi'),
  satuanId: Yup.number().nullable().required('Satuan harus dipilih').typeError('Satuan harus dipilih'),
  harga: Yup.string()
    .required('Harga harus diisi')
    .test('is-valid-price', 'Harga harus berupa angka yang valid', (value) => {
      if (!value) return false;
      const hargaNum = parseRupiahInput(value);
      return !isNaN(hargaNum) && hargaNum > 0;
    }),
});

export default function OngkosForm({
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting,
  satuanOptions,
  isLoadingSatuan,
}: OngkosFormProps): React.ReactElement {
  const handleSubmit = async (values: OngkosFormValues): Promise<void> => {
    await onSubmit(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, errors, touched, setFieldValue, handleChange, handleBlur }) => {
        const selectedSatuan = satuanOptions.find((s) => s.id === values.satuanId) || null;

        return (
          <Form>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                name="kode"
                label="Kode"
                value={values.kode}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.kode && !!errors.kode}
                helperText={touched.kode && errors.kode}
                fullWidth
                required
              />

              <TextField
                name="nama"
                label="Nama"
                value={values.nama}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.nama && !!errors.nama}
                helperText={touched.nama && errors.nama}
                fullWidth
                required
              />

              <Autocomplete
                options={satuanOptions}
                getOptionLabel={(option) => `${option.kode} - ${option.rumus}`}
                value={selectedSatuan}
                onChange={(_, newValue) => {
                  setFieldValue('satuanId', newValue?.id || null, true);
                }}
                onBlur={() => setFieldValue('satuanId', values.satuanId, true)}
                loading={isLoadingSatuan}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="satuanId"
                    label="Satuan Ongkos"
                    error={touched.satuanId && !!errors.satuanId}
                    helperText={touched.satuanId && errors.satuanId}
                    required
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isLoadingSatuan ? <CircularProgress size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />

              <TextField
                name="harga"
                label="Harga"
                value={values.harga}
                onChange={(e) => {
                  handleRupiahInputChange(e, (value) => setFieldValue('harga', value, false));
                }}
                onBlur={handleBlur}
                error={touched.harga && !!errors.harga}
                helperText={touched.harga && errors.harga}
                fullWidth
                required
                placeholder="0"
                InputProps={{
                  startAdornment: <Box sx={{ mr: 1, color: 'text.secondary', fontWeight: 500 }}>Rp</Box>,
                }}
              />

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={onCancel}
                  disabled={isSubmitting}
                  sx={{ textTransform: 'none' }}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{
                    backgroundColor: '#FF8C00',
                    '&:hover': {
                      backgroundColor: '#FF7F00',
                    },
                    textTransform: 'none',
                  }}
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </Button>
              </Box>
            </Box>
          </Form>
        );
      }}
    </Formik>
  );
}

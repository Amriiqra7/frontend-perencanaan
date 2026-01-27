'use client';

import React, { useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  useTheme,
} from '@mui/material';
import { CloseCircle } from 'iconsax-reactjs';
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import type { RabDetailData, MaterialDetail, OngkosDetail } from '@/types/rab';
import { formatRupiahInput } from '@/config/global';

interface RabDetailDialogProps {
  open: boolean;
  onClose: () => void;
  rabId: number | null;
  rabData: RabDetailData | null;
  isLoading: boolean;
}

export default function RabDetailDialog({
  open,
  onClose,
  rabId,
  rabData,
  isLoading,
}: RabDetailDialogProps): React.ReactElement {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const materialColumns = useMemo<MRT_ColumnDef<MaterialDetail>[]>(
    () => [
      {
        accessorKey: 'nama_barang',
        header: 'Nama Barang',
        size: 200,
      },
      {
        accessorKey: 'kode_barang',
        header: 'Kode Barang',
        size: 120,
      },
      {
        accessorKey: 'qty',
        header: 'Qty',
        size: 80,
        Cell: ({ row }) => row.original.qty.toLocaleString('id-ID'),
      },
      {
        accessorKey: 'satuan',
        header: 'Satuan',
        size: 100,
      },
      {
        accessorKey: 'harga',
        header: 'Harga',
        size: 150,
        Cell: ({ row }) => {
          const harga = row.original.is_paket === 1 ? row.original.harga_paket : row.original.harga;
          return formatRupiahInput(harga);
        },
      },
      {
        accessorKey: 'total',
        header: 'Total',
        size: 150,
        Cell: ({ row }) => {
          const harga = row.original.is_paket === 1 ? row.original.harga_paket : row.original.harga;
          const total = harga * row.original.qty;
          return formatRupiahInput(total);
        },
      },
    ],
    []
  );

  const ongkosColumns = useMemo<MRT_ColumnDef<OngkosDetail>[]>(
    () => [
      {
        accessorKey: 'nama_ongkos',
        header: 'Nama Ongkos',
        size: 200,
      },
      {
        accessorKey: 'panjang',
        header: 'Panjang',
        size: 100,
        Cell: ({ row }) => row.original.panjang.toLocaleString('id-ID'),
      },
      {
        accessorKey: 'lebar',
        header: 'Lebar',
        size: 100,
        Cell: ({ row }) => row.original.lebar.toLocaleString('id-ID'),
      },
      {
        accessorKey: 'tinggi',
        header: 'Tinggi',
        size: 100,
        Cell: ({ row }) => row.original.tinggi.toLocaleString('id-ID'),
      },
      {
        accessorKey: 'volume',
        header: 'Volume',
        size: 100,
        Cell: ({ row }) => row.original.volume.toLocaleString('id-ID'),
      },
      {
        accessorKey: 'satuan_kode',
        header: 'Satuan',
        size: 100,
      },
      {
        accessorKey: 'harga',
        header: 'Harga',
        size: 150,
        Cell: ({ row }) => {
          const harga = row.original.is_paket === 1 ? row.original.harga_paket : row.original.harga;
          return formatRupiahInput(harga);
        },
      },
    ],
    []
  );

  const materialTable = useMaterialReactTable({
    columns: materialColumns,
    data: rabData?.material || [],
    enableColumnResizing: false,
    enableColumnOrdering: false,
    enableStickyHeader: true,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableHiding: false,
    enablePagination: false,
    enableBottomToolbar: false,
    enableTopToolbar: false,
    enableSorting: false,
    enableColumnActions: false,
    enableColumnFilters: false,
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: isDarkMode ? '#2A2A2A' : '#FFF8E1',
        fontWeight: 600,
        fontSize: '0.875rem',
        color: theme.palette.text.primary,
      },
    },
    muiTableBodyCellProps: {
      sx: {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
      },
    },
  });

  const ongkosTable = useMaterialReactTable({
    columns: ongkosColumns,
    data: rabData?.ongkos || [],
    enableColumnResizing: false,
    enableColumnOrdering: false,
    enableStickyHeader: true,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableHiding: false,
    enablePagination: false,
    enableBottomToolbar: false,
    enableTopToolbar: false,
    enableSorting: false,
    enableColumnActions: false,
    enableColumnFilters: false,
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: isDarkMode ? '#2A2A2A' : '#FFF8E1',
        fontWeight: 600,
        fontSize: '0.875rem',
        color: theme.palette.text.primary,
      },
    },
    muiTableBodyCellProps: {
      sx: {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
      },
    },
  });

  if (!rabData) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>Detail RAB</Typography>
            <IconButton onClick={onClose} size="small">
              <CloseCircle size={24} color={isDarkMode ? '#b0b0b0' : '#666'} />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <Typography>Loading...</Typography>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  const detail = rabData.detail_rab;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>Detail RAB - {detail.no_rab}</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseCircle size={24} color={isDarkMode ? '#b0b0b0' : '#666'} />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Informasi RAB */}
          <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: theme.palette.text.primary }}>
              Informasi RAB
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 0.5 }}>
                  No. RAB
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
                  {detail.no_rab}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 0.5 }}>
                  Tanggal RAB
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
                  {detail.tanggal_rab}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 0.5 }}>
                  Jenis RAB
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
                  {detail.jenis_rab}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 0.5 }}>
                  User
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
                  {detail.nama_user}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider />

          {/* Informasi Pelanggan */}
          <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: theme.palette.text.primary }}>
              Informasi Pelanggan
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 0.5 }}>
                  No. Pelanggan
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
                  {detail.no_pelanggan}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 0.5 }}>
                  Nama Pelanggan
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
                  {detail.nama_pelanggan}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 0.5 }}>
                  Alamat
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
                  {detail.alamat}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 0.5 }}>
                  Wilayah
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
                  {detail.wilayah}
                </Typography>
              </Box>
              {detail.rayon && (
                <Box>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 0.5 }}>
                    Rayon
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
                    {detail.rayon}
                  </Typography>
                </Box>
              )}
              <Box>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 0.5 }}>
                  Golongan
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
                  {detail.golongan} ({detail.kode_golongan})
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 0.5 }}>
                  Diameter
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
                  {detail.diameter}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider />

          {/* Material */}
          {rabData.material && rabData.material.length > 0 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: theme.palette.text.primary }}>
                Material
              </Typography>
              <MaterialReactTable table={materialTable} />
            </Box>
          )}

          {/* Ongkos */}
          {rabData.ongkos && rabData.ongkos.length > 0 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: theme.palette.text.primary }}>
                Ongkos
              </Typography>
              <MaterialReactTable table={ongkosTable} />
            </Box>
          )}

          <Divider />

          {/* Ringkasan */}
          <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: theme.palette.text.primary }}>
              Ringkasan
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 0.5 }}>
                  Total Material
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
                  {formatRupiahInput(detail.total_material)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 0.5 }}>
                  Total Ongkos
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
                  {formatRupiahInput(detail.total_ongkos)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 0.5 }}>
                  Diskon
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
                  {formatRupiahInput(detail.diskon)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 0.5 }}>
                  Jasa ({detail.persen_jasa}%)
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
                  {formatRupiahInput((detail.total_material + detail.total_ongkos - detail.diskon) * (detail.persen_jasa / 100))}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 0.5 }}>
                  PPN ({detail.ppn * 100}%)
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
                  {formatRupiahInput((detail.total_material + detail.total_ongkos - detail.diskon) * detail.ppn)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 0.5 }}>
                  Pembulatan
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
                  {formatRupiahInput(detail.pembulatan)}
                </Typography>
              </Box>
              <Box sx={{ gridColumn: 'span 2' }}>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 0.5 }}>
                  Total RAB
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#FF8C00' }}>
                  {formatRupiahInput(detail.total_rab)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Tutup
        </Button>
      </DialogActions>
    </Dialog>
  );
}

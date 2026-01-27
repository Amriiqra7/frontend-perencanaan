'use client';

import React, { useState, useMemo } from 'react';
import { Box, Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
import { Add } from 'iconsax-reactjs';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import OngkosTable from '@/components/ongkos/OngkosTable';
import OngkosDetailDialog from '@/components/ongkos/OngkosDetailDialog';
import { getOngkos } from '@/core/services/api';
import toast from 'react-hot-toast';
import type { OngkosData, OngkosResponse } from '@/types/ongkos';

export default function OngkosList(): React.ReactElement {
  const router = useRouter();
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [selectedOngkos, setSelectedOngkos] = useState<OngkosData | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [ongkosToDelete, setOngkosToDelete] = useState<OngkosData | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const queryParams = useMemo(() => ({
    page,
    limit,
  }), [page, limit]);

  const {
    data: response,
    error,
    isValidating,
    mutate,
  } = useSWR<OngkosResponse>(
    ['ongkos', queryParams],
    () => getOngkos.getAll(queryParams),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      onError: (error) => {
        console.error('[OngkosList] Failed to load Ongkos data!', error);
      },
      onSuccess: (data) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('[OngkosList] Ongkos data loaded successfully:', data);
        }
      },
    }
  );

  const data = useMemo(() => {
    if (response && response.success && response.data && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  }, [response]);

  const pagination = useMemo(() => {
    return response?.pagination || null;
  }, [response]);

  const isLoading = isValidating;

  const handleAdd = (): void => {
    router.push('/ongkos/new');
  };

  const handleEdit = (row: OngkosData): void => {
    router.push(`/ongkos/edit/${row.id}`);
  };

  const handleDelete = (row: OngkosData): void => {
    setOngkosToDelete(row);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async (): Promise<void> => {
    if (!ongkosToDelete) return;

    setIsDeleting(true);

    const deletePromise = getOngkos.delete(ongkosToDelete.id).then((response) => {
      if (!response.success) {
        throw new Error(response.message || 'Gagal menghapus ongkos');
      }
      return response;
    });

    toast.promise(
      deletePromise.then(async (response) => {
        setIsDeleting(false);
        await mutate();
        setDeleteDialogOpen(false);
        setOngkosToDelete(null);
        return response;
      }),
      {
        loading: 'Menghapus ongkos...',
        success: (response) => {
          return response.message || 'Ongkos berhasil dihapus';
        },
        error: (error) => {
          setIsDeleting(false);
          console.error('[OngkosList] Failed to delete Ongkos:', error);
          return error instanceof Error ? error.message : 'Gagal menghapus ongkos';
        },
      }
    );
  };

  const handleDetail = (row: OngkosData): void => {
    setSelectedOngkos(row);
    setDetailDialogOpen(true);
  };

  const handleDetailClose = (): void => {
    setDetailDialogOpen(false);
    setSelectedOngkos(null);
  };

  return (
    <Box sx={{ width: '100%', p: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Data Ongkos
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add size={20} />}
          onClick={handleAdd}
          sx={{
            backgroundColor: '#FF8C00',
            '&:hover': {
              backgroundColor: '#FF7F00',
            },
            textTransform: 'none',
          }}
        >
          Tambah
        </Button>
      </Box>

      <Box sx={{ position: 'relative', width: '100%' }}>
        {isLoading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              zIndex: 1000,
            }}
          >
            <CircularProgress />
          </Box>
        )}
        <OngkosTable
          data={data}
          pagination={pagination}
          onPageChange={setPage}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDetail={handleDetail}
        />
      </Box>

      <OngkosDetailDialog
        open={detailDialogOpen}
        onClose={handleDetailClose}
        ongkos={selectedOngkos}
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={() => !isDeleting && setDeleteDialogOpen(false)}
      >
        <DialogTitle>Konfirmasi Hapus</DialogTitle>
        <DialogContent>
          <Typography>
            Apakah Anda yakin ingin menghapus ongkos <strong>{ongkosToDelete?.nama_ongkos}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={isDeleting}
            sx={{ textTransform: 'none' }}
          >
            Batal
          </Button>
          <Button
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            color="error"
            variant="contained"
            sx={{ textTransform: 'none' }}
          >
            {isDeleting ? 'Menghapus...' : 'Hapus'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Popover,
  MenuList,
  MenuItem,
  ListItemText,
  useTheme,
} from '@mui/material';
import { Filter, ExportSquare, Add } from 'iconsax-reactjs';
import ModalTambah from './ModalTambah';
import type { RabType } from '@/types/rab';

interface RabHeaderProps {
  rabType: RabType;
  onRabTypeChange: (type: RabType) => void;
  onFilterToggle?: () => void;
  filterOpen?: boolean;
  onExport?: () => void;
}

export default function RabHeader({
  rabType,
  onRabTypeChange,
  onFilterToggle,
  filterOpen = true,
  onExport,
}: RabHeaderProps): React.ReactElement {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [addPopoverAnchor, setAddPopoverAnchor] = useState<HTMLElement | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedRabType, setSelectedRabType] = useState<RabType>('pelanggan');

  const handleAddClick = (event: React.MouseEvent<HTMLElement>): void => {
    setAddPopoverAnchor(event.currentTarget);
  };

  const handleAddClose = (): void => {
    setAddPopoverAnchor(null);
  };

  const handleRabTypeSelect = (type: RabType): void => {
    setSelectedRabType(type);
    setAddPopoverAnchor(null);
    setDialogOpen(true);
  };

  const handleDialogClose = (): void => {
    setDialogOpen(false);
  };

  const handleExportClick = (): void => {
    if (onExport) {
      onExport();
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 1,
        pb: 1,
        pt: 2,
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
        Menu RAB
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ExportSquare size={18} />}
          onClick={handleExportClick}
          sx={{
            textTransform: 'none',
            borderColor: '#FF8C00',
            color: '#FF8C00',
            '&:hover': {
              borderColor: '#FF8C00',
              backgroundColor: isDarkMode ? 'rgba(255, 140, 0, 0.2)' : '#FFF3E0',
            },
          }}
        >
          Export
        </Button>

        <Button
          variant="contained"
          startIcon={<Add size={18} />}
          onClick={handleAddClick}
          sx={{
            textTransform: 'none',
            backgroundColor: '#FF8C00',
            '&:hover': {
              backgroundColor: '#FF7F00',
            },
          }}
        >
          Tambah
        </Button>

        {onFilterToggle && (
          <Tooltip title={filterOpen ? 'Tutup Filter' : 'Buka Filter'}>
            <IconButton
              onClick={onFilterToggle}
              sx={{
                backgroundColor: filterOpen ? '#FF8C00' : 'transparent',
                color: filterOpen ? '#fff' : (isDarkMode ? '#b0b0b0' : '#666'),
                '&:hover': {
                  backgroundColor: filterOpen ? '#FF7F00' : (isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#FFF8E1'),
                },
              }}
            >
              <Filter size={20} />
            </IconButton>
          </Tooltip>
        )}

        <Popover
          open={Boolean(addPopoverAnchor)}
          anchorEl={addPopoverAnchor}
          onClose={handleAddClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <MenuList>
            <MenuItem onClick={() => handleRabTypeSelect('pelanggan')}>
              <ListItemText>RAB Pelanggan</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleRabTypeSelect('non-pelanggan')}>
              <ListItemText>RAB non pelanggan</ListItemText>
            </MenuItem>
          </MenuList>
        </Popover>

        <ModalTambah
          open={dialogOpen}
          onClose={handleDialogClose}
          rabType={selectedRabType}
        />
      </Box>
    </Box>
  );
}

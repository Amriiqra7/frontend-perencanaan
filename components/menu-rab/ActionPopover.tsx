'use client';

import React, { useState } from 'react';
import { IconButton, Popover, MenuList, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { More, Eye, Edit, Trash } from 'iconsax-reactjs';

interface ActionPopoverProps {
  rowIndex: number;
  onEdit?: (rowIndex: number) => void;
  onDelete?: (rowIndex: number) => void;
  onDetail?: (rowIndex: number) => void;
}

export default function ActionPopover({
  rowIndex,
  onEdit,
  onDelete,
  onDetail,
}: ActionPopoverProps): React.ReactElement {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const handleEdit = (): void => {
    if (onEdit) {
      onEdit(rowIndex);
    }
    handleClose();
  };

  const handleDelete = (): void => {
    if (onDelete) {
      onDelete(rowIndex);
    }
    handleClose();
  };

  const handleDetail = (): void => {
    if (onDetail) {
      onDetail(rowIndex);
    }
  };

  const open = Boolean(anchorEl);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
      <IconButton
        size="small"
        onClick={handleClick}
        sx={{
          padding: '4px',
          '&:hover': {
            backgroundColor: '#FFF8E1',
          },
        }}
      >
        <More size={18} color="#666" />
      </IconButton>

      <IconButton
        size="small"
        onClick={handleDetail}
        sx={{
          padding: '4px',
          '&:hover': {
            backgroundColor: '#FFF8E1',
          },
        }}
      >
        <Eye size={18} color="#666" />
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuList>
          <MenuItem onClick={handleEdit}>
            <ListItemIcon>
              <Edit size={18} color="#FF8C00" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleDelete}>
            <ListItemIcon>
              <Trash size={18} color="#f44336" />
            </ListItemIcon>
            <ListItemText>Hapus</ListItemText>
          </MenuItem>
        </MenuList>
      </Popover>
    </div>
  );
}

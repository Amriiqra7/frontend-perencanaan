
'use client';

import React, { useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
} from '@mui/material';
import { getIconComponent } from '@/lib/iconMapper';
import type { MenuGroup, MenuDetail } from '@/types/settings';

interface DrawerContentProps {
  menuData: MenuGroup[];
  open: boolean;
}

interface MenuItemProps {
  menu: MenuDetail;
  open: boolean;
  pathname: string;
  onNavigate: (path: string) => void;
}

function MenuItem({ menu, open, pathname, onNavigate }: MenuItemProps): React.ReactElement {
  const isActive = pathname === menu.link;

  return (
    <ListItem disablePadding sx={{ display: 'block' }}>
      <ListItemButton
        selected={isActive}
        onClick={() => onNavigate(menu.link)}
        sx={{
          minHeight: 48,
          justifyContent: open ? 'initial' : 'center',
          px: 2.5,
          '&.Mui-selected': {
            backgroundColor: '#FFF3E0',
            color: '#FF8C00',
            '&:hover': {
              backgroundColor: '#FFE0B2',
            },
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: open ? 3 : 'auto',
            justifyContent: 'center',
            color: isActive ? '#FF8C00' : 'inherit',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {getIconComponent(menu.icon, 22, isActive ? '#FF8C00' : undefined) || (
            <Box sx={{ width: 22, height: 22, borderRadius: '4px', bgcolor: 'grey.300' }} />
          )}
        </ListItemIcon>
        <ListItemText
          primary={menu.menu_name}
          primaryTypographyProps={{
            fontSize: '0.875rem',
            fontWeight: isActive ? 600 : 400,
          }}
          sx={{ opacity: open ? 1 : 0 }}
        />
      </ListItemButton>
    </ListItem>
  );
}

interface MenuGroupItemProps {
  group: MenuGroup;
  open: boolean;
  pathname: string;
  onNavigate: (path: string) => void;
}

function MenuGroupItem({ group, open, pathname, onNavigate }: MenuGroupItemProps): React.ReactElement | null {
  if (!group.menus || group.menus.length === 0) {
    return null;
  }

  const groupKey = group.group_name || group.group_link || `group-${Math.random()}`;

  return (
    <React.Fragment key={groupKey}>
      {open && group.group_name && (
        <Box sx={{ px: 2, py: 1 }}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              color: 'text.secondary',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {group.group_name}
          </Typography>
        </Box>
      )}
      <List component="div" disablePadding>
        {group.menus.map((menuItem) => (
          <MenuItem
            key={menuItem.menu_id}
            menu={menuItem}
            open={open}
            pathname={pathname}
            onNavigate={onNavigate}
          />
        ))}
      </List>
      <Divider sx={{ my: 1 }} />
    </React.Fragment>
  );
}

export default function DrawerContent({ menuData, open }: DrawerContentProps): React.ReactElement {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigate = (path: string): void => {
    if (path) {
      router.push(path);
    }
  };

  const menuItems = useMemo(() => {
    return menuData.map((group, index) => {
      const groupKey = group.group_name || group.group_link || `group-${index}`;
      return (
        <MenuGroupItem
          key={groupKey}
          group={group}
          open={open}
          pathname={pathname}
          onNavigate={handleNavigate}
        />
      );
    });
  }, [menuData, open, pathname, handleNavigate]);

  return (
    <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
      <List>{menuItems}</List>
    </Box>
  );
}

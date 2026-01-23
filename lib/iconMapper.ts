'use client';

import React from 'react';
import {
  User,
  Notification,
  InfoCircle,
  Setting2,
  Home,
  DocumentText,
  Folder,
  Chart,
  Profile,
  Message,
  Money,
  Calendar,
  Location,
  SearchNormal,
  Filter,
  Add,
  Edit,
  Trash,
  Import,
  Export,
  Printer,
  Save2,
  CloseCircle,
  TickCircle,
  Warning2,
  Danger,
  Lock,
  Unlock,
  Eye,
  EyeSlash,
  ArrowRight,
  ArrowLeft,
  Menu,
  More,
  Grid1,
  Category,
  Shop,
  Wallet,
  Receipt,
  Bill,
  Card,
  Bank,
  MoneyRecive,
  MoneySend,
  Chart2,
  Chart21,
  Chart1,
  TrendUp,
  TrendDown,
  Activity,
  Data,
  Folder2,
  Document,
  Archive,
  Image,
  Video,
  Camera,
  Send,
  Message2,
  Sms,
  NotificationBing,
  UserSquare,
  UserAdd,
  UserEdit,
  UserRemove,
  People,
  Profile2User,
  ProfileAdd,
  ProfileCircle,
  Security,
  Key,
  Verify,
} from 'iconsax-reactjs';

/**
 * Icon mapping from API icon names to Iconsax components
 */
const iconMap: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  // User icons
  'user': User,
  'users': User,
  'profile': Profile,
  'profile-circle': ProfileCircle,
  'user-square': UserSquare,
  'user-add': UserAdd,
  'user-edit': UserEdit,
  'user-remove': UserRemove,
  'people': People,
  'profile-2user': Profile2User,
  'profile-add': ProfileAdd,
  
  // Notification icons
  'bell': Notification,
  'notification': Notification,
  'notification-bing': NotificationBing,
  
  // Info icons
  'info': InfoCircle,
  'info-circle': InfoCircle,
  'information': InfoCircle,
  
  // Settings icons
  'setting': Setting2,
  'settings': Setting2,
  'setting-2': Setting2,
  'gear': Setting2,
  
  // Common icons
  'home': Home,
  'document': DocumentText,
  'document-text': DocumentText,
  'file': DocumentText,
  'file-text': DocumentText,
  'folder': Folder,
  'folder-2': Folder2,
  'chart': Chart,
  'chart-1': Chart1,
  'chart-2': Chart2,
  'chart-21': Chart21,
  'trend-up': TrendUp,
  'trend-down': TrendDown,
  'activity': Activity,
  'data': Data,
  'archive': Archive,
  
  // Money/Finance icons
  'money': Money,
  'money-recive': MoneyRecive,
  'money-send': MoneySend,
  'wallet': Wallet,
  'receipt': Receipt,
  'bill': Bill,
  'card': Card,
  'bank': Bank,
  
  // Action icons
  'add': Add,
  'edit': Edit,
  'trash': Trash,
  'delete': Trash,
  'save': Save2,
  'import': Import,
  'export': Export,
  'print': Printer,
  'printer': Printer,
  'search': SearchNormal,
  'filter': Filter,
  'close': CloseCircle,
  'tick': TickCircle,
  'check': TickCircle,
  'warning': Warning2,
  'danger': Danger,
  
  // Security icons
  'lock': Lock,
  'unlock': Unlock,
  'eye': Eye,
  'eye-slash': EyeSlash,
  'security': Security,
  'key': Key,
  'verify': Verify,
  
  // Navigation icons
  'arrow-right': ArrowRight,
  'arrow-left': ArrowLeft,
  'menu': Menu,
  'more': More,
  'grid': Grid1,
  'category': Category,
  
  // Communication icons
  'message': Message,
  'message-2': Message2,
  'sms': Sms,
  'send': Send,
  
  // Media icons
  'image': Image,
  'video': Video,
  'camera': Camera,
  
  // Calendar/Time icons
  'calendar': Calendar,
  
  // Shop icons
  'shop': Shop,
};

/**
 * Get icon component from icon name
 * @param iconName - Name of the icon from API (can be string name or HTML)
 * @param size - Size of the icon (default: 22)
 * @param color - Color of the icon (optional)
 * @returns React component or null
 */
export function getIconComponent(
  iconName: string | null | undefined,
  size: number = 22,
  color?: string
): React.ReactElement | null {
  if (!iconName) {
    return null;
  }

  // If it's HTML, try to extract icon name from it
  let iconString = iconName;
  if (iconName.includes('<')) {
    // Try to extract from class name, data attribute, or text content
    const classMatch = iconName.match(/class=["']([^"']*icon[^"']*)["']/i);
    const dataMatch = iconName.match(/data-icon=["']([^"']+)["']/i);
    const textMatch = iconName.match(/>([^<]+)</);
    
    iconString = classMatch?.[1] || dataMatch?.[1] || textMatch?.[1] || iconName;
    
    // Try to find common icon names in HTML
    if (iconName.includes('user') || iconName.includes('User')) iconString = 'user';
    else if (iconName.includes('bell') || iconName.includes('Bell') || iconName.includes('notification')) iconString = 'bell';
    else if (iconName.includes('info') || iconName.includes('Info')) iconString = 'info';
    else if (iconName.includes('setting') || iconName.includes('Setting')) iconString = 'setting';
    else if (iconName.includes('document') || iconName.includes('Document')) iconString = 'document';
    else if (iconName.includes('folder') || iconName.includes('Folder')) iconString = 'folder';
    else if (iconName.includes('chart') || iconName.includes('Chart')) iconString = 'chart';
    else if (iconName.includes('money') || iconName.includes('Money')) iconString = 'money';
    else if (iconName.includes('calendar') || iconName.includes('Calendar')) iconString = 'calendar';
    else if (iconName.includes('message') || iconName.includes('Message')) iconString = 'message';
  }

  // Normalize icon name (lowercase, remove spaces, dashes, special chars)
  const normalizedName = iconString
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  // Try exact match first
  let IconComponent = iconMap[normalizedName];

  // If not found, try partial match (check if normalized name contains any key)
  if (!IconComponent) {
    const keys = Object.keys(iconMap);
    const matchedKey = keys.find((key) => {
      const nameLower = normalizedName.toLowerCase();
      const keyLower = key.toLowerCase();
      return nameLower.includes(keyLower) || keyLower.includes(nameLower);
    });
    if (matchedKey) {
      IconComponent = iconMap[matchedKey];
    }
  }

  // Default to User icon if not found
  if (!IconComponent) {
    IconComponent = User;
  }

  // Render the icon component using React.createElement to avoid JSX parsing issues
  return React.createElement(IconComponent, { size, color });
}

import type { MenuGroup } from './settings';

export interface MenuResponse {
  data: MenuGroup[];
  message?: string;
  success?: boolean;
}

export interface MenuService {
  getAll: (params?: Record<string, unknown>) => Promise<MenuResponse>;
}

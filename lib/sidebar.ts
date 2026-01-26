"use client";

import { MenuGroup } from "@/types/settings";

const STORAGE_KEY = "settings_p";

export function setSidebar(sidebar: MenuGroup[]): void {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sidebar));
}

export function getSidebar(): MenuGroup[] | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as MenuGroup[];
  } catch {
    return null;
  }
}

export function deleteSidebar(): void {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.removeItem(STORAGE_KEY);
}

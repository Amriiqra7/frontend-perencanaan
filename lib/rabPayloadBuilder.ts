import type { PaketItem, CartItem } from '@/components/menu-rab/MaterialForm';
import type { PaketOngkosData } from '@/types/rab';

interface MaterialPaketPayload {
  id: number;
  nama_paket: string;
  harga_paket: number;
  qty: number;
  detail_barang: Array<{
    id: number;
    qty: number;
    satuan: string;
    harga: number;
    kode_barang: string;
    nama_barang: string;
  }>;
}

interface MaterialTambahanPayload {
  id: number;
  qty: number;
  satuan: string;
  harga: number;
  kode_barang: string;
  nama_barang: string;
}

interface OngkosPaketPayload {
  id: number;
  nama_paket: string;
  panjang: string;
  lebar: string;
  tinggi: string;
  volume: string;
  harga_paket: number;
  detail_ongkos: Array<{
    id: number;
    kode_ongkos: string;
    nama_ongkos: string;
    harga: number;
  }>;
}

interface OngkosTambahanPayload {
  id: number;
  kode_ongkos: string;
  nama_ongkos: string;
  harga: number;
  panjang?: string;
  lebar?: string;
  tinggi?: string;
  volume?: string;
}

/**
 * Generate nomor RAB dengan format: RAB-YYYY-MMDD-XXX
 */
export function generateNoRab(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `RAB-${year}-${month}${day}-${random}`;
}

/**
 * Generate tanggal RAB (hari ini)
 */
export function getTanggalRab(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Get jenis RAB berdasarkan tipe
 */
export function getJenisRab(isPasangBaru: boolean): string {
  return isPasangBaru ? 'RAB AIR BARU' : 'RAB PELAYANAN LAIN';
}

/**
 * Build payload untuk material paket
 */
export function buildMaterialPaket(paketItems: PaketItem[]): MaterialPaketPayload[] {
  if (paketItems.length === 0) return [];

  const paketMap = new Map<number, PaketItem[]>();
  paketItems.forEach((item) => {
    if (!paketMap.has(item.paketId)) {
      paketMap.set(item.paketId, []);
    }
    paketMap.get(item.paketId)!.push(item);
  });

  const result: MaterialPaketPayload[] = [];

  paketMap.forEach((items, paketId) => {
    const firstItem = items[0];
    result.push({
      id: paketId,
      nama_paket: firstItem.namaPaket,
      harga_paket: firstItem.hargaPaket,
      qty: 1,
      detail_barang: items.map((item) => ({
        id: item.id,
        qty: item.qty,
        satuan: item.satuan,
        harga: item.harga,
        kode_barang: item.kodeBarang,
        nama_barang: item.namaBarang,
      })),
    });
  });

  return result;
}

/**
 * Build payload untuk material tambahan
 */
export function buildMaterialTambahan(cartItems: CartItem[]): MaterialTambahanPayload[] {
  return cartItems.map((item) => ({
    id: item.id,
    qty: item.qty,
    satuan: item.satuan || '',
    harga: item.harga,
    kode_barang: item.kodeBarang || '',
    nama_barang: item.namaBarang,
  }));
}

/**
 * Build payload untuk ongkos paket
 */
export function buildOngkosPaket(
  paketItemsOngkos: PaketItem[],
  paketOngkosFullData: PaketOngkosData[]
): OngkosPaketPayload[] {
  if (paketItemsOngkos.length === 0) return [];

  const paketMap = new Map<number, PaketItem[]>();
  paketItemsOngkos.forEach((item) => {
    if (!paketMap.has(item.paketId)) {
      paketMap.set(item.paketId, []);
    }
    paketMap.get(item.paketId)!.push(item);
  });

  const result: OngkosPaketPayload[] = [];

  paketMap.forEach((items, paketId) => {
    const firstItem = items[0];
    const paketFullData = paketOngkosFullData.find((p) => p.id === paketId);
    result.push({
      id: paketId,
      nama_paket: firstItem.namaPaket,
      panjang: paketFullData?.panjang || '0',
      lebar: paketFullData?.lebar || '0',
      tinggi: paketFullData?.tinggi || '0',
      volume: paketFullData?.volume || '0',
      harga_paket: firstItem.hargaPaket,
      detail_ongkos: items.map((item) => ({
        id: item.id,
        kode_ongkos: item.kodeBarang,
        nama_ongkos: item.namaBarang,
        harga: item.harga,
      })),
    });
  });

  return result;
}

/**
 * Build payload untuk ongkos tambahan
 */
export function buildOngkosTambahan(cartItemsOngkos: CartItem[]): OngkosTambahanPayload[] {
  return cartItemsOngkos.map((item) => ({
    id: item.id,
    kode_ongkos: item.kodeOngkos || '',
    nama_ongkos: item.namaBarang,
    harga: item.harga,
    panjang: '0',
    lebar: '0',
    tinggi: '0',
    volume: '0',
  }));
}

export interface RabDetail {
  id: number;
  ppn: number;
  alamat: string;
  diskon: number;
  no_rab: string;
  jasa_id: number;
  user_id: number;
  wilayah: string;
  diameter: string;
  golongan: string;
  jenis_rab: string;
  nama_user: string;
  total_rab: number;
  pembulatan: number;
  wilayah_id: number;
  diameter_id: number;
  golongan_id: number;
  persen_jasa: number;
  tanggal_rab: string;
  no_pelanggan: string;
  total_ongkos: number;
  kode_golongan: string;
  nama_pelanggan: string;
  total_material: number;
}

export interface RabData {
  id: number;
  detail_rab: RabDetail;
  ongkos?: unknown[];
  material?: unknown[];
  setuju?: boolean;
  lunas?: boolean;
  noRab?: string;
  tglRab?: string;
  jenisRab?: string;
  nopel?: string;
  nama?: string;
  alamat?: string;
  wilayah?: string;
  rayon?: string;
}

export interface RabFilter {
  tglRab?: string;
  noRab?: string;
  jenisRab?: string;
  noPel?: string;
  nama?: string;
  wilayah?: string;
  rayon?: string;
  setuju?: boolean;
  lunas?: boolean;
}

export interface RabSummary {
  jmlRab: number;
  totalRab: number;
}

export type RabType = 'pelanggan' | 'non-pelanggan';

export interface RabPagination {
  currentPage: number;
  totalPages: number;
  limit: number;
  totalRecords: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface RabResponse {
  success: boolean;
  message: string;
  dataL: RabData[];
  pagination: RabPagination;
}

export interface RabService {
  getAll: (params?: Record<string, unknown>) => Promise<RabResponse>;
}

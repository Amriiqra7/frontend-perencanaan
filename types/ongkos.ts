export interface SatuanOngkos {
  id: number;
  kode: string;
  rumus: string;
  col: number;
}

export interface SatuanOngkosResponse {
  success: boolean;
  message: string;
  data: SatuanOngkos[];
}

export interface OngkosData {
  id: number;
  nama_ongkos: string;
  kode_ongkos: string;
  harga_ongkos: string;
  satuan_id: number;
  created_at: string;
  updated_at: string;
  satuan_ongkos: SatuanOngkos;
}

export interface OngkosResponse {
  success: boolean;
  message: string;
  data: OngkosData[];
  pagination: OngkosPagination;
}

export interface OngkosDetailResponse {
  success: boolean;
  message: string;
  data: OngkosData;
}

export interface OngkosPagination {
  currentPage: number;
  totalPages: number;
  limit: number;
  totalRecords: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface OngkosCreatePayload {
  kode: string;
  nama: string;
  satuanId: number;
  harga: number;
}

export interface OngkosUpdatePayload {
  kode: string;
  nama: string;
  satuanId: number;
  harga: number;
}

export interface OngkosService {
  getAll: (params?: Record<string, unknown>) => Promise<OngkosResponse>;
  getById: (id: number) => Promise<OngkosDetailResponse>;
  getComboSatuanOngkos: (params?: Record<string, unknown>) => Promise<SatuanOngkosResponse>;
  create: (data: OngkosCreatePayload) => Promise<{ success: boolean; message: string; data?: unknown }>;
  update: (id: number, data: OngkosUpdatePayload) => Promise<{ success: boolean; message: string; data?: unknown }>;
  delete: (id: number) => Promise<{ success: boolean; message: string }>;
}

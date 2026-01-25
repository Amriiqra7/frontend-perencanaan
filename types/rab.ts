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

export interface PasangBaruData {
  id: number;
  no_regis: string;
  tanggal: string;
  nama: string;
  alamat: string;
  tmp_lahir: string | null;
  tgl_lahir: string | null;
  no_ktp: string | null;
  no_kk: string | null;
  no_telp: string | null;
  no_hp: string | null;
  email: string | null;
  pekerjaan: string | null;
  jumlah_penghuni: number;
  jenis_bangunan: string | null;
  kepemilikan: string | null;
  kec_id: number | null;
  rayon_id: number | null;
  kel_id: number | null;
  jalan_id: number | null;
  longlat: string | null;
  group_id: number;
  created_at: string;
  updated_at: string;
  flaglunas: number;
  jenis_nonair_id: number | null;
  flexiblebiaya: number;
  flagpajak: number;
  jenis: string | null;
  biaya: number;
  user_id: number | null;
  flag_tidakpasang: number;
  latitude: string | null;
  longitude: string | null;
  flag_sudahrab: number;
  rab_id: number | null;
}

export interface PelayananLainData {
  id: number;
  no_regis: string;
  tanggal: string;
  pelanggan_id: number | null;
  no_pelanggan: string | null;
  nama: string;
  alamat: string;
  keterangan: string | null;
  created_at: string;
  updated_at: string;
  flaglunas: number;
  jenis_nonair_id: number | null;
  flexiblebiaya: number;
  flagpajak: number;
  jenis: string | null;
  biaya: number;
  user_input: number | null;
  flagproses: number;
  petugas_id: number | null;
  tglproses: string | null;
  flagrealisasi: number;
  user_realisasi: number | null;
  tglrealisasi: string | null;
  flagditugasi: number;
  realisasi_periode: string | null;
  pakaim3: number | null;
  nama_lama: string | null;
  alamat_lama: string | null;
  nik_lama: string | null;
  nokk_lama: string | null;
  nohp_lama: string | null;
  nama_baru: string | null;
  alamat_baru: string | null;
  nik_baru: string | null;
  nokk_baru: string | null;
  nohp_baru: string | null;
  wilayah_id: number | null;
  wilayah: string | null;
  golongan_id: number | null;
  kodegol: string | null;
  golongan: string | null;
  url_foto_proses: string | null;
  url_foto_ttd: string | null;
  flagrab: number;
  flag_sudahrab: number;
  rab_id: number | null;
}

export interface PasangBaruResponse {
  success: boolean;
  message: string;
  data: PasangBaruData[];
  pagination: RabPagination;
}

export interface PelayananLainResponse {
  success: boolean;
  message: string;
  data: PelayananLainData[];
  pagination: RabPagination;
}

export interface PaketBarangDetail {
  id: number;
  qty: number;
  harga: number;
  satuan: string;
  kode_barang: string;
  nama_barang: string;
}

export interface PaketBarangData {
  id: number;
  nama_paket: string;
  harga_paket: number;
  detail_barang: PaketBarangDetail[];
}

export interface PaketBarangResponse {
  success: boolean;
  message: string;
  data: PaketBarangData[];
  pagination: RabPagination;
}

export interface BarangData {
  id: number;
  kode_barang: string;
  nama_barang: string;
  satuan: string;
  harga_jual: string;
  qty: number;
}

export interface BarangResponse {
  success: boolean;
  message: string;
  data: BarangData[];
  pagination: RabPagination;
}

export interface RabService {
  getAll: (params?: Record<string, unknown>) => Promise<RabResponse>;
  getPasangBaru: (params?: Record<string, unknown>) => Promise<PasangBaruResponse>;
  getPelayananLain: (params?: Record<string, unknown>) => Promise<PelayananLainResponse>;
  getComboPaketBarang: (params?: Record<string, unknown>) => Promise<PaketBarangResponse>;
  getComboBarang: (params?: Record<string, unknown>) => Promise<BarangResponse>;
}

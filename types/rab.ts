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
  rayon?: string;
  rayon_id?: number;
  pendaftaranpel_id?: number | null;
  pendaftaranlain_id?: number | null;
}

export interface MaterialDetail {
  id: number;
  qty: number;
  harga: number;
  satuan: string;
  is_paket: number;
  barang_id: number;
  harga_paket: number;
  is_tambahan: number;
  nama_barang: string;
  kode_barang?: string;
}

export interface OngkosDetail {
  id: number;
  harga: number;
  lebar: number;
  tinggi: number;
  volume: number;
  panjang: number;
  is_paket: number;
  ongkos_id: number;
  harga_paket: number;
  is_tambahan: number;
  nama_ongkos: string;
  satuan_kode: string;
  satuan_rumus: string;
  satuan_ongkos_id: number;
}

export interface RabDetailData {
  id: number;
  detail_rab: RabDetail;
  ongkos: OngkosDetail[];
  material: MaterialDetail[];
}

export interface RabDetailResponse {
  success: boolean;
  message: string;
  data: RabDetailData;
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
  wilayah_id?: number;
  rayon?: string;
  rayon_id?: number;
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

export interface PaketOngkosDetail {
  id: number;
  harga: number;
  kode_ongkos: string;
  nama_ongkos: string;
}

export interface PaketOngkosData {
  id: number;
  nama_paket: string;
  panjang: string;
  lebar: string;
  tinggi: string;
  volume: string;
  harga_paket: number;
  detail_ongkos: PaketOngkosDetail[];
}

export interface PaketOngkosResponse {
  success: boolean;
  message: string;
  data: PaketOngkosData[];
  pagination: RabPagination;
}

export interface OngkosComboResponse {
  success: boolean;
  message: string;
  data: OngkosComboData[];
  pagination: RabPagination;
}

export interface OngkosComboData {
  id: number;
  kode_ongkos: string;
  nama_ongkos: string;
  harga_ongkos: string;
  satuan_id: number;
}

export interface JasaData {
  id: number;
  namajasa: string;
  persen: string;
}

export interface JasaResponse {
  success: boolean;
  message: string;
  data: JasaData[];
  pagination: RabPagination;
}

export interface PPNData {
  id: number;
  jml: string;
  mulaitgl: string;
}

export interface PPNResponse {
  success: boolean;
  message: string;
  data: PPNData[];
  pagination: RabPagination;
}

export interface GolonganData {
  id: number;
  kode_golongan: string;
  nama: string;
}

export interface GolonganResponse {
  status: number;
  data: GolonganData[];
}

export interface DiameterData {
  id: number;
  kode: string;
  nama: string;
}

export interface DiameterResponse {
  success: boolean;
  message: string;
  data: DiameterData[];
  pagination?: RabPagination;
}

export interface WilayahData {
  id: number;
  nama: string;
  kode?: string;
}

export interface WilayahResponse {
  status: number;
  data: WilayahData[];
}

export interface RayonData {
  id: number;
  nama: string;
  kode?: string;
}

export interface RayonResponse {
  status: number;
  data: RayonData[];
}

export interface HistoryPelanggan {
  id: number;
  jenis: string;
  tanggal: string;
  user_id: number;
  nama_user: string;
  keterangan: string;
  no_pelanggan: string;
}

export interface PelangganData {
  id: number;
  status: number;
  no_pelanggan: string;
  nama: string;
  alamat: string;
  golongan_id: number;
  flagdomestik: number;
  tgl_pasif: string | null;
  tgl_pasang: string | null;
  tgl_aktif: string | null;
  tgl_gantiwm: string | null;
  rayon_id: number;
  jalan_id: number;
  wilayah_id: number;
  kec_id: number;
  kel_id: number;
  diameter_id: number;
  no_kk: string;
  no_ktp: string;
  no_hp: string;
  group_id: number;
  path_fotorumah: string | null;
  flag_status: number;
  nama_group: string;
  namaGolongan: string;
  kode_golongan: string;
  namaRayon: string;
  namaJalan: string;
  namaWilayah: string;
  namaKecamatan: string;
  namaKelurahan: string;
  history_pelanggan: HistoryPelanggan[];
}

export interface PelangganResponse {
  success: boolean;
  message: string;
  data: PelangganData;
}

export interface MaterialPaketDetail {
  id: number;
  qty: number;
  satuan: string;
  harga: number;
  kode_barang: string;
  nama_barang: string;
}

export interface MaterialPaket {
  id: number;
  nama_paket: string;
  harga_paket: number;
  qty: number;
  detail_barang: MaterialPaketDetail[];
}

export interface MaterialTambahan {
  id: number;
  qty: number;
  satuan: string;
  harga: number;
  kode_barang: string;
  nama_barang: string;
}

export interface OngkosPaketDetail {
  id: number;
  kode_ongkos: string;
  nama_ongkos: string;
  harga: number;
}

export interface OngkosPaket {
  id: number;
  nama_paket: string;
  panjang: string;
  lebar: string;
  tinggi: string;
  volume: string;
  harga_paket: number;
  detail_ongkos: OngkosPaketDetail[];
}

export interface OngkosTambahan {
  id: number;
  kode_ongkos: string;
  nama_ongkos: string;
  harga: number;
  panjang?: string;
  lebar?: string;
  tinggi?: string;
  volume?: string;
}

export interface RabCreatePayload {
  tanggal_rab: string;
  jenis_rab: string;
  no_rab: string;
  no_pelanggan: string;
  nama_pelanggan: string;
  alamat: string;
  wilayah_id: number;
  golongan_id: number | null;
  diameter_id: number | null;
  rayon_id: number;
  pendaftaranpel_id: number | null;
  pendaftaranlain_id: number | null;
  jasa_id: number | null;
  ppn: number;
  diskon: number;
  flag_ambil_gudang: number;
  tipe_pembulatan: string;
  total_sebelum_bulat: number;
  material: {
    paket: MaterialPaket[];
    tambahan: MaterialTambahan[];
  };
  ongkos: {
    paket: OngkosPaket[];
    tambahan: OngkosTambahan[];
  };
}

export type RabUpdatePayload = RabCreatePayload;

export interface RabService {
  getAll: (params?: Record<string, unknown>) => Promise<RabResponse>;
  getById: (id: number) => Promise<RabDetailResponse>;
  update: (id: number, data: RabUpdatePayload) => Promise<{ success: boolean; message: string; data?: unknown }>;
  getPasangBaru: (params?: Record<string, unknown>) => Promise<PasangBaruResponse>;
  getPelayananLain: (params?: Record<string, unknown>) => Promise<PelayananLainResponse>;
  getComboPaketBarang: (params?: Record<string, unknown>) => Promise<PaketBarangResponse>;
  getComboBarang: (params?: Record<string, unknown>) => Promise<BarangResponse>;
  getComboPaketOngkos: (params?: Record<string, unknown>) => Promise<PaketOngkosResponse>;
  getComboOngkos: (params?: Record<string, unknown>) => Promise<OngkosComboResponse>;
  getComboJasa: (params?: Record<string, unknown>) => Promise<JasaResponse>;
  getComboPPN: (params?: Record<string, unknown>) => Promise<PPNResponse>;
  getComboGolongan: (params?: Record<string, unknown>) => Promise<GolonganResponse>;
  getComboDiameter: (params?: Record<string, unknown>) => Promise<DiameterResponse>;
  getComboWilayah: (params?: Record<string, unknown>) => Promise<WilayahResponse>;
  getComboRayon: (params?: Record<string, unknown>) => Promise<RayonResponse>;
  getByPelanggan: (id: number) => Promise<PelangganResponse>;
  create: (data: RabCreatePayload) => Promise<{ success: boolean; message: string; data?: unknown }>;
}

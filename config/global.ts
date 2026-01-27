import type { ParamsObject, CleanParams } from '@/types/config';

export const removeEmptyParams = (params: ParamsObject): CleanParams => {
  if (!params) return undefined;
  const cleanParams: Record<string, unknown> = {};
  Object.keys(params).forEach((key) => {
    if (
      params[key] !== null &&
      params[key] !== undefined &&
      params[key] !== ""
    ) {
      cleanParams[key] = params[key];
    }
  });
  return Object.keys(cleanParams).length ? cleanParams : undefined;
};

/**
 * Format angka menjadi format rupiah dengan pemisah titik
 * @param value - Nilai angka atau string angka
 * @returns String dengan format rupiah (contoh: "1.000.000")
 */
export const formatRupiahInput = (value: string | number): string => {
  if (!value && value !== 0) return '';
  const numericValue = typeof value === 'string' ? value.replace(/\./g, '') : value.toString();
  if (!numericValue) return '';
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

/**
 * Parse format rupiah kembali ke angka
 * @param value - String dengan format rupiah (contoh: "1.000.000")
 * @returns Angka (contoh: 1000000)
 */
export const parseRupiahInput = (value: string): number => {
  if (!value) return 0;
  const numericValue = value.replace(/\./g, '');
  return parseFloat(numericValue) || 0;
};

/**
 * Handler untuk onChange input harga yang otomatis format saat mengetik
 * @param e - Event dari input onChange
 * @param setValue - Function untuk set value
 * @param setError - Optional function untuk clear error
 */
export const handleRupiahInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  setValue: (value: string) => void,
  setError?: (error: string | undefined) => void
): void => {
  const rawValue = e.target.value;
  const numericValue = rawValue.replace(/[^\d]/g, '');

  const formattedValue = formatRupiahInput(numericValue);
  
  setValue(formattedValue);
  
  if (setError) {
    setError(undefined);
  }
};
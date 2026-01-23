export interface ApiParams {
  [key: string]: unknown;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  success?: boolean;
  [key: string]: unknown;
}

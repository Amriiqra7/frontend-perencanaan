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
import { removeEmptyParams } from "@/config/global";
import { createAxiosInstance } from "./axiosInstances";
import { createHandleRequest } from "./interceptors";
import type { MenuService } from '@/types/menu';
import type { RabService } from '@/types/rab';
import type { OngkosService } from '@/types/ongkos';

const axiosInstance = createAxiosInstance();
const handleRequest = createHandleRequest();

export const validateToken = async (): Promise<{ success: boolean; user?: unknown; message?: string }> => {
    return handleRequest(
        axiosInstance.get("/api/auth/validate-token")
    );
}

export const getMenu: MenuService = {
    getAll: (params?: Record<string, unknown>) =>
        handleRequest(
            axiosInstance.get("/api/hublang/administrator/hak-akses", {
                params: removeEmptyParams(params),
            })
        ),
}

export const getRab: RabService = {
    getAll: (params?: Record<string, unknown>) =>
        handleRequest(
            axiosInstance.get("/api/perencanaan/rab", {
                params: removeEmptyParams(params),
            })
        ),

    getPasangBaru: (params?: Record<string, unknown>) =>
        handleRequest(
            axiosInstance.get("/api/perencanaan/pendaftaran-pel", {
                params: removeEmptyParams(params),
            })
        ),

    getPelayananLain: (params?: Record<string, unknown>) =>
        handleRequest(
            axiosInstance.get("/api/perencanaan/pelayanan-lain", {
                params: removeEmptyParams(params),
            })
        ),

    getComboPaketBarang: (params?: Record<string, unknown>) =>
        handleRequest(
            axiosInstance.get("/api/perencanaan/paket-barang", {
                params: removeEmptyParams(params),
            })
        ),

    getComboBarang: (params?: Record<string, unknown>) =>
        handleRequest(
            axiosInstance.get("/api/perencanaan/barang", {
                params: removeEmptyParams(params),
            })
        ),
}

export const getOngkos: OngkosService = {
    getAll: (params?: Record<string, unknown>) =>
        handleRequest(
            axiosInstance.get("/api/perencanaan/ongkos", {
                params: removeEmptyParams(params),
            })
        ),

    getById: (id: number) =>
        handleRequest(axiosInstance.get(`/api/perencanaan/ongkos/${id}`)),

    getComboSatuanOngkos: (params?: Record<string, unknown>) =>
        handleRequest(
            axiosInstance.get("/api/perencanaan/satuan-ongkos", {
                params: removeEmptyParams(params),
            })
        ),

    create: (data) =>
        handleRequest(axiosInstance.post("/api/perencanaan/ongkos", data)),

    update: (id: number, data) =>
        handleRequest(axiosInstance.put(`/api/perencanaan/ongkos/${id}`, data)),

    delete: (id: number) =>
        handleRequest(axiosInstance.delete(`/api/perencanaan/ongkos/${id}`)),
}
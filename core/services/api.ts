import { removeEmptyParams } from "@/config/global";
import { createAxiosInstance } from "./axiosInstances";
import { createHandleRequest } from "./interceptors";
import type { MenuService } from '@/types/menu';
import type { RabService } from '@/types/rab';

const axiosInstance = createAxiosInstance();
const handleRequest = createHandleRequest();

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
}
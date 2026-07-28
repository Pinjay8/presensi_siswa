import { http } from "@itokun99/http";
import { API_CONFIG, SERVICE_ENDPOINTS } from "../configs/app";
import { BaseResponse } from "../models/http";
import { getInitialOptions } from "../utils/http";
import { withQuery } from "../utils/withQuery";
import { getToken } from "@/features/auth";

export interface GetMemberParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;

  [key: string]: any;
}

export const ekstrakurikulerService = {
  all: http.get<BaseResponse<any[]>>(
    API_CONFIG.baseUrl + SERVICE_ENDPOINTS.ekstrakurikuler.all,
    getInitialOptions,
  ),

  getPaginated: async (params: any): Promise<any> => {
    const query = {
      page: params.page,
      limit: params.limit,
      ...(params.search && { search: params.search }),
      ...(params.sortBy && { sortBy: params.sortBy }),
      ...(params.sortOrder && { sortOrder: params.sortOrder }),
      ...(params.jenis && { jenis: params.jenis }),
    };

    const url = withQuery(
      `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.ekstrakurikuler.all}`,
      query,
    );

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();

    return json;
  },

  get: (id: number) =>
    http.get<any>(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.ekstrakurikuler.all,
      getInitialOptions,
    )({ path: String(id) }),
  delete: (id: number) =>
    http.delete<BaseResponse<any>>(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.ekstrakurikuler.all,
      getInitialOptions,
    )({ path: String(id) }),
  create: (data: any) => {
    return http.post<BaseResponse, any>(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.ekstrakurikuler.all,
      getInitialOptions,
    )(data);
  },
  update: (id: number, data: any) => {
    return http.put<{ message: string; id: number }, any>(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.ekstrakurikuler.all,
      getInitialOptions,
    )(data, { path: String(id) });
  },

  // get member
  getMember: async (
    id: number,
    params?: GetMemberParams,
  ): Promise<any> => {
    const query = {
      ...params,
    };

    if (!query?.search) {
      delete query.search;
    }

    const url = withQuery(
      `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.ekstrakurikuler.all}/${id}/anggota`,
      query,
    );

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });

    return response.json();
  },

  // assign member to ekstra
  assignMember: (id: number, data: any) => {
    return http.post<{ message: string; id: number }, any>(
      `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.ekstrakurikuler.all}/${id}/anggota`,
      getInitialOptions,
    )(data);
  },
  removeMember: (ekskulId: number, biodataSiswaId: number) => {
    return http.delete<any, any>(
      `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.ekstrakurikuler.all}/${ekskulId}/anggota/${biodataSiswaId}`,
      getInitialOptions,
    );
  },

  getAbsensi: async (
    id: number,
    params?: {
      dayOfWeek?: number;
      jamMulai?: string;
      page?: any;
      limit?: any;
    },
  ) => {
    const query = {
      ...(params?.dayOfWeek !== undefined && {
        dayOfWeek: params.dayOfWeek,
      }),
      ...(params?.jamMulai && {
        jamMulai: params.jamMulai,
      }),
      ...(params?.page && { page: params.page }),
      ...(params?.limit && { limit: params.limit }),
    };

    const url = withQuery(
      `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.ekstrakurikuler.all}/${id}/absensi`,
      query,
    );

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });

    return response.json();
  },

  // create absensi
  createAbsensi: (
    id: number,
    data: {
      anggotaEkskulId: number;
      statusKehadiran: string;
    },
  ) => {
    return http.post<any, any>(
      `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.ekstrakurikuler.all}/${id}/absensi`,
      getInitialOptions,
    )(data);
  },

  // rekap bulanan
  getRekapBulanan: async (id: number) => {
    const url = withQuery(
      `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.ekstrakurikuler.all}/${id}/rekap-bulanan`,
    );

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });

    return response.json();
  },
};

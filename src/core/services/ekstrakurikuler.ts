import { http } from "@itokun99/http";
import { API_CONFIG, SERVICE_ENDPOINTS } from "../configs/app";
import { BaseResponse } from "../models/http";
import { getInitialOptions } from "../utils/http";
import { CourseCreationModel, CourseDataModel } from "../models/course";
import { withQuery } from "../utils/withQuery";
import { getToken } from "@/features/auth";

export const ekstrakurikulerService = {
  all: http.get<BaseResponse<any[]>>(
    API_CONFIG.baseUrl + SERVICE_ENDPOINTS.ekstrakurikuler.all,
    getInitialOptions,
  ),

  getPaginated: async (params: any): Promise<any> => {
    const query = {
      page: params.page,
      limit: params.limit,
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
    params?: {
      page?: number;
      limit?: number;
      search?: string;
    },
  ): Promise<any> => {
    const hasParams =
      params &&
      Object.values(params).some(
        (value) => value !== undefined && value !== "",
      );

    const url = hasParams
      ? withQuery(
          `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.ekstrakurikuler.all}/${id}/anggota`,
          {
            ...(params.page !== undefined && {
              page: params.page,
            }),
            ...(params.limit !== undefined && {
              limit: params.limit,
            }),
            ...(params.search !== undefined && {
              search: params.search,
            }),
          },
        )
      : `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.ekstrakurikuler.all}/${id}/anggota`;

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
  removeMember: (id: number) => {
    return http.delete<any, any>(
      `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.ekstrakurikuler.all}/${id}/anggota`,
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

import { http } from "@itokun99/http";
import { API_CONFIG, SERVICE_ENDPOINTS } from "../configs/app";
import { BaseResponse } from "../models/http";
import { getInitialOptions } from "../utils/http";
import { BiodataSiswa } from "../models/biodata";
import { BiodataGuru } from "../models/biodata-guru";
import { withQuery } from "../utils/withQuery";
import { getToken } from "@/features/auth";

export const biodataService = {
  siswa: http.get<BaseResponse<any[]>>(
    API_CONFIG.baseUrl + SERVICE_ENDPOINTS.biodata.siswa,
    getInitialOptions,
  ),
  checkAllAttendances: http.get<BaseResponse<BiodataSiswa[]>>(
    API_CONFIG.baseUrl + SERVICE_ENDPOINTS.biodata.allAttedance,
    getInitialOptions,
  ),
  siswaById: (id: number) =>
    http.get<BaseResponse<BiodataSiswa>>(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.biodata.siswa,
      getInitialOptions,
    )({ path: String(id) }),
  guru: http.get<BaseResponse<BiodataGuru[]>>(
    `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.biodata.guru}`,
    getInitialOptions,
  ),
  getGuruPaginated: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    [key: string]: any;
  }) => {

    const query = {
      ...params,
    };


    if (!query.search) {
      delete query.search;
    }

    const url = withQuery(
      `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.biodata.guru}`,
      query,
    );

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });

    return await response.json();
  },
  getGuruById: (user_id: number) =>
    http.get<BaseResponse<any>>(
      `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.teacher.detail}`,
      getInitialOptions,
    )({ path: String(user_id) }),

  checkAttendance: (id: number | string) =>
    http.get<BaseResponse<any>>(
      `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.biodata.attedance}`,
      getInitialOptions,
    )({ path: String(id) }),
  guruById: (id: number) =>
    http.get<BaseResponse<BiodataGuru>>(
      `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.teacher.detail}`,
      getInitialOptions,
    )({ path: String(id) }),

};

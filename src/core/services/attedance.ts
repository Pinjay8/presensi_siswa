import { http } from "@itokun99/http";
import { API_CONFIG, SERVICE_ENDPOINTS } from "../configs/app";
import { attendanceCreationModel } from "../models";
import { getInitialOptions } from "../utils/http";
import { withQuery } from "../utils/withQuery";
import { getToken } from "@/features/auth";
export interface GetMapelHarianParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  [key: string]: any;
}

export const attendanceService = {
  create: (data: attendanceCreationModel) => {
    return http.post<
      { message: string; userId: number },
      attendanceCreationModel
    >(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.attedance.createAttedance,
      getInitialOptions,
    )(data);
  },

  createPulang: (data: attendanceCreationModel) => {
    return http.post<
      { message: string; userId: number },
      attendanceCreationModel
    >(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.attedance.createPulangAttedance,
      getInitialOptions,
    )(data);
  },
  // getMapelHarian: http.get<any>(
  //   API_CONFIG.baseUrl + SERVICE_ENDPOINTS.attendances.absentMapel,
  //   getInitialOptions,
  // ),
  getMapelHarian: async (params: GetMapelHarianParams) => {
    const query = {
      ...params,
    };

    if (!query.search) {
      delete query.search;
    }

    const url = withQuery(
      `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.attendances.absentMapel}`,
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
  createAbsenMapel: (userId: number | string) =>
    http.post(
      `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.attendances.absentManual}/${userId}`,
      getInitialOptions,
    ),
};

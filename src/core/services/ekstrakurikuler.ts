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
    http.get<CourseDataModel>(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.ekstrakurikuler.all,
      getInitialOptions,
    )({ path: String(id) }),
  delete: (id: number) =>
    http.delete<BaseResponse<CourseDataModel>>(
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
};

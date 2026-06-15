import { http } from "@itokun99/http";
import { API_CONFIG, SERVICE_ENDPOINTS } from "../configs/app";
import { BaseResponse } from "../models/http";
import { getInitialOptions } from "../utils/http";
import { CourseCreationModel, CourseDataModel } from "../models/course";

export const ekstrakurikulerService = {
  all: http.get<BaseResponse<any[]>>(
    API_CONFIG.baseUrl + SERVICE_ENDPOINTS.ekstrakurikuler.all,
    getInitialOptions,
  ),
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
    return http.put<
      { message: string; id: number },
      any
    >(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.ekstrakurikuler.all,
      getInitialOptions,
    )(data, { path: String(id) });
  },
};

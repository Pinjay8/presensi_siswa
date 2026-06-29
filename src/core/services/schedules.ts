/* eslint-disable @typescript-eslint/no-explicit-any */
import { http } from "@itokun99/http";
import { API_CONFIG, SERVICE_ENDPOINTS } from "../configs/app";
import { BaseResponse } from "../models/http";
import { SchoolDataModel } from "../models/schools";
import { getInitialOptions } from "../utils/http";

export const scheduleService = {
  all: http.get<BaseResponse<SchoolDataModel[]>>(
    API_CONFIG.baseUrl + SERVICE_ENDPOINTS.schedule.schedules,
    getInitialOptions,
  ),
  get: (id: number) =>
    http.get<BaseResponse<SchoolDataModel>>(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.schedule.schedules,
      getInitialOptions,
    )({ path: String(id) }),
  getPaginated: (params?: {
    page?: number;
    limit?: number;
    kelasId?: number;
  }) => {
    const search = new URLSearchParams();

    if (params?.page) search.append("page", String(params.page));
    if (params?.limit) search.append("limit", String(params.limit));
    if (params?.kelasId) search.append("kelasId", String(params.kelasId));

    return http.get<BaseResponse<SchoolDataModel[]>>(
      `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.schedule.schedules}?${search.toString()}`,
      getInitialOptions,
    )();
  },
  create: (data: any) => {
    return http.post<BaseResponse, any>(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.schedule.create,
      getInitialOptions,
    )(data);
  },
  delete: (id: number) =>
    http.delete<BaseResponse<any>>(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.schedule.delete,
      getInitialOptions,
    )({ path: String(id) }),
  update: (id: number, data: any) => {
    return http.put<{ message: string; sekolahId: number }, any>(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.schedule.update,
      getInitialOptions,
    )(data, { path: String(id) });
  },
};

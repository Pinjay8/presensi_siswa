/* eslint-disable @typescript-eslint/no-explicit-any */
import { http } from "@itokun99/http";
import { API_CONFIG, SERVICE_ENDPOINTS } from "../configs/app";
import { BaseResponse } from "../models/http";
// import {
//     SchoolDataModel
// } from "../models/schools";
import { getInitialOptions } from "../utils/http";

export const scheduleEkstrakurikulerService = {
  all: http.get<BaseResponse<any[]>>(
    API_CONFIG.baseUrl + SERVICE_ENDPOINTS.ekstrakurikuler.schedules,
    getInitialOptions,
  ),

  get: (id: number) =>
    http.get<BaseResponse<any>>(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.ekstrakurikuler.schedules,
      getInitialOptions,
    )({ path: String(id) }),
  create: (ekskulId: number, data: any) => {
    return http.post<BaseResponse, any>(
      `${API_CONFIG.baseUrl}/api/ekstrakurikuler/${ekskulId}/jadwal`,
      getInitialOptions,
    )(data);
  },
  delete: (ekskulId: number, jadwalId: number) =>
    http.delete<BaseResponse<any>>(
      `${API_CONFIG.baseUrl}/api/ekstrakurikuler/${ekskulId}/jadwal/${jadwalId}`,
      getInitialOptions,
    )(),
  //   update: (id: number, data: any) => {
  //     return http.put<{ message: string; sekolahId: number }, any>(
  //       API_CONFIG.baseUrl + SERVICE_ENDPOINTS.ekstrakurikuler.schedules,
  //       getInitialOptions,
  //     )(data, { path: String(id) });
  //   },
  update: (ekskulId: number, jadwalId: number, data: any) => {
    return http.put<BaseResponse, any>(
      `${API_CONFIG.baseUrl}/api/ekstrakurikuler/${ekskulId}/jadwal/${jadwalId}`,
      getInitialOptions,
    )(data);
  },
};

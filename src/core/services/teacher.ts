/* eslint-disable @typescript-eslint/no-explicit-any */
import { http } from "@itokun99/http";
import { API_CONFIG, SERVICE_ENDPOINTS } from "../configs/app";
import { BaseResponse } from "../models/http";
import { getInitialOptions } from "../utils/http";
import {
  SchoolCreationModel,
  SchoolDataModel,
  SchoolRegisterModel,
} from "../models/schools";

export const teacherService = {
  all: http.get<BaseResponse<SchoolDataModel[]>>(
    API_CONFIG.baseUrl + SERVICE_ENDPOINTS.teacher.waliKelas,
    getInitialOptions,
  ),
  get: (id: number) =>
    http.get<BaseResponse<SchoolDataModel>>(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.teacher.waliKelas,
      getInitialOptions,
    )({ path: String(id) }),

  // create
  create: http.post(
    API_CONFIG.baseUrl + SERVICE_ENDPOINTS.teacher.waliKelas,
    getInitialOptions,
  ),

  //   update
  update: (id: number, data: any) => {
    return http.put<{ message: string; sekolahId: number }, any>(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.teacher.waliKelas,
      getInitialOptions,
    )(data, { path: String(id) });
  },

  qrCodeGenerate : http.post(
    API_CONFIG.baseUrl + SERVICE_ENDPOINTS.teacher.generateQrCode,
    getInitialOptions,
  ),
};

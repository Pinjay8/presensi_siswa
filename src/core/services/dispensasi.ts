import { http } from "@itokun99/http";
import { API_CONFIG, SERVICE_ENDPOINTS } from "../configs/app";
import { BaseResponse } from "../models/http";
import { getInitialOptions } from "../utils/http";
import { getToken } from "@/features/auth";

export const dispensasiService = {
  createDispensasi: http.post<BaseResponse<any>>(
    API_CONFIG.baseUrl + SERVICE_ENDPOINTS.dispensasi.create,
    getInitialOptions,
  ),
  // create: async (formData: FormData) => {
  //   const response = await fetch(
  //     API_CONFIG.baseUrl + SERVICE_ENDPOINTS.dispensasi.create,
  //     {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${getToken()}`,
  //       },
  //       body: formData,
  //     },
  //   );
  //   return await response.json();
  // },
  create: async (body: {
    siswaId: number;
    alasan: string;
    dari: string;
    sampai: string;
    buktiSurat: string;
  }) => {
    const response = await fetch(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.dispensasi.create,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    return await response.json();
  },
  get: http.get<BaseResponse<any[]>>(
    API_CONFIG.baseUrl + SERVICE_ENDPOINTS.dispensasi.get,
    getInitialOptions,
  ),
  getDispensiStudent: http.get<BaseResponse<any[]>>(
    API_CONFIG.baseUrl + SERVICE_ENDPOINTS.dispensasi.getDispensiStudent,
    getInitialOptions,
  ),
  getPending: http.get<BaseResponse<any[]>>(
    API_CONFIG.baseUrl + SERVICE_ENDPOINTS.dispensasi.getPending,
    getInitialOptions,
  ),
  approve: (id: number) =>
    http.put<BaseResponse<any>>(
      `${API_CONFIG.baseUrl}/api/dispensasi/${id}/approve`,
      getInitialOptions,
    )(),

  reject: (id: number, payload: { catatanPenolakan: string }) =>
    http.put<BaseResponse>(
      `${API_CONFIG.baseUrl}/api/dispensasi/${id}/reject`,
      getInitialOptions,
    )(payload),
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import { http } from "@itokun99/http";
import { API_CONFIG, SERVICE_ENDPOINTS } from "../configs/app";
import { BaseResponse } from "../models/http";
import { getInitialOptions } from "../utils/http";
import { getToken } from "@/features/auth";

export const uploadExcelService = {
  async importExcel(formData: FormData) {
    const response = await fetch(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.excel.importExcel,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: formData,
      },
    );

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json?.message ?? "Upload gagal");
    }

    return json;
  },
};

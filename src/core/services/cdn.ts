import { http } from "@itokun99/http";
import { API_CONFIG, SERVICE_ENDPOINTS } from "../configs/app";
import { getInitialOptions } from "../utils/http";
import { BaseResponse, BaseResponseQr } from "../models/http";

export const cdnService = {
  uploadFile: async (formData: FormData) => {
    const response = await fetch(
      `${API_CONFIG.baseCDN}${SERVICE_ENDPOINTS.cdn.uploadFile}`,
      {
        method: "POST",
        body: formData,
      },
    );

    return response.json();
  },

  getFileUrl: (fileName: string) =>
    `${API_CONFIG.baseCDN}${SERVICE_ENDPOINTS.cdn.getFile}/${fileName}`,
};

import { API_CONFIG, SERVICE_ENDPOINTS } from "../configs/app";

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

  uploadIzin: async (formData: FormData) => {
    const response = await fetch(
      `${API_CONFIG.baseCDN}${SERVICE_ENDPOINTS.cdn.uploadIzin}`,
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

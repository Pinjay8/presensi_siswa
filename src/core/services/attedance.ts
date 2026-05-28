
import { http } from "@itokun99/http";
import { API_CONFIG, SERVICE_ENDPOINTS } from "../configs/app";
import { attendanceCreationModel } from "../models";
import { getInitialOptions } from "../utils/http";

export const attendanceService = {
  create: (data: attendanceCreationModel) => {
    return http.post<
      { message: string; sekolahId: number },
      attendanceCreationModel
    >(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.attedance.createAttedance,
      getInitialOptions,
    )(data);
  },
};

import { http } from "@itokun99/http";
import { API_CONFIG, SERVICE_ENDPOINTS } from "../configs/app";
import { getInitialOptions } from "../utils/http";
import { BaseResponse } from "../models/http";

export const dashboardService = {
  getAbsensiCount: http.get<BaseResponse>(
    `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.dashboard.absensiList}`,
    getInitialOptions,
  ),
  getClassChart: http.get<BaseResponse>(
    `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.dashboard.classChart}`,
    getInitialOptions,
  ),
  getGenderChart: http.get<BaseResponse>(
    `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.dashboard.genderChart}`,
    getInitialOptions,
  ),
  getAttendanceDetail: http.get<BaseResponse>(
    `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.dashboard.attendanceDetail}`,
    getInitialOptions,
  ),
  getSchoolDetails: http.get<BaseResponse>(
    `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.dashboard.schoolDetail}`,
    getInitialOptions,
  ),
  getDashboard: http.get<BaseResponse>(
    `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.dashboard.listCount}`,
    getInitialOptions,
  ),
};

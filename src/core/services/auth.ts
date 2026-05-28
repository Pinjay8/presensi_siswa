import { http } from "@itokun99/http";
import { API_CONFIG, SERVICE_ENDPOINTS } from "../configs/app";
import { BaseResponse } from "../models/http";
import {
  AdminRegisterModel,
  ForgotPasswordModel,
  LoginRequestModel,
  LoginResponseDataModel,
  ResetPasswordModel,
  UserRegisterResponseModel,
} from "../models/auth";
import { getInitialOptions } from "../utils/http";

export const authService = {
  login: http.post<BaseResponse<LoginResponseDataModel>, LoginRequestModel>(
    API_CONFIG.baseUrl + SERVICE_ENDPOINTS.auth.login,
  ),
  logout: http.post(
    `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.auth.logout}`,
    getInitialOptions,
  ),
  forgotPassword: http.post<BaseResponse, ForgotPasswordModel>(
    `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.auth.forgetPassword}`,
  ),
  resetPassword: http.post<BaseResponse, ResetPasswordModel>(
    `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.auth.resetPassword}`,
  ),
  signup: http.post<
    BaseResponse<UserRegisterResponseModel>,
    AdminRegisterModel
  >(`${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.auth.signup}`),
};

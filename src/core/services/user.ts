import { http } from "@itokun99/http";
import { API_CONFIG, SERVICE_ENDPOINTS } from "../configs/app";
import { getInitialOptions } from "../utils/http";
import { BaseResponse, BaseResponseQr } from "../models/http";
import { UserCreationModel, UserDataModel } from "../models/user";
import { Profile } from "../models/profile";
import { getToken } from "@/features/auth";

export const userService = {
  getProfile: http.get<BaseResponse<Profile>>(
    `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.user.profile}`,
    getInitialOptions,
  ),
  updateProfile: http.post(
    `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.user.profile}`,
    getInitialOptions,
  ),
  updatePhoto: http.post(
    `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.user.photo}`,
    getInitialOptions,
  ),
  changePassword: http.post(
    `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.user.changePassword}`,
    getInitialOptions,
  ),
  getUserDetail: (id: number) =>
    http.get<BaseResponse<UserDataModel>>(
      `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.user.user}`,
      getInitialOptions,
    )({ path: String(id) }),

  getChildParent: (parentId: number) =>
    http.get<BaseResponse<any[]>>(
      `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.user.childParent}`,
      getInitialOptions,
    )({
      params: {
        parentId,
      },
    }),

  getAdmin: http.get<BaseResponse<UserDataModel[]>>(
    `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.user.admin}`,
    getInitialOptions,
  ),

  updateUser: (userId: number, req: UserCreationModel) => {
    return http.put<BaseResponse<UserDataModel>, UserCreationModel>(
      `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.user.user}`,
      getInitialOptions,
    )(req, { path: String(userId) });
  },

  createTeacher: (req: UserCreationModel) => {
    return http.post<BaseResponse<UserDataModel>, UserCreationModel>(
      `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.user.createTeacher}`,
      getInitialOptions,
    )(req);
  },

  createParents: (req: UserCreationModel) => {
    return http.post<BaseResponse<UserDataModel>, UserCreationModel>(
      `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.user.createParents}`,
      getInitialOptions,
    )(req);
  },

  createSiswa: (req: UserCreationModel) => {
    return http.post<BaseResponse<UserDataModel>, UserCreationModel>(
      `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.user.createSiswa}`,
      getInitialOptions,
    )(req);
  },

  // Test untuk edit guru
  updateTeacher: (userId: number, req: UserCreationModel) => {
    return http.put<BaseResponse<UserDataModel>, UserCreationModel>(
      `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.user.update}`,
      getInitialOptions,
    )(req, { path: String(userId) });
  },

  updateParents: (userId: number, req: UserCreationModel) => {
    return http.put<BaseResponse<UserDataModel>, UserCreationModel>(
      `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.user.user}`,
      getInitialOptions,
    )(req, { path: String(userId) });
  },

  getParents: http.get<BaseResponse<UserDataModel[]>>(
    API_CONFIG.baseUrl + SERVICE_ENDPOINTS.users.parents,
    getInitialOptions,
  ),

  updateNotifParents: (userId: number, data: { notifOrtuEnabled: boolean }) =>
    http.put<BaseResponse<any>>(
      API_CONFIG.baseUrl +
        SERVICE_ENDPOINTS.users.notifParents.replace(
          "{user_id}",
          String(userId),
        ),
      getInitialOptions,
    )(data),

  deleteUser: (id: number) => {
    return http.delete<BaseResponse<UserDataModel>>(
      `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.user.user}`,
      getInitialOptions,
    )({ path: String(id) });
  },

  absenQr: http.post<BaseResponse<UserDataModel[]>>(
    API_CONFIG.baseUrl + SERVICE_ENDPOINTS.user.absenQr,
    getInitialOptions,
  ),
  generateQr: http.get<BaseResponseQr>(
    API_CONFIG.baseUrl + SERVICE_ENDPOINTS.user.generateQr,
    getInitialOptions,
  ),
  generateQrRfid: http.get<any>(
    API_CONFIG.baseUrl + SERVICE_ENDPOINTS.user.generateQrRfid,
    getInitialOptions,
  ),
  // registerFace: (payload: FormData) =>
  //   http.post(
  //     API_CONFIG.baseUrl + SERVICE_ENDPOINTS.user.registerFace,
  //     getInitialOptions(),
  //   )(payload),
  // registerFace: async (payload: FormData) => {
  //   return await fetch(
  //     API_CONFIG.baseUrl + SERVICE_ENDPOINTS.user.registerFace,
  //     {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${getToken()}`,
  //       },
  //       body: payload,
  //     },
  //   ).then((res) => res.json());
  // },
  // registerFaceTeacher: async (payload: FormData) => {
  //   return await fetch(
  //     API_CONFIG.baseUrl + SERVICE_ENDPOINTS.user.registerFaceTeacher,
  //     {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${getToken()}`,
  //       },
  //       body: payload,
  //     },
  //   ).then((res) => res.json());
  // },
  registerFace: async (payload: {
    userId: number;
    fotoTampakDepan: string;
  }) => {
    return await fetch(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.user.registerFace,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    ).then((res) => res.json());
  },

  registerFaceTeacher: async (payload: {
    userId: number;
    fotoTampakDepan: string;
  }) => {
    return await fetch(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.user.registerFaceTeacher,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    ).then((res) => res.json());
  },
};

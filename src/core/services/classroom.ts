import { http } from "@itokun99/http";
import { API_CONFIG, SERVICE_ENDPOINTS } from "../configs/app";
import { BaseResponse } from "../models/http";
import { getInitialOptions } from "../utils/http";
import { ClassroomDataModel, ClassroomCreationModel } from "../models";

export const classroomService = {
  // all: http.get<BaseResponse<ClassroomDataModel[]>>(
  //   API_CONFIG.baseUrl + SERVICE_ENDPOINTS.classroom.classroom,
  //   getInitialOptions,
  // ),
  all: (params?: { sekolahId?: number }) =>
    http.get<BaseResponse<ClassroomDataModel[]>>(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.classroom.classroom,
      getInitialOptions,
    )({ query: params }),
  getPaginated: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) => {
    const query = new URLSearchParams();

    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.search) query.set("search", params.search);
    if (params?.sortBy) query.set("sortBy", params.sortBy);
    if (params?.sortOrder) query.set("sortOrder", params.sortOrder);

    return http.get(
      `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.classroom.classroom}?${query.toString()}`,
      getInitialOptions,
    )();
  },
  get: (id: number) =>
    http.get<BaseResponse<ClassroomDataModel>>(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.classroom.classroom,
      getInitialOptions,
    )({ path: String(id) }),

  delete: (id: number) =>
    http.delete<BaseResponse<ClassroomDataModel>>(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.classroom.classroom,
      getInitialOptions,
    )({ path: String(id) }),
  create: (data: ClassroomCreationModel) => {
    return http.post<
      { message: string; sekolahId: number },
      ClassroomCreationModel
    >(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.classroom.classroom,
      getInitialOptions,
    )(data);
  },
  update: (id: number, data: ClassroomCreationModel) => {
    return http.put<
      { message: string; sekolahId: number },
      ClassroomCreationModel
    >(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.classroom.classroom,
      getInitialOptions,
    )(data, { path: String(id) });
  },
  getStudents: (
    id: number,
    params?: {
      page?: number;
      limit?: number;
      search?: string;
    },
  ) => {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append("page", String(params.page));

    if (params?.limit) searchParams.append("limit", String(params.limit));

    if (params?.search) searchParams.append("search", params.search);

    return http.get<BaseResponse<any[]>>(
      `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.classroom.classroom
      }/${id}/siswa${searchParams.toString() ? `?${searchParams.toString()}` : ""
      }`,
      getInitialOptions,
    )();
  },
};

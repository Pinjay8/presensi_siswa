
import { http } from "@itokun99/http";
import { API_CONFIG, SERVICE_ENDPOINTS } from "../configs/app";
import { BaseResponse } from "../models/http";
import { getInitialOptions } from "../utils/http";
import {  SchedulerDataModel,SchedulerCreationModel } from "../models";

export const schedulerService={
    all: http.get<BaseResponse<SchedulerDataModel[]>>(
        API_CONFIG.baseUrl + SERVICE_ENDPOINTS.scheduler.main,
        getInitialOptions,
    ),
    get: (id: number) =>
        http.get<BaseResponse<SchedulerDataModel>>(
            API_CONFIG.baseUrl + SERVICE_ENDPOINTS.scheduler.main,
            getInitialOptions,
        )({ path: String(id) }),
    create: (data: SchedulerCreationModel) => {
        return http.post<BaseResponse, SchedulerCreationModel>(
            API_CONFIG.baseUrl + SERVICE_ENDPOINTS.scheduler.main,
            getInitialOptions,
        )(data);
    },
    delete: (id: number) =>
        http.delete<BaseResponse<any>>(
            API_CONFIG.baseUrl + SERVICE_ENDPOINTS.scheduler.main,
            getInitialOptions,
        )({ path: String(id) }),
    update: (id: number, data: SchedulerCreationModel) => {
        return http.put<BaseResponse, SchedulerCreationModel>(
            API_CONFIG.baseUrl + SERVICE_ENDPOINTS.scheduler.main,
            getInitialOptions,
        )(data, { path: String(id) });
    },
    assignKelas: (id: number, kelas_id: number) => {
        return http.post<BaseResponse, any>(
            `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.scheduler.main}/${id}/assign/kelas/${kelas_id}`,
            getInitialOptions,
        )();
    },
    assignGuru: (id: number, guru_id: number) => {
        return http.post<BaseResponse, any>(
            `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.scheduler.main}/${id}/assign/guru/${guru_id}`,
            getInitialOptions,
        )();
    }
    
}
/* eslint-disable @typescript-eslint/no-explicit-any */
import { http } from "@itokun99/http";
import { API_CONFIG, SERVICE_ENDPOINTS } from "../configs/app";
import { BaseResponse } from "../models/http";
import { getInitialOptions } from "../utils/http";
import {
  SchoolCreationModel,
  SchoolDataModel,
  SchoolRegisterModel,
} from "../models/schools";
import { authService } from "./auth";

export const cardsService = {
  all: http.get<BaseResponse<any[]>>(
    API_CONFIG.baseUrl + SERVICE_ENDPOINTS.cards.all,
    getInitialOptions,
  ),
  get: (id: number) =>
    http.get<BaseResponse<any>>(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.cards.get,
      getInitialOptions,
    )({ path: String(id) }),
  create: (data: any) => {
    return http.post<{ message: string }, any>(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.cards.create,
      getInitialOptions,
    )(data);
  },

  update: (id: number, data: any) => {
    return http.put<{ message: string; id: number }, any>(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.cards.update,
      getInitialOptions,
    )(data, {
      path: String(id),
    });
  },

  //   Assign Card
  assign: (id: number, data: any) => {
    return http.post<{ message: string; id: number }, any>(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.cards.assignCardToUser,
      getInitialOptions,
    )(data, { path: String(id) });
  },

  //   unassign card
  unassign: (id: number, data: any) => {
    return http.post<{ message: string; id: number }, any>(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.cards.unAsssignCardToUser,
      getInitialOptions,
    )(data, { path: String(id) });
  },

  delete: (id: number) =>
    http.delete<BaseResponse<any>>(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.cards.delete,
      getInitialOptions,
    )({ path: String(id) }),
};

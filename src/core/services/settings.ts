import { http } from "@itokun99/http";
import { API_CONFIG, SERVICE_ENDPOINTS } from "../configs/app";
import { BaseResponse } from "../models/http";
import { getInitialOptions } from "../utils/http";
import { SettingsDataModel, SettingsUpdateModel } from "../models";

export const settingsService = {
  get: () =>
    http.get<BaseResponse<SettingsDataModel>>(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.settings.getSetting,
      getInitialOptions,
    )(),
  update: (data: SettingsUpdateModel) =>
    http.put<BaseResponse<SettingsDataModel>, SettingsUpdateModel>(
      API_CONFIG.baseUrl + SERVICE_ENDPOINTS.settings.updateSetting,
      getInitialOptions,
    )(data),
};

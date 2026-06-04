export interface BaseResponse<Data = unknown> {
  status: number;
  message: string;
  data?: Data;
  success?: boolean;
}

export interface BaseResponseQr {
  status: number;
  message: string;
  token?: string;
  success?: boolean;
  expiresIn: number;
}

export interface BaseResponseError {
  status: number;
  message: string;
  error: unknown;
}

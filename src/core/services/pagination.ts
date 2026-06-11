import { http } from "@itokun99/http";
import { API_CONFIG, SERVICE_ENDPOINTS } from "@/core/configs/app";
import { getInitialOptions } from "@/core/utils/http";
import { StudentPaginationResponse } from "@/core/models/pagination";
import { withQuery } from "../utils/withQuery";
import { getToken } from "@/features/auth";

export interface GetPaginatedStudentParams {
  page: number;
  size: number;
  sekolahId?: number;
  idKelas?: number;
  keyword?: string;
}
export const studentService = {
  getPaginated: async (
    params: GetPaginatedStudentParams,
  ): Promise<StudentPaginationResponse> => {
    const query = {
      page: params.page,
      size: params.size,
      ...(params.sekolahId && { sekolahId: params.sekolahId }),
      ...(params.idKelas !== undefined && { idKelas: params.idKelas }),
      ...(params.keyword && { keyword: params.keyword }),
    };

    const url = withQuery(
      `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.student.list}`,
      query,
    );

    const options = getInitialOptions();

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${options.bearerToken}`,
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();
    return {
      students: json.data,
      pagination: json.pagination,
    };
  },
  getAll: async (): Promise<any> => {
    const url = `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.student.list}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    const json = await response.json();

    return json.data;
  },
};

export interface GetAttendanceParams {
  filter: string;
  page: number;
  limit: number;
  type: string;
  kelasId?: number;
  sekolahId?: number;
  startDate?: string;
  endDate?: string;
  tanggal?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  search?: string;
}

export const attendanceService = {
  getPaginated: async (params: GetAttendanceParams): Promise<any> => {
    const query = {
      filter: params.filter,
      page: params.page,
      limit: params.limit,
      type: params.type,

      ...(params.kelasId !== undefined && {
        kelasId: params.kelasId,
      }),

      ...(params.sekolahId !== undefined && {
        sekolahId: params.sekolahId,
      }),

      ...(params.startDate && {
        startDate: params.startDate,
      }),

      ...(params.endDate && {
        endDate: params.endDate,
      }),

      ...(params.tanggal && {
        tanggal: params.tanggal,
      }),

      ...(params.sortBy && {
        sortBy: params.sortBy,
      }),

      ...(params.sortDir && {
        sortDir: params.sortDir,
      }),

      ...(params.search && {
        search: params.search,
      }),
    };

    const url = withQuery(
      `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.attendances.list}`,
      query,
    );

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();

    return json;
  },

  exportExcel: async (params: GetAttendanceParams): Promise<Blob> => {
    const query = {
      filter: params.filter,
      page: params.page,
      limit: params.limit,
      type: params.type,
      ...(params.kelasId !== undefined && { kelasId: params.kelasId }),
      ...(params.sekolahId !== undefined && { sekolahId: params.sekolahId }),
      ...(params.startDate && { startDate: params.startDate }),
      ...(params.endDate && { endDate: params.endDate }),
      ...(params.tanggal && { tanggal: params.tanggal }),
      ...(params.sortBy && { sortBy: params.sortBy }),
      ...(params.sortDir && { sortDir: params.sortDir }),
      ...(params.search && { search: params.search }),
    };

    const url = withQuery(
      `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.attendances.exportExcel}`,
      query,
    );

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    return response.blob();
  },

  exportPdf: async (params: GetAttendanceParams): Promise<any> => {
    const query = {
      filter: params.filter,
      page: params.page,
      limit: params.limit,
      type: params.type,
      ...(params.kelasId !== undefined && { kelasId: params.kelasId }),
      ...(params.sekolahId !== undefined && { sekolahId: params.sekolahId }),
      ...(params.startDate && { startDate: params.startDate }),
      ...(params.endDate && { endDate: params.endDate }),
      ...(params.tanggal && { tanggal: params.tanggal }),
      ...(params.sortBy && { sortBy: params.sortBy }),
      ...(params.sortDir && { sortDir: params.sortDir }),
      ...(params.search && { search: params.search }),
    };

    const url = withQuery(
      `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.attendances.exportPdf}`,
      query,
    );

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    return response.blob();
  },
  exportExcelMapel: async (params: GetAttendanceParams): Promise<any> => {
    const query = {
      filter: params.filter,
      page: params.page,
      limit: params.limit,
      // type: params.type,

      ...(params.kelasId !== undefined && {
        kelasId: params.kelasId,
      }),

      ...(params.sekolahId !== undefined && {
        sekolahId: params.sekolahId,
      }),

      ...(params.startDate && {
        startDate: params.startDate,
      }),

      ...(params.endDate && {
        endDate: params.endDate,
      }),

      ...(params.tanggal && {
        tanggal: params.tanggal,
      }),

      ...(params.sortBy && {
        sortBy: params.sortBy,
      }),

      ...(params.sortDir && {
        sortDir: params.sortDir,
      }),

      ...(params.search && {
        search: params.search,
      }),
    };

    // const url = withQuery(
    //   `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.attendances.exportMapelExcel}`,
    //   query,
    // );
    const url = withQuery(
      `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.attendances.exportMapelExcel}`,
      query,
    );

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    return response.blob();
  },
  exportPdfMapel: async (params: GetAttendanceParams): Promise<any> => {
    const query = {
      filter: params.filter,
      page: params.page,
      limit: params.limit,
      // type: params.type,

      ...(params.kelasId !== undefined && {
        kelasId: params.kelasId,
      }),

      ...(params.sekolahId !== undefined && {
        sekolahId: params.sekolahId,
      }),

      ...(params.startDate && {
        startDate: params.startDate,
      }),

      ...(params.endDate && {
        endDate: params.endDate,
      }),

      ...(params.tanggal && {
        tanggal: params.tanggal,
      }),

      ...(params.sortBy && {
        sortBy: params.sortBy,
      }),

      ...(params.sortDir && {
        sortDir: params.sortDir,
      }),

      ...(params.search && {
        search: params.search,
      }),
    };

    const url = withQuery(
      `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.attendances.exportMapelPdf}`,
      query,
    );

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    return response.blob();
  },
};

export const attendanceServiceMataPelajaran = {
  getPaginated: async (params: GetAttendanceParams): Promise<any> => {
    const query = {
      filter: params.filter,
      page: params.page,
      limit: params.limit,

      ...(params.kelasId !== undefined && {
        kelasId: params.kelasId,
      }),

      ...(params.sekolahId !== undefined && {
        sekolahId: params.sekolahId,
      }),

      ...(params.startDate && {
        startDate: params.startDate,
      }),

      ...(params.endDate && {
        endDate: params.endDate,
      }),

      ...(params.tanggal && {
        tanggal: params.tanggal,
      }),

      ...(params.sortBy && {
        sortBy: params.sortBy,
      }),

      ...(params.sortDir && {
        sortDir: params.sortDir,
      }),

      ...(params.search && {
        search: params.search,
      }),
    };

    const url = withQuery(
      `${API_CONFIG.baseUrl}${SERVICE_ENDPOINTS.attendances.listMataPelajaran}`,
      query,
    );

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();

    return json;
  },
};

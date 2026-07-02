import {
  BaseDataTable,
  useAlert,
  useDataTableController,
  useVokadialog,
  Vokadialog,
} from "@/features/_global";
import { useRef, useState, useEffect, useMemo } from "react";
import {
  classroomColumns,
  classroomDataFallback,
  classroomScheduleColumns,
  useClassroom,
} from "@/features/classroom";
import { useProfile } from "@/features/profile";
import { useClassroomPaginated } from "@/features/classroom/hooks/use-classroom-paginated";
import { lang, Button } from "@/core/libs";
import { useCourse } from "@/features/course";
import { useBiodataGuru } from "@/features/user";
import { useScheduleCreation, useSchedules } from "../hooks";

import * as XLSX from "xlsx";
import { teacherService } from "@/core/services/teacher";
import { QrAttendanceDialog } from "../components/QrAttendanceDialog";
import { AddScheduleDialog } from "../components/AddScheduleDialog";
import { EditScheduleDialog } from "../components/EditScheduleDialog";
import { DayFilterDialog } from "../components/DayFilterDialog";
import { UploadScheduleDialog } from "../components/UploadScheduleDialog";
import { useSchedulesPagination } from "../hooks/useSchedulesPagination";
import { ScheduleToolbar } from "../components/SchedulerToolbar";
import { ScheduleBoard } from "../components/ScheduleBoard";
import { useMapel } from "../hooks/useMapel";
import { useQueryClient } from "@tanstack/react-query";
import { uploadExcelService } from "@/core/services/excel";

interface ScheduleItem {
  id: number;
  hari: string;
  jamMulai: string;
  jamSelesai: string;
  mataPelajaran: {
    id: number;
    namaMataPelajaran: string;
    // kelasId: number;
    kelas: { id: number; namaKelas: string } | null;
  };
  guru: { id: number; namaGuru: string };
  createdAt: string;
  updatedAt: string;
}

interface NewScheduleForm {
  mapelKelasId?: any;
  // mataPelajaranId: number;
  // kelasId: number;
  // guruId: number;
  hari: string;
  jamMulai: string;
  jamSelesai: string;
}

interface BulkSchedule {
  // namaKelas: string;
  namaMataPelajaran: string;
  // namaGuru: string;
  hari: string;
  jamMulai: string;
  jamSelesai: string;
}

const daysOrder = ["SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU"];
export interface ScheduleDetailProps {
  id?: any;
}
export function ScheduleLandingContent() {
  const profile = useProfile();
  const alert = useAlert();
  const creation = useScheduleCreation();
  const dialog = useVokadialog();
  const showRef = useRef<typeof dialog.open>();
  showRef.current = dialog.open;
  //   const [id, setId] = useState<number>(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [editScheduleId, setEditScheduleId] = useState<number>(0);
  const [searchCourse, setSearchCourse] = useState<string>("");
  const [searchTeacher, setSearchTeacher] = useState<string>("");
  const [selectedClassId, setSelectedClassId] = useState<number>(0);
  const [selectedDays, setSelectedDays] = useState<string[]>(daysOrder);
  const [isDayFilterOpen, setIsDayFilterOpen] = useState(false);
  const [selectedKelasIdForAdd, setSelectedKelasIdForAdd] = useState<number>(0);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const teacherSearchInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<NewScheduleForm>({
    mapelKelasId: null,
    hari: "",
    jamMulai: "",
    jamSelesai: "",
  });

  const {
    global,
    sorting,
    filter,
    pagination,
    onSortingChange,
    onPaginationChange,
  } = useDataTableController({
    defaultPageSize: 10,
  });

  const params = {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  };

  const {
    data: classroom,
    pagination: paginationInfo,
    isLoading,
    query,
  } = useClassroomPaginated(params);

  const isAdmin =
    profile?.user?.role === "admin" || profile?.user?.role === "superAdmin";

  const columns = useMemo(
    () =>
      classroomScheduleColumns({
        isAdmin,
        selectedClassId,
        onSelectClass: setSelectedClassId,
      }),
    [isAdmin],
  );

  const schedules = useSchedulesPagination({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    kelasId: selectedClassId || undefined,
  });

  // const courses = useCourse();
  const teachers = useBiodataGuru();
  //   const schedules = useSchedules();
  const classes = useClassroom();
  const classData = classes.data;
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const [selectedQr, setSelectedQr] = useState<{
    kelasId: number;
    mataPelajaranId: number;
    namaKelas: string;
    namaMapel: string;
  } | null>(null);

  const isRole =
    profile?.user?.role === "admin" ||
    profile?.user?.role === "superAdmin" ||
    profile?.user?.role === "siswa" ||
    profile?.user?.role === "orangTua";
  const isRoleAdmin = profile?.user?.role === "admin";
  const isRoleOrangTua = profile?.user?.role === "orangTua";

  const [qrCode, setQrCode] = useState("");

  const handleShowQr = async (item: any) => {
    try {
      // console.log("QR ITEM", item);

      const payload = {
        kelasId: item.kelasId,
        mataPelajaranId: item.mataPelajaranId,
      };

      // console.log("QR PAYLOAD", payload);

      setSelectedQr({
        kelasId: item.kelasId,
        mataPelajaranId: item.mataPelajaranId,
        namaKelas: item.kelas?.namaKelas ?? "-",
        namaMapel: item.mataPelajaran.namaMataPelajaran,
      });

      setIsQrModalOpen(true);

      const result = await teacherService.qrCodeGenerate(payload);

      // console.log("QR RESULT", result);

      setQrCode(result?.data?.qrCodeData ?? result?.collection?.qrCode ?? "");
    } catch (err: any) {
      alert.error(err?.message);
    }
  };

  const { data: mapel, isLoading: isLoadingMapel } = useMapel({
    kelasId: selectedClassId,
  });
  console.log("selectedClassId", selectedClassId);
  console.log("MAPEL DATA", mapel);

  // Memoize filtered teachers
  const filteredTeachers = useMemo(() => {
    return (
      teachers?.data?.filter((teacher: any) =>
        teacher.namaGuru.toLowerCase().includes(searchTeacher.toLowerCase()),
      ) || []
    );
  }, [teachers?.data, searchTeacher]);

  // Download Excel template
  const handleDownloadTemplate = () => {
    try {
      const link = document.createElement("a");
      link.href =
        "https://docs.google.com/spreadsheets/d/12CJnH-Xya_DquJDQjxVQBjVKZ-4JqFq6/export?format=xlsx";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      alert.success(
        lang.text("successDownloadTemplateExcel", {
          context: lang.text("scheduleMapel"),
        }),
      );
    } catch (err: any) {
      alert.error(
        lang.text("failedDownloadTemplateExcel", {
          context: lang.text("scheduleMapel"),
        }),
      );
    }
  };

  // Handle Excel file upload

  // const handleUploadExcel = async () => {
  //   if (!excelFile) {
  //     alert.error("Pilih file Excel terlebih dahulu");
  //     return;
  //   }

  //   try {
  //     const reader = new FileReader();
  //     reader.onload = async (e) => {
  //       const data = new Uint8Array(e.target?.result as ArrayBuffer);
  //       const workbook = XLSX.read(data, { type: "array", cellDates: true });
  //       // const sheet = workbook.Sheets["Schedules"];
  //       const sheetName = workbook.SheetNames[0];
  //       const sheet = workbook.Sheets[sheetName];
  //       if (!sheet) {
  //         alert.error("Sheet 'Schedules' tidak ditemukan");
  //         return;
  //       }

  //       // const jsonData: any[] = XLSX.utils.sheet_to_json(sheet);
  //       const jsonData = XLSX.utils.sheet_to_json(sheet, {
  //         range: 5, // mulai baca dari baris ke-6 sebagai header
  //       });
  //       if (jsonData.length === 0) {
  //         alert.error("File Excel kosong");
  //         return;
  //       }

  //       // Validate data
  //       const validSchedules: NewScheduleForm[] = [];
  //       const errors: string[] = [];
  //       const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  //       const validDays = daysOrder;

  //       jsonData.forEach((row: any, index: number) => {
  //         // Konversi jamMulai dan jamSelesai ke format HH:mm
  //         const formatTime = (value: any) => {
  //           if (value instanceof Date) {
  //             const hours = value.getHours().toString().padStart(2, "0");
  //             const minutes = value.getMinutes().toString().padStart(2, "0");
  //             return `${hours}:${minutes}`;
  //           }
  //           return value?.toString().trim() || "";
  //         };

  //         // const schedule: any = {
  //         //   namaKelas: row.namaKelas?.toString().trim() || "",
  //         //   namaMataPelajaran: row.namaMataPelajaran?.toString().trim() || "",
  //         //   namaGuru: row.namaGuru?.toString().trim() || "",
  //         //   hari: row.hari?.toString().trim() || "",
  //         //   jamMulai: formatTime(row.jamMulai),
  //         //   jamSelesai: formatTime(row.jamSelesai),
  //         // };

  //         console.log("ROW:", row);

  //         const schedule: any = {
  //           namaKelas: row["Kelas"]?.toString().trim() || "",
  //           namaMataPelajaran: row["Mata Pelajaran"]?.toString().trim() || "",
  //           namaGuru: row["Guru"]?.toString().trim() || "",
  //           hari: row["Hari"]?.toString().trim() || "",
  //           jamMulai: formatTime(row["Jam Mulai"]),
  //           jamSelesai: formatTime(row["Jam Selesai"]),
  //         };

  //         console.log("schedule saat ini:", schedule);

  //         // // Validate required fields, excluding "Catatan"
  //         // if (
  //         //   !schedule.namaKelas ||
  //         //   !schedule.namaMataPelajaran ||
  //         //   !schedule.namaGuru ||
  //         //   !schedule.hari ||
  //         //   !schedule.jamMulai ||
  //         //   !schedule.jamSelesai
  //         // ) {
  //         //   errors.push(
  //         //     `Baris ${index + 2}: Semua kolom wajib diisi (kecuali Catatan). Data: ${JSON.stringify(schedule)}`,
  //         //   );
  //         //   return;
  //         // }

  //         // // Validate namaKelas
  //         // const kelas = classData.find(
  //         //   (k: any) =>
  //         //     k.namaKelas.toLowerCase() === schedule.namaKelas.toLowerCase(),
  //         // );
  //         // if (!kelas) {
  //         //   errors.push(
  //         //     `Baris ${index + 2}: Nama kelas '${schedule.namaKelas}' tidak valid`,
  //         //   );
  //         //   return;
  //         // }

  //         // // Validate namaMataPelajaran and kelas match
  //         // const course = courses.data?.find(
  //         //   (c: any) =>
  //         //     c.namaMataPelajaran.toLowerCase() ===
  //         //       schedule.namaMataPelajaran.toLowerCase() &&
  //         //     c.kelasId === kelas.id,
  //         // );
  //         // if (!course) {
  //         //   errors.push(
  //         //     `Baris ${index + 2}: Mata pelajaran '${schedule.namaMataPelajaran}' tidak valid atau tidak sesuai dengan kelas '${schedule.namaKelas}'`,
  //         //   );
  //         //   return;
  //         // }

  //         // // Validate namaGuru
  //         // const teacher = teachers.data?.find(
  //         //   (t: any) =>
  //         //     t.namaGuru.toLowerCase() === schedule.namaGuru.toLowerCase(),
  //         // );
  //         // if (!teacher) {
  //         //   errors.push(
  //         //     `Baris ${index + 2}: Nama guru '${schedule.namaGuru}' tidak valid`,
  //         //   );
  //         //   return;
  //         // }

  //         // // Validate hari
  //         // if (!validDays.includes(schedule.hari.toUpperCase())) {
  //         //   errors.push(
  //         //     `Baris ${index + 2}: Hari tidak valid (gunakan: ${validDays.join(", ")})`,
  //         //   );
  //         //   return;
  //         // }

  //         // // Validate time format
  //         // if (
  //         //   !timeRegex.test(schedule.jamMulai) ||
  //         //   !timeRegex.test(schedule.jamSelesai)
  //         // ) {
  //         //   errors.push(
  //         //     `Baris ${index + 2}: Format waktu harus HH:mm (contoh: 08:00). Data: ${schedule.jamMulai}, ${schedule.jamSelesai}`,
  //         //   );
  //         //   return;
  //         // }

  //         // // Validate jamSelesai > jamMulai
  //         // const startTime = new Date(`1970-01-01T${schedule.jamMulai}:00`);
  //         // const endTime = new Date(`1970-01-01T${schedule.jamSelesai}:00`);
  //         // if (endTime <= startTime) {
  //         //   errors.push(
  //         //     `Baris ${index + 2}: Jam selesai harus setelah jam mulai`,
  //         //   );
  //         //   return;
  //         // }

  //         // Add to valid schedules
  //         // const kelas = classData.find(
  //         //   (k: any) =>
  //         //     k.namaKelas.trim().toLowerCase() ===
  //         //     schedule.namaKelas.trim().toLowerCase(),
  //         // );

  //         // const course = courses.data?.find(
  //         //   (c: any) =>
  //         //     c.namaMataPelajaran.trim().toLowerCase() ===
  //         //     schedule.namaMataPelajaran.trim().toLowerCase(),
  //         // );

  //         // const teacher = teachers.data?.find(
  //         //   (t: any) =>
  //         //     t.namaGuru.trim().toLowerCase() ===
  //         //     schedule.namaGuru.trim().toLowerCase(),
  //         // );

  //         // const mapelKelas = courses.data?.find(
  //         //   (c: any) =>
  //         //     c.namaMataPelajaran.trim().toLowerCase() ===
  //         //     schedule.namaMataPelajaran.trim().toLowerCase(),
  //         // );

  //         // console.log("Mapel Kelas:", mapelKelas.id);

  //         validSchedules.push({
  //           mapelKelasId: Number(8) || null,
  //           hari: schedule.hari.toUpperCase(),
  //           jamMulai: schedule.jamMulai,
  //           jamSelesai: schedule.jamSelesai,
  //         });
  //       });

  //       if (errors.length > 0) {
  //         alert.error(`Validasi gagal:\n${errors.join("\n")}`);
  //         return;
  //       }

  //       if (validSchedules.length === 0) {
  //         alert.error("Tidak ada data valid untuk diunggah");
  //         return;
  //       }

  //       // Kirim data ke API secara bertahap
  //       let successCount = 0;
  //       let errorCount = 0;

  //       for (const item of validSchedules) {
  //         try {
  //           await creation.create(item);
  //           successCount++;
  //         } catch (err: any) {
  //           console.error(`Gagal mengirim: ${item.mataPelajaranId}`, err);
  //           errorCount++;
  //         }
  //       }

  //       setIsUploadModalOpen(false);
  //       setExcelFile(null);

  //       if (successCount > 0) {
  //         alert.success(
  //           lang.text("successful", {
  //             context: `Membuat ( ${successCount} jadwal) dan gagal( ${errorCount} jadwal)`,
  //           }),
  //         );
  //         schedules.query.refetch();
  //       }

  //       if (errorCount > 0) {
  //         alert.error(
  //           lang.text("failed", {
  //             context: `Membuat (${successCount} jadwal) dan gagal (${errorCount} jadwal)`,
  //           }),
  //         );
  //       }
  //     };
  //     reader.readAsArrayBuffer(excelFile);
  //   } catch (err: any) {
  //     alert.error(
  //       "Gagal memproses file Excel: " + (err.message || "Unknown error"),
  //     );
  //   }
  // };

  const handleUploadExcel = async () => {
    if (!excelFile) {
      alert.error(lang.text("selectExcelFirst"));
      return;
    }

    try {
      const formData = new FormData();

      formData.append("file", excelFile);
      formData.append("type", "jadwal");

      await uploadExcelService.importExcel(formData);

      alert.success(
        lang.text("successImportData", {
          context: lang.text("scheduleMapel"),
        }),
      );

      await queryClient.invalidateQueries({
        queryKey: ["schedules"],
      });

      setExcelFile(null);
      setIsUploadModalOpen(false);
    } catch (err: any) {
      alert.error(
        err?.message ??
          lang.text("failedImportData", {
            context: lang.text("scheduleMapel"),
          }),
      );
    }
  };

  // Restore focus to course search input
  useEffect(() => {
    if (
      searchInputRef.current &&
      document.activeElement !== searchInputRef.current
    ) {
      searchInputRef.current.focus();
    }
  }, [searchCourse]);

  // Restore focus to teacher search input
  useEffect(() => {
    if (
      teacherSearchInputRef.current &&
      document.activeElement !== teacherSearchInputRef.current
    ) {
      teacherSearchInputRef.current.focus();
    }
  }, [searchTeacher]);

  // Handle keydown to prevent focus shift
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["ArrowDown", "ArrowUp", "Enter"].includes(e.key)) {
      e.preventDefault();
    }
  };

  // Handle day checkbox toggle
  const handleDayToggle = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  // Handle "All Days" checkbox toggle
  const handleAllDaysToggle = () => {
    setSelectedDays((prev) =>
      prev.length === daysOrder.length ? [] : [...daysOrder],
    );
  };

  const queryClient = useQueryClient();

  const handleConfirmDelete = async () => {
    if (selectedScheduleId === 0) {
      alert.error("Anda perlu ID");
      return;
    }
    try {
      await creation.delete(selectedScheduleId as number);
      await queryClient.invalidateQueries({
        queryKey: ["schedules"],
      });
      alert.success(
        lang.text("successful", {
          context: lang.text("dataSuccessDelete", {
            context: lang.text("scheduleMapel"),
          }),
        }),
      );
      // schedules.query.refetch();

      dialog.close();
    } catch (err: any) {
      // alert.error("Error deleting schedule:", err);
      alert.error(
        err?.message ||
          lang.text("failed", {
            context: lang.text("dataFailDelete", {
              context: lang.text("scheduleMapel"),
            }),
          }),
      );
    }
  };

  const handleAddSchedule = async () => {
    if (
      !formData.mapelKelasId ||
      !formData.hari ||
      !formData.jamMulai ||
      !formData.jamSelesai
    ) {
      alert.error("Semua field harus diisi");
      return;
    }

    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (
      !timeRegex.test(formData.jamMulai) ||
      !timeRegex.test(formData.jamSelesai)
    ) {
      alert.error("Format waktu harus HH:mm (contoh: 08:40)");
      return;
    }

    const startTime = new Date(`1970-01-01T${formData.jamMulai}:00`);
    const endTime = new Date(`1970-01-01T${formData.jamSelesai}:00`);
    if (endTime <= startTime) {
      alert.error("Jam selesai harus setelah jam mulai");
      return;
    }

    const payload = {
      ...formData,
    };
    try {
      await creation.create(payload);
      alert.success(
        lang.text("successful", {
          context: lang.text("scheduleSuccessCreate", { context: "" }),
        }),
      );
      schedules.query.refetch();
      setIsAddModalOpen(false);
      setFormData({
        mapelKelasId: 0,
        hari: "",
        jamMulai: "",
        jamSelesai: "",
      });
      setSearchCourse("");
      setSearchTeacher("");
      setSelectedKelasIdForAdd(0);
    } catch (err: any) {
      alert.error(
        err?.message ||
          lang.text("failed", {
            context: lang.text("scheduleFailCreate", { context: "" }),
          }),
      );
    }
  };

  const handleEditSchedule = async () => {
    if (
      !formData.mapelKelasId ||
      !formData.hari ||
      !formData.jamMulai ||
      !formData.jamSelesai
    ) {
      alert.error("Semua field harus diisi");
      return;
    }

    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (
      !timeRegex.test(formData.jamMulai) ||
      !timeRegex.test(formData.jamSelesai)
    ) {
      alert.error("Format waktu harus HH:mm (contoh: 08:40)");
      return;
    }

    const startTime = new Date(`1970-01-01T${formData.jamMulai}:00`);
    const endTime = new Date(`1970-01-01T${formData.jamSelesai}:00`);
    if (endTime <= startTime) {
      alert.error("Jam selesai harus setelah jam mulai");
      return;
    }

    const payload = { ...formData };
    try {
      await creation.update(editScheduleId, payload);
      alert.success(
        lang.text("successful", {
          context: lang.text("scheduleSuccessUpdate", { context: "" }),
        }),
      );
      schedules.query.refetch();
      setIsEditModalOpen(false);
      setFormData({
        mapelKelasId: 0,
        hari: "",
        // kelasId: 0,
        jamMulai: "",
        jamSelesai: "",
      });
      setSearchCourse("");
      setSearchTeacher("");
    } catch (err: any) {
      alert.error(
        err?.message ||
          lang.text("failed", {
            context: lang.text("scheduleFailUpdate", { context: "" }),
          }),
      );
    }
  };

  const openAddModal = () => {
    setSelectedDay("");
    setFormData({
      mapelKelasId: 0,
      hari: "",
      // kelasId: 0,
      jamMulai: "",
      jamSelesai: "",
    });
    setSearchCourse("");
    setSearchTeacher("");
    setSelectedKelasIdForAdd(0);
    setIsAddModalOpen(true);
  };

  const openEditModal = (day: string, schedule: ScheduleItem) => {
    setSelectedDay(day);
    setEditScheduleId(schedule.id);
    setFormData({
      mapelKelasId: schedule.mapelKelasId || 0,
      hari: day,
      // kelasId: schedule.mataPelajaran.kelasId || 0,
      jamMulai: schedule.jamMulai,
      jamSelesai: schedule.jamSelesai,
    });
    setSearchCourse("");
    setSearchTeacher("");
    setIsEditModalOpen(true);
  };

  const initialFormData = {
    // mataPelajaranId: 0,
    // guruId: 0,
    mapelKelasId: 0,
    hari: "",
    // kelasId: 0,
    jamMulai: "",
    jamSelesai: "",
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setSelectedKelasIdForAdd(0);
  };

  // Render loading state
  // if (!schedules?.data || schedules.isLoading) {
  //   return (
  //     <div className="w-full h-[400px] border-dashed border-black/10 rounded-md flex items-center justify-center text-center">
  //       <p className="text-center">{lang.text("loadingScheduleMapel")}</p>
  //     </div>
  //   );
  // }

  const isRoleSiswa = profile?.user?.role === "siswa";
  const isRoleGuru = profile?.user?.role === "guru";

  const groupedByDay = useMemo(() => {
    const result: Record<string, ScheduleItem[]> = {};

    daysOrder.forEach((day) => {
      result[day] = schedules.data?.[day] ?? [];
    });

    return result;
  }, [schedules.data]);

  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(
    null,
  );

  const handleDelete = (id: any) => {
    setSelectedScheduleId(id);
    showRef.current?.();
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      <Vokadialog
        visible={dialog.visible}
        onOpenChange={(open) => {
          if (!open) dialog.close();
        }}
        title={"Konfirmasi Hapus"}
        content={lang.text("deleteConfirmationDesc", { context: "tersebut" })}
        footer={
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <Button onClick={dialog.close} variant="outline">
              {lang.text("cancel")}
            </Button>
            <Button onClick={handleConfirmDelete} variant="destructive">
              {lang.text("delete")}
            </Button>
          </div>
        }
      />
      <div className="col-span-12 xl:col-span-4">
        <BaseDataTable
          columns={columns}
          data={classroom}
          dataFallback={classroomDataFallback}
          globalSearch
          showFilterButton
          searchParamPagination
          searchPlaceholder={lang.text("search")}
          isLoading={isLoading}
          manualPagination
          rowCount={paginationInfo?.total ?? 0}
          pagination={pagination}
          onPaginationChange={onPaginationChange}
          onSelectionChange={(row: any) => {
            setSelectedClassId(row?.id ?? 0);
          }}
        />
      </div>
      <div className="col-span-12 xl:col-span-8">
        <ScheduleToolbar
          isRoleAdmin={isRoleAdmin}
          isRoleSiswa={isRoleSiswa}
          isRoleOrangTua={isRoleOrangTua}
          isRoleGuru={isRoleGuru}
          classData={classData}
          selectedClassId={selectedClassId}
          setSelectedClassId={setSelectedClassId}
          selectedDays={selectedDays}
          daysOrder={daysOrder}
          openAddModal={openAddModal}
          handleDownloadTemplate={handleDownloadTemplate}
          setIsUploadModalOpen={setIsUploadModalOpen}
          setIsDayFilterOpen={setIsDayFilterOpen}
        />
        <ScheduleBoard
          groupedByDay={groupedByDay}
          selectedDays={selectedDays}
          daysOrder={daysOrder}
          selectedClassId={selectedClassId}
          classroom={classroom}
          isRole={isRole}
          isRoleGuru={isRoleGuru}
          isRoleSiswa={isRoleSiswa}
          showRef={showRef}
          handleShowQr={handleShowQr}
          openEditModal={openEditModal || undefined}
          handleDelete={handleDelete}
        />
      </div>

      <QrAttendanceDialog
        open={isQrModalOpen}
        onOpenChange={setIsQrModalOpen}
        qrCode={qrCode}
        selectedQr={selectedQr}
      />

      <AddScheduleDialog
        open={isAddModalOpen}
        onOpenChange={(open) => {
          setIsAddModalOpen(open);

          if (!open) {
            resetForm();
          }
        }}
        classData={classData}
        daysOrder={daysOrder}
        selectedKelasIdForAdd={selectedKelasIdForAdd}
        setSelectedKelasIdForAdd={setSelectedKelasIdForAdd}
        formData={formData}
        setFormData={setFormData}
        searchCourse={searchCourse}
        setSearchCourse={setSearchCourse}
        searchTeacher={searchTeacher}
        setSearchTeacher={setSearchTeacher}
        filteredCourses={mapel}
        filteredTeachers={filteredTeachers}
        searchInputRef={searchInputRef}
        teacherSearchInputRef={teacherSearchInputRef}
        handleSearchKeyDown={handleSearchKeyDown}
        handleAddSchedule={handleAddSchedule}
        resetForm={resetForm}
      />

      <EditScheduleDialog
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        selectedDay={selectedDay}
        formData={formData}
        setFormData={setFormData}
        filteredCourses={mapel}
        filteredTeachers={filteredTeachers}
        searchCourse={searchCourse}
        setSearchCourse={setSearchCourse}
        searchTeacher={searchTeacher}
        setSearchTeacher={setSearchTeacher}
        searchInputRef={searchInputRef}
        teacherSearchInputRef={teacherSearchInputRef}
        handleSearchKeyDown={handleSearchKeyDown}
        handleEditSchedule={handleEditSchedule}
      />

      <DayFilterDialog
        open={isDayFilterOpen}
        onOpenChange={setIsDayFilterOpen}
        daysOrder={daysOrder}
        selectedDays={selectedDays}
        handleAllDaysToggle={handleAllDaysToggle}
        handleDayToggle={handleDayToggle}
      />

      <UploadScheduleDialog
        open={isUploadModalOpen}
        onOpenChange={(open) => {
          setIsUploadModalOpen(open);

          if (!open) {
            setExcelFile(null);
          }
        }}
        setExcelFile={setExcelFile}
        handleUploadExcel={handleUploadExcel}
      />
    </div>
  );
}

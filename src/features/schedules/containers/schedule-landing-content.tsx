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
import { useBiodataGuru } from "@/features/user";
import { useScheduleCreation, useSchedules } from "../hooks";
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
      const payload = {
        kelasId: item.kelasId,
        mataPelajaranId: item.mataPelajaranId,
      };

      setSelectedQr({
        kelasId: item.kelasId,
        mataPelajaranId: item.mataPelajaranId,
        namaKelas: item.kelas?.namaKelas ?? "-",
        namaMapel: item.mataPelajaran.namaMataPelajaran,
      });

      setIsQrModalOpen(true);

      const result = await teacherService.qrCodeGenerate(payload);

      setQrCode(result?.data?.qrCodeData ?? result?.collection?.qrCode ?? "");
    } catch (err: any) {
      alert.error(err?.message);
    }
  };

  const { data: mapel, isLoading: isLoadingMapel } = useMapel({
    kelasId: selectedClassId,
  });

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
          enableRowSelection
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

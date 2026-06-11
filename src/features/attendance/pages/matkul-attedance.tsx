import { APP_CONFIG } from "@/core/configs";
import {
  Badge,
  Button,
  Input,
  Label,
  lang,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/libs";
import { getStaticFile } from "@/core/utils";
import {
  DashboardPageLayout,
  useDataTableController,
} from "@/features/_global";
import { useClassroom } from "@/features/classroom";
import { useCourse } from "@/features/course";
import { useProfile } from "@/features/profile";
import { useSchoolDetail } from "@/features/schools";
import { useBiodata } from "@/features/user/hooks";
import {
  Document,
  Image,
  Page,
  pdf,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { motion } from "framer-motion";
import Papa from "papaparse";
import { useEffect, useMemo, useState } from "react";
import { FaFile } from "react-icons/fa";
import * as XLSX from "xlsx";
import { MatpelAttendanceTable } from "../containers/matpelAttedance";
import { useMapelAttedance } from "../hooks/useMapelAttedance";
import { attendanceService } from "@/core/services/pagination";
import { Divider, IconButton } from "@mui/material";
import { XIcon } from "lucide-react";
import { useDebounce } from "../hooks/useDebounce";
import AttendanceMapelFilter from "../components/AttendanceMapelFilter";

// Konfigurasi dayjs untuk timezone
dayjs.extend(utc);
dayjs.extend(timezone);

export const MatkulAttendance = () => {
  const [selectedClasses, setSelectedClasses] = useState<string>("all");
  const [searchStudentName, setSearchStudentName] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [selectedDateRange, setSelectedDateRange] = useState<string>("year");
  const [selectedPeriod, setSelectedPeriod] = useState("daily");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listClassRoom, setListClassRoom] = useState<any[]>([]);

  const resource = useCourse();
  const biodata = useBiodata();
  if (typeof biodata.data === "string") {
    biodata.data = JSON.parse(biodata.data);
  }

  const classRoom = useClassroom();
  const profile = useProfile();
  const school = useSchoolDetail({ id: profile?.user?.sekolahId || "" });

  useEffect(() => {
    localStorage.setItem("attendanceTarget", "students");
  }, []);

  useMemo(() => {
    setListClassRoom(classRoom?.data || []);
  }, [classRoom.data]);

  const courseOptions = useMemo(() => {
    return Array.from(
      new Set(resource.data?.map((course) => course.namaMataPelajaran) || []),
    );
  }, [resource.data]);
  const [filters, setFilter] = useState<
    "harian" | "mingguan" | "bulanan" | "tahunan"
  >("harian");

  const {
    global,
    sorting,
    filter,
    pagination,
    onSortingChange,
    onPaginationChange,
  } = useDataTableController({ defaultPageSize: 10 });

  const debouncedSearchStudentName = useDebounce(searchStudentName, 500);

  const attendanceParams = {
    filter: filters,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    kelasId: selectedClasses !== "all" ? selectedClasses : undefined,
    search: debouncedSearchStudentName || undefined,
  };

  const {
    data: mapelData,
    isLoading,
    isFetching,
    refetch,
  } = useMapelAttedance(attendanceParams);

  const filteredData = mapelData?.data || [];

  const handleExportExcel = async (params: any) => {
    const blob = await attendanceService.exportExcelMapel(params);

    const fileUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "attendance.xlsx";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(fileUrl);
  };
  const handleExportPdf = async (params: any) => {
    const blob = await attendanceService.exportPdfMapel(params);

    const fileUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "attendance.pdf";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(fileUrl);
  };

  const handleExport = async (type: "csv" | "excel" | "pdf") => {
    const params = {
      ...attendanceParams,

      ...(selectedClasses !== "all" && {
        kelasId: Number(selectedClasses),
      }),

      // ...(selectedStartMonth && {
      //   startMonth: selectedStartMonth,
      // }),

      // ...(selectedEndMonth && {
      //   endMonth: selectedEndMonth,
      // }),
    };

    console.log("selected classes", selectedClasses);

    if (type === "excel") {
      handleExportExcel(params);
      return;
    }

    if (type === "pdf") {
      // await attendanceService.exportPdf(params);
      handleExportPdf(params);
      return;
    }
  };

  const resetFilters = () => {
    setSearchStudentName("");
    setSelectedClasses("all");
    setSelectedCourse("all");
    setSelectedDateRange("year");
    setSelectedStatus("all");
  };

  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("coursePresences")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[{ label: lang.text("coursePresences"), url: "/students" }]}
      title={lang.text("coursePresences")}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Filters */}
        <AttendanceMapelFilter
          searchStudentName={searchStudentName}
          setSearchStudentName={setSearchStudentName}
          selectedClasses={selectedClasses}
          setSelectedClasses={setSelectedClasses}
          selectedCourse={selectedCourse}
          setSelectedCourse={setSelectedCourse}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          filters={filters}
          setFilter={setFilter}
          listClassRoom={listClassRoom}
          courseOptions={courseOptions}
          resetFilters={resetFilters}
        />

        {/* Table */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {selectedDateRange === "today"
                ? "Kehadiran Hari Ini (18 Mei 2026)"
                : selectedDateRange === "month"
                  ? "Kehadiran Bulan Mei 2026"
                  : "Kehadiran Tahun 2026"}
            </h3>
            <div className="flex gap-4">
              <Button
                variant="destructive"
                color="destructive"
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 rounded-lg transition duration-300"
              >
                {lang.text("export")} Data <FaFile />
              </Button>
            </div>
          </div>
          <MatpelAttendanceTable
            data={filteredData}
            pagination={pagination}
            onPaginationChange={onPaginationChange}
            rowCount={mapelData?.pagination?.total ?? 0}
          />
        </div>

        {/* Export Modal */}
        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="bg-background text-foreground rounded-lg p-6 w-full max-w-md shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-1 ">
                <h2 className="text-lg font-semibold mb-0">
                  Export & Filter Kelas
                </h2>
                <IconButton onClick={() => setIsModalOpen(false)}>
                  <XIcon />
                </IconButton>
              </div>
              <Divider />
              <div className="mb-4 mt-2">
                <Label
                  htmlFor="class-filter"
                  className="block text-sm font-medium mb-2"
                >
                  {lang.text("selectClassRoom")}
                </Label>
                <Select
                  value={selectedClasses}
                  onValueChange={setSelectedClasses}
                >
                  <SelectTrigger id="class-filter" className="w-full">
                    <SelectValue placeholder="Pilih Kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kelas</SelectItem>
                    {listClassRoom.map((kelas) => (
                      <SelectItem key={kelas?.id} value={kelas?.id}>
                        {kelas?.namaKelas}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-4">
                {/* <Button onClick={() => handleExport("csv")} className="w-full">
                  Export CSV
                </Button> */}
                <Button
                  onClick={() => handleExport("excel")}
                  className="w-full rounded-lg bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
                  // variant="secondary"
                >
                  Export Excel
                </Button>
                <Button
                  onClick={() => handleExport("pdf")}
                  className="w-full"
                  variant="destructive"
                >
                  Export PDF
                </Button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </DashboardPageLayout>
  );
};

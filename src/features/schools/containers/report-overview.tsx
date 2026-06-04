import { APP_CONFIG } from "@/core/configs";
import {
  Button,
  Calendar,
  dayjs,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  lang,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/core/libs";
import { Card, CardContent, CardHeader } from "@/core/libs"; // Import Card components
import { DashboardPageLayout } from "@/features/_global";
import { useBiodata } from "@/features/user";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { FaArrowDown, FaChevronDown, FaFilePdf } from "react-icons/fa";
import { ChartSemiCircle } from "../components";
import { calculateAttendanceStats } from "../utils";
import { SchoolByProvinceTable } from "./school-by-province-table";

interface ReportOverviewProps {
  selectedSchool?: string;
}

export const ReportOverview = ({ selectedSchool }: ReportOverviewProps) => {
  const [date, setDate] = useState<Date | undefined>();
  const [isStatsLoading, setIsStatsLoading] = useState<boolean>(true);
  const [selectedClass] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(
    undefined,
  );

  const biodata = useBiodata();
  const formatTime = (time?: string) => {
    return time
      ? dayjs(time).tz("Asia/Jakarta").format("DD MMM YYYY, HH:mm:ss")
      : "N/A";
  };

  // Filter data berdasarkan selectedSchool terlebih dahulu
  // const filteredBySchool = useMemo(() => {
  //   if (!biodata.data) return [];
  //   if (!selectedSchool) return biodata.data; // Jika tidak ada sekolah dipilih, tampilkan semua
  //   return biodata.data.filter(
  //     (student) => student.user?.sekolah?.namaSekolah === selectedSchool
  //   );
  // }, [biodata.data, selectedSchool]);

  const filteredBySchool = useMemo(() => {
    let parsedData: any[] = [];

    if (!biodata.data) return [];

    if (typeof biodata.data === "string") {
      try {
        const parsed = JSON.parse(biodata.data);
        parsedData = Array.isArray(parsed) ? parsed : [];
      } catch {
        parsedData = [];
      }
    } else {
      parsedData = Array.isArray(biodata.data) ? biodata.data : [];
    }

    if (!selectedSchool) return parsedData;

    return parsedData.filter(
      (student) => student.user?.sekolah?.namaSekolah === selectedSchool,
    );
  }, [biodata.data, selectedSchool]);

  // Filter data berdasarkan tanggal dari kalender dan kelas
  const filteredData = useMemo(() => {
    return (
      filteredBySchool
        .flatMap((student) =>
          student.absensis
            ?.filter((attendance: any) => {
              const attendanceDate = dayjs(attendance.jamMasuk).tz(
                "Asia/Jakarta",
              );
              if (!date) {
                // Jika date undefined, filter untuk bulan saat ini
                return attendanceDate.isBetween(
                  dayjs().tz("Asia/Jakarta").startOf("month"),
                  dayjs().tz("Asia/Jakarta").endOf("month"),
                  null,
                  "[]",
                );
              }
              // Jika date diatur, filter untuk tanggal spesifik
              return attendanceDate.isSame(
                dayjs(date).tz("Asia/Jakarta"),
                "day",
              );
            })
            .map((attendance: any) => ({
              ...student,
              attendance: {
                ...attendance,
                jamMasuk: formatTime(attendance.jamMasuk),
                jamPulang: formatTime(attendance.jamPulang),
              },
            })),
        )
        .filter((student) =>
          selectedClass ? student.kelas?.namaKelas === selectedClass : true,
        ) || []
    );
  }, [filteredBySchool, date, selectedClass]);

  // Hitung statistik kehadiran
  const attendanceStats = useMemo(() => {
    const stats = calculateAttendanceStats(filteredData);
    // console.log('stats here:', stats);
    if (
      stats.totalHadir !== 0 ||
      stats.totalAlpa !== 0 ||
      stats.totalSakit !== 0
    ) {
      setIsStatsLoading(false);
    } else {
      setIsStatsLoading(true);
    }
    return stats;
  }, [filteredData]);

  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("schoolDistribution")} | ${APP_CONFIG.appName}`}
      title={lang.text("ReportOverview") + "📋"}
    >
      <div className="w-full flex items-center justify-between flex-wrap">
        <div className="flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-max justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? (
                  format(date, "PPP")
                ) : (
                  <span>{lang.text("selectDate")}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {date && (
            <Button variant="outline" onClick={() => setDate(undefined)}>
              {lang.text("reset")}
            </Button>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => document.getElementById("export-table")?.click()}
            className="flex items-center gap-2"
          >
            <FaFilePdf className="text-red-500" /> {lang.text("export")}{" "}
            <FaArrowDown />
          </Button>
        </div>
      </div>

      <div className="mt-6 w-full flex gap-8 flex-wrap">
        {/* Left - Table */}
        <Card className="w-full lg:w-[calc(50%-1rem)] bg-theme-color-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <h3 className="text-lg font-semibold">{lang.text("schoolData")}</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  {selectedStatus || lang.text("selectStatus")}{" "}
                  <FaChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSelectedStatus("Aktif")}>
                  {lang.text("active")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedStatus("Tidak Aktif")}
                >
                  {lang.text("inactive")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus(undefined)}>
                  {lang.text("allStatus")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            <SchoolByProvinceTable status={selectedStatus} />
          </CardContent>
        </Card>

        {/* Right - Chart */}
        <Card className="w-full lg:w-[calc(50%-1rem)] bg-theme-color-primary/5">
          <CardContent className="pt-6 flex flex-col items-center justify-center">
            <ChartSemiCircle
              stats={attendanceStats}
              isLoading={isStatsLoading}
            />
            <div className="w-full mt-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-[#CC39FC]"></div>
                  <p className="text-muted-foreground">
                    {lang.text("incomingAbsenceData")}
                  </p>
                </div>
                <p className="text-2xl text-foreground">
                  {attendanceStats.totalHadir}
                </p>
              </div>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-[#0039F7]"></div>
                  <p className="text-muted-foreground">
                    {lang.text("AbsenteeDataAbsent")}
                  </p>
                </div>
                <p className="text-2xl text-foreground">
                  {attendanceStats.totalAlpa}
                </p>
              </div>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-[#00C3FC]"></div>
                  <p className="text-muted-foreground">
                    {lang.text("sicknessAbsenceData")}
                  </p>
                </div>
                <p className="text-2xl text-foreground">
                  {attendanceStats.totalSakit}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardPageLayout>
  );
};

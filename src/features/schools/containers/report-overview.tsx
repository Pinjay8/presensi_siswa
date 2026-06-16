import { APP_CONFIG } from "@/core/configs";
import {
  Button,
  CardTitle,
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
import { Box, Typography } from "@mui/material";

interface ReportOverviewProps {
  selectedSchool?: string;
  stats: any;
  isLoading: boolean;
  changes?: any;
}

export const ReportOverview = ({
  selectedSchool,
  stats,
  isLoading,
  changes,
}: ReportOverviewProps) => {
  const [date, setDate] = useState<Date | undefined>();
  const [isStatsLoading, setIsStatsLoading] = useState<boolean>(true);
  const [selectedClass] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(
    undefined,
  );

  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("schoolDistribution")} | ${APP_CONFIG.appName}`}
      title={""}
    >
      {/* <div className="w-full flex items-center justify-between flex-wrap">
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
      </div> */}

      {/* <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            {selectedStatus || lang.text("selectDay")} <FaChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Hari</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setSelectedStatus("Aktif")}>
            {lang.text("active")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSelectedStatus("Tidak Aktif")}>
            {lang.text("inactive")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSelectedStatus(undefined)}>
            {lang.text("allStatus")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu> */}

      <Card className="p-6">
        <Box>
          <Box className="flex items-center justify-between">
            <Typography variant="h6" className="mb-0 bold">
              {lang.text("ReportOverview")}
            </Typography>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  {selectedStatus || lang.text("selectDay")} <FaChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {/* <DropdownMenuLabel>Hari</DropdownMenuLabel> */}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSelectedStatus("Aktif")}>
                  {lang.text("today")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSelectedStatus("month")}>
                  {lang.text("thisMonth")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus("month")}>
                  {lang.text("thisYear")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Box>
          <Box></Box>
        </Box>
        <div className="mt-3 w-full flex gap-8 flex-wrap">
          {/* Left - Table */}
          {/* <Card className="w-full lg:w-[calc(50%-1rem)] bg-theme-color-primary/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <h3 className="text-lg font-semibold">{lang.text("schoolData")}</h3>
              <h3 className="text-lg font-semibold">
                {lang.text("percentagePresent")}
              </h3>

              <h3 className="text-lg font-semibold">{lang.text("schoolData")}</h3>
            </CardHeader>
            <CardContent>
              <SchoolByProvinceTable status={selectedStatus} />
            </CardContent>
          </Card> */}

          <Card className="w-full lg:w-[calc(50%-1rem)] bg-theme-color-primary/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <span className="inline-flex items-center rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-white">
                  {lang.text("percentagePresent")}
                </span>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-6">
                {/* Persentase Utama */}
                <div>
                  <div className="text-5xl font-bold text-emerald-500">
                    {changes.hadir.percentage}%
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Kehadiran Hari Ini
                  </p>
                </div>

                {/* Detail */}
                <div className="space-y-6 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-emerald-500" />
                      <span>{lang.text("present")}</span>
                    </div>

                    <span className="font-medium">
                      {stats.totalHadir} ({changes.hadir.percentage}%)
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-amber-400" />
                      <span> {lang.text("permit")}</span>
                    </div>

                    <span className="font-medium">
                      {stats.totalDispensasi} ({changes.dispensasi.percentage}%)
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-sky-500" />
                      <span> {lang.text("sickness")}</span>
                    </div>

                    <span className="font-medium">
                      {stats.totalSakit} ({changes.sakit.percentage}%)
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500" />
                      <span> {lang.text("alfa")}</span>
                    </div>

                    <span className="font-medium">
                      {stats.totalAlpa} ({changes.alpa.percentage}%)
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-slate-500" />
                      <span>Belum Absen</span>
                    </div>

                    <span className="font-medium">
                      {stats.totalBelumAbsen} ({changes.belumAbsen.percentage}%)
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right - Chart */}
          <Card className="w-full lg:w-[calc(50%-1rem)] bg-theme-color-primary/5">
            <CardHeader>
              <div>
                <span className="inline-flex items-center rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-white">
                  {lang.text("distributePresent")}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-0 flex flex-col  justify-center">
              <ChartSemiCircle stats={stats} isLoading={isLoading} />
              <div className="w-full mt-4 grid grid-cols-2 gap-2">
                <div className="mb-2 flex items-center justify-start gap-2">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-[#22C55E]"></div>
                    <p className="text-muted-foreground text-md">
                      {lang.text("present")}
                    </p>
                  </div>
                  {/* <p className="text-md text-foreground">{stats.totalHadir}</p> */}
                </div>
                <div className="mb-2 flex items-center justify-start gap-2">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-[#EF4444]"></div>
                    <p className="text-muted-foreground text-mds">
                      {lang.text("alfa")}
                    </p>
                  </div>
                  {/* <p className="text-md text-foreground">{stats.totalAlpa}</p> */}
                </div>
                <div className="mb-2 flex items-center justify-start gap-2">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-[#0EA5E9]"></div>
                    <p className="text-muted-foreground text-sm">
                      {lang.text("sickness")}
                    </p>
                  </div>
                  {/* <p className="text-md text-foreground">{stats.totalSakit}</p> */}
                </div>
                {/* izin */}
                <div className="mb-2 flex items-center justify-start gap-2">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-[#FBBF24]"></div>
                    <p className="text-muted-foreground">
                      {lang.text("permit")}
                    </p>
                  </div>
                  {/* <p className="text-md text-foreground">
                  {stats.totalDispensasi}
                </p> */}
                </div>
                {/* terlambat */}
                <div className="mb-2 flex items-center justify-start gap-2">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-[#64748B]"></div>
                    <p className="text-muted-foreground">
                      {lang.text("AttendanceNotRecorded")}
                    </p>
                  </div>
                  {/* <p className="text-md text-foreground">
                  {stats.totalTerlambat}
                </p> */}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Card>
    </DashboardPageLayout>
  );
};

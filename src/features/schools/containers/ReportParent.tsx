import { APP_CONFIG } from "@/core/configs";
import {
  lang,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollArea,
} from "@/core/libs";
import { Card, CardContent, CardHeader } from "@/core/libs"; // Import Card components
import { DashboardPageLayout } from "@/features/_global";
import { useBiodata } from "@/features/user";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
} from "recharts";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Typography } from "@mui/material";

dayjs.extend(utc);

interface ReportOverviewProps {
  selectedSchool?: string;
  dashboard: any;
  isLoading: boolean;
  selectedStudent?: any;
}

export const ReportParent = ({
  selectedSchool,
  //   stats,
  dashboard,
  isLoading,
  selectedStudent,
}: ReportOverviewProps) => {
  const [date, setDate] = useState<Date | undefined>();
  const [isStatsLoading, setIsStatsLoading] = useState<boolean>(true);
  const [selectedClass] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(
    undefined,
  );

  const child = selectedStudent;

  const jadwalHariIni = child?.jadwalHariIni ?? [];

  const statusDispensasi = child?.statusDispensasi ?? [];

  const kehadiranMapelToday = child?.kehadiranMapelToday ?? [];

  const todayAbsen = child?.todayAbsen;

  const namaSiswa = child?.name ?? "-";

  const kelas = child?.kelas ?? "-";

  const nis = child?.nis ?? "-";

  const attendanceChart = [
    {
      status: lang.text("present"),
      jumlah: child?.bulananStats?.hadir ?? 0,
    },
    {
      status: lang.text("late"),
      jumlah: child?.bulananStats?.terlambat ?? 0,
    },
    {
      status: lang.text("permit"),
      jumlah: child?.bulananStats?.izin ?? 0,
    },
    {
      status: lang.text("sick"),
      jumlah: child?.bulananStats?.sakit ?? 0,
    },
    {
      status: lang.text("alfa"),
      jumlah: child?.bulananStats?.alfa ?? 0,
    },
  ];

  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("dashboard")} | ${APP_CONFIG.appName}`}
      title={lang.text("ReportOverview")}
    >
      <div className="mt-2 w-full flex gap-8 flex-wrap">
        <Card className="w-full lg:w-[calc(50%-1rem)] bg-theme-color-primary/5">
          <CardHeader>
            <h3 className="text-lg font-semibold">
              {lang.text("jadwalKelasHariIni")}
            </h3>
          </CardHeader>

          <CardContent>
            {jadwalHariIni.length === 0 ? (
              <div className="flex items-center justify-center min-h-[120px]">
                <p className="text-muted-foreground text-center">
                  {lang.text("notActiveAssignment")}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {jadwalHariIni.map((item: any, index: number) => (
                  <div key={index} className="rounded-lg border p-3 bg-white">
                    <p className="font-semibold">{item.mataPelajaran}</p>

                    <p className="text-sm text-muted-foreground">
                      {lang.text("teacher")}: {item.guru}
                    </p>

                    <p className="text-sm">
                      {item.jamMulai} - {item.jamSelesai}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="w-full lg:w-[calc(50%-1rem)] bg-theme-color-primary/5">
          <CardHeader>
            <h3 className="text-lg font-semibold">
              {lang.text("subjectAttendanceToday")}
            </h3>
          </CardHeader>

          <CardContent>
            {kehadiranMapelToday.length === 0 ? (
              <div className="flex items-center justify-center min-h-[120px]">
                <p className="text-muted-foreground text-center">
                  {lang.text("notActiveAssignment")}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {kehadiranMapelToday.map((item: any) => (
                  <div
                    key={item.mataPelajaranId}
                    className="rounded-lg border p-3 bg-white"
                  >
                    <p className="font-semibold">{item.namaMataPelajaran}</p>

                    <p className="text-sm text-muted-foreground">{item.guru}</p>

                    <p className="text-sm">
                      {item.jamMulai} - {item.jamSelesai}
                    </p>

                    <p className="text-sm font-medium">
                      {item.statusKehadiran}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="w-full lg:w-[calc(50%-1rem)] bg-theme-color-primary/5">
          <CardHeader>
            <h3 className="text-lg font-semibold">
              {lang.text("dispensation")}
            </h3>
          </CardHeader>

          <CardContent>
            {statusDispensasi.length === 0 ? (
              <div className="flex items-center justify-center min-h-[120px]">
                <p className="text-muted-foreground text-center">
                  {lang.text("notActiveAssignment")}
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[320px] pr-2">
                <div className="space-y-3">
                  {statusDispensasi.slice(0, 5).map((item: any) => (
                    <div
                      key={item.id}
                      className="rounded-lg border p-3 bg-white"
                    >
                      <p className="font-medium capitalize">{item.alasan}</p>

                      <p className="text-sm text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString("id-ID")}
                      </p>

                      <p className="text-sm">Status: {item.statusPengajuan}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
        <Card className="w-full lg:w-[calc(50%-1rem)] bg-theme-color-primary/5 flex flex-col">
          <CardHeader>
            <h3 className="text-lg font-semibold">
              {lang.text("attendanceSummary")}
            </h3>
          </CardHeader>

          <CardContent className="flex-1 flex items-center justify-center pb-0">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={attendanceChart}
                margin={{ top: 30, right: 20, left: 0, bottom: 5 }}
                height={300}
              >
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />

                <Bar dataKey="jumlah" fill="#05367a" radius={[6, 6, 0, 0]}>
                  {" "}
                  <LabelList dataKey="jumlah" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </DashboardPageLayout>
  );
};

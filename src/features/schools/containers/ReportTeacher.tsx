import { APP_CONFIG } from "@/core/configs";
import { lang, Popover, PopoverContent, PopoverTrigger } from "@/core/libs";
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
} from "recharts";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

interface ReportOverviewProps {
  selectedSchool?: string;
  dashboard: any;
  isLoading: boolean;
}

export const ReportTeacher = ({
  selectedSchool,
  //   stats,
  dashboard,
  isLoading,
}: ReportOverviewProps) => {
  const [date, setDate] = useState<Date | undefined>();
  const [isStatsLoading, setIsStatsLoading] = useState<boolean>(true);
  const [selectedClass] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(
    undefined,
  );

  const jadwalKelasHariIni = dashboard?.waliKelasInfo?.jadwalKelasHariIni ?? [];

  const jadwalMengajarHariIni = dashboard?.jadwalMengajarHariIni ?? [];

  const pendingDispensasi = dashboard?.pendingDispensasi ?? [];

  const topSiswaBermasalah = dashboard?.topSiswaBermasalah ?? [];
  const topSiswaTerbaik = dashboard?.topSiswaTerbaik ?? [];
  const formatJam = (value?: string) => {
    return value || "-";
  };

  const siswaBermasalahChart = topSiswaBermasalah.map((item: any) => ({
    nama: item.namaSiswa,
    alfa: item.totalAlfa,
  }));

  const siswaTerbaikChart = topSiswaTerbaik.map((item: any) => ({
    nama: item.namaSiswa,
    hadir: item.totalHadir,
  }));

  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("dashboard")} | ${APP_CONFIG.appName}`}
      title={lang.text("ReportOverview")}
    >
      <div className="mt-2 w-full flex gap-8 flex-wrap">
        <Card className="w-full lg:w-[calc(50%-1rem)]  bg-theme-color-primary/5">
          <CardHeader>
            <div>
              <span className="inline-flex items-center rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-white">
                {lang.text("jadwalKelasHariIni")}
              </span>
            </div>
          </CardHeader>

          <CardContent>
            {jadwalKelasHariIni.length === 0 ? (
              <div className="flex items-center justify-center min-h-[120px]">
                <p className="text-muted-foreground text-center">
                  {lang.text("notActiveAssignment")}
                </p>
              </div>
            ) : (
              jadwalKelasHariIni.map((item: any) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-3 mb-2 bg-white"
                >
                  <p className="font-medium">{item.mataPelajaran}</p>

                  <p className="text-sm text-muted-foreground">
                    Guru: {item.guru}
                  </p>

                  <p className="text-sm">
                    Jam : {formatJam(item.jamMulai)}
                    {" - "}
                    {formatJam(item.jamSelesai)}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
        <Card className="w-full lg:w-[calc(50%-1rem)]  bg-theme-color-primary/5">
          <CardHeader>
            <div>
              <span className="inline-flex items-center rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-white">
                {lang.text("jadwalMengajarHariIni")}
              </span>
            </div>
          </CardHeader>

          <CardContent>
            {jadwalMengajarHariIni.length === 0 ? (
              <div className="flex items-center justify-center min-h-[120px]">
                <p className="text-muted-foreground text-center">
                  {lang.text("notActiveAssignment")}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {jadwalMengajarHariIni.map((item: any) => (
                  <div key={item.id} className="rounded-lg border p-3 bg-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{item.mataPelajaran}</p>

                        <p className="text-sm text-muted-foreground">
                          {item.kelas}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-medium">
                          {item.jamMulai} - {item.jamSelesai}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="w-full lg:w-[calc(100%-1rem)]  bg-theme-color-primary/5">
          <CardHeader>
            <h3 className="text-lg font-semibold">
              {lang.text("pendingDispensasi")}
            </h3>
          </CardHeader>

          <CardContent>
            {pendingDispensasi.length === 0 ? (
              <div className="flex items-center justify-center min-h-[120px]">
                <p className="text-muted-foreground text-center">
                  {lang.text("notActiveAssignment")}
                </p>
              </div>
            ) : (
              pendingDispensasi.map((item: any) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-3 mb-2 bg-white"
                >
                  <p className="font-medium">{item.namaSiswa}</p>

                  <p className="text-sm">Alasan: {item.alasan}</p>

                  <p className="text-xs text-muted-foreground">
                    {new Date(item.createdAt).toLocaleDateString("id-ID")}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="w-full lg:w-[calc(50%-1rem)] bg-theme-color-primary/5">
          <CardHeader>
            <div>
              <span className="inline-flex items-center rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-white">
                {lang.text("topSiswaBermasalah")}
              </span>
            </div>
          </CardHeader>

          <CardContent>
            {topSiswaBermasalah.length === 0 ? (
              <div className="flex items-center justify-center min-h-[120px]">
                <p className="text-muted-foreground text-center">
                  {lang.text("notActiveAssignment")}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {topSiswaBermasalah.map((item: any) => {
                  const percentage =
                    topSiswaBermasalah[0]?.totalAlfa > 0
                      ? (item.totalAlfa / topSiswaBermasalah[0].totalAlfa) * 100
                      : 0;

                  return (
                    <div key={item.biodataSiswaId}>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{item.namaSiswa}</span>

                        <span className="text-muted-foreground">
                          {item.totalAlfa} Alfa
                        </span>
                      </div>

                      <div className="h-3 w-full rounded-full bg-slate-200">
                        <div
                          className="h-3 rounded-full bg-[red] transition-all"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="w-full lg:w-[calc(50%-1rem)] bg-theme-color-primary/5">
          <CardHeader>
            <div>
              <span className="inline-flex items-center rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-white">
                {lang.text("topSiswaTerbaik")}
              </span>
            </div>
          </CardHeader>

          <CardContent>
            {topSiswaTerbaik.length === 0 ? (
              <div className="flex items-center justify-center min-h-[120px]">
                <p className="text-muted-foreground text-center">
                  {lang.text("notActiveAssignment")}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {topSiswaTerbaik.map((item: any, index: number) => {
                  const percentage =
                    topSiswaTerbaik[0]?.totalHadir > 0
                      ? (item.totalHadir / topSiswaTerbaik[0].totalHadir) * 100
                      : 0;

                  return (
                    <div key={item.biodataSiswaId}>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{item.namaSiswa}</span>

                        <span className="text-muted-foreground">
                          {item.totalHadir} Hadir
                        </span>
                      </div>

                      <div className="h-3 w-full rounded-full bg-slate-200">
                        <div
                          className="h-3 rounded-full bg-[#22C55E] transition-all"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardPageLayout>
  );
};

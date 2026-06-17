import { APP_CONFIG } from "@/core/configs";
import { lang, Popover, PopoverContent, PopoverTrigger, ScrollArea } from "@/core/libs";
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

export const ReportStudent = ({
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

  const jadwalHariIni = dashboard?.jadwalHariIni ?? [];


  const kehadiranMapelToday = dashboard?.kehadiranMapelToday ?? [];
  const statusDispensasi = dashboard?.statusDispensasi ?? [];
  
  const peringatanKeterlambatan = dashboard?.peringatanKeterlambatan;
  const hariIniTerlambat = peringatanKeterlambatan?.hariIni;
  const riwayatTerlambat = peringatanKeterlambatan?.riwayat;
  const todayAbsen = dashboard?.todayAbsen ?? {}
  const jamMasuk = todayAbsen?.jamMasuk;
const jamPulang = todayAbsen?.jamPulang;
const statusKehadiran = todayAbsen?.statusKehadiran;


  const [expandedLates, setExpandedLates] = useState<Record<string, boolean>>({
    hariIni: true,
  });

  const toggleExpandLate = (id: string) => {
    setExpandedLates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const itemsToRender = useMemo(() => {
    const list = [];
    if (hariIniTerlambat && hariIniTerlambat.isTerlambat) {
      list.push({
        id: "hariIni",
        isHariIni: true,
        tanggal: new Date().toISOString(),
        batasMasuk: hariIniTerlambat.batasMasuk,
        jamMasuk: hariIniTerlambat.jamMasuk,
        selisihMenit: hariIniTerlambat.selisihMenit,
        keterangan: hariIniTerlambat.keterangan,
      });
    }
    const riwayat = riwayatTerlambat ?? [];
    riwayat.forEach((item: any, idx: number) => {
      list.push({
        id: `riwayat-${idx}`,
        isHariIni: false,
        tanggal: item.tanggal,
        batasMasuk: item.batasMasuk,
        jamMasuk: item.jamMasuk,
        selisihMenit: item.selisihMenit,
        keterangan: item.keterangan,
      });
    });
    return list;
  }, [hariIniTerlambat, riwayatTerlambat]);

  console.log("dashboard", dashboard);

          const statusConfig: Record<string, { label: string; className: string }> = {
          hadir: {
            label: "Hadir",
            className: "bg-green-100 text-green-700 border border-green-200",
          },
          izin: {
            label: "Izin",
            className: "bg-yellow-100 text-yellow-700 border border-yellow-200",
          },
          alfa: {
            label: "Alfa",
            className: "bg-red-100 text-red-700 border border-red-200",
          },
          "belum hadir": {
            label: "Belum Hadir",
            className: "bg-slate-100 text-slate-700 border border-slate-200",
          },
          terlambat: {
            label: "Terlambat",
            className: "bg-slate-100 text-slate-700 border border-slate-200",
          },
          sakit: {
            label: "Sakit",
            className: "bg-slate-100 text-slate-700 border border-slate-200",
          },
        };

        const dispensasiStatusConfig: Record<string, {label: string; className: string}> = {
          pending: {
            label: "Pending",
            className: "bg-slate-100 text-slate-700 border border-slate-200",
          },
          disetujui: {
            label: "Disetujui",
            className: "bg-green-100 text-green-700 border border-green-200",
          },
          ditolak: {
            label: "Ditolak",
            className: "bg-red-100 text-red-700 border border-red-200",
          },
          batal: {
            label: "Dibatalkan",
            className: "bg-slate-100 text-slate-700 border border-slate-200",
          },
        }
        const attendanceConfig =
  statusConfig?.[todayAbsen?.statusKehadiran] ?? {
    className: "bg-gray-100 text-gray-700 border border-gray-200",
    label: todayAbsen?.statusKehadiran ?? "-",
  };

  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("dashboard")} | ${APP_CONFIG.appName}`}
      title={lang.text("ReportOverview")}
    >
      <div className="mt-2 grid grid-cols-1 lg:grid-cols-12 gap-4">
        <Card className="lg:col-span-3 bg-theme-color-primary/5">
          <CardHeader>
            <h3 className="text-lg font-semibold">
              {lang.text("jadwalKelasHariIni")}
            </h3>
          </CardHeader>

          <CardContent className="min-h-[220px]">
            {jadwalHariIni.length === 0 ? (
              <p className="text-muted-foreground">Tidak ada jadwal hari ini</p>
            ) : (
              <div className="space-y-3">
                {jadwalHariIni.map((item: any, index: number) => (
                  <div
                    key={item.id ?? index}
                    className="rounded-lg border p-3 bg-white"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{item.mataPelajaran}</p>

                        <p className="text-sm text-muted-foreground">
                          {item.kelas}
                        </p>

                        <p className="text-sm text-muted-foreground">
                          Guru: {item.guru}
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
        <Card className="lg:col-span-3 bg-theme-color-primary/5">
          <CardHeader>
            <h3 className="text-lg font-semibold">
              {lang.text("subjectAttendanceToday")}
            </h3>
          </CardHeader>

          <CardContent className="min-h-[220px]">
            {kehadiranMapelToday.length === 0 ? (
              <div className="flex items-center justify-center min-h-[120px]">
                <p className="text-muted-foreground text-center">
                  {lang.text("notActiveAssignment")}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                               {kehadiranMapelToday.map((item: any) => {
                                    const config = statusConfig[item.statusKehadiran];
return (
                  <div
                    key={item.mataPelajaranId}
                    className="rounded-lg border p-3 bg-white"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{item.namaMataPelajaran}</p>
                        <p className="text-sm text-muted-foreground">
                          Guru: {item.guru}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-medium">
                          {item.jamMulai} - {item.jamSelesai}
                        </p>
                        <p className={`inline-flex min-w-[110px] justify-center rounded-full px-3 py-1 mt-1 text-xs font-medium ${
              config?.className ??
              "bg-gray-100 text-gray-700 border border-gray-200"
            }`}>
                          {item.statusKehadiran}
                        </p>
                      </div>
                    </div>
                  </div>
                )})}
              </div>
            )}
          </CardContent>
        </Card>

<Card className="lg:col-span-3 bg-theme-color-primary/5">
  <CardHeader>
    <h3 className="text-lg font-semibold">Jam Masuk</h3>
  </CardHeader>

  <CardContent className="flex flex-col items-center justify-center min-h-[220px]">
    <p className="text-5xl font-bold tracking-tight">
      {todayAbsen?.jamMasuk ?? "--:--"}
    </p>

    <span
      className={`mt-4 inline-flex min-w-[120px] justify-center rounded-full px-3 py-1 text-xs font-medium ${
        attendanceConfig.className
      }`}
    >
      {attendanceConfig.label}
    </span>
  </CardContent>
</Card>

<Card className="lg:col-span-3 bg-theme-color-primary/5">
  <CardHeader>
    <h3 className="text-lg font-semibold">Jam Pulang</h3>
  </CardHeader>

  <CardContent className="flex items-center justify-center min-h-[220px]">
    <p className="text-5xl font-bold tracking-tight">
      {todayAbsen?.jamPulang ?? "--:--"}
    </p>
  </CardContent>
</Card>

                <Card className="lg:col-span-6 bg-theme-color-primary/5">
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
                  {statusDispensasi.slice(0, 5).map((item: any) => {
                    const config = dispensasiStatusConfig[item.statusPengajuan]
                  return(
                    <div
                      key={item.id}
                      className="rounded-lg border p-3 bg-white"
                    >
                      <div className="flex justify-between items-start">
                        <p className="font-medium capitalize">{item.alasan}</p>
 <p className="inline-flex min-w-[110px] justify-center rounded-full text-sm font-medium">Status</p>

                      </div>
                      <div className="flex justify-between items-start">
                        <p className="text-sm text-muted-foreground">
                          {new Date(item.createdAt).toLocaleDateString("id-ID")}
                        </p>
                        <p className={`inline-flex min-w-[110px] justify-center rounded-full px-3 py-1 mt-1 text-xs font-medium ${
              config?.className ??
              "bg-gray-100 text-gray-700 border border-gray-200"
            }`}>{config?.label}</p>
                      </div>
                    </div>
                  )})}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
                        <Card className="lg:col-span-6 bg-theme-color-primary/5">
          <CardHeader>
            <h3 className="text-lg font-semibold">
              {lang.text("lateWarning")}
            </h3>
          </CardHeader>

          <CardContent>
            {itemsToRender.length === 0 ? (
              <div className="flex items-center justify-center min-h-[120px]">
                <p className="text-muted-foreground text-center">
                  {lang.text("notActiveAssignment")}
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[320px] pr-2">
                <div className="space-y-3">
                  {itemsToRender.map((item: any) => {
                    const isExpanded = expandedLates[item.id];
                    return (
                      <div
                        key={item.id}
                        className="rounded-lg border bg-white overflow-hidden transition-all duration-200"
                      >
                        <div 
                          onClick={() => toggleExpandLate(item.id)}
                          className="p-3 cursor-pointer flex justify-between items-start hover:bg-slate-50/50"
                        >
                          <div>
                            <p className="font-semibold text-sm text-slate-800 dark:text-zinc-200">
                              {item.isHariIni 
                                ? "Hari Ini" 
                                : new Date(item.tanggal).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric"
                                  })}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Batas Masuk: {item.batasMasuk ?? "-"}
                            </p>
                          </div>

                          <div className="text-right flex flex-col items-end gap-1">
                            <span className="inline-flex min-w-[90px] justify-center rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-red-100 text-red-700 border border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50">
                              TERLAMBAT
                            </span>
                            <span className="text-xs font-medium text-slate-600 dark:text-zinc-400">
                              Masuk: {item.jamMasuk ?? "-"}
                            </span>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="px-3 pb-3 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/30">
                            <div className="mt-2.5 p-2.5 rounded-lg bg-red-50/30 dark:bg-red-950/10 border border-red-100/50 dark:border-red-900/20 text-xs">
                              <p className="text-slate-700 dark:text-zinc-300 font-medium">
                                Selisih: <span className="text-red-600 dark:text-red-400 font-bold">{item.selisihMenit} menit</span>
                              </p>
                              <p className="text-slate-500 dark:text-zinc-400 mt-1">
                                {item.keterangan}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardPageLayout>
  );
};

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

  const pendingDispensasi = dashboard?.pendingDispensasi ?? [];

  const tugasAktif = dashboard?.tugasAktif ?? [];

  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("dashboard")} | ${APP_CONFIG.appName}`}
      title={lang.text("ReportOverview")}
    >
      <div className="mt-2 w-full flex gap-8 flex-wrap">
        <Card className="w-full lg:w-[calc(50%-1rem)]  bg-theme-color-primary/5">
          <CardHeader>
            <h3 className="text-lg font-semibold">
              {lang.text("jadwalKelasHariIni")}
            </h3>
          </CardHeader>

          <CardContent>
            {jadwalHariIni.length === 0 ? (
              <p className="text-muted-foreground">Tidak ada jadwal hari ini</p>
            ) : (
              <div className="space-y-3">
                {jadwalHariIni.map((item: any) => (
                  <div key={item.id} className="rounded-lg border p-3 bg-white">
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
        <Card className="w-full lg:w-[calc(50%-1rem)] bg-theme-color-primary/5">
          <CardHeader>
            <h3 className="text-lg font-semibold">
              {lang.text("activeAssignment")}
            </h3>
          </CardHeader>

          <CardContent>
            {tugasAktif.length === 0 ? (
              <div className="flex items-center justify-center min-h-[120px]">
                <p className="text-muted-foreground text-center">
                  {lang.text("notActiveAssignment")}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {tugasAktif.map((item: any) => (
                  <div key={item.id} className="rounded-lg border p-3 bg-white">
                    <p className="font-semibold">{item.judul}</p>

                    {item.mataPelajaran && (
                      <p className="text-sm text-muted-foreground">
                        {item.mataPelajaran}
                      </p>
                    )}

                    {item.kelas && (
                      <p className="text-sm text-muted-foreground">
                        {lang.text("classRoom")}: {item.kelas}
                      </p>
                    )}

                    {item.deadline && (
                      <p className="text-sm">
                        {lang.text("deadline")}:{" "}
                        {new Date(item.deadline).toLocaleDateString("id-ID")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardPageLayout>
  );
};

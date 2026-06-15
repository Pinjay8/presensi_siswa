import {
  Badge,
  lang,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/core/libs";
import { Card, CardContent, CardHeader } from "@/core/libs";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { Clock10, CrownIcon, ThumbsDown } from "lucide-react";
import React, { useMemo, useState } from "react";
import {
  FaArrowDown,
  FaArrowUp,
  FaEye,
  FaMinus,
  FaSpinner,
} from "react-icons/fa";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getEmoji } from "../utils";

dayjs.extend(utc);
dayjs.extend(timezone);

interface Attendance {
  statusKehadiran: string;
  createdAt: string; // Gunakan createdAt untuk waktu masuk
  jamMasuk?: string; // jamMasuk dibuat opsional karena tidak digunakan
}

interface User {
  name: string;
  kelas: string;
  nis?: string;
}

interface Student {
  attendance: Attendance;
  user: User;
  isLate?: boolean;
  kelas?: { id: number; namaKelas: string };
}

interface AttendanceCardProps {
  dayData?: Student[];
  yesterdayData?: Student[];
  label?: string;
  value?: number;
  percentage?: string;
  trend?: "up" | "down" | "neutral";
  bgColor?: string;
  textColor?: string;
  isLoading?: boolean;
}

const AttendanceCard: React.FC<AttendanceCardProps> = ({
  dayData = [],
  yesterdayData = [],
  label,
  value,
  percentage,
  trend,
  bgColor,
  textColor,
  isLoading,
}) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(
    label?.toLowerCase() === "hadir" ? "kehadiran" : label?.toLowerCase(),
  );

  const getFilteredChartData = () => {
    if (!activeTab) return chartData;

    const statusMap = {
      kehadiran: "Hadir",
      alpa: "Alpa",
      sakit: "Sakit",
      dispensasi: "Dispensasi",
    };

    const statusLabel = statusMap[activeTab];
    return chartData.filter((item) => item.name === statusLabel);
  };

  const renderTrendIcon = () => {
    if (trend === "up") return <FaArrowUp />;
    if (trend === "down") return <FaArrowDown />;
    return <FaMinus />;
  };

  // Fungsi untuk menghitung jumlah status kehadiran
  const calculateStatusCounts = (data: Student[]) => {
    const counts = { hadir: 0, alpa: 0, sakit: 0, dispensasi: 0 };
    data.forEach((student) => {
      const status = student.attendance?.statusKehadiran?.toLowerCase();
      if (status in counts) {
        counts[status]++;
      }
    });
    return counts;
  };

  // Hitung jumlah status untuk chart
  const todayCounts = calculateStatusCounts(dayData);
  const yesterdayCounts = calculateStatusCounts(yesterdayData);

  // Data untuk chart
  const chartData = [
    {
      name: "Hadir",
      Hari_Ini: todayCounts.hadir,
      Kemarin: yesterdayCounts.hadir,
    },
    { name: "Alpa", Hari_Ini: todayCounts.alpa, Kemarin: yesterdayCounts.alpa },
    {
      name: "Sakit",
      Hari_Ini: todayCounts.sakit,
      Kemarin: yesterdayCounts.sakit,
    },
    {
      name: "Dispensasi",
      Hari_Ini: todayCounts.dispensasi,
      Kemarin: yesterdayCounts.dispensasi,
    },
  ];

  // Hitung jumlah siswa hadir
  const todayHadirCount = todayCounts.hadir;
  const yesterdayHadirCount = yesterdayCounts.hadir;

  // Fungsi untuk memformat keterlambatan
  const formatDelay = (time: dayjs.Dayjs, cutoffTime: dayjs.Dayjs): string => {
    const minutesLate = time.diff(cutoffTime, "minute");
    if (minutesLate >= 60) {
      const hours = Math.floor(minutesLate / 60);
      const minutes = minutesLate % 60;
      return `${hours} jam${minutes > 0 ? ` ${minutes} menit` : ""}`;
    }
    return `${minutesLate} menit`;
  };

  // Fungsi untuk mendapatkan siswa paling awal dan paling akhir
  const getEarliestAndLatestStudents = (data: Student[]) => {
    const validStudents = data
      .filter((student) => {
        const status = student.attendance?.statusKehadiran?.toLowerCase();
        const createdAt = student.attendance?.createdAt;
        if (status !== "hadir" || !createdAt) return false;

        const time = dayjs(createdAt).tz("Asia/Jakarta");
        if (!time.isValid()) {
          console.warn(
            "Skipped - Invalid time format for createdAt:",
            createdAt,
          );
          return false;
        }
        return true;
      })
      .map((student) => ({
        ...student,
        parsedTime: dayjs(student.attendance!.createdAt).tz("Asia/Jakarta"),
      }));

    if (validStudents.length === 0) {
      return { earliest: null, latest: null };
    }

    const earliest = validStudents.reduce((prev, curr) =>
      prev.parsedTime.isBefore(curr.parsedTime) ? prev : curr,
    );
    const latest = validStudents.reduce((prev, curr) =>
      prev.parsedTime.isAfter(curr.parsedTime) ? prev : curr,
    );

    return {
      earliest: {
        name: earliest.user?.name || "Nama Tidak Diketahui",
        kelas: earliest.kelas?.namaKelas || earliest.user?.kelas || "-",
        createdAt: earliest.attendance!.createdAt,
        time: earliest.parsedTime.format("HH:mm:ss"),
      },
      latest: {
        name: latest.user?.name || "Nama Tidak Diketahui",
        kelas: latest.kelas?.namaKelas || latest.user?.kelas || "-",
        createdAt: latest.attendance!.createdAt,
        time: latest.parsedTime.format("HH:mm:ss"),
      },
    };
  };

  // Memoized getLateStudents
  const lateStudents = useMemo(() => {
    return dayData
      .filter((student) => {
        const status = student.attendance?.statusKehadiran?.toLowerCase();
        const createdAt = student.attendance?.createdAt;
        if (status !== "hadir" || !createdAt) return false;

        const time = dayjs(createdAt).tz("Asia/Jakarta");
        if (!time.isValid()) {
          console.warn(
            "Skipped - Invalid time format for createdAt:",
            createdAt,
          );
          return false;
        }

        const cutoffTime = time.startOf("day").hour(7).minute(0).second(0);
        const isLate = time.isAfter(cutoffTime);
        return isLate;
      })
      .map((student) => {
        const time = dayjs(student.attendance!.createdAt).tz("Asia/Jakarta");
        const cutoffTime = time.startOf("day").hour(7).minute(0).second(0);
        return {
          name: student.user?.name || "Nama Tidak Diketahui",
          kelas: student.kelas?.namaKelas || student.user?.kelas || "-",
          status: student.attendance?.statusKehadiran?.toLowerCase(),
          createdAt: student.attendance!.createdAt,
          delay: formatDelay(time, cutoffTime),
        };
      });
  }, [dayData]);

  // Memoized siswa paling awal dan paling akhir
  const todayEarliestAndLatest = useMemo(
    () => getEarliestAndLatestStudents(dayData),
    [dayData],
  );
  const yesterdayEarliestAndLatest = useMemo(
    () => getEarliestAndLatestStudents(yesterdayData),
    [yesterdayData],
  );

  // Filter siswa berdasarkan status kehadiran
  const filteredStudents = useMemo(() => {
    return dayData
      .filter(
        (student) =>
          student.attendance?.statusKehadiran?.toLowerCase() === activeTab,
      )
      .map((student) => ({
        name: student.user?.name || "Nama Tidak Diketahui",
        kelas: student.kelas?.namaKelas || student.user?.kelas || "-",
        status: student.attendance?.statusKehadiran?.toLowerCase(),
        createdAt: student.attendance?.createdAt || "-",
      }));
  }, [dayData, activeTab]);

  return (
    <>
      <Card className="w-full bg-theme-color-primary/5">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-md font-medium  text-black">{label}</span>
          </div>
          <FaEye
            className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setIsSheetOpen(true)}
            aria-label="Lihat detail kehadiran"
          />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 justify-between">
            <div className="text-3xl font-normal text-[#000]">
              {isLoading || value === null || value === undefined ? (
                <FaSpinner className="animate-spin duration-1500 opacity-30" />
              ) : (
                value
              )}
            </div>
            <Badge
              className="flex items-center gap-1 text-xs"
              style={{ backgroundColor: bgColor, color: textColor }}
            >
              {percentage} %
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          side="right"
          className="w-[80vw] pr-10 pb-12 pt-12 max-w-[800px] min-w-[34vw] max-h-[100vh] overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle>Informasi {label}</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="kehadiran">Hadir</TabsTrigger>
                <TabsTrigger value="alpa">Alpa</TabsTrigger>
                <TabsTrigger value="sakit">Sakit</TabsTrigger>
                <TabsTrigger value="dispensasi">Dispensasi</TabsTrigger>
              </TabsList>

              {/* Chart Perbandingan */}
              <Card className="mt-6">
                <CardContent className="pt-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={getFilteredChartData()}
                      margin={{ top: 20, right: 0, left: -40, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-muted"
                      />
                      <XAxis dataKey="name" className="text-foreground" />
                      <YAxis className="text-foreground" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "none",
                          color: "hsl(var(--foreground))",
                        }}
                        cursor={{ fill: "hsl(var(--muted))" }}
                      />
                      <Legend />
                      <Bar
                        dataKey="Hari_Ini"
                        fill="#4ade80"
                        name="Hari Ini"
                        barSize={30}
                      />
                      <Bar
                        dataKey="Kemarin"
                        fill="#3b82f6"
                        name="Kemarin"
                        barSize={30}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Jumlah Siswa Hadir */}
              {activeTab === "hadir" && (
                <Card className="mt-6">
                  <CardHeader>
                    <h3 className="text-lg font-semibold">
                      Jumlah Siswa Hadir
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Badge
                        variant="outline"
                        className="w-full justify-between py-1.5 text-foreground"
                      >
                        <span className="text-sm">
                          Hari Ini: {todayHadirCount} siswa
                        </span>
                      </Badge>
                      <Badge
                        variant="outline"
                        className="w-full justify-between py-1.5 text-foreground"
                      >
                        <span className="text-sm">
                          Kemarin: {yesterdayHadirCount} siswa
                        </span>
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}

              <TabsContent value="kehadiran">
                {/* Daftar Nama Siswa Terlambat Hari Ini */}
                <Card className="mt-6">
                  <CardHeader>
                    <h3 className="text-lg font-semibold">
                      Siswa Terlambat Hari Ini
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {lateStudents.length > 0 ? (
                        lateStudents.map((student, index) => (
                          <Badge
                            key={`today-late-${index}`}
                            variant="outline"
                            className="flex items-center justify-between w-full py-2 px-3 border border-border text-foreground rounded-md"
                            aria-label={`Siswa ${student.name} (${student.kelas}) hadir terlambat pada ${student.createdAt} selama ${student.delay}`}
                          >
                            <div className="flex items-center gap-2">
                              <Clock10 className="w-5 h-5 text-red-500" />
                              <p
                                className="pr-2 w-full overflow-hidden whitespace-nowrap text-ellipsis"
                                title={`${student.name} (${student.kelas})`}
                              >
                                {student.name || "-"}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="min-w-[60px] text-center bg-yellow-700 text-white px-2 py-1 rounded-sm">
                                {student.kelas}
                              </span>
                              <span className="min-w-[100px] text-center bg-red-600 text-white px-2 py-1 rounded-sm">
                                {student.delay}
                              </span>
                            </div>
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Tidak ada siswa yang terlambat hari ini.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Daftar Siswa Datang Paling Awal */}
                <Card className="mt-6">
                  <CardHeader>
                    <h3 className="text-lg font-semibold">
                      Siswa Datang Paling Awal
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {todayEarliestAndLatest.earliest ||
                      yesterdayEarliestAndLatest.earliest ? (
                        <>
                          {todayEarliestAndLatest.earliest && (
                            <Badge
                              variant="outline"
                              className="flex items-center justify-between w-full py-2 px-3 border border-border text-foreground rounded-md"
                              aria-label={`Siswa ${todayEarliestAndLatest.earliest.name} (${todayEarliestAndLatest.earliest.kelas}) datang paling awal hari ini pada ${todayEarliestAndLatest.earliest.time}`}
                            >
                              <div className="flex items-center gap-2">
                                <CrownIcon className="w-5 h-5 text-yellow-500" />
                                <p
                                  className="pr-2 w-full overflow-hidden whitespace-nowrap text-ellipsis"
                                  title={`${todayEarliestAndLatest.earliest.name} (${todayEarliestAndLatest.earliest.kelas})`}
                                >
                                  {todayEarliestAndLatest.earliest.name || "-"}{" "}
                                  (Hari Ini)
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="min-w-[60px] text-center bg-yellow-700 text-white px-2 py-1 rounded-sm">
                                  {todayEarliestAndLatest.earliest.kelas}
                                </span>
                                <span className="min-w-[100px] text-center bg-green-600 text-white px-2 py-1 rounded-sm">
                                  {todayEarliestAndLatest.earliest.time}
                                </span>
                              </div>
                            </Badge>
                          )}
                          {yesterdayEarliestAndLatest.earliest && (
                            <Badge
                              variant="outline"
                              className="flex items-center justify-between w-full py-2 px-3 border border-border text-foreground rounded-md"
                              aria-label={`Siswa ${yesterdayEarliestAndLatest.earliest.name} (${yesterdayEarliestAndLatest.earliest.kelas}) datang paling awal kemarin pada ${yesterdayEarliestAndLatest.earliest.time}`}
                            >
                              <div className="flex items-center gap-2">
                                <CrownIcon className="w-5 h-5 text-yellow-500" />
                                <p
                                  className="pr-2 w-full overflow-hidden whitespace-nowrap text-ellipsis"
                                  title={`${yesterdayEarliestAndLatest.earliest.name} (${yesterdayEarliestAndLatest.earliest.kelas})`}
                                >
                                  {yesterdayEarliestAndLatest.earliest.name ||
                                    "-"}{" "}
                                  (Kemarin)
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="min-w-[60px] text-center bg-yellow-700 text-white px-2 py-1 rounded-sm">
                                  {yesterdayEarliestAndLatest.earliest.kelas}
                                </span>
                                <span className="min-w-[100px] text-center bg-green-600 text-white px-2 py-1 rounded-sm">
                                  {yesterdayEarliestAndLatest.earliest.time}
                                </span>
                              </div>
                            </Badge>
                          )}
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Tidak ada data siswa yang hadir untuk hari ini atau
                          kemarin.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Daftar Siswa Datang Paling Akhir */}
                <Card className="mt-6">
                  <CardHeader>
                    <h3 className="text-lg font-semibold">
                      Siswa Datang Paling Akhir
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {todayEarliestAndLatest.latest ||
                      yesterdayEarliestAndLatest.latest ? (
                        <>
                          {todayEarliestAndLatest.latest && (
                            <Badge
                              variant="outline"
                              className="flex items-center justify-between w-full py-2 px-3 border border-border text-foreground rounded-md"
                              aria-label={`Siswa ${todayEarliestAndLatest.latest.name} (${todayEarliestAndLatest.latest.kelas}) datang paling akhir hari ini pada ${todayEarliestAndLatest.latest.time}`}
                            >
                              <div className="flex items-center gap-2">
                                <ThumbsDown className="w-5 h-5 text-red-500" />
                                <p
                                  className="pr-2 w-full overflow-hidden whitespace-nowrap text-ellipsis"
                                  title={`${todayEarliestAndLatest.latest.name} (${todayEarliestAndLatest.latest.kelas})`}
                                >
                                  {todayEarliestAndLatest.latest.name || "-"}{" "}
                                  (Hari Ini)
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="min-w-[60px] text-center bg-yellow-700 text-white px-2 py-1 rounded-sm">
                                  {todayEarliestAndLatest.latest.kelas}
                                </span>
                                <span className="min-w-[100px] text-center bg-orange-600 text-white px-2 py-1 rounded-sm">
                                  {todayEarliestAndLatest.latest.time}
                                </span>
                              </div>
                            </Badge>
                          )}
                          {yesterdayEarliestAndLatest.latest && (
                            <Badge
                              variant="outline"
                              className="flex items-center justify-between w-full py-2 px-3 border border-border text-foreground rounded-md"
                              aria-label={`Siswa ${yesterdayEarliestAndLatest.latest.name} (${yesterdayEarliestAndLatest.latest.kelas}) datang paling akhir kemarin pada ${yesterdayEarliestAndLatest.latest.time}`}
                            >
                              <div className="flex items-center gap-2">
                                <ThumbsDown className="w-5 h-5 text-red-500" />
                                <p
                                  className="pr-2 w-full overflow-hidden whitespace-nowrap text-ellipsis"
                                  title={`${yesterdayEarliestAndLatest.latest.name} (${yesterdayEarliestAndLatest.latest.kelas})`}
                                >
                                  {yesterdayEarliestAndLatest.latest.name ||
                                    "-"}{" "}
                                  (Kemarin)
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="min-w-[60px] text-center bg-yellow-700 text-white px-2 py-1 rounded-sm">
                                  {yesterdayEarliestAndLatest.latest.kelas}
                                </span>
                                <span className="min-w-[100px] text-center bg-orange-600 text-white px-2 py-1 rounded-sm">
                                  {yesterdayEarliestAndLatest.latest.time}
                                </span>
                              </div>
                            </Badge>
                          )}
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Tidak ada data siswa yang hadir untuk hari ini atau
                          kemarin.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="alpa">
                <Card className="mt-6">
                  <CardHeader>
                    <h3 className="text-lg font-semibold">
                      Siswa Alpa Hari Ini
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student, index) => (
                          <Badge
                            key={`alpa-${index}`}
                            variant="outline"
                            className="flex items-center justify-between w-full py-2 px-3 border border-red-500 text-foreground rounded-md"
                            aria-label={`Siswa ${student.name} (${student.kelas}) alpa hari ini`}
                          >
                            <p
                              className="pr-2 w-full overflow-hidden whitespace-nowrap text-ellipsis"
                              title={`${student.name} (${student.kelas})`}
                            >
                              {student.name || "-"}
                            </p>
                            <span className="min-w-[60px] text-center bg-yellow-700 text-white px-2 py-1 rounded-sm">
                              {student.kelas}
                            </span>
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Tidak ada siswa yang alpa hari ini.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sakit">
                <Card className="mt-6">
                  <CardHeader>
                    <h3 className="text-lg font-semibold">
                      Siswa Sakit Hari Ini
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student, index) => (
                          <Badge
                            key={`sakit-${index}`}
                            variant="outline"
                            className="flex items-center justify-between w-full py-2 px-3 border border-blue-500 text-foreground rounded-md"
                            aria-label={`Siswa ${student.name} (${student.kelas}) sakit hari ini`}
                          >
                            <p
                              className="pr-2 w-full overflow-hidden whitespace-nowrap text-ellipsis"
                              title={`${student.name} (${student.kelas})`}
                            >
                              {student.name || "-"}
                            </p>
                            <span className="min-w-[60px] text-center bg-yellow-700 text-white px-2 py-1 rounded-sm">
                              {student.kelas}
                            </span>
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Tidak ada siswa yang sakit hari ini.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="dispensasi">
                <Card className="mt-6">
                  <CardHeader>
                    <h3 className="text-lg font-semibold">
                      Siswa Dispensasi Hari Ini
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student, index) => (
                          <Badge
                            key={`dispensasi-${index}`}
                            variant="outline"
                            className="flex items-center justify-between w-full py-2 px-3 border border-green-500 text-foreground rounded-md"
                            aria-label={`Siswa ${student.name} (${student.kelas}) dispensasi hari ini`}
                          >
                            <p
                              className="pr-2 w-full overflow-hidden whitespace-nowrap text-ellipsis"
                              title={`${student.name} (${student.kelas})`}
                            >
                              {student.name || "-"}
                            </p>
                            <span className="min-w-[60px] text-center bg-yellow-700 text-white px-2 py-1 rounded-sm">
                              {student.kelas}
                            </span>
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Tidak ada siswa yang dispensasi hari ini.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default AttendanceCard;

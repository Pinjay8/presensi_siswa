import { Alert, AlertDescription, AlertTitle, Button, lang } from "@/core/libs";
import { useBiodata } from "@/features/user";
import dayjs from "dayjs";
import { Loader, RefreshCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { calculateAttendanceStats } from "../utils";
import { useStudents } from "@/features/parents/hooks/useStudent";
import { useProfile } from "@/features/profile";
import { useClassroom } from "@/features/classroom";
import { AttendanceDashboard } from "../components";
import { any } from "zod";
import { dashboardService } from "@/core/services/dashboard";

interface AttedancesReportProps {
  selectedSchool?: string;
  changes?: any;
  stats?: any;
}

export const AttedancesReport = ({ selectedSchool, changes, stats }: AttedancesReportProps) => {
  const [isStatsLoading, setIsStatsLoading] = useState<boolean>(true);
  const [turn, setTurn] = useState<boolean>(true);
  const [selectedEndMonth] = useState<string>(
    dayjs().tz("Asia/Jakarta").format("YYYY-MM"),
  );
  const [selectedClass] = useState<string>("");
  const [missingStudents, setMissingStudents] = useState<
    { nis: string; name: string; kelas: string }[]
  >([]); // Tambahkan kelas ke tipe

  const profile = useProfile();
  const biodata = useBiodata();
  // console.log(biodata)
  const classRoom = useClassroom();
  const students = useStudents({
    page: 1,
    size: 9999,
    sekolahId: profile?.user?.sekolahId || 0,
    kelas: "all",
  });

  // console.log("classRoom", classRoom);
  // console.log("students ada no tlp:", students);

  // Refetch semua data saat halaman diakses
  // useEffect(() => {
  //   console.log("Refetching data...");
  //   // biodata.query.refetch();
  // }, []);

  const formatTime = (time?: string) => {
    return time
      ? dayjs(time).tz("Asia/Jakarta").format("DD MMM YYYY, HH:mm:ss")
      : "N/A";
  };

  // Filter data berdasarkan selectedSchool
  // const filteredBySchool = useMemo(() => {
  //   if (!biodata.data) return [];
  //   if (!selectedSchool) return biodata.data;
  //   return biodata.data.filter(
  //     (student) =>
  //       student.user?.sekolah?.namaSekolah === selectedSchool
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

  if (!Array.isArray(filteredBySchool)) {
    return [];
  }
  // Filter data untuk hari ini
  // const dayData = useMemo(() => {
  //   if (filteredBySchool.length <= 0) {
  //     return [];
  //   }
  //   const data =
  //     filteredBySchool
  //       .flatMap((student) =>
  //         student.absensis
  //           ?.filter((attendance) =>
  //             dayjs(attendance.jamMasuk)
  //               .tz("Asia/Jakarta")
  //               .isSame(dayjs().tz("Asia/Jakarta"), "day")
  //           )
  //           .map((attendance) => ({
  //             ...student,
  //             attendance: {
  //               ...attendance,
  //               jamMasuk: formatTime(attendance.jamMasuk),
  //               jamPulang: formatTime(attendance.jamPulang),
  //             },
  //           }))
  //       )
  //       .filter((student) =>
  //         selectedClass ? student.kelas?.namaKelas === selectedClass : true
  //       ) || [];

  //   return data;
  // }, [filteredBySchool, selectedEndMonth, selectedClass]);

  // Filter data untuk kemarin
  // const yesterdayData = useMemo(() => {
  //   const yesterday = dayjs().tz("Asia/Jakarta").subtract(1, "day").startOf("day");
  //   const data =
  //     filteredBySchool
  //       .flatMap((student) =>
  //         student.absensis
  //           ?.filter((attendance) =>
  //             dayjs(attendance.jamMasuk)
  //               .tz("Asia/Jakarta")
  //               .isSame(yesterday, "day")
  //           )
  //           .map((attendance) => ({
  //             ...student,
  //             attendance: {
  //               ...attendance,
  //               jamMasuk: formatTime(attendance.jamMasuk),
  //               jamPulang: formatTime(attendance.jamPulang),
  //             },
  //           }))
  //       )
  //       .filter((student) =>
  //         selectedClass ? student.kelas?.namaKelas === selectedClass : true
  //       ) || [];

  //   return data;
  // }, [filteredBySchool, selectedClass]);

  // // Hitung statistik kehadiran
  // const currentMonthStats = useMemo(() => {
  //   const stats = calculateAttendanceStats(dayData);
  //   return stats;
  // }, [dayData]);

  // const lastMonthStats = useMemo(() => {
  //   const stats = calculateAttendanceStats(yesterdayData);
  //   return stats;
  // }, [yesterdayData]);

  // Hitung persentase perubahan dan tren
  // const attendanceChanges = useMemo(() => {
  //   const calculateChange = (current: number, last: number) => {
  //     if (current === last) {
  //       return {
  //         percentage: "0.0%",
  //         trend: "neutral",
  //       };
  //     }
  //     if (last === 0) {
  //       return {
  //         percentage: current > 0 ? "100.0%" : "-100.0%",
  //         trend: current > 0 ? "up" : "down",
  //       };
  //     }
  //     const change = ((current - last) / last) * 100;
  //     return {
  //       percentage: `${Math.abs(change).toFixed(1)}%`,
  //       trend: change > 0 ? "up" : "down",
  //     };
  //   };

  //   return {
  //     hadir: calculateChange(currentMonthStats.totalHadir, lastMonthStats.totalHadir),
  //     alpa: calculateChange(currentMonthStats.totalAlpa, lastMonthStats.totalAlpa),
  //     sakit: calculateChange(currentMonthStats.totalSakit, lastMonthStats.totalSakit),
  //     dispensasi: calculateChange(currentMonthStats.totalDispensasi, lastMonthStats.totalDispensasi),
  //   };
  // }, [currentMonthStats, lastMonthStats]);

  // Atur loading state
  // useMemo(() => {
  //   if (
  //     currentMonthStats.totalHadir !== 0 ||
  //     currentMonthStats.totalAlpa !== 0 ||
  //     currentMonthStats.totalSakit !== 0 ||
  //     currentMonthStats.totalDispensasi !== 0
  //   ) {
  //     setIsStatsLoading(false);
  //     return;
  //   }

  //   const timeout = setTimeout(() => {
  //     setIsStatsLoading(false);
  //   }, 3 * 60 * 1000);

  //   return () => clearTimeout(timeout);
  // }, [currentMonthStats]);
  // useEffect(() => {
  //   if (
  //     currentMonthStats.totalHadir !== 0 ||
  //     currentMonthStats.totalAlpa !== 0 ||
  //     currentMonthStats.totalSakit !== 0 ||
  //     currentMonthStats.totalDispensasi !== 0
  //   ) {
  //     setIsStatsLoading(false);
  //     return;
  //   }

  //   const timeout = setTimeout(() => {
  //     setIsStatsLoading(false);
  //   }, 3 * 60 * 1000);

  //   return () => clearTimeout(timeout);
  // }, [currentMonthStats]);

  // Fungsi untuk membandingkan data berdasarkan nis
  // const compareDataByNis = (dayData: any[], studentsData: any[]) => {
  //   if (!studentsData || !dayData) {
  //     console.log("Data tidak lengkap untuk perbandingan");
  //     return [];
  //   }

  //   // Ekstrak nis dari dayData
  //   const dayDataNis = dayData
  //     .map((item) => item?.user?.nis)
  //     .filter((nis) => nis); // Filter null/undefined

  //   // Cari siswa di students.data yang nis-nya tidak ada di dayData
  //   const missingStudents = studentsData.filter((student) => {
  //     if (!student.nis) {
  //       console.warn(`Siswa dengan id ${student.id} tidak memiliki nis`);
  //       return false;
  //     }
  //     return !dayDataNis.includes(student.nis);
  //   });

  //   // Ambil nis, name, dan kelas dari siswa yang tidak ada di dayData
  //   const missingNisAndNames = missingStudents.map((student) => ({
  //     nis: student.nis,
  //     name: student.name,
  //     kelas: student.biodataSiswa?.[0]?.kelas?.namaKelas || "-", // Ambil kelas atau fallback
  //     email: student.email || "-", // Ambil kelas atau fallback
  //     image: student.image || null, // Ambil kelas atau fallback
  //     noTlp: student.noTlp || 0, // Ambil kelas atau fallback
  //     noTlpOrtu: student.noTlpOrtu || 0, // Ambil kelas atau fallback
  //   }));

  //   return missingNisAndNames;
  // };

  // Bandingkan data saat students.data dan dayData tersedia
  // useEffect(() => {
  //   if (students?.data && dayData) {
  //     const result = compareDataByNis(dayData, students.data);
  //     // console.log('RWESULT', result)
  //     setMissingStudents(result);
  //   }
  // }, [students?.data, dayData]);

  // const renderLoading = () => {
  //   if (isStatsLoading) {
  //     return (
  //       <Alert className="mb-4">
  //         <Loader className="h-4 w-4 animate-spin" />
  //         <AlertTitle>{lang.text("loadData")}</AlertTitle>
  //         <AlertDescription className="text-gray-500">
  //           {lang.text("loadingData")}
  //         </AlertDescription>
  //       </Alert>
  //     );
  //   }
  // };

  const handleRefecth = () => {
    setTurn(true);
    biodata.query.refetch();

    setTimeout(() => {
      setTurn(false);
    }, 1000);

    return clearTimeout;
  };

  return (
    <>
      <div className="mt-4 mb-12">
        {profile?.user?.role === "admin" && (
          <div className="absolute top-3 right-[10%] w-full flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => handleRefecth()}
              className="ml-auto px-3"
            >
              <RefreshCcw
                className={
                  turn
                    ? "transform rotate-[120deg] duration-200"
                    : "transform rotate-[-120deg] duration-200 ease-in"
                }
              />
              <p>{lang.text("refresh")}</p>
            </Button>
          </div>
        )}
        {/* {renderLoading()} */}
        <AttendanceDashboard
          dayData={[]}
          dataNoAccess={missingStudents}
          yesterdayData={[]}
          stats={stats}
          changes={changes}
          isLoading={isStatsLoading}
        />
      </div>
    </>
  );
};

import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  Input,
  lang,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/core/libs";
import React, { useState, useEffect } from "react";
import { FaEye, FaPhone, FaSpinner } from "react-icons/fa";
import AttendanceCard from "./attedance-card";
import CardTeacherDashboard from "./CardTeacherDashboard";

interface AttendanceStats {
  totalHadir: number;
  totalAlpa: number;
  totalSakit: number;
  totalDispensasi: number;
}

interface AttendanceChange {
  percentage: string;
  trend: "up" | "down" | "neutral";
}

interface AttendanceDashboardProps {
  dayData: any;
  yesterdayData: any;
  // stats: AttendanceStats;
  stats: any;
  // changes: {
  //   hadir: AttendanceChange;
  //   alpa: AttendanceChange;
  //   sakit: AttendanceChange;
  //   dispensasi: AttendanceChange;
  // };
  changes: any;
  isLoading: boolean;
  dataNoAccess?: {
    nis: string;
    name: string;
    kelas: string;
    noTlp?: string;
    image?: string;
  }[];
}

// Utilitas untuk memformat nomor telepon ke format WhatsApp
const formatWhatsAppNumber = (phone: string | undefined): string | null => {
  if (!phone) return null;
  const cleaned = phone.replace(/[^0-9]/g, "");
  if (cleaned.startsWith("0")) {
    return `+62${cleaned.slice(1)}`;
  }
  if (cleaned.startsWith("+")) {
    return cleaned;
  }
  return `+62${cleaned}`;
};

export const StudentDashboard: React.FC<AttendanceDashboardProps> = ({
  dayData,
  yesterdayData,
  stats,
  changes,
  isLoading,
  dataNoAccess = [],
}) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Reset search query when sheet is closed
  useEffect(() => {
    if (!isSheetOpen) {
      setSearchQuery("");
    }
  }, [isSheetOpen]);

  // Urutkan dataNoAccess: siswa dengan image di awal
  const sortedDataNoAccess = [...dataNoAccess].sort((a, b) => {
    const hasImageA = a.image && a.image.trim() ? 1 : 0;
    const hasImageB = b.image && b.image.trim() ? 1 : 0;
    return hasImageB - hasImageA; // Siswa dengan image (1) muncul sebelum tanpa image (0)
  });

  // Filter berdasarkan search query
  const filteredDataNoAccess = sortedDataNoAccess.filter((student) =>
    student.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex gap-4 w-full justify-between flex-wrap lg:flex-nowrap">
      <CardTeacherDashboard label="Hadir" value={stats.totalHadir} />

      <CardTeacherDashboard label="Alfa" value={stats.totalAlpa} />

      <CardTeacherDashboard label="Sakit" value={stats.totalSakit} />

      <CardTeacherDashboard label="Terlambat" value={stats.totalTerlambat} />

      <CardTeacherDashboard label="Izin" value={stats.totalIzin} />
      {/* Sheet untuk menampilkan daftar dataNoAccess */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          side="right"
          className="w-[80vw] pr-10 pb-12 pt-12 max-w-[800px] min-w-[34vw] max-h-[100vh] overflow-y-auto text-white"
        >
          <SheetHeader>
            <SheetTitle>
              {lang.text("student")} - {lang.text("noReport")}{" "}
              {lang.text("today")}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            {/* Search Input */}
            <Input
              placeholder={lang.text("search") || "Cari berdasarkan nama"}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-6 bg-slate-800 text-white border-slate-600 focus:border-slate-400"
              aria-label="Cari siswa berdasarkan nama"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredDataNoAccess.length > 0 ? (
                filteredDataNoAccess.map((student, index) => (
                  <Card
                    key={`no-access-${index}`}
                    className="border border-slate-700 text-white rounded-md overflow-hidden"
                    aria-label={`Siswa ${student.name} (NIS: ${student.nis}, Kelas: ${student.kelas}) tidak hadir`}
                  >
                    <CardHeader className="p-0">
                      <img
                        src={
                          student.image ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            student.name || "Siswa",
                          )}&background=fff&color=000`
                        }
                        alt={`Avatar ${student.name}`}
                        className="w-full h-32 object-cover"
                      />
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-2">
                        <p
                          className="text-white font-semibold truncate"
                          title={student.name}
                        >
                          {student.name || "-"}
                        </p>
                        <div className="w-full flex gap-2">
                          <Badge
                            variant="secondary"
                            className="bg-slate-700 text-slate-200 px-2 py-1"
                            aria-label={`NIS siswa: ${student.nis || "-"}`}
                          >
                            NIS: {student.nis || "-"}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="bg-slate-700 text-slate-200 px-2 py-1"
                            aria-label={`Kelas siswa: ${student.kelas || "-"}`}
                          >
                            Kelas: {student.kelas || "-"}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-400 border-t border-t-white/20 my-2 pt-3">
                          {student.noTlp ? (
                            <a
                              href={`https://wa.me/${formatWhatsAppNumber(student.noTlp)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-400 hover:underline flex items-center"
                              aria-label={`Hubungi ${student.name} via WhatsApp`}
                            >
                              <FaPhone />: {student.noTlp}
                            </a>
                          ) : (
                            <p className="flex">
                              <FaPhone />: -
                            </p>
                          )}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-sm text-slate-400 col-span-2">
                  {searchQuery
                    ? "Tidak ada siswa yang cocok dengan pencarian."
                    : "Tidak ada siswa yang tidak hadir hari ini."}
                </p>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

import { Alert, AlertDescription, AlertTitle, Button, lang } from "@/core/libs";
import { useBiodata } from "@/features/user";
import dayjs from "dayjs";
import { Loader, RefreshCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { calculateAttendanceStats } from "../utils";
import { useStudents } from "@/features/parents/hooks/useStudent";
import { useProfile } from "@/features/profile";

import { StudentDashboard } from "../components/StudentDashboard";

interface AttedancesReportProps {
  selectedSchool?: string;
  changes?: any;
  stats?: any;
}

export const AttedancesStudentReport = ({
  selectedSchool,
  changes,
  stats,
}: AttedancesReportProps) => {
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
      <div className="mt-4 mb-8">
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
        <StudentDashboard
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

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
import { Skeleton, Typography } from "@mui/material";

interface AttedancesReportProps {
  selectedSchool?: string;
  changes?: any;
  stats?: any;
  isLoading?: boolean;
}

export const AttedancesReport = ({
  selectedSchool,
  changes,
  stats,
  isLoading,
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

  // const [showLoading, setShowLoading] = useState(true);

  // useEffect(() => {
  //   if (!isLoading) {
  //     const timer = setTimeout(() => {
  //       setShowLoading(false);
  //     }, 300);

  //     return () => clearTimeout(timer);
  //   }S

  //   setShowLoading(true);
  // }, [isLoading]);

  // if (showLoading) {
  //   return (
  //     <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
  //       {[...Array(5)].map((_, i) => (
  //         <Skeleton key={i} className="h-28 w-full rounded-xl" />
  //       ))}
  //     </div>
  //   );
  // }

  return (
    <>
      <div className="mt-4 mb-8">
        {/* {profile?.user?.role === "admin" && (
          <div className="absolute top-3 right-[10%] w-full flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => {}}
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
        )} */}
        {/* {renderLoading()} */}
  
        <AttendanceDashboard
          dayData={[]}
          dataNoAccess={missingStudents}
          yesterdayData={[]}
          stats={stats}
          changes={changes}
          isLoading={isLoading}
        />
      </div>
    </>
  );
};

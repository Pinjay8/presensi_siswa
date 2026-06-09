import { APP_CONFIG } from "@/core/configs";
import {
  Button,
  dayjs,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  lang,
} from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import { StudentDemographicsCharts } from "@/features/dashboard/containers";
import { useProfile } from "@/features/profile";
import React, { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { AttedancesReport, ReportOverview } from "../containers";
import { SchoolMap } from "../containers/school-map";
import { useSchool } from "../hooks";
import { dashboardService } from "@/core/services/dashboard";
import { useAbsensiCount } from "../hooks/useAbsensiCount";

type AbsensiCount = {
  count: {
    hadir?: number;
    alfa?: number;
    sakit?: number;
    izin?: number;
    belumAbsen?: number;
    totalSiswa?: number;
  };
};

export const SchoolDistribution = () => {
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const profile = useProfile();
  const schools = useSchool();

  const ROLE = profile.user?.role;

  const { data: absensiCount, isLoading, error, refetch } = useAbsensiCount();

  const count = absensiCount?.count || {};

  const stats = {
    totalHadir: count?.hadir ?? 0,
    totalAlpa: count?.alfa ?? 0,
    totalSakit: count?.sakit ?? 0,
    totalDispensasi: count?.izin ?? 0,
    totalBelumAbsen: count?.belumAbsen ?? 0,
    totalSiswa: count?.totalSiswa ?? 0,
  };
  const changes = {
    hadir: {
      percentage: count?.persentase?.hadir ?? 0,
    },
    alpa: {
      percentage: count?.persentase?.alfa ?? 0,
    },
    sakit: {
      percentage: count?.persentase?.sakit ?? 0,
    },
    dispensasi: {
      percentage: count?.persentase?.izin ?? 0,
    },
    belumAbsen: {
      percentage: count?.persentase?.belumAbsen ?? 0,
    },
  };

  return (
    <React.Fragment>
      <DashboardPageLayout
        siteTitle={`${lang.text("schoolDistribution")} | ${APP_CONFIG.appName}`}
        title={lang.text("intro") + "," + ` ${profile?.user?.name} 😁`}
      >
        {ROLE === "superAdmin" ? (
          <>
            <div className="w-full mt-6 flex justify-between items-baseline">
              <div className="w-max flex items-baseline">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-5 px-5"
                    >
                      {selectedSchool || "Pilih Sekolah"} <FaChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="ml-10 max-h-[250px] overflow-y-auto scroll-smooth no-scrollbar">
                    <DropdownMenuLabel>Sekolah</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {schools && schools.data.length > 0 ? (
                      <div>
                        {schools?.data?.map((data, index) => (
                          <DropdownMenuItem
                            key={index}
                            onClick={() => setSelectedSchool(data.namaSekolah)}
                          >
                            {data.namaSekolah}
                          </DropdownMenuItem>
                        ))}
                      </div>
                    ) : (
                      <DropdownMenuItem onClick={() => setSelectedSchool("")}>
                        Tidak Tersedia
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
                {selectedSchool ? (
                  <Button
                    variant="outline"
                    onClick={() => setSelectedSchool("")}
                    className="ml-4"
                  >
                    {lang.text("reset")}
                  </Button>
                ) : (
                  <></>
                )}
              </div>
              <div className="flex items-center">
                <Button variant="outline" disabled className="ml-4 px-6">
                  {dayjs().tz("Asia/Jakarta").format("MMMM")}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <></>
        )}

        <AttedancesReport
          selectedSchool={selectedSchool}
          changes={changes}
          stats={stats}
        />
        <ReportOverview
          selectedSchool={selectedSchool}
          stats={stats}
          isLoading={isLoading}
        />
        {profile?.user?.role !== "superAdmin" && <StudentDemographicsCharts />}
        <SchoolMap />
        <div className="pb-16 sm:pb-0" />
      </DashboardPageLayout>
    </React.Fragment>
  );
};

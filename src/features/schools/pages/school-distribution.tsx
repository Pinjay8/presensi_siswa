import { APP_CONFIG } from "@/core/configs";
import { Button, Card, CardContent, CardHeader, lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import { StudentDemographicsCharts } from "@/features/dashboard/containers";
import { useProfile } from "@/features/profile";
import React, { useEffect, useState } from "react";
import { AttedancesReport, ReportOverview } from "../containers";
import { useSchool } from "../hooks";
import { useAbsensiCount } from "../hooks/useAbsensiCount";
import { AttedancesTeacherReport } from "../containers/attedance-teacher-dashboard";
import { ReportTeacher } from "../containers/ReportTeacher";
import { useDashboard } from "../hooks/useDashboard";
import { SchoolMap } from "../containers/school-map";
import { ReportStudent } from "../containers/ReportStudent";
import { AttedancesStudentReport } from "../containers/attedance-student-dashboard";
import { AttedancesParentReport } from "../containers/attedance-parent-dashboard";
import { ReportParent } from "../containers/ReportParent";

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
    totalBelumAbsen: count?.belumHadir ?? 0,
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

  const {
    data: dashboard,
    isLoading: isLoadingDashboard,
    // error,
    // refetch: refetchDashboard,
  } = useDashboard();

  const attendance = dashboard?.waliKelasInfo?.kehadiranHariIni ?? {};
  const attedanceStudent = dashboard?.bulananStats ?? {};

  const children = dashboard?.children ?? [];

  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    children?.[0]?.biodataSiswaId ?? null,
  );

  useEffect(() => {
    if (children.length > 0 && !selectedStudentId) {
      setSelectedStudentId(children[0].biodataSiswaId);
    }
  }, [children, selectedStudentId]);

  const selectedStudent =
    children.find((x: any) => x.biodataSiswaId === selectedStudentId) ??
    children[0];

  const statsData = {
    totalSiswa: dashboard?.waliKelasInfo?.totalSiswa ?? 0,
    totalHadir: attendance.hadir ?? 0,
    totalAlpa: attendance.alfa ?? 0,
    totalSakit: attendance.sakit ?? 0,
    totalDispensasi: attendance.izin ?? 0,
    totalBelumAbsen: attendance.belumAbsen ?? 0,
    totalTerlambat: attendance.terlambat ?? 0,
  };

  const changesData = {
    hadir: {
      percentage: 0,
    },
    alpa: {
      percentage: 0,
    },
    sakit: {
      percentage: 0,
    },
    dispensasi: {
      percentage: 0,
    },
    belumAbsen: {
      percentage: 0,
    },
    terlambat: {
      percentage: 0,
    },
  };

  const statsStudent = {
    totalHadir: attedanceStudent.hadir ?? 0,
    totalAlpa: attedanceStudent.alfa ?? 0,
    totalSakit: attedanceStudent.sakit ?? 0,
    totalIzin: attedanceStudent.izin ?? 0,
    totalTerlambat: attedanceStudent.terlambat ?? 0,
  };

  const attendanceParent = selectedStudent?.bulananStats ?? {};

  const statsParent = {
    totalHadir: attendanceParent.hadir ?? 0,
    totalAlpa: attendanceParent.alfa ?? 0,
    totalSakit: attendanceParent.sakit ?? 0,
    totalIzin: attendanceParent.izin ?? 0,
    totalTerlambat: attendanceParent.terlambat ?? 0,
  };

  return (
    <React.Fragment>
      <DashboardPageLayout
        siteTitle={`${lang.text("dashboard")}`}
        title={lang.text("intro") + "," + ` ${profile?.user?.name} 😁`}
      >
        {/* {ROLE === "superAdmin" ? (
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
        )} */}
        {ROLE === "superAdmin" ||
          (ROLE === "admin" && (
            <>
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
              <SchoolMap />
            </>
          ))}
        {/* {profile?.user?.role !== "superAdmin" && <StudentDemographicsCharts />} */}

        {ROLE === "guru" && (
          <>
            <AttedancesTeacherReport
              selectedSchool={selectedSchool}
              changes={changesData}
              stats={statsData}
            />
            <ReportTeacher
              selectedSchool={selectedSchool}
              dashboard={dashboard}
              isLoading={isLoading}
            />
          </>
        )}

        {ROLE === "siswa" && (
          <>
            <AttedancesStudentReport
              selectedSchool={selectedSchool}
              changes={changesData}
              stats={statsStudent}
            />
            <ReportStudent
              selectedSchool={selectedSchool}
              dashboard={dashboard}
              isLoading={isLoading}
            />
          </>
        )}

        {ROLE === "orangTua" && (
          <>
            <Card className="mb-4">
              <CardHeader>
                <h3 className="font-semibold">Pilih Anak</h3>
              </CardHeader>

              <CardContent>
                {/* <select
                  className="w-full border rounded-md p-2"
                  value={selectedStudentId ?? ""}
                  onChange={(e) => setSelectedStudentId(Number(e.target.value))}
                >
                  {children.map((child: any) => (
                    <option
                      key={child.biodataSiswaId}
                      value={child.biodataSiswaId}
                    >
                      {child.name} - {child.kelas ?? "-"}
                    </option>
                  ))}
                </select> */}
                <div className="flex gap-2 flex-wrap mb-4">
                  {children.map((child: any) => (
                    <Button
                      key={child.biodataSiswaId}
                      variant={
                        selectedStudentId === child.biodataSiswaId
                          ? "default"
                          : "outline"
                      }
                      onClick={() => setSelectedStudentId(child.biodataSiswaId)}
                    >
                      {child.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <AttedancesParentReport
              selectedSchool={selectedSchool}
              changes={changesData}
              stats={statsParent}
            />

            <ReportParent
              selectedSchool={selectedSchool}
              dashboard={dashboard}
              selectedStudent={selectedStudent}
              isLoading={isLoading}
            />
          </>
        )}

        <div className="pb-16 sm:pb-0" />
      </DashboardPageLayout>
    </React.Fragment>
  );
};

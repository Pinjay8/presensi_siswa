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
import { Avatar, Typography } from "@mui/material";
import { CheckCircle } from "lucide-react";

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

  const profileLoading = profile.query.isLoading;

  const ROLE = profile.user?.role;

  const { data: absensiCount, isLoading, error, refetch } = useAbsensiCount();

  const count = absensiCount?.count || {};

  const stats = {
    totalHadir: count?.hadir ?? 0,
    totalAlpa: count?.alfa ?? 0,
    totalSakit: count?.sakit ?? 0,
    totalDispensasi: count?.izin ?? 0,
    totalTerlambat: count?.terlambat ?? 0,
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
        title={lang.text("intro") + "," + ` ${profile?.user?.name}` + "👋"}
        loadingTitle={profileLoading}
      >
        <Typography color="text.secondary">
          {lang.text("subTitleDashboard")}
        </Typography>
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
                isLoading={isLoading}
              />
              <ReportOverview
                selectedSchool={selectedSchool}
                stats={stats}
                isLoading={isLoading}
                changes={changes}
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
              isLoadingDashboard={isLoadingDashboard}
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
            <Card className="mb-2 mt-3">
              <CardHeader>
                <h3 className="font-semibold">Pilih Anak</h3>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {children.map((child: any) => {
                    const isSelected =
                      selectedStudentId === child.biodataSiswaId;

                    return (
                      <div
                        key={child.biodataSiswaId}
                        onClick={() =>
                          setSelectedStudentId(child.biodataSiswaId)
                        }
                        className={`
            relative cursor-pointer rounded-2xl border p-4
            transition-all hover:shadow-md
            ${
              isSelected
                ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                : "border-gray-200"
            }
          `}
                      >
                        {isSelected && (
                          <CheckCircle className="absolute right-3 top-3 h-5 w-5 text-primary" />
                        )}

                        <div className="flex items-center gap-4">
                          {/* <img
                            src={`https://i.pravatar.cc/150?u=${child.biodataSiswaId}`}
                            alt={child.name}
                            className="h-16 w-16 rounded-full object-cover"
                          /> */}
                          <Avatar sx={{ width: "60px", height: "60px" }} />

                          <div>
                            <h4 className="font-semibold text-lg">
                              {child.name} - {child.nis}
                            </h4>

                            <p className="text-muted-foreground">
                              {child.kelas || "Kelas"}
                            </p>

                            {isSelected && (
                              <span className="mt-1 inline-flex rounded-full bg-gray-100 px-0 py-1 text-xs text-gray-600">
                                Selected
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
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

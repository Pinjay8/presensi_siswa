import { lang } from "@/core/libs";
import { APP_CONFIG } from "@/core/configs";
import { TeacherTable } from "@/features/teacher";
import { DashboardPageLayout } from "@/features/_global";
import { ScanAttendanceTable } from "../containers/scan-attendance-table";

export const ScanAttendanceView = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("scanAttendanceMapel")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("scanAttendanceMapel"),
          url: "/scanAttendanceMapel",
        },
      ]}
      title={lang.text("scanAttendanceMapel")}
    >
      <ScanAttendanceTable />
      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};

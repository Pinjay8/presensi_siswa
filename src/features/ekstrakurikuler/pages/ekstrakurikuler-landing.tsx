import { lang } from "@/core/libs";
import { APP_CONFIG } from "@/core/configs";
import { CourseTable } from "@/features/course";
import { DashboardPageLayout } from "@/features/_global";
import { EkstrakurikulerTable } from "@/features/ekstrakurikuler";

export const EkstrakurikulerLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("ekstrakurikuler")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("ekstrakurikuler"),
          url: "/esktrakurikuler",
        },
      ]}
      title={lang.text("ekstrakurikuler")}
    >
      <EkstrakurikulerTable />
      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};

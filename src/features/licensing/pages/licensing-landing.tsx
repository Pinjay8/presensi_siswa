import { lang } from "@/core/libs";
import { APP_CONFIG } from "@/core/configs";
import { TeacherTable } from "@/features/teacher";
import { DashboardPageLayout } from "@/features/_global";
import { LicensingTable } from "@/features/licensing";

export const LicensingLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("LicensingData")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("LicensingData"),
          url: "/licensing",
        },
      ]}
      title={lang.text("LicensingData")}
    >
      <LicensingTable />
      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};

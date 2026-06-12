import { lang } from "@/core/libs";
import { APP_CONFIG } from "@/core/configs";
import { SchedulerTable } from "../containers";
import { DashboardPageLayout } from "@/features/_global";

export const SchedulerLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("scheduler")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("scheduler"),
          url: "/scheduler",
        },
      ]}
      title={lang.text("scheduler")}
    >
      <SchedulerTable />
      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};

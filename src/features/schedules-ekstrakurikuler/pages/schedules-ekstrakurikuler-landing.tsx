import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import { ScheduleLandingContent } from "../containers";

export const ScheduleEkstrakurikulerLanding = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("scheduleEkstrakurikuler")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("scheduleEkstrakurikuler"),
          url: "/schedules-ekstrakurikuler",
        },
      ]}
      title={lang.text("scheduleEkstrakurikuler")}
    >
      <ScheduleLandingContent />
      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};

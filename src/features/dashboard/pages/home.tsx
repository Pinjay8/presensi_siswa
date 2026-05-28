import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import { useProfile } from "@/features/profile";
import { SchoolDistribution } from "@/features/schools/pages/school-distribution";
import { SchoolUpdateDialog, SummaryHeaderSection } from "../containers";

export const HomePage = () => {
  const profile = useProfile();
  const isAdmin = profile?.user?.role === "admin";

  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("dashboard")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: "Dashboard",
          url: "/",
        },
      ]}
    >
      <SchoolDistribution />
      <SummaryHeaderSection />
      <div className="pb-16 sm:pb-0" />
      {isAdmin && <SchoolUpdateDialog />}
    </DashboardPageLayout>
  );
};
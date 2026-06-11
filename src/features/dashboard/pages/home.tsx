import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import { useProfile } from "@/features/profile";
import { SchoolDistribution } from "@/features/schools/pages/school-distribution";
import { SchoolUpdateDialog, SummaryHeaderSection } from "../containers";

export const HomePage = () => {
  const profile = useProfile();
  const isAdmin = profile?.user?.role === "admin";
  const isRole =
    profile?.user?.role === "siswa" || profile?.user?.role === "orangTua";

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
      <div className="pb-8" />

      {!isRole && <SummaryHeaderSection />}

      {/* {isAdmin && <SchoolUpdateDialog />} */}
    </DashboardPageLayout>
  );
};

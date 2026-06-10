import { lang } from "@/core/libs";
import { APP_CONFIG } from "@/core/configs";
import { LincensingCreationForm } from "../containers";
import { DashboardPageLayout } from "@/features/_global";

export const LicensingCreate = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("addLicensing")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("teacher"),
          url: "/licensing",
        },
        {
          label: lang.text("addLicensing"),
          url: `/licensing/create`,
        },
      ]}
      title={lang.text("addLicensing")}
    >
      <LincensingCreationForm />
      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};

import { lang } from "@/core/libs";
import { APP_CONFIG } from "@/core/configs";
import { CourseCreationForm } from "@/features/course";
import { DashboardPageLayout } from "@/features/_global";
import { EkstrakurikulerForm } from "../containers";

export const EkstrakurikulerCreate = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("addEkstrakurikuler")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("ekstrakurikuler"),
          url: "/ekstrakurikuler",
        },
        {
          label: lang.text("addEkstrakurikuler"),
          url: `/ekstrakurikuler/create`,
        },
      ]}
      title={lang.text("addEkstrakurikuler")}
    >
      <EkstrakurikulerForm />
      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};

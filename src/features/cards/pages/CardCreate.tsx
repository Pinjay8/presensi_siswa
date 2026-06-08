import { lang } from "@/core/libs";
import { APP_CONFIG } from "@/core/configs";
import { DashboardPageLayout } from "@/features/_global";
import { CardsForm } from "../containers/CardsForm";

export const CardCreate = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("addCards")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("teacher"),
          url: "/cards",
        },
        {
          label: lang.text("addCards"),
          url: `/cards/create`,
        },
      ]}
      title={lang.text("addCards")}
    >
      <CardsForm onClose={() => {}} />
      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};

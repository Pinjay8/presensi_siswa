import { lang } from "@/core/libs";
import { APP_CONFIG } from "@/core/configs";
import { DashboardPageLayout } from "@/features/_global";
import { CardViewTable } from "@/features/cards";

export const CardView = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("cards")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("cards"),
          url: "/cards",
        },
      ]}
      title={lang.text("cards")}
    >
      <CardViewTable />
      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};

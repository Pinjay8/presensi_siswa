import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
import { DashboardPageLayout, useParamDecode } from "@/features/_global";
import { Navigate } from "react-router-dom";
import { ParentCreationForm } from "../containers";

export const ParentCreate = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("createParent")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("parent"),
          url: "/parents",
        },
        {
          label: lang.text("createParent"),
          url: `/parents/create`,
        },
      ]}
      title={lang.text("createParent")}
    >
      <div className="pb-4" />
      <ParentCreationForm />
      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};

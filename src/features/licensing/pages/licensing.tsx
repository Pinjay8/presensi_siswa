import { lang } from "@/core/libs";
import { DashboardPageLayout } from "@/features/_global";
import { LincensingCreationForm } from "../containers";
import { LicensingLanding } from "./licensing-landing";

export const LicensingPage = () => {
  return (
    <DashboardPageLayout
      breadcrumbs={[
        {
          label: lang.text("createDispen"),
          url: "/licensing",
        },
      ]}
      title={lang.text("createDispen")}
    >
      <LincensingCreationForm />
      {/* <LicensingLanding /> */}

      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};

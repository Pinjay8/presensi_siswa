import { lang, simpleDecode } from "@/core/libs";
import { APP_CONFIG } from "@/core/configs";
import { Navigate, useParams } from "react-router-dom";
import { CourseCreationForm } from "@/features/course";
import { DashboardPageLayout } from "@/features/_global";
import { EkstrakurikulerForm } from "../containers";

export const EkstrakurikulerEdit = () => {
  const params = useParams();
  const decodeParams: { id: string; text: string } = JSON.parse(
    simpleDecode(params.id || ""),
  );

  if (!decodeParams?.id || !decodeParams?.text) {
    return <Navigate to="/404" replace />;
  }

  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("editEkstrakurikuler")} ${decodeParams?.text} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("ekstrakurikuler"),
          url: "/ekstrakurikuler",
        },
        {
          label: String(decodeParams?.text),
          url: `/ekstrakurikuler/edit/${params.id}`,
        },
      ]}
      title={lang.text("editEkstrakurikuler")}
    >
      <EkstrakurikulerForm />
      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};

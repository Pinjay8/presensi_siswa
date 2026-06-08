import { lang, simpleDecode } from "@/core/libs";
import { APP_CONFIG } from "@/core/configs";
import { DashboardPageLayout } from "@/features/_global";
import { CardsForm } from "../containers/CardsForm";
import { Navigate, useParams } from "react-router-dom";

export const CardEdit = () => {
  const params = useParams();
  const decodeParams: { id: string; text: string } = JSON.parse(
    simpleDecode(params.id || ""),
  );

  if (!decodeParams?.id || !decodeParams?.text) {
    return <Navigate to="/404" replace />;
  }
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("editCards")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("cards"),
          url: "/cards",
        },
        {
          label: lang.text("editCards"),
          url: `/cards/edit/${params.id}`,
        },
        {
          label: String(decodeParams?.text),
          url: `/cards/edit/${params.id}`,
        },
      ]}
      title={lang.text("editCards")}
    >
      <CardsForm onClose={() => {}} />
      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};

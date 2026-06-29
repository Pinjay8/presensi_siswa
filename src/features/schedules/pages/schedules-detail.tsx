import { buttonVariants, cn, lang, simpleDecode } from "@/core/libs";
import { APP_CONFIG } from "@/core/configs";
import { NavLink, Outlet, useParams } from "react-router-dom";
import { SchoolInformation } from "@/features/schools";
import { DashboardPageLayout } from "@/features/_global";
import { useMemo } from "react";
import { ScheduleDetail } from "../containers";

export const ScheduleDetailLanding = () => {
  const params = useParams();
  const decodeParams: { id: string; text: string } = JSON.parse(
    simpleDecode(params.id || ""),
  );

  return (
    <DashboardPageLayout
      siteTitle={`${decodeParams?.text} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("scheduleMapel"),
          url: `/schedules`,
        },
        {
          label: decodeParams?.text,
          url: `/schedules/${params?.id}`,
        },
      ]}
      title={lang.text("scheduleMapel")}
    >
      <div className="mb-4" />
      <ScheduleDetail id={decodeParams?.id} />
      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};

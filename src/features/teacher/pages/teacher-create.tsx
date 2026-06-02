import { lang } from "@/core/libs";
import { APP_CONFIG } from "@/core/configs";
import { TeacherCreationForm } from "../containers";
import { DashboardPageLayout } from "@/features/_global";

export const TeacherCreate = () => {
  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("addTeacher")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("teacher"),
          url: "/teachers",
        },
        {
          label: lang.text("addTeacher"),
          url: `/teachers/create`,
        },
      ]}
      title={lang.text("addTeacher")}
    >
      <TeacherCreationForm />
      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
};

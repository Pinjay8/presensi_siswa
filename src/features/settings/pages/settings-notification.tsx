import { lang } from "@/core/libs";
import { APP_CONFIG } from "@/core/configs";
import { DashboardPageLayout } from "@/features/_global";
import { Typography } from "@mui/material";
import { SettingsNotificationForm } from "../containers/settings-notification-form";

export const SettingsNotification = () => {
    return (
        <DashboardPageLayout
        siteTitle={`${lang.text("settings")} | ${APP_CONFIG.appName}`}
        breadcrumbs={[
            {
            label: lang.text("settings"),
            url: "/settings",
            }
            
        ]}
        title={lang.text("setting")}
        >
        <SettingsNotificationForm />
        <div className="pb-16 sm:pb-0" />
        </DashboardPageLayout>
    );
};
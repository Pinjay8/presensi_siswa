import { APP_CONFIG } from "@/core/configs/app";
import { MENU_CONFIG, USERMENU_CONFIG } from "@/core/configs/menu";
import {
  AuthPage,
  ForgetPassword,
  LoginPage,
  Logout,
  ResetPassword,
} from "@/features/auth";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage, RootPage } from "../dashboard";

// Load Component for Pages
import { CommingSoonPage, Default404, Vokadash } from "@/features/_global";

import { router } from "./router";

export const RootApp = () => {
  const sidebarMenus = MENU_CONFIG.staff;
  const usermenus = USERMENU_CONFIG.staff;

  return (
    <Vokadash
      appName={APP_CONFIG.appName}
      menus={sidebarMenus}
      usermenus={usermenus}
    >
      <RouterProvider router={router} />
    </Vokadash>
  );
};

export const App = () => {
  return <RootApp />;
};

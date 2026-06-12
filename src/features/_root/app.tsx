import { APP_CONFIG } from "@/core/configs/app";
import { MENU_CONFIG, USERMENU_CONFIG } from "@/core/configs/menu";
import { RouterProvider } from "react-router-dom";

// Load Component for Pages
import { Vokadash } from "@/features/_global";

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

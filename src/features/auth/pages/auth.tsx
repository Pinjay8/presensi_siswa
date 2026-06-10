import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/auth";
import { Images } from "@/core/utils";
import { AuthLayout } from "../components/auth-layout";
import { APP_CONFIG } from "@/core/configs";
import { lang } from "@/core/libs";
// import LogoPt from "public/public/Group.png";
import LogoPt from "@/core/assets/images/sekolah.jpg";

export const AuthPage = () => {
  const auth = useAuth();

  if (auth.isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return (
    <AuthLayout
      logo={Images.logo}
      image={LogoPt}
      title={APP_CONFIG.appName}
      description={lang.text("loginDesc")}
    >
      <Outlet />
    </AuthLayout>
  );
};

import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const useLicenseGuard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      const response = await originalFetch(...args);

      const url =
        typeof args[0] === "string"
          ? args[0]
          : args[0] instanceof Request
            ? args[0].url
            : "";

      // Jangan intercept endpoint license
      if (url.includes("/license/status") || url.includes("/license/upload")) {
        return response;
      }

      if (response.status === 402 || response.status === 403) {
        const role = localStorage.getItem("role");

        // Sudah berada di halaman tujuan? Jangan navigate lagi.
        if (
          (role === "admin" && location.pathname === "/license") ||
          (role !== "admin" && location.pathname === "/auth/login")
        ) {
          return response;
        }

        if (role === "admin") {
          navigate("/license", { replace: true });
        } else {
          navigate("/auth/login", {
            replace: true,
            state: {
              message:
                "License has expired. Please contact your administrator.",
            },
          });
        }
      }

      return response;
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, [navigate, location.pathname]);
};

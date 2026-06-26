import { Button, Input, Label, VokadashHead } from "@/core/libs";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { FormEventHandler, useState } from "react";
import { InputSecure, useAlert } from "@/features/_global";
import { lang } from "@/core/libs";
import { API_CONFIG, APP_CONFIG } from "@/core/configs";
import { Lock, Mail } from "lucide-react";
import { Typography } from "@mui/material";

export const LoginPage = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const alert = useAlert();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit: FormEventHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await auth.login({ email, password });

      const token = res?.data?.token;
      const role = (res?.data?.role ?? "").toLowerCase();

      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      // Cek license sebelum masuk dashboard
      const response = await fetch(`${API_CONFIG.baseUrl}/license/status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const license = await response.json();

      if (!license.data.isValid) {
        if (role === "admin") {
          navigate("/license", { replace: true });
        } else {
          alert.error("License belum aktif. Silakan hubungi administrator.");
          navigate("/auth/login", { replace: true });
        }

        return;
      }

      alert.success(lang.text("welcomeBack"));
      navigate("/", { replace: true });
    } catch (err: any) {
      alert.error(err?.message || lang.text("errSystem"));
    }
  };

  return (
    <form onSubmit={submit}>
      <VokadashHead>
        <title>{`${lang.text("login")} | ${APP_CONFIG.appName}`}</title>
      </VokadashHead>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email" className="font-semibold text-sm">
            {lang.text("email")}
          </Label>

          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />

            <Input
              id="email"
              type="email"
              placeholder={lang.text("inputEmail")}
              required
              value={email}
              onChange={({ target: { value } }) => setEmail(value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password" className="font-semibold text-sm">
              {lang.text("password")}
            </Label>
          </div>

          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"
              size={18}
            />

            <InputSecure
              id="password"
              required
              value={password}
              onChange={({ target: { value } }) => setPassword(value)}
              placeholder={lang.text("inputPassword")}
              className="pl-10"
            />
          </div>

          <div className="text-right">
            <Link
              to="/auth/forget-password"
              className="text-sm underline text-primary"
            >
              {lang.text("forgetPassword") + "?"}
            </Link>
          </div>
        </div>
        <Button
          type="submit"
          disabled={auth.isLoading}
          className="w-full bg-primary"
        >
          {auth.isLoading ? lang.text("pleaseWait") : lang.text("login")}
        </Button>
        <div className="flex gap-1">
          <p className="text-sm ">
            <span className=" font-medium opacity-50">
              {lang.text("doesntHaveAccount")}
            </span>{" "}
          </p>
          <span className="underline text-primary text-sm">
            {lang.text("callAdmin")}
          </span>
        </div>
      </div>
    </form>
  );
};

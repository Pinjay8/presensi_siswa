import { lang, VokadashHead } from "@/core/libs";
import { CheckCircle2 } from "lucide-react";
import { PropsWithChildren } from "react";

export interface AuthLayoutProps extends PropsWithChildren {
  title?: string;
  description?: string;
  image?: string;
  logo?: string;
  siteTitle?: string;
}

export const AuthLayout = ({
  description,
  title,
  children,
  image,
  logo,
  siteTitle,
}: AuthLayoutProps) => {
  return (
    <>
      {siteTitle && (
        <VokadashHead>
          <title>{siteTitle}</title>
        </VokadashHead>
      )}
      <div className="relative w-full lg:grid lg:grid-cols-2 min-h-[100svh]">
        <div className="relative z-10 flex min-h-[100svh] items-center justify-center py-12">
          <div className="mx-auto grid w-[420px] gap-2 px-4">
            {logo && (
              <div className="w-full flex-1 justify-center flex">
                <img
                  src={logo}
                  style={{
                    height: "170px",
                    width: "250px",
                    borderRadius: "5%",
                    objectFit: "contain",
                  }}
                />
              </div>
            )}

            {(title || description) && (
              <div className="grid gap-2 text-center">
                {title && <h1 className="text-3xl font-bold">{title}</h1>}
                {description && (
                  <p className="text-balance text-muted-foreground">
                    {description}
                  </p>
                )}
              </div>
            )}

            {children}
          </div>
        </div>
        <div className="relative hidden lg:block overflow-hidden">
          <img
            src={image}
            className="h-full w-full object-cover brightness-50 dark:brightness-[0.2] dark:grayscale"
          />

          {/* Overlay */}
          {/* <div className="absolute inset-0 bg-black/5" /> */}

          {/* Text Content */}
          <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-[#0B2A5B]/90 via-[#0B2A5B]/60 to-transparent">
            <div className="absolute bottom-8 left-8">
              <h1 className="text-4xl font-bold text-white">
                {lang.text("welcomeToSchool")}
              </h1>

              <p className="mt-2 text-base text-white/80">
                {lang.text("descriptionLogin")}
              </p>

              <ul className="mt-3 flex flex-wrap gap-4 text-sm text-white/80">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  Presensi
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  Terpercaya
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  Integritas
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

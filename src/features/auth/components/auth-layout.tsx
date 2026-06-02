import { VokadashHead } from "@/core/libs";
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
                    height: "140px",
                    width: "240px",
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
          <div className="absolute inset-0 bg-black/5" />

          {/* Text Content */}
          <div className="absolute bottom-10 left-10 z-10 max-w-lg text-white">
            <h1 className="text-4xl font-bold leading-tight">
              Welcome to Bio School
            </h1>

            <p className="mt-4 text-base text-white/80">
              Empowering students through innovation, education, and community
              excellence.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

import React, { PropsWithChildren } from "react";
import { CustomBreadcrumbs, CustomBreadcrumbsProps } from "../breadcrumbs";
import { Button, Skeleton, VokadashHead } from "@/core/libs";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";

export interface DashboardPageLayoutProps extends PropsWithChildren {
  title?: string;
  description?: string;
  breadcrumbs?: CustomBreadcrumbsProps["items"];
  siteTitle?: string;
  backButton?: boolean;
  onClickBack?: () => void;
  loadingTitle?: any;
}

export const DashboardPageLayout = React.memo(
  ({
    title,
    description,
    children,
    breadcrumbs = [],
    siteTitle,
    backButton,
    onClickBack,
    loadingTitle,
  }: DashboardPageLayoutProps) => {
    const navigate = useNavigate();

    const handleClickBack = () => {
      if (!onClickBack) return navigate(-1);
      onClickBack?.();
    };

    return (
      <>
        {siteTitle && (
          <VokadashHead>
            <title style={{ textTransform: "capitalize" }}>{siteTitle}</title>
          </VokadashHead>
        )}

        <div className="dashboard-page-layout flex flex-1 flex-col">
          {breadcrumbs?.length > 0 && (
            <div>
              <CustomBreadcrumbs items={breadcrumbs} />
            </div>
          )}
          <div className="flex flex-row gap-2 mb-2 items-center">
            {backButton && (
              <Button onClick={handleClickBack} variant="outline" size="icon">
                <ChevronLeft />
              </Button>
            )}
            <div>
              {title && (
                <div className="flex items-center">
                  {loadingTitle ? (
                    <Skeleton className="h-8 w-72" />
                  ) : (
                    <div className="flex flex-col">
                      <h1 className="dashboard-page-title text-lg font-semibold md:text-2xl capitalize">
                        {title}
                      </h1>
                    </div>
                  )}
                </div>
              )}
              {description && (
                <div className="flex items-center mt-2">
                  <p className="dashboard-page-title text-slate-400 text-sm font-normal">
                    {description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {children}
        </div>
      </>
    );
  },
);

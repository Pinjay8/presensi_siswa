import { CircularProgress } from "@mui/material";
import { Suspense, ReactNode } from "react";

export const Loadable = (children: ReactNode) => {
  return <Suspense fallback={<CircularProgress />}>{children}</Suspense>;
};

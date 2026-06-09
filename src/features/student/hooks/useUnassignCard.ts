import { cardsService } from "@/core/services/cards";
import { useAuth } from "@/features/auth";
import { useProfile } from "@/features/profile";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export interface UseCardAssignProps {
  id?: number | string;
}

export const useCardAssign = () => {
  const auth = useAuth();
  const profile = useProfile();

  const enabled = auth.isAuthenticated() && Boolean(profile.user?.id);

  const query = useQuery({
    enabled,
    queryKey: ["card-assign"],
    queryFn: () => cardsService.allAssign(),
  });

  const data = useMemo(() => query.data?.data, [query.data]);
  const isLoading = query.isLoading || query.isFetching || query.isPending;

  return {
    query,
    data,
    isLoading,
  };
};

import { cardsService } from "@/core/services/cards";
import { useAuth } from "@/features/auth";
import { useProfile } from "@/features/profile";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useCards = () => {
  const auth = useAuth();
  const profile: any = useProfile();

  const enabled = auth.isAuthenticated() && Boolean(profile.user?.id);

  const query = useQuery({
    queryKey: ["cards"],
    enabled,
    queryFn: async () => {
      const res = await cardsService.all();
      return res;
    },
  });

  const data = useMemo(() => query.data?.data || [], [query.data]);
  const isLoading = query.isLoading || query.isFetching || query.isPending;

  return {
    query,
    data,
    isLoading,
  };
};


import { cardsService } from "@/core/services/cards";
import { useAuth } from "@/features/auth";
import { useProfile } from "@/features/profile";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useCardById = (id?: any) => {
  const auth = useAuth();
  const profile: any = useProfile();

  const enabled =
    auth.isAuthenticated() && Boolean(profile.user?.id) && Boolean(id);

  const query = useQuery({
    queryKey: ["card", id],
    enabled,
    queryFn: async () => {
      const res = await cardsService.get(id as number);
      return res;
    },
  });

  const data = useMemo(() => query.data?.data ?? null, [query.data]);

  const isLoading = query.isLoading || query.isFetching || query.isPending;

  return {
    query,
    data,
    isLoading,
  };
};

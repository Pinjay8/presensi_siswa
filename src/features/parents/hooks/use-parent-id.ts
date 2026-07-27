import { userService } from "@/core/services";
import { useAuth } from "@/features/auth";
import { useProfile } from "@/features/profile";
import { useQuery } from "@tanstack/react-query";

interface Props {
    id?: string | number;
}

export const useParentById = ({ id }: Props) => {
    const auth = useAuth();
    const profile = useProfile();

    const enabled =
        auth.isAuthenticated() &&
        Boolean(profile.user?.id) &&
        Boolean(id);

    const query = useQuery({
        enabled,
        queryKey: ["parents", id],
        queryFn: () => userService.getParentsById(id! as number),
    });

    const isLoading =
        query.isLoading || query.isFetching || query.isPending;

    return {
        query,
        data: query.data?.data,
        isLoading,
    };
};
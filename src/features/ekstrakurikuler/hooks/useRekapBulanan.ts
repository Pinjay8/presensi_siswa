import { useQuery } from "@tanstack/react-query";
import { ekstrakurikulerService } from "@/core/services/ekstrakurikuler";

type Props = {
  id: number;
  page?: any;
  limit?: any;
};

export const useRekapBulanan = ({ id, page, limit }: Props) => {
  const query = useQuery({
    queryKey: ["rekap-bulanan-absensi", id],
    queryFn: () => ekstrakurikulerService.getRekapBulanan(id),

    // enabled: !!id,
  });

  return {
    query,
    data: query.data?.data ?? [],
  };
};

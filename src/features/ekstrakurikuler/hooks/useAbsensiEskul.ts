import { useQuery } from "@tanstack/react-query";
import { ekstrakurikulerService } from "@/core/services/ekstrakurikuler";

type Props = {
  id: number;
  dayofWeek?: number;
  jamMulai?: string;
  page?: any;
  limit?: any;
};

export const useAbsensiEkskul = ({
  id,
  dayofWeek,
  jamMulai,
  page,
  limit,
}: Props) => {
  const query = useQuery({
    queryKey: ["ekskul-absensi", id, dayofWeek, jamMulai],
    queryFn: () =>
      ekstrakurikulerService.getAbsensi(id, {
        ...(dayofWeek !== undefined && { dayofWeek }),
        ...(jamMulai && { jamMulai }),
        ...(page && { page }),
        ...(limit && { limit }),
      }),

    // enabled: !!id,
  });

  return {
    query,
    data: query.data?.data ?? [],
  };
};

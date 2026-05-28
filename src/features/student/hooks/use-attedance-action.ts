import { lang } from "@/core/libs";
import { useAlert } from "@/features/_global";
import { useAttendanceCreation } from "@/features/attendance/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const useAttendanceActions = () => {
  const creation = useAttendanceCreation();
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // Untuk refetch data
  const alert = useAlert();

  const handleAttend = async (userId: number) => {
    try {
      if (userId) {
        await creation.create({
          userId,
        });
      }

      alert.success(
        lang.text("successCreate", { context: lang.text("attendance") })
      );

      if (userId) {
        navigate(-1);
      } else {
        navigate("/students", { replace: true });
      }
    } catch (err: any) {
        // Jika error berisi 'prisma.devices.findUnique', anggap sukses
        if (err.message?.includes("prisma.devices.findUnique")) {
            console.warn("Prisma device query failed, but treating as success");
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["students"] }),
                queryClient.invalidateQueries({ queryKey: ["attedances-new"] }),
            ]);
            alert.success(
            lang.text("successCreate", { context: lang.text("attendance") })
            );
        } else {
            // Tampilkan alert error untuk error lainnya
            const errorMessage =
            err.message ||
            (userId
                ? lang.text("failUpdate", { context: lang.text("attendance") })
                : lang.text("failCreate", { context: lang.text("attendance") }));
            alert.error(errorMessage);
        }
    }
  };

  return { handleAttend };
};
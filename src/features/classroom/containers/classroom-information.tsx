import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/libs";
import { useClassroomDetail } from "../hooks";
import { BarChart, Users } from "lucide-react";
import { lang } from "@/core/libs";
import { useBiodata } from "@/features/user/hooks";
import { InfoItem } from "@/features/_global";

export interface ClassroomInformationProps {
  id?: number;
}

export const ClassroomInformation = (props: ClassroomInformationProps) => {
  const detail = useClassroomDetail({ id: Number(props.id) });
  const student = useBiodata();

  const students = student.data?.filter((d) => {
    const studentSchoolId = Number(d?.user?.sekolah?.id);
    const studentClassroomId = Number(d?.kelas?.id);

    return (
      studentSchoolId === Number(detail.data?.sekolahId) &&
      studentClassroomId === Number(props?.id)
    );
  });

  return (
    <div className="grid grid-cols-1 gap-4">
      <div>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{detail.data?.namaKelas || "-"}</CardTitle>
            <CardDescription>{`${detail?.data?.Sekolah?.namaSekolah || "-"}`}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <InfoItem
                icon={<Users size={24} />}
                label={lang.text("student")}
                value={String(students.length)}
              />
              <InfoItem
                icon={<BarChart size={24} />}
                label={lang.text("level")}
                value={detail.data?.level || "-"}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

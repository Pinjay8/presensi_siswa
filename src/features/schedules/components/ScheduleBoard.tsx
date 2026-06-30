import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  lang,
} from "@/core/libs";
import { School2, Pen, Trash } from "lucide-react";

interface ScheduleItem {
  id: number;
  hari: string;
  jamMulai: string;
  jamSelesai: string;
  mataPelajaran: {
    id: number;
    namaMataPelajaran: string;
  };
  guru: {
    id: number;
    namaGuru: string;
  };
}

interface ScheduleBoardProps {
  groupedByDay: Record<string, ScheduleItem[]>;
  selectedDays: string[];
  daysOrder: string[];
  selectedClassId: number;
  classroom: any[];
  isRole: boolean;
  isRoleGuru: boolean;
  isRoleSiswa: boolean;

  showRef: React.MutableRefObject<any>;

  handleShowQr: (item: ScheduleItem) => void;
  openEditModal: (day: string, item: ScheduleItem) => void;
  handleDelete: (item: ScheduleItem) => void;
}

export function ScheduleBoard({
  groupedByDay,
  selectedDays,
  daysOrder,
  selectedClassId,
  classroom,
  isRole,
  isRoleGuru,
  isRoleSiswa,
  showRef,
  handleShowQr,
  openEditModal,
  handleDelete,
}: ScheduleBoardProps) {
  if (selectedClassId === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-lg border">
        <p className="text-muted-foreground">{lang.text("mustSelectClass")}</p>
      </div>
    );
  }

  if (Object.keys(groupedByDay).length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-lg border">
        <p className="text-muted-foreground">
          {lang.text("noScheduleForThisClass")}
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-6 shadow-md">
      <h1 className="mb-6 flex items-center gap-3 text-2xl font-bold">
        <School2 />
        {classroom.find((c: any) => c.id === selectedClassId)?.namaKelas ??
          "Kelas tidak ditemukan"}
      </h1>

      <div className="grid xl:grid-cols-2 gap-4">
        {daysOrder
          .filter((day) => selectedDays.includes(day))
          .map((day) => (
            <div key={day} className="rounded-lg border p-4">
              <h2 className="mb-4 text-xl font-bold">{day}</h2>

              {groupedByDay[day]?.length ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{lang.text("time")}</TableHead>
                      <TableHead>{lang.text("nameMapel")}</TableHead>
                      <TableHead>{lang.text("nameTeacher")}</TableHead>

                      {!isRoleSiswa && (
                        <TableHead>{lang.text("actions")}</TableHead>
                      )}
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {groupedByDay[day].map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          {item.jamMulai} - {item.jamSelesai}
                        </TableCell>

                        <TableCell>
                          {item.mataPelajaran.namaMataPelajaran}
                        </TableCell>

                        <TableCell>{item.guru.namaGuru}</TableCell>

                        {!isRoleSiswa && (
                          <TableCell className="flex gap-2">
                            {!isRole && (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleShowQr(item)}
                              >
                                Show QR
                              </Button>
                            )}

                            {!isRoleGuru && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditModal(day, item)}
                              >
                                <Pen />
                              </Button>
                            )}

                            {!isRoleGuru && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(item.id as number)}
                              >
                                <Trash />
                              </Button>
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="py-8 text-center text-muted-foreground">
                  Tidak ada jadwal untuk hari {day}.
                </p>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

import {
  Badge,
  Button,
  lang,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Checkbox,
  cn,
} from "@/core/libs";
import { useAlert, useVokadialog, Vokadialog } from "@/features/_global";
import { useRef, useState, useEffect, useMemo } from "react";
import { useScheduleCreation, useSchedulesEkstrakurikuler } from "../hooks";
import { Pen, Plus, Trash } from "lucide-react";
import { QrAttendanceDialog } from "../components/QrAttendanceDialog";
import { useProfile } from "@/features/profile";
import { useEkstrakurikuler } from "@/features/ekstrakurikuler";
import { useGetAllEkstrakurikuler } from "@/features/ekstrakurikuler/hooks/useGetAllEkestrakurikuler";
import { ScheduleEkstrakurikulerFormDialog } from "../components/ScheduleEkstrakurikulerForm";

interface ScheduleItem {
  id: number;
  hari: string;
  jamMulai: string;
  jamSelesai: string;
  mataPelajaran: {
    id: number;
    namaMataPelajaran: string;
    kelasId: number;
    kelas: { id: number; namaKelas: string } | null;
  };
  guru: { id: number; namaGuru: string };
  createdAt: string;
  updatedAt: string;
}

interface ScheduleItem {
  id: number;
  dayOfWeek: number;
  jamMulai: string;
  jamSelesai: string;
  ekstrakurikuler: {
    id: number;
    nama: string;
    jenis: string;
  };
}

const daysOrder = ["SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU"];
const DAY_NAMES: Record<number, string> = {
  1: "SENIN",
  2: "SELASA",
  3: "RABU",
  4: "KAMIS",
  5: "JUMAT",
  6: "SABTU",
  // 7: "MINGGU",
};

export function ScheduleLandingContent() {
  const alert = useAlert();
  const creation = useScheduleCreation();
  const dialog = useVokadialog();
  const showRef = useRef<typeof dialog.open>();
  showRef.current = dialog.open;
  const [id, setId] = useState<number>(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [editScheduleId, setEditScheduleId] = useState<number>(0);
  const [searchCourse, setSearchCourse] = useState<string>("");
  const [searchTeacher, setSearchTeacher] = useState<string>("");
  const [selectedClassId, setSelectedClassId] = useState<number>(0); // 0 for All Classes
  const [selectedDays, setSelectedDays] = useState<string[]>(daysOrder); // Default to all days
  const [isDayFilterOpen, setIsDayFilterOpen] = useState(false);
  const [selectedKelasIdForAdd, setSelectedKelasIdForAdd] = useState<number>(0); // 0 for no class selected in add modal
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const teacherSearchInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    dayOfWeek: 1,
    jamMulai: "",
    jamSelesai: "",
  });

  const schedules = useSchedulesEkstrakurikuler();
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const { data: ekskulData } = useGetAllEkstrakurikuler();

  const [selectedQr, setSelectedQr] = useState<{
    kelasId: number;
    mataPelajaranId: number;
    namaKelas: string;
    namaMapel: string;
  } | null>(null);

  const profile = useProfile();
  const isRole =
    profile?.user?.role === "admin" ||
    profile?.user?.role === "superAdmin" ||
    profile?.user?.role === "siswa" ||
    profile?.user?.role === "orangTua";

  const isAdmin =
    profile?.user?.role === "admin" || profile?.user?.role === "superAdmin";

  const [qrCode, setQrCode] = useState("");

  const groupedByDay = useMemo(() => {
    const result: Record<string, ScheduleItem[]> = {};

    daysOrder.forEach((day) => {
      result[day] = [];
    });

    schedules?.data?.forEach((item: ScheduleItem) => {
      const dayName = DAY_NAMES[item.dayOfWeek];

      if (!result[dayName]) {
        result[dayName] = [];
      }

      result[dayName].push(item);
    });

    return result;
  }, [schedules?.data]);

  // Restore focus to course search input
  useEffect(() => {
    if (
      searchInputRef.current &&
      document.activeElement !== searchInputRef.current
    ) {
      searchInputRef.current.focus();
    }
  }, [searchCourse]);

  // Restore focus to teacher search input
  useEffect(() => {
    if (
      teacherSearchInputRef.current &&
      document.activeElement !== teacherSearchInputRef.current
    ) {
      teacherSearchInputRef.current.focus();
    }
  }, [searchTeacher]);

  const handleAddSchedule = async () => {
    console.log(formData);
    // if (
    //   !formData.mataPelajaranId ||
    //   !formData.guruId ||
    //   !formData.hari ||
    //   !formData.jamMulai ||
    //   !formData.jamSelesai
    // ) {
    //   alert.error("Semua field harus diisi");
    //   return;
    // }

    // if (selectedKelasIdForAdd === 0) {
    //   alert.error("Pilih kelas terlebih dahulu");
    //   return;
    // }

    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (
      !timeRegex.test(formData.jamMulai) ||
      !timeRegex.test(formData.jamSelesai)
    ) {
      alert.error("Format waktu harus HH:mm (contoh: 08:40)");
      return;
    }

    const startTime = new Date(`1970-01-01T${formData.jamMulai}:00`);
    const endTime = new Date(`1970-01-01T${formData.jamSelesai}:00`);
    if (endTime <= startTime) {
      alert.error("Jam selesai harus setelah jam mulai");
      return;
    }

    const payload = {
      ...formData,
    };
    try {
      // await creation.create(payload);
      await creation.create({
        ekskulId: selectedEkskulId,
        data: payload,
      });
      alert.success(
        lang.text("successful", {
          context: lang.text("scheduleSuccessCreate", { context: "" }),
        }),
      );
      schedules.query.refetch();
      setIsAddModalOpen(false);
      // setFormData({

      // });
      setFormData({
        dayOfWeek: 1,
        jamMulai: "",
        jamSelesai: "",
      });
      setSearchCourse("");
      setSearchTeacher("");
      setSelectedKelasIdForAdd(0);
    } catch (err: any) {
      alert.error(
        err?.message ||
          lang.text("failed", {
            context: lang.text("scheduleFailCreate", { context: "" }),
          }),
      );
    }
  };

  const handleEditSchedule = async () => {
    // if (
    //   !formData.mataPelajaranId ||
    //   !formData.guruId ||
    //   !formData.hari ||
    //   !formData.jamMulai ||
    //   !formData.jamSelesai
    // ) {
    //   alert.error("Semua field harus diisi");
    //   return;
    // }

    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (
      !timeRegex.test(formData.jamMulai) ||
      !timeRegex.test(formData.jamSelesai)
    ) {
      alert.error("Format waktu harus HH:mm (contoh: 08:40)");
      return;
    }

    const startTime = new Date(`1970-01-01T${formData.jamMulai}:00`);
    const endTime = new Date(`1970-01-01T${formData.jamSelesai}:00`);
    if (endTime <= startTime) {
      alert.error("Jam selesai harus setelah jam mulai");
      return;
    }

    const payload = { ...formData };
    try {
      // await creation.update(editScheduleId, payload);
      await creation.update(selectedEkskulId, editScheduleId, payload);
      alert.success(
        lang.text("successful", {
          context: lang.text("scheduleSuccessUpdate", { context: "" }),
        }),
      );
      schedules.query.refetch();
      setIsEditModalOpen(false);
      // setFormData({

      // });
      setSearchCourse("");
      setSearchTeacher("");
    } catch (err: any) {
      alert.error(
        err?.message ||
          lang.text("failed", {
            context: lang.text("scheduleFailUpdate", { context: "" }),
          }),
      );
    }
  };

  const openAddModal = () => {
    setSelectedDay("");

    setFormData({
      dayOfWeek: 1,
      jamMulai: "",
      jamSelesai: "",
    });
    setSearchCourse("");
    setSearchTeacher("");
    setSelectedKelasIdForAdd(0);
    setIsAddModalOpen(true);
  };

  const qrRef = useRef<HTMLDivElement>(null);

  const openEditModal = (day: string, schedule: ScheduleItem) => {
    setSelectedDay(day);
    setEditScheduleId(schedule.id);

    setSelectedEkskulId(schedule.ekstrakurikuler.id);

    setFormData({
      dayOfWeek: schedule.dayOfWeek,
      jamMulai: schedule.jamMulai,
      jamSelesai: schedule.jamSelesai,
    });

    setIsEditModalOpen(true);
  };

  const [selectedEkskulId, setSelectedEkskulId] = useState<number>(0);
  const [deleteData, setDeleteData] = useState({
    ekskulId: 0,
    jadwalId: 0,
  });

  const handleDeleteSchedule = async () => {
    try {
      await creation.delete(deleteData.ekskulId, deleteData.jadwalId);

      alert.success(
        lang.text("successful", {
          context: lang.text("successful", {
            context: lang.text("jadwalEkstrakurikuler"),
          }),
        }),
      );

      dialog.close();
      schedules.query.refetch();
    } catch (err: any) {
      alert.error(
        err?.message ||
          lang.text("failed", {
            context: lang.text("successful", {
              context: lang.text("jadwalEkstrakurikuler"),
            }),
          }),
      );
    }
  };

  const handleCancel = () => {
    setIsAddModalOpen(false);

    setFormData({
      dayOfWeek: 0,
      jamMulai: "",
      jamSelesai: "",
    });

    setSelectedEkskulId(0);
    setSelectedKelasIdForAdd(0);
  };

  // Render loading state
  if (!schedules?.data || schedules.isLoading) {
    return (
      <div className="w-full h-[400px] border-dashed border-black/10 rounded-md flex items-center justify-center text-center">
        <p className="text-center">{lang.text("loadingScheduleMapel")}</p>
      </div>
    );
  }

  return (
    <>
      <Vokadialog
        visible={dialog.visible}
        onOpenChange={(open) => {
          if (!open) dialog.close();
        }}
        title={"Konfirmasi Hapus"}
        content={lang.text("deleteConfirmationDesc", { context: "tersebut" })}
        footer={
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={handleDeleteSchedule} variant="destructive">
              {lang.text("delete")}
            </Button>
            <Button onClick={dialog.close} variant="outline">
              {lang.text("cancel")}
            </Button>
          </div>
        }
      />

      <ScheduleEkstrakurikulerFormDialog
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        title="Tambah Jadwal"
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleAddSchedule}
        onCancel={handleCancel}
        showEkskul
        selectedEkskulId={selectedEkskulId}
        setSelectedEkskulId={setSelectedEkskulId}
        ekskulData={ekskulData}
      />

      <ScheduleEkstrakurikulerFormDialog
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        title="Edit Jadwal"
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleEditSchedule}
        onCancel={() => setIsEditModalOpen(false)}
      />

      <div className="mt-5 mb-8">
        <div
          className={cn(
            "w-full mb-4 flex items-center",
            isAdmin ? "justify-between" : "justify-end",
          )}
        >
          {isAdmin && (
            <div className="flex gap-2">
              <Button variant="default" onClick={openAddModal}>
                <Plus /> {lang.text("addExtracurricularSchedule")}
              </Button>
            </div>
          )}
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="py-2.5">
              <span>{lang.text("totalSchedules")}:</span>
              <span className="ml-2">{schedules.data.length}</span>
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          {daysOrder
            .filter((day) => selectedDays.includes(day))
            .map((day) => (
              <div key={day} className="border rounded-lg p-4 shadow-sm">
                <h2 className="text-xl font-bold mb-4">{day}</h2>

                {groupedByDay[day]?.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{lang.text("time")}</TableHead>
                        <TableHead>{lang.text("extracurricular")}</TableHead>
                        <TableHead>{lang.text("type")}</TableHead>
                        {isAdmin && (
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

                          <TableCell>{item.ekstrakurikuler.nama}</TableCell>

                          <TableCell>{item.ekstrakurikuler.jenis}</TableCell>

                          {isAdmin && (
                            <TableCell className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditModal(day, item)}
                              >
                                <Pen />
                              </Button>

                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  setDeleteData({
                                    ekskulId: item.ekstrakurikuler.id,
                                    jadwalId: item.id,
                                  });

                                  showRef.current?.();
                                }}
                              >
                                <Trash />
                              </Button>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-gray-500">
                    {lang.text("noScheduleForDay", { day })}
                  </p>
                )}
              </div>
            ))}
        </div>
      </div>
      <QrAttendanceDialog
        open={isQrModalOpen}
        onOpenChange={setIsQrModalOpen}
        qrCode={qrCode}
        selectedQr={selectedQr}
      />
    </>
  );
}

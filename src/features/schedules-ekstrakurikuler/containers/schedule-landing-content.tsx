import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  lang,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Checkbox,
} from "@/core/libs";
import { useAlert, useVokadialog, Vokadialog } from "@/features/_global";
import { useCourse } from "@/features/course";
import { useBiodataGuru } from "@/features/user";
import { useRef, useState, useEffect, useMemo } from "react";
import {
  useScheduleCreation,
  useSchedules,
  useSchedulesEkstrakurikuler,
} from "../hooks";
import {
  CircleSlashIcon,
  Divide,
  Download,
  Pen,
  Plus,
  School,
  School2,
  Trash,
  Upload,
  UploadCloud,
} from "lucide-react";
import { FaFileExcel, FaRestroom } from "react-icons/fa";
import * as XLSX from "xlsx";
import { useClassroom } from "@/features/classroom";
import { CircularProgress, Divider } from "@mui/material";
import { teacherService } from "@/core/services/teacher";
import QRCode from "react-qr-code";
import { QrAttendanceDialog } from "../components/QrAttendanceDialog";
import { useProfile } from "@/features/profile";
import { useEkstrakurikuler } from "@/features/ekstrakurikuler";
import { useGetAllEkstrakurikuler } from "@/features/ekstrakurikuler/hooks/useGetAllEkestrakurikuler";

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

interface NewScheduleForm {
  mataPelajaranId: number;
  kelasId: number;
  guruId: number;
  hari: string;
  jamMulai: string;
  jamSelesai: string;
}

interface BulkSchedule {
  namaKelas: string;
  namaMataPelajaran: string;
  namaGuru: string;
  hari: string;
  jamMulai: string;
  jamSelesai: string;
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

const daysOrder = ["SENIN", "SELASA", "RABU", "KAMIS", "JUMAT"];
const DAY_NAMES: Record<number, string> = {
  1: "SENIN",
  2: "SELASA",
  3: "RABU",
  4: "KAMIS",
  5: "JUMAT",
  6: "SABTU",
  7: "MINGGU",
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
  // const [formData, setFormData] = useState<NewScheduleForm>({
  //   mataPelajaranId: 0,
  //   guruId: 0,
  //   kelasId: 0,
  //   hari: "",
  //   jamMulai: "",
  //   jamSelesai: "",
  // });

  const [formData, setFormData] = useState({
    dayOfWeek: 1,
    jamMulai: "",
    jamSelesai: "",
  });

  const courses = useCourse();
  const teachers = useBiodataGuru();
  // const schedules = useSchedules();
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

  const handleShowQr = async (item: any) => {
    try {
      // console.log("QR ITEM", item);

      const payload = {
        kelasId: item.kelasId,
        mataPelajaranId: item.mataPelajaranId,
      };

      // console.log("QR PAYLOAD", payload);

      setSelectedQr({
        kelasId: item.kelasId,
        mataPelajaranId: item.mataPelajaranId,
        namaKelas: item.kelas?.namaKelas ?? "-",
        namaMapel: item.mataPelajaran.namaMataPelajaran,
      });

      setIsQrModalOpen(true);

      const result = await teacherService.qrCodeGenerate(payload);

      // console.log("QR RESULT", result);

      setQrCode(result?.data?.qrCodeData ?? result?.collection?.qrCode ?? "");
    } catch (err: any) {
      alert.error(err?.message);
    }
  };
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

  // Memoize filtered courses
  const filteredCourses = useMemo(() => {
    let filtered =
      courses?.data?.filter((course: any) =>
        course.namaMataPelajaran
          .toLowerCase()
          .includes(searchCourse.toLowerCase()),
      ) || [];

    // When adding a schedule, further filter by selectedKelasIdForAdd
    if (isAddModalOpen && selectedKelasIdForAdd !== 0) {
      filtered = filtered.filter(
        (course: any) => course.kelasId === selectedKelasIdForAdd,
      );
    }

    return filtered;
  }, [courses?.data, searchCourse, isAddModalOpen, selectedKelasIdForAdd]);

  // Memoize filtered teachers
  const filteredTeachers = useMemo(() => {
    return (
      teachers?.data?.filter((teacher: any) =>
        teacher.namaGuru.toLowerCase().includes(searchTeacher.toLowerCase()),
      ) || []
    );
  }, [teachers?.data, searchTeacher]);

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

  // Handle keydown to prevent focus shift
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["ArrowDown", "ArrowUp", "Enter"].includes(e.key)) {
      e.preventDefault();
    }
  };

  // Handle day checkbox toggle
  const handleDayToggle = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  // Handle "All Days" checkbox toggle
  const handleAllDaysToggle = () => {
    setSelectedDays((prev) =>
      prev.length === daysOrder.length ? [] : [...daysOrder],
    );
  };

  const handleConfirmDelete = async () => {
    if (id === 0) {
      alert.error("Anda perlu ID");
      return;
    }
    try {
      await creation.delete(id);
      alert.success(
        lang.text("successful", {
          context: lang.text("dataSuccessDelete", { context: "" }),
        }),
      );
      schedules.query.refetch();
      dialog.close();
    } catch (err: any) {
      // alert.error("Error deleting schedule:", err);
      alert.error(
        err?.message ||
          lang.text("failed", {
            context: lang.text("dataFailDelete", { context: "" }),
          }),
      );
    }
  };

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
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle style={{ marginTop: "20px" }}>
              {lang.text("addSchedule")}
            </DialogTitle>
          </DialogHeader>
          <Divider />
          <div className="grid gap-3 py-4 pt-0">
            <div className="grid gap-2">
              <label>Ekstrakurikuler</label>

              <Select
                value={
                  selectedEkskulId === 0 ? "" : selectedEkskulId.toString()
                }
                onValueChange={(value) => setSelectedEkskulId(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Ekstrakurikuler" />
                </SelectTrigger>

                <SelectContent>
                  {ekskulData?.data?.map((item: any) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label>Hari</label>

              <Select
                value={formData.dayOfWeek.toString()}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    dayOfWeek: parseInt(value),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Hari" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="1">Senin</SelectItem>
                  <SelectItem value="2">Selasa</SelectItem>
                  <SelectItem value="3">Rabu</SelectItem>
                  <SelectItem value="4">Kamis</SelectItem>
                  <SelectItem value="5">Jumat</SelectItem>
                  <SelectItem value="6">Sabtu</SelectItem>
                  <SelectItem value="7">Minggu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <label>Jam Mulai</label>

              <Input
                type="time"
                value={formData.jamMulai}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    jamMulai: e.target.value,
                  })
                }
              />
            </div>

            <div className="grid gap-2">
              <label>Jam Selesai</label>

              <Input
                type="time"
                value={formData.jamSelesai}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    jamSelesai: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddSchedule}>Simpan</Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddModalOpen(false);
                setFormData({
                  dayOfWeek: 0,
                  jamMulai: "",
                  jamSelesai: "",
                });
                setSelectedKelasIdForAdd(0);
              }}
            >
              Batal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Jadwal</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* <div className="grid gap-2">
              <label>Ekstrakurikuler</label>

              <Select
                value={
                  selectedEkskulId === 0 ? "" : selectedEkskulId.toString()
                }
                onValueChange={(value) => setSelectedEkskulId(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Ekstrakurikuler" />
                </SelectTrigger>

                <SelectContent>
                  {ekskulData?.data?.map((item: any) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}
            <div className="grid gap-2">
              <label>Hari</label>

              <Select
                value={formData.dayOfWeek.toString()}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    dayOfWeek: parseInt(value),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Hari" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="1">Senin</SelectItem>
                  <SelectItem value="2">Selasa</SelectItem>
                  <SelectItem value="3">Rabu</SelectItem>
                  <SelectItem value="4">Kamis</SelectItem>
                  <SelectItem value="5">Jumat</SelectItem>
                  <SelectItem value="6">Sabtu</SelectItem>
                  <SelectItem value="7">Minggu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <label>Jam Mulai</label>

              <Input
                type="time"
                value={formData.jamMulai}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    jamMulai: e.target.value,
                  })
                }
              />
            </div>

            <div className="grid gap-2">
              <label>Jam Selesai</label>

              <Input
                type="time"
                value={formData.jamSelesai}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    jamSelesai: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleEditSchedule}>Simpan</Button>

            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Batal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* <Dialog open={isDayFilterOpen} onOpenChange={setIsDayFilterOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pilih Hari</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="all-days"
                checked={selectedDays.length === daysOrder.length}
                onCheckedChange={handleAllDaysToggle}
              />
              <label htmlFor="all-days">Semua Hari</label>
            </div>
            {daysOrder.map((day) => (
              <div key={day} className="flex items-center gap-2">
                <Checkbox
                  id={day}
                  checked={selectedDays.includes(day)}
                  onCheckedChange={() => handleDayToggle(day)}
                />
                <label htmlFor={day}>{day}</label>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDayFilterOpen(false)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}

      <div className="mt-5 mb-8">
        <div className="w-full mb-4 flex justify-between items-center">
          <div className="flex gap-2">
            <Button variant="outline" onClick={openAddModal}>
              Tambah Jadwal Ekstrakurikuler <Plus />
            </Button>
            {/* <div className="mx-2 h-[36px] py-1 flex items-center justify-center">
              <p>atau</p>
            </div> */}
            {/* <Button
              className="text-green-300 border border-green-700"
              variant="outline"
              onClick={handleDownloadTemplate}
            >
              Unduh Template Excel <Download />
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsUploadModalOpen(true)}
            >
              Unggah Excel <UploadCloud />
            </Button> */}
          </div>
          <div className="flex items-center gap-4">
            {/* <Select
              onValueChange={(value) => setSelectedClassId(parseInt(value))}
              value={selectedClassId.toString()}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Pilih Kelas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Semua Kelas</SelectItem>
                {classData.map((kelas: any) => (
                  <SelectItem key={kelas.id} value={kelas.id.toString()}>
                    {kelas.namaKelas}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="w-[200px] justify-between"
              onClick={() => setIsDayFilterOpen(true)}
            >
              {selectedDays.length === daysOrder.length
                ? "Semua Hari"
                : selectedDays.length === 0
                  ? "Pilih Hari"
                  : selectedDays.join(", ")}
              <span>▼</span>
            </Button> */}
            <Badge variant="outline" className="py-2.5">
              <span>Jumlah Jadwal:</span>
              <span className="ml-2">{schedules.data.length}</span>
            </Badge>
          </div>
        </div>
        {/* <div className="grid gap-8">
          {Object.keys(groupedByClassAndDay).length > 0 &&
          selectedDays.length > 0 ? (
            Object.keys(groupedByClassAndDay)
              .filter(
                (kelasId) =>
                  selectedClassId === 0 ||
                  parseInt(kelasId) === selectedClassId,
              )
              .map((kelasId) => {
                const classSchedules = groupedByClassAndDay[parseInt(kelasId)];
                if (!classSchedules) {
                  console.warn(`No schedules found for kelasId: ${kelasId}`);
                  return null;
                }
                return (
                  <div
                    key={kelasId}
                    className="border rounded-lg p-6 shadow-md"
                  >
                    <h1 className="flex gap-5 text-2xl font-bold mb-6">
                      <School2 /> Kelas:{" "}
                      {classData.find((k: any) => k.id === parseInt(kelasId))
                        ?.namaKelas || `Kelas ${kelasId}`}
                    </h1>
                    <div className="grid grid-cols-2 gap-4">
                      {daysOrder
                        .filter((day) => selectedDays.includes(day))
                        .map((day) => (
                          <div
                            key={day}
                            className="border rounded-lg p-4 shadow-sm"
                          >
                            <h2 className="text-xl font-bold mb-4">{day}</h2>
                            {classSchedules[day] &&
                            classSchedules[day].length > 0 ? (
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>{lang.text("time")}</TableHead>
                                    <TableHead>
                                      {lang.text("nameMapel")}
                                    </TableHead>
                                    <TableHead>
                                      {lang.text("nameTeacher")}
                                    </TableHead>
                                    <TableHead>
                                      {lang.text("actions")}
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {classSchedules[day].map((item) => (
                                    <TableRow key={item.id}>
                                      <TableCell>{`${item.jamMulai} - ${item.jamSelesai}`}</TableCell>
                                      <TableCell>
                                        {item.mataPelajaran.namaMataPelajaran}
                                      </TableCell>
                                      <TableCell>
                                        {item.guru.namaGuru}
                                      </TableCell>
                                      <TableCell className="flex gap-2">
                                        {!isRole && (
                                          <Button
                                            variant="default"
                                            size="sm"
                                            // startIcon={<QrCode />}
                                            onClick={() => handleShowQr(item)}
                                          >
                                            Show QR
                                          </Button>
                                        )}
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() =>
                                            openEditModal(day, item)
                                          }
                                        >
                                          <Pen />
                                        </Button>
                                        <Button
                                          variant="destructive"
                                          size="sm"
                                          onClick={() => {
                                            setId(item.id);
                                            showRef.current?.();
                                          }}
                                        >
                                          <Trash />
                                        </Button>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            ) : (
                              <p className="text-gray-500">
                                No schedule for {day}
                              </p>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                );
              })
          ) : (
            <p className="text-gray-500 text-center">
              {selectedDays.length === 0
                ? "Pilih setidaknya satu hari untuk menampilkan jadwal."
                : "Tidak ada jadwal tersedia."}
            </p>
          )}
        </div> */}
        <div className="grid grid-cols-2 gap-4">
          {daysOrder
            .filter((day) => selectedDays.includes(day))
            .map((day) => (
              <div key={day} className="border rounded-lg p-4 shadow-sm">
                <h2 className="text-xl font-bold mb-4">{day}</h2>

                {groupedByDay[day]?.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Jam</TableHead>
                        <TableHead>Ekskul</TableHead>
                        <TableHead>Jenis</TableHead>
                        {isAdmin && <TableHead>Aksi</TableHead>}
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
                  <p className="text-gray-500">No schedule for {day}</p>
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

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
} from "@/core/libs";
import { Divider } from "@mui/material";
type AddScheduleDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  classData: any[];
  daysOrder: string[];

  selectedKelasIdForAdd: number;
  setSelectedKelasIdForAdd: (id: number) => void;

  formData: any;
  setFormData: (data: any) => void;

  searchCourse: string;
  setSearchCourse: (value: string) => void;

  searchTeacher: string;
  setSearchTeacher: (value: string) => void;

  filteredCourses: any[];
  filteredTeachers: any[];

  searchInputRef: any;
  teacherSearchInputRef: any;
  handleSearchKeyDown: (e: any) => void;

  handleAddSchedule: () => void;
  resetForm: () => void;
};

export function AddScheduleDialog({
  open,
  onOpenChange,
  classData,
  daysOrder,
  selectedKelasIdForAdd,
  setSelectedKelasIdForAdd,
  formData,
  setFormData,
  searchCourse,
  setSearchCourse,
  searchTeacher,
  setSearchTeacher,
  filteredCourses,
  filteredTeachers,
  searchInputRef,
  teacherSearchInputRef,
  handleSearchKeyDown,
  handleAddSchedule,
  resetForm,
}: AddScheduleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle style={{ marginTop: "20px" }}>
            {lang.text("addSchedule")}
          </DialogTitle>
        </DialogHeader>
        <Divider />
        <div className="grid gap-3 py-4 pt-0">
          <div className="grid gap-2">
            <label htmlFor="kelasId">Kelas</label>
            <Select
              onValueChange={(value) =>
                setSelectedKelasIdForAdd(parseInt(value))
              }
              value={
                selectedKelasIdForAdd === 0
                  ? ""
                  : selectedKelasIdForAdd.toString()
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Kelas" />
              </SelectTrigger>
              <SelectContent>
                {classData.map((kelas: any) => (
                  <SelectItem key={kelas.id} value={kelas.id.toString()}>
                    {kelas.namaKelas}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label htmlFor="hari">Hari</label>
            <Select
              onValueChange={(value) =>
                setFormData({ ...formData, hari: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Hari" />
              </SelectTrigger>
              <SelectContent>
                {daysOrder.map((day) => (
                  <SelectItem key={day} value={day}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label htmlFor="mataPelajaranId">Mata Pelajaran</label>
            <Select
              onValueChange={(value) =>
                setFormData({ ...formData, mataPelajaranId: parseInt(value) })
              }
              // disabled={selectedKelasIdForAdd === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={"Pilih Mata Pelajaran"} />
              </SelectTrigger>
              <SelectContent className="px-2">
                <div className="py-1 mb-2">
                  <Input
                    ref={searchInputRef}
                    placeholder="Cari Mata Pelajaran..."
                    value={searchCourse}
                    onChange={(e) => setSearchCourse(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    className="w-full"
                  />
                </div>
                {filteredCourses.map((course: any) => (
                  <SelectItem key={course.id} value={course.id.toString()}>
                    {course.namaMataPelajaran}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label htmlFor="guruId">Guru</label>
            <Select
              onValueChange={(value) =>
                setFormData({ ...formData, guruId: parseInt(value) })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Guru" />
              </SelectTrigger>
              <SelectContent className="px-2">
                <div className="py-1 mb-2">
                  <Input
                    ref={teacherSearchInputRef}
                    placeholder="Cari Guru..."
                    value={searchTeacher}
                    onChange={(e) => setSearchTeacher(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    className="w-full"
                  />
                </div>
                {filteredTeachers?.map((teacher: any) => (
                  <SelectItem key={teacher.id} value={teacher.id.toString()}>
                    {teacher.namaGuru}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label htmlFor="jamMulai">Jam Mulai</label>
            <Input
              type="time"
              value={formData.jamMulai}
              onChange={(e) =>
                setFormData({ ...formData, jamMulai: e.target.value })
              }
              className="w-full"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="jamSelesai">Jam Selesai</label>
            <Input
              type="time"
              value={formData.jamSelesai}
              onChange={(e) =>
                setFormData({ ...formData, jamSelesai: e.target.value })
              }
              className="w-full"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAddSchedule}>Simpan</Button>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              resetForm();
            }}
          >
            Batal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

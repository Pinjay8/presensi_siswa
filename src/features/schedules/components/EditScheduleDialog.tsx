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
import { Divider } from "@mui/material";
type EditScheduleDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  selectedDay: string;

  formData: {
    mataPelajaranId: number;
    guruId: number;
    jamMulai: string;
    jamSelesai: string;
  };

  setFormData: React.Dispatch<React.SetStateAction<any>>;

  filteredCourses: any[];
  filteredTeachers: any[];

  searchCourse: string;
  setSearchCourse: (value: string) => void;

  searchTeacher: string;
  setSearchTeacher: (value: string) => void;

  searchInputRef: any;
  teacherSearchInputRef: any;

  handleSearchKeyDown: (e: any) => void;

  handleEditSchedule: () => void;
};

export function EditScheduleDialog({
  open,
  onOpenChange,
  selectedDay,
  formData,
  setFormData,
  filteredCourses,
  filteredTeachers,
  searchCourse,
  setSearchCourse,
  searchTeacher,
  setSearchTeacher,
  searchInputRef,
  teacherSearchInputRef,
  handleSearchKeyDown,
  handleEditSchedule,
}: EditScheduleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader style={{ marginTop: "15px" }}>
          <DialogTitle>Edit Jadwal - {selectedDay}</DialogTitle>
        </DialogHeader>

        <Divider />
        <div className="grid gap-4 pb-4">
          {/* <div className="grid gap-2">
            <label>Mata Pelajaran</label>

            <Select
              value={formData.mataPelajaranId.toString()}
              onValueChange={(value) =>
                setFormData((prev: any) => ({
                  ...prev,
                  mataPelajaranId: parseInt(value),
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Mata Pelajaran" />
              </SelectTrigger>

              <SelectContent className="px-2">
                <div className="py-1 mb-2">
                  <Input
                    ref={searchInputRef}
                    placeholder="Cari Mata Pelajaran..."
                    value={searchCourse}
                    onChange={(e) => setSearchCourse(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                  />
                </div>

                {filteredCourses.map((course) => (
                  <SelectItem key={course.id} value={course.id.toString()}>
                    {course.namaMataPelajaran}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div> */}
          {/* 
          <div className="grid gap-2">
            <label>Guru</label>

            <Select
              value={formData.guruId.toString()}
              onValueChange={(value) =>
                setFormData((prev: any) => ({
                  ...prev,
                  guruId: parseInt(value),
                }))
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
                  />
                </div>

                {filteredTeachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id.toString()}>
                    {teacher.namaGuru}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div> */}

          <div className="grid gap-2">
            <label>{lang.text("day")}</label>

            <Select
              value={formData.hari}
              onValueChange={(value) =>
                setFormData((prev: any) => ({
                  ...prev,
                  hari: value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Hari" />
              </SelectTrigger>

              <SelectContent>
                {["SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU"].map(
                  (day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label>Mata Pelajaran</label>

            <Select
              value={formData.mapelKelasId}
              onValueChange={(value) =>
                setFormData((prev: any) => ({
                  ...prev,
                  mapelKelasId: Number(value),
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Mata Pelajaran" />
              </SelectTrigger>

              <SelectContent className="px-2">
                <div className="mb-2 py-1">
                  <Input
                    ref={searchInputRef}
                    placeholder="Cari Mata Pelajaran..."
                    value={searchCourse}
                    onChange={(e) => setSearchCourse(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                  />
                </div>

                {filteredCourses.data?.map((course: any) => (
                  <SelectItem
                    key={course.mapelKelasId}
                    value={course.mapelKelasId}
                  >
                    {course.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label>{lang.text("startDate")}</label>

            <Input
              type="time"
              value={formData.jamMulai}
              onChange={(e) =>
                setFormData((prev: any) => ({
                  ...prev,
                  jamMulai: e.target.value,
                }))
              }
            />
          </div>

          <div className="grid gap-2">
            <label>{lang.text("endDate")}</label>

            <Input
              type="time"
              value={formData.jamSelesai}
              onChange={(e) =>
                setFormData((prev: any) => ({
                  ...prev,
                  jamSelesai: e.target.value,
                }))
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleEditSchedule}>Simpan</Button>

          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

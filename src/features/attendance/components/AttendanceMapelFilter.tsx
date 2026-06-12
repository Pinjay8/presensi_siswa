import {
  Badge,
  Button,
  Input,
  Label,
  lang,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/libs";
interface ClassRoom {
  id: number;
  namaKelas: string;
}

type FilterType = "harian" | "mingguan" | "bulanan" | "tahunan";

interface AttendanceFilterProps {
  searchStudentName: string;
  setSearchStudentName: (value: string) => void;

  selectedClasses: string;
  setSelectedClasses: (value: string) => void;

  selectedCourse: string;
  setSelectedCourse: (value: string) => void;

  selectedStatus: string;
  setSelectedStatus: (value: string) => void;

  filters: FilterType;
  setFilter: (value: FilterType) => void;

  listClassRoom: ClassRoom[];
  courseOptions: string[];

  resetFilters: () => void;
}

export default function AttendanceMapelFilter({
  searchStudentName,
  setSearchStudentName,
  selectedClasses,
  setSelectedClasses,
  selectedCourse,
  setSelectedCourse,
  selectedStatus,
  setSelectedStatus,
  filters,
  setFilter,
  listClassRoom,
  courseOptions,
  resetFilters,
}: AttendanceFilterProps) {
  return (
    <div className="mb-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div>
          <Label
            htmlFor="student-filter"
            className="block text-sm font-medium mb-2"
          >
            Nama Siswa
          </Label>
          <Input
            id="student-filter"
            type="text"
            value={searchStudentName}
            onChange={(e) => setSearchStudentName(e.target.value)}
            placeholder="Cari nama siswa..."
            className="w-full py-2"
          />
        </div>

        <div>
          <Label
            htmlFor="class-filter"
            className="block text-sm font-medium mb-2"
          >
            Kelas
          </Label>
          <Select value={selectedClasses} onValueChange={setSelectedClasses}>
            <SelectTrigger id="class-filter" className="w-full">
              <SelectValue placeholder="Pilih Kelas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kelas</SelectItem>
              {listClassRoom.map((kelas) => (
                <SelectItem key={kelas.id} value={String(kelas.id)}>
                  {kelas.namaKelas}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label
            htmlFor="course-filter"
            className="block text-sm font-medium mb-2"
          >
            Mata Pelajaran
          </Label>
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger id="course-filter" className="w-full">
              <SelectValue placeholder="Pilih Mata Pelajaran" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Mata Pelajaran</SelectItem>
              {courseOptions.map((course) => (
                <SelectItem key={course} value={course}>
                  {course}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label
            htmlFor="date-filter"
            className="block text-sm font-medium mb-2"
          >
            Tanggal
          </Label>
          <Select
            value={filters}
            onValueChange={(v) => setFilter(v as FilterType)}
          >
            <SelectTrigger id="date-filter" className="w-full">
              <SelectValue placeholder="Pilih Periode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="harian">Harian</SelectItem>
              <SelectItem value="mingguan">Mingguan</SelectItem>
              <SelectItem value="bulanan">Bulanan</SelectItem>
              <SelectItem value="tahunan">Tahunan</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label
            htmlFor="status-filter"
            className="block text-sm font-medium mb-2"
          >
            Status Kehadiran
          </Label>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger id="status-filter" className="w-full">
              <SelectValue placeholder="Pilih Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="hadir">Hadir</SelectItem>
              <SelectItem value="alfa">Alfa</SelectItem>
              <SelectItem value="izin">Izin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <Button
          variant="outline"
          onClick={resetFilters}
          className="w-full sm:w-auto"
        >
          Reset Filter
        </Button>
      </div>
    </div>
  );
}

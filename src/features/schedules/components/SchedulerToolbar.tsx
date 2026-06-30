import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  lang,
} from "@/core/libs";
import { ChevronDown, Download, Plus, UploadCloud } from "lucide-react";

interface ScheduleToolbarProps {
  isRoleAdmin: boolean;
  isRoleSiswa: boolean;
  isRoleGuru: boolean;

  classData: any[];
  selectedClassId: number;
  setSelectedClassId: (id: number) => void;

  selectedDays: string[];
  daysOrder: string[];

  openAddModal: () => void;
  handleDownloadTemplate: () => void;
  setIsUploadModalOpen: (open: boolean) => void;
  setIsDayFilterOpen: (open: boolean) => void;
}

export function ScheduleToolbar({
  isRoleAdmin,
  isRoleSiswa,
  isRoleGuru,
  classData,
  selectedClassId,
  setSelectedClassId,
  selectedDays,
  daysOrder,
  openAddModal,
  handleDownloadTemplate,
  setIsUploadModalOpen,
  setIsDayFilterOpen,
}: ScheduleToolbarProps) {
  return (
    <div
      className={`w-full mb-4 flex items-center gap-2 flex-wrap xl:flex-nowrap ${
        isRoleAdmin ? "justify-between" : "justify-end"
      }`}
    >
      {!isRoleSiswa && !isRoleGuru && (
        <div className="flex gap-2 flex-wrap xl:flex-nowrap">
          <Button variant="outline" onClick={openAddModal}>
            <Plus />
            {lang.text("addNewSchedule")}
          </Button>

          <div className="mx-2 flex h-[36px] items-center justify-center py-1">
            <p>atau</p>
          </div>

          <Button
            className="bg-green-500 text-white"
            onClick={handleDownloadTemplate}
          >
            <Download />
            Unduh Template Excel
          </Button>

          <Button
            variant="outline"
            className="border-green-500"
            onClick={() => setIsUploadModalOpen(true)}
          >
            <UploadCloud />
            Unggah Excel
          </Button>
        </div>
      )}

      <div className="flex items-center gap-4">
        {!isRoleSiswa && (
          <Select
            value={selectedClassId.toString()}
            onValueChange={(value) => setSelectedClassId(Number(value))}
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
        )}

        <Button
          variant="outline"
          className="w-[200px] justify-between"
          onClick={() => setIsDayFilterOpen(true)}
        >
          {selectedDays.length === daysOrder.length
            ? lang.text("allDays")
            : selectedDays.length === 0
              ? lang.text("selectDays")
              : selectedDays.join(", ")}

          <ChevronDown />
        </Button>
      </div>
    </div>
  );
}

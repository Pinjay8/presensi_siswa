import {
  Button,
  lang,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/libs";
import { FaFilePdf } from "react-icons/fa";
interface AttendanceFilterProps {
  period: string;
  attendanceCount: number;
  setIsModalOpen: (value: boolean) => void;
  onPeriodChange: any;
}

export const AttendanceFilter = ({
  period,
  attendanceCount,
  setIsModalOpen,
  onPeriodChange,
}: AttendanceFilterProps) => {
  return (
    <div className="flex justify-between items-center mb-4 space-x-4">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-red-500 text-white rounded-lg transition duration-300"
        >
          {lang.text("export")} Data
          <FaFilePdf />
        </Button>
        <Select value={period} onValueChange={onPeriodChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder={lang.text("selectPeriod")} />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="harian">{lang.text("daily")}</SelectItem>
            <SelectItem value="mingguan">{lang.text("weeks")}</SelectItem>
            <SelectItem value="bulanan">{lang.text("months")}</SelectItem>
            <SelectItem value="tahunan">{lang.text("years")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="outline"
        aria-label="attendanceCount"
        className="cursor-default hover:bg-transparent"
      >
        {lang.text("present")}: {attendanceCount}
      </Button>
    </div>
  );
};

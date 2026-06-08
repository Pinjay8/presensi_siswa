// import {
//   Button,
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/core/libs";
// import { lang } from "@/core/libs";
// import { FaFilePdf } from "react-icons/fa";

// interface AttendanceFilterProps {
//   period: string;
//   attendanceCount: number;
//   onPeriodChange: (value: string) => void;
//   setIsModalOpen: any;
// }

// const AttendanceFilter = ({
//   period,
//   attendanceCount,
//   onPeriodChange,
//   setIsModalOpen,
// }: AttendanceFilterProps) => {
//   return (
//     <div className="flex justify-between items-center mb-4 space-x-4">
//       <div className="flex items-center gap-2">
//         {/* <div className="w-[180px]"> */}
//         <Button
//           variant="outline"
//           onClick={() => setIsModalOpen(true)}
//           className="px-4 py-2 bg-red-500 text-white rounded-lg transition duration-300"
//         >
//           {lang.text("export")} Data
//           <FaFilePdf />
//         </Button>
//         <Select
//           value={period}
//           onValueChange={onPeriodChange}
//           style={{ width: "200px" }}
//         >
//           <SelectTrigger>
//             <SelectValue placeholder="Pilih Periode" />
//           </SelectTrigger>

//           <SelectContent>
//             <SelectItem value="harian">Harian</SelectItem>
//             <SelectItem value="mingguan">Mingguan</SelectItem>
//             <SelectItem value="bulanan">Bulanan</SelectItem>
//             <SelectItem value="tahunan">Tahunan</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       <Button
//         variant="outline"
//         aria-label="attendanceCount"
//         className="cursor-default hover:bg-transparent"
//       >
//         {lang.text("present")}: {attendanceCount}
//       </Button>
//       {/* </div> */}
//     </div>
//   );
// };

// export default AttendanceFilter;

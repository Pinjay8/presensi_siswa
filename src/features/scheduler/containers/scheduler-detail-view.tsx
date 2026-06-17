import React, { useState, useEffect } from "react";
import { lang } from "@/core/libs";
import { useAlert } from "@/features/_global/hooks";
import { 
  SchedulerWeeklyCalendar, 
  WeeklySchedule 
} from "../containers/scheduler-weekly-calendar";
import { Calendar, Clock, Info, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useSchedulerCreation } from "../hooks/use-scheduler-creation";
import { useSchedulerDetail } from "../hooks/use-scheduler-detail";


const DAY_LONG_NAMES = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu"
];

export interface SchedulerDetailViewProps {
  id: number;
}

export const SchedulerDetailView = (props : SchedulerDetailViewProps) => {
  const alert = useAlert();

  const detail = useSchedulerDetail({ id: Number(props.id)})
  
  // Local state for the weekly schedule
  const [schedule, setSchedule] = useState<WeeklySchedule>({
    days: [
      { dayOfWeek: 1, jamMasuk: "08:00", jamPulang: "14:00" },
      { dayOfWeek: 2, jamMasuk: "08:00", jamPulang: "14:00" },
      { dayOfWeek: 3, jamMasuk: "08:00", jamPulang: "14:00" },
      { dayOfWeek: 4, jamMasuk: "08:00", jamPulang: "14:00" },
      { dayOfWeek: 5, jamMasuk: "08:00", jamPulang: "14:00" },
      { dayOfWeek: 6, jamMasuk: null, jamPulang: null },
      { dayOfWeek: 0, jamMasuk: null, jamPulang: null }
    ]
  });
  const [scheduleName, setScheduleName] = useState("");
  const [scheduleDescription, setScheduleDescription] = useState("");
  const [scheduleType, setScheduleType] = useState<"SISWA" | "GURU">("SISWA");
  const [isDefault, setIsDefault] = useState(false);

  const [showDetail, setShowDetail] = useState(true);
  const [showGuide, setShowGuide] = useState(true);
  const [showSummary, setShowSummary] = useState(true);

  useEffect(() => {
    if (detail.data) {
      setScheduleName(detail.data.name || "");
      setScheduleDescription(detail.data.description || "");
      setScheduleType(detail.data.type || "SISWA");
      setIsDefault(detail.data.isDefault || false);
      if (detail.data.days) {
        const initialDaysOrder = [1, 2, 3, 4, 5, 6, 0];
        const mappedDays = initialDaysOrder.map((dayOfWeek) => {
          const found = detail.data?.days?.find((d) => d.dayOfWeek === dayOfWeek);
          return {
            dayOfWeek,
            jamMasuk: found ? found.jamMasuk : null,
            jamPulang: found ? found.jamPulang : null,
          };
        });
        setSchedule({ days: mappedDays });
      }
    }
  }, [detail.data]);

  if (detail.isLoading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const handleScheduleChange = (newSchedule: WeeklySchedule) => {
    setSchedule(newSchedule);
  };

return (
  <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 pb-16 sm:pb-6">
    
    {/* INFO PANEL */}
    <div
      className="
        flex
        flex-col
        gap-6
        h-[calc(100vh-220px)]
        overflow-y-auto
        pr-1
      "
    >
      <AccordionCard
  title="Detail Jadwal"
  open={showDetail}
  onToggle={() => setShowDetail(!showDetail)}
          icon={
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
            <Calendar className="w-5 h-5" />
          </div>
        }
>
  <div className="flex flex-col gap-4">
    
    {/* Nama */}
    <div>
      <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
        Nama Jadwal *
      </label>

      <input
        value={scheduleName}
        readOnly
        placeholder="Contoh: Jadwal Reguler"
        className="
          w-full
          px-3 py-2
          rounded-xl
          border border-slate-200 dark:border-zinc-800
          text-sm
          bg-slate-50 dark:bg-zinc-900
          text-slate-800 dark:text-zinc-200
          cursor-not-allowed
          focus:outline-none
        "
      />
    </div>

    {/* Deskripsi */}
    <div>
      <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
        Deskripsi
      </label>

      <textarea
        rows={3}
        value={scheduleDescription}
        readOnly
        placeholder="Opsional"
        className="
          w-full
          px-3 py-2
          rounded-xl
          border border-slate-200 dark:border-zinc-800
          text-sm
          resize-none
          bg-slate-50 dark:bg-zinc-900
          text-slate-800 dark:text-zinc-200
          cursor-not-allowed
          focus:outline-none
        "
      />
    </div>

    {/* Type */}
    <div>
      <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-2">
        Tipe Jadwal *
      </label>

      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm text-slate-800 dark:text-zinc-200 cursor-not-allowed">
          <input
            type="radio"
            checked={scheduleType === "SISWA"}
            disabled
            className="cursor-not-allowed"
          />
          Siswa
        </label>

        <label className="flex items-center gap-2 text-sm text-slate-800 dark:text-zinc-200 cursor-not-allowed">
          <input
            type="radio"
            checked={scheduleType === "GURU"}
            disabled
            className="cursor-not-allowed"
          />
          Guru
        </label>
      </div>
    </div>

    {/* Default */}
    <label className="flex items-center gap-3 text-slate-800 dark:text-zinc-200 cursor-not-allowed">
      <input
        type="checkbox"
        checked={isDefault}
        disabled
        className="cursor-not-allowed"
      />

      <div>
        <div className="text-sm font-medium text-slate-700 dark:text-zinc-300">
          Jadikan sebagai jadwal default
        </div>

        <div className="text-xs text-slate-400 dark:text-zinc-500">
          Digunakan otomatis ketika tidak ada jadwal khusus.
        </div>
      </div>
    </label>
  </div>
</AccordionCard>

      <AccordionCard
        title="Ringkasan Jadwal"
        open={showSummary}
        onToggle={() => setShowSummary(!showSummary)}
        icon={<Info className="w-4 h-4 text-slate-400" />}
      >
        <div className="flex flex-col gap-2.5">
          {DAY_LONG_NAMES.map((dayName, idx) => {
            const daySched =
              schedule.days?.find((d) => d.dayOfWeek === idx) || {
                dayOfWeek: idx,
                jamMasuk: null,
                jamPulang: null,
              };

            const hasStart = daySched.jamMasuk !== null;
            const hasEnd = daySched.jamPulang !== null;

            return (
              <div
                key={idx}
                className="
                  flex items-center justify-between
                  p-3 rounded-xl
                  border border-slate-50 dark:border-zinc-900
                  bg-slate-50/30 dark:bg-zinc-900/30
                  hover:bg-slate-50 dark:hover:bg-zinc-900
                  transition-colors
                "
              >
                <span className="text-xs font-bold text-slate-600 dark:text-zinc-400">
                  {dayName}
                </span>

                {hasStart || hasEnd ? (
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-[11px] font-semibold text-slate-700 dark:text-zinc-300">
                      {daySched.jamMasuk ?? "-"} -{" "}
                      {daySched.jamPulang ?? "-"}
                    </span>

                    <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 uppercase tracking-wide">
                      Tersimpan
                    </span>
                  </div>
                ) : (
                  <span className="text-[11px] font-medium text-slate-400 dark:text-zinc-500 italic">
                    Belum diatur
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </AccordionCard>

    </div>

    {/* CALENDAR */}
    <div className="xl:col-span-3">
      <SchedulerWeeklyCalendar
        schedule={schedule}
        onChange={handleScheduleChange}
        readOnly
      />
    </div>
  </div>
);
};

type AccordionCardProps = {
  title: string;
  icon: React.ReactNode;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

const AccordionCard = ({
  title,
  icon,
  open,
  onToggle,
  children,
}: AccordionCardProps) => {
  return (
    <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm">
      <button
        onClick={onToggle}
        className="
          w-full
          px-6 py-5
          flex items-center justify-between
        "
      >
        <div className="flex items-center gap-3">
          {icon}

          <h3 className="font-bold text-slate-800 dark:text-zinc-100 text-base">
            {title}
          </h3>
        </div>

        <ChevronRight
          className={`
            w-4 h-4 text-slate-500 dark:text-zinc-400
            transition-transform duration-300
            ${open ? "rotate-90" : ""}
          `}
        />
      </button>

<AnimatePresence>
  {open && (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="overflow-hidden"
    >
      <div
        className="
          px-6
          pb-6
          max-h-[500px]
          overflow-y-auto
        "
      >
        {children}
      </div>
    </motion.div>
  )}
</AnimatePresence>
    </div>
  );
};
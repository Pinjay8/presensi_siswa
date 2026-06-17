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
import {  useNavigate } from "react-router-dom";


const DAY_LONG_NAMES = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu"
];

export interface SchedulerEditViewProps {
  id?: number;
  editable?: boolean;
}

export const SchedulerEditView = ({ id, editable = true }: SchedulerEditViewProps) => {
  const alert = useAlert();
  const detail = useSchedulerDetail({ id: Number(id) });
  const navigate = useNavigate()
  
  const isEdit = Boolean(id) && editable;
  const isDetail = Boolean(id) && !editable;
  const isCreate = !id && editable;

  // Local state for the weekly schedule
  const [schedule, setSchedule] = useState<WeeklySchedule>({
    days: [
      { dayOfWeek: 1, jamMasuk: null, jamPulang: null },
      { dayOfWeek: 2, jamMasuk: null, jamPulang: null },
      { dayOfWeek: 3, jamMasuk: null, jamPulang: null },
      { dayOfWeek: 4, jamMasuk: null, jamPulang: null },
      { dayOfWeek: 5, jamMasuk: null, jamPulang: null },
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

  const { create, update, isLoading } = useSchedulerCreation();

  useEffect(() => {
    if (id && detail.data) {
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
  }, [detail.data, id]);

  if (id && detail.isLoading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const isAllDaysNull = (schedule.days || []).every(
    (day) => day.jamMasuk === null && day.jamPulang === null
  );

  const handleSubmit = async () => {
    if (!scheduleName.trim()) {
      alert.error(lang.text("fieldIsRequired", { field: lang.text("scheduleName") }) || "Nama Jadwal wajib diisi");
      return;
    }
    
    try {
      const filteredDays = (schedule.days || []).filter(
        (day) => day.jamMasuk !== null && day.jamPulang !== null
      );
      
      const payload = {
        name: scheduleName,
        description: scheduleDescription || null,
        type: scheduleType,
        isDefault,
        days: filteredDays,
      };

      if (isEdit && id) {
        await update(Number(id), payload);
      } else {
        await create(payload);
      }
            alert.success(
              isEdit
                ? lang.text("successUpdate", { context: lang.text("scheduler") })
                : lang.text("successCreate", { context: lang.text("scheduler") }),
            );

            navigate("/scheduler");
            
    } catch (err: any) {
            alert.error(
              err?.message ||
                (isEdit
                  ? lang.text("failUpdate", { context: lang.text("scheduler") })
                  : lang.text("failCreate", { context: lang.text("scheduler") })),
            );
    }
  };

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
        h-[calc(100vh-220px)]
      "
    >
      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-6">
      {editable && 
            <AccordionCard
        title="Panduan Pengaturan"
        open={showGuide}
        onToggle={() => setShowGuide(!showGuide)}
        icon={
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400">
            <Calendar className="w-5 h-5" />
          </div>
        }
      >
        <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed mb-5">
          Atur waktu mulai dan selesai kehadiran untuk setiap hari dalam
          seminggu.
        </p>

        <div className="flex flex-col gap-4">
          <div className="flex gap-3 items-start">
            <div className="p-1 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 mt-0.5">
              <Clock className="w-3.5 h-3.5" />
            </div>

            <div>
              <div className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                Pilih Jam
              </div>

              <div className="text-[11px] text-slate-400 dark:text-zinc-500 leading-relaxed">
                Klik pada baris atau kolom kosong untuk menetapkan jam
                mulai atau selesai.
              </div>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="p-1 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 mt-0.5">
              <AlertCircle className="w-3.5 h-3.5" />
            </div>

            <div>
              <div className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                Ubah Jam
              </div>

              <div className="text-[11px] text-slate-400 dark:text-zinc-500 leading-relaxed">
                Menetapkan jam baru pada hari yang sama akan otomatis
                mengganti pilihan sebelumnya.
              </div>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="p-1 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>

            <div>
              <div className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                Hapus Slot
              </div>

              <div className="text-[11px] text-slate-400 dark:text-zinc-500 leading-relaxed">
                Klik slot aktif untuk menghapus jadwal atau membatalkan
                aksi.
              </div>
            </div>
          </div>
        </div>
      </AccordionCard>}

      <AccordionCard
  title="Detail Jadwal"
  open={showDetail}
  onToggle={() => setShowDetail(!showDetail)}
  icon={<Info className="w-4 h-4 text-slate-400" />}
>
  <div className="flex flex-col gap-4">
    
    {/* Nama */}
    <div>
      <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
        Nama Jadwal *
      </label>

      <input
        value={scheduleName}
        onChange={(e) => setScheduleName(e.target.value)}
        readOnly={isDetail}
        placeholder="Contoh: Jadwal Reguler"
        className={`
          w-full
          px-3 py-2
          rounded-xl
          border border-slate-200 dark:border-zinc-800
          text-sm
          focus:outline-none
          bg-white dark:bg-zinc-950
          text-slate-800 dark:text-zinc-200
          ${isDetail ? "bg-slate-50 dark:bg-zinc-900 cursor-not-allowed" : "focus:ring-2 focus:ring-blue-500"}
        `}
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
        onChange={(e) => setScheduleDescription(e.target.value)}
        readOnly={isDetail}
        placeholder="Opsional"
        className={`
          w-full
          px-3 py-2
          rounded-xl
          border border-slate-200 dark:border-zinc-800
          text-sm
          resize-none
          focus:outline-none
          bg-white dark:bg-zinc-950
          text-slate-800 dark:text-zinc-200
          ${isDetail ? "bg-slate-50 dark:bg-zinc-900 cursor-not-allowed" : "focus:ring-2 focus:ring-blue-500"}
        `}
      />
    </div>

    {/* Type */}
    <div>
      <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-2">
        Tipe Jadwal *
      </label>

      <div className="flex gap-4">
        <label className={`flex items-center gap-2 text-sm ${isDetail ? "cursor-not-allowed" : "cursor-pointer"} text-slate-800 dark:text-zinc-200`}>
          <input
            type="radio"
            checked={scheduleType === "SISWA"}
            onChange={() => setScheduleType("SISWA")}
            disabled={isDetail}
            className={isDetail ? "cursor-not-allowed" : ""}
          />
          Siswa
        </label>

        <label className={`flex items-center gap-2 text-sm ${isDetail ? "cursor-not-allowed" : "cursor-pointer"} text-slate-800 dark:text-zinc-200`}>
          <input
            type="radio"
            checked={scheduleType === "GURU"}
            onChange={() => setScheduleType("GURU")}
            disabled={isDetail}
            className={isDetail ? "cursor-not-allowed" : ""}
          />
          Guru
        </label>
      </div>
    </div>

    {/* Default */}
    <label className={`flex items-center gap-3 ${isDetail ? "cursor-not-allowed" : "cursor-pointer"} text-slate-800 dark:text-zinc-200`}>
      <input
        type="checkbox"
        checked={isDefault}
        onChange={(e) => setIsDefault(e.target.checked)}
        disabled={isDetail}
        className={isDetail ? "cursor-not-allowed" : ""}
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

      {/* Submit Button */}
      {editable && (
        <div className="mt-4 pt-2 border-t border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <button
            disabled={isLoading || isAllDaysNull}
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-xl shadow-sm transition-all text-sm flex items-center justify-center gap-2"
          >
            {isLoading
              ? lang.text("saving")
              : isEdit
                ? (lang.text("saveChanges") || "Simpan Perubahan")
                : (lang.text("createSchedule") || "Buat Jadwal")}
          </button>
        </div>
      )}

    </div>

    {/* CALENDAR */}
    <div className="xl:col-span-3">
      <SchedulerWeeklyCalendar
        schedule={schedule}
        onChange={handleScheduleChange}
        readOnly={isDetail}
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
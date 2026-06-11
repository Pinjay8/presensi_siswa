import React, { useState } from "react";
import { lang } from "@/core/libs";
import { useAlert } from "@/features/_global/hooks";
import { 
  SchedulerWeeklyCalendar, 
  WeeklySchedule 
} from "../containers/scheduler-weekly-calendar";
import { Calendar, Clock, Info, CheckCircle2, AlertCircle } from "lucide-react";
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

export interface SchedulerEditViewProps {
  id?: number;
  editable: boolean;
}

export const SchedulerEditView = (props: SchedulerEditViewProps) => {
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

  const { create, isLoading } = useSchedulerCreation();

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
      await create(payload);
      alert.success(
        lang.text("createScheduleSuccess")
      );
    } catch (err) {
      alert.error(lang.text("createScheduleFailed"));
    }
  };
  const handleScheduleChange = (newSchedule: WeeklySchedule) => {
    setSchedule(newSchedule);
    
    // Find the changes to trigger a toast update
    alert.success("Jadwal mingguan berhasil diperbarui");
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
      {props.editable && 
            <AccordionCard
        title="Panduan Pengaturan"
        open={showGuide}
        onToggle={() => setShowGuide(!showGuide)}
        icon={
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
            <Calendar className="w-5 h-5" />
          </div>
        }
      >
        <p className="text-xs text-slate-500 leading-relaxed mb-5">
          Atur waktu mulai dan selesai kehadiran untuk setiap hari dalam
          seminggu menggunakan kalender interaktif.
        </p>

        <div className="flex flex-col gap-4">
          <div className="flex gap-3 items-start">
            <div className="p-1 rounded bg-slate-100 text-slate-600 mt-0.5">
              <Clock className="w-3.5 h-3.5" />
            </div>

            <div>
              <div className="text-xs font-bold text-slate-700">
                Pilih Jam
              </div>

              <div className="text-[11px] text-slate-400 leading-relaxed">
                Klik pada baris atau kolom kosong untuk menetapkan jam
                mulai atau selesai.
              </div>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="p-1 rounded bg-slate-100 text-slate-600 mt-0.5">
              <AlertCircle className="w-3.5 h-3.5" />
            </div>

            <div>
              <div className="text-xs font-bold text-slate-700">
                Ubah Jam
              </div>

              <div className="text-[11px] text-slate-400 leading-relaxed">
                Menetapkan jam baru pada hari yang sama akan otomatis
                mengganti pilihan sebelumnya.
              </div>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="p-1 rounded bg-slate-100 text-slate-600 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>

            <div>
              <div className="text-xs font-bold text-slate-700">
                Hapus Slot
              </div>

              <div className="text-[11px] text-slate-400 leading-relaxed">
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
      <label className="block text-xs font-semibold text-slate-700 mb-1">
        Nama Jadwal *
      </label>

      <input
        value={scheduleName}
        onChange={(e) => setScheduleName(e.target.value)}
        placeholder="Contoh: Jadwal Reguler"
        className="
          w-full
          px-3 py-2
          rounded-xl
          border border-slate-200
          text-sm
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
        "
      />
    </div>

    {/* Deskripsi */}
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1">
        Deskripsi
      </label>

      <textarea
        rows={3}
        value={scheduleDescription}
        onChange={(e) => setScheduleDescription(e.target.value)}
        placeholder="Opsional"
        className="
          w-full
          px-3 py-2
          rounded-xl
          border border-slate-200
          text-sm
          resize-none
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
        "
      />
    </div>

    {/* Type */}
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-2">
        Tipe Jadwal *
      </label>

      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="radio"
            checked={scheduleType === "SISWA"}
            onChange={() => setScheduleType("SISWA")}
          />
          Siswa
        </label>

        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="radio"
            checked={scheduleType === "GURU"}
            onChange={() => setScheduleType("GURU")}
          />
          Guru
        </label>
      </div>
    </div>

    {/* Default */}
    <label className="flex items-center gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={isDefault}
        onChange={(e) => setIsDefault(e.target.checked)}
      />

      <div>
        <div className="text-sm font-medium text-slate-700">
          Jadikan sebagai jadwal default
        </div>

        <div className="text-xs text-slate-400">
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
                  border border-slate-50
                  bg-slate-50/30
                  hover:bg-slate-50
                  transition-colors
                "
              >
                <span className="text-xs font-bold text-slate-600">
                  {dayName}
                </span>

                {hasStart || hasEnd ? (
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-[11px] font-semibold text-slate-700">
                      {daySched.jamMasuk ?? "-"} -{" "}
                      {daySched.jamPulang ?? "-"}
                    </span>

                    <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold bg-green-50 text-green-600 uppercase tracking-wide">
                      Tersimpan
                    </span>
                  </div>
                ) : (
                  <span className="text-[11px] font-medium text-slate-400 italic">
                    Belum diatur
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </AccordionCard>

      {/* Submit Button */}
      <button
        disabled={isLoading}
        onClick={handleSubmit}
        className="w-full mt-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-xl shadow-sm transition-all text-sm flex items-center justify-center gap-2"
      >
        {isLoading ? lang.text("saving") : (lang.text("saveChanges") || "Simpan Perubahan")}
      </button>

    </div>

    {/* CALENDAR */}
    <div className="xl:col-span-3">
      <SchedulerWeeklyCalendar
        schedule={schedule}
        onChange={handleScheduleChange}
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
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
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

          <h3 className="font-bold text-slate-800 text-base">
            {title}
          </h3>
        </div>

        <ChevronRight
          className={`
            w-4 h-4 text-slate-500
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
import React, { useState } from "react";
import { lang } from "@/core/libs";
import { APP_CONFIG } from "@/core/configs";
import { DashboardPageLayout } from "@/features/_global";
import { useAlert } from "@/features/_global/hooks";
import { 
  SchedulerWeeklyCalendar, 
  WeeklySchedule 
} from "../containers/scheduler-weekly-calendar";
import { Calendar, Clock, Info, CheckCircle2, AlertCircle } from "lucide-react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { SchedulerEditView } from "../containers/scheduler-edit-view";



const DAY_LONG_NAMES = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu"
];

export const SchedulerView = () => {
  const alert = useAlert();
  
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
const [showGuide, setShowGuide] = useState(true);
const [showSummary, setShowSummary] = useState(true);
  const handleScheduleChange = (newSchedule: WeeklySchedule) => {
    setSchedule(newSchedule);
    
    // Find the changes to trigger a toast update
    alert.success("Jadwal mingguan berhasil diperbarui");
  };

  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("scheduler")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("scheduler"),
          url: "/scheduler",
        }
      ]}
      title={lang.text("scheduler")}
    >
      {/* <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 pb-16 sm:pb-6"/> */}
        
       
      <SchedulerEditView />
    </DashboardPageLayout>
  );
};
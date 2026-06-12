import React, { useState } from "react";
import { lang, simpleDecode } from "@/core/libs";
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
import { useParams, Navigate } from "react-router-dom";



const DAY_LONG_NAMES = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu"
];

export const SchedulerEdit = () => {
    const params = useParams();
    const decodeParams: { id: string; text: string} = JSON.parse(
      simpleDecode(params.id || "")
    );
  
    if(!decodeParams?.id || !decodeParams?.text){
      return <Navigate to={"/scheduler"} replace />
    }
    

  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("scheduler")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("scheduler"),
          url: "/scheduler",
        },
        {
          label: decodeParams?.text,
          url: `/scheduler/${params.id}`,
        }
      ]}
      title={lang.text("scheduler")}
    >
      {/* <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 pb-16 sm:pb-6"/> */}
        
       
      <SchedulerEditView id={Number(decodeParams.id)} />
    </DashboardPageLayout>
  );
};
import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Trash2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  CalendarDays, 
  Clock 
} from "lucide-react";
import { lang } from "@/core/libs";

export type DaySchedule = {
  dayOfWeek: number;
  jamMasuk: string | null;
  jamPulang: string | null;
};

export type WeeklySchedule = {
  days: DaySchedule[];
};

interface SchedulerWeeklyCalendarProps {
  schedule: WeeklySchedule;
  onChange: (newSchedule: WeeklySchedule) => void;
}

const DAY_NAMES = ["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"];
const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const getMonthYearLabel = (date: Date) => {
  return `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
};

const parseHourString = (timeStr: string | null): number | null => {
  if (!timeStr) return null;
  const parts = timeStr.split(":");
  const h = parseInt(parts[0], 10);
  return isNaN(h) ? null : h;
};

const formatHourString = (h: number | null): string | null => {
  if (h === null) return null;
  return `${String(h).padStart(2, "0")}:00`;
};

export const SchedulerWeeklyCalendar: React.FC<SchedulerWeeklyCalendarProps> = ({
  schedule,
  onChange,
}) => {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [currentTime, setCurrentTime] = useState(() => new Date());
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // State for popover menu
  const [menuState, setMenuState] = useState<{
    visible: boolean;
    x: number;
    y: number;
    dayIndex: number | null;
    hour: number | null;
    assignedRole: "start" | "end" | "middle" | null;
  }>({
    visible: false,
    x: 0,
    y: 0,
    dayIndex: null,
    hour: null,
    assignedRole: null,
  });

  // Keep track of current time dynamically
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000); // update every 30 seconds
    return () => clearInterval(timer);
  }, []);

  // Auto scroll to current time or default hour on mount
  useEffect(() => {
    if (scrollContainerRef.current) {
      const currentHour = currentTime.getHours();
      // Center the current hour in viewport (scroll down by (currentHour - 2) * cellHeight)
      const targetHour = currentHour > 2 ? currentHour - 2 : 0;
      scrollContainerRef.current.scrollTop = targetHour * 60;
    }
  }, []);

  // Calculate the dates for the current week (Sunday to Saturday)
  const getWeekDates = (date: Date) => {
    const currentDay = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const start = new Date(date);
    start.setDate(date.getDate() - currentDay);
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDates = getWeekDates(currentDate);

  // Time navigation helpers
  const handlePrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
    closeMenu();
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
    closeMenu();
  };

  const handleToday = () => {
    setCurrentDate(new Date());
    closeMenu();
    // Scroll to current hour
    if (scrollContainerRef.current) {
      const targetHour = new Date().getHours() > 2 ? new Date().getHours() - 2 : 0;
      scrollContainerRef.current.scrollTop = targetHour * 60;
    }
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const formatHour = (h: number) => {
    return `${String(h).padStart(2, "0")}:00`;
  };

  // Menu closing
  const closeMenu = () => {
    setMenuState((prev) => ({ ...prev, visible: false }));
  };

  // Close menu on click outside
  useEffect(() => {
    const handleOutsideClick = () => {
      if (menuState.visible) closeMenu();
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [menuState.visible]);

  // Helper to determine cell schedule role
  const getCellRole = (dayIdx: number, h: number) => {
    const daySched = schedule.days?.find((d) => d.dayOfWeek === dayIdx);
    if (!daySched) return null;
    const startHour = parseHourString(daySched.jamMasuk);
    const endHour = parseHourString(daySched.jamPulang);
    const endSlot = endHour !== null ? endHour - 1 : null;
    
    if (startHour !== null && endSlot !== null && startHour === endSlot && h === startHour) {
      return "both";
    }
    if (h === startHour) return "start";
    if (h === endSlot) return "end";
    if (startHour !== null && endSlot !== null) {
      const minH = Math.min(startHour, endSlot);
      const maxH = Math.max(startHour, endSlot);
      if (h > minH && h < maxH) {
        return "middle";
      }
    }
    return null;
  };

  // Click cells logic
  const handleCellClick = (
    e: React.MouseEvent,
    dayIndex: number,
    hour: number,
    role: "start" | "end" | "middle" | null
  ) => {
    e.stopPropagation();
    setMenuState({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      dayIndex,
      hour,
      assignedRole: role,
    });
  };

  const updateDaySchedule = (dayIndex: number, start: number | null, end: number | null) => {
    const existingDays = schedule.days ? [...schedule.days] : [];
    const dayIdxInArray = existingDays.findIndex((d) => d.dayOfWeek === dayIndex);
    
    const newDayData: DaySchedule = {
      dayOfWeek: dayIndex,
      jamMasuk: formatHourString(start),
      jamPulang: formatHourString(end),
    };
    
    if (dayIdxInArray !== -1) {
      existingDays[dayIdxInArray] = newDayData;
    } else {
      existingDays.push(newDayData);
    }
    
    onChange({ days: existingDays });
  };

  // State update actions
  const setStartHour = () => {
    if (menuState.dayIndex === null || menuState.hour === null) return;
    const day = menuState.dayIndex;
    const hr = menuState.hour;
    
    const daySched = schedule.days?.find((d) => d.dayOfWeek === day);
    const end = daySched ? parseHourString(daySched.jamPulang) : null;
    
    // If start hour is same as end hour, clear end hour to avoid overlap
    const newEnd = end === hr ? null : end;
    
    updateDaySchedule(day, hr, newEnd);
    closeMenu();
  };

  const setEndHour = () => {
    if (menuState.dayIndex === null || menuState.hour === null) return;
    const day = menuState.dayIndex;
    const hr = menuState.hour;
    
    const daySched = schedule.days?.find((d) => d.dayOfWeek === day);
    const start = daySched ? parseHourString(daySched.jamMasuk) : null;
    
    const targetEnd = hr + 1; // End time is set to clicked slot + 1 hour (e.g. clicking 16:00 sets 17:00)
    
    // If end hour is same as start hour, clear start hour to avoid overlap
    const newStart = start === targetEnd ? null : start;
    
    updateDaySchedule(day, newStart, targetEnd);
    closeMenu();
  };

  const removeHour = () => {
    if (menuState.dayIndex === null || menuState.hour === null) return;
    const day = menuState.dayIndex;
    const role = menuState.assignedRole;
    
    const daySched = schedule.days?.find((d) => d.dayOfWeek === day);
    let start = daySched ? parseHourString(daySched.jamMasuk) : null;
    let end = daySched ? parseHourString(daySched.jamPulang) : null;
    
    if (role === "start") {
      start = null;
    } else if (role === "end") {
      end = null;
    } else if (role === "middle" || role === "both") {
      start = null;
      end = null;
    }
    
    updateDaySchedule(day, start, end);
    closeMenu();
  };

  const handleClearSchedule = () => {
    const clearedDays = [0, 1, 2, 3, 4, 5, 6].map((day) => ({
      dayOfWeek: day,
      jamMasuk: null,
      jamPulang: null,
    }));
    onChange({ days: clearedDays });
    closeMenu();
  };

  // Get current position of the red time indicator
  const getRedLinePosition = () => {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    return (hours + minutes / 60) * 60;
  };

  const hoursArray = Array.from({ length: 24 }, (_, i) => i);
  const tzLabel = "GMT+07";

  return (
    <div className="flex flex-col h-[750px] bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden select-none relative">
      {/* Calendar Controls/Navigation */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <CalendarDays className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">
            {getMonthYearLabel(currentDate)}
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
            <button
            onClick={handleClearSchedule}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-100 active:scale-95 transition-all"
          >
            {lang.text('clear')}
          </button>
          <button
            onClick={handleToday}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-100 active:scale-95 transition-all"
          >
            Hari Ini
          </button>
          
          <div className="flex items-center rounded-lg border border-slate-100 bg-slate-50 p-0.5">
            <button
              onClick={handlePrevWeek}
              className="p-1 rounded-md hover:bg-white text-slate-600 hover:text-slate-900 active:scale-90 transition-all"
              title="Minggu Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextWeek}
              className="p-1 rounded-md hover:bg-white text-slate-600 hover:text-slate-900 active:scale-90 transition-all"
              title="Minggu Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Header Columns */}
      <div className="flex border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
        {/* Timezone header cell */}
        <div className="w-20 flex-shrink-0 flex flex-col items-center justify-center border-r border-slate-100 text-[10px] font-bold text-slate-400 py-4">
          <Clock className="w-3.5 h-3.5 mb-1 text-slate-400" />
          {tzLabel}
        </div>
        
        {/* Day header cells */}
        <div className="flex-1 grid grid-cols-7">
          {weekDates.map((date, idx) => {
            const today = isToday(date);
            return (
              <div
                key={idx}
                className="flex flex-col items-center justify-center py-2.5 border-r border-slate-100 last:border-r-0"
              >
                <span className={`text-[10px] font-bold tracking-wider uppercase ${
                  today ? "text-blue-600" : "text-slate-400"
                }`}>
                  {DAY_NAMES[idx]}
                </span>
                <span className={`text-base font-bold mt-1 w-9 h-9 flex items-center justify-center rounded-full transition-colors ${
                  today 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-100" 
                    : "text-slate-700"
                }`}>
                  {date.getDate()}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scrollable grid area */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto relative bg-white"
        style={{ scrollBehavior: "smooth" }}
      >
        <div className="flex relative min-h-[1440px]">
          {/* Left sticky/scrollable hours column */}
          <div className="w-20 flex-shrink-0 relative border-r border-slate-100 bg-white z-10">
            {hoursArray.slice(1).map((h) => (
              <span
                key={h}
                className="absolute right-2.5 text-[10px] font-bold text-slate-400/80 -translate-y-1/2 select-none"
                style={{ top: `${h * 60}px` }}
              >
                {formatHour(h)}
              </span>
            ))}
          </div>

          {/* Right grid cells columns */}
          <div className="flex-1 relative grid grid-cols-7 h-[1440px]">
            {/* Horizontal grid lines */}
            {hoursArray.map((h) => (
              <div
                key={h}
                className="absolute left-0 right-0 border-b border-slate-100 pointer-events-none"
                style={{ top: `${h * 60}px`, height: "1px" }}
              />
            ))}

            {/* Columns content */}
            {weekDates.map((date, dayIdx) => {
              const today = isToday(date);

              return (
                <div 
                  key={dayIdx} 
                  className="relative h-full border-r border-slate-100 last:border-r-0 bg-slate-50/5"
                >
                  {/* Clickable transparent hour slots and schedules rendered in place */}
                  {hoursArray.map((h) => {
                    const role = getCellRole(dayIdx, h);
                    const daySched = schedule.days?.find((d) => d.dayOfWeek === dayIdx) || { dayOfWeek: dayIdx, jamMasuk: null, jamPulang: null };
                    const start = parseHourString(daySched.jamMasuk);
                    const end = parseHourString(daySched.jamPulang);
                        
                    return (
                      <div
                        key={h}
                        className="absolute left-0 right-0 z-0"
                        style={{ top: `${h * 60}px`, height: "60px" }}
                      >
                        {/* Cell click overlay (unassigned slot) */}
                        {role === null && (
                          <div
                            onClick={(e) => handleCellClick(e, dayIdx, h, null)}
                            className="w-full h-full cursor-pointer hover:bg-blue-50/30 active:bg-blue-50/60 transition-colors"
                          />
                        )}
                        
                        {/* Combined Start/End (Both) hour card for 1-hour slots */}
                        {role === "both" && start !== null && end !== null && (
                          <div
                            onClick={(e) => handleCellClick(e, dayIdx, h, "middle")}
                            className="absolute inset-x-1 inset-y-0.5 rounded-xl border-l-[4px] border-blue-500 bg-gradient-to-r from-blue-50/95 to-indigo-50/90 hover:from-blue-100 hover:to-indigo-100 shadow-sm p-1.5 cursor-pointer transition-all flex flex-col justify-center overflow-hidden z-10 hover:shadow select-none border-t border-b border-r border-blue-200/50"
                          >
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[7px] font-bold text-emerald-600 tracking-wide uppercase leading-none">
                                Mulai: {formatHour(start)}
                              </span>
                              <span className="text-[7px] font-bold text-amber-600 tracking-wide uppercase leading-none mt-1">
                                Selesai: {formatHour(end)}
                              </span>
                            </div>
                          </div>
                        )}
                        
                        {/* Start hour card */}
                        {role === "start" && start !== null && (() => {
                          const isSingle = end === null;
                          const endSlot = end !== null ? end - 1 : null;
                          const isTop = !isSingle && endSlot !== null && start < endSlot;
                          const cardClass = isSingle
                            ? "absolute inset-x-1 inset-y-0.5 rounded-xl border-l-[4px] border-emerald-500 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 shadow-sm p-1.5 cursor-pointer transition-all flex flex-col justify-center overflow-hidden z-10 hover:shadow select-none border-t border-b border-r border-emerald-200/50"
                            : isTop
                              ? "absolute inset-x-1 bottom-0 top-0 rounded-t-xl border-l-[4px] border-blue-500 bg-gradient-to-r from-blue-50/95 to-indigo-50/90 hover:from-blue-100 hover:to-indigo-100 shadow-sm p-1.5 cursor-pointer transition-all flex flex-col justify-center overflow-hidden z-10 hover:shadow select-none border-t border-r border-blue-200/40"
                              : "absolute inset-x-1 bottom-0 top-0 rounded-b-xl border-l-[4px] border-blue-500 bg-gradient-to-r from-blue-50/95 to-indigo-50/90 hover:from-blue-100 hover:to-indigo-100 shadow-sm p-1.5 cursor-pointer transition-all flex flex-col justify-center overflow-hidden z-10 hover:shadow select-none border-b border-r border-blue-200/40";
                          const labelClass = isSingle
                            ? "text-[8px] font-bold text-emerald-800 tracking-wide uppercase"
                            : "text-[8px] font-bold text-emerald-600 tracking-wide uppercase";
                          const timeClass = isSingle
                            ? "text-[10px] text-emerald-600 font-bold mt-0.5 leading-none"
                            : "text-[10px] text-blue-600 font-bold mt-0.5 leading-none";

                          return (
                            <div
                              onClick={(e) => handleCellClick(e, dayIdx, h, "start")}
                              className={cardClass}
                            >
                              <span className={labelClass}>
                                Mulai (Start)
                              </span>
                              <span className={timeClass}>
                                {formatHour(start)}
                              </span>
                            </div>
                          );
                        })()}

                        {/* End hour card */}
                        {role === "end" && end !== null && (() => {
                          const isSingle = start === null;
                          const endSlot = end - 1;
                          const isTop = !isSingle && endSlot < start;
                          const cardClass = isSingle
                            ? "absolute inset-x-1 inset-y-0.5 rounded-xl border-l-[4px] border-amber-500 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 shadow-sm p-1.5 cursor-pointer transition-all flex flex-col justify-center overflow-hidden z-10 hover:shadow select-none border-t border-b border-r border-amber-200/50"
                            : isTop
                              ? "absolute inset-x-1 bottom-0 top-0 rounded-t-xl border-l-[4px] border-blue-500 bg-gradient-to-r from-blue-50/95 to-indigo-50/90 hover:from-blue-100 hover:to-indigo-100 shadow-sm p-1.5 cursor-pointer transition-all flex flex-col justify-center overflow-hidden z-10 hover:shadow select-none border-t border-r border-blue-200/40"
                              : "absolute inset-x-1 bottom-0 top-0 rounded-b-xl border-l-[4px] border-blue-500 bg-gradient-to-r from-blue-50/95 to-indigo-50/90 hover:from-blue-100 hover:to-indigo-100 shadow-sm p-1.5 cursor-pointer transition-all flex flex-col justify-center overflow-hidden z-10 hover:shadow select-none border-b border-r border-blue-200/40";
                          const labelClass = isSingle
                            ? "text-[8px] font-bold text-amber-800 tracking-wide uppercase"
                            : "text-[8px] font-bold text-amber-600 tracking-wide uppercase";
                          const timeClass = isSingle
                            ? "text-[10px] text-amber-600 font-bold mt-0.5 leading-none"
                            : "text-[10px] text-blue-600 font-bold mt-0.5 leading-none";

                          return (
                            <div
                              onClick={(e) => handleCellClick(e, dayIdx, h, "end")}
                              className={cardClass}
                            >
                              <span className={labelClass}>
                                Selesai (End)
                              </span>
                              <span className={timeClass}>
                                {formatHour(end)}
                              </span>
                            </div>
                          );
                        })()}

                        {/* Middle hour cell */}
                        {role === "middle" && (
                          <div
                            onClick={(e) => handleCellClick(e, dayIdx, h, "middle")}
                            className="absolute inset-x-1 bottom-0 top-0 border-l-[4px] border-blue-500 border-r border-blue-200/30 bg-gradient-to-r from-blue-50/95 to-indigo-50/90 hover:from-blue-100 hover:to-indigo-100 p-1.5 cursor-pointer transition-all flex flex-col justify-center items-center select-none z-10"
                          >
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Red time line indicator inside current day column */}
                  {today && (
                    <div
                      className="absolute left-0 right-0 flex items-center z-20 pointer-events-none"
                      style={{ top: `${getRedLinePosition()}px` }}
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500 -ml-[5px] shadow-sm ring-2 ring-white" />
                      <div className="flex-1 h-[2px] bg-red-500" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Action Menu (Context Popover) */}
      {menuState.visible && (
        <div
          className="fixed bg-white/95 backdrop-blur-md border border-slate-100 shadow-xl rounded-xl p-1.5 min-w-[170px] z-[9999] animate-in fade-in zoom-in-95 duration-100 pointer-events-auto"
          style={{
            top: `${Math.min(window.innerHeight - 200, menuState.y)}px`,
            left: `${Math.min(window.innerWidth - 190, menuState.x)}px`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* <div className="px-3 py-1.5 border-b border-slate-100/60 mb-1 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
              Slot: {menuState.hour !== null ? formatHour(menuState.hour) : ""}
            </span>
            <button 
              onClick={closeMenu}
              className="p-0.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3 h-3" />
            </button>
          </div> */}
<div className="px-3 py-1.5 border-b border-slate-100/60 mb-1 flex items-center justify-between">
  <span className="text-[10px] font-bold text-slate-400">
    {menuState.hour !== null ? formatHour(menuState.hour) : ""}
  </span>
  <button 
              onClick={closeMenu}
              className="p-0.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          
          {menuState.assignedRole === null ? (
            <div className="flex flex-col gap-0.5">
<button
  onClick={setStartHour}
  className="w-full text-left px-3 py-2 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors flex items-start gap-2"
>
  <Play className="w-3.5 h-3.5 text-blue-500 mt-0.5" />

  <div className="flex flex-col">
    <span className="text-xs font-semibold">
      Atur Jam Mulai
    </span>

    <span className="text-[10px] text-slate-500">
      {menuState.hour !== null ? formatHour(menuState.hour) : "-"}
    </span>
  </div>
</button>
<button
  onClick={setEndHour}
  className="w-full text-left px-3 py-2 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors flex items-start gap-2"
>
  <Clock className="w-3.5 h-3.5 text-indigo-500 mt-0.5" />

  <div className="flex flex-col">
    <span className="text-xs font-semibold">
      Atur Jam Selesai
    </span>

    <span className="text-[10px] text-slate-500">
      {menuState.hour !== null
        ? formatHour((menuState.hour + 1) % 24)
        : "-"}
    </span>
  </div>
</button>
              <button
                onClick={closeMenu}
                className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2 border-t border-slate-50/50 mt-1 pt-1.5"
              >
                <X className="w-3.5 h-3.5 text-slate-400" />
                Batal
              </button>
            </div>
          ) : menuState.assignedRole === "middle" ? (
            <div className="flex flex-col gap-0.5">
              <button
                onClick={setStartHour}
                className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <Play className="w-3.5 h-3.5 text-blue-500" />
                Atur Jam Mulai
              </button>
              <button
                onClick={setEndHour}
                className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                Atur Jam Selesai
              </button>
              <button
                onClick={removeHour}
                className="w-full text-left px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2 border-t border-slate-100/60 mt-1 pt-1.5"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-500" />
                Hapus Jadwal
              </button>
              <button
                onClick={closeMenu}
                className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2"
              >
                <X className="w-3.5 h-3.5 text-slate-400" />
                Batal
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-0.5">
              <button
                onClick={removeHour}
                className="w-full text-left px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-500" />
                Hapus
              </button>
              <button
                onClick={closeMenu}
                className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2"
              >
                <X className="w-3.5 h-3.5 text-slate-400" />
                Batal
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

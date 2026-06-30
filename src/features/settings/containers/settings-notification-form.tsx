/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/core/libs";

import { dayjs, lang } from "@/core/libs";
import { useAlert, useParamDecode } from "@/features/_global/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { settingsSchema, settingsSchemaNew } from "../utils/form-schema";
import CustomSwitch from "@/core/libs/shadcn/components/ui/customSwitch";
import { useSettings } from "../hooks/use-settings-creation";

export const SettingsNotificationForm = () => {
  const { decodeParams } = useParamDecode();

  const navigate = useNavigate();
  const alert = useAlert();

  /*
  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    mode: "all",
    values: {
        studentAttendanceNotification: false,
        teacherAttendanceNotification: false,
        parentAttendanceNotification: false,
        courseAttendanceNotification: false,
        extracurricularAttendanceNotification: false,
    }
  })

  return(
    <Form {...form}>
        <form onSubmit={()=> console.log("Form: ", form)}  className= "mb-8">
            <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-sm p-6 max-w-lg">
                <div className="grid gap-6">
                <FormField
                    control={form.control}
                    name="studentAttendanceNotification"
                    render={({field, fieldState}) => {
                        return (
                            <FormItem className="w-full">
                                <div className="flex flex-row items-center justify-between w-full">
                                    <FormLabel>{lang.text("studentAttendanceNotification")}</FormLabel>
                                    <FormControl>
                                        <CustomSwitch
                                            checked={field.value}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.checked)}
                                        />
                                    </FormControl>
                                </div>
                                <FormMessage>{fieldState.error?.message}</FormMessage>
                            </FormItem>
                        )
                    }}
                />
                <FormField
                    control={form.control}
                    name="teacherAttendanceNotification"
                    render={({field, fieldState}) => {
                        return (
                            <FormItem className="w-full">
                                <div className="flex flex-row items-center justify-between w-full">
                                    <FormLabel>{lang.text("teacherAttendanceNotification")}</FormLabel>
                                    <FormControl>
                                        <CustomSwitch
                                            checked={field.value}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.checked)}
                                        />
                                    </FormControl>
                                </div>
                                <FormMessage>{fieldState.error?.message}</FormMessage>
                            </FormItem>
                        )
                    }}
                />
                <FormField
                    control={form.control}
                    name="parentAttendanceNotification"
                    render={({field, fieldState}) => {
                        return (
                            <FormItem className="w-full">
                                <div className="flex flex-row items-center justify-between w-full">
                                    <FormLabel>{lang.text("parentAttendanceNotification")}</FormLabel>
                                    <FormControl>
                                        <CustomSwitch
                                            checked={field.value}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.checked)}
                                        />
                                    </FormControl>
                                </div>
                                <FormMessage>{fieldState.error?.message}</FormMessage>
                            </FormItem>
                        )
                    }}
                />
                <FormField
                    control={form.control}
                    name="courseAttendanceNotification"
                    render={({field, fieldState}) => {
                        return (
                            <FormItem className="w-full">
                                <div className="flex flex-row items-center justify-between w-full">
                                    <FormLabel>{lang.text("courseAttendanceNotification")}</FormLabel>
                                    <FormControl>
                                        <CustomSwitch
                                            checked={field.value}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.checked)}
                                        />
                                    </FormControl>
                                </div>
                                <FormMessage>{fieldState.error?.message}</FormMessage>
                            </FormItem>
                        )
                    }}
                />
                <FormField
                    control={form.control}
                    name="extracurricularAttendanceNotification"
                    render={({field, fieldState}) => {
                        return (
                            <FormItem className="w-full">
                                <div className="flex flex-row items-center justify-between w-full">
                                    <FormLabel>{lang.text("extracurricularAttendanceNotification")}</FormLabel>
                                    <FormControl>
                                        <CustomSwitch
                                            checked={field.value}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.checked)}
                                        />
                                    </FormControl>
                                </div>
                                <FormMessage>{fieldState.error?.message}</FormMessage>
                            </FormItem>
                        )
                    }}
                />
                </div>

                <div className="flex justify-start mt-6 pt-6 border-t border-slate-100 dark:border-zinc-800">
                    <Button type="submit">{lang.text("save")}</Button>
                </div>
            </div>
        </form>
    </Form>
  )
  */

  const { data: settingsData, isLoading, update } = useSettings();

  const form = useForm<z.infer<typeof settingsSchemaNew>>({
    resolver: zodResolver(settingsSchemaNew),
    mode: "all",
    values: {
      attendanceSiswa: settingsData?.attendanceSiswa ?? false,
      attendanceOrangTua: settingsData?.attendanceOrangTua ?? false,
      attendanceMapelSiswa: settingsData?.attendanceMapelSiswa ?? false,
      attendanceMapelOrangTua: settingsData?.attendanceMapelOrangTua ?? false,
      ekskulOrangTua: settingsData?.ekskulOrangTua ?? false,
      ekskulSiswa: settingsData?.ekskulSiswa ?? false,
    },
  });

  const onSubmit = async (values: z.infer<typeof settingsSchemaNew>) => {
    try {
      await update(values);
      alert.success(
        lang.text("updateSettingSuccess") || "Pengaturan berhasil diperbarui",
      );
    } catch (err: any) {
      alert.error(
        err?.message ||
          lang.text("failUpdateSetting") ||
          "Gagal memperbarui pengaturan",
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8">
        <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-sm p-6 max-w-lg">
          <div className="grid gap-6">
            {/* Section 1: Notifikasi Absensi Harian */}
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-zinc-100 mb-4">
                {lang.text("dailyAttendanceNotification")}
              </h3>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="attendanceSiswa"
                  render={({ field, fieldState }) => (
                    <FormItem className="w-full">
                      <div className="flex flex-row items-center justify-between w-full">
                        <FormLabel className="text-sm font-normal text-slate-600 dark:text-zinc-400">
                          {lang.text("student")}
                        </FormLabel>
                        <FormControl>
                          <CustomSwitch
                            checked={field.value}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) => field.onChange(e.target.checked)}
                          />
                        </FormControl>
                      </div>
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="attendanceOrangTua"
                  render={({ field, fieldState }) => (
                    <FormItem className="w-full">
                      <div className="flex flex-row items-center justify-between w-full">
                        <FormLabel className="text-sm font-normal text-slate-600 dark:text-zinc-400">
                          {lang.text("parent")}
                        </FormLabel>
                        <FormControl>
                          <CustomSwitch
                            checked={field.value}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) => field.onChange(e.target.checked)}
                          />
                        </FormControl>
                      </div>
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100 dark:border-zinc-800" />

            {/* Section 2: Notifikasi Absensi Mata Pelajaran */}
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-zinc-100 mb-4">
                {lang.text("courseAttendanceNotification")}
              </h3>

              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="attendanceMapelSiswa"
                  render={({ field, fieldState }) => (
                    <FormItem className="w-full">
                      <div className="flex flex-row items-center justify-between w-full">
                        <FormLabel className="text-sm font-normal text-slate-600 dark:text-zinc-400">
                          {lang.text("student")}
                        </FormLabel>
                        <FormControl>
                          <CustomSwitch
                            checked={field.value}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) => field.onChange(e.target.checked)}
                          />
                        </FormControl>
                      </div>
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="attendanceMapelOrangTua"
                  render={({ field, fieldState }) => (
                    <FormItem className="w-full">
                      <div className="flex flex-row items-center justify-between w-full">
                        <FormLabel className="text-sm font-normal text-slate-600 dark:text-zinc-400">
                          {lang.text("parent")}
                        </FormLabel>
                        <FormControl>
                          <CustomSwitch
                            checked={field.value}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) => field.onChange(e.target.checked)}
                          />
                        </FormControl>
                      </div>
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100 dark:border-zinc-800" />

            {/* Section 3: Notifikasi Absensi Ekstrakurikuler */}
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-zinc-100 mb-4">
                {lang.text("extracurricularAttendanceNotification")}
              </h3>

              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="ekskulSiswa"
                  render={({ field, fieldState }) => (
                    <FormItem className="w-full">
                      <div className="flex flex-row items-center justify-between w-full">
                        <FormLabel className="text-sm font-normal text-slate-600 dark:text-zinc-400">
                          {lang.text("student")}
                        </FormLabel>
                        <FormControl>
                          <CustomSwitch
                            checked={field.value}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) => field.onChange(e.target.checked)}
                          />
                        </FormControl>
                      </div>
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ekskulOrangTua"
                  render={({ field, fieldState }) => (
                    <FormItem className="w-full">
                      <div className="flex flex-row items-center justify-between w-full">
                        <FormLabel className="text-sm font-normal text-slate-600 dark:text-zinc-400">
                          {lang.text("parent")}
                        </FormLabel>
                        <FormControl>
                          <CustomSwitch
                            checked={field.value}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) => field.onChange(e.target.checked)}
                          />
                        </FormControl>
                      </div>
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-start mt-6 pt-6 border-t border-slate-100 dark:border-zinc-800">
            <Button disabled={isLoading} type="submit">
              {isLoading ? lang.text("saving") : lang.text("save")}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

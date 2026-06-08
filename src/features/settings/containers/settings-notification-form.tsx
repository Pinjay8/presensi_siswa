/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/core/libs";

import { dayjs, lang } from "@/core/libs";
import { useAlert, useParamDecode } from "@/features/_global/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { settingsSchema } from "../utils/form-schema";
import CustomSwitch from "@/core/libs/shadcn/components/ui/customSwitch";

export const SettingsNotificationForm = () => {
  const { decodeParams } = useParamDecode();

  const navigate = useNavigate();
  const alert = useAlert();

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
}
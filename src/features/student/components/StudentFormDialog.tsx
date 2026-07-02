import dayjs from "dayjs";
import {
  Button,
  Calendar,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  lang,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  toast,
} from "@/core/libs";
import { XIcon, CalendarIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Divider,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

interface StudentFormDialogProps {
  open: boolean;
  onClose: () => void;
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  schools: any[];
}

export default function StudentFormDialog({
  open,
  onClose,
  form,
  onSubmit,
  schools,
}: StudentFormDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {lang.text("formStudents")}

        <IconButton onClick={onClose}>
          <XIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{lang.text("studentName")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={lang.text("inputStudentName")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NIS</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nisn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NISN</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="noTlpOrtu"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor Telepon Ortu</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="noTlp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{lang.text("noHP")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="alamat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alamat</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="jenisKelamin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{lang.text("gender")}</FormLabel>

                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Jenis Kelamin" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent className="z-[9999]">
                          <SelectItem value="Male">
                            {lang.text("male")}
                          </SelectItem>
                          <SelectItem value="Female">
                            {lang.text("female")}
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* <FormField
                  control={form.control}
                  name="tanggalLahir"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tanggal Lahir</FormLabel>

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="justify-start text-left font-normal w-full"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />

                            {field.value
                              ? dayjs(field.value).format("DD MMM YYYY")
                              : "Pilih tanggal"}
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-auto p-0 z-[9999]">
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date) =>
                              field.onChange(
                                date ? dayjs(date).format("YYYY-MM-DD") : "",
                              )
                            }
                          />
                        </PopoverContent>
                      </Popover>

                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
                <FormField
                  control={form.control}
                  name="tanggalLahir"
                  render={({ field, fieldState }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel style={{ marginTop: "10px" }}>
                        {lang.text("dateOfBirth")}
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              // disabled
                              variant={"outline"}
                              className=" pl-3 text-left font-normal"
                            >
                              {field.value ? (
                                dayjs(field.value).format("DD MMMM YYYY")
                              ) : (
                                <span>{lang.text("selectDate")}</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-0 z-[9999]"
                          align="start"
                          sideOffset={4}
                        >
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateCalendar
                              value={field.value ? dayjs(field.value) : null}
                              onChange={(newValue) =>
                                field.onChange(
                                  newValue ? newValue.format("YYYY-MM-DD") : "",
                                )
                              }
                              sx={{
                                backgroundColor: "#ffffff", // Background putih
                                color: "#000000", // Teks hitam untuk kontras
                                "& .MuiPickersDay-root": {
                                  color: "#000000", // Teks hari
                                  "&:hover": {
                                    backgroundColor: "#e0e0e0", // Hover effect
                                  },
                                  "&.Mui-selected": {
                                    backgroundColor: "#1976d2", // Warna saat dipilih
                                    color: "#ffffff", // Teks putih saat dipilih
                                  },
                                },
                                "& .MuiPickersCalendarHeader-label": {
                                  color: "#000000", // Teks bulan/tahun
                                },
                                "& .MuiPickersArrowSwitcher-root": {
                                  color: "#000000", // Panah navigasi
                                },
                                "& .MuiDayCalendar-weekDayLabel": {
                                  color: "#000000", // Label hari (Sen, Sel, dst)
                                },
                              }}
                            />
                          </LocalizationProvider>
                        </PopoverContent>
                      </Popover>
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                {/* <FormField
                  control={form.control}
                  name="sekolahId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sekolah</FormLabel>

                      <Select
                        value={field.value?.toString()}
                        onValueChange={(value) => field.onChange(Number(value))}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Sekolah" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent className="z-[9999]">
                          {schools?.map((school) => (
                            <SelectItem
                              key={school.id}
                              value={school.id.toString()}
                            >
                              {school.namaSekolah}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
              </div>

              <Divider sx={{ my: 2 }} />
              <div className="mt-2">
                <Button type="submit">{lang.text("saveChanges")}</Button>
              </div>
            </form>
          </Form>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
